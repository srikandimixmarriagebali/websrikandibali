import { Event, GalleryAlbum, CharityCampaign, LegalFaq, MemberProfession } from '../types';

export const initialEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'Gathering & Workshop Hukum: Pembaruan Aturan Hak Milik & Postnuptial Agreement 2026',
    category: 'Workshop/Legal',
    date: '2026-08-28',
    time: '10:00 - 15:00 WITA',
    location: 'Seminyak Beach Resort & Spa, Bali',
    address: 'Jl. Kayu Aya No. 9, Seminyak, Kuta, Kabupaten Badung, Bali',
    mapUrl: 'https://maps.google.com/?q=Seminyak+Beach+Resort',
    status: 'upcoming',
    description: 'Seminar mendalam bersama pakar hukum pertanahan dan notaris spesialis perkawinan campur. Membahas pembuatan Perjanjian Perkawinan (Postnup/Prenup), perlindungan Hak Milik properti bagi WNI yang menikah dengan WNA, serta kepastian hukum keluarga.',
    summary: 'Diskusi hukum terkini dan konsultasi gratis pembuatan Postnup & pendaftaran tanah.',
    image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80',
    targetFund: 15000000,
    currentFund: 11200000,
    registeredCount: 42,
    maxCapacity: 60,
    speakerOrOrganizer: 'Dr. Anita Sastro, S.H., M.Kn. & Tim Advokasi Srikandi Bali',
    highlights: [
      'Konsultasi privat 1-on-1 dengan Notaris Mitra Srikandi',
      'Materi lengkap Postnup & Kepemilikan Rumah/Lahan',
      'Makan siang Buffet & Networking antar anggota',
      'Goodie bag Srikandi & e-Sertifikat'
    ],
    contactPhone: '+62 812-3456-7890',
    isPinned: true
  },
  {
    id: 'evt-002',
    title: 'Aksi Sosial Srikandi Peduli: Bantuan Beasiswa & Alat Tulis Anak Pesisir Karangasem',
    category: 'Charity/Amal',
    date: '2026-09-12',
    time: '08:30 - 14:00 WITA',
    location: 'Desa Seraya, Karangasem, Bali',
    address: 'Desa Seraya Timur, Kec. Karangasem, Kabupaten Karangasem, Bali',
    mapUrl: 'https://maps.google.com/?q=Karangasem+Bali',
    status: 'upcoming',
    description: 'Kegiatan bakti sosial dan penyaluran paket beasiswa pendidikan, perlengkapan sekolah, serta pemeriksaan kesehatan gratis untuk 120 anak-anak di pesisir Karangasem Bali.',
    summary: 'Penyerahan beasiswa sekolah & pemeriksaan kesehatan gratis di Karangasem.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    targetFund: 35000000,
    currentFund: 28500000,
    registeredCount: 25,
    maxCapacity: 40,
    speakerOrOrganizer: 'Divisi Sosial & Pengabdian Masyarakat Srikandi Bali',
    highlights: [
      'Penyaluran 120 paket perlengkapan sekolah & laptop edukasi',
      'Pemeriksaan gigi dan kesehatan dasar anak',
      'Sesi dongeng interaktif dan kelas menggambar',
      'Santap siang bersama warga desa'
    ],
    contactPhone: '+62 813-9876-5432',
    isPinned: true
  },
  {
    id: 'evt-003',
    title: 'Srikandi Culture & Bazaar Micro-Business: Empowerment Untuk Srikandi Entrepreneur',
    category: 'Culture/Seni',
    date: '2026-10-05',
    time: '11:00 - 18:00 WITA',
    location: 'Canggu Community Hall, Badung, Bali',
    address: 'Jl. Pantai Batu Bolong No. 45, Canggu, Bali',
    status: 'upcoming',
    description: 'Bazar UMKM dan pameran karya bisnis anggota Srikandi Bali. Menampilkan kerajinan tangan lokal, perhiasan etnik, kuliner nusantara, serta workshop pemasaran digital untuk bisnis keluarga.',
    summary: 'Bazar bisnis anggota Srikandi & pameran kerajinan seni nusantara.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
    registeredCount: 18,
    maxCapacity: 50,
    speakerOrOrganizer: 'Srikandi Bali Business Club',
    highlights: [
      '30+ Stand UMKM anggota Srikandi',
      'Fashion show kain tradisional Wastra Nusantara',
      'Sesi digital marketing & branding bisnis lokal',
      'Lelang amal produk seni untuk dana sosial'
    ],
    contactPhone: '+62 811-2233-4455'
  },
  {
    id: 'evt-004',
    title: 'Bakti Sosial Srikandi Ramadhan & Paskah: Sembako Peduli Lansia Bali & Jakarta',
    category: 'Charity/Amal',
    date: '2026-04-12',
    time: '09:00 - 13:00 WITA',
    location: 'Panti Werdha & Posko Sosial Srikandi, Denpasar',
    address: 'Jl. Raya Puputan No. 12, Renon, Denpasar, Bali',
    status: 'finished',
    description: 'Penyaluran 250 paket sembako dan kebutuhan pokok untuk lansia prasejahtera di Denpasar dan Jakarta. Didukung oleh donasi penuh dari anggota Srikandi dari seluruh dunia.',
    summary: 'Pembagian 250 paket sembako untuk lansia kurang mampu.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    targetFund: 40000000,
    currentFund: 42500000,
    registeredCount: 45,
    maxCapacity: 45,
    speakerOrOrganizer: 'Ketua Umum & Panitia Amal Srikandi',
    highlights: [
      '250 Paket Sembako lengkap disalurkan langsung',
      'Dukungan pemeriksaan tensi & gula darah gratis',
      'Partisipasi donatur dari 12 negara'
    ],
    contactPhone: '+62 812-3456-7890',
    charityImpact: 'Tersalurkan 250 paket sembako senilai total Rp 42.500.000 untuk lansia kurang mampu.',
    galleryPhotos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
        caption: 'Penyerahan simbolis sembako kepada perwakilan lansia di Denpasar.'
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
        caption: 'Para pengurus Srikandi Bali bahu membahu mengemas bantuan paket bahan pokok.'
      },
      {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=800&q=80',
        caption: 'Senyum kebahagiaan para lansia saat menerima bantuan kesehatan dan paket sembako.'
      }
    ]
  },
  {
    id: 'evt-005',
    title: 'Sosialisasi UU Kewarganegaraan Anak & Pendaftaran Affidavit Anak Perkawinan Campur',
    category: 'Workshop/Legal',
    date: '2026-02-18',
    time: '13:00 - 17:00 WITA',
    location: 'Grand Sanur Ballroom, Sanur, Bali',
    address: 'Jl. Danau Tamblingan No. 88, Sanur, Bali',
    status: 'finished',
    description: 'Diskusi panel mengenai kepastian kewarganegaraan ganda terbatas bagi anak hasil perkawinan campur, tata cara pendaftaran Affidavit, dan solusi paspor anak dewasa.',
    summary: 'Sosialisasi hak anak kewarganegaraan ganda terbatas & prosedur pendaftaran Affidavit.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    registeredCount: 80,
    maxCapacity: 80,
    speakerOrOrganizer: 'Divisi Hukum Srikandi Bali & Perwakilan Dirjen Imigrasi',
    highlights: [
      'Tanya jawab langsung perihal status anak kewarganegaraan ganda',
      'Panduan pembuatan Affidavit dan perpanjangan dokumen',
      'Dihadiri 80 pasangan keluarga perkawinan campur'
    ],
    contactPhone: '+62 812-3456-7890',
    charityImpact: 'Memfasilitasi kepengurusan dokumen hukum bagi 35 keluarga anggota Srikandi.',
    galleryPhotos: [
      {
        id: 'p4',
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
        caption: 'Sesi narasumber memaparkan regulasi kewarganegaraan anak di Indonesia.'
      },
      {
        id: 'p5',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
        caption: 'Suasana antusias para anggota Srikandi dalam sesi konsultasi berkas.'
      }
    ]
  }
];

export const initialAlbums: GalleryAlbum[] = [
  {
    id: 'alb-001',
    title: 'Bakti Sosial & Pembagian Sembako Ramadhan-Paskah 2026',
    category: 'Charity/Amal',
    date: '12 April 2026',
    location: 'Denpasar & Jakarta',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
    attendeesCount: 45,
    charityImpact: 'Bantuan tersalurkan senilai Rp 42.500.000 untuk 250 penerima lansia.',
    summary: 'Dokumentasi penuh aksi kepedulian Srikandi Bali menyalurkan makanan dan sembako.',
    photos: [
      {
        id: 'ph-1',
        url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
        caption: 'Foto bersama panitia Srikandi Bali sebelum pelepasan armada logistik bantuan sembako.'
      },
      {
        id: 'ph-2',
        url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80',
        caption: 'Gotong royong pengurus mengemas bahan makanan segar dan obat-obatan dasar.'
      },
      {
        id: 'ph-3',
        url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=1000&q=80',
        caption: 'Kegembiraan saat menyerahkan bantuan langsung ke rumah-rumah warga penerima.'
      },
      {
        id: 'ph-4',
        url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80',
        caption: 'Tim medis relawan Srikandi memeriksa kesehatan dan tekanan darah lansia.'
      }
    ]
  },
  {
    id: 'alb-002',
    title: 'Seminar Kewarganegaraan Anak & Pendaftaran Affidavit 2026',
    category: 'Workshop/Legal',
    date: '18 Februari 2026',
    location: 'Grand Sanur Ballroom, Sanur',
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    attendeesCount: 80,
    charityImpact: 'Pendampingan konsultasi hukum gratis untuk 35 keluarga perkawinan campur.',
    summary: 'Diskusi hangat bersama pakar imigrasi dan perwakilan hukum mengenai paspor & anak ganda.',
    photos: [
      {
        id: 'ph-5',
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
        caption: 'Pemaparan materi hukum oleh advokat mitra Srikandi di hadapan 80 peserta.'
      },
      {
        id: 'ph-6',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
        caption: 'Sesi tanya jawab interaktif perihal paspor dan status kewarganegaraan anak.'
      },
      {
        id: 'ph-7',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
        caption: 'Ramah tamah dan networking antar anggota Srikandi pasca seminar.'
      }
    ]
  },
  {
    id: 'alb-003',
    title: 'Gala Dinner & Annual Membership Gathering Srikandi Bali',
    category: 'Social/Gathering',
    date: '05 Desember 2025',
    location: 'Uluwatu Cliff Club, Bali',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    attendeesCount: 110,
    charityImpact: 'Penggalangan dana amal terkumpul Rp 65.000.000 dalam lelang busana tradisional.',
    summary: 'Malam kebersamaan tahunan mempererat silaturahmi seluruh anggota Srikandi dari Bali, Jakarta, dan luar negeri.',
    photos: [
      {
        id: 'ph-8',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
        caption: 'Suasana Gala Dinner berbalut nuansa Kebaya Merah Muda khas Srikandi Bali.'
      },
      {
        id: 'ph-9',
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
        caption: 'Lelang kain batik antik koleksi Srikandi untuk penggalangan dana sosial.'
      }
    ]
  }
];

export const initialCampaigns: CharityCampaign[] = [
  {
    id: 'camp-1',
    title: 'Program Beasiswa Anak Perkawinan Campur Prasejahtera',
    category: 'Edukasi & Masa Depan',
    description: 'Dukungan dana SPP sekolah, buku pelajaran, serta laptop untuk anak-anak keluarga perkawinan campur kurang mampu di wilayah Bali & Jakarta.',
    targetAmount: 50000000,
    currentAmount: 38200000,
    donorCount: 64,
    status: 'active',
    beneficiaries: '30 Anak Usia Sekolah Dasar & Menengah',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    location: 'Bali & Jakarta'
  },
  {
    id: 'camp-2',
    title: 'Dana Darurat Advokasi Hukum Perkawinan & Perlindungan Ibu-Anak',
    category: 'Pendampingan Legal',
    description: 'Fasilitas bantuan biaya pengacara, notaris, serta penampungan darurat bagi ibu dan anak dalam konflik rumah tangga atau penolakan keadilan.',
    targetAmount: 75000000,
    currentAmount: 62000000,
    donorCount: 89,
    status: 'active',
    beneficiaries: 'Wanita Indonesia korban kejahatan/ketidakadilan hukum',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    location: 'Nasional & Internasional'
  }
];

export const memberProfessions: MemberProfession[] = [
  { title: 'Pemilik Bisnis & Entrepreneur', percentage: 28, iconName: 'Briefcase', countApprox: '~112 orang' },
  { title: 'Ibu Rumah Tangga & Penggerak Sosial', percentage: 25, iconName: 'HeartHandshake', countApprox: '~100 orang' },
  { title: 'Pimpinan Perusahaan & Eksekutif', percentage: 20, iconName: 'Building2', countApprox: '~80 orang' },
  { title: 'Profesional & Konsultan', percentage: 15, iconName: 'GraduationCap', countApprox: '~60 orang' },
  { title: 'Karyawan Swasta & Industri Kreatif', percentage: 8, iconName: 'Laptop', countApprox: '~32 orang' },
  { title: 'Pegawai Negeri / ASN & Edukator', percentage: 4, iconName: 'Award', countApprox: '~16 orang' }
];

export const legalFaqs: LegalFaq[] = [
  {
    id: 'faq-1',
    category: 'Perjanjian Perkawinan',
    question: 'Bisakah wanita Indonesia yang sudah menikah dengan WNA membuat Perjanjian Perkawinan (Postnuptial Agreement) setelah menikah?',
    answer: 'Ya, sesuai dengan Putusan Mahkamah Konstitusi No. 69/PUU-XIII/2015, Pasangan Perkawinan Campur dapat membuat Perjanjian Perkawinan selama masa perkawinan berlangsung (Postnup) yang disahkan oleh Notaris dan dicatatkan di Disdukcapil/KUA.'
  },
  {
    id: 'faq-2',
    category: 'Hak Milik & Properti',
    question: 'Apakah WNI yang menikah dengan WNA bisa memiliki sertifikat Hak Milik atas tanah di Indonesia?',
    answer: 'WNI yang menikah dengan WNA tetap berhak penuh atas Hak Milik (Freehold) tanah/bangunan di Indonesia SELAMA memiliki Perjanjian Perkawinan (Prenup/Postnup) pisah harta. Jika tidak ada perjanjian pisah harta, harta tersebut dianggap harta bersama sehingga WNI wajib melepaskan hak miliknya dalam 1 tahun.'
  },
  {
    id: 'faq-3',
    category: 'Kewarganegaraan Anak',
    question: 'Bagaimana status kewarganegaraan anak dari hasil perkawinan campur menurut hukum Indonesia?',
    answer: 'Menurut UU No. 12 Tahun 2006, anak dari perkawinan campur memperoleh Kewarganegaraan Ganda Terbatas hingga usia 18 tahun (atau sudah menikah). Anak diberi kesempatan hingga usia 21 tahun untuk memilih salah satu kewarganegaraan.'
  },
  {
    id: 'faq-4',
    category: 'Imigrasi & Kitas',
    question: 'Dapatkah istri WNI menjadi penjamin (sponsor) KITAS/KITAP untuk suami warga negara asing?',
    answer: 'Ya, Istri WNI dapat menjadi penjamin (sponsor) resmi KITAS (Kartu Izin Tinggal Terbatas) dan KITAP (Kartu Izin Tinggal Tetap) penyatuan keluarga untuk suaminya WNA sesuai regulasi Direktorat Jenderal Imigrasi.'
  }
];
