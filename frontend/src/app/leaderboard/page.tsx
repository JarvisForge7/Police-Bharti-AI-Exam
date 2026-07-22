"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Coins, 
  ArrowLeft, 
  Search, 
  Filter, 
  Flame, 
  Award,
  Sparkles
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  district: string;
  score: number;
  coins: number;
  streak: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const [filterType, setFilterType] = useState<'state' | 'district'>('state');
  const [timeframe, setTimeframe] = useState<'weekly' | 'alltime'>('weekly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`http://localhost:5000/api/leaderboard?type=${filterType}&timeframe=${timeframe}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        const data = await res.json();

        if (data.success && data.data?.length > 0) {
          setLeaderboard(data.data);
        } else {
          // Dummy Data Fallback (महाराष्ट्रातील टॉपर विद्यार्थी)
          setLeaderboard([
            { rank: 1, name: 'अक्षय पाटील', district: 'पुणे', score: 2850, coins: 4500, streak: 15 },
            { rank: 2, name: 'स्नेहा देशमुख', district: 'छत्रपती संभाजीनगर', score: 2720, coins: 4100, streak: 12 },
            { rank: 3, name: 'राहुल जाधव', district: 'नाशिक', score: 2680, coins: 3900, streak: 10 },
            { rank: 4, name: 'पूजा शिंदे', district: 'मुंबई शहर', score: 2510, coins: 3600, streak: 8 },
            { rank: 5, name: 'अमित कदम', district: 'नागपूर', score: 2450, coins: 3400, streak: 14 },
            { rank: 6, name: 'किरण पवार', district: 'कोल्हापूर', score: 2390, coins: 3200, streak: 7 },
            { rank: 7, name: 'तुम्ही (You)', district: 'ठाणे', score: 2300, coins: 3100, streak: 9, isCurrentUser: true },
            { rank: 8, name: 'प्रवीण मोरे', district: 'सोलापूर', score: 2210, coins: 2950, streak: 5 },
          ]);
        }
      } catch (err) {
        console.error("Leaderboard Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [filterType, timeframe]);

  const topThree = leaderboard.slice(0, 3);
  const otherRanks = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans pb-12">
      
      {/* TOP HEADER */}
      <header className="bg-slate-900/90 border-b border-slate-800 p-4 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold">डॅशबोर्डवर जा</span>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-sm md:text-base font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
              महाराष्ट्र गुणवत्ता यादी (Leaderboard)
            </h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto p-4 md:p-6 space-y-8">
        
        {/* FILTER CONTROLS */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div className="flex bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('state')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'state' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              राज्य पातळी (State Rank)
            </button>
            <button
              onClick={() => setFilterType('district')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'district' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              जिल्हा पातळी (District)
            </button>
          </div>

          <div className="flex bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'weekly' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              या आठवड्यातील
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'alltime' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              सर्वोत्तम (All Time)
            </button>
          </div>
        </div>

        {/* TOP 3 PODIUM */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-6">
          
          {/* RANK 2 (Left) */}
          {topThree[1] && (
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 rounded-3xl p-4 md:p-6 text-center space-y-3 relative overflow-hidden shadow-xl">
              <div className="absolute top-2 right-2 text-slate-400 font-bold text-xs">#2</div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-700 mx-auto flex items-center justify-center border-2 border-slate-400 text-slate-300 font-bold text-lg md:text-xl shadow-lg">
                <Medal className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs md:text-sm text-slate-100 truncate">{topThree[1].name}</h3>
                <p className="text-[11px] text-slate-400">{topThree[1].district}</p>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>{topThree[1].coins}</span>
              </div>
            </div>
          )}

          {/* RANK 1 (Center) */}
          {topThree[0] && (
            <div className="bg-gradient-to-b from-amber-500/20 via-slate-900/90 to-slate-900/90 border-2 border-amber-500/60 rounded-3xl p-4 md:p-6 text-center space-y-3 relative overflow-hidden shadow-2xl scale-105 z-10">
              <Crown className="w-8 h-8 text-amber-400 absolute -top-1 left-1/2 -translate-x-1/2 animate-bounce" />
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-amber-500/20 mx-auto flex items-center justify-center border-2 border-amber-400 text-amber-300 font-bold text-xl md:text-2xl shadow-xl shadow-amber-500/20">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm md:text-base text-amber-200 truncate">{topThree[0].name}</h3>
                <p className="text-[11px] text-amber-400/80">{topThree[0].district}</p>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5 text-xs text-amber-300 font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{topThree[0].coins} Points</span>
              </div>
            </div>
          )}

          {/* RANK 3 (Right) */}
          {topThree[2] && (
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 rounded-3xl p-4 md:p-6 text-center space-y-3 relative overflow-hidden shadow-xl">
              <div className="absolute top-2 right-2 text-amber-600 font-bold text-xs">#3</div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-700 mx-auto flex items-center justify-center border-2 border-amber-700 text-amber-600 font-bold text-lg md:text-xl shadow-lg">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs md:text-sm text-slate-100 truncate">{topThree[2].name}</h3>
                <p className="text-[11px] text-slate-400">{topThree[2].district}</p>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>{topThree[2].coins}</span>
              </div>
            </div>
          )}

        </div>

        {/* RANK LIST (4th Onwards) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 md:p-6 backdrop-blur-md space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">इतर विद्यार्थी रँकिंग</h2>

          {otherRanks.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                user.isCurrentUser
                  ? 'bg-blue-600/20 border-blue-500/80 shadow-lg shadow-blue-600/10'
                  : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                  user.isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  #{user.rank}
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    {user.name}
                    {user.isCurrentUser && (
                      <span className="bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        तुम्ही
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">{user.district}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-1 text-xs text-amber-500">
                  <Flame className="w-4 h-4 fill-amber-500/20" />
                  <span>{user.streak} Days</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-sm text-amber-400">
                  <Coins className="w-4 h-4" />
                  <span>{user.coins}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}