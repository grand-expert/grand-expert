import React, { useState, useEffect, useMemo } from 'react';
import { Property, TourBooking, Language, Currency, FilterState } from './types/realEstate';
import { translations } from './locales/dictionary';
import { RealEstateDB } from './services/db';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyFilters } from './components/PropertyFilters';
import { PropertyCard } from './components/PropertyCard';
import { PropertyModal } from './components/PropertyModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { TourBookingModal } from './components/TourBookingModal';
import { MortgageCalculatorModal } from './components/MortgageCalculatorModal';
import { InquiriesDeskModal } from './components/InquiriesDeskModal';
import { InteractiveMapView } from './components/InteractiveMapView';
import { DiasporaSection } from './components/DiasporaSection';
import { NeighborhoodsSection } from './components/NeighborhoodsSection';
import { Footer } from './components/Footer';
import { Building2, Search, SlidersHorizontal, Sparkles, PhoneCall } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('so');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    purpose: 'all',
    propertyType: 'all',
    city: 'all',
    minPrice: 0,
    maxPrice: 2500000,
    bedrooms: 'all',
    sortBy: 'featured',
  });

  const t = translations[lang];

  // Load database state & handle initial URL query for deep link
  useEffect(() => {
    const loadedProps = RealEstateDB.getProperties();
    setProperties(loadedProps);
    setBookings(RealEstateDB.getBookings());
    setFavorites(RealEstateDB.getFavorites());

    // Check deep link: ?property=ger-001
    const params = new URLSearchParams(window.location.search);
    const propId = params.get('property');
    if (propId) {
      const target = loadedProps.find(p => p.id === propId);
      if (target) {
        setSelectedProperty(target);
      }
    }
  }, []);

  const refreshData = () => {
    setProperties(RealEstateDB.getProperties());
    setBookings(RealEstateDB.getBookings());
    setFavorites(RealEstateDB.getFavorites());
  };

  const handleToggleFavorite = (id: string) => {
    const updated = RealEstateDB.toggleFavorite(id);
    setFavorites(updated);
  };

  const handleHeroSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
    const el = document.getElementById('properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Keyword search
      const q = (filters.search || searchQuery).trim().toLowerCase();
      if (q) {
        const matchTitle = prop.title.toLowerCase().includes(q) || prop.titleSo.toLowerCase().includes(q);
        const matchCity = prop.location.city.toLowerCase().includes(q) || prop.location.neighborhood.toLowerCase().includes(q);
        const matchDesc = prop.description.toLowerCase().includes(q) || prop.descriptionSo.toLowerCase().includes(q);
        const matchType = prop.propertyType.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchDesc && !matchType) {
          return false;
        }
      }

      // Purpose
      if (filters.purpose !== 'all' && prop.purpose !== filters.purpose) {
        return false;
      }

      // Property Type
      if (filters.propertyType !== 'all' && prop.propertyType !== filters.propertyType) {
        return false;
      }

      // City
      if (filters.city !== 'all' && prop.location.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms !== 'all') {
        const requiredBeds = Number(filters.bedrooms);
        if (prop.bedrooms < requiredBeds) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'area') return b.areaSqm - a.areaSqm;
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [properties, filters, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to 3-zone contract */}
      <Navbar
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenAddProperty={() => setIsAddPropertyModalOpen(true)}
        onOpenInquiries={() => setIsInquiriesModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        bookingsCount={bookings.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          lang={lang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleHeroSearch}
          onExploreProperties={() => {
            const el = document.getElementById('properties');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onScheduleTour={() => setIsBookingModalOpen(true)}
        />

        {/* Main Property Catalog */}
        <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {lang === 'so' ? 'Diiwaanka Hantida Dalka & Dibadda' : 'Verified Property Registry'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 font-display">
                {t.navProperties}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              {lang === 'so'
                ? 'Guryaha ugu raaxada badan, filooyinka xeebaha, dabaqyada ganacsiga, iyo dhulka maalgashiga.'
                : 'Curated architectural residences, seaside penthouses, and prime commercial plots.'}
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <PropertyFilters
            lang={lang}
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalCount={filteredProperties.length}
          />

          {/* Map View vs Card Views */}
          {viewMode === 'map' ? (
            <InteractiveMapView
              properties={filteredProperties}
              lang={lang}
              currency={currency}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onBookTour={(p) => {
                setSelectedProperty(p);
                setIsBookingModalOpen(true);
              }}
            />
          ) : (
            <>
              {filteredProperties.length === 0 ? (
                <div className="py-20 text-center bg-[#0d131f] border border-slate-800 rounded-2xl p-8">
                  <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t.noPropertiesFound}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                    {lang === 'so'
                      ? 'Isku day inaad wax ka beddesho shaandhada ama aad raadiso magaalo kale.'
                      : 'Try broadening your search query or removing some filters.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        search: '',
                        purpose: 'all',
                        propertyType: 'all',
                        city: 'all',
                        minPrice: 0,
                        maxPrice: 2500000,
                        bedrooms: 'all',
                        sortBy: 'featured',
                      });
                    }}
                    className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-amber-400 transition-colors"
                  >
                    {t.resetFilters}
                  </button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      lang={lang}
                      currency={currency}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectProperty={(p) => setSelectedProperty(p)}
                      onBookTour={(p) => {
                        setSelectedProperty(p);
                        setIsBookingModalOpen(true);
                      }}
                      viewMode="list"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      lang={lang}
                      currency={currency}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectProperty={(p) => setSelectedProperty(p)}
                      onBookTour={(p) => {
                        setSelectedProperty(p);
                        setIsBookingModalOpen(true);
                      }}
                      viewMode="grid"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Diaspora Section */}
        <DiasporaSection
          lang={lang}
          onBookTour={() => setIsBookingModalOpen(true)}
        />

        {/* Prime Investment Corridors / Neighborhoods */}
        <NeighborhoodsSection
          lang={lang}
          onSelectCity={(city) => {
            setFilters(prev => ({ ...prev, city }));
            const el = document.getElementById('properties');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Authoritative Footer */}
      <Footer
        lang={lang}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onOpenInquiries={() => setIsInquiriesModalOpen(true)}
        onOpenAddProperty={() => setIsAddPropertyModalOpen(true)}
      />

      {/* Modals */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          lang={lang}
          currency={currency}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedProperty(null)}
          onBookTourSuccess={refreshData}
        />
      )}

      {isBookingModalOpen && (
        <TourBookingModal
          properties={properties}
          selectedProperty={selectedProperty}
          lang={lang}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={refreshData}
        />
      )}

      {isAddPropertyModalOpen && (
        <AddPropertyModal
          lang={lang}
          onClose={() => setIsAddPropertyModalOpen(false)}
          onSuccess={refreshData}
        />
      )}

      {isCalculatorModalOpen && (
        <MortgageCalculatorModal
          lang={lang}
          currency={currency}
          onClose={() => setIsCalculatorModalOpen(false)}
        />
      )}

      {isInquiriesModalOpen && (
        <InquiriesDeskModal
          bookings={bookings}
          lang={lang}
          onClose={() => setIsInquiriesModalOpen(false)}
          onRefresh={refreshData}
        />
      )}
    </div>
  );
}
