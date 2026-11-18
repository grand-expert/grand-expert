import React, { useState } from 'react';
import { Property, Language, Currency } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import {
  X,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  PhoneCall,
  Share2,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Building,
  Car,
  FileCheck2,
  Clock,
  Video,
  UserCheck,
  MessageCircle
} from 'lucide-react';
import { MortgageCalculator } from './MortgageCalculator';

interface PropertyModalProps {
  property: Property;
  lang: Language;
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onBookTourSuccess: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  lang,
  currency,
  isFavorite,
  onToggleFavorite,
  onClose,
  onBookTourSuccess,
}) => {
  const t = translations[lang];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tour Booking Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState('2026-11-15');
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:30');
  const [tourType, setTourType] = useState<'in-person' | 'virtual-video'>('virtual-video');
  const [notes, setNotes] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const title = lang === 'so' ? property.titleSo : property.title;
  const description = lang === 'so' ? property.descriptionSo : property.description;
  const amenities = lang === 'so' ? property.amenitiesSo : property.amenities;
  const formattedPrice = RealEstateDB.formatPrice(property.price, currency);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?property=${property.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    RealEstateDB.addBooking({
      propertyId: property.id,
      propertyTitle: title,
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientPhone.replace(/\s+/g, '')}@client.com`,
      date,
      timeSlot,
      tourType,
      notes,
    });

    setBookingSubmitted(true);
    onBookTourSuccess();
  };

  const getWhatsappUrl = () => {
    const phone = (property.agent?.whatsapp || '252616904444').replace(/[^0-9]/g, '') || '252616904444';
    const text = encodeURIComponent(
      `Hello Grand-Expart Real Estate, I would like to inquire about "${title}" (Price: ${formattedPrice}, Ref: ${property.id}) at ${property.location.neighborhood}, ${property.location.city}. Please share availability and next steps.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-[#0d131f]/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded shrink-0">
              {property.purpose.toUpperCase()}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate font-display">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat on WhatsApp</span>
            </a>
            {/* Share Link */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative"
              title={t.copyLink}
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap shadow-lg">
                  {t.linkCopied}
                </span>
              )}
            </button>

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-8">
          {/* Gallery View */}
          <div>
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={property.images[activeImageIdx] || property.images[0]}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
                {property.location.address || `${property.location.neighborhood}, ${property.location.city}`}
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#0a0f19] border border-slate-800 rounded-xl">
            <div>
              <span className="text-xs text-slate-400">{t.filterPrice}</span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-display tabular-nums mt-0.5">
                {formattedPrice}
              </div>
            </div>
            {property.bedrooms > 0 && (
              <div>
                <span className="text-xs text-slate-400">{t.beds}</span>
                <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5 tabular-nums">
                  <BedDouble className="w-5 h-5 text-slate-400" />
                  <span>{property.bedrooms}</span>
                </div>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div>
                <span className="text-xs text-slate-400">{t.baths}</span>
                <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5 tabular-nums">
                  <Bath className="w-5 h-5 text-slate-400" />
                  <span>{property.bathrooms}</span>
                </div>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-400">{t.sqm}</span>
              <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5 tabular-nums">
                <Maximize2 className="w-5 h-5 text-slate-400" />
                <span>{property.areaSqm}</span>
              </div>
            </div>
          </div>

          {/* Two-Column Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Description, Amenities, Location */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-base font-bold text-white mb-2 font-display">
                  {t.aboutProperty}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Verified Title Trust Box */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-emerald-300">
                    {lang === 'so' ? 'Hanti Sharciyeysan oo Diiwaangashan' : 'Verified & Registered Title Deed'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'so'
                      ? 'Gurigaan waxaa lagala hubiyay diiwaanka Dowladda Hoose iyo Notary-ga guud, waxaana la damaanad-qaadayaa inaan wax muran ah ku jirin.'
                      : 'This property has been vetted through municipal registries and notary boards with guaranteed clear ownership.'}
                  </p>
                </div>
              </div>

              {/* Amenities List */}
              <div>
                <h3 className="text-base font-bold text-white mb-3 font-display">
                  {t.amenities}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mortgage Calculator */}
              <MortgageCalculator
                propertyPrice={property.price}
                currency={currency}
                lang={lang}
                purpose={property.purpose}
              />

              {/* Responsible Advisor Card */}
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/60"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                      {t.agentContact}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {property.agent.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'so' ? property.agent.roleSo : property.agent.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={getWhatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Live Tour Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-[#0f1523] border border-slate-700/80 rounded-xl p-5 sticky top-24">
                <h3 className="text-base font-bold text-white font-display mb-1">
                  {t.scheduleTourTitle}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {t.scheduleTourDesc}
                </p>

                {bookingSubmitted ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs sm:text-sm font-medium text-amber-200">
                      {t.bookingSuccess}
                    </p>
                    <a
                      href={getWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                    {/* Inspection Type Selector */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        {lang === 'so' ? 'Nooca Kormeerka' : 'Inspection Type'}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setTourType('virtual-video')}
                          className={`py-1.5 px-2 rounded font-medium transition-colors flex items-center justify-center gap-1 text-[11px] ${
                            tourType === 'virtual-video'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Video className="w-3 h-3" />
                          <span>Video Tour</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTourType('in-person')}
                          className={`py-1.5 px-2 rounded font-medium transition-colors flex items-center justify-center gap-1 text-[11px] ${
                            tourType === 'in-person'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Building className="w-3 h-3" />
                          <span>In-Person</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        {t.clientName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Maxamed Jaamac"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        {t.clientPhone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+252 61 ... / +44 79 ..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          {t.preferredDate}
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          {t.timeSlot}
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="10:00 - 11:30">10:00 - 11:30 AM</option>
                          <option value="14:00 - 15:30">02:00 - 03:30 PM</option>
                          <option value="16:00 - 17:30">04:00 - 05:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        {t.specialNotes}
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={lang === 'so' ? 'Qor waxaad dooneyso...' : 'Any preferences...'}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.confirmBookingBtn}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
