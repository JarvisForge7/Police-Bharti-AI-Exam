import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/security';

// १. नवीन विद्यार्थ्याचे रजिस्ट्रेशन (Register User)
export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password, district_id } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'नाव, ईमेल आणि पासवर्ड आवश्यक आहेत.' });
  }

  try {
    // ईमेल आधीच रजिस्टर आहे का ते तपासा
    const userExist = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'हा ईमेल आधीपासून नोंदणीकृत आहे.' });
    }

    // पासवर्ड हॅश (Bcrypt Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // युजर डेटाबेसमध्ये सेव्ह करा
    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, district_id, role)
       VALUES ($1, $2, $3, $4, $5, 'student')
       RETURNING id, full_name, email, role, created_at`,
      [name, email, phone || null, hashedPassword, district_id || null]
    );

    const user = newUser.rows[0];

    // JWT टोकन जनरेट करा
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'खाते यशस्वीरीत्या तयार झाले!',
      data: { user, token },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// २. लॉगिन (Login User)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'ईमेल आणि पासवर्ड दोन्ही आवश्यक आहेत.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'ईमेल किंवा पासवर्ड चुकीचा आहे.' });
    }

    const user = result.rows[0];

    // पासवर्ड तपासा
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'ईमेल किंवा पासवर्ड चुकीचा आहे.' });
    }

    // JWT टोकन जनरेट करा
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    delete user.password_hash; // पासवर्ड हॅश रिस्पॉन्सधून हटवा

    return res.status(200).json({
      success: true,
      message: 'लॉगिन यशस्वी झाले!',
      data: { user, token },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ३. युजर प्रोफाईल माहिती मिळवणे (Get Profile)
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.created_at, d.name as district
       FROM users u
       LEFT JOIN districts d ON u.district_id = d.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'युजर सापडला नाही.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};