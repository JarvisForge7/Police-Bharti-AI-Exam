import { Router } from 'express';
import pool from '../config/db';

const router = Router();

router.post('/search-filter', async (req, res): Promise<any> => {
  const { keyword, district, year, subject, difficulty, topic, count } = req.body;

  try {
    // १. टेबलचे सर्व कॉलम्स मिळवा
    const schema = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'questions'");
    const columns = schema.rows.map(r => r.column_name);

    // २. डायनॅमिक मॅपिंग (डेटाबेसमधील कॉलमचे नाव शोधा)
    const getCol = (names: string[]) => columns.find(c => names.includes(c));
    
    const cDist = getCol(['district', 'dist', 'city']);
    const cYear = getCol(['year', 'exam_year']);
    const cCat = getCol(['category', 'subject', 'sub', 'cat']);
    const cDiff = getCol(['difficulty', 'level', 'diff']);
    const cTopic = getCol(['topic', 'sub_topic']);
    const cQuest = getCol(['question_text', 'question', 'q_text']);

    // ३. डायनॅमिक क्वेरी बिल्डर
    let queryText = 'SELECT * FROM questions WHERE 1=1';
    const queryParams: any[] = [];
    let p = 1;

    if (keyword && cQuest) { queryText += ` AND ${cQuest} ILIKE $${p}`; queryParams.push(`%${keyword}%`); p++; }
    if (district && cDist) { queryText += ` AND ${cDist} = $${p}`; queryParams.push(district); p++; }
    if (year && cYear) { queryText += ` AND ${cYear} = $${p}`; queryParams.push(parseInt(year)); p++; }
    if (subject && cCat) { queryText += ` AND ${cCat} = $${p}`; queryParams.push(subject); p++; }
    if (difficulty && cDiff) { queryText += ` AND ${cDiff} = $${p}`; queryParams.push(difficulty); p++; }
    if (topic && cTopic) { queryText += ` AND ${cTopic} ILIKE $${p}`; queryParams.push(`%${topic}%`); p++; }

    queryText += ` ORDER BY RANDOM() LIMIT $${p}`;
    queryParams.push(count || 10);

    const result = await pool.query(queryText, queryParams);

    // ४. डेटा मॅप करा
    const mappedQuestions = result.rows.map((r: any) => ({
      id: r.id,
      question: r[cQuest || ''],
      options: r.options,
      correctAnswer: r.correct_answer || r.correctAnswer || r.correct_option || r.answer || r.correct_ans || r.correct,
      category: r[cCat || ''],
      difficulty: r[cDiff || ''],
      year: r[cYear || ''],
      district: r[cDist || ''],
      topic: r[cTopic || '']
    }));

    res.json({ success: true, questions: mappedQuestions });

  } catch (error: any) {
    console.error("सर्च एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/suggestions', async (req, res): Promise<any> => {
  const { q } = req.query;
  try {
    const schema = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'questions'");
    const cQuest = schema.rows.find(r => ['question_text', 'question', 'q_text'].includes(r.column_name))?.column_name;
    
    if (!q || !cQuest) return res.json({ suggestions: [] });

    const result = await pool.query(`SELECT DISTINCT ${cQuest} FROM questions WHERE ${cQuest} ILIKE $1 LIMIT 5`, [`%${q}%`]);
    res.json({ suggestions: result.rows.map((r: any) => r[cQuest]) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// १. क्विझ निकाल डेटाबेसमध्ये सेव्ह करण्यासाठी API
router.post('/submit-result', async (req, res): Promise<any> => {
  const { results } = req.body; // array: [{question_id, is_correct, topic, subject}]

  try {
    for (const item of results) {
      await pool.query(
        'INSERT INTO user_performance (question_id, is_correct, topic, subject) VALUES ($1, $2, $3, $4)',
        [item.question_id, item.is_correct, item.topic, item.subject]
      );
    }
    res.json({ success: true, message: "सराव सेव्ह झाला!" });
  } catch (error: any) {
    console.error("सेव्ह करताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// २. 'Analyze Mistakes' (चुकलेल्या प्रश्नांचे विश्लेषण) API
router.get('/analyze-mistakes', async (req, res): Promise<any> => {
  try {
    const result = await pool.query(`
      SELECT subject, topic, COUNT(*) as mistake_count 
      FROM user_performance 
      WHERE is_correct = false 
      GROUP BY subject, topic 
      ORDER BY mistake_count DESC 
      LIMIT 5
    `);
    
    res.json({
      success: true,
      weakTopics: result.rows,
      message: "हे तुमचे कमकुवत विषय आहेत."
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});// ३. 'Generate Revision Plan' API
router.get('/generate-revision-plan', async (req, res): Promise<any> => {
  try {
    // युजरच्या सर्वाधिक चुका झालेले विषय शोधणे
    const weakTopicsResult = await pool.query(`
      SELECT topic, subject, COUNT(*) as mistake_count 
      FROM user_performance 
      WHERE is_correct = false 
      GROUP BY topic, subject 
      ORDER BY mistake_count DESC 
      LIMIT 3
    `);

    const weakTopics = weakTopicsResult.rows;

    // जर अजून एकही चूक झाली नसेल तर डिफॉल्ट प्लॅन
    if (weakTopics.length === 0) {
      return res.json({
        success: true,
        message: "उत्तम! तुमची कोणतीही मोठी चूक झालेली नाही.",
        revisionPlan: [
          { day: "आजचा प्लॅन", focus: "सामान्य ज्ञान उजळणी", questionsCount: 10 },
          { day: "उद्याचा प्लॅन", focus: "मराठी व्याकरण सराव", questionsCount: 10 }
        ]
      });
    }

    // Weak topics च्या आधारावर प्लॅन तयार करणे
    const plan = weakTopics.map((item, index) => ({
      day: `दिवस ${index + 1}`,
      subject: item.subject,
      topic: item.topic,
      action: `'${item.topic}' या घटकावर विशेष सराव आणि नोट्स उजळणी करा.`,
      targetQuestions: 15
    }));

    res.json({
      success: true,
      message: "तुमच्या चुकांनुसार नवीन रिव्हिजन प्लॅन तयार झाला आहे!",
      revisionPlan: plan
    });

  } catch (error: any) {
    console.error("रिव्हिजन प्लॅन बनवताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});// ४. 'Weekly & Monthly Reports' API
router.get('/performance-report', async (req, res): Promise<any> => {
  try {
    // एकूण प्रश्न, अचूक उत्तरे आणि चुका यांचे विश्लेषण
    const reportResult = await pool.query(`
      SELECT 
        COUNT(*) as total_questions,
        COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_answers,
        COUNT(CASE WHEN is_correct = false THEN 1 END) as wrong_answers
      FROM user_performance
    `);

    const stats = reportResult.rows[0];
    const total = parseInt(stats.total_questions) || 0;
    const correct = parseInt(stats.correct_answers) || 0;
    const wrong = parseInt(stats.wrong_answers) || 0;
    
    // Accuracy (% अचूकता) काढणे
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    res.json({
      success: true,
      report: {
        totalQuestions: total,
        correctAnswers: correct,
        wrongAnswers: wrong,
        accuracyPercentage: accuracy
      }
    });

  } catch (error: any) {
    console.error("अहवाल तयार करताना एरर:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
export default router;