'use client';

import React, { useState, useEffect } from 'react';

export default function AdvancedTestGenerator() {
  // सर्च आणि फिल्टर्स स्टेट्स
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ⏱️ Instant Search Suggestions Logic (सुधारित आणि एरर सुरक्षित) ✅
  useEffect(() => {
    if (keyword.length < 3) {
      setSuggestions([]);
      return;
    }
    
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/quiz/suggestions?q=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        // कॉन्सोलमध्ये एरर लॉग करा पण स्क्रीन क्रॅश होऊ देऊ नका
        console.log("Suggestions fetch failed (बॅकएंड बंद असू शकते):", err);
        setSuggestions([]); // एरर आल्यास सजेशन्स रिकामे करा
      }
    }, 300); // डिले ३००० वरून ३०० केला जेणेकरून इन्स्टंट रिस्पॉन्स मिळेल ⚡

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  // 🎙️ Voice Search (आवाज ओळखून सर्च करणे)
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("तुमच्या ब्राउझरमध्ये व्हॉइस सर्च उपलब्ध नाही भाऊ! 🎙️");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'mr-IN'; // मराठी भाषा सपोर्ट
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setKeyword(transcript);
    };

    recognition.start();
  };

  // 🚀 चाचणी जनरेट करण्याचे मुख्य फंक्शन
  const handleGenerateTest = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/quiz/search-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          district: selectedDistrict,
          year: selectedYear,
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          topic: selectedTopic,
          count: questionCount
        })
      });

      const result = await response.json();
      if (result.success && result.questions.length > 0) {
        localStorage.setItem('active_quiz_questions', JSON.stringify(result.questions));
        window.location.href = '/student/quiz';
      } else {
        alert('या फिल्टरनुसार डेटाबेसमध्ये प्रश्न सापडले नाहीत भाऊ! दुसरे फिल्टर वापरून बघा. 🎯');
      }
    } catch (err) {
      console.error(err);
      alert('सर्व्हर एरर! कृपया बॅकएंड चालू आहे का ते तपासा.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '30px 20px', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '6px' }}>⚙️ ॲडव्हान्स्ड सराव चाचणी जनरेटर</h2>
        <p style={{ color: '#475569', margin: 0 }}>हवे तसे प्रश्न शोधा, फिल्टर करा आणि तुमची स्वतःची मॉक test तयार करा.</p>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* 🔍 INSTANT SEARCH BAR WITH VOICE */}
        <div style={{ marginBottom: '25px', position: 'relative' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>🔎 प्रश्न किंवा कीवर्ड शोधा (Instant Search)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="उदा. इतिहास, सरन्यायाधीश, कलम..." 
              style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
            />
            <button 
              onClick={handleVoiceSearch}
              style={{ padding: '0 15px', backgroundColor: isListening ? '#ef4444' : '#64748b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
            >
              {isListening ? '🎙️...' : '🎤'}
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {suggestions.map((s, idx) => (
                <div key={idx} onClick={() => { setKeyword(s); setSuggestions([]); }} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                  💡 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🎛️ FILTERS GRID */}
        <h3 style={{ fontSize: '16px', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>🎯 निकष निवडा (Search By Filters)</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          
          {/* District */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>📍 जिल्हा (District)</label>
            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="">सर्व जिल्हे</option>
              <option value="मुंबई">मुंबई</option>
              <option value="पुणे">पुणे</option>
              <option value="नाशिक">नाशिक</option>
              <option value="नागपूर">नागपूर</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>📅 वर्ष (Year)</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="">सर्व वर्षे</option>
              <option value="2026">२०२६</option>
              <option value="2025">२०२५</option>
              <option value="2024">२०२४</option>
              <option value="2023">२०२३</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>📚 विषय (Subject)</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="">सर्व विषय</option>
              <option value="सामान्य ज्ञान">सामान्य ज्ञान (GK)</option>
              <option value="अंकगणित">अंकगणित</option>
              <option value="बुद्धिमत्ता">बुद्धिमत्ता चाचणी</option>
              <option value="मराठी व्याकरण">मराठी व्याकरण</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>⚡ काठिण्य पातळी (Difficulty)</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="">सर्व पातळी</option>
              <option value="Easy">सोपे (Easy)</option>
              <option value="Medium">मध्यम (Medium)</option>
              <option value="Hard">कठीण (Hard)</option>
            </select>
          </div>

        </div>

        {/* Topic & Count */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '35px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>🧩 उप-घटक (Topic)</label>
            <input 
              type="text" 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="उदा. इतिहास, भूगोल, नफा-तोटा..." 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>🔢 प्रश्नांची संख्या</label>
            <select value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>
              <option value="5">५ प्रश्न</option>
              <option value="10">१० प्रश्न</option>
              <option value="20">२० प्रश्न</option>
              <option value="25">२५ प्रश्न</option>
              <option value="50">५० प्रश्न</option>
            </select>
          </div>
        </div>

        {/* 🔥 GENERATE BUTTON */}
        <button
          onClick={handleGenerateTest}
          disabled={isGenerating}
          style={{
            width: '100%', padding: '16px', backgroundColor: isGenerating ? '#cbd5e1' : '#2563eb',
            color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
            cursor: isGenerating ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}
        >
          {isGenerating ? '⏳ फिल्टर्सनुसार टेस्ट जनरेट होत आहे...' : '🚀 कस्टमाइज्ड चाचणी सुरू करा'}
        </button>

      </div>
    </div>
  );
}