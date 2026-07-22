import { Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/security';

// १. AI Teacher - प्रश्नाचे सविस्तर स्पष्टीकरण देणे (AI Explanation Engine)
export const getAiExplanation = async (req: AuthRequest, res: Response) => {
  const { questionId } = req.body;

  if (!questionId) {
    return res.status(400).json({ success: false, message: 'Question ID आवश्यक आहे.' });
  }

  try {
    const qQuery = `SELECT question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE id = $1`;
    const { rows } = await pool.query(qQuery, [questionId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'प्रश्न सापडला नाही.' });
    }

    const question = rows[0];

    // AI Explanation Response (Smart Logic)
    const explanation = `
      📌 **प्रश्नाचे विश्लेषण:**
      ${question.question_text}

      ✅ **योग्य उत्तर:** पर्याय (${question.correct_option})

      💡 **स्पष्टीकरण (AI Teacher Notes):**
      या प्रश्नाचे उत्तर पर्याय (${question.correct_option}) हे योग्य आहे. पोलीस भरती व इतर स्पर्धा परीक्षांच्या दृष्टीने हा अत्यंत महत्त्वाचा घटक आहे. या संकल्पनेविषयी अधिक माहितीसाठी चालू घडामोडी आणि सामान्य ज्ञान (GK) चे नियमित वाचन करा.
    `;

    return res.status(200).json({
      success: true,
      data: {
        questionId,
        explanation: explanation.trim(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// २. लीडरबोर्ड (Top Rankers & Gamification)
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const query = `
      SELECT l.user_id, u.full_name, d.name as district, l.total_score, l.tests_taken,
             ROW_NUMBER() OVER (ORDER BY l.total_score DESC) as rank
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN districts d ON u.district_id = d.id
      ORDER BY l.total_score DESC
      LIMIT 50
    `;
    const { rows } = await pool.query(query);
    return res.status(200).json({ success: true, data: rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ३. युजर परफॉर्मन्स आणि ॲनालिटिक्स डॅशबोर्ड (User Analytics Dashboard)
export const getUserAnalytics = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    // एकूण टेस्ट, सरासरी गुण आणि एकूण वेळ
    const statsQuery = `
      SELECT 
        COUNT(id) as total_tests,
        COALESCE(AVG(score), 0) as avg_score,
        COALESCE(SUM(correct_answers), 0) as total_correct,
        COALESCE(SUM(wrong_answers), 0) as total_wrong,
        COALESCE(SUM(time_taken_seconds), 0) as total_time_seconds
      FROM results
      WHERE user_id = $1
    `;
    const { rows: stats } = await pool.query(statsQuery, [userId]);

    // अलीकडील ५ टेस्टचे निकाल (Recent Results)
    const recentQuery = `
      SELECT r.id, p.title as paper_title, r.score, r.total_questions, r.correct_answers, r.created_at
      FROM results r
      JOIN papers p ON r.paper_id = p.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT 5
    `;
    const { rows: recentTests } = await pool.query(recentQuery, [userId]);

    return res.status(200).json({
      success: true,
      data: {
        summary: stats[0],
        recentTests,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};