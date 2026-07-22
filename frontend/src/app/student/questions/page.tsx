'use client';

import React, { useState } from 'react';

// मॉक डेटा - विद्यार्थ्याचे चुकलेले आणि बुकमार्क केलेले प्रश्न
const mockSavedQuestions = {
  bookmarks: [
    {
      id: 101,
      question: "भारताच्या संविधानातील कोणत्या कलमाला डॉ. बाबासाहेब आंबेडकरांनी 'संविधानाचा आत्मा' म्हटले आहे?",
      options: ["कलम १४", "कलम १९", "कलम ३२", "कलम २१"],
      correctAnswer: "कलम ३२",
      aiExplanation: "🧠 मेमरी ट्रिक: 'कलम ३२' म्हणजे घटनात्मक उपायुक्तांचा अधिकार. हा अधिकार हक्कांचे रक्षण करतो, म्हणून हा संविधानाचा 'आत्मा' आणि 'हृदय' आहे. 🎯 परीक्षा फ्रिक्वेन्सी: MPSC आणि पोलीस भरतीमध्ये हा प्रश्न सलग ५ पेक्षा जास्त वेळा विचारला गेला आहे!"
    },
    {
      id: 102,
      question: "डॉ. बाबासाहेब आंबेडकरांनी महाडचा सत्याग्रह कोणत्या वर्षी घडवून आणला?",
      options: ["१९२५", "१९२७", "१९३०", "१९३२"],
      correctAnswer: "१९२७",
      aiExplanation: "📆 शॉर्ट ट्रिक: २० मार्च १९२७ रोजी चवदार तळ्याचा सत्याग्रह झाला. '२७ चा सत्याग्रह' असं लक्षात ठेवा. हा सामाजिक समतेचा पाया होता."
    }
  ],
  wrongQuestions: [
    {
      id: 201,
      question: "महाराष्ट्रातील स्थानिक स्वराज्य संस्थांमध्ये महिलांसाठी किती टक्के जागा राखीव आहेत?",
      options: ["३३%", "५०%", "४०%", "२५%"],
      correctAnswer: "५०%",
      userAnswer: "३३%",
      aiExplanation: "⚠️ तुम्ही चुकवलात! लक्षात ठेवा, केंद्र पातळीवर ३३% ची चर्चा असते, पण महाराष्ट्रात स्थानिक स्वराज्य संस्थांमध्ये (ग्रामपंचायत, महापालिका) महिलांना पूर्ण ५०% आरक्षण आहे. ही चूक पुन्हा करू नका भाऊ!"
    },
    {
      id: 202,
      question: "भारतात चलनाची छपाई करण्याचा अधिकार खालीलपैकी कोणाकडे आहे?",
      options: ["भारतीय स्टेट बँक (SBI)", "केंद्रीय अर्थ मंत्रालय", "भारतीय रिझर्व्ह बँक (RBI)", "भारत सरकार"],
      correctAnswer: "भारतीय रिझर्व्ह बँक (RBI)",
      userAnswer: "केंद्रीय अर्थ मंत्रालय",
      aiExplanation: "💡 स्पष्टीकरण: ₹१ ची नोट आणि सर्व नाणी अर्थ मंत्रालय जारी करते, पण ₹२ पासून पुढच्या सर्व चलनांची छपाई आणि नियंत्रण 'RBI' करते. म्हणून मुख्य अधिकार RBI चा आहे."
    }
  ]
};

export default function QuestionsExplorer() {
  const [viewType, setViewType] = useState<'bookmarks' | 'wrong'>('bookmarks');
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const currentQuestions = viewType === 'bookmarks' ? mockSavedQuestions.bookmarks : mockSavedQuestions.wrongQuestions;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ color: '#1e293b', margin: '0 0 5px 0' }}>🧠 AI Teacher - प्रश्न विश्लेषक</h2>
        <p style={{ color: '#64748b', margin: 0 }}>तुमचे बुकमार्क केलेले आणि चुकलेले प्रश्न इथे तपासा आणि सरावात सुधारणा करा.</p>
      </div>

      {/* TOGGLE BUTTONS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button 
          onClick={() => { setViewType('bookmarks'); setSelectedQuestion(null); }}
          style={buttonStyle(viewType === 'bookmarks', '#f59e0b')}
        >
          📌 बुकमार्क केलेले प्रश्न ({mockSavedQuestions.bookmarks.length})
        </button>
        <button 
          onClick={() => { setViewType('wrong'); setSelectedQuestion(null); }}
          style={buttonStyle(viewType === 'wrong', '#ef4444')}
        >
          ❌ चुकलेले प्रश्न ({mockSavedQuestions.wrongQuestions.length})
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* LEFT: QUESTIONS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ color: '#475569', fontSize: '16px', margin: '0 0 5px 0' }}>📋 प्रश्नांची यादी:</h3>
          {currentQuestions.map((q, index) => (
            <div 
              key={q.id} 
              onClick={() => setSelectedQuestion(q)}
              style={{
                padding: '15px', backgroundColor: '#ffffff', borderRadius: '8px', border: selectedQuestion?.id === q.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '14px', marginBottom: '5px' }}>प्र. {index + 1}: {q.question}</div>
              {viewType === 'wrong' && (
                <div style={{ fontSize: '12px', color: '#ef4444' }}>तुमचे उत्तर: {q.userAnswer} | अचूक उत्तर: {q.correctAnswer}</div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: AI TEACHER DETAILED EXPLANATION */}
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {selectedQuestion ? (
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px' }}>
                ID: #{selectedQuestion.id}
              </span>
              <h3 style={{ color: '#1e293b', marginTop: '15px', lineHeight: '1.5' }}>{selectedQuestion.question}</h3>
              
              {/* OPTIONS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                {selectedQuestion.options.map((opt: string, i: number) => {
                  const isCorrect = opt === selectedQuestion.correctAnswer;
                  const isUserWrong = viewType === 'wrong' && opt === selectedQuestion.userAnswer;
                  
                  return (
                    <div key={i} style={{
                      padding: '12px 15px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '500',
                      backgroundColor: isCorrect ? '#dcfce7' : isUserWrong ? '#fee2e2' : '#f8fafc',
                      color: isCorrect ? '#14532d' : isUserWrong ? '#991b1b' : '#334155'
                    }}>
                      {opt} {isCorrect && " ✅"} {isUserWrong && " ❌ (तुमचे उत्तर)"}
                    </div>
                  );
                })}
              </div>

              {/* AI TEACHER BOX */}
              <div style={{ marginTop: '25px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#166534', display: 'flex', alignItems: 'center', gap: '5px' }}>🤖 AI Teacher स्पष्टीकरण व ट्रिक:</h4>
                <p style={{ margin: 0, color: '#14532d', fontSize: '14px', lineHeight: '1.6' }}>{selectedQuestion.aiExplanation}</p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '100px 0' }}>
              <span style={{ fontSize: '48px' }}>🧠</span>
              <p style={{ marginTop: '10px' }}>सविस्तर AI विश्लेषण आणि शॉर्ट ट्रिक्स पाहण्यासाठी डावीकडील कोणत्याही प्रश्नावर क्लिक करा भाऊ!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// स्टाईल फंक्शन
const buttonStyle = (isActive: boolean, activeColor: string) => ({
  padding: '12px 20px',
  backgroundColor: isActive ? activeColor : '#ffffff',
  color: isActive ? '#ffffff' : '#475569',
  border: isActive ? `1px solid ${activeColor}` : '1px solid #e2e8f0',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  fontSize: '14px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  transition: 'all 0.2s'
});