import { Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/security';

// १. सर्व उपलब्ध पेपर्सची यादी मिळवणे (District & Year wise)
export const getPapers = async (req: AuthRequest, res: Response) => {
  try {
    const query = `
      SELECT p.id, p.title, p.total_marks, p.duration_minutes, d.name as district, y.year_value as year
      FROM papers p
      LEFT JOIN districts d ON p.district_id = d.id
      LEFT JOIN years y ON p.year_id = y.id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return res.status(200).json({ success: true, data: rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// २. एका विशिष्ठ पेपरचे सर्व प्रश्न लोड करणे (Exam Start)
export const getPaperQuestions = async (req: AuthRequest, res: Response) => {
  const { paperId } = req.params;

  try {
    const paperQuery = `SELECT * FROM papers WHERE id = $1`;
    const paperRes = await pool.query(paperQuery, [paperId]);

    if (paperRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'प्रश्नपत्रिका सापडली नाही.' });
    }

    // उत्तराचा योग्य पर्याय (correct_option) लपवून प्रश्न पाठवणे
    const qQuery = `
      SELECT id, paper_id, question_text, option_a, option_b, option_c, option_d, marks
      FROM questions
      WHERE paper_id = $1
      ORDER BY id ASC
    `;
    const { rows: questions } = await pool.query(qQuery, [paperId]);

    return res.status(200).json({
      success: true,
      data: {
        paper: paperRes.rows[0],
        questions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ३. परीक्षा सबमिट करणे आणि निकाल/Coins कॅल्क्युलेट करणे (Submit Exam)
export const submitExam = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { paperId, answers, timeTakenSeconds } = req.body;

  if (!paperId || !answers) {
    return res.status(400).json({ success: false, message: 'Paper ID आणि उत्तरे आवश्यक आहेत.' });
  }

  try {
    // मूळ प्रश्नांची उत्तरे डेटाबेस मधून आणणे
    const qQuery = `SELECT id, correct_option, marks FROM questions WHERE paper_id = $1`;
    const { rows: questions } = await pool.query(qQuery, [paperId]);

    let correctCount = 0;
    let wrongCount = 0;
    let totalScore = 0;

    const wrongQuestionsToSave: number[] = [];

    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns) {
        if (userAns === q.correct_option) {
          correctCount++;
          totalScore += Number(q.marks || 1);
        } else {
          wrongCount++;
          wrongQuestionsToSave.push(q.id);
        }
      }
    });

    // १. निकाल डेटाबेसमध्ये सेव्ह करणे
    const resQuery = `
      INSERT INTO results (user_id, paper_id, total_questions, correct_answers, wrong_answers, score, time_taken_seconds)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, score, created_at
    `;
    const { rows: resultRows } = await pool.query(resQuery, [
      userId,
      paperId,
      questions.length,
      correctCount,
      wrongCount,
      totalScore,
      timeTakenSeconds || 0,
    ]);

    // २. चुकलेले प्रश्न Wrong Questions Practice साठी सेव्ह करणे
    if (wrongQuestionsToSave.length > 0) {
      for (const qId of wrongQuestionsToSave) {
        await pool.query(
          `INSERT INTO wrong_questions (user_id, question_id) 
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [userId, qId]
        );
      }
    }

    // ३. गेमफिकेशन (Coins & Leaderboard Update)
    const coinsEarned = totalScore * 2; // १ गुणासाठी २ कॉइन्स
    
    await pool.query(
      `INSERT INTO leaderboard (user_id, total_score, tests_taken) 
       VALUES ($1, $2, 1) 
       ON CONFLICT (user_id) 
       DO UPDATE SET total_score = leaderboard.total_score + $2, tests_taken = leaderboard.tests_taken + 1`,
      [userId, totalScore]
    );

    return res.status(200).json({
      success: true,
      message: 'पेपर यशस्वीरीत्या सबमिट झाला!',
      data: {
        resultId: resultRows[0].id,
        score: totalScore,
        correctCount,
        wrongCount,
        coinsEarned,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};