import React, { useState } from 'react';
import { Heart, Calendar, Sparkles, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface NavbarProps {
  language: Language;
  theme: 'dark' | 'light';
  onLanguageChange?: (lang: Language) => void;
  onToggleLanguage?: () => void;
  onThemeToggle?: () => void;
  onToggleTheme?: () => void;
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
  onNavigateAdmin?: () => void;
  upcomingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  theme,
  onLanguageChange,
  onToggleLanguage,
  onThemeToggle,
  onToggleTheme,
  upcomingCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language].nav;

  const handleLangToggle = () => {
    if (onToggleLanguage) {
      onToggleLanguage();
    } else if (onLanguageChange) {
      onLanguageChange(language === 'id' ? 'en' : 'id');
    }
  };

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle();
    } else if (onToggleTheme) {
      onToggleTheme();
    }
  };

  const navLinks = [
    { name: t.home, href: '#beranda' },
    { name: t.about, href: '#siapa-kami' },
    { name: t.vision, href: '#visi-misi' },
    { name: t.events, href: '#events', badge: upcomingCount },
    { name: t.gallery, href: '#galeri' },
    { name: t.charity, href: '#amal' }
  ];

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b shadow-lg ${
      theme === 'dark'
        ? 'bg-rose-950/90 text-white border-rose-800/60'
        : 'bg-white/95 text-slate-900 border-rose-200'
    }`}>
      {/* Top Banner Line */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-rose-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Heart className="w-3.5 h-3.5 fill-pink-200 text-pink-200 animate-pulse" />
        <span>{t.topBanner}</span>
        <span className="hidden md:inline-block bg-rose-900/60 text-pink-200 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-rose-500/40">
          {t.topBannerTag}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#beranda" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-rose-800 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center border ${
                theme === 'dark' ? 'bg-rose-950 border-rose-400/30' : 'bg-white border-pink-200'
              }`}>
                <span className="text-xl">🌸</span>
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-wider uppercase bg-gradient-to-r from-pink-500 via-rose-600 to-amber-500 bg-clip-text text-transparent block">
                SRIKANDI BALI
              </span>
              <span className={`text-[10px] tracking-wide font-medium block ${
                theme === 'dark' ? 'text-pink-300' : 'text-slate-600'
              }`}>
                Organisasi Wanita Perkawinan Campur
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'text-rose-100/90 hover:text-white hover:bg-rose-900/60'
                    : 'text-slate-700 hover:text-rose-900 hover:bg-rose-50'
                }`}
              >
                {link.name}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Right Controls (Theme Toggle, Language Toggle, RSVP, Admin Portal) */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Language Toggle Button */}
            <button
              onClick={handleLangToggle}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-rose-900/40 text-pink-200 border-rose-700/60 hover:bg-rose-800'
                  : 'bg-rose-50 text-slate-800 border-rose-200 hover:bg-rose-100'
              }`}
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Dark Mode / Light Mode Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-rose-900/40 text-amber-300 border-rose-700/60 hover:bg-rose-800'
                  : 'bg-rose-50 text-slate-700 border-rose-200 hover:bg-rose-100'
              }`}
              title={theme === 'dark' ? "Mode Terang / Light Mode" : "Mode Gelap / Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={handleLangToggle}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold uppercase ${
                theme === 'dark' ? 'bg-rose-900/40 text-pink-200 border-rose-700' : 'bg-rose-50 text-slate-800 border-rose-200'
              }`}
            >
              {language}
            </button>

            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg border ${
                theme === 'dark' ? 'bg-rose-900/40 text-amber-300 border-rose-700' : 'bg-rose-50 text-slate-700 border-rose-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${
                theme === 'dark' ? 'bg-rose-900/80 text-rose-100 border-rose-700' : 'bg-rose-50 text-slate-800 border-rose-200'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-3 pb-6 space-y-2 animate-fadeIn ${
          theme === 'dark' ? 'bg-rose-950 border-rose-800' : 'bg-white border-rose-200'
        }`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                theme === 'dark'
                  ? 'text-rose-100 hover:bg-rose-900/70 hover:text-white border border-rose-800/30'
                  : 'text-slate-800 hover:bg-rose-50 border border-rose-100'
              }`}
            >
              <span>{link.name}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
