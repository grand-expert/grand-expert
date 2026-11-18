import { Property, TourBooking, InquiryMessage, Currency } from '../types/realEstate';

const PROPERTIES_KEY = 'grand_export_properties_v1';
const BOOKINGS_KEY = 'grand_export_bookings_v1';
const INQUIRIES_KEY = 'grand_export_inquiries_v1';
const FAVORITES_KEY = 'grand_export_favorites_v1';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'ger-001',
    title: 'The Pearl Coastal Villa & Infinity Residence',
    titleSo: 'Filada Raaxada ee Xeebta Liido & Dabaqa Badda',
    slug: 'pearl-coastal-villa-liido',
    price: 495000,
    purpose: 'sale',
    propertyType: 'villa',
    location: {
      city: 'Mogadishu',
      neighborhood: 'Liido Beachfront',
      country: 'Somalia',
      lat: 2.0392,
      lng: 45.3621,
      address: 'Plot 14, Liido Coastal Boulevard, Abdiaziz District',
    },
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 580,
    featured: true,
    isNew: true,
    yearBuilt: 2025,
    parkingSpots: 3,
    images: [
      '/src/assets/images/hero_grand_export_estate_1794132036523.jpg',
      '/src/assets/images/property_modern_villa_1794132038393.jpg',
      '/src/assets/images/property_seaside_penthouse_1794132038189.jpg',
    ],
    description: 'An architectural masterpiece overlooking the Indian Ocean. Features travertine stone facades, private infinity edge pool, floor-to-ceiling storm-resistant glazing, smart home automation, high-capacity solar array with silent backup generator, and direct beach access.',
    descriptionSo: 'Filo casri ah oo ku taalla jiifka tooska ah ee Xeebta Liido. Waxay leedahay barkad dabaal oo heer sare ah, dhagaxa travertine-ka ah, muraayado adag oo qoraxda iyo dabaysha celinaya, nidaamka korontada cadceedda iyo matoor aamusan oo 24 saac ah, iyo shahaado lahaansho oo buuxda.',
    amenities: ['Oceanfront View', 'Private Infinity Pool', '24/7 Security & CCTV', 'Solar & Generator Backup', 'Smart Home System', 'Imported Italian Marble', 'Maid & Guard Quarters', 'Landscaped Courtyard'],
    amenitiesSo: ['Muuqaalka Badda Liido', 'Barkad Gaar ah (Pool)', 'Ilaalo & Kaamirooyin 24/7', 'Koronto Cadceed & Matoor', 'Tiknoolajiyada Smart Home', 'Marmarka Talyaaniga', 'Qolalka Ilaalada & Shaqaalaha', 'Beerta Barxadda'],
    agent: {
      name: 'Eng. Cabdirisaaq Nuur Xasan',
      role: 'Senior Luxury Real Estate Director',
      roleSo: 'Agaasimaha Guryaha Raaxada',
      phone: '+252 61 555 8920',
      email: 'abdirisaq@grandexport.so',
      whatsapp: '252615558920',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'ger-002',
    title: 'Skyline Azure Commercial & Executive Plaza',
    titleSo: 'Daarta Dheer ee Ganacsiga & Xafiisyada Azure',
    slug: 'skyline-azure-commercial-plaza',
    price: 1850000,
    purpose: 'sale',
    propertyType: 'commercial',
    location: {
      city: 'Mogadishu',
      neighborhood: 'Airport Green Zone / KM4',
      country: 'Somalia',
      lat: 2.0321,
      lng: 45.3129,
      address: 'Airport Road, KM4 Diplomatic Corridor, Hodan',
    },
    bedrooms: 0,
    bathrooms: 14,
    areaSqm: 2400,
    featured: true,
    isNew: false,
    yearBuilt: 2024,
    parkingSpots: 24,
    images: [
      '/src/assets/images/property_commercial_tower_1794132038854.jpg',
      '/src/assets/images/property_seaside_penthouse_1794132038189.jpg',
    ],
    description: 'Premier 8-story commercial tower situated directly within the high-security diplomatic and corporate corridor. Equipped with high-speed glass elevators, fiber-optic backbone, basement parking for 24 vehicles, and verified high rental yield of 14% per annum.',
    descriptionSo: 'Dabaq ganacsi oo 8 dabaq ah oo ku yaalla wadada garoonka iyo KM4. Waxaa loogu talagalay xafiisyo caalami ah, bangiyo, hay\'ado, iyo shirkado. Waxaa ku jira wiishash dheereeya, qolalka shirarada, baarkin 24 gaari qaada, iyo faa\'iido kireed oo joogto ah.',
    amenities: ['Diplomatic Zone Security', 'High-Speed Elevators', 'Dual Commercial Generators', 'Underground Parking', 'Central VRF Air Conditioning', 'Fire Suppression System', 'Fiber Optic Ready', 'Rooftop Helipad Space'],
    amenitiesSo: ['Aagga Ilaalada Diblomaasiyadda', 'Wiishashka Dheereeya', 'Laba Matoor oo Ganacsi', 'Baarkin Hoose', 'Qaboojiyeyaasha VRF', 'Nidaamka Dab-demiska', 'Khadka Internetka Xawaaraha Sare', 'Xarunta Saqafka'],
    agent: {
      name: 'Safiyo Maxamuud Jaamac',
      role: 'Commercial Investments Lead',
      roleSo: 'Khabiirka Maalgashiga Ganacsiga',
      phone: '+252 61 777 4410',
      email: 'safiya@grandexport.so',
      whatsapp: '252617774410',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-01-20T11:30:00Z',
  },
  {
    id: 'ger-003',
    title: 'The Palm Horizon Modern Family Estate',
    titleSo: 'Qasriga Casriga ah ee Qoyska Palm Horizon',
    slug: 'palm-horizon-modern-estate',
    price: 360000,
    purpose: 'sale',
    propertyType: 'villa',
    location: {
      city: 'Hargeisa',
      neighborhood: 'Jigjiga Yar Heights',
      country: 'Somaliland',
      lat: 9.5624,
      lng: 44.0770,
      address: 'Main Hillcrest Road, Jigjiga Yar',
    },
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 420,
    featured: true,
    isNew: true,
    yearBuilt: 2025,
    parkingSpots: 2,
    images: [
      '/src/assets/images/property_modern_villa_1794132038393.jpg',
      '/src/assets/images/hero_grand_export_estate_1794132036523.jpg',
    ],
    description: 'Impeccable newly built villa overlooking the scenic Hargeisa skyline. Boasts modern open-concept living, European kitchen fittings, private walled garden, solar water heating, and a fully gated private perimeter.',
    descriptionSo: 'Guri dabaq casri ah oo qurux badan oo ku yaalla Jigjiga Yar, Hargeysa. Wuxuu leedahay muuqaal cajiib ah, jikada casriga ah ee Yurub, beero cagaaran, biyo kuleyliye cadceed ah, iyo deegaan aamusan oo qoyska ku habboon.',
    amenities: ['Panoramic Mountain & City Views', 'Perimeter Wall & Electric Fence', 'Solar Water Heating', 'Modern Modular Kitchen', 'Private Garden Lawn', 'Water Storage Cistern (50,000L)', 'Guest Suite'],
    amenitiesSo: ['Muuqaalka Magaalada & Buuraha', 'Dayr Adag & Siligga Korontada', 'Kuleyliyaha Biyaha Cadceedda', 'Jikad Casri ah', 'Beer Cagaaran', 'Barkad Biyaha Kaydisa (50,000L)', 'Qolka Martida'],
    agent: {
      name: 'Mustafe Cabdillahi Xirsi',
      role: 'Regional Managing Director - Hargeisa',
      roleSo: 'Maamulaha Gobolka Hargeysa',
      phone: '+252 63 444 1980',
      email: 'mustafe@grandexport.so',
      whatsapp: '252634441980',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-02-01T14:15:00Z',
  },
  {
    id: 'ger-004',
    title: 'Azure Bay Terrace Sky Penthouse',
    titleSo: 'Penthouse-ka Sare ee Azure Bay Terrace',
    slug: 'azure-bay-terrace-penthouse',
    price: 3200,
    purpose: 'rent',
    propertyType: 'penthouse',
    location: {
      city: 'Mogadishu',
      neighborhood: 'Jazeera Beachfront',
      country: 'Somalia',
      lat: 2.0118,
      lng: 45.2891,
      address: 'Tower A, Level 12, Jazeera Ocean Promenade',
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 285,
    featured: true,
    isNew: false,
    yearBuilt: 2025,
    parkingSpots: 2,
    images: [
      '/src/assets/images/property_seaside_penthouse_1794132038189.jpg',
      '/src/assets/images/hero_grand_export_estate_1794132036523.jpg',
    ],
    description: 'Luxury top-floor penthouse with expansive private outdoor terrace, teak loungers, and 270-degree turquoise ocean views. Fully furnished with high-end designer pieces, ready for immediate executive tenancy.',
    descriptionSo: 'Penthouse raaxo leh oo dabaqa 12-aad ku yaalla, leh barxad weyn oo bannaanka ah oo badda toos u eegaysa, alaabta guriga oo dhammaystiran, qaboojiyeyaal casri ah, iyo adeegyo huteel heer sare ah oo diyaar u ah kireysi toos ah.',
    amenities: ['Wraparound Ocean Terrace', 'Fully Furnished Interior', 'Private Keycard Elevator', 'Gym & Wellness Club Access', '24/7 Concierge', 'Backup Water & Power', 'Ultra-Fast Fiber Internet'],
    amenitiesSo: ['Barxad Weyn oo Badda Eegaysa', 'Guri Qalabaysan oo Dhan', 'Wiish Gaar ah oo Kaar ku Shaqeeya', 'Xarunta Jimicsiga & Caafimaadka', 'Adeegga Soo Dhaweynta 24/7', 'Biyo & Koronto Joogto ah', 'Internet Xawaare Sare'],
    agent: {
      name: 'Eng. Cabdirisaaq Nuur Xasan',
      role: 'Senior Luxury Real Estate Director',
      roleSo: 'Agaasimaha Guryaha Raaxada',
      phone: '+252 61 555 8920',
      email: 'abdirisaq@grandexport.so',
      whatsapp: '252615558920',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-02-10T16:00:00Z',
  },
  {
    id: 'ger-005',
    title: 'Dubai Marina Waterfront Diaspora Residence',
    titleSo: 'Dabaqa Raaxada ee Dubai Marina (Maalgashi Dibadeed)',
    slug: 'dubai-marina-waterfront-residence',
    price: 680000,
    purpose: 'sale',
    propertyType: 'apartment',
    location: {
      city: 'Dubai',
      neighborhood: 'Dubai Marina & JBR',
      country: 'UAE',
      lat: 25.0805,
      lng: 55.1403,
      address: 'Marina Gate Tower 2, Dubai Marina Promenade',
    },
    bedrooms: 2,
    bathrooms: 3,
    areaSqm: 165,
    featured: true,
    isNew: false,
    yearBuilt: 2024,
    parkingSpots: 1,
    images: [
      '/src/assets/images/property_commercial_tower_1794132038854.jpg',
      '/src/assets/images/property_seaside_penthouse_1794132038189.jpg',
    ],
    description: 'Turnkey luxury investment apartment in Dubai Marina. Features high rental yields of 8.5% net, eligible for UAE 10-Year Golden Visa, fully managed by Grand-Export international division.',
    descriptionSo: 'Fursad maalgashi oo ku taal Dubai Marina. Waxay leedahay faa\'iido kireed oo sarreysa (8.5% sanadkii), waxay kuu sahleysaa qaadashada Dal-ku-galka Dahabiga ah ee Imaaraatka (Golden Visa), waxaana si toos ah u maareynaya xafiiskeena Dubai.',
    amenities: ['Marina Yacht View', 'Infinity Pool & Spa', 'Valet Parking', 'UAE Golden Visa Eligible', 'Direct Marina Walk Access', 'Fully Managed Rental Pool', 'Tennis Court'],
    amenitiesSo: ['Muuqaalka Doonyaha Marina', 'Barkad & Spa Casri ah', 'Adeegga Baarkinka', 'U Qalmida UAE Golden Visa', 'Wadada Socodka Marina', 'Maamulka Kirada ee Xafiiskeena', 'Garoonka Tennis-ka'],
    agent: {
      name: 'Farxaan Axmed Warsame',
      role: 'International Diaspora Investment Advisor',
      roleSo: 'Khabiirka Maalgashiga Qurbajoogta Dubai',
      phone: '+971 50 892 4110',
      email: 'farhan@grandexport.so',
      whatsapp: '971508924110',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 'ger-006',
    title: 'Jazeera Prime Commercial Coastal Land Plot',
    titleSo: 'Dhulka Maalgashiga Xeebta Jazeera (2,000 m²)',
    slug: 'jazeera-prime-coastal-land',
    price: 180000,
    purpose: 'sale',
    propertyType: 'land',
    location: {
      city: 'Mogadishu',
      neighborhood: 'Jazeera South Coast',
      country: 'Somalia',
      lat: 1.9950,
      lng: 45.2410,
      address: 'Main Coastal Highway, Jazeera Beach Section 3',
    },
    bedrooms: 0,
    bathrooms: 0,
    areaSqm: 2000,
    featured: false,
    isNew: true,
    yearBuilt: 2026,
    parkingSpots: 0,
    images: [
      '/src/assets/images/hero_grand_export_estate_1794132036523.jpg',
      '/src/assets/images/property_modern_villa_1794132038393.jpg',
    ],
    description: 'Prime titled land plot measuring 2,000 square meters fronting the new coastal dual-carriageway. Zoned for luxury resort, boutique hotel, private compound, or gated villa community. Complete deed registration and boundary markers.',
    descriptionSo: 'Boos dhul ah oo cabirkiisu yahay 2,000 mitir laba jibaaran, oo toos ugu fadhiya wadada cusub ee laamiga ah ee Xeebta Jazeera. Waxaa loogu talagalay dalxiis, huteel, ama filooyin raaxo leh. Waxaa la socda shahaadada lahaanshaha ee Dowladda Hoose.',
    amenities: ['Highway Frontage', 'Direct Ocean Access', 'Clear Ministry Title Deed', 'Surveyed Boundaries', 'Water Borehole Feasibility', 'High Capital Appreciation'],
    amenitiesSo: ['Wadada Weyn ee Laamiga', 'Badda oo Toos ah', 'Shahaado Sharciyeysan', 'Xuduudaha oo La Cabbiray', 'Ceel Biyood Loo Qodi Karo', 'Qiimaha oo Si Degdeg ah u Kordhaya'],
    agent: {
      name: 'Eng. Cabdirisaaq Nuur Xasan',
      role: 'Senior Luxury Real Estate Director',
      roleSo: 'Agaasimaha Guryaha Raaxada',
      phone: '+252 61 555 8920',
      email: 'abdirisaq@grandexport.so',
      whatsapp: '252615558920',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 'ger-007',
    title: 'Kilimani Royal Suites & Executive Penthouse',
    titleSo: 'Daarta Casriga ah ee Kilimani Nairobi',
    slug: 'kilimani-royal-suites-nairobi',
    price: 240000,
    purpose: 'off-plan',
    propertyType: 'apartment',
    location: {
      city: 'Nairobi',
      neighborhood: 'Kilimani / Argwings Kodhek',
      country: 'Kenya',
      lat: -1.2921,
      lng: 36.7844,
      address: 'Argwings Kodhek Road, Kilimani District',
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 210,
    featured: true,
    isNew: true,
    yearBuilt: 2026,
    parkingSpots: 2,
    images: [
      '/src/assets/images/property_commercial_tower_1794132038854.jpg',
      '/src/assets/images/property_modern_villa_1794132038393.jpg',
    ],
    description: 'Off-plan development in the heart of Kilimani, popular among Somali diaspora and expatriates. Features heated rooftop pool, clubhouse, full power backup, borehole water, and 4-year installment plan with 20% deposit.',
    descriptionSo: 'Dabaq cusub oo dhismihiisu socdo oo ku yaal Kilimani, Nairobi. Deegaanka ay aadka u jecel yihiin ganacsatada iyo qurbajoogta Soomaaliyeed. Waxaa ku jira barkad biyo diirran, koronto iyo biyo joogto ah, iyo bixinta oo 4 sano loo qaybiyay iyadoo 20% kaliya hore loo bixinayo.',
    amenities: ['Heated Rooftop Pool', 'Borehole Water Supply', 'Standby Generator', 'Children Play Zone', 'CCTV & Biometric Access', '4-Year Flexible Payment Plan'],
    amenitiesSo: ['Barkad Biyo Diiran', 'Ceel Biyood Joogto ah', 'Matoor Koronto oo Awood Leh', 'Aagga Ciyaarta Carruurta', 'Kaamirooyin & Gelid Farta Ah', 'Qorshe 4 Sano oo Qeyb-Qeyb ah'],
    agent: {
      name: 'Safiyo Maxamuud Jaamac',
      role: 'Commercial Investments Lead',
      roleSo: 'Khabiirka Maalgashiga Ganacsiga',
      phone: '+252 61 777 4410',
      email: 'safiya@grandexport.so',
      whatsapp: '252617774410',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-02-08T12:00:00Z',
  },
  {
    id: 'ger-008',
    title: 'Wadajir Diplomatic Enclave Residence',
    titleSo: 'Guriga Weyn ee Aagga Diblomaasiyadda Wadajir',
    slug: 'wadajir-diplomatic-residence',
    price: 420000,
    purpose: 'sale',
    propertyType: 'villa',
    location: {
      city: 'Mogadishu',
      neighborhood: 'Wadajir / Airport Road',
      country: 'Somalia',
      lat: 2.0250,
      lng: 45.3050,
      address: 'Near Halane Diplomatic Gate, Wadajir',
    },
    bedrooms: 6,
    bathrooms: 6,
    areaSqm: 520,
    featured: false,
    isNew: false,
    yearBuilt: 2024,
    parkingSpots: 4,
    images: [
      '/src/assets/images/property_modern_villa_1794132038393.jpg',
      '/src/assets/images/hero_grand_export_estate_1794132036523.jpg',
    ],
    description: 'High-security reinforced villa within minutes of the international airport. Designed for embassies, executives, or large diaspora families seeking maximum safety and luxury.',
    descriptionSo: 'Filo weyn oo leh nidaam amni oo heer caalami ah oo ku dhow garoonka Aadan Cadde. Waxay leedahay 6 qol oo waasac ah, 6 musqulood, qolalka ilaalada, barxad baarkin weyn, iyo shuruuc buuxda.',
    amenities: ['Reinforced Perimeter & Guard Sentry', 'Dual Entrance Gates', 'Full Solar Energy Bank', 'Deep Water Well', 'Spacious Majlis Room', 'Staff Quarters'],
    amenitiesSo: ['Dayr Adag & Rugta Ilaalada', 'Laba Albaab oo Kala Duwan', 'Korontada Cadceedda oo Buuxda', 'Ceel Biyood Macaan', 'Qolka Weyn ee Fadhiga (Majlis)', 'Qolalka Shaqaalaha'],
    agent: {
      name: 'Eng. Cabdirisaaq Nuur Xasan',
      role: 'Senior Luxury Real Estate Director',
      roleSo: 'Agaasimaha Guryaha Raaxada',
      phone: '+252 61 555 8920',
      email: 'abdirisaq@grandexport.so',
      whatsapp: '252615558920',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: '2026-02-02T15:30:00Z',
  }
];

export const INITIAL_BOOKINGS: TourBooking[] = [
  {
    id: 'tb-101',
    propertyId: 'ger-001',
    propertyTitle: 'The Pearl Coastal Villa & Infinity Residence',
    clientName: 'Maxamed Cumar Saalax (London, UK)',
    clientEmail: 'm.omar.uk@gmail.com',
    clientPhone: '+44 7911 123456',
    date: '2026-11-15',
    timeSlot: '14:00 - 15:30',
    tourType: 'virtual-video',
    notes: 'Looking for beachfront investment property, prefers live WhatsApp video tour.',
    status: 'confirmed',
    createdAt: '2026-11-06T10:00:00Z',
  },
  {
    id: 'tb-102',
    propertyId: 'ger-002',
    propertyTitle: 'Skyline Azure Commercial Plaza',
    clientName: 'Dr. Faadumo Cali Warsame',
    clientEmail: 'dr.fadumo@clinics.so',
    clientPhone: '+252 61 888 2390',
    date: '2026-11-12',
    timeSlot: '10:00 - 11:00',
    tourType: 'in-person',
    notes: 'Interested in acquiring 2 floors for private medical diagnostic center.',
    status: 'pending',
    createdAt: '2026-11-07T16:20:00Z',
  }
];

export class RealEstateDB {
  static getProperties(): Property[] {
    try {
      const stored = localStorage.getItem(PROPERTIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // initialize
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }

  static saveProperty(property: Omit<Property, 'id' | 'createdAt' | 'slug'>): Property {
    const list = this.getProperties();
    const id = `ger-${Date.now().toString().slice(-4)}`;
    const slug = property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProp: Property = {
      ...property,
      id,
      slug,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProp, ...list];
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated));
    return newProp;
  }

  static deleteProperty(id: string): void {
    const list = this.getProperties();
    const updated = list.filter(p => p.id !== id);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated));
  }

  static getBookings(): TourBooking[] {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }

  static addBooking(booking: Omit<TourBooking, 'id' | 'createdAt' | 'status'>): TourBooking {
    const list = this.getBookings();
    const newBooking: TourBooking = {
      ...booking,
      id: `tb-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newBooking, ...list];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return newBooking;
  }

  static updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'completed'): void {
    const list = this.getBookings();
    const updated = list.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  }

  static getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['ger-001'];
  }

  static toggleFavorite(propertyId: string): string[] {
    const current = this.getFavorites();
    const next = current.includes(propertyId)
      ? current.filter(id => id !== propertyId)
      : [...current, propertyId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return next;
  }

  static formatPrice(amount: number, currency: Currency): string {
    switch (currency) {
      case 'SOS':
        // 1 USD ~ 26,000 SOS
        const sos = Math.round(amount * 26000);
        return `SOS ${sos.toLocaleString('en-US')}`;
      case 'EUR':
        const eur = Math.round(amount * 0.92);
        return `€${eur.toLocaleString('en-US')}`;
      case 'AED':
        const aed = Math.round(amount * 3.67);
        return `AED ${aed.toLocaleString('en-US')}`;
      case 'USD':
      default:
        return `$${amount.toLocaleString('en-US')}`;
    }
  }
}
