import React, { useState } from 'react';
import { X, CheckCircle, Calendar, MapPin, Gift } from 'lucide-react';
import { Event } from '../types';

interface RsvpModalProps {
  event: Event | null;
  onClose: () => void;
  onConfirmRegistration: (eventId: string, participantData: { nama: string; phone?: string; email?: string }) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({ event, onClose, onConfirmRegistration }) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmRegistration(event.id, {
      nama: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 text-slate-900">
        
        <button
          onClick={() => {
            setIsSubmitted(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Formulir Pendaftaran Event / Registration</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{event.title}</h3>
            </div>

            {/* Event Summary Box */}
            <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 text-xs text-rose-900 space-y-1.5">
              <p className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{event.date} ({event.time})</span>
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{event.location}</span>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap / Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ibu Amanda Wijaya"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-3456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jumlah / Attendees</label>
                  <select
                    value={attendeeCount}
                    onChange={(e) => setAttendeeCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                  >
                    <option value={1}>1 Orang / Person</option>
                    <option value={2}>2 Orang / Persons</option>
                    <option value={3}>3+ Orang / Persons</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email (optional)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Pesan khusus untuk panitia Srikandi Bali..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Konfirmasi Pendaftaran / Confirm Registration
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">Pendaftaran Berhasil / Registration Complete!</h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Terima kasih <strong className="text-slate-900">{fullName}</strong>, Anda telah terdaftar untuk menghadiri <em className="text-rose-900 font-semibold">{event.title}</em>.
            </p>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950 via-rose-900 to-slate-950 text-white space-y-2 border border-rose-800">
              <div className="flex items-center justify-between text-[11px] text-pink-300">
                <span>E-TICKET SRIKANDI BALI</span>
                <span className="font-mono">#SRK-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <p className="text-xs font-bold text-white truncate">{event.title}</p>
              <p className="text-[11px] text-rose-200">{event.date} • {event.time}</p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs"
            >
              Tutup / Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
