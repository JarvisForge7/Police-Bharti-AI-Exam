"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { 
  Trophy, 
  Coins, 
  Award, 
  Clock, 
  BookOpen, 
  BrainCircuit, 
  AlertTriangle, 
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface Paper {
  id: number;
  title: string;
  total_marks: number;
  duration_minutes: number;
  district: string;
  year: number;
}

interface UserAnalytics {
  summary: {
    total_tests: number;
    avg_score: number;
    total_correct: number;
    total_wrong: number;
  };
}

export default function StudentDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [papersRes, analyticsRes] = await Promise.all([
          api.getPapers(),
          api.getAnalytics(),
        ]);

        if (papersRes.success) {
          setPapers(papersRes.data || []);
        } else {
          // Dummy papers for fallback/preview if database is empty
          setPapers([
            { id: 1, title: 'पुणे जिल्हा पोलीस भरती २०२६ सराव पेपर ०१', total_marks: 100, duration_minutes: 90, district: 'पुणे', year: 2026 },
            { id: 2, title: 'मुंबई शहर पोलीस शिपाई भरती २०२४ मूळ पेपर', total_marks: 100, duration_minutes: 90, district: 'मुंबई', year: 2024 },
            { id: 3, title: 'नागपूर ग्रामीण पोलीस भरती २०२५ सराव पेपर', total_marks: 100, duration_minutes: 90, district: 'नागपूर', year: 2025 },
          ]);
        }

        if (analyticsRes.success) {
          setAnalytics(analyticsRes.data);
        }
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 font-sans p-4 md:p-8">
      {/* TOP BAR / NAVIGATION */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center bg-slate-900/60 border border-slate-800 p-4 md:px-8 rounded-3xl backdrop-blur-xl mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">महाराष्ट्र पोलीस भरती AI प्लॅटफॉर्म</h1>
            <p className="text-xs text-slate-400">वर्दीची तयारी, AI च्या सोबतीने!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-amber-400 font-semibold text-sm">
            <Coins className="w-4 h-4" />
            <span>४५० नाणी (Coins)</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-2xl text-blue-400 font-semibold text-sm">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Level 5 (रक्षक)</span>
          </div>
        </div>
      </header>

      {/* STATS OVERVIEW CARDS */}
      <section className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">सोडवलेले पेपर</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {analytics?.summary?.total_tests || 12}
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">सरासरी गुण (Avg Score)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {Number(analytics?.summary?.avg_score || 82).toFixed(1)} / १००
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">महाराष्ट्र रँक</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">#१४</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">एकूण सराव वेळ</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">१८ तास</p>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: AVAILABLE EXAM PAPERS (2 COLUMNS SPAN) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              सराव प्रश्नपत्रिका आणि मागील वर्षाचे पेपर्स
            </h2>
            <span className="text-xs text-slate-400">एकूण {papers.length} पेपर्स उपलब्ध</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">पेपर्स लोड होत आहेत...</div>
          ) : (
            <div className="space-y-3">
              {papers.map((paper) => (
                <div 
                  key={paper.id} 
                  className="bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/50 transition-all p-5 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-blue-500/20">
                        {paper.district || 'महाराष्ट्र'}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {paper.year || 2026}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {paper.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span>गुण: {paper.total_marks}</span>
                      <span>•</span>
                      <span>वेळ: {paper.duration_minutes} मिनिटे</span>
                    </div>
                  </div>

                  <Link 
                    href={`/exam/${paper.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
                  >
                    पेपर सोडा
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: QUICK TOOLS & AI FEATURES */}
        <aside className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200 mb-2">स्मार्ट फीचर्स</h2>

          {/* AI TEACHER BANNER */}
          <Link href="/ai-teacher" className="block">
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/80 border border-indigo-500/30 p-5 rounded-2xl hover:border-indigo-500/60 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-600/20 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/30">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-300">AI गुरुजी (AI Teacher)</h3>
                  <p className="text-xs text-slate-400">कोणतीही शंका तात्काळ विचारा</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                गणित, बुद्धिमत्ता किंवा चालू घडामोडींचा कोणताही प्रश्न विचारून २ सेकंदात उत्तरे व स्पष्टीकरण मिळवा.
              </p>
            </div>
          </Link>

          {/* WRONG QUESTION PRACTICE */}
          <Link href="/wrong-questions" className="block">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl hover:border-amber-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">चुकलेले प्रश्न रीव्हिजन</h4>
                  <p className="text-xs text-slate-400">जाणूनबुजून पुनरावृत्ती करा</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Link>

          {/* LEADERBOARD LINK */}
          <Link href="/leaderboard" className="block">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl hover:border-blue-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 border border-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">राज्यस्तरीय लीडरबोर्ड</h4>
                  <p className="text-xs text-slate-400">इतर विद्यार्थ्यांशी तुलना करा</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Link>

          {/* PERFORMANCE DASHBOARD LINK */}
          <Link href="/analytics" className="block">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">प्रगती अहवाल (Analytics)</h4>
                  <p className="text-xs text-slate-400">विषयनिहाय कमकुवत बाजू</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Link>
        </aside>

      </main>
    </div>
  );
}