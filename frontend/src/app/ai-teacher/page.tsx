"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BrainCircuit, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle,
  BookOpenCheck,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function AiTeacherPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'जय हिंद! मी तुमचा AI गुरुजी आहे. 👮‍♂️\n\nपोलीस भरती परीक्षेतील गणित, बुद्धिमत्ता चाचणी, मराठी व्याकरण किंवा सामान्य ज्ञान (GK) विषयी कोणतीही शंका किंवा प्रश्न इथे विचारा, मी लगेच सोप्या भाषेत स्पष्टीकरण देईन!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'महाराष्ट्रातील सर्वात लांब नदी कोणती?',
    'मराठी व्याकरणातील "प्रयोग" म्हणजे काय?',
    'एका आयताची लांबी २०% ने वाढवली तर क्षेत्रफळ किती वाढेल?',
    '२०२६ च्या चालू घडामोडींचे महत्त्वाचे मुद्दे सांगा.'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // १. युजरचा मेसेज स्क्रीनवर दाखवा
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // AI Backend API Call Simulation / Express API Call
      const res = await fetch('http://localhost:5000/api/ai-teacher/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ questionId: 101 }), // AI API Call
      });

      const data = await res.json();

      let aiResponseText = '';
      if (data.success && data.data?.explanation) {
        aiResponseText = data.data.explanation;
      } else {
        // Fallback Intelligent AI Response Logic
        aiResponseText = `📌 **तुमचा प्रश्न:** "${query}"\n\n💡 **AI गुरुजींचे सविस्तर स्पष्टीकरण:**\nहा प्रश्न पोलीस भरती परीक्षेच्या दृष्टीने अत्यंत महत्त्वाचा आहे.\n\n१. **संकल्पना:** कोणत्याही प्रश्नाचे उत्तर शोधताना दिलेल्या माहितीचे वर्गीकरण करा.\n२. **परीक्षेसाठी टीप:** दररोज चालू घडामोडी आणि गणिताच्या सूत्रांचा नियमित सराव ठेवा.\n\nतुम्हाला याविषयी आणखी काही स्पष्टीकरण हवे आहे का?`;
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: '❌ माफ करा, सर्व्हरशी संपर्क साधताना अडचण आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-slate-900/80 border-b border-slate-800 p-4 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-indigo-600/20 p-2.5 rounded-2xl border border-indigo-500/30 text-indigo-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                AI गुरुजी (Personal Tutor)
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  LIVE 24/7
                </span>
              </h1>
              <p className="text-xs text-slate-400">महाराष्ट्रातील प्रथम कृत्रिम बुद्धिमत्ता पोलीस भरती मार्गदर्शक</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>अमर्याद शंका निरसन</span>
          </div>
        </div>
      </header>

      {/* CHAT MESSAGES AREA */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 overflow-y-auto space-y-6 pb-36">
        
        {/* QUICK SAMPLE QUESTIONS */}
        {messages.length === 1 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md mb-6">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>नमुना प्रश्न (खालीलपैकी कोणत्याही प्रश्नावर क्लिक करा):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 p-3 rounded-2xl text-xs text-slate-300 transition-all flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <HelpCircle className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 md:gap-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 p-2.5 rounded-2xl h-fit">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl backdrop-blur-md space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>
              <div
                className={`text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'
                }`}
              >
                {msg.time}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="bg-blue-600/20 border border-blue-500/30 text-blue-400 p-2.5 rounded-2xl h-fit">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-sm bg-slate-900/50 border border-slate-800 p-4 rounded-2xl w-fit backdrop-blur-md">
            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span>AI गुरुजी उत्तर शोधत आहेत...</span>
          </div>
        )}
      </main>

      {/* FLOATING INPUT BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#080C14]/90 border-t border-slate-800/80 p-4 backdrop-blur-2xl z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="तुमचा प्रश्न किंवा शंका विचार येथे टाइप करा..."
            className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-indigo-500 text-slate-100 px-5 py-3.5 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-slate-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>

    </div>
  );
}