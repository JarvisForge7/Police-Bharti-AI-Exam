"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Award
} from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params.paperId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(5400); // 90 मिनिटे (Seconds)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // १. प्रश्नपत्रिका लोड करणे
    async function fetchPaperQuestions() {
      try {
        const res = await fetch(`http://localhost:5000/api/exam/papers/${paperId}/questions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        const data = await res.json();

        if (data.success && data.data?.questions?.length > 0) {
          setQuestions(data.data.questions);
        } else {
          // Fallback Dummy Questions (जर डेटाबेसमध्ये नसेल)
          setQuestions([
            {
              id: 101,
              question_text: 'भारतीय राज्यघटनेचे "हृदय आणि आत्मा" (Heart and Soul) म्हणून कोणत्या कलमाला ओळखले जाते?',
              option_a: 'कलम १४',
              option_b: 'कलम १९',
              option_c: 'कलम ३२',
              option_d: 'कलम २१',
            },
            {
              id: 102,
              question_text: 'महाराष्ट्रात एकूण किती महसुली विभाग आहेत?',
              option_a: '५',
              option_b: '६',
              option_c: '७',
              option_d: '८',
            },
            {
              id: 103,
              question_text: 'खालीलपैकी कोणती नदी महाराष्ट्रातून उगम पावून पूर्वेकडे वाहते?',
              option_a: 'नर्मदा',
              option_b: 'तापी',
              option_c: 'गोदावरी',
              option_d: 'उल्हास',
            },
          ]);
        }
      } catch (err) {
        console.error("Exam Load Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPaperQuestions();
  }, [paperId]);

  // २. टायमर रिव्हर्स काउंटडाऊन
  useEffect(() => {
    if (timeLeft <= 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  // ३. पर्याय निवडणे
  const handleSelectOption = (questionId: number, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // ४. पेपर सबमिट करणे
  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          paperId,
          answers,
          timeTakenSeconds: 5400 - timeLeft,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        // Dummy Score Fallback
        setResult({
          score: Object.keys(answers).length * 2,
          correctCount: Object.keys(answers).length,
          wrongCount: questions.length - Object.keys(answers).length,
          coinsEarned: Object.keys(answers).length * 4,
        });
      }
    } catch (err) {
      alert("पेपर सबमिट करताना एरर आला!");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center font-sans">
        <p className="animate-pulse">परीक्षा लोड होत आहे, कृपया वाट पाहा...</p>
      </div>
    );
  }

  // नमुन्याचे निकाल स्क्रीन (RESULT SCREEN)
  if (result) {
    return (
      <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">परीक्षेचा निकाल (Result)</h2>
            <p className="text-xs text-slate-400 mt-1">अभिनंदन! तुम्ही परीक्षा पूर्ण केली आहे.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">एकूण गुण</span>
              <p className="text-xl font-bold text-emerald-400">{result.score || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">मिळालेले कॉइन्स</span>
              <p className="text-xl font-bold text-amber-400">+{result.coinsEarned || 0} Coins</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">बरोबर उत्तरे</span>
              <p className="text-xl font-bold text-blue-400">{result.correctCount || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">चुकीची उत्तरे</span>
              <p className="text-xl font-bold text-rose-400">{result.wrongCount || 0}</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
          >
            मुख्य डॅशबोर्डवर जा
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      
      {/* EXAM TOP BAR */}
      <header className="bg-slate-900/90 border-b border-slate-800 p-4 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">बाहेर पडा</span>
          </Link>

          {/* TIMER */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-amber-400 font-mono font-bold text-base">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmitExam}
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>पेपर सबमिट करा</span>
          </button>
        </div>
      </header>

      {/* EXAM MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* QUESTION BOX (LEFT 3 COLS) */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md space-y-6">
            
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/80 pb-4">
              <span className="font-semibold text-blue-400">प्रश्न क्र. {currentIndex + 1} / {questions.length}</span>
              <span>१ गुण</span>
            </div>

            <h2 className="text-base md:text-lg font-semibold text-slate-100 leading-relaxed">
              {currentQ?.question_text}
            </h2>

            {/* OPTIONS GRID */}
            <div className="space-y-3 pt-2">
              {[
                { key: 'A', text: currentQ?.option_a },
                { key: 'B', text: currentQ?.option_b },
                { key: 'C', text: currentQ?.option_c },
                { key: 'D', text: currentQ?.option_d },
              ].map((opt) => {
                const isSelected = answers[currentQ?.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(currentQ?.id, opt.key)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white font-medium'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700/60 text-slate-300'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm">{opt.text}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                  </button>
                );
              })}
            </div>

          </div>

          {/* PREV / NEXT NAVIGATION */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              मागचा प्रश्न
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
            >
              पुढचा प्रश्न
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* QUESTION PALETTE (RIGHT 1 COL) */}
        <aside className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md h-fit space-y-4">
          <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">प्रश्न तक्ता (Question Palette)</h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : isAnswered
                      ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-600/30 border border-emerald-500/50 inline-block" />
              <span>सोडवलेले प्रश्न ({Object.keys(answers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-800 inline-block" />
              <span>बाकी राहिलेले ({questions.length - Object.keys(answers).length})</span>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}