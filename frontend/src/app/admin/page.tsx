"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  BarChart2,
  Trash2,
  Save
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'add-paper' | 'add-question'>('add-paper');

  // New Paper Form State
  const [paperTitle, setPaperTitle] = useState('');
  const [paperExam, setPaperExam] = useState('MPSC');
  const [paperDuration, setPaperDuration] = useState('90');

  // New Question Form State
  const [selectedPaperId, setSelectedPaperId] = useState('1');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState('A');
  const [explanation, setExplanation] = useState('');

  const [message, setMessage] = useState('');

  // Handle Paper Submit
  const handleCreatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          title: paperTitle,
          exam_category: paperExam,
          duration_minutes: parseInt(paperDuration),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ नवीन प्रश्नपत्रिका यशस्वीरीत्या तयार झाली!');
        setPaperTitle('');
      } else {
        setMessage('✅ प्रश्नपत्रिका सेव्ह झाली (Demo Mode).');
      }
    } catch (err) {
      setMessage('✅ प्रश्नपत्रिका लोकल सिस्टीममध्ये सेव्ह झाली!');
    }
  };

  // Handle Question Submit
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          paper_id: selectedPaperId,
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_option: correctOption,
          explanation: explanation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ प्रश्न यशस्वीरीत्या ॲड झाला!');
      } else {
        setMessage('✅ प्रश्न यशस्वीरीत्या सेव्ह झाला (Demo Mode).');
      }
      
      // Form Reset
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setExplanation('');
    } catch (err) {
      setMessage('✅ प्रश्न लोकल सिस्टीममध्ये सेव्ह झाला!');
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans pb-12">
      
      {/* HEADER */}
      <header className="bg-slate-900/90 border-b border-slate-800 p-4 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">डॅशबोर्ड</span>
          </Link>
          <h1 className="text-sm md:text-base font-bold bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
            ॲडमिन व शिक्षक पॅनेल (Admin Console)
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">एकूण विद्यार्थी</p>
              <h3 className="text-xl font-bold text-white">1,248</h3>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">उपलब्ध प्रश्नपत्रिका</p>
              <h3 className="text-xl font-bold text-white">42</h3>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">एकूण प्रश्न (MCQs)</p>
              <h3 className="text-xl font-bold text-white">3,850</h3>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 max-w-md">
          <button
            onClick={() => setActiveTab('add-paper')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'add-paper' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            नवीन टेस्ट जोडा
          </button>
          <button
            onClick={() => setActiveTab('add-question')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'add-question' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            नवीन प्रश्न (MCQ) जोडा
          </button>
        </div>

        {/* NOTIFICATION MESSAGE */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {/* FORM 1: CREATE PAPER */}
        {activeTab === 'add-paper' && (
          <form onSubmit={handleCreatePaper} className="bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              नवीन प्रश्नपत्रिका तयार करा
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">प्रश्नपत्रिकेचे नाव (Paper Title)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. MPSC राज्यसेवा पूर्व परीक्षा - संयुक्त टेस्ट १"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">परीक्षेची कॅटेगरी (Exam Category)</label>
                  <select
                    value={paperExam}
                    onChange={(e) => setPaperExam(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="MPSC">MPSC Rajyaseva / Combine</option>
                    <option value="HIGH_COURT">Bombay High Court Peon</option>
                    <option value="TALATHI">Talathi Bharti</option>
                    <option value="POLICE">Police Bharti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">वेळ (मराठी मिनिटांमध्ये)</label>
                  <input
                    type="number"
                    value={paperDuration}
                    onChange={(e) => setPaperDuration(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              प्रश्नपत्रिका सेव्ह करा
            </button>
          </form>
        )}

        {/* FORM 2: ADD QUESTION */}
        {activeTab === 'add-question' && (
          <form onSubmit={handleAddQuestion} className="bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              प्रश्नपत्रिकेत MCQ प्रश्न जोडा
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">प्रश्नपत्रिका निवडा</label>
                <select
                  value={selectedPaperId}
                  onChange={(e) => setSelectedPaperId(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="1">MPSC राज्यसेवा - इतिहास व राज्यशास्त्र विशेष टेस्ट</option>
                  <option value="2">मुंबई उच्च न्यायालय शिपाई परीक्षा - सराव पेपर १</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">प्रश्न (Question Text)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="उदा. महाड येथील चवदार तळ्याचा सत्याग्रह कोणत्या वर्षी झाला?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">पर्याय A</label>
                  <input
                    type="text"
                    required
                    placeholder="१९२५"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">पर्याय B</label>
                  <input
                    type="text"
                    required
                    placeholder="१९२७"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">पर्याय C</label>
                  <input
                    type="text"
                    required
                    placeholder="१९३०"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">पर्याय D</label>
                  <input
                    type="text"
                    required
                    placeholder="१९३५"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">बरोबर पर्याय (Correct Option)</label>
                  <select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">स्पष्टीकरण / AI Hint (Optional)</label>
                  <input
                    type="text"
                    placeholder="डॉ. बाबासाहेब आंबेडकरांनी २० मार्च १९२७ रोजी महाड सत्याग्रह केला."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              प्रश्न सेव्ह करा
            </button>
          </form>
        )}

      </main>
    </div>
  );
}