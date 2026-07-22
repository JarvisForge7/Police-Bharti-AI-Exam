import pool from './config/db';

const seedDatabase = async () => {
  try {
    console.log("⏳ १. डेटाबेस टेबल्स तपासणे आणि तयार करणे सुरू आहे...");

    // अ) questions टेबल तयार करणे
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question_text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_option_index INT NOT NULL,
        subject VARCHAR(100),
        district VARCHAR(100),
        year INT,
        difficulty VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ब) papers टेबल तयार करणे
    await pool.query(`
      CREATE TABLE IF NOT EXISTS papers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50), -- 'District', 'Subject' etc.
        district VARCHAR(100),
        year INT,
        subject VARCHAR(100),
        total_questions INT NOT NULL,
        time_limit_minutes INT NOT NULL,
        negative_marking NUMERIC(3,2) DEFAULT 0.25,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // क) paper_questions मॅपिंग (Join) टेबल तयार करणे
    await pool.query(`
      CREATE TABLE IF NOT EXISTS paper_questions (
        id SERIAL PRIMARY KEY,
        paper_id INT REFERENCES papers(id) ON DELETE CASCADE,
        question_id INT REFERENCES questions(id) ON DELETE CASCADE,
        question_order INT NOT NULL
      );
    `);

    // ड) user_progress टेबल तयार करणे (जो मगाशी एरर देऊ शकला असता)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        paper_id INT REFERENCES papers(id) ON DELETE CASCADE,
        time_left_seconds INT NOT NULL,
        questions_order INT[] NOT NULL,
        answers JSONB NOT NULL,
        is_submitted BOOLEAN DEFAULT false,
        final_score NUMERIC(5,2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ सर्व टेबल्स यशस्वीरित्या तयार झाले आहेत!");
    console.log("⏳ २. आता टेस्ट डेटा भरण्यास सुरुवात होत आहे...");

    // २. डेटाबेसमध्ये २०२६ चे प्रश्न भरणे
    const questionResult = await pool.query(`
      INSERT INTO questions (question_text, options, correct_option_index, subject, district, year, difficulty)
      VALUES 
      ('महाराष्ट्र पोलीस दलाचे मुख्यालय कोठे आहे?', ARRAY['पुणे', 'मुंबई', 'नागपूर', 'ठाणे'], 1, 'सामान्य ज्ञान', 'मुंबई', 2026, 'Easy'),
      ('भारताचे संविधान कोणत्या दिवशी लागू करण्यात आले?', ARRAY['२६ जानेवारी १९५०', '१५ ऑगस्ट १९४७', '२६ नोव्हेंबर १९४९', '३० जानेवारी १९४८'], 0, 'राज्यशास्त्र', 'General', 2026, 'Medium')
      RETURNING id;
    `);

    const questionIds = questionResult.rows.map(q => q.id);
    console.log(`✅ ${questionIds.length} प्रश्न इन्सर्ट झाले.`);

    // ३. २०२६ चा जिल्हा पेपर तयार करणे
    const paperResult = await pool.query(`
      INSERT INTO papers (title, type, district, year, total_questions, time_limit_minutes, negative_marking)
      VALUES ('मुंबई पोलीस शिपाई परीक्षा २०२६', 'District', 'मुंबई', 2026, 100, 90, 0.25)
      RETURNING id;
    `);

    const paperId = paperResult.rows[0].id;
    console.log(`✅ पेपर तयार झाला! ID: ${paperId}`);

    // ४. पेपर आणि प्रश्नांचे मॅपिंग करणे
    for (let i = 0; i < questionIds.length; i++) {
      await pool.query(`
        INSERT INTO paper_questions (paper_id, question_id, question_order)
        VALUES ($1, $2, $3);
      `, [paperId, questionIds[i], i + 1]);
    }

    console.log("🎯 डेटाबेस सीडिंग १००% पूर्ण झाले! मॉड्यूल ३ चे सर्व पॉइंट्स बॅकएंडवर रेडी आहेत.");
    process.exit(0);
  } catch (error) {
    console.error("❌ सीडिंग करताना एरर आली:", error);
    process.exit(1);
  }
};

seedDatabase();