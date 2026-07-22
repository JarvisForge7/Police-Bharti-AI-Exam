'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface SubjectData {
  total: number;
  correct: number;
  wrong: number;
}

interface AIAnalysis {
  explain_answer: string;
  why_correct: string;
  why_others_wrong: string;
  short_trick: string;
  memory_trick: string;
  important_notes: string;
  related_questions: string[];
  police_frequency: string;
  mpsc_frequency: string;
  difficulty_level: string;
  future_probability: string;
}

interface QuestionData {
  id: number;
  question_text: string;
  options: string[];
  correct_option_index: number;
  ai_analysis: AIAnalysis | null;
}

interface AnalyticsData {
  marks: number;
  rank: number;
  total_students: number;
  percentile: string;
  accuracy: string;
  speed: string;
  time_taken: number;
  correct: number;
  wrong: number;
  skipped: number;
  subject_wise: Record<string, SubjectData>;
  topic_wise: {
    strong: string[];
    weak: string[];
  };
}

const dummyFallbackData: AnalyticsData = {
  marks: 82.00,
  rank: 12,
  total_students: 150,
  percentile: "92.00",
  accuracy: "87.23",
  speed: "54.00",
  time_taken: 5400,
  correct: 82,
  wrong: 12,
  skipped: 6,
  subject_wise: {
    "मराठी व्याकरण": { total: 25, correct: 22, wrong: 3 },
    "गणित व बुद्धिमत्ता": { total: 25, correct: 18, wrong: 7 },
    "सामान्य ज्ञान": { total: 50, correct: 42, wrong: 8 }
  },
  topic_wise: {
    strong: ["विभक्ती विचार", "वर्णमाला", "भारताचा इतिहास", "नफा-तोटा"],
    weak: ["काळ-काम-वेग", "लसावि-मसावि", "चालू घडामोडी"]
  }
};

export default function ResultPage() {
  const userId = "550e8400-e29b-41d4-a716-446655440000"; 
  const testId = "1";
  const paperId = "1"; // 👈 तुमच्या गरजेनुसार हा पेपर ID डायनॅमिक करू शकता

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]); // 👈 बॅकएंडचे खरे प्रश्न साठवण्यासाठी
  const [loading, setLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // १. निकाल आणि विश्लेषण डेटा फेच करणे
        const analyticsRes = await fetch(`http://localhost:5000/api/analytics/report/${userId}/${testId}`);
        if (!analyticsRes.ok) throw new Error("Analytics not found");
        const analyticsResult = await analyticsRes.json();
        if (analyticsResult.success && analyticsResult.data) {
          setAnalytics(analyticsResult.data);
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        setAnalytics(dummyFallbackData);
        setIsDummy(true);
      }

      try {
        // २. बॅकएंडवरून AI Teacher डेटासह सर्व प्रश्न फेच करणे (स्टेप ३ चा नवीन एंडपॉइंट)
        const questionsRes = await fetch(`http://localhost:5000/api/paper/solution/${paperId}`);
        if (questionsRes.ok) {
          const questionsResult = await questionsRes.json();
          if (questionsResult.success && questionsResult.data) {
            setQuestions(questionsResult.data);
          }
        }
      } catch (error) {
        console.error("प्रश्न लोड करताना एरर आली:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const downloadPDF = () => { window.print(); };

  const shareResult = async () => {
    if (navigator.share && analytics) {
      try {
        await navigator.share({
          title: '🏅 माझा टेस्ट निकाल!',
          text: `मी परीक्षेत १०० पैकी ${analytics.marks} गुण मिळवून महाराष्ट्र रँक #${analytics.rank} मिळवली आहे! 🎯`,
          url: window.location.href,
        });
      } catch (e) { console.log(e); }
    } else if (analytics) {
      const message = encodeURIComponent(`🏅 *माझा टेस्ट निकाल!* \n\nमी सराव परीक्षेत *${analytics.marks}* गुण मिळवून महाराष्ट्र रँक *#${analytics.rank}* मिळवली आहे! 🎯`);
      window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>📊 विश्लेषण लोड होत आहे, कृपया थांबा...</div>;
  if (!analytics) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>❌ निकाल सापडला नाही!</div>;

  const pieData = [
    { name: 'बरोबर (Correct)', value: Number(analytics.correct), color: '#22c55e' },
    { name: 'चुकीचे (Wrong)', value: Number(analytics.wrong), color: '#ef4444' },
    { name: 'सोडलेले (Skipped)', value: Number(analytics.skipped), color: '#94a3b8' }
  ];

  const barData = Object.keys(analytics.subject_wise || {}).map(subject => ({
    name: subject,
    'प्राप्त गुण': analytics.subject_wise[subject].correct,
    'एकूण प्रश्न': analytics.subject_wise[subject].total
  }));

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {isDummy && (
        <div className="no-print" style={{ padding: '10px', backgroundColor: '#fef3c7', color: '#d97706', textAlign: 'center', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ सध्या डेटाबेस रिकामा असल्याने हा नमुना (Preview) डेटा दाखवला आहे.
        </div>
      )}

      <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '30px' }}>📊 तुमचा प्रगत परीक्षा निकाल व विश्लेषण</h2>

      {/* बटन्स */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={downloadPDF} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📥 निकाल PDF डाउनलोड करा</button>
        <button onClick={shareResult} style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔗 निकाल शेअर करा</button>
      </div>

      {/* मुख्य कार्ड्स */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}><h3 style={cardTitleStyle}>गुण (Marks)</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{analytics.marks}</p></div>
        <div style={cardStyle}><h3 style={cardTitleStyle}>महाराष्ट्र रँक (Rank)</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>🏅 #{analytics.rank} <span style={{ fontSize: '14px', color: '#64748b' }}>({analytics.total_students} पैकी)</span></p></div>
        <div style={cardStyle}><h3 style={cardTitleStyle}>पर्सेंटाईल (Percentile)</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0d9488', margin: 0 }}>⚡ {analytics.percentile}%</p></div>
        <div style={cardStyle}><h3 style={cardTitleStyle}>अचूकता (Accuracy)</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>🎯 {analytics.accuracy}%</p></div>
        <div style={cardStyle}><h3 style={cardTitleStyle}>वेग (Avg Speed)</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', margin: 0 }}>⏱️ {analytics.speed} से/प्रश्न</p></div>
      </div>

      <hr style={{ border: '0.5px solid #cbd5e1', marginBottom: '30px' }} />

      {/* चार्ट्स */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={chartContainerStyle}>
          <h4 style={{ textAlign: 'center', color: '#334155', margin: '0 0 15px 0' }}>प्रश्नांची अचूकता स्थिती</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={chartContainerStyle}>
          <h4 style={{ textAlign: 'center', color: '#334155', margin: '0 0 15px 0' }}>विषय निहाय कामगिरी</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="प्राप्त गुण" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="एकूण प्रश्न" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* टॉपिक्स विश्लेषण */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ ...topicCardStyle, borderTop: '5px solid #22c55e', backgroundColor: '#f0fdf4' }}>
          <h4 style={{ color: '#15803d', margin: '0 0 10px 0' }}>💪 तुमचे मजबूत घटक (Strong Topics)</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {analytics.topic_wise?.strong?.map((topic, index) => <li key={index} style={{ color: '#166534', padding: '3px 0' }}>{topic}</li>)}
          </ul>
        </div>
        <div style={{ ...topicCardStyle, borderTop: '5px solid #ef4444', backgroundColor: '#fef2f2' }}>
          <h4 style={{ color: '#b91c1c', margin: '0 0 10px 0' }}>⚠️ तुमचे कच्चे घटक (Weak Topics)</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {analytics.topic_wise?.weak?.map((topic, index) => <li key={index} style={{ color: '#991b1b', padding: '3px 0' }}>{topic}</li>)}
          </ul>
        </div>
      </div>

      <hr style={{ border: '0.5px solid #cbd5e1', marginBottom: '40px' }} />

      {/* 🤖 ----------------- MODULE 6: AI TEACHER LIVE SECTION START ----------------- */}
      <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #3b82f6', paddingBottom: '10px' }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px' }}>AI Teacher (कृत्रिम बुद्धिमत्ता शिक्षक)</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>सर्व प्रश्नांचे सखोल आणि लाइव्ह विश्लेषण</p>
          </div>
        </div>

        {/* डेटाबेस मधील सर्व प्रश्नांवर लूप फिरवून प्रत्येक प्रश्नाचा AI Teacher विभाग तयार होईल */}
        {questions.map((q, qIdx) => {
          const ai = q.ai_analysis;
          const correctOptText = q.options[q.correct_option_index];

          return (
            <div key={q.id} style={{ padding: '25px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              
              {/* प्रश्न */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '17px', color: '#1e293b', marginBottom: '12px' }}>
                  प्रश्न {qIdx + 1}: {q.question_text}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct_option_index;
                    return (
                      <div key={i} style={{ padding: '12px', borderRadius: '6px', border: isCorrect ? '2px solid #22c55e' : '1px solid #cbd5e1', backgroundColor: isCorrect ? '#f0fdf4' : '#f8fafc', fontWeight: isCorrect ? 'bold' : 'normal', color: isCorrect ? '#166534' : '#334155' }}>
                        {opt} {isCorrect && '✅'}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* जर त्या प्रश्नाला AI विश्लेषण उपलब्ध असेल तरच दाखवा */}
              {ai ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {ai.explain_answer && <div style={sectionStyle('#eff6ff', '#1e40af')}><strong>📝 स्पष्टीकरण (Explain Answer):</strong><p style={{ margin: '5px 0 0 0' }}>{ai.explain_answer}</p></div>}
                  {ai.why_correct && <div style={sectionStyle('#f0fdf4', '#166534')}><strong>✔️ हेच उत्तर का बरोबर आहे? (Why Correct):</strong><p style={{ margin: '5px 0 0 0' }}>{ai.why_correct}</p></div>}
                  {ai.why_others_wrong && <div style={sectionStyle('#fef2f2', '#991b1b')}><strong>❌ इतर पर्याय का चुकीचे आहेत? (Why Others Wrong):</strong><p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-line' }}>{ai.why_others_wrong}</p></div>}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    {ai.short_trick && <div style={sectionStyle('#fdf4ff', '#701a75')}><strong>⚡ शॉर्ट ट्रिक (Short Trick):</strong><p style={{ margin: '5px 0 0 0' }}>{ai.short_trick}</p></div>}
                    {ai.memory_trick && <div style={sectionStyle('#fff7ed', '#9a3412')}><strong>🧠 मेमरी ट्रिक / लक्षात ठेवण्याची युक्ती:</strong><p style={{ margin: '5px 0 0 0' }}>{ai.memory_trick}</p></div>}
                  </div>

                  {ai.important_notes && <div style={sectionStyle('#f8fafc', '#334155')}><strong>📋 महत्वाच्या नोट्स (Important Notes):</strong><p style={{ margin: '5px 0 0 0' }}>{ai.important_notes}</p></div>}
                  
                  {ai.related_questions && ai.related_questions.length > 0 && (
                    <div style={sectionStyle('#f0fdfa', '#115e59')}><strong>🔗 संबंधित इतर प्रश्न (Related Questions):</strong><ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>{ai.related_questions.map((rq, idx) => <li key={idx}>{rq}</li>)}</ul></div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
                    {ai.police_frequency && <div style={metricStyle}>📋 पोलीस भरती फ्रिक्वेन्सी: <br/><strong>{ai.police_frequency}</strong></div>}
                    {ai.mpsc_frequency && <div style={metricStyle}>🏛️ MPSC फ्रिक्वेन्सी: <br/><strong>{ai.mpsc_frequency}</strong></div>}
                    {ai.difficulty_level && <div style={metricStyle}>📶 काठिण्य पातळी: <br/><strong>{ai.difficulty_level}</strong></div>}
                    {ai.future_probability && <div style={metricStyle}>🔮 भविष्यात येण्याची शक्यता: <br/><strong style={{ color: '#2563eb' }}>{ai.future_probability}</strong></div>}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>💡 या प्रश्नाचे AI विश्लेषण उपलब्ध नाही.</p>
              )}

            </div>
          );
        })}
      </div>
      {/* 🤖 ----------------- MODULE 6: AI TEACHER LIVE SECTION END ----------------- */}

    </div>
  );
}

// CSS Styles
const cardStyle: React.CSSProperties = { backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'center', border: '1px solid #e2e8f0' };
const cardTitleStyle: React.CSSProperties = { margin: '0 0 8px 0', fontSize: '16px', color: '#475569' };
const chartContainerStyle: React.CSSProperties = { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '45%', minWidth: '320px' };
const topicCardStyle: React.CSSProperties = { padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)' };
const sectionStyle = (bgColor: string, textColor: string) => ({ backgroundColor: bgColor, color: textColor, padding: '12px', borderRadius: '8px', fontSize: '14px', lineHeight: '1.5' });
const metricStyle: React.CSSProperties = { backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '6px', fontSize: '13px', color: '#475569', border: '1px solid #e2e8f0' };

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@media print { .no-print { display: none !important; } }`;
  document.head.appendChild(style);
}