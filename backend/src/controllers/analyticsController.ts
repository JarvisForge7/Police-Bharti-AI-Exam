import { Request, Response } from 'express';
import pool from '../config/db'; // आपण आधी कनेक्ट केलेला pool

export const saveTestResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_id,
      test_id,
      total_marks,
      correct_count,
      wrong_count,
      skipped_count,
      total_time_taken,
      subject_analysis,
      topic_analysis
    } = req.body;

    // १. Average Time Per Question काढणे (एकूण वेळ / एकूण सोडवलेले प्रश्न)
    const total_attempted = correct_count + wrong_count;
    const average_time_per_question = total_attempted > 0 
      ? (total_time_taken / total_attempted).toFixed(2) 
      : 0.00;

    // २. डेटाबेसमध्ये डेटा इन्सर्ट (Insert) करण्याची क्वेरी
    const queryText = `
      INSERT INTO public.test_attempts 
      (user_id, test_id, total_marks, correct_count, wrong_count, skipped_count, total_time_taken, average_time_per_question, subject_analysis, topic_analysis)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      user_id,
      test_id,
      total_marks,
      correct_count,
      wrong_count,
      skipped_count,
      total_time_taken,
      average_time_per_question,
      JSON.stringify(subject_analysis), // JSONB साठी स्ट्रिंगमध्ये कन्व्हर्ट केले
      JSON.stringify(topic_analysis)
    ];

    const result = await pool.query(queryText, values);

    // ३. रिस्पॉन्स पाठवणे
    res.status(201).json({
      success: true,
      message: '📊 Analytics data saved successfully!',
      data: result.rows[0]
    });

  } catch (error: any) {
    console.error('❌ Analytics Error:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};// हे नवीन फंक्शन त्याच फाईलमध्ये खाली ॲड करा
export const getUserTestAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, test_id } = req.params;

    // १. विद्यार्थ्याची रँक आणि पर्सेंटाईल काढण्यासाठीची प्रगत SQL क्वेरी
    const queryText = `
      WITH ranked_attempts AS (
        SELECT 
          id,
          user_id,
          test_id,
          total_marks,
          correct_count,
          wrong_count,
          skipped_count,
          total_time_taken,
          average_time_per_question,
          subject_analysis,
          topic_analysis,
          RANK() OVER (PARTITION BY test_id ORDER BY total_marks DESC, total_time_taken ASC) as student_rank,
          COUNT(*) OVER (PARTITION BY test_id) as total_students
        FROM public.test_attempts
        WHERE test_id = $1
      )
      SELECT * FROM ranked_attempts WHERE user_id = $2 ORDER BY id DESC LIMIT 1;
    `;

    const result = await pool.query(queryText, [test_id, user_id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'रिझल्ट सापडला नाही!' });
      return;
    }

    const report = result.rows[0];
    
    // २. Percentile चे सूत्र (कॅल्क्युलेशन)
    const totalStudents = parseInt(report.total_students);
    const studentRank = parseInt(report.student_rank);
    
    // सूत्र: ((एकूण विद्यार्थी - तुमची रँक) / एकूण विद्यार्थी) * १००
    const percentile = totalStudents > 1 
      ? (((totalStudents - studentRank) / totalStudents) * 100).toFixed(2)
      : "100.00";

    // ३. Accuracy (अचूकता) काढणे
    const totalAttempted = parseInt(report.correct_count) + parseInt(report.wrong_count);
    const accuracy = totalAttempted > 0 
      ? ((parseInt(report.correct_count) / totalAttempted) * 100).toFixed(2)
      : "0.00";

    res.status(200).json({
      success: true,
      data: {
        marks: report.total_marks,
        rank: studentRank,
        total_students: totalStudents,
        percentile: percentile,
        accuracy: accuracy,
        speed: report.average_time_per_question,
        time_taken: report.total_time_taken,
        correct: report.correct_count,
        wrong: report.wrong_count,
        skipped: report.skipped_count,
        subject_wise: report.subject_analysis,
        topic_wise: report.topic_analysis
      }
    });

  } catch (error: any) {
    console.error('❌ Fetch Analytics Error:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};