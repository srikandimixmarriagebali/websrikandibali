import React, { useState } from 'react';
import { Image as ImageIcon, Search, Calendar, MapPin, Heart, X, ChevronLeft, ChevronRight, Share2, Check, Trash2 } from 'lucide-react';
import { GalleryAlbum } from '../types';
import { Language, translations } from '../data/translations';

interface GallerySectionProps {
  language: Language;
  theme: 'dark' | 'light';
  albums: GalleryAlbum[];
  isAdmin: boolean;
  onAddPhotoToAlbum?: (albumId: string) => void;
  onDeleteAlbum?: (albumId: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  language,
  theme,
  albums,
  isAdmin,
  onAddPhotoToAlbum,
  onDeleteAlbum
}) => {
  const t = translations[language].gallery;

  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const categories = ['Semua', 'Charity/Amal', 'Workshop/Legal', 'Social/Gathering'];

  const filteredAlbums = albums.filter((alb) => {
    const matchesCategory = selectedCategory === 'Semua' || alb.category === selectedCategory;
    const matchesSearch =
      alb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alb.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alb.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (album: GalleryAlbum, index = 0) => {
    setSelectedAlbum(album);
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setActivePhotoIndex(0);
  };

  const nextPhoto = () => {
    if (!selectedAlbum) return;
    setActivePhotoIndex((prev) => (prev + 1) % selectedAlbum.photos.length);
  };

  const prevPhoto = () => {
    if (!selectedAlbum) return;
    setActivePhotoIndex((prev) => (prev - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length);
  };

  const handleSharePhoto = (photoUrl: string) => {
    navigator.clipboard.writeText(photoUrl);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section id="galeri" className={`py-20 transition-colors relative ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/80 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-rose-200/90 text-sm sm:text-base">
            {t.subtitle}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-pink-500 to-rose-600 mx-auto rounded-full" />
        </div>

        {/* Filter Tabs & Search */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredAlbums.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                className="group rounded-3xl bg-slate-800/90 border border-slate-700 overflow-hidden shadow-xl hover:border-pink-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => openLightbox(album, 0)}>
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {album.category}
                    </span>

                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-pink-300 text-xs font-bold px-2.5 py-1 rounded-xl border border-rose-800 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {album.photos.length} {t.photos}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-rose-200">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        {album.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        {album.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3
                      onClick={() => openLightbox(album, 0)}
                      className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors cursor-pointer line-clamp-2"
                    >
                      {album.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {album.summary}
                    </p>

                    {album.charityImpact && (
                      <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-xs text-pink-200 flex items-start gap-2">
                        <Heart className="w-4 h-4 text-pink-400 shrink-0 mt-0.5 fill-pink-400" />
                        <div>
                          <span className="font-bold text-white block">{t.charityImpact}</span>
                          <span className="text-rose-200/90">{album.charityImpact}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => openLightbox(album, 0)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t.viewPhotos}
                  </button>

                  {isAdmin && onDeleteAlbum && (
                    <button
                      onClick={() => onDeleteAlbum(album.id)}
                      className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-900/40"
                      title="Delete Album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/50 rounded-3xl border border-slate-700">
            <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No gallery photos found</h3>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedAlbum && selectedAlbum.photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-rose-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-5xl max-h-[90vh] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-pink-300">{selectedAlbum.title}</h3>
                <p className="text-xs text-slate-400">{selectedAlbum.location} • {selectedAlbum.date}</p>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-pink-300 px-3 py-1 rounded-full border border-slate-700">
                {activePhotoIndex + 1} / {selectedAlbum.photos.length}
              </span>
            </div>

            <div className="relative flex-1 min-h-[300px] sm:min-h-[450px] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={selectedAlbum.photos[activePhotoIndex].url}
                alt={selectedAlbum.photos[activePhotoIndex].caption}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />

              {selectedAlbum.photos.length > 1 && (
                <>
                  <button onClick={prevPhoto} className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextPhoto} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-200 text-center sm:text-left flex-1 font-medium">
                {selectedAlbum.photos[activePhotoIndex].caption}
              </p>

              <button
                onClick={() => handleSharePhoto(selectedAlbum.photos[activePhotoIndex].url)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-pink-300" />}
                {copiedText ? 'Copied' : 'Share Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
