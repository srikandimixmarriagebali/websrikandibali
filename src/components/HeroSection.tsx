import React from 'react';
import { Sparkles, Calendar, MapPin, ArrowRight, Users, Gift } from 'lucide-react';
import { Event } from '../types';
import { Language, translations } from '../data/translations';
import { DriveImage } from './DriveImage';

interface HeroSectionProps {
  language: Language;
  theme: 'dark' | 'light';
  nextEvent?: Event;
  isLoading?: boolean;
  onSelectEvent: (event: Event) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  theme,
  nextEvent,
  isLoading = false,
  onSelectEvent
}) => {
  const t = translations[language].hero;

  return (
    <section id="beranda" className={`relative overflow-hidden transition-colors pt-10 pb-20 ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 text-white'
        : 'bg-gradient-to-b from-rose-100/80 via-pink-50 to-white text-slate-900'
    }`}>
      {/* Decorative aura effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-600/20 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Organization Branding & Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Tag */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-sm shadow-inner ${
              theme === 'dark'
                ? 'bg-rose-900/80 border-pink-500/40 text-pink-200'
                : 'bg-white border-rose-300 text-rose-900 shadow-sm'
            }`}>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span>{t.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t.titleMain}{' '}
              <span className="bg-gradient-to-r from-pink-500 via-rose-600 to-amber-500 bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
            </h1>

            {/* Paragraph Statement */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal ${
              theme === 'dark' ? 'text-rose-100/90' : 'text-slate-700'
            }`}>
              {t.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#events"
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3.5 px-7 rounded-2xl shadow-lg shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4" />
                {t.btnEvents}
              </a>
              <a
                href="#tentang"
                className={`font-semibold py-3.5 px-7 rounded-2xl border transition-all text-sm flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'border-pink-500/40 text-pink-200 hover:bg-rose-900/40'
                    : 'border-rose-300 text-rose-900 bg-white/80 hover:bg-white'
                }`}
              >
                <Users className="w-4 h-4" />
                {t.btnAbout}
              </a>
            </div>

            {/* Stat Counters Banner */}
            <div className="pt-8 border-t border-rose-800/30 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  15+ Thn
                </span>
                <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-rose-200' : 'text-slate-600'}`}>{t.statGlobal}</p>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  1000+
                </span>
                <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-rose-200' : 'text-slate-600'}`}>{t.statActive}</p>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  50+
                </span>
                <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-rose-200' : 'text-slate-600'}`}>{t.statEvents}</p>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Next Event Card / Skeleton */}
          <div className="lg:col-span-5">
            {isLoading ? (
              /* Sleek Skeleton Card */
              <div className={`relative rounded-2xl border p-6 shadow-2xl backdrop-blur-md animate-pulse ${
                theme === 'dark'
                  ? 'bg-rose-950/60 border-rose-800/60'
                  : 'bg-white border-rose-200 shadow-xl'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="h-6 w-28 bg-rose-500/20 rounded-full" />
                  <div className="h-4 w-20 bg-rose-500/20 rounded-md" />
                </div>
                <div className="h-48 rounded-xl bg-slate-800/40 mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-pink-400/30 animate-spin" />
                </div>
                <div className="h-5 w-3/4 bg-rose-500/20 rounded mb-2" />
                <div className="h-4 w-1/2 bg-rose-500/20 rounded mb-4" />
                <div className="h-12 w-full bg-gradient-to-r from-pink-500/30 to-rose-600/30 rounded-xl" />
              </div>
            ) : nextEvent ? (
              <div className={`relative rounded-2xl border p-6 shadow-2xl backdrop-blur-md ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-rose-900/90 via-rose-950 to-pink-950 border-rose-700/70 text-white'
                  : 'bg-white border-rose-200 text-slate-900 shadow-xl'
              }`}>
                
                {/* Event Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-500 border border-pink-500/40">
                    <Calendar className="w-3.5 h-3.5" />
                    {t.nextEventBadge}
                  </span>
                  <span className={`text-xs font-mono font-medium ${theme === 'dark' ? 'text-pink-200/80' : 'text-slate-500'}`}>
                    {nextEvent.date}
                  </span>
                </div>

                {/* Event Image */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-rose-300/40">
                  <DriveImage
                    src={nextEvent.image}
                    alt={nextEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="bg-rose-900/90 text-pink-200 text-xs px-2.5 py-1 rounded-lg border border-pink-500/30 font-semibold">
                      {nextEvent.category}
                    </span>
                    <span className="bg-emerald-950/90 text-emerald-300 text-xs px-2.5 py-1 rounded-lg border border-emerald-500/40 font-semibold">
                      {nextEvent.registeredCount}/{nextEvent.maxCapacity} {t.registeredCount}
                    </span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-lg font-bold line-clamp-2 mb-2 leading-snug">
                  {nextEvent.title}
                </h3>

                {/* Location & Time */}
                <div className={`space-y-1.5 text-xs mb-4 ${theme === 'dark' ? 'text-rose-200/90' : 'text-slate-600'}`}>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                    <span className="truncate">{nextEvent.location}</span>
                  </p>
                  <p className="pl-5.5">{nextEvent.time}</p>
                </div>

                {/* RSVP / Detail Button */}
                <button
                  onClick={() => onSelectEvent(nextEvent)}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  {t.btnRegisterDetail}
                </button>
              </div>
            ) : (
              <div className={`rounded-2xl border p-8 text-center ${
                theme === 'dark' ? 'bg-rose-900/50 border-rose-800 text-white' : 'bg-white border-rose-200 text-slate-800'
              }`}>
                <Calendar className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold">{t.noEventTitle}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.noEventDesc}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
