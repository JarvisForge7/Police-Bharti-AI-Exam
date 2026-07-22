import { Router } from 'express';
import pool from '../config/db';

const router = Router();

// 1. QUICK STATS (डॅशबोर्डच्या मुख्य स्क्रीनसाठी आकड्यांचे विश्लेषण)
router.get('/stats', async (req, res) => {
  try {
    const studentsCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const questionsCount = await pool.query("SELECT COUNT(*) FROM questions");
    const revenueSum = await pool.query("SELECT SUM(amount) FROM payments WHERE status = 'success'");
    const activeTests = await pool.query("SELECT COUNT(*) FROM mock_tests");

    res.json({
      success: true,
      data: {
        total_students: studentsCount.rows[0].count,
        total_questions: questionsCount.rows[0].count,
        total_revenue: revenueSum.rows[0].sum || 0,
        active_tests: activeTests.rows[0].count
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET ALL STUDENTS (विद्यार्थी यादी)
router.get('/students', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, phone, district, is_premium, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC");
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. ADD NOTIFICATION (नवीन नोटीफिकेशन पाठवणे)
router.post('/notifications', async (req, res) => {
  const { title, message, target_group } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notifications (title, message, target_group) VALUES ($1, $2, $3) RETURNING *",
      [title, message, target_group]
    );
    res.json({ success: true, data: result.rows[0], message: "नोटीफिकेशन यशस्वीरित्या पाठवले!" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. SYSTEM LOGS FETCH (लॉग्स पाहणे)
router.get('/logs', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 100");
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. ADD NEW QUESTION WITH AI ANALYSIS (नवीन प्रश्न आणि AI विश्लेषण जोडणे - FINAL FIXED 🎯)
router.post('/questions/add', async (req, res): Promise<any> => {
  const { 
    question_text, 
    options, 
    correct_option_index, 
    ai_analysis 
  } = req.body;

  try {
    // ⚡ इथे आता फक्त तेच कॉलम्स ठेवलेत जे तुमच्याquestions टेबलमध्ये १००% उपलब्ध आहेत
    const queryText = `
      INSERT INTO questions (question_text, options, correct_option_index, ai_analysis)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      question_text, 
      options, 
      correct_option_index, 
      JSON.stringify(ai_analysis)
    ];

    const result = await pool.query(queryText, values);
    
    res.json({ 
      success: true, 
      message: "🎯 नवीन प्रश्न आणि AI विश्लेषण यशस्वीरित्या जोडले गेले!", 
      data: result.rows[0] 
    });
  } catch (error: any) {
    console.error("प्रश्न जोडताना एरर आली:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;