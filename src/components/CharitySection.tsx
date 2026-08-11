import React, { useState } from 'react';
import { Heart, Gift, Users, CheckCircle, Copy, Check, X } from 'lucide-react';
import { CharityCampaign } from '../types';
import { Language, translations } from '../data/translations';

interface CharitySectionProps {
  language: Language;
  theme: 'dark' | 'light';
  campaigns: CharityCampaign[];
  onDonateToCampaign?: (campaignId: string, amount: number) => void;
}

export const CharitySection: React.FC<CharitySectionProps> = ({
  language,
  theme,
  campaigns,
  onDonateToCampaign
}) => {
  const t = translations[language].charity;

  const [selectedCampaign, setSelectedCampaign] = useState<CharityCampaign | null>(null);
  const [donateAmount, setDonateAmount] = useState<number>(250000);
  const [donorName, setDonorName] = useState<string>('');
  const [isSuccessModal, setIsSuccessModal] = useState<boolean>(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const presets = [100000, 250000, 500000, 1000000];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(type);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    if (onDonateToCampaign) {
      onDonateToCampaign(selectedCampaign.id, donateAmount);
    }
    setIsSuccessModal(true);
  };

  return (
    <section id="amal" className={`py-20 transition-colors ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-gradient-to-b from-rose-50/80 via-white to-pink-50/80 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/20 text-pink-500 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {t.subtitle}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-pink-500 to-rose-600 mx-auto rounded-full" />
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {campaigns.map((camp) => {
            const percentage = Math.min(100, Math.round((camp.currentAmount / camp.targetAmount) * 100));

            return (
              <div
                key={camp.id}
                className={`rounded-3xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100'
                }`}
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {camp.category}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        <Users className="w-3.5 h-3.5 text-pink-300" />
                        {camp.donorCount} Donors
                      </span>
                      <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                        {camp.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl font-bold leading-snug">
                      {camp.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {camp.description}
                    </p>

                    <div className={`p-3.5 rounded-xl border space-y-1 text-xs ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-pink-50/80 border-pink-100'
                    }`}>
                      <span className="font-bold block">{t.targetLabel}:</span>
                      <span className="text-slate-400">{camp.beneficiaries}</span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-end text-xs font-bold">
                        <div>
                          <span className="text-slate-400 block text-[10px]">{t.raisedLabel}</span>
                          <span className="text-rose-500 text-sm font-extrabold">
                            Rp {camp.currentAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px]">{t.targetLabel}</span>
                          <span className="text-slate-300">
                            Rp {camp.targetAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden p-0.5 border border-pink-200">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedCampaign(camp)}
                    className="w-full bg-gradient-to-r from-pink-500 via-rose-600 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    {t.btnDonate}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Donation Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 text-slate-900">
            <button
              onClick={() => {
                setSelectedCampaign(null);
                setIsSuccessModal(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccessModal ? (
              <form onSubmit={handleConfirmDonation} className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Charity</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedCampaign.title}</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Select Amount:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonateAmount(amt)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          donateAmount === amt
                            ? 'bg-rose-600 text-white border-rose-600 shadow'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                        }`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/80 border border-pink-200 space-y-3">
                  <span className="text-xs font-bold text-rose-900 block">Bank Account BCA:</span>
                  <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-pink-100">
                    <div>
                      <span className="font-bold text-slate-900 block">Bank BCA (Denpasar)</span>
                      <span className="font-mono font-bold text-rose-600 text-sm">7720-9981-22</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('7720998122', 'bca')}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700"
                    >
                      {copiedBank === 'bca' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Donation Rp {donateAmount.toLocaleString('id-ID')}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Thank You For Your Support!</h3>
                <button
                  onClick={() => {
                    setSelectedCampaign(null);
                    setIsSuccessModal(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
