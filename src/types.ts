export type EventCategory = 'Charity/Amal' | 'Workshop/Legal' | 'Social/Gathering' | 'Culture/Seni' | 'Edukasi';

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  address: string;
  mapUrl?: string;
  status: 'upcoming' | 'finished';
  description: string;
  summary: string;
  image: string;
  targetFund?: number;
  currentFund?: number;
  registeredCount: number;
  maxCapacity: number;
  speakerOrOrganizer: string;
  highlights: string[];
  contactPhone: string;
  galleryPhotos?: GalleryPhoto[];
  charityImpact?: string;
  isPinned?: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category?: string;
}

export interface GalleryAlbum {
  id: string;
  eventId?: string;
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  coverImage: string;
  photos: GalleryPhoto[];
  attendeesCount: number;
  charityImpact?: string;
  summary: string;
}

export interface CharityCampaign {
  id: string;
  title: string;
  category: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  status: 'active' | 'completed';
  beneficiaries: string;
  imageUrl: string;
  location: string;
}

export interface MemberProfession {
  title: string;
  percentage: number;
  iconName: string;
  countApprox: string;
}

export interface LegalFaq {
  id: string;
  question: string;
  answer: string;
  category: 'Perjanjian Perkawinan' | 'Kewarganegaraan Anak' | 'Hak Milik & Properti' | 'Imigrasi & Kitas';
}
