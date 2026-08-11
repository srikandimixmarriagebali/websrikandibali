import React, { useState } from 'react';
import { Lock, Unlock, Mail, Key, LogOut, ArrowLeft, Calendar, Image as ImageIcon, Heart, RefreshCw, Plus, Edit3, Trash2, CheckCircle, Sparkles, Save, ShieldCheck } from 'lucide-react';
import { Event, GalleryAlbum, EventCategory, CharityCampaign } from '../types';

interface AdminPageProps {
  events: Event[];
  albums: GalleryAlbum[];
  campaigns: CharityCampaign[];
  onAddEvent: (newEvent: Event) => void;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onMarkEventFinished: (eventId: string) => void;
  onAddAlbum: (newAlbum: GalleryAlbum) => void;
  onAddPhotoToAlbum: (albumId: string, url: string, caption: string) => void;
  onResetData: () => void;
  onNavigateHome: () => void;
  theme?: 'dark' | 'light';
}

export const AdminPage: React.FC<AdminPageProps> = ({
  events,
  albums,
  campaigns,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMarkEventFinished,
  onAddAlbum,
  onAddPhotoToAlbum,
  onResetData,
  onNavigateHome,
  theme = 'dark'
}) => {
  // Login authentication state stored in session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('srikandi_admin_authenticated') === 'true';
  });

  const [email, setEmail] = useState<string>('admin@srikandimixmarriagebali.org');
  const [password, setPassword] = useState<string>('Srikandi2026New');
  const [loginError, setLoginError] = useState<string>('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'events' | 'gallery' | 'campaigns' | 'system'>('events');
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // New photo state for gallery
  const [selectedAlbumIdForPhoto, setSelectedAlbumIdForPhoto] = useState<string>(albums[0]?.id || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');

  const presetImages = [
    { label: 'Seminar / Workshop', url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Aksi Bantuan Anak', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Bakti Sosial Sembako', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Bazar / Culture', url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Gala Dinner / Gathering', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === 'admin@srikandimixmarriagebali.org' && password === 'Srikandi2026New') {
      setIsAuthenticated(true);
      sessionStorage.setItem('srikandi_admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Email atau kata sandi tidak valid. Silakan periksa kembali credential admin Anda.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('srikandi_admin_authenticated');
  };

  const handleCreateNewEventForm = () => {
    setEditingEvent({
      id: `evt-${Date.now()}`,
      title: '',
      category: 'Workshop/Legal',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 - 15:00 WITA',
      location: 'Denpasar / Seminyak, Bali',
      address: 'Jl. Sunset Road No. 88, Bali',
      status: 'upcoming',
      description: '',
      summary: '',
      image: presetImages[0].url,
      registeredCount: 0,
      maxCapacity: 50,
      speakerOrOrganizer: 'Tim Srikandi Bali',
      highlights: ['Sesi diskusi & networking', 'Konsultasi informasi gratis'],
      contactPhone: '+62 812-3456-7890'
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;

    const fullEvent: Event = {
      id: editingEvent.id || `evt-${Date.now()}`,
      title: editingEvent.title || 'Event Srikandi Bali',
      category: (editingEvent.category as EventCategory) || 'Workshop/Legal',
      date: editingEvent.date || new Date().toISOString().split('T')[0],
      time: editingEvent.time || '10:00 WITA',
      location: editingEvent.location || 'Bali',
      address: editingEvent.address || 'Bali',
      status: editingEvent.status || 'upcoming',
      description: editingEvent.description || 'Deskripsi acara.',
      summary: editingEvent.summary || 'Ringkasan acara.',
      image: editingEvent.image || presetImages[0].url,
      registeredCount: editingEvent.registeredCount || 0,
      maxCapacity: editingEvent.maxCapacity || 50,
      speakerOrOrganizer: editingEvent.speakerOrOrganizer || 'Srikandi Bali',
      highlights: editingEvent.highlights || ['Kegiatan Srikandi Bali'],
      contactPhone: editingEvent.contactPhone || '+62 812-3456-7890',
      targetFund: editingEvent.targetFund,
      currentFund: editingEvent.currentFund
    };

    const exists = events.some((e) => e.id === fullEvent.id);
    if (exists) {
      onUpdateEvent(fullEvent);
    } else {
      onAddEvent(fullEvent);
    }

    setEditingEvent(null);
  };

  const handleGenerateAiDescription = async () => {
    if (!editingEvent || !editingEvent.title) {
      alert('Silakan masukkan Judul Event terlebih dahulu!');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Buatkan deskripsi singkat menarik dan ringkasan untuk acara Srikandi Bali berjudul: "${editingEvent.title}" kategori "${editingEvent.category}". Tulis dalam bahasa Indonesia yang hangat dan mengajak partisipasi.`,
          context: 'event_creator'
        })
      });

      const data = await res.json();
      if (data.response) {
        setEditingEvent((prev) => ({
          ...prev,
          description: data.response,
          summary: data.response.slice(0, 120) + '...'
        }));
      }
    } catch (err) {
      setEditingEvent((prev) => ({
        ...prev,
        description: `Acara spesial Srikandi Bali "${editingEvent.title}". Mari bergabung mempererat silaturahmi, berbagi informasi, dan menebar aksi sosial bersama anggota Srikandi dari seluruh Indonesia.`,
        summary: `Acara spesial Srikandi Bali: ${editingEvent.title}.`
      }));
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbumIdForPhoto || !newPhotoUrl) return;

    onAddPhotoToAlbum(selectedAlbumIdForPhoto, newPhotoUrl, newPhotoCaption || 'Foto Kegiatan Srikandi Bali');
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    alert('Foto berhasil ditambahkan ke album galeri!');
  };

  // IF NOT AUTHENTICATED -> SHOW ADMIN LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-rose-50/60 text-slate-900'
      }`}>
        <div className={`max-w-md w-full rounded-3xl p-8 shadow-2xl border transition-all ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-rose-200'
        }`}>
          {/* Back to Website button */}
          <button
            onClick={onNavigateHome}
            className={`mb-6 text-xs font-semibold flex items-center gap-2 transition-colors ${
              theme === 'dark' ? 'text-rose-300 hover:text-white' : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Website Utama Srikandi
          </button>

          {/* Header Branding */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-rose-800 p-0.5 mx-auto shadow-xl">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-950' : 'bg-white'
              }`}>
                <span className="text-3xl">🌸</span>
              </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-pink-500 via-rose-600 to-amber-500 bg-clip-text text-transparent">
              PORTAL ADMIN SRIKANDI BALI
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Sistem Manajemen Pengelola Event, Galeri Dokumentasi & Program Amal Organisasi
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium leading-relaxed">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide uppercase text-slate-400 block">
                Email Admin:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@srikandimixmarriagebali.org"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wide uppercase text-slate-400 block">
                Kata Sandi Admin:
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-rose-900/30 text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" />
              Masuk Portal Admin
            </button>
          </form>

          {/* Quick Info Box */}
          <div className={`mt-6 p-4 rounded-2xl border text-[11px] leading-relaxed text-slate-400 flex items-start gap-2.5 ${
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300 block mb-0.5">Akses Khusus Pengurus Srikandi Bali:</strong>
              Gunakan email <code className="text-pink-400">admin@srikandimixmarriagebali.org</code> dan kata sandi yang telah ditentukan untuk mengelola konten web.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED -> SHOW FULL ADMIN DASHBOARD PAGE
  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-rose-50/40 text-slate-900'
    }`}>
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-rose-950 via-rose-900 to-slate-950 text-white border-b border-rose-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🌸</span>
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider uppercase bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 bg-clip-text text-transparent">
                PORTAL ADMIN SRIKANDI BALI
              </h1>
              <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Logged as: admin@srikandimixmarriagebali.org
              </span>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-700/80 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Lihat Web Utama</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
              title="Keluar dari Portal Admin"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Admin Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className={`p-1.5 rounded-2xl border flex flex-wrap items-center gap-2 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-rose-200 shadow-sm'
        }`}>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Kelola Event Mendatang ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Kelola Galeri Foto ({albums.length})
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Pengaturan Data & Reset
          </button>
        </div>

        {/* TAB 1: KELOLA EVENT */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {!editingEvent ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Daftar Acara Srikandi Bali</h2>
                    <p className="text-xs text-slate-400 mt-1">Tambah acara baru, edit detail, atau tandai acara yang telah selesai.</p>
                  </div>
                  <button
                    onClick={handleCreateNewEventForm}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Event Baru
                  </button>
                </div>

                <div className="grid gap-4">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-rose-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                evt.status === 'upcoming'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              {evt.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                            </span>
                            <span className="text-[10px] text-pink-400 font-semibold">{evt.category}</span>
                          </div>
                          <h3 className="text-base font-bold line-clamp-1">{evt.title}</h3>
                          <p className="text-xs text-slate-400">{evt.date} • {evt.time} • {evt.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {evt.status === 'upcoming' && (
                          <button
                            onClick={() => onMarkEventFinished(evt.id)}
                            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 flex items-center gap-1.5 transition-colors"
                            title="Tandai Selesai & Otomatis Masuk Galeri"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Ke Galeri
                          </button>
                        )}

                        <button
                          onClick={() => setEditingEvent(evt)}
                          className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                            theme === 'dark'
                              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                              : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-rose-50'
                          }`}
                        >
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>

                        <button
                          onClick={() => onDeleteEvent(evt.id)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                          title="Hapus Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* FORM CREATE / EDIT EVENT */
              <form onSubmit={handleSaveEvent} className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-rose-200 shadow-lg'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h2 className="text-lg font-bold">
                    {events.some((e) => e.id === editingEvent.id) ? 'Edit Detail Event' : 'Tambah Event Baru'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Judul Event:</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                      placeholder="Contoh: Seminar Legalitas Kitas & Hak Properti Bali 2026"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Kategori Event:</label>
                    <select
                      value={editingEvent.category || 'Workshop/Legal'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as EventCategory })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Workshop/Legal">Workshop/Legal</option>
                      <option value="Charity/Amal">Charity/Amal</option>
                      <option value="Social/Gathering">Social/Gathering</option>
                      <option value="Culture/Seni">Culture/Seni</option>
                      <option value="Edukasi">Edukasi</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Tanggal Acara (YYYY-MM-DD):</label>
                    <input
                      type="date"
                      required
                      value={editingEvent.date || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Jam Acara:</label>
                    <input
                      type="text"
                      value={editingEvent.time || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                      placeholder="10:00 - 15:00 WITA"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Lokasi Ringkas:</label>
                    <input
                      type="text"
                      value={editingEvent.location || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                      placeholder="Seminyak Beach Resort, Bali"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Status Event:</label>
                    <select
                      value={editingEvent.status || 'upcoming'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as 'upcoming' | 'finished' })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="upcoming">Mendatang (Upcoming)</option>
                      <option value="finished">Selesai (Past Event)</option>
                    </select>
                  </div>
                </div>

                {/* Preset Image Options */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 block">Pilih Gambar Sampul Preset / URL Custom:</label>
                  <div className="flex flex-wrap gap-2">
                    {presetImages.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingEvent({ ...editingEvent, image: p.url })}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                          editingEvent.image === p.url
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={editingEvent.image || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border font-mono ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* AI Assistant Copywriter */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      Asisten AI Gemini Copywriter Srikandi
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateAiDescription}
                      disabled={isAiGenerating}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5"
                    >
                      {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {isAiGenerating ? 'Menyusun...' : 'Buat Deskripsi Otomatis'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">Deskripsi Lengkap Event:</label>
                  <textarea
                    rows={4}
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:ring-2 focus:ring-rose-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-2xl shadow-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Simpan Event Srikandi Bali
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: KELOLA GALERI */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-rose-200 shadow-sm'
            }`}>
              <h2 className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-500" />
                Tambah Foto Baru ke Album Galeri Dokumentasi
              </h2>

              <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">Pilih Album Galeri:</label>
                    <select
                      value={selectedAlbumIdForPhoto}
                      onChange={(e) => setSelectedAlbumIdForPhoto(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      {albums.map((alb) => (
                        <option key={alb.id} value={alb.id}>
                          {alb.title} ({alb.photos.length} Foto)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">URL Gambar Foto:</label>
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">Keterangan / Caption Foto:</label>
                  <input
                    type="text"
                    placeholder="Momen diskusi hangat bersama narasumber Srikandi..."
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambahkan Foto ke Album
                </button>
              </form>
            </div>

            {/* Existing Albums Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar Album Foto Terdaftar:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {albums.map((alb) => (
                  <div
                    key={alb.id}
                    className={`p-4 rounded-2xl border flex items-center gap-4 ${
                      theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-rose-200 shadow-sm'
                    }`}
                  >
                    <img src={alb.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-700" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-sm font-bold">{alb.title}</h4>
                      <p className="text-xs text-slate-400">{alb.photos.length} Foto Tersimpan • {alb.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM & RESET */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-rose-200 shadow-sm'
            }`}>
              <h2 className="text-lg font-bold">Pengaturan Database & Data Sampel</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Semua data event, galeri, dan kampanye tersimpan pada penyimpanan lokal browser (localStorage). Jika Anda ingin mengembalikan data ke kondisi sampel awal Srikandi Bali, silakan tekan tombol di bawah ini.
              </p>

              <button
                onClick={onResetData}
                className="bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-rose-400" />
                Reset Ke Sampel Data Awal Srikandi Bali
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
