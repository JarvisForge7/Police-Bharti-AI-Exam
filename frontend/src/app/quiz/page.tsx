"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  // १. प्रश्नांमध्ये विषय (subject) आणि घटक (topic) जोडले आहेत
  const questions = [
    {
  "exam_info": {
    "title": "मुंबई शहर पोलीस भरती २०२६ सराव प्रश्न",
    "description": "परीक्षेच्या पॅटर्नवर आधारित (सामान्य ज्ञान, मराठी व्याकरण, गणित आणि बुद्धिमत्ता) अतिसंभाव्य ५० सराव प्रश्न"
 
          
        },
        {
          "id": 2,
          "question": "'गेटवे ऑफ इंडिया' कोठे स्थित आहे?",
          "options": { "A": "पुणे", "B": "मुंबई", "C": "दिल्ली", "D": "नागपूर" },
          "answer": "B"
        },
        {
          "id": 3,
          "question": "महाराष्ट्रातील सर्वोच्च शिखर कोणते आहे?",
          "options": { "A": "कळसूबाई", "B": "महाबळेश्वर", "C": "साल्हेर", "D": "सिंहगड" },
          "answer": "A"
        },
        {
          "id": 4,
          "question": "सध्याचे भारताचे केंद्रीय गृहमंत्री कोण आहेत?",
          "options": { "A": "राजनाथ सिंह", "B": "अमित शाह", "C": "नितीन गडकरी", "D": "एस. जयशंकर" },
          "answer": "B"
        },
        {
          "id": 5,
          "question": "'शेतकऱ्याचा आसूड' हा प्रसिद्ध ग्रंथ कोणी लिहिला?",
          "options": { "A": "डॉ. बाबासाहेब आंबेडकर", "B": "महात्मा जोतीराव फुले", "C": "राजर्षी शाहू महाराज", "D": "महर्षी कर्वे" },
          "answer": "B"
        },
        {
          "id": 6,
          "question": "जागतिक महिला दिन कोणत्या तारखेला साजरा केला जातो?",
          "options": { "A": "८ मार्च", "B": "८ मे", "C": "५ जून", "D": "१ मे" },
          "answer": "A"
        },
        {
          "id": 7,
          "question": "महाराष्ट्र राज्यात सध्या एकूण किती जिल्हे आहेत?",
          "options": { "A": "३५", "B": "३६", "C": "३७", "D": "३४" },
          "answer": "B"
        },
        {
          "id": 8,
          "question": "भारतीय राज्यघटनेचे शिल्पकार कोणाला म्हटले जाते?",
          "options": { "A": "महात्मा गांधी", "B": "पंडित नेहरू", "C": "डॉ. बाबासाहेब आंबेडकर", "D": "सरदार वल्लभभाई पटेल" },
          "answer": "C"
        },
        {
          "id": 9,
          "question": "लोकमान्य टिळकांनी कोणते वृत्तपत्र सुरू केले?",
          "options": { "A": "केसरी", "B": "दर्पण", "C": "ज्ञानप्रकाश", "D": "सुधारक" },
          "answer": "A"
        },
        {
          "id": 10,
          "question": "सूर्यमालेतील सर्वात मोठा ग्रह कोणता आहे?",
          "options": { "A": "पृथ्वी", "B": "मंगळ", "C": "गुरु", "D": "शुक्र" },
          "answer": "C"
        },
        {
          "id": 11,
          "question": "मुंबई शहराला पाणीपुरवठा करणारा मुख्य तलाव कोणता?",
          "options": { "A": "तानसा", "B": "वैतरणा", "C": "विहार", "D": "वरील सर्व" },
          "answer": "D"
        },
        {
          "id": 12,
          "question": "महाराष्ट्राची उपराजधानी म्हणून कोणत्या शहराची ओळख आहे?",
          "options": { "A": "पुणे", "B": "नाशिक", "C": "नागपूर", "D": "छत्रपती संभाजीनगर" },
          "answer": "C"
        },
        {
          "id": 13,
          "question": "भारताचा राष्ट्रीय प्राणी कोणता आहे?",
          "options": { "A": "सिंह", "B": "वाघ", "C": "हत्ती", "D": "बिबट्या" },
          "answer": "B"
        },
        {
          "id": 14,
          "question": "'अग्निपंख' हे कोणाचे आत्मचरित्र आहे?",
          "options": { "A": "डॉ. ए.पी.जे. अब्दुल कलाम", "B": "अटल बिहारी वाजपेयी", "C": "प्रतिभा पाटील", "D": "नरेंद्र मोदी" },
          "answer": "A"
        },
        {
          "id": 15,
          "question": "पोलीस स्मृती दिन कधी पाळला जातो?",
          "options": { "A": "२१ ऑक्टोबर", "B": "२ ऑक्टोबर", "C": "१ मे", "D": "२६ नोव्हेंबर" },
          "answer": "A"
        }
      ]
    },
   
          "id": 16,
          "question": "'मराठी भाषेचे पाणिनी' कोणाला म्हटले जाते?",
          "options": { "A": "बाळशास्त्री जांभेकर", "B": "दादोबा पांडुरंग तर्खडकर", "C": "वि. स. खांडेकर", "D": "कुसुमाग्रज" },
          "answer": "B"
        },
        {
          "id": 17,
          "question": "'कमळ' या शब्दाला समानार्थी शब्द कोणता?",
          "options": { "A": "पंकज", "B": "नीर", "C": "पावक", "D": "खग" },
          "answer": "A"
        },
        {
          "id": 18,
          "question": "'उंटावरचा शहाणा' या वाक्प्रचाराचा अर्थ काय?",
          "options": { "A": "मूर्खपणाचा सल्ला देणारा", "B": "खूप शहाणा माणूस", "C": "उंच माणूस", "D": "प्रामाणिक माणूस" },
          "answer": "A"
        },
        {
          "id": 19,
          "question": "'सूर्य' या शब्दाचे लिंग कोणते?",
          "options": { "A": "स्त्रीलिंग", "B": "पुल्लिंग", "C": "नपुंसकलिंग", "D": "यापैकी नाही" },
          "answer": "B"
        },
        {
          "id": 20,
          "question": "'तो गाणे गातो' या वाक्यातील काळ ओळखा.",
          "options": { "A": "वर्तमानकाळ", "B": "भूतकाळ", "C": "भविष्यकाळ", "D": "रीती भूतकाळ" },
          "answer": "A"
        },
        {
          "id": 21,
          "question": "संधी सोडवा: 'हिमालय'",
          "options": { "A": "हिम + आलय", "B": "हिमा + आलय", "C": "हिम + लय", "D": "हि + मालय" },
          "answer": "A"
        },
        {
          "id": 22,
          "question": "'मीठभाकर' हा कोणता समास आहे?",
          "options": { "A": "द्वंद्व समास", "B": "अव्ययीभाव समास", "C": "तत्पुरुष समास", "D": "बहुव्रीही समास" },
          "answer": "A"
        },
        {
          "id": 23,
          "question": "'डोळ्यांवर कातडे ओढणे' या वाक्प्रचाराचा अर्थ सांगा.",
          "options": { "A": "झोपणे", "B": "दुर्लक्ष करणे", "C": "डोळे दुखणे", "D": "अंध होणे" },
          "answer": "B"
        },
        {
          "id": 24,
          "question": "'मुलांनो, रांगेत उभे राहा' या वाक्याचा प्रकार कोणता?",
          "options": { "A": "विधानार्थी", "B": "प्रश्नार्थी", "C": "आज्ञार्थी", "D": "उद्गारार्थी" },
          "answer": "C"
        },
        {
          "id": 25,
          "question": "पुढीलपैकी शुद्ध शब्द ओळखा:",
          "options": { "A": "आशिर्वाद", "B": "आशिरवाद", "C": "आशीर्वाद", "D": "आषीर्वाद" },
          "answer": "C"
        },
        {
          "id": 26,
          "question": "'मराठी भाषा गौरव दिन' कधी साजरा केला जातो?",
          "options": { "A": "२७ फेब्रुवारी", "B": "१ मे", "C": "२६ जानेवारी", "D": "१५ ऑगस्ट" },
          "answer": "A"
        },
        {
          "id": 27,
          "question": "'ज्ञानेश्वरी' या ग्रंथाची रचना कोणी केली?",
          "options": { "A": "संत तुकाराम", "B": "संत ज्ञानेश्वर", "C": "संत नामदेव", "D": "संत एकनाथ" },
          "answer": "B"
        },
        {
          "id": 28,
          "question": "'आकाश' या शब्दाचा विरुद्धार्थी शब्द कोणता?",
          "options": { "A": "पाताळ", "B": "जमीन", "C": "ढग", "D": "तारे" },
          "answer": "A"
        },
        {
          "id": 29,
          "question": "नामा ऐवजी वापरल्या जाणाऱ्या शब्दाला काय म्हणतात?",
          "options": { "A": "विशेषण", "B": "सर्वनाम", "C": "क्रियापद", "D": "अव्यय" },
          "answer": "B"
        },
        {
          "id": 30,
          "question": "प्रयोग ओळखा: 'रामाने रावणास मारले.'",
          "options": { "A": "कर्तरी प्रयोग", "B": "कर्मणी प्रयोग", "C": "भावे प्रयोग", "D": "संकर प्रयोग" },
          "answer": "C"
        }
      ]
    },
   
          "id": 31,
          "question": "५० चे २०% किती होतात?",
          "options": { "A": "५", "B": "१०", "C": "१५", "D": "२०" },
          "answer": "B"
        },
        {
          "id": 32,
          "question": "एका त्रिकोणाच्या तिन्ही कोनांच्या मापांची बेरीज किती असते?",
          "options": { "A": "९० अंश", "B": "१८० अंश", "C": "३६० अंश", "D": "२७० अंश" },
          "answer": "B"
        },
        {
          "id": 33,
          "question": "एका वस्तूची खरेदी किंमत १०० रुपये आणि विक्री किंमत १२० रुपये असेल, तर शेकडा नफा किती?",
          "options": { "A": "१०%", "B": "१५%", "C": "२०%", "D": "२५%" },
          "answer": "C"
        },
        {
          "id": 34,
          "question": "१२०० रुपयांचे १०% दराने २ वर्षांचे सरळव्याज किती येईल?",
          "options": { "A": "२४० रुपये", "B": "२०० रुपये", "C": "२२० रुपये", "D": "२६० रुपये" },
          "answer": "A"
        },
        {
          "id": 35,
          "question": "१२, २४, ३६, ४८, ... या मालिकेतील पुढील पद कोणते?",
          "options": { "A": "५४", "B": "६०", "C": "६४", "D": "७२" },
          "answer": "B"
        },
        {
          "id": 36,
          "question": "एका वर्गात एकूण ५० विद्यार्थी आहेत, त्यापैकी २० मुली आहेत, तर मुलींचे शेकडा प्रमाण किती?",
          "options": { "A": "४०%", "B": "५०%", "C": "६०%", "D": "३०%" },
          "answer": "A"
        },
        {
          "id": 37,
          "question": "५/८ चे दशांश रूप कोणते?",
          "options": { "A": "०.५८", "B": "०.६२५", "C": "०.८५", "D": "०.२५" },
          "answer": "B"
        },
        {
          "id": 38,
          "question": "एका चौरसाची बाजू ५ सेमी आहे, तर त्याचे क्षेत्रफळ किती?",
          "options": { "A": "२० चौ.सेमी", "B": "२५ चौ.सेमी", "C": "३० चौ.सेमी", "D": "१० चौ.सेमी" },
          "answer": "B"
        },
        {
          "id": 39,
          "question": "४० माणसे एक काम २० दिवसात पूर्ण करतात, तर तेच काम २० माणसे किती दिवसात पूर्ण करतील?",
          "options": { "A": "१० दिवस", "B": "३० दिवस", "C": "४० दिवस", "D": "५० दिवस" },
          "answer": "C"
        },
        {
          "id": 40,
          "question": "३५ चा वर्ग किती?",
          "options": { "A": "१२२५", "B": "१२५०", "C": "१३२५", "D": "११२५" },
          "answer": "A"
        }
      ]
    },
   
          "id": 41,
          "question": "जर 'A' म्हणजे १, 'B' म्हणजे २, तर 'CAT' म्हणजे काय?",
          "options": { "A": "२२", "B": "२४", "C": "२६", "D": "२०" },
          "answer": "B"
        },
        {
          "id": 42,
          "question": "विसंगत शब्द ओळखा: आंबा, सफरचंद, बटाटा, पेरू",
          "options": { "A": "आंबा", "B": "सफरचंद", "C": "बटाटा", "D": "पेरू" },
          "answer": "C",
          "explanation": "बटाटा हे मूळ/भाजी आहे, बाकी फळे आहेत"
        },
        {
          "id": 43,
          "question": "एका रांगेत रमेश पुढून ५ वा आणि मागून १० वा आहे, तर रांगेत एकूण किती मुले आहेत?",
          "options": { "A": "१५", "B": "१४", "C": "१६", "D": "१३" },
          "answer": "B",
          "explanation": "५ + १० - १ = १४"
        },
        {
          "id": 44,
          "question": "आज सोमवार आहे, तर ५२ दिवसांनंतर कोणता वार असेल?",
          "options": { "A": "सोमवार", "B": "मंगळवार", "C": "बुधवार", "D": "गुरुवार" },
          "answer": "D",
          "explanation": "५२ ÷ ७ = बाकी ३; सोमवारच्या पुढे ३ दिवस म्हणजे गुरुवार"
        },
        {
          "id": 45,
          "question": "घड्याळात ३ वाजले असता, तास काटा आणि मिनिट काटा यांच्यात किती अंशाचा कोन असेल?",
          "options": { "A": "६० अंश", "B": "९० अंश", "C": "१२० अंश", "D": "१८० अंश" },
          "answer": "B"
        },
        {
          "id": 46,
          "question": "जर एका सांकेतिक भाषेत 'BOY' ला 'CPZ' लिहिले जात असेल, तर 'CAT' ला कसे लिहाल?",
          "options": { "A": "DBU", "B": "DOG", "C": "BAT", "D": "MAT" },
          "answer": "A"
        },
        {
          "id": 47,
          "question": "दिशा ओळखा: सूर्य ज्या दिशेला उगवतो, तिच्या अगदी विरुद्ध दिशा कोणती?",
          "options": { "A": "उत्तर", "B": "दक्षिण", "C": "पूर्व", "D": "पश्चिम" },
          "answer": "D"
        },
        {
          "id": 48,
          "question": "नातेसंबंध: माझ्या वडिलांच्या एकुलत्या एक भावाचा मुलगा माझा कोण?",
          "options": { "A": "भाऊ", "B": "चुलत भाऊ", "C": "मामा", "D": "काका" },
          "answer": "B"
        },
        {
          "id": 49,
          "question": "२, ५, १०, १७, ? या मालिकेतील पुढील संख्या कोणती?",
          "options": { "A": "२४", "B": "२५", "C": "२६", "D": "२७" },
          "answer": "C",
          "explanation": "१²+१=२, २²+१=५... ५²+१=२६"
        },
        {
          "id": 50,
          "question": "सहसंबंध ओळखा - भारत : नवी दिल्ली, तर महाराष्ट्र : ?",
          "options": { "A": "पुणे", "B": "नागपूर", "C": "मुंबई", "D": "नाशिक" },
          "answer": "C"
        }
      ]
    }
  ]
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