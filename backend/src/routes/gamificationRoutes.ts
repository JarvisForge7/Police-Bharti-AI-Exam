import { Router } from 'express';
import pool from '../config/db';

const router = Router(); // हे इथे डिफाईन केले आहे

// १. युजरचा Gamification डेटा (Coins, XP, Level, Streaks) मिळवणे
router.get('/user-stats/:userId', async (req, res): Promise<any> => {
  const { userId } = req.params;

  try {
    let result = await pool.query('SELECT * FROM user_gamification WHERE user_id = $1', [userId]);

    // जर युजरचा रेकॉर्ड नसेल तर नवीन एंट्री तयार करणे
    if (result.rows.length === 0) {
      const refCode = 'REF' + Math.floor(100000 + Math.random() * 900000);
      result = await pool.query(
        'INSERT INTO user_gamification (user_id, referral_code) VALUES ($1, $2) RETURNING *',
        [userId, refCode]
      );
    }

    res.json({ success: true, stats: result.rows[0] });
  } catch (error: any) {
    console.error("Stats मिळवताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// २. कॉइन्स आणि XP ॲड करणे (उदा. क्विझ जिंकल्यावर)
router.post('/add-reward', async (req, res): Promise<any> => {
  const { userId, coinsToAdd, xpToAdd } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM user_gamification WHERE user_id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "युजर सापडला नाही" });
    }

    let currentCoins = userResult.rows[0].coins + coinsToAdd;
    let currentXp = userResult.rows[0].xp + xpToAdd;
    let currentLevel = userResult.rows[0].level;

    // लेव्हल अप लॉजिक (प्रत्येक १०० XP वर १ लेव्हल वाढणार)
    const newLevel = Math.floor(currentXp / 100) + 1;

    await pool.query(
      'UPDATE user_gamification SET coins = $1, xp = $2, level = $3 WHERE user_id = $4',
      [currentCoins, currentXp, newLevel, userId]
    );

    res.json({
      success: true,
      message: "रिवॉर्ड यशस्वीरीत्या ॲड झाला!",
      coins: currentCoins,
      xp: currentXp,
      level: newLevel,
      leveledUp: newLevel > currentLevel
    });

  } catch (error: any) {
    console.error("रिवॉर्ड ॲड करताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ३. Daily Login Reward Claim करणे
router.post('/claim-daily-reward', async (req, res): Promise<any> => {
  const { userId } = req.body;

  try {
    const result = await pool.query('SELECT * FROM user_gamification WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "युजर सापडला नाही" });
    }

    const userData = result.rows[0];
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userData.last_login_date ? new Date(userData.last_login_date).toISOString().split('T')[0] : null;

    if (lastLogin === today) {
      return res.json({ success: false, message: "तुम्ही आजचा Daily Reward आधीच Claim केला आहे!" });
    }

    // ५० कॉइन्स बोनस आणि स्ट्रिक +१
    const newCoins = userData.coins + 50;
    const newStreak = userData.streak_days + 1;

    await pool.query(
      'UPDATE user_gamification SET coins = $1, streak_days = $2, last_login_date = $3 WHERE user_id = $4',
      [newCoins, newStreak, today, userId]
    );

    res.json({
      success: true,
      message: "🎉 ५० डेली कॉइन्स क्रेडिट झाले आहेत!",
      coins: newCoins,
      streak: newStreak
    });

  } catch (error: any) {
    console.error("Daily Reward Claim करताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ४. Leaderboard API (टॉप १० युजर्स)
router.get('/leaderboard', async (req, res): Promise<any> => {
  try {
    const result = await pool.query(`
      SELECT user_id, coins, xp, level 
      FROM user_gamification 
      ORDER BY xp DESC, coins DESC 
      LIMIT 10
    `);

    res.json({ success: true, leaderboard: result.rows });
  } catch (error: any) {
    console.error("Leaderboard लोड करताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ५. Referral Code ने मित्र जॉईन झाल्यावर बोनस मिळणे
router.post('/claim-referral', async (req, res): Promise<any> => {
  const { userId, referralCode } = req.body;

  try {
    const referrerResult = await pool.query('SELECT * FROM user_gamification WHERE referral_code = $1', [referralCode]);

    if (referrerResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "अवैध रेफरल कोड!" });
    }

    const referrer = referrerResult.rows[0];

    // रेफर करणाऱ्याला १०० कॉइन्स देणे
    await pool.query('UPDATE user_gamification SET coins = coins + 100 WHERE id = $1', [referrer.id]);

    // नवीन जॉईन झालेल्या युजरला ५० कॉइन्स देणे
    await pool.query('UPDATE user_gamification SET coins = coins + 50 WHERE user_id = $1', [userId]);

    res.json({ success: true, message: "🎉 रेफरल बोनस (५० कॉइन्स) प्राप्त झाला!" });

  } catch (error: any) {
    console.error("Referral Claim करताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
export default router;