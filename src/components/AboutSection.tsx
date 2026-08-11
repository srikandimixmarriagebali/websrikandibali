import React from 'react';
import { Heart, Users, Globe2, Briefcase, Building2, GraduationCap, HeartHandshake, Laptop, Award, MapPin } from 'lucide-react';
import { memberProfessions } from '../data/initialData';
import { Language, translations } from '../data/translations';

interface AboutSectionProps {
  language: Language;
  theme: 'dark' | 'light';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language, theme }) => {
  const t = translations[language].about;

  const getProfessionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-rose-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-rose-500" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-rose-500" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-rose-500" />;
      case 'Award': return <Award className="w-5 h-5 text-rose-500" />;
      default: return <Users className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <section id="siapa-kami" className={`py-20 transition-colors ${
      theme === 'dark'
        ? 'bg-slate-900 text-slate-100'
        : 'bg-gradient-to-b from-rose-50/80 via-white to-pink-50/50 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/20 text-pink-500 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.title}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-pink-500 to-rose-600 mx-auto rounded-full" />
        </div>

        {/* Main Content Card */}
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Text Block */}
          <div className={`p-8 sm:p-10 rounded-3xl border flex flex-col justify-between space-y-6 lg:col-span-6 transition-all ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800 shadow-xl' : 'bg-white border-pink-100 shadow-xl shadow-rose-100/60'
          }`}>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-sm">
                <Users className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold leading-snug">
                {t.title}
              </h3>

              <p className={`text-base leading-relaxed font-normal ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.paragraph1}
              </p>

              <p className={`text-base leading-relaxed font-normal ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.paragraph2}
              </p>

              <div className={`p-5 rounded-2xl border space-y-3 ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-gradient-to-br from-rose-50 to-pink-50 border-pink-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Globe2 className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">400+ Global Members</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      150 active members residing in Jakarta and Bali, with hundreds more globally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/30 text-xs text-slate-400 italic">
              "Together we stand strong, empowering mixed marriage families and securing their legal future."
            </div>
          </div>

          {/* Right Column: Professions Breakdown */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-rose-900 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-pink-300 uppercase tracking-widest block">{t.professionsTitle}</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Diverse Backgrounds</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/40">
                  <Briefcase className="w-5 h-5 text-pink-300" />
                </div>
              </div>

              {/* Profession Progress List */}
              <div className="space-y-4">
                {memberProfessions.map((item, idx) => (
                  <div key={idx} className="bg-rose-950/60 p-3.5 rounded-2xl border border-rose-800/60 hover:border-pink-500/50 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300">
                          {getProfessionIcon(item.iconName)}
                        </div>
                        <span className="text-rose-100">{item.title}</span>
                      </div>
                      <span className="text-pink-300 font-mono font-bold">{item.countApprox}</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-rose-900/80 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                        style={{ width: `${item.percentage * 2.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-800/80 flex items-center justify-between text-xs text-rose-300">
              <span>*Srikandi Bali Member Data 2026</span>
              <span className="font-semibold text-pink-200">100% Inclusive</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
