'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Maximize2, ShieldAlert, Clock, AlertTriangle, 
  ChevronLeft, ChevronRight, Bookmark, Calculator, CheckCircle 
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  subject: string;
}

interface PaletteStatus {
  status: 'Not Visited' | 'Answered' | 'Skipped' | 'Reviewed';
  selectedOption: number | null;
  isBookmarked: boolean;
}

export default function RealExamEnvironment() {
  const params = useParams();
  const router = useRouter();
  
  // 💡 फिक्स: जर URL मध्ये paperId नसेल (उदा. होमपेज), तर डिफॉल्ट १ घ्या
  const paperId = params?.paperId || 1; 

  // State Management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [palette, setPalette] = useState<Record<number, PaletteStatus>>({});
  const [timeLeft, setTimeLeft] = useState<number>(5400); // Default 90 mins
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [warningCount, setWarningCount] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showCalc, setShowCalc] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = 1; // टेस्टसाठी तात्पुरता युझर आयडी १

  // 1. 🔄 डेटाबेसमधून खरे प्रश्न आणि जुनी प्रोग्रेस लोड करणे
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/papers/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, paperId: Number(paperId) })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setQuestions(data.questions);
          setTimeLeft(data.timeLeftSeconds);

          const initialPalette: Record<number, PaletteStatus> = {};
          data.questions.forEach((q: any, idx: number) => {
            const savedProgress = data.savedAnswers?.[q.id];
            const isBookmarked = data.bookmarks?.includes(q.id) || false;

            initialPalette[idx] = {
              status: savedProgress !== undefined && savedProgress !== null 
                ? 'Answered' 
                : (idx === 0 ? 'Skipped' : 'Not Visited'),
              selectedOption: savedProgress !== undefined && savedProgress !== null ? savedProgress : null,
              isBookmarked: isBookmarked
            };
          });
          setPalette(initialPalette);
        } else {
          alert("परीक्षा डेटा लोड करता आला नाही: " + (data.message || "Error"));
        }
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        alert("बॅकएंड सर्व्हर बंद आहे किंवा कनेक्शन प्रॉब्लेम आहे!");
      } finally {
        // 💡 हा सर्वात महत्त्वाचा भाग: काहीही झाले तरी लोडिंग थांबवा!
        setLoading(false);
      }
    };

    // 💡 फिक्स: आता हे नेहमी रन होईल आणि लोडिंग स्क्रीन अडकणार नाही
    fetchExamData();
  }, [paperId]);

  // 2. ⏳ लाईव्ह टायमर आणि ऑटो-सबमिट
  useEffect(() => {
    if (loading || timeLeft <= 0) {
      if (timeLeft === 0 && !isSubmitting) triggerAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  // 3. 🛡️ टॅब स्विच डिटेक्शन (Anti-Cheat)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            triggerAutoSubmit();
          } else {
            setShowWarning(true);
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [questions, palette, timeLeft]);

  // फुलस्क्रीन ट्रिगर
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    }
  };

  // 4. 💾 ऑटो-सेव्ह एपीआय (पर्याय निवडल्यावर बॅकएंडला डेटा पाठवणे)
  const handleOptionSelect = async (optIdx: number) => {
    const currentQuestion = questions[currentIdx];
    
    setPalette(prev => ({
      ...prev,
      [currentIdx]: { ...prev[currentIdx], selectedOption: optIdx, status: 'Answered' }
    }));

    try {
      await fetch(`${BACKEND_URL}/api/papers/save-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          paperId: Number(paperId),
          questionId: currentQuestion.id,
          selectedOption: optIdx,
          status: 'Answered',
          timeLeftSeconds: timeLeft,
          isBookmarked: palette[currentIdx]?.isBookmarked || false
        })
      });
    } catch (err) {
      console.error("❌ ऑटो-सेव्ह एरर:", err);
    }
  };

  // 5. 🛑 फायनल सबमिट आणि गुण मोजणी
  const triggerAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/papers/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, paperId: Number(paperId) })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`🏁 परीक्षा सबमिट झाली आहे!\n🎯 तुमचे एकूण गुण: ${data.score}\n✅ अचूक उत्तरे: ${data.correctAnswers}\n❌ चुकीची उत्तरे: ${data.wrongAnswers}`);
        router.push('/');
      } else {
        alert("सबमिट करताना त्रुटी आली: " + data.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("❌ सबमिशन एरर:", err);
      alert("सर्व्हर एररमुळे परीक्षा सबमिट होऊ शकली नाही!");
      setIsSubmitting(false);
    }
  };

  const clearResponse = async () => {
    const currentQuestion = questions[currentIdx];
    setPalette(prev => ({
      ...prev,
      [currentIdx]: { ...prev[currentIdx], selectedOption: null, status: 'Skipped' }
    }));

    try {
      await fetch(`${BACKEND_URL}/api/papers/save-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          paperId: Number(paperId),
          questionId: currentQuestion.id,
          selectedOption: null,
          status: 'Skipped',
          timeLeftSeconds: timeLeft,
          isBookmarked: palette[currentIdx]?.isBookmarked || false
        })
      });
    } catch (err) {}
  };

  const toggleBookmark = async () => {
    const currentQuestion = questions[currentIdx];
    const nextBookmarkState = !palette[currentIdx]?.isBookmarked;

    setPalette(prev => ({
      ...prev,
      [currentIdx]: {
        ...prev[currentIdx],
        isBookmarked: nextBookmarkState,
        status: prev[currentIdx].status === 'Answered' ? 'Answered' : 'Reviewed'
      }
    }));

    try {
      await fetch(`${BACKEND_URL}/api/papers/save-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          paperId: Number(paperId),
          questionId: currentQuestion.id,
          selectedOption: palette[currentIdx]?.selectedOption,
          status: palette[currentIdx]?.status === 'Answered' ? 'Answered' : 'Reviewed',
          timeLeftSeconds: timeLeft,
          isBookmarked: nextBookmarkState
        })
      });
    } catch (err) {}
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (palette[nextIdx]?.status === 'Not Visited') {
        setPalette(prev => ({ ...prev, [nextIdx]: { ...prev[nextIdx], status: 'Skipped' } }));
      }
    }
  };

  const handlePrev = () => { if (currentIdx > 0) setCurrentIdx(currentIdx - 1); };
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const total = questions.length;
  const answered = Object.values(palette).filter(p => p.status === 'Answered').length;
  const reviewed = Object.values(palette).filter(p => p.status === 'Reviewed').length;
  const skipped = Object.values(palette).filter(p => p.status === 'Skipped').length;
  const notVisited = total - (answered + reviewed + skipped);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">डेटाबेस मधून थेट २०२६ चे प्रश्न लोड होत आहेत... ⏳</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {!isFullscreen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="w-20 h-20 text-amber-500 animate-pulse mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-white">परीक्षा पर्यावरण लॉक केले आहे</h1>
          <p className="text-slate-400 max-w-md mb-6 text-sm">TCS-IBPS नियमांनुसार ही परीक्षा केवळ फुलस्क्रीन मोडमध्येच दिली जाऊ शकते.</p>
          <button onClick={enterFullscreen} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg transition duration-200 flex items-center gap-2">
            <Maximize2 className="w-5 h-5" /> फुलस्क्रीन मोड सुरू करा
          </button>
        </div>
      )}

      {showWarning && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 font-bold text-lg mb-2"><AlertTriangle className="w-6 h-6" /> चेतावणी!</div>
            <p className="text-slate-300 text-sm mb-4">तुम्ही विंडो बदलण्याचा प्रयत्न केला. ३ चेतावणीनंतर परीक्षा ऑटो-सबमिट होईल.<br/><span className="text-red-400 font-semibold">काउंट: {warningCount}/3</span></p>
            <button onClick={() => setShowWarning(false)} className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm font-medium transition">मला समजले</button>
          </div>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-base font-bold text-blue-400">मुंबई पोलीस शिपाई परीक्षा २०२६</h2>
          <p className="text-xs text-slate-400">उमेदवार आयडी: #00{userId}</p>
        </div>
        <div className={`flex items-center gap-3 px-4 py-1.5 rounded-lg border ${timeLeft < 300 ? 'bg-red-950/40 border-red-700 text-red-400 animate-pulse' : 'bg-slate-950 border-slate-800 text-emerald-400'}`}>
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg font-bold tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="h-1.5 w-full bg-slate-800 flex">
        <div style={{ width: `${total ? (answered/total)*100 : 0}%` }} className="bg-emerald-500 transition-all duration-300"></div>
        <div style={{ width: `${total ? (reviewed/total)*100 : 0}%` }} className="bg-purple-500 transition-all duration-300"></div>
        <div style={{ width: `${total ? (skipped/total)*100 : 0}%` }} className="bg-amber-500 transition-all duration-300"></div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <span className="px-3 py-1 bg-slate-800 rounded text-xs font-semibold text-slate-300 uppercase">विषय: {questions[currentIdx]?.subject || "सामान्य ज्ञान"}</span>
            <span className="text-sm font-medium text-slate-400">प्रश्न: <span className="text-white text-base font-bold">{questions.length > 0 ? currentIdx + 1 : 0}</span> / {total}</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 mb-6 min-h-[140px]">
            <p className="text-lg leading-relaxed text-slate-100 font-medium">
              {questions[currentIdx]?.question_text || "बॅकएंड सर्व्हर चालू नसल्यामुळे प्रश्न लोड झालेले नाहीत. कृपया बॅकएंड सर्व्हर सुरू करा."}
            </p>
          </div>

          <div className="space-y-3 flex-1">
            {questions[currentIdx]?.options?.map((option, oIdx) => {
              const isSelected = palette[currentIdx]?.selectedOption === oIdx;
              return (
                <button key={oIdx} onClick={() => handleOptionSelect(oIdx)} className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 flex items-center gap-4 ${isSelected ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300'}`}>
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{String.fromCharCode(65 + oIdx)}</span>
                  <span className="text-base font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-6 border-t border-slate-800 pt-4">
            <div className="flex gap-2">
              <button onClick={clearResponse} disabled={questions.length === 0} className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-lg text-sm transition">उत्तर साफ करा</button>
              <button onClick={toggleBookmark} disabled={questions.length === 0} className={`px-4 py-2 border rounded-lg text-sm transition flex items-center gap-1.5 ${palette[currentIdx]?.isBookmarked ? 'bg-purple-950/40 border-purple-600 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}><Bookmark className="w-4 h-4" /> रिव्ह्यूसाठी ठेवा</button>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePrev} disabled={currentIdx === 0} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" /> मागे</button>
              <button onClick={handleNext} disabled={currentIdx === total - 1 || questions.length === 0} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-30 transition flex items-center gap-1 text-sm font-semibold">पुढील प्रश्न <ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 grid grid-cols-2 gap-2 text-xs font-medium">
            <div className="flex items-center gap-2 text-emerald-400"><span className="w-3 h-3 rounded bg-emerald-500 block"></span>उत्तर दिलेले ({answered})</div>
            <div className="flex items-center gap-2 text-purple-400"><span className="w-3 h-3 rounded bg-purple-500 block"></span>रिव्ह्यू ({reviewed})</div>
            <div className="flex items-center gap-2 text-amber-500"><span className="w-3 h-3 rounded bg-amber-500 block"></span>सोडवलेले ({skipped})</div>
            <div className="flex items-center gap-2 text-slate-400"><span className="w-3 h-3 rounded bg-slate-700 block"></span>न पाहिलेले ({notVisited})</div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">प्रश्न पॅलेट (Palette)</p>
            <div className="grid grid-cols-4 gap-2.5">
              {questions.map((_, idx) => {
                const box = palette[idx];
                let bgClass = "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700";
                if (box?.status === 'Answered') bgClass = "bg-emerald-600 border-emerald-500 text-white font-bold ring-2 ring-emerald-950 shadow-md";
                else if (box?.status === 'Reviewed') bgClass = "bg-purple-600 border-purple-500 text-white font-bold shadow-md";
                else if (box?.status === 'Skipped') bgClass = "bg-amber-600 border-amber-500 text-white font-bold shadow-md";

                return (
                  <button key={idx} onClick={() => setCurrentIdx(idx)} className={`h-11 rounded-lg border text-sm font-semibold transition-all duration-100 flex items-center justify-center relative ${bgClass} ${currentIdx === idx ? 'ring-2 ring-blue-400 scale-105' : ''}`}>
                    {idx + 1}
                    {box?.isBookmarked && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-400 rounded-full border border-slate-900"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 space-y-2.5 bg-slate-950/30">
            <button onClick={() => setShowCalc(!showCalc)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition flex items-center justify-center gap-2 font-medium border border-slate-700">
              <Calculator className="w-4 h-4 text-blue-400" /> {showCalc ? "कॅल्क्युलेटर बंद करा" : "कॅल्क्युलेटर (Calculator)"}
            </button>
            {showCalc && <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs text-slate-400">🧮 ऑन-स्क्रीन कॅल्क्युलेटर केवळ सराव हेतूसाठी उपलब्ध आहे.</div>}
            <button onClick={triggerAutoSubmit} disabled={isSubmitting || questions.length === 0} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg transition duration-150 flex items-center justify-center gap-2 border border-emerald-500 disabled:opacity-50">
              <CheckCircle className="w-4 h-4" /> परीक्षा सबमिट करा (Submit)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}