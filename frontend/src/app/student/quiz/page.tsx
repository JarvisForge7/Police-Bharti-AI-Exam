'use client';

import React, { useState, useEffect } from 'react';

// फॉलबॅक (बॅकअप) प्रश्नपत्रिका जर LocalStorage मध्ये डेटा नसेल तर
const sampleQuestionsBackup = [
  {
    id: 1,
    question: "महाराष्ट्राची राजधानी कोणती आहे?",
    options: ["नागपूर", "मुंबई", "पुणे", "छत्रपती संभाजीनगर"],
    correctAnswer: "मुंबई"
  },
  {
    id: 2,
    question: "भारताचे सध्याचे सरन्यायाधीश कोण आहेत?",
    options: ["डी. वाय. चंद्रचूड", "शरद बोबडे", "यू. यू. लळीत", "एन. व्ही. रमणा"],
    correctAnswer: "डी. वाय. चंद्रचूड"
  },
  {
    id: 3,
    question: "पोलीस पाटलाची नियुक्ती खालीलपैकी कोण करतो?",
    options: ["तहसीलदार / उपविभागीय अधिकारी", "जिल्हाधिकारी", "पोलीस अधीक्षक", "सरपंच"],
    correctAnswer: "तहसीलदार / उपविभागीय अधिकारी"
  },
  {
    id: 4,
    question: "महाराष्ट्रात पोलीस अकादमी (MPA) कोठे आहे?",
    options: ["पुणे", "नागपूर", "नाशिक", "मुंबई"],
    correctAnswer: "नाशिक"
  },
  {
    id: 5,
    question: "खालीलपैकी कोणत्या नदीला 'दक्षिण गंगा' असे म्हणतात?",
    options: ["कृष्णा", "गोदावरी", "कावेरी", "तापी"],
    correctAnswer: "गोदावरी"
  }
];

export default function StudentQuiz() {
  const [questions, setQuestions] = useState<any[]>([]); // 👈 डायनॅमिक प्रश्नांसाठी स्टेट
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(600); // १० मिनिटे (६०० सेकंद)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 लोडिंग स्टेट

  // 📥 LocalStorage मधून AI ने जनरेट केलेले प्रश्न लोड करणे
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuestions = localStorage.getItem('active_quiz_questions');
      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions));
      } else {
        setQuestions(sampleQuestionsBackup);
      }
      setLoading(false);
    }
  }, []);

  // ⏱️ TIMER LOGIC
  useEffect(() => {
    if (loading || timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, loading]);

  // वेळ मिनिटे आणि सेकंदात फॉरमॅट करणे
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: option
    });
  };

  // 📊 गुण मोजणे (आता डायनॅमिक प्रश्नांवरून मोजणार)
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // ⏳ लोडिंग स्क्रीन
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>⏳ चाचणी लोड होत आहे भाऊ...</div>;
  }

  const currentQ = questions[currentIndex];

  // 🏆 निकाल स्क्रीन
  if (isSubmitted) {
    const score = calculateScore();
    // टेस्ट सबमिट झाल्यावर लोकल स्टोरेज क्लीन करणे
    localStorage.removeItem('active_quiz_questions');
    
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '48px', margin: '0' }}>🎉</h1>
          <h2 style={{ color: '#1e293b' }}>परीक्षेचा निकाल (Test Result)</h2>
          <p style={{ color: '#64748b' }}>तुम्ही यशस्वीरित्या चाचणी पूर्ण केली आहे!</p>
          
          <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {score} / {questions.length}
            </div>
            <p style={{ margin: '5px 0 0 0', color: '#475569', fontSize: '14px' }}>एकूण मिळवलेले गुण</p>
          </div>

          <button 
            onClick={() => window.location.href = '/student/dashboard'}
            style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🏠 मुख्य डॅशबोर्डवर जा
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🔝 HEADER BAR WITH TIMER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#1e293b' }}>📝 पोलीस भरती सराव चाचणी २०२६</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>एकूण प्रश्न: {questions.length} | प्रत्येक प्रश्नाला १ गुण</p>
        </div>
        <div style={{ backgroundColor: timeLeft < 120 ? '#fee2e2' : '#f0fdf4', border: `1px solid ${timeLeft < 120 ? '#fca5a5' : '#bbf7d0'}`, padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⏱️</span>
          <span style={{ fontWeight: 'bold', color: timeLeft < 120 ? '#dc2626' : '#16a34a', fontSize: '16px' }}>
            वेळ: {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* 🧭 MAIN TEST AREA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        
        {/* LEFT: QUESTION & OPTIONS CONTAINER */}
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
            <span>प्रश्न क्रमांक {currentIndex + 1} ऑफ {questions.length}</span>
          </div>

          <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '25px', lineHeight: '1.5' }}>
            {currentIndex + 1}. {currentQ?.question}
          </h3>

          {/* OPTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            {currentQ?.options.map((option: string, idx: number) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  style={{
                    padding: '14px 18px',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    border: isSelected ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    color: isSelected ? '#1d4ed8' : '#334155',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ marginRight: '10px', color: isSelected ? '#1d4ed8' : '#94a3b8' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              style={{ padding: '10px 20px', backgroundColor: currentIndex === 0 ? '#f1f5f9' : '#e2e8f0', color: currentIndex === 0 ? '#94a3b8' : '#334155', border: 'none', borderRadius: '6px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              ⬅️ मागे (Previous)
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                पुढे (Next) ➡️
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitted(true)}
                style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✅ टेस्ट सबमिट करा (Submit)
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: QUESTION PALETTE GRID */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>📌 प्रश्न संच (Question Palette)</h4>
          
          {/* 🧩 Dynamic Layout For Palette Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: isCurrent ? '2px solid #1e293b' : '1px solid #cbd5e1',
                    backgroundColor: isAnswered ? '#10b981' : '#f8fafc',
                    color: isAnswered ? '#ffffff' : '#334155',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }}></span>
              <span>उत्तर दिलेले प्रश्न ({Object.keys(selectedAnswers).length})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px' }}></span>
              <span>उरलेले प्रश्न ({questions.length - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitted(true)}
            style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🏁 चाचणी संपवा (Finish Test)
          </button>
        </div>

      </div>

    </div>
  );
}