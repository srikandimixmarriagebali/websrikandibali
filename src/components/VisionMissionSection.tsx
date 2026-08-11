import React from 'react';
import { Eye, Target, Scale, Shield, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface VisionMissionSectionProps {
  language: Language;
  theme: 'dark' | 'light';
}

export const VisionMissionSection: React.FC<VisionMissionSectionProps> = ({ language, theme }) => {
  const t = translations[language].visionMission;

  return (
    <section id="visi-misi" className={`py-20 transition-colors relative overflow-hidden ${
      theme === 'dark' ? 'bg-rose-950 text-white' : 'bg-rose-900 text-white'
    }`}>
      {/* Background graphics */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-900/90 text-pink-300 border border-pink-500/40 text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-rose-200/90 text-sm max-w-xl mx-auto">
            {t.subtitle}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto rounded-full" />
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* VISI Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-rose-900/90 via-rose-950 to-pink-950 border border-pink-500/30 p-8 sm:p-10 shadow-2xl flex flex-col justify-between group hover:border-pink-400/60 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-700 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-rose-950 rounded-[14px] flex items-center justify-center">
                    <Eye className="w-7 h-7 text-pink-300" />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-pink-300 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-500/30">
                  {t.visionTitle}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight leading-snug">
                Equal Rights & Stability
              </h3>

              <div className="p-6 rounded-2xl bg-rose-900/40 border border-rose-800/80 backdrop-blur-sm">
                <blockquote className="text-slate-100 text-base sm:text-lg leading-relaxed italic font-normal">
                  "{t.visionDesc}"
                </blockquote>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-rose-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{t.mission1}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-rose-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{t.mission2}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-rose-800/60 mt-6 flex items-center justify-between text-xs text-pink-300">
              <span className="font-semibold">SRIKANDI BALI</span>
              <Scale className="w-4 h-4 text-pink-400" />
            </div>
          </div>

          {/* MISI Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-pink-950 via-rose-950 to-rose-900/90 border border-rose-600/40 p-8 sm:p-10 shadow-2xl flex flex-col justify-between group hover:border-rose-400/60 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-fuchsia-700 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-rose-950 rounded-[14px] flex items-center justify-center">
                    <Target className="w-7 h-7 text-pink-300" />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-pink-300 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/30">
                  {t.missionTitle}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight leading-snug">
                Support, Advocacy & Community
              </h3>

              <div className="p-6 rounded-2xl bg-rose-900/40 border border-rose-800/80 backdrop-blur-sm">
                <blockquote className="text-slate-100 text-base sm:text-lg leading-relaxed italic font-normal">
                  "{t.mission1Desc}"
                </blockquote>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-rose-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{t.mission2Desc}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-rose-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{t.mission3Desc}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-rose-800/60 mt-6 flex items-center justify-between text-xs text-pink-300">
              <span className="font-semibold">SRIKANDI BALI</span>
              <Shield className="w-4 h-4 text-pink-400" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
