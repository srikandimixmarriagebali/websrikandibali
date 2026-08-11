export type Language = 'id' | 'en';

export interface Translations {
  nav: {
    topBanner: string;
    topBannerTag: string;
    home: string;
    about: string;
    vision: string;
    events: string;
    gallery: string;
    charity: string;
    aiConsultation: string;
    registerEvent: string;
    adminPortal: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
    btnEvents: string;
    btnAbout: string;
    btnAi: string;
    statGlobal: string;
    statActive: string;
    statEvents: string;
    statNonProfit: string;
    nextEventBadge: string;
    registeredCount: string;
    btnRegisterDetail: string;
    noEventTitle: string;
    noEventDesc: string;
  };
  about: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    professionsTitle: string;
  };
  visionMission: {
    badge: string;
    title: string;
    subtitle: string;
    visionTitle: string;
    visionDesc: string;
    missionTitle: string;
    mission1: string;
    mission1Desc: string;
    mission2: string;
    mission2Desc: string;
    mission3: string;
    mission3Desc: string;
  };
  upcomingEvents: {
    badge: string;
    title: string;
    subtitle: string;
    all: string;
    workshop: string;
    charity: string;
    social: string;
    culture: string;
    edukasi: string;
    btnRsvp: string;
    fullCapacity: string;
    speakerLabel: string;
    highlightsLabel: string;
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    photos: string;
    attendees: string;
    charityImpact: string;
    viewPhotos: string;
  };
  charity: {
    badge: string;
    title: string;
    subtitle: string;
    target: string;
    targetLabel: string;
    collected: string;
    raisedLabel: string;
    donors: string;
    btnDonate: string;
    beneficiaries: string;
  };
  aiAssistant: {
    badge: string;
    title: string;
    subtitle: string;
    faqTitle: string;
    placeholder: string;
    send: string;
    disclaimer: string;
  };
  legalAi: {
    badge: string;
    title: string;
    subtitle: string;
    faqTitle: string;
    placeholder: string;
    send: string;
    disclaimer: string;
  };
  footer: {
    aboutText: string;
    navTitle: string;
    contactTitle: string;
    tagline: string;
    secretariatTitle: string;
    addressBali: string;
    addressJkt: string;
    phone: string;
    email: string;
    copyright: string;
    adminLink: string;
  };
  rsvpModal: {
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    phone: string;
    domicile: string;
    notes: string;
    btnSubmit: string;
    btnCancel: string;
    successTitle: string;
    successMsg: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    nav: {
      topBanner: 'Wadah Kebersamaan & Support System Perkawinan Campur Indonesia — Jakarta & Bali',
      topBannerTag: '400+ Anggota Global',
      home: 'Beranda',
      about: 'Siapa Kami',
      vision: 'Visi & Misi',
      events: 'Next Event',
      gallery: 'Galeri Acara',
      charity: 'Aksi Amal',
      aiConsultation: 'Konsultasi Legal AI',
      registerEvent: 'Daftar Event',
      adminPortal: 'Portal Admin'
    },
    hero: {
      badge: 'Komunitas Resmi Perkawinan Campur Indonesia • Jakarta & Bali',
      titleMain: 'Saling Mendukung, Memperjuangkan Hak &',
      titleHighlight: 'Menebar Kebaikan',
      description: 'SRIKANDI BALI adalah wadah sosial dan pemberdayaan bagi wanita Indonesia yang menikah dengan warga negara asing (WNA). Kami hadir memberikan dukungan, bantuan legal, serta menggalang aksi sosial kemanusiaan untuk masyarakat yang membutuhkan.',
      btnEvents: 'Lihat Event Mendatang',
      btnAbout: 'Profil & Anggota',
      btnAi: 'AI Info Perkawinan Campur',
      statGlobal: 'Anggota Global',
      statActive: 'Aktif Jkt & Bali',
      statEvents: 'Acara & Workshop',
      statNonProfit: 'Nirlaba / Non-profit',
      nextEventBadge: 'ACARA TERDEKAT',
      registeredCount: 'Peserta',
      btnRegisterDetail: 'Daftar & Detail Event Ini',
      noEventTitle: 'Tidak Ada Event Terdekat',
      noEventDesc: 'Pantau terus pembaharuan jadwal acara Srikandi Bali.'
    },
    about: {
      badge: 'SIAPA KAMI',
      title: 'Komunitas & Support System Perkawinan Campur Indonesia',
      paragraph1: 'Didirikan oleh para wanita Indonesia yang menjalani kehidupan perkawinan campur, Srikandi Bali berkomitmen menjadi ruang aman untuk saling berbagi pengalamanan, konsultasi hukum, dan membangun persaudaraan yang erat di Bali, Jakarta, dan mancanegara.',
      paragraph2: 'Kami juga aktif dalam kegiatan kepedulian sosial, bakti sosial, penggalangan dana kemanusiaan, serta edukasi hukum seputar hak kewarganegaraan, perjanjian perkawinan (prenup/postnup), dan perlindungan hak anak.',
      professionsTitle: 'Profesi & Latar Belakang Anggota'
    },
    visionMission: {
      badge: 'VISI & MISI',
      title: 'Komitmen & Arah Perjuangan Organisasi',
      subtitle: 'Membangun ketahanan keluarga perkawinan campur yang sejahtera, sadar hukum, dan berkontribusi nyata bagi masyarakat.',
      visionTitle: 'VISI KAMI',
      visionDesc: 'Menjadi wadah terdepan dan terpercaya bagi wanita Indonesia bersuamikan WNA dalam memperjuangkan hak hukum, menguatkan solidaritas sosial, dan menebar kebaikan di Indonesia maupun kancah internasional.',
      missionTitle: 'MISI KAMI',
      mission1: 'Advokasi & Edukasi Hukum',
      mission1Desc: 'Edukasi berkala tentang UU Perkawinan, Prenup/Postnup, Hak Milik Properti, dan Kitas/Kitap Penjamin Suami WNA.',
      mission2: 'Pemberdayaan & Support System',
      mission2Desc: 'Membangun ruang aman saling berbagi kisah, bimbingan mental, serta pemberdayaan ekonomi perempuan.',
      mission3: 'Aksi Sosial & Kemanusiaan',
      mission3Desc: 'Menggalang bantuan bencana, donasi panti asuhan, dan bakti sosial masyarakat kurang mampu.'
    },
    upcomingEvents: {
      badge: 'EVENT MENDATANG',
      title: 'Jadwal Kegiatan & Workshop Srikandi',
      subtitle: 'Mari bergabung dalam acara silaturahmi, edukasi hukum, dan aksi sosial bersama anggota Srikandi Bali.',
      all: 'Semua Event',
      workshop: 'Workshop Legal',
      charity: 'Charity & Amal',
      social: 'Gathering Sosial',
      culture: 'Seni & Budaya',
      edukasi: 'Edukasi',
      btnRsvp: 'Daftar RSVP Acara',
      fullCapacity: 'Kuota Penuh',
      speakerLabel: 'Narasumber / Pengelenggara:',
      highlightsLabel: 'Highlight Acara:'
    },
    gallery: {
      badge: 'DOKUMENTASI & GALERI',
      title: 'Rekam Jejak Acara & Bakti Sosial',
      subtitle: 'Dokumentasi kebersamaan dan aksi nyata anggota Srikandi Bali dalam berbagai acara yang telah terselenggara.',
      photos: 'Foto',
      attendees: 'Hadir',
      charityImpact: 'Dampak Sosial / Amal:',
      viewPhotos: 'Lihat Foto Dokumentasi'
    },
    charity: {
      badge: 'AKSI AMAL & DONASI',
      title: 'Mengulurkan Tangan Bagi yang Membutuhkan',
      subtitle: 'Program penggalangan dana dan bantuan kemanusiaan yang dikelola secara transparan oleh Srikandi Bali.',
      target: 'Target Dana:',
      targetLabel: 'Penerima / Target',
      collected: 'Terkumpul:',
      raisedLabel: 'Dana Terkumpul',
      donors: 'Donatur',
      btnDonate: 'Salurkan Donasi',
      beneficiaries: 'Penerima Manfaat:'
    },
    aiAssistant: {
      badge: 'KONSULTASI AI SRIKANDI',
      title: 'Asisten Cerdas Hukum Perkawinan Campur',
      subtitle: 'Tanyakan seputar Perjanjian Perkawinan (Prenup/Postnup), Kewarganegaraan Anak, Hak Milik Properti, dan Penjamin Kitas/Kitap.',
      faqTitle: 'Pertanyaan Umum Hukum (FAQ)',
      placeholder: 'Ketik pertanyaan Anda di sini... (Contoh: Bagaimana aturan Postnup untuk WNI bersuami WNA di Bali?)',
      send: 'Kirim Pertanyaan',
      disclaimer: 'Catatan: Asisten AI Srikandi Bali memberikan informasi awal edukatif. Untuk penanganan dokumen resmi, disarankan berkonsultasi dengan Notaris / Pengacara resmi Srikandi.'
    },
    legalAi: {
      badge: 'KONSULTASI AI SRIKANDI',
      title: 'Asisten Cerdas Hukum Perkawinan Campur',
      subtitle: 'Tanyakan seputar Perjanjian Perkawinan (Prenup/Postnup), Kewarganegaraan Anak, Hak Milik Properti, dan Penjamin Kitas/Kitap.',
      faqTitle: 'Pertanyaan Umum Hukum (FAQ)',
      placeholder: 'Ketik pertanyaan Anda di sini... (Contoh: Bagaimana aturan Postnup untuk WNI bersuami WNA di Bali?)',
      send: 'Kirim Pertanyaan',
      disclaimer: 'Catatan: Asisten AI Srikandi Bali memberikan informasi awal edukatif. Untuk penanganan dokumen resmi, disarankan berkonsultasi dengan Notaris / Pengacara resmi Srikandi.'
    },
    footer: {
      aboutText: 'Srikandi Bali adalah organisasi sosial nirlaba pemberdayaan wanita Indonesia yang menikah dengan warga negara asing (WNA). Berdiri di Bali & Jakarta untuk advokasi hukum, solidaritas, dan aksi amal.',
      navTitle: 'Navigasi Pintar',
      contactTitle: 'Sekretariat & Kontak',
      tagline: 'Wadah Sosial & Pemberdayaan Perkawinan Campur Indonesia',
      secretariatTitle: 'Sekretariat & Kontak',
      addressBali: 'Bali: Jl. Sunset Road No. 88, Seminyak, Kuta, Badung, Bali',
      addressJkt: 'Jakarta: Jl. HR Rasuna Said, Kuningan, Jakarta Selatan',
      phone: 'WA Hotline: +62 812-3456-7890',
      email: 'Email: info@srikandimixmarriagebali.org',
      copyright: 'Hak Cipta Dilindungi. Organisasi Nirlaba Srikandi Mix Marriage Bali.',
      adminLink: 'Portal Admin (/admin)'
    },
    rsvpModal: {
      title: 'Form Pendaftaran RSVP Acara',
      subtitle: 'Isi data diri Anda untuk mengonfirmasi kehadiran pada acara ini.',
      fullName: 'Nama Lengkap:',
      email: 'Alamat Email:',
      phone: 'Nomor WhatsApp / HP:',
      domicile: 'Domisili (Kota/Kabupaten):',
      notes: 'Catatan Khusus (Opsional):',
      btnSubmit: 'Konfirmasi Pendaftaran RSVP',
      btnCancel: 'Batal',
      successTitle: 'Pendaftaran Berhasil!',
      successMsg: 'Terima kasih telah mendaftar. Tim Srikandi Bali akan menghubungi Anda via WhatsApp untuk konfirmasi detail acara.'
    }
  },
  en: {
    nav: {
      topBanner: 'Indonesian Mixed Marriage Community & Support System — Jakarta & Bali',
      topBannerTag: '400+ Global Members',
      home: 'Home',
      about: 'About Us',
      vision: 'Vision & Mission',
      events: 'Next Event',
      gallery: 'Event Gallery',
      charity: 'Charity',
      aiConsultation: 'Legal AI Assistant',
      registerEvent: 'Register Event',
      adminPortal: 'Admin Portal'
    },
    hero: {
      badge: 'Official Indonesian Mixed Marriage Community • Jakarta & Bali',
      titleMain: 'Supporting Each Other, Advocating Rights &',
      titleHighlight: 'Spreading Goodness',
      description: 'SRIKANDI BALI is a social & empowerment platform for Indonesian women married to foreign nationals. We provide support, legal guidance, and humanitarian charity initiatives for those in need.',
      btnEvents: 'View Upcoming Events',
      btnAbout: 'Profile & Members',
      btnAi: 'Mixed Marriage AI Assistant',
      statGlobal: 'Global Members',
      statActive: 'Active Jkt & Bali',
      statEvents: 'Events & Workshops',
      statNonProfit: 'Non-Profit Org',
      nextEventBadge: 'UPCOMING EVENT',
      registeredCount: 'Participants',
      btnRegisterDetail: 'Register & View Event Details',
      noEventTitle: 'No Upcoming Event',
      noEventDesc: 'Stay tuned for upcoming Srikandi Bali schedule updates.'
    },
    about: {
      badge: 'ABOUT US',
      title: 'Community & Support System for Indonesian Mixed Marriages',
      paragraph1: 'Founded by Indonesian women in mixed marriages, Srikandi Bali is committed to being a safe space for sharing experiences, legal guidance, and building strong sisterhood in Bali, Jakarta, and abroad.',
      paragraph2: 'We are also active in social care, charity actions, humanitarian fundraising, and legal education on citizenship rights, marriage contracts (prenup/postnup), and child protection.',
      professionsTitle: 'Professions & Member Backgrounds'
    },
    visionMission: {
      badge: 'VISION & MISSION',
      title: 'Our Commitment & Strategic Direction',
      subtitle: 'Building prosperous, legally conscious mixed marriage families that make real contributions to society.',
      visionTitle: 'OUR VISION',
      visionDesc: 'To be the leading and trusted platform for Indonesian women married to foreign nationals in advocating legal rights, strengthening social solidarity, and spreading goodness locally and internationally.',
      missionTitle: 'OUR MISSION',
      mission1: 'Legal Advocacy & Education',
      mission1Desc: 'Regular education on Marriage Law, Prenup/Postnup, Property Ownership Rights, and Kitas/Kitap sponsorship for foreign spouses.',
      mission2: 'Empowerment & Support System',
      mission2Desc: 'Creating a safe space for sharing stories, mental guidance, and women\'s economic empowerment.',
      mission3: 'Social & Humanitarian Action',
      mission3Desc: 'Organizing disaster relief, orphanage donations, and social welfare for underprivileged communities.'
    },
    upcomingEvents: {
      badge: 'UPCOMING EVENTS',
      title: 'Srikandi Schedule & Workshops',
      subtitle: 'Join us for gathering events, legal workshops, and social initiatives with Srikandi Bali members.',
      all: 'All Events',
      workshop: 'Legal Workshops',
      charity: 'Charity & Welfare',
      social: 'Social Gathering',
      culture: 'Art & Culture',
      edukasi: 'Education',
      btnRsvp: 'RSVP Event',
      fullCapacity: 'Full Capacity',
      speakerLabel: 'Speaker / Organizer:',
      highlightsLabel: 'Event Highlights:'
    },
    gallery: {
      badge: 'DOCUMENTATION & GALLERY',
      title: 'Event Track Record & Social Actions',
      subtitle: 'Documentation of togetherness and real actions of Srikandi Bali members in past events.',
      photos: 'Photos',
      attendees: 'Attendees',
      charityImpact: 'Social / Charity Impact:',
      viewPhotos: 'View Gallery Photos'
    },
    charity: {
      badge: 'CHARITY & DONATIONS',
      title: 'Lending a Helping Hand to Those in Need',
      subtitle: 'Transparently managed fundraising programs and humanitarian aid by Srikandi Bali.',
      target: 'Target Amount:',
      targetLabel: 'Beneficiary / Target',
      collected: 'Collected:',
      raisedLabel: 'Funds Raised',
      donors: 'Donors',
      btnDonate: 'Make a Donation',
      beneficiaries: 'Beneficiaries:'
    },
    aiAssistant: {
      badge: 'SRIKANDI LEGAL AI CONSULTANT',
      title: 'Smart Mixed Marriage Legal Assistant',
      subtitle: 'Ask about Marriage Agreements (Prenup/Postnup), Child Citizenship, Property Rights, and Spouse Kitas/Kitap Sponsorship.',
      faqTitle: 'Frequently Asked Legal Questions (FAQ)',
      placeholder: 'Type your question here... (Example: What are the Postnup regulations for Indonesian citizens with foreign spouses in Bali?)',
      send: 'Send Question',
      disclaimer: 'Note: Srikandi Bali AI Assistant provides educational guidance. For official document drafting, please consult with official Srikandi Notaries / Lawyers.'
    },
    legalAi: {
      badge: 'SRIKANDI LEGAL AI CONSULTANT',
      title: 'Smart Mixed Marriage Legal Assistant',
      subtitle: 'Ask about Marriage Agreements (Prenup/Postnup), Child Citizenship, Property Rights, and Spouse Kitas/Kitap Sponsorship.',
      faqTitle: 'Frequently Asked Legal Questions (FAQ)',
      placeholder: 'Type your question here... (Example: What are the Postnup regulations for Indonesian citizens with foreign spouses in Bali?)',
      send: 'Send Question',
      disclaimer: 'Note: Srikandi Bali AI Assistant provides educational guidance. For official document drafting, please consult with official Srikandi Notaries / Lawyers.'
    },
    footer: {
      aboutText: 'Srikandi Bali is a non-profit empowerment organization for Indonesian women married to foreign nationals. Established in Bali & Jakarta for legal advocacy, solidarity, and charity actions.',
      navTitle: 'Smart Navigation',
      contactTitle: 'Secretariat & Contacts',
      tagline: 'Social & Empowerment Hub for Indonesian Mixed Marriages',
      secretariatTitle: 'Secretariat & Contacts',
      addressBali: 'Bali: Jl. Sunset Road No. 88, Seminyak, Kuta, Badung, Bali',
      addressJkt: 'Jakarta: Jl. HR Rasuna Said, Kuningan, Jakarta South',
      phone: 'WA Hotline: +62 812-3456-7890',
      email: 'Email: info@srikandimixmarriagebali.org',
      copyright: 'All Rights Reserved. Srikandi Mix Marriage Bali Non-Profit Organization.',
      adminLink: 'Admin Portal (/admin)'
    },
    rsvpModal: {
      title: 'Event RSVP Registration Form',
      subtitle: 'Fill in your details to confirm your attendance at this event.',
      fullName: 'Full Name:',
      email: 'Email Address:',
      phone: 'WhatsApp / Phone Number:',
      domicile: 'Domicile (City/District):',
      notes: 'Special Notes (Optional):',
      btnSubmit: 'Confirm RSVP Registration',
      btnCancel: 'Cancel',
      successTitle: 'Registration Successful!',
      successMsg: 'Thank you for registering. The Srikandi Bali team will contact you via WhatsApp for event details confirmation.'
    }
  }
};
