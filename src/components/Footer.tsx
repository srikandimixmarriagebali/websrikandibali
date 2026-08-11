import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface FooterProps {
  language: Language;
  theme: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ language, theme }) => {
  const t = translations[language].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`transition-colors border-t border-rose-900 pt-16 pb-10 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-rose-950 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-rose-800 p-0.5 shadow-md">
                <div className="w-full h-full bg-rose-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl font-bold">🌸</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-pink-200 via-rose-100 to-amber-100 bg-clip-text text-transparent block">
                  SRIKANDI BALI
                </span>
                <span className="text-xs text-pink-300 font-medium block">
                  Indonesian Mixed Marriage Organization
                </span>
              </div>
            </div>

            <p className="text-xs text-rose-200/90 leading-relaxed max-w-md">
              {t.aboutText}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                <a href="#beranda" className="p-2 rounded-xl bg-rose-900/80 hover:bg-pink-600 text-rose-100 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#beranda" className="p-2 rounded-xl bg-rose-900/80 hover:bg-pink-600 text-rose-100 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider">{t.navTitle}</h4>
            <ul className="space-y-2 text-xs text-rose-200">
              <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#siapa-kami" className="hover:text-white transition-colors">Siapa Kami</a></li>
              <li><a href="#visi-misi" className="hover:text-white transition-colors">Visi & Misi</a></li>
              <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#galeri" className="hover:text-white transition-colors">Galeri</a></li>
              <li><a href="#amal" className="hover:text-white transition-colors">Aksi Amal</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider">{t.contactTitle}</h4>
            <div className="space-y-2 text-xs text-rose-200">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span><strong>Bali Secretariat:</strong> Seminyak & Sanur, Badung, Bali, Indonesia</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span><strong>Jakarta Secretariat:</strong> Kebayoran Baru, Jakarta Selatan</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <span>+62 812-3456-7890 (WhatsApp Info Srikandi)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <span>info@srikandibali.org</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-rose-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-300/80">
          <p className="flex items-center gap-2">
            <span>© 2026 SRIKANDI BALI. Non-Profit Organization.</span>
            <a href="#/admin" className="opacity-40 hover:opacity-100 text-[10px] text-pink-300 hover:text-white transition-opacity">
              [Admin Portal]
            </a>
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-rose-900 hover:bg-pink-600 text-white transition-colors flex items-center gap-1.5 font-medium"
          >
            <ArrowUp className="w-4 h-4" />
            Top
          </button>
        </div>

      </div>
    </footer>
  );
};
