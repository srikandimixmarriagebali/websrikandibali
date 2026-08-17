import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Send, Bot, Scale, BookOpen, RefreshCw } from 'lucide-react';
import { Language, translations } from '../data/translations';
import { LegalFaq } from '../types';

interface AiAssistantSectionProps {
  language: Language;
  theme: 'dark' | 'light';
  faqs: LegalFaq[];
}

export const AiAssistantSection: React.FC<AiAssistantSectionProps> = ({ language, theme, faqs }) => {
  const t = translations[language].aiAssistant;

  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: t.placeholder
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? '' : id);
  };

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim() || isLoading) return;

    const currentText = userPrompt;
    setUserPrompt('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: currentText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentText,
          context: 'legal_consultation'
        })
      });

      const data = await response.json();
      if (data.response) {
        setChatHistory((prev) => [...prev, { sender: 'ai', text: data.response }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'ai', text: 'Sorry, connection error occurred. Please try again.' }
        ]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Srikandi Bali is here to help! Under Indonesian Marriage Law No. 1/1974 and Constitutional Court Ruling No. 69/2015, Postnuptial Agreements (Postnup) can be signed during marriage to protect Indonesian land ownership rights.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'How to make a Postnuptial Agreement after marriage?',
    'Does dual citizen child need passport renewal at 18?',
    'How to join Srikandi Bali as an active member?'
  ];

  return (
    <section id="konsultasi-ai" className={`py-20 transition-colors relative overflow-hidden ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-fuchsia-950/80 text-pink-300 border border-fuchsia-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-rose-200/90 text-sm sm:text-base">
            {t.subtitle}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* FAQ Accordion */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300 border border-pink-500/40">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t.faqTitle}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-sm font-bold text-slate-100 hover:text-pink-300"
                    >
                      <span className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-pink-400 shrink-0" />
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-pink-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/60 animate-fadeIn">
                        <span className="inline-block bg-pink-950 text-pink-300 px-2 py-0.5 rounded text-[10px] font-bold mb-2">
                          Category: {faq.category}
                        </span>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Chat Assistant */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-900/90 border border-fuchsia-500/30 p-6 shadow-2xl flex flex-col h-[520px] justify-between">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-700 p-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-pink-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Srikandi AI Assistant
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-500/30 px-2.5 py-1 rounded-full font-semibold">
                  Gemini AI
                </span>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-rose-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-pink-300 p-3 rounded-2xl text-xs flex items-center gap-2 border border-slate-700">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-400" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Prompts */}
              <div className="pt-2 pb-3 border-t border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserPrompt(q)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-200 px-2.5 py-1 rounded-lg border border-slate-700 text-left transition-colors truncate max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendPrompt} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder={t.placeholder}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !userPrompt.trim()}
                  className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
