import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Edit3, CheckCircle, Gift, Share2, Check, X, UserCheck } from 'lucide-react';
import { Event, EventParticipant } from '../types';
import { Language, translations } from '../data/translations';
import { DriveImage } from './DriveImage';

interface UpcomingEventsSectionProps {
  language: Language;
  theme: 'dark' | 'light';
  events: Event[];
  participants?: EventParticipant[];
  onSelectEvent: (event: Event) => void;
  isLoading?: boolean;
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  language,
  theme,
  events,
  participants = [],
  onSelectEvent,
  isLoading = false
}) => {
  const t = translations[language].upcomingEvents;

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<Event | null>(null);
  const [participantSearch, setParticipantSearch] = useState<string>('');

  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const categories = ['Semua', 'Charity/Amal', 'Workshop/Legal', 'Social/Gathering', 'Culture/Seni', 'Edukasi'];

  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesCategory = selectedCategory === 'Semua' || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nearestEvent = upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!nearestEvent) return;

    const timer = setInterval(() => {
      const eventDate = new Date(`${nearestEvent.date}T10:00:00`).getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nearestEvent]);

  const handleShare = (event: Event) => {
    const text = `🌸 Srikandi Bali Event: ${event.title}\n📅 Date: ${event.date} (${event.time})\n📍 Location: ${event.location}`;
    navigator.clipboard.writeText(text);
    setCopiedEventId(event.id);
    setTimeout(() => setCopiedEventId(null), 2500);
  };

  const handleDownloadIcs = (event: Event) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Srikandi Bali//Event Calendar//ID
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, ' ')}
LOCATION:${event.location}
DTSTART:${event.date.replace(/-/g, '')}T020000Z
DTEND:${event.date.replace(/-/g, '')}T070000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-srikandi-event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="events" className={`py-20 transition-colors ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-gradient-to-b from-pink-50/50 via-white to-rose-50/80 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/20 text-pink-500 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
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

        {/* Countdown Banner */}
        {nearestEvent && (
          <div className="mb-14 rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-rose-800 relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-7 space-y-2">
                <span className="inline-block text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full">
                  ⏱️ COUNTDOWN TO NEXT EVENT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white line-clamp-2">
                  {nearestEvent.title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200/90 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  {nearestEvent.location} • {nearestEvent.date} ({nearestEvent.time})
                </p>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-3 text-center">
                <div className="bg-rose-900/80 border border-pink-500/30 p-3 rounded-2xl min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-pink-200">{timeLeft.days}</span>
                  <span className="block text-[10px] uppercase text-rose-300 font-bold mt-0.5">Days</span>
                </div>
                <div className="bg-rose-900/80 border border-pink-500/30 p-3 rounded-2xl min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-pink-200">{timeLeft.hours}</span>
                  <span className="block text-[10px] uppercase text-rose-300 font-bold mt-0.5">Hours</span>
                </div>
                <div className="bg-rose-900/80 border border-pink-500/30 p-3 rounded-2xl min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-pink-200">{timeLeft.minutes}</span>
                  <span className="block text-[10px] uppercase text-rose-300 font-bold mt-0.5">Mins</span>
                </div>
                <div className="bg-rose-900/80 border border-pink-500/30 p-3 rounded-2xl min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-pink-200">{timeLeft.seconds}</span>
                  <span className="block text-[10px] uppercase text-rose-300 font-bold mt-0.5">Secs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className={`mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                    : theme === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-rose-50 text-rose-900 hover:bg-pink-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event / location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Grid / Skeleton */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`rounded-3xl border shadow-lg overflow-hidden flex flex-col animate-pulse ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100'
                }`}
              >
                <div className="h-52 bg-slate-800/40 relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 animate-ping" />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="h-5 bg-rose-500/20 rounded-md w-3/4" />
                    <div className="h-4 bg-slate-700/30 rounded-md w-1/2" />
                    <div className="h-4 bg-slate-700/30 rounded-md w-2/3" />
                  </div>
                  <div className="h-11 bg-rose-500/20 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`group rounded-3xl border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100/80'
                }`}
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <DriveImage
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {event.category}
                  </span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-center px-2.5 py-1 rounded-xl shadow-md">
                    <span className="block text-xs font-black text-rose-600">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="block text-[10px] font-bold uppercase text-slate-600">
                      {new Date(event.date).toLocaleString('en-US', { month: 'short' })}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                      {event.title}
                    </h3>
                    <div className="space-y-1.5 text-xs text-slate-400">
                      <p className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{event.time}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-300">{event.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectEvent(event)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        {t.btnRsvp}
                      </button>

                      {/* Tombol Daftar Nama Peserta yang Sudah Mendaftar */}
                      <button
                        onClick={() => {
                          setSelectedEventForParticipants(event);
                          setParticipantSearch('');
                        }}
                        className={`w-full text-xs font-semibold py-2.5 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                          theme === 'dark'
                            ? 'bg-slate-900 border-slate-800 text-pink-300 hover:bg-slate-800'
                            : 'bg-pink-50/80 border-pink-200 text-rose-800 hover:bg-pink-100'
                        }`}
                        title="Lihat Daftar Peserta yang Sudah Mendaftar"
                      >
                        <Users className="w-3.5 h-3.5 text-rose-500" />
                        Peserta ({participants.filter((p) => p.even_id === event.id).length})
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <button onClick={() => handleShare(event)} className="hover:text-rose-500 flex items-center gap-1">
                        {copiedEventId === event.id ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Copied!
                          </span>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" /> Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 rounded-3xl border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-pink-100'}`}>
            <Calendar className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No events found</h3>
          </div>
        )}

      </div>

      {/* POPUP MODAL: DAFTAR PESERTA TERDAFTAR */}
      {selectedEventForParticipants && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 text-slate-900">
            <button
              onClick={() => setSelectedEventForParticipants(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                  Daftar Peserta Terdaftar
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedEventForParticipants.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>📅 {selectedEventForParticipants.date} ({selectedEventForParticipants.time})</span>
                  <span>•</span>
                  <span>📍 {selectedEventForParticipants.location}</span>
                </p>
              </div>

              {/* Search Filter in participants list */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama peserta..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Participants List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(() => {
                  const eventPeserta = participants
                    .filter((p) => p.even_id === selectedEventForParticipants.id)
                    .filter((p) => p.nama.toLowerCase().includes(participantSearch.toLowerCase()));

                  if (eventPeserta.length === 0) {
                    return (
                      <div className="text-center py-8 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
                        <Users className="w-8 h-8 text-rose-400 mx-auto opacity-60" />
                        <p className="text-xs font-semibold text-slate-700">Belum ada peserta terdaftar</p>
                        <p className="text-[11px] text-slate-500">Jadilah yang pertama mendaftar untuk acara ini!</p>
                      </div>
                    );
                  }

                  return eventPeserta.map((peserta, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-pink-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {peserta.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{peserta.nama}</h4>
                          <span className="text-[10px] text-slate-400">
                            {peserta.registered_at ? `Terdaftar: ${peserta.registered_at}` : 'Terdaftar di Srikandi Bali'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Hadir
                      </span>
                    </div>
                  ));
                })()}
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Total Peserta: <strong className="text-rose-600">{participants.filter((p) => p.even_id === selectedEventForParticipants.id).length} Orang</strong>
                </span>
                <button
                  onClick={() => {
                    const evt = selectedEventForParticipants;
                    setSelectedEventForParticipants(null);
                    onSelectEvent(evt);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <Gift className="w-3.5 h-3.5" /> Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
