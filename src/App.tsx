import React, { useState, useEffect } from 'react';
import { Event, GalleryAlbum, CharityCampaign, MemberProfession, EventParticipant, DonorRecord, BankAccount } from './types';
import { Language, translations } from './data/translations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { VisionMissionSection } from './components/VisionMissionSection';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { GallerySection } from './components/GallerySection';
import { CharitySection } from './components/CharitySection';
import { Footer } from './components/Footer';
import { RsvpModal } from './components/RsvpModal';

export function App() {
  const [selectedRsvpEvent, setSelectedRsvpEvent] = useState<Event | null>(null);
  const [language, setLanguage] = useState<Language>('id');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [events, setEvents] = useState<Event[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [campaigns, setCampaigns] = useState<CharityCampaign[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [professions, setProfessions] = useState<MemberProfession[]>([]);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  // Fetch fresh data from Google Sheets API on every mount / page open / refresh
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/data', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data.events && Array.isArray(data.events)) setEvents(data.events);
        if (data.albums && Array.isArray(data.albums)) setAlbums(data.albums);
        if (data.campaigns && Array.isArray(data.campaigns)) setCampaigns(data.campaigns);
        if (data.faqs && Array.isArray(data.faqs)) setFaqs(data.faqs);
        if (data.professions && Array.isArray(data.professions)) setProfessions(data.professions);
        if (data.participants && Array.isArray(data.participants)) setParticipants(data.participants);
        if (data.donors && Array.isArray(data.donors)) setDonors(data.donors);
        if (data.bankAccounts && Array.isArray(data.bankAccounts)) setBankAccounts(data.bankAccounts);
      }
    } catch (err) {
      console.error("Failed to fetch fresh data from server", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Event Registration Action (Direct to Google Sheets tab 'Peserta')
  const handleConfirmRegistration = (
    eventId: string,
    participantData: { nama: string; phone?: string; email?: string }
  ) => {
    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        return { ...e, registeredCount: (e.registeredCount || 0) + 1 };
      }
      return e;
    });
    setEvents(updatedEvents);

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newParticipant: EventParticipant = {
      even_id: eventId,
      nama: participantData.nama,
      phone: participantData.phone,
      email: participantData.email,
      registered_at: nowStr
    };
    setParticipants((prev) => [newParticipant, ...prev]);

    fetch('/api/register-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newParticipant)
    }).catch((err) => console.error('Failed to post participant to Google Sheets', err));
  };

  // Donation Action (Direct to Google Sheets tab 'Donatur' with status 'not')
  const handleDonateToCampaign = (campaignId: string, amount: number, donorName: string) => {
    const newDonor: DonorRecord = {
      id_Campaigns: campaignId,
      nama: donorName || 'Hamba Allah',
      jumlah_donasi: amount,
      status: 'not',
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setDonors((prev) => [newDonor, ...prev]);

    fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_Campaigns: campaignId,
        nama: donorName || 'Hamba Allah',
        jumlah_donasi: amount
      })
    }).catch((err) => console.error('Failed to post donor to Google Sheets', err));
  };

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
          isLoading={isLoading}
          onSelectEvent={(evt) => setSelectedRsvpEvent(evt)}
        />

        {/* Section: Siapa Kami (About) */}
        <AboutSection
          language={language}
          theme={theme}
          professions={professions}
          isLoading={isLoading}
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
          participants={participants}
          isLoading={isLoading}
          onSelectEvent={(evt) => setSelectedRsvpEvent(evt)}
        />

        {/* Section: Galeri Acara Selesai */}
        <GallerySection
          language={language}
          theme={theme}
          albums={albums}
          isLoading={isLoading}
        />

        {/* Section: Aksi Amal & Donasi */}
        <CharitySection
          language={language}
          theme={theme}
          campaigns={campaigns}
          donors={donors}
          bankAccounts={bankAccounts}
          isLoading={isLoading}
          onDonateToCampaign={handleDonateToCampaign}
        />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        theme={theme}
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

export default App;
