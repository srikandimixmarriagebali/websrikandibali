import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { VisionMissionSection } from './components/VisionMissionSection';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { GallerySection } from './components/GallerySection';
import { CharitySection } from './components/CharitySection';
import { AiAssistantSection } from './components/AiAssistantSection';
import { AdminPanel } from './components/AdminPanel';
import { AdminPage } from './components/AdminPage';
import { RsvpModal } from './components/RsvpModal';
import { Footer } from './components/Footer';

import { initialEvents, initialAlbums, initialCampaigns } from './data/initialData';
import { Event, GalleryAlbum, CharityCampaign } from './types';
import { Language } from './data/translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('id');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Check if current URL path or hash matches admin route
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.endsWith('/admin') ||
      hash === '#/admin' ||
      hash === '#admin' ||
      hash === '#/admin/'
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());

  // Listen to popstate or link navigation or hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Local state initialized with local storage or initial sample data
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('srikandi_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialEvents;
      }
    }
    return initialEvents;
  });

  const [albums, setAlbums] = useState<GalleryAlbum[]>(() => {
    const saved = localStorage.getItem('srikandi_albums');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialAlbums;
      }
    }
    return initialAlbums;
  });

  const [campaigns, setCampaigns] = useState<CharityCampaign[]>(() => {
    const saved = localStorage.getItem('srikandi_campaigns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCampaigns;
      }
    }
    return initialCampaigns;
  });

  // Admin Mode & Modal states
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [selectedRsvpEvent, setSelectedRsvpEvent] = useState<Event | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('srikandi_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('srikandi_albums', JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem('srikandi_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Admin Handler Actions
  const handleToggleAdminMode = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setIsAdminPanelOpen(false);
    } else {
      setIsAdmin(true);
      setIsAdminPanelOpen(true);
    }
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    }
  };

  const handleMarkEventFinished = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'finished' } : e))
    );

    const newAlbum: GalleryAlbum = {
      id: `alb-${Date.now()}`,
      eventId: targetEvent.id,
      title: targetEvent.title,
      category: targetEvent.category,
      date: targetEvent.date,
      location: targetEvent.location,
      coverImage: targetEvent.image,
      attendeesCount: targetEvent.registeredCount || 25,
      summary: targetEvent.summary,
      charityImpact: targetEvent.charityImpact || 'Acara terlaksana dengan sukses bersama anggota Srikandi.',
      photos: targetEvent.galleryPhotos || [
        {
          id: `ph-${Date.now()}`,
          url: targetEvent.image,
          caption: `Dokumentasi acara ${targetEvent.title}`
        }
      ]
    };

    setAlbums((prev) => [newAlbum, ...prev]);
    alert(`Status event "${targetEvent.title}" berhasil diubah menjadi Selesai & otomatis ditambahkan ke Galeri!`);
  };

  const handleAddAlbum = (newAlbum: GalleryAlbum) => {
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleAddPhotoToAlbum = (albumId: string, url: string, caption: string) => {
    setAlbums((prev) =>
      prev.map((alb) => {
        if (alb.id === albumId) {
          return {
            ...alb,
            photos: [
              ...alb.photos,
              { id: `ph-${Date.now()}`, url, caption }
            ]
          };
        }
        return alb;
      })
    );
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (confirm('Hapus album galeri ini?')) {
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
    }
  };

  const handleDonateToCampaign = (campaignId: string, amount: number) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            currentAmount: c.currentAmount + amount,
            donorCount: c.donorCount + 1
          };
        }
        return c;
      })
    );
  };

  const handleConfirmRegistration = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return { ...e, registeredCount: e.registeredCount + 1 };
        }
        return e;
      })
    );
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua data event & galeri ke sampel awal Srikandi Bali?')) {
      localStorage.removeItem('srikandi_events');
      localStorage.removeItem('srikandi_albums');
      localStorage.removeItem('srikandi_campaigns');
      setEvents(initialEvents);
      setAlbums(initialAlbums);
      setCampaigns(initialCampaigns);
      alert('Data telah dikembalikan ke sampel awal Srikandi Bali.');
    }
  };

  // If path is /admin or #/admin, render Admin Portal
  if (isAdminRoute) {
    return (
      <AdminPage
        events={events}
        albums={albums}
        campaigns={campaigns}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        onMarkEventFinished={handleMarkEventFinished}
        onAddAlbum={handleAddAlbum}
        onAddPhotoToAlbum={handleAddPhotoToAlbum}
        onResetData={handleResetData}
        onNavigateHome={() => {
          if (window.location.hash) {
            window.location.hash = '';
          }
          if (window.location.pathname.includes('admin')) {
            window.history.pushState({}, '', '/');
          }
          setIsAdminRoute(false);
        }}
        theme={theme}
      />
    );
  }

  // Find nearest upcoming event for hero
  const nearestUpcoming = events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;

  return (
    <div className={`min-h-screen font-sans transition-colors selection:bg-rose-500 selection:text-white ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Navigation Header */}
      <Navbar
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdminMode}
        upcomingCount={upcomingCount}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Page Sections */}
      <main className="space-y-0">
        {/* Hero Section */}
        <HeroSection
          language={language}
          theme={theme}
          nextEvent={nearestUpcoming}
          onSelectEvent={(evt) => setSelectedRsvpEvent(evt)}
        />

        {/* Section: Siapa Kami (About) */}
        <AboutSection
          language={language}
          theme={theme}
        />

        {/* Section: Visi & Misi */}
        <VisionMissionSection
          language={language}
          theme={theme}
        />

        {/* Section: Next Event (Upcoming Events) */}
        <UpcomingEventsSection
          language={language}
          theme={theme}
          events={events}
          onSelectEvent={(evt) => setSelectedRsvpEvent(evt)}
          isAdmin={isAdmin}
          onEditEvent={() => {
            setIsAdminPanelOpen(true);
          }}
          onMarkAsFinished={(evt) => handleMarkEventFinished(evt.id)}
        />

        {/* Section: Galeri Acara Selesai */}
        <GallerySection
          language={language}
          theme={theme}
          albums={albums}
          isAdmin={isAdmin}
          onAddPhotoToAlbum={() => setIsAdminPanelOpen(true)}
          onDeleteAlbum={handleDeleteAlbum}
        />

        {/* Section: Aksi Amal & Donasi */}
        <CharitySection
          language={language}
          theme={theme}
          campaigns={campaigns}
          onDonateToCampaign={handleDonateToCampaign}
        />

        {/* Section: Konsultasi Hukum & AI Srikandi */}
        <AiAssistantSection
          language={language}
          theme={theme}
        />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        theme={theme}
      />

      {/* Admin Management Modal Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        events={events}
        albums={albums}
        campaigns={campaigns}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        onMarkEventFinished={handleMarkEventFinished}
        onAddAlbum={handleAddAlbum}
        onAddPhotoToAlbum={handleAddPhotoToAlbum}
        onResetData={handleResetData}
      />

      {/* RSVP Registration Modal */}
      <RsvpModal
        event={selectedRsvpEvent}
        onClose={() => setSelectedRsvpEvent(null)}
        onConfirmRegistration={handleConfirmRegistration}
      />
    </div>
  );
}
