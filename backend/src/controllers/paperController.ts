import { Request, Response } from 'express';
// तुमच्या db connection पूलचा पाथ इथे बरोबर द्या (उदा. import pool from '../config/db' किंवा जिथे db.ts असेल तिथे)
// जुनी लाईन बदलून ही नवीन लाईन टाका:
import pool from '../config/db'; 

// १. नवीन टेस्ट सुरू करणे किंवा जुनी रिझ्युम करणे (Start or Resume)
export const startOrResumeTest = async (req: Request, res: Response): Promise<any> => {
  const { paperId, userId } = req.body;

  try {
    // अ) आधीच प्रोग्रेस आहे का ते चेक करा (Resume Feature)
    const existingProgress = await pool.query(
      'SELECT * FROM user_progress WHERE paper_id = $1 AND user_id = $2 AND is_submitted = false',
      [paperId, userId]
    );

    if (existingProgress.rows.length > 0) {
      return res.json({
        message: "जुनी टेस्ट रिझ्युम केली जात आहे...",
        progressId: existingProgress.rows[0].id,
        resume: true,
        progressData: existingProgress.rows[0]
      });
    }

    // ब) नवीन टेस्ट असेल तर पेपरचे डिटेल्स आणा
    const paper = await pool.query('SELECT * FROM papers WHERE id = $1', [paperId]);
    if (paper.rows.length === 0) return res.status(404).json({ message: "पेपर सापडला नाही" });

    // क) पेपरला जोडलेले प्रश्न आणा
    const mapping = await pool.query(
      'SELECT question_id FROM paper_questions WHERE paper_id = $1',
      [paperId]
    );
    
    let questionIds = mapping.rows.map((m: any) => m.question_id);

    // ड) रँडम प्रश्न ऑर्डर लॉजिक (Random Question Order)
    for (let i = questionIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionIds[i], questionIds[j]] = [questionIds[j], questionIds[i]];
    }

    // इ) डीफॉल्ट आन्सर पॅलेट रचना (Question Palette)
    const defaultAnswers = JSON.stringify(questionIds.map(qId => ({
      questionId: qId,
      selectedOption: null,
      status: 'Skipped',
      isBookmarked: false
    })));

    // फ) डेटाबेसमध्ये नवीन प्रोग्रेस इन्सर्ट करा
    const newProgress = await pool.query(
      `INSERT INTO user_progress (user_id, paper_id, time_left_seconds, questions_order, answers, is_submitted)
       VALUES ($1, $2, $3, $4, $5, false) RETURNING *`,
      [userId, paperId, paper.rows[0].time_limit_minutes * 60, questionIds, defaultAnswers]
    );

    res.json({
      message: "नवीन टेस्ट सुरू झाली!",
      progressId: newProgress.rows[0].id,
      totalQuestions: paper.rows[0].total_questions
    });

  } catch (error: any) {
    res.status(500).json({ message: "सर्व्हर एरर", error: error.message });
  }
};

// २. प्रोग्रेस सेव्ह करणे (Save Progress / Next / Bookmark)
export const saveQuestionProgress = async (req: Request, res: Response): Promise<any> => {
  const { progressId, questionId, selectedOption, status, isBookmarked, timeLeftSeconds } = req.body;

  try {
    const progress = await pool.query('SELECT * FROM user_progress WHERE id = $1', [progressId]);
    if (progress.rows.length === 0 || progress.rows[0].is_submitted) {
      return res.status(400).json({ message: "अवैध किंवा आधीच सबमिट झालेली टेस्ट" });
    }

    let answersList = progress.rows[0].answers || [];
    const index = answersList.findIndex((a: any) => a.questionId === questionId);

    if (index !== -1) {
      if (selectedOption !== undefined) answersList[index].selectedOption = selectedOption;
      if (status) answersList[index].status = status;
      if (isBookmarked !== undefined) answersList[index].isBookmarked = isBookmarked;
    }

    await pool.query(
      'UPDATE user_progress SET answers = $1, time_left_seconds = $2, updated_at = NOW() WHERE id = $3',
      [JSON.stringify(answersList), timeLeftSeconds, progressId]
    );

    res.json({ success: true, message: "प्रगती सेव्ह झाली!" });
  } catch (error: any) {
    res.status(500).json({ message: "डेटा सेव्ह करताना एरर", error: error.message });
  }
};

// ३. टेस्ट सबमिट करणे (Auto-Submit / Negative Marking)
export const submitTest = async (req: Request, res: Response): Promise<any> => {
  const { progressId } = req.body;

  try {
    // प्रोग्रेस आणि पेपरचे निगेटिव्ह मार्किंग डिटेल्स आणा
    const progressRes = await pool.query(
      `SELECT up.*, p.negative_marking 
       FROM user_progress up 
       JOIN papers p ON up.paper_id = p.id 
       WHERE up.id = $1`, 
      [progressId]
    );

    if (progressRes.rows.length === 0 || progressRes.rows[0].is_submitted) {
      return res.status(400).json({ message: "पेपर आधीच सबमिट झाला आहे." });
    }

    const progress = progressRes.rows[0];
    const negativeMarkPerWrong = progress.negative_marking || 0.25;

    let correctCount = 0;
    let wrongCount = 0;

    const questionIds = progress.answers.map((a: any) => a.questionId);

    // सर्व प्रश्नांची खरी उत्तरं आणा
    const questionsRes = await pool.query(
      'SELECT id, correct_option_index FROM questions WHERE id = ANY($1)',
      [questionIds]
    );

    const correctAnswersMap: Record<number, number> = {};
    questionsRes.rows.forEach((q: any) => {
      correctAnswersMap[q.id] = q.correct_option_index;
    });

    // गुण मोजणी लॉजिक
    progress.answers.forEach((ans: any) => {
      if (ans.selectedOption !== null && ans.status === 'Answered') {
        const correctIndex = correctAnswersMap[ans.questionId];
        if (correctIndex === ans.selectedOption) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const penalty = wrongCount * negativeMarkPerWrong;
    const finalScore = Math.max(0, correctCount - penalty);

    // निकाल डेटाबेसमध्ये सेव्ह करा
    await pool.query(
      'UPDATE user_progress SET is_submitted = true, final_score = $1, time_left_seconds = 0 WHERE id = $2',
      [finalScore, progressId]
    );

    res.json({
      message: "पेपर यशस्वीरित्या सबमिट झाला! (Auto-Submitted)",
      totalQuestions: progress.answers.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      finalScore: Number(finalScore.toFixed(2))
    });

  } catch (error: any) {
    res.status(500).json({ message: "सबमिशन फेल झाले", error: error.message });
  }
};

// ४. पेपर्स फिल्टर करून लिस्ट मिळवणे (District, Year, Subject, Difficulty Wise)
export const getFilteredPapers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type, district, year, subject } = req.query;
    
    let queryText = 'SELECT id, title, type, district, year, subject, total_questions, time_limit_minutes, negative_marking FROM papers WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (type) {
      queryText += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }
    if (district) {
      queryText += ` AND district = $${paramIndex}`;
      queryParams.push(district);
      paramIndex++;
    }
    if (year) {
      queryText += ` AND year = $${paramIndex}`;
      queryParams.push(Number(year));
      paramIndex++;
    }
    if (subject) {
      queryText += ` AND subject = $${paramIndex}`;
      queryParams.push(subject);
      paramIndex++;
    }

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: "पेपर्सची लिस्ट आणताना एरर आली", error: error.message });
  }
};

// 🤖 ५. MODULE 6: AI Teacher स्पष्टीकरणासह पेपरचे प्रश्न आणि उत्तरे मिळवणे
export const getPaperSolutionWithAI = async (req: Request, res: Response): Promise<any> => {
  const { paperId } = req.params;

  try {
    // पेपरमधील सर्व प्रश्नांचा डेटा आणि आपण SQL द्वारे जोडलेला ai_analysis डेटा आणा
    const queryText = `
      SELECT q.id, q.question_text, q.options, q.correct_option_index, q.ai_analysis 
      FROM questions q
      JOIN paper_questions pq ON q.id = pq.question_id
      WHERE pq.paper_id = $1
      ORDER BY q.id ASC
    `;
    
    const result = await pool.query(queryText, [paperId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "या पेपरसाठी कोणतेही प्रश्न सापडले नाहीत." });
    }

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "AI सोल्यूशन डेटा आणताना एरर आली", error: error.message });
  }
};