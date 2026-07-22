"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  // १. प्रश्नांमध्ये विषय (subject) आणि घटक (topic) जोडले आहेत
  const questions = [
    {
      id: 1,
      question: "१) महाराष्ट्र पोलीस दलाचे ब्रीदवाक्य खालीलपैकी कोणते आहे?",
      options: ["सत्यमेव जयते", "परित्राणाय साधूनाम्", "सद्रक्षणाय खलनिग्रहणाय", "सेवा सुरक्षा सदैव"],
      correct: 2,
      topic: "पोलीस प्रशासन",
      subject: "सामान्य ज्ञान"
    },
    {
      id: 2,
      question: "२) नुकतेच २०२६ मध्ये कोणत्या जिल्ह्याला नवीन पोलीस आयुक्तालय (Commissionerative) मंजूर झाले आहे?",
      options: ["छत्रपती संभाजीनगर", "जळगाव", "लातूर", "सोलापूर ग्रामीण"],
      correct: 0,
      topic: "चालू घडामोडी",
      subject: "सामान्य ज्ञान"
    },
    {
      id: 3,
      question: "३) 'प्रयोग' ओळखा: 'रामाने आंबा खाल्ला.'",
      options: ["कर्तरी प्रयोग", "कर्मणी प्रयोग", "भावे प्रयोग", "मिश्र प्रयोग"],
      correct: 1,
      topic: "मराठी व्याकरण",
      subject: "मराठी"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]); // २. उत्तरे साठवण्यासाठी स्टेट
  const [timeLeft, setTimeLeft] = useState(900); // १५ मिनिटे = ९०० सेकंद

  // टायमर लॉजिक
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // वेळेचे फॉरमॅटिंग (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ३. सबमिट आणि नेक्स्ट बटण लॉजिक
  const handleNext = async () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedOption === currentQ.correct;

    const answerData = {
      question_id: currentQ.id,
      is_correct: isCorrect,
      topic: currentQ.topic,
      subject: currentQ.subject
    };

    const updatedAnswers = [...userAnswers, answerData];
    setUserAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null); // पुढच्या प्रश्नासाठी सिलेक्शन क्लिअर करणे
    } else {
      // क्विझ पूर्ण झाल्यावर बॅकएंडला डेटा पाठवणे
      try {
        const response = await fetch('http://localhost:5000/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ results: updatedAnswers })
        });
        const data = await response.json();

        if (data.success) {
          alert("🎉 क्विज पूर्ण झाली! तुमचा सराव डेटाबेसमध्ये सेव्ह झाला आहे.");
        } else {
          alert("डेटा सेव्ह करताना त्रुटी आली.");
        }
      } catch (err) {
        console.error("बॅकएंडशी संपर्क झाला नाही:", err);
        alert("बॅकएंड सर्व्हर चालू आहे का ते तपासा!");
      }
    }
  };

  // प्रोग्रेस टक्केवारी
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b0f19',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      padding: '24px'
    }}>
      
      {/* QUIZ HEADER */}
      <header style={{
        maxWidth: '800px',
        margin: '0 auto 32px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(17, 24, 39, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '16px 24px',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)'
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> होमपेजवर जा
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* प्रोग्रेस इंडिकेटर */}
          <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>
            प्रश्न: <span style={{ color: '#60a5fa', fontWeight: 700 }}>{currentQuestion + 1}</span>/{questions.length}
          </span>
          
          {/* लाइव्ह टायमर बॉक्स */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: timeLeft < 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.12)',
            border: timeLeft < 60 ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.25)',
            padding: '6px 14px',
            borderRadius: '9999px',
            color: timeLeft < 60 ? '#f87171' : '#60a5fa',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            <Clock style={{ width: '16px', height: '16px' }} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* MAIN QUIZ CONTAINER */}
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* प्रोग्रेस बार */}
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(to right, #3b82f6, #818cf8)', transition: 'width 0.3s ease' }}></div>
        </div>

        {/* प्रश्न कार्ड */}
        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '32px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          
          {/* प्रश्न मजकूर */}
          <h2 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.5, marginBottom: '28px', color: '#f3f4f6' }}>
            {questions[currentQuestion].question}
          </h2>

          {/* पर्यायांची सूची (Options) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '18px 20px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 500, color: isSelected ? '#60a5fa' : '#d1d5db' }}>
                    {option}
                  </span>
                  
                  {/* रेडिओ सर्कल किंवा चेक आयकॉन */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #3b82f6' : '2px solid #4b5563',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}></div>
                </div>
              );
            })}
          </div>

          {/* ॲक्शन बटण (Next / Submit) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              style={{
                background: selectedOption === null ? '#1f2937' : 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: selectedOption === null ? '#4b5563' : '#ffffff',
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                cursor: selectedOption === null ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              {currentQuestion === questions.length - 1 ? 'क्विज सबमिट करा' : 'पुढील प्रश्न'} 
              <ChevronRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}