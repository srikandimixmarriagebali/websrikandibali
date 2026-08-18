import React, { useState } from 'react';
import { Heart, Gift, Users, CheckCircle, Copy, Check, X, Search, ShieldCheck, Building2 } from 'lucide-react';
import { CharityCampaign, DonorRecord, BankAccount } from '../types';
import { Language, translations } from '../data/translations';
import { DriveImage } from './DriveImage';

interface CharitySectionProps {
  language: Language;
  theme: 'dark' | 'light';
  campaigns: CharityCampaign[];
  donors?: DonorRecord[];
  bankAccounts?: BankAccount[];
  isLoading?: boolean;
  onDonateToCampaign?: (campaignId: string, amount: number, donorName: string) => void;
}

export const CharitySection: React.FC<CharitySectionProps> = ({
  language,
  theme,
  campaigns,
  donors = [],
  bankAccounts = [],
  isLoading = false,
  onDonateToCampaign
}) => {
  const t = translations[language].charity;

  const [selectedCampaign, setSelectedCampaign] = useState<CharityCampaign | null>(null);
  const [selectedCampaignForDonors, setSelectedCampaignForDonors] = useState<CharityCampaign | null>(null);
  const [donorSearch, setDonorSearch] = useState<string>('');

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

  const activeBankAccounts = bankAccounts.filter((b) => b.is_active);
  const displayBanks = activeBankAccounts.length > 0 ? activeBankAccounts : [
    {
      bank_name: 'Bank BCA',
      account_number: '7720998122',
      account_holder: 'Yayasan Srikandi Mix Marriage Bali',
      branch: 'KCU Denpasar',
      is_active: true
    }
  ];

  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    if (onDonateToCampaign) {
      onDonateToCampaign(selectedCampaign.id, donateAmount, donorName.trim() || 'Hamba Allah');
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

        {/* Campaign Cards Grid / Skeleton */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`rounded-3xl border shadow-xl overflow-hidden flex flex-col justify-between animate-pulse ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100'
                }`}
              >
                <div className="h-56 bg-slate-800/40 relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 animate-ping" />
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="h-6 bg-pink-500/20 rounded w-3/4" />
                  <div className="h-4 bg-slate-700/30 rounded w-full" />
                  <div className="h-4 bg-slate-700/30 rounded w-2/3" />
                  <div className="h-3 bg-slate-700/20 rounded-full w-full mt-4" />
                  <div className="h-12 bg-gradient-to-r from-pink-500/20 to-rose-600/20 rounded-2xl w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {campaigns.map((camp) => {
              const percentage = Math.min(100, Math.round(((camp.currentAmount || 0) / (camp.targetAmount || 1)) * 100));
              const confirmedDonorsCount = donors.filter(
                (d) => d.id_Campaigns === camp.id && (d.status === 'konfirm' || d.status === ('confirm' as any))
              ).length;

              return (
                <div
                  key={camp.id}
                  className={`rounded-3xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100'
                  }`}
                >
                  <div>
                    <div className="relative h-56 overflow-hidden">
                      <DriveImage
                        src={camp.imageUrl}
                        alt={camp.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                      
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                        {camp.category}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                          <Users className="w-3.5 h-3.5 text-pink-300" />
                          {camp.donorCount || confirmedDonorsCount} Donatur
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
                              Rp {Number(camp.currentAmount || 0).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px]">{t.targetLabel}</span>
                            <span className="text-slate-300">
                              Rp {Number(camp.targetAmount || 0).toLocaleString('id-ID')}
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

                  <div className="p-6 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedCampaign(camp)}
                        className="w-full bg-gradient-to-r from-pink-500 via-rose-600 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        {t.btnDonate}
                      </button>

                      {/* Tombol Popup Daftar Donatur Terkonfirmasi */}
                      <button
                        onClick={() => {
                          setSelectedCampaignForDonors(camp);
                          setDonorSearch('');
                        }}
                        className={`w-full text-xs font-semibold py-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 ${
                          theme === 'dark'
                            ? 'bg-slate-900 border-slate-800 text-pink-300 hover:bg-slate-800'
                            : 'bg-pink-50/80 border-pink-200 text-rose-800 hover:bg-pink-100'
                        }`}
                        title="Lihat Daftar Donatur yang Sudah Konfirmasi"
                      >
                        <Users className="w-3.5 h-3.5 text-rose-500" />
                        Daftar Donatur ({donors.filter((d) => d.id_Campaigns === camp.id && d.status === 'konfirm').length})
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL 1: FORMULIR DONASI */}
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
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Aksi Amal & Donasi</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedCampaign.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Penyaluran: {selectedCampaign.beneficiaries} ({selectedCampaign.location})</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Pilih Nominal Donasi:</label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Nama Donatur / Inisial (Opsional):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hamba Allah / Ibu Maya (Denpasar)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/80 border border-pink-200 space-y-3">
                  <span className="text-xs font-bold text-rose-900 block">Pilihan Rekening Resmi Komunitas Srikandi Bali:</span>
                  <div className="space-y-2">
                    {displayBanks.map((bank, bIdx) => (
                      <div key={bIdx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-pink-100 shadow-sm">
                        <div>
                          <span className="font-bold text-slate-900 block">{bank.bank_name} {bank.branch ? `(${bank.branch})` : ''}</span>
                          <span className="font-mono font-bold text-rose-600 text-sm">{bank.account_number}</span>
                          <span className="text-[10px] text-slate-500 block">a.n. {bank.account_holder}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(bank.account_number, `bank-${bIdx}`)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 transition-colors"
                          title={`Salin Nomor Rekening ${bank.bank_name}`}
                        >
                          {copiedBank === `bank-${bIdx}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    ℹ️ Data donasi Anda akan langsung tersimpan di Google Sheet. Pengurus akan mengkonfirmasi status donasi setelah mutasi rekening diverifikasi.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Saya Sudah Transfer Rp {donateAmount.toLocaleString('id-ID')}
                  </button>

                  <a
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                      `Halo Admin Srikandi Bali, saya ${donorName || 'Donatur'} ingin konfirmasi donasi untuk program "${selectedCampaign.title}" sebesar Rp ${donateAmount.toLocaleString('id-ID')}. Mohon info untuk pengiriman bukti transfer.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow transition-all text-xs flex items-center justify-center gap-2"
                  >
                    Konfirmasi Bukti Transfer via WhatsApp
                  </a>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Terima Kasih Atas Donasi Anda!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Donasi Anda untuk program <span className="font-bold text-slate-800">"{selectedCampaign.title}"</span> telah tercatat di sistem kami. Pengurus kami akan segera memverifikasi dan memperbarui data terkumpul.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                      `Halo Admin Srikandi Bali, saya ${donorName || 'Donatur'} telah menyelesaikan transfer donasi untuk "${selectedCampaign.title}" sebesar Rp ${donateAmount.toLocaleString('id-ID')}. Berikut lampiran bukti transfer saya.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    Kirim Bukti Transfer ke Admin WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setSelectedCampaign(null);
                      setIsSuccessModal(false);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: POPUP DAFTAR DONATUR TERKONFIRMASI */}
      {selectedCampaignForDonors && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 text-slate-900">
            <button
              onClick={() => setSelectedCampaignForDonors(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Daftar Donatur Terkonfirmasi (Verified)
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedCampaignForDonors.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Target: Rp {Number(selectedCampaignForDonors.targetAmount || 0).toLocaleString('id-ID')} • Terkumpul: Rp {Number(selectedCampaignForDonors.currentAmount || 0).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Search Filter for Donors */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama donatur..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Donor List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(() => {
                  const campaignDonors = donors
                    .filter((d) => d.id_Campaigns === selectedCampaignForDonors.id && d.status === 'konfirm')
                    .filter((d) => d.nama.toLowerCase().includes(donorSearch.toLowerCase()));

                  if (campaignDonors.length === 0) {
                    return (
                      <div className="text-center py-8 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
                        <Heart className="w-8 h-8 text-rose-400 mx-auto opacity-60" />
                        <p className="text-xs font-semibold text-slate-700">Belum ada donatur terkonfirmasi</p>
                        <p className="text-[11px] text-slate-500">Jadilah yang pertama mendukung program amal ini!</p>
                      </div>
                    );
                  }

                  return campaignDonors.map((don, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-pink-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {don.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{don.nama}</h4>
                          <span className="text-[10px] text-slate-400">
                            {don.tanggal ? `Donasi: ${don.tanggal}` : 'Donasi Terverifikasi'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-rose-600 block">
                          Rp {Number(don.jumlah_donasi || 0).toLocaleString('id-ID')}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                          ✓ Terkonfirmasi
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Total Terkonfirmasi: <strong className="text-rose-600">{donors.filter((d) => d.id_Campaigns === selectedCampaignForDonors.id && d.status === 'konfirm').length} Donatur</strong>
                </span>
                <button
                  onClick={() => {
                    const camp = selectedCampaignForDonors;
                    setSelectedCampaignForDonors(null);
                    setSelectedCampaign(camp);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <Gift className="w-3.5 h-3.5" /> Donasi Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
