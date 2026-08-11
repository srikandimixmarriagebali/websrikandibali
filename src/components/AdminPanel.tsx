import React, { useState } from 'react';
import { X, Plus, Edit3, Trash2, CheckCircle, Sparkles, Image as ImageIcon, Calendar, Heart, ShieldAlert, Download, RefreshCw, Lock, Unlock, Save } from 'lucide-react';
import { Event, GalleryAlbum, EventCategory, CharityCampaign } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  events,
  albums,
  campaigns,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMarkEventFinished,
  onAddAlbum,
  onAddPhotoToAlbum,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'gallery' | 'campaigns' | 'system'>('events');
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // New photo state
  const [selectedAlbumIdForPhoto, setSelectedAlbumIdForPhoto] = useState<string>(albums[0]?.id || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');

  // Sample preset images for quick selection
  const presetImages = [
    { label: 'Seminar / Workshop', url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Aksi Bantuan Anak', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Bakti Sosial Sembako', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Bazar / Culture', url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Gala Dinner / Gathering', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80' }
  ];

  if (!isOpen) return null;

  const handleCreateNewEventForm = () => {
    setEditingEvent({
      id: `evt-${Date.now()}`,
      title: '',
      category: 'Workshop/Legal',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 - 15:00 WITA',
      location: 'Denpasar / Seminyak, Bali',
      address: 'Jl. Sunset Road, Bali',
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full my-auto shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Panel Top Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-950 text-white p-5 px-6 flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-bold shadow">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                PORTAL ADMIN SRIKANDI BALI
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  AKSI KELOLA AKTIF
                </span>
              </h2>
              <p className="text-xs text-rose-200/80">Kelola Acara Mendatang, Galeri Foto, & Program Amal dengan Mudah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-rose-900/60 text-rose-200 hover:bg-rose-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-rose-50 border-b border-pink-100 px-6 pt-3 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-white text-rose-900 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-rose-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-rose-600" />
            Kelola Event ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-white text-rose-900 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-rose-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-rose-600" />
            Kelola Galeri Foto ({albums.length})
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-white text-rose-900 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-rose-900'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
            Backup & Reset Data
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          
          {/* TAB 1: KELOLA EVENT */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              
              {!editingEvent ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Daftar Acara Srikandi Bali</h3>
                      <p className="text-xs text-slate-500">Tambah acara baru, edit detail, atau ubah status ke Acara Selesai.</p>
                    </div>
                    <button
                      onClick={handleCreateNewEventForm}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Event Baru
                    </button>
                  </div>

                  {/* Events Table / List */}
                  <div className="space-y-3">
                    {events.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={evt.image}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  evt.status === 'upcoming'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {evt.status === 'upcoming' ? 'Mendatang' : 'Selesai'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold">{evt.category}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{evt.title}</h4>
                            <p className="text-xs text-slate-500">{evt.date} • {evt.location}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {evt.status === 'upcoming' && (
                            <button
                              onClick={() => onMarkEventFinished(evt.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                              title="Tandai Selesai & Pindahkan ke Galeri"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Ke Galeri
                            </button>
                          )}

                          <button
                            onClick={() => setEditingEvent(evt)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => onDeleteEvent(evt.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
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
                /* EDIT / CREATE FORM */
                <form onSubmit={handleSaveEvent} className="bg-white p-6 rounded-2xl border border-pink-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      {events.some((e) => e.id === editingEvent.id) ? 'Edit Event Srikandi' : 'Tambah Event Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Judul Event:</label>
                      <input
                        type="text"
                        required
                        value={editingEvent.title || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                        placeholder="Contoh: Workshop Postnup & Hak Properti Bali 2026"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Kategori Event:</label>
                      <select
                        value={editingEvent.category || 'Workshop/Legal'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as EventCategory })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="Workshop/Legal">Workshop/Legal</option>
                        <option value="Charity/Amal">Charity/Amal</option>
                        <option value="Social/Gathering">Social/Gathering</option>
                        <option value="Culture/Seni">Culture/Seni</option>
                        <option value="Edukasi">Edukasi</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Tanggal Acara (YYYY-MM-DD):</label>
                      <input
                        type="date"
                        required
                        value={editingEvent.date || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Jam Acara:</label>
                      <input
                        type="text"
                        value={editingEvent.time || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                        placeholder="10:00 - 15:00 WITA"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Lokasi Ringkas:</label>
                      <input
                        type="text"
                        value={editingEvent.location || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                        placeholder="Seminyak Beach Resort, Bali"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Status Event:</label>
                      <select
                        value={editingEvent.status || 'upcoming'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as 'upcoming' | 'finished' })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="upcoming">Mendatang (Upcoming)</option>
                        <option value="finished">Selesai (Past Event)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preset Image Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">Pilih Gambar Sampul Preset / URL Custom:</label>
                    <div className="flex flex-wrap gap-2">
                      {presetImages.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditingEvent({ ...editingEvent, image: p.url })}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                            editingEvent.image === p.url
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-pink-50'
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-mono"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  {/* AI Assistant Generator */}
                  <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                        Bantuan AI Srikandi untuk Deskripsi Event
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateAiDescription}
                        disabled={isAiGenerating}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1"
                      >
                        {isAiGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {isAiGenerating ? 'Menyusun...' : 'Buat Deskripsi Otomatis'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Deskripsi Lengkap:</label>
                    <textarea
                      rows={3}
                      value={editingEvent.description || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Event
                  </button>
                </form>
              )}

            </div>
          )}

          {/* TAB 2: KELOLA GALERI */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              
              {/* Form Tambah Foto Ke Album */}
              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-rose-600" />
                  Tambah Foto Baru ke Galeri Album
                </h3>

                <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Pilih Album Galeri:</label>
                      <select
                        value={selectedAlbumIdForPhoto}
                        onChange={(e) => setSelectedAlbumIdForPhoto(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                      >
                        {albums.map((alb) => (
                          <option key={alb.id} value={alb.id}>
                            {alb.title} ({alb.photos.length} Foto)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">URL Gambar Foto:</label>
                      <input
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Caption / Keterangan Foto:</label>
                    <input
                      type="text"
                      placeholder="Keterangan momen dalam foto..."
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Tambahkan Foto
                  </button>
                </form>
              </div>

              {/* Album List Preview */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daftar Album Foto Terdaftar:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {albums.map((alb) => (
                    <div key={alb.id} className="bg-white p-4 rounded-2xl border border-pink-100 flex items-center gap-3">
                      <img src={alb.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover border" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{alb.title}</h4>
                        <p className="text-[11px] text-slate-500">{alb.photos.length} Foto Tersimpan • {alb.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BACKUP & SYSTEM */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Pengaturan Data Organisasi</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semua perubahan event dan galeri disimpan secara langsung pada memori aplikasi dan localStorage browser. Anda dapat menyalin data backup atau mengembalikan ke data sampel awal kapan saja.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={onResetData}
                    className="bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-rose-600" />
                    Reset Ke Sampel Data Awal Srikandi
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>SRIKANDI BALI — Management Console</span>
          <button onClick={onClose} className="font-bold text-rose-600 hover:underline">
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  );
};
