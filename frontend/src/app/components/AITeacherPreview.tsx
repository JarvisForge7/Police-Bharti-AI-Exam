'use client';

import React from 'react';

// AI शिक्षकाचा डेटा स्ट्रक्चर कसा असेल त्याचा नमुना (पोलीस भरती/MPSC च्या दृष्टीने)
const aiTeacherData = {
  question: "प्रश्न: खालीलपैकी कोणत्या कलमान्वये भारतीय संविधानाने अस्पृश्यता नष्ट केली आहे?",
  options: ["अ) कलम १५", "ब) कलम १६", "क) कलम १७", "ड) कलम १८"],
  correctAnswer: "क) कलम १७",
  
  explainAnswer: "भारतीय संविधानातील भाग ३ मधील समतेच्या हक्कांतर्गत 'कलम १७' नुसार अस्पृश्यता पाळण्यास बंदी घालण्यात आली आहे आणि तिचे कोणत्याही स्वरूपातील आचरण कायद्याने शिक्षेस पात्र गुन्हा ठरवले आहे.",
  whyCorrect: "कलम १७ हे स्पष्टपणे 'अस्पृश्यता निवारण' (Abolition of Untouchability) या विषयाशी संबंधित आहे, म्हणून हे उत्तर बरोबर आहे.",
  whyOthersWrong: "• कलम १५: धर्म, वंशादी कारणांवरून भेदभाव करण्यास मनाई.\n• कलम १६: सार्वजनिक रोजगारात समान संधी.\n• कलम १८: पदव्या नष्ट करणे (Abolition of Titles).",
  shortTrick: "समतेचा अधिकार लक्षात ठेवण्यासाठी क्रम लक्षात ठेवा: १५ (भेदभाव नाही), १६ (नोकरी), १७ (अस्पृश्यता), १८ (पदव्या).",
  memoryTrick: "💡 '१७' म्हणजे 'खतरा' ➡️ अस्पृश्यता पाळली तर कायद्याचा 'खतरा' (कलम १७)!",
  relatedQuestions: [
    "१. अस्पृश्यता निवारण कायदा कोणत्या वर्षी संमत झाला? (उत्तर: १९५५)",
    "२. नागरी हक्क संरक्षण कायदा (Civil Rights Protection Act) कोणत्या कलमाच्या अंमलबजावणीसाठी आहे? (उत्तर: कलम १७)"
  ],
  importantNotes: "Dr. B.R. Ambedkar यांनी या कलमाला संविधानाचा अत्यंत महत्त्वाचा भाग मानले होते, कारण यामुळे शतकानुशतके चाललेली सामाजिक विषमता कायद्याने संपुष्टात आली.",
  policeFrequency: "🔥 अत्यंत जास्त (मागील ५ वर्षात ७ वेळा विचारला गेला आहे)",
  mpscFrequency: "⭐⭐⭐ मध्यम ते जास्त (राज्यसेवा पूर्व आणि PSI/STI संयुक्त परीक्षेत वारंवार रिपीट)",
  difficultyLevel: "सोपे (Easy)",
  futureProbability: "🎯 ९५% (आगामी पोलीस भरती २०२६ च्या परीक्षेत येण्याची दाट शक्यता)"
};

export default function AITeacherPreview() {
  const d = aiTeacherData;

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '25px', fontFamily: 'sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
      
      {/* 🤖 AI Teacher Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #3b82f6', paddingBottom: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>🤖</span>
        <div>
          <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px' }}>AI Teacher (कृत्रिम बुद्धिमत्ता शिक्षक)</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>प्रश्नाचे सखोल आणि प्रगत विश्लेषण</p>
        </div>
      </div>

      {/* ❓ प्रश्न आणि पर्याय */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '12px' }}>{d.question}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {d.options.map((opt, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '6px', border: opt === d.correctAnswer ? '2px solid #22c55e' : '1px solid #cbd5e1', backgroundColor: opt === d.correctAnswer ? '#f0fdf4' : '#f8fafc', fontWeight: opt === d.correctAnswer ? 'bold' : 'normal', color: opt === d.correctAnswer ? '#166534' : '#334155' }}>
              {opt} {opt === d.correctAnswer && '✅'}
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: '0.5px solid #e2e8f0', margin: '20px 0' }} />

      {/* 📘 AI विश्लेषणाचे कप्पे (Accordion/Tabs चा लुक) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={sectionStyle('#eff6ff', '#1e40af')}>
          <strong>📝 स्पष्टीकरण (Explain Answer):</strong>
          <p style={{ margin: '5px 0 0 0', color: '#1e3a8a' }}>{d.explainAnswer}</p>
        </div>

        <div style={sectionStyle('#f0fdf4', '#166534')}>
          <strong>✔️ हेच उत्तर का बरोबर आहे? (Why Correct):</strong>
          <p style={{ margin: '5px 0 0 0' }}>{d.whyCorrect}</p>
        </div>

        <div style={sectionStyle('#fef2f2', '#991b1b')}>
          <strong>❌ इतर पर्याय का चुकीचे आहेत? (Why Others Wrong):</strong>
          <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-line' }}>{d.whyOthersWrong}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={sectionStyle('#fdf4ff', '#701a75')}>
            <strong>⚡ शॉर्ट ट्रिक (Short Trick):</strong>
            <p style={{ margin: '5px 0 0 0' }}>{d.shortTrick}</p>
          </div>
          <div style={sectionStyle('#fff7ed', '#9a3412')}>
            <strong>🧠 मेमरी ट्रिक / लक्षात ठेवण्याची युक्ती:</strong>
            <p style={{ margin: '5px 0 0 0' }}>{d.memoryTrick}</p>
          </div>
        </div>

        <div style={sectionStyle('#f8fafc', '#334155')}>
          <strong>📋 महत्वाच्या नोट्स (Important Notes):</strong>
          <p style={{ margin: '5px 0 0 0' }}>{d.importantNotes}</p>
        </div>

        <div style={sectionStyle('#f0fdfa', '#115e59')}>
          <strong>🔗 संबंधित इतर प्रश्न (Related Questions):</strong>
          <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
            {d.relatedQuestions.map((q, idx) => <li key={idx}>{q}</li>)}
          </ul>
        </div>

        {/* 📊 परीक्षेची फ्रिक्वेन्सी आणि प्रेडिक्शन मेट्रिक्स */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
          <div style={metricStyle}>📋 पोलीस भरती फ्रिक्वेन्सी: <br/><strong>{d.policeFrequency}</strong></div>
          <div style={metricStyle}>🏛️ MPSC फ्रिक्वेन्सी: <br/><strong>{d.mpscFrequency}</strong></div>
          <div style={metricStyle}>📶 काठिण्य पातळी (Difficulty): <br/><strong>{d.difficultyLevel}</strong></div>
          <div style={metricStyle}>🔮 भविष्यात येण्याची शक्यता: <br/><strong style={{ color: '#2563eb' }}>{d.futureProbability}</strong></div>
        </div>

      </div>
    </div>
  );
}

// सोप्या इनलाईन स्टाईल्स
const sectionStyle = (bgColor: string, textColor: string) => ({
  backgroundColor: bgColor,
  color: textColor,
  padding: '12px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.5'
});

const metricStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  padding: '10px',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#475569',
  border: '1px solid #e2e8f0'
};