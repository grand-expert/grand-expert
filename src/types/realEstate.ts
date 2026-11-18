export interface Property {
  id: string;
  title: string;
  titleSo: string;
  slug: string;
  price: number; // USD base
  purpose: 'sale' | 'rent' | 'off-plan';
  propertyType: 'villa' | 'apartment' | 'penthouse' | 'commercial' | 'land';
  location: {
    city: string;
    neighborhood: string;
    country: string;
    lat: number;
    lng: number;
    address: string;
  };
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  featured: boolean;
  isNew: boolean;
  yearBuilt: number;
  parkingSpots: number;
  images: string[];
  description: string;
  descriptionSo: string;
  amenities: string[];
  amenitiesSo: string[];
  agent: {
    name: string;
    role: string;
    roleSo: string;
    phone: string;
    email: string;
    whatsapp: string;
    avatar: string;
  };
  createdAt: string;
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  tourType: 'in-person' | 'virtual-video';
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  budget?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export type Language = 'so' | 'en';
export type Currency = 'USD' | 'SOS' | 'EUR' | 'AED';

export interface FilterState {
  search: string;
  purpose: 'all' | 'sale' | 'rent' | 'off-plan';
  propertyType: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'area';
}
