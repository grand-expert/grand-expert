import React, { useState } from 'react';
import { Property, Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import { X, CalendarCheck, CheckCircle2, Video, Building, PhoneCall } from 'lucide-react';

interface TourBookingModalProps {
  properties: Property[];
  selectedProperty?: Property | null;
  lang: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const TourBookingModal: React.FC<TourBookingModalProps> = ({
  properties,
  selectedProperty,
  lang,
  onClose,
  onSuccess,
}) => {
  const t = translations[lang];

  const [propId, setPropId] = useState(selectedProperty?.id || properties[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState('2026-11-15');
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:30');
  const [tourType, setTourType] = useState<'in-person' | 'virtual-video'>('virtual-video');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const matchedProp = properties.find(p => p.id === propId) || properties[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    RealEstateDB.addBooking({
      propertyId: propId,
      propertyTitle: matchedProp ? (lang === 'so' ? matchedProp.titleSo : matchedProp.title) : 'General Property Consultation',
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientPhone.replace(/\s+/g, '')}@client.com`,
      date,
      timeSlot,
      tourType,
      notes,
    });

    setSubmitted(true);
    onSuccess();
  };

  const getWhatsappUrl = () => {
    const text = encodeURIComponent(
      `Asalaamu Calaykum Grand-Export Real Estate. Waxaan soo gudbiyay ballanta kormeerka: ${clientName} (${clientPhone}). Fadlan i xaqiijiya waqtiga.`
    );
    return `https://wa.me/252615558920?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d131f]/95">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              {t.ctaBookTour}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">
                {t.bookingSuccess}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'so'
                  ? 'Waxaan kula soo xiriiri doonaa WhatsApp ama taleefan si aan kuu siino faahfaahinta kormeerka.'
                  : 'Our advisors will contact you on WhatsApp or phone to confirm details.'}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={getWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.contactWhatsapp}</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Property Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'so' ? 'Dooro Guriga aad Daneyneyso' : 'Select Target Property'}
                </label>
                <select
                  value={propId}
                  onChange={(e) => setPropId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {lang === 'so' ? p.titleSo : p.title} ({p.location.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  {lang === 'so' ? 'Habka Kormeerka' : 'Inspection Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTourType('virtual-video')}
                    className={`py-2 px-3 rounded font-medium transition-colors flex items-center justify-center gap-1.5 text-xs ${
                      tourType === 'virtual-video'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{t.virtualTour}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourType('in-person')}
                    className={`py-2 px-3 rounded font-medium transition-colors flex items-center justify-center gap-1.5 text-xs ${
                      tourType === 'in-person'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>{t.inPersonTour}</span>
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
                  placeholder="e.g. Ayaanle Cabdiqaadir"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.clientPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+252 61 ... / WhatsApp"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.clientEmail}
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="10:00 - 11:30">Subax (10:00 - 11:30 AM)</option>
                    <option value="14:00 - 15:30">Galab (02:00 - 03:30 PM)</option>
                    <option value="16:00 - 17:30">Fiid (04:00 - 05:30 PM)</option>
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
                  placeholder={lang === 'so' ? 'Faallo ama dalab gaar ah...' : 'Any preferences...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg shadow-md transition-all"
                >
                  {t.confirmBookingBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
