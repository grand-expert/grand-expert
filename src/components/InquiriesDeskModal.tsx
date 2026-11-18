import React from 'react';
import { TourBooking, Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import { X, ClipboardList, CheckCircle, Clock, Video, Building, PhoneCall, Trash2 } from 'lucide-react';

interface InquiriesDeskModalProps {
  bookings: TourBooking[];
  lang: Language;
  onClose: () => void;
  onRefresh: () => void;
}

export const InquiriesDeskModal: React.FC<InquiriesDeskModalProps> = ({
  bookings,
  lang,
  onClose,
  onRefresh,
}) => {
  const t = translations[lang];

  const handleStatusChange = (id: string, status: TourBooking['status']) => {
    RealEstateDB.updateBookingStatus(id, status);
    onRefresh();
  };

  const getClientWhatsappUrl = (b: TourBooking) => {
    const cleanPhone = b.clientPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Asalaamu Calaykum ${b.clientName}. Waxaan nahay Grand-Export Real Estate. Waxaan helnay codsigaagii ballanta kormeerka ee guriga: ${b.propertyTitle}. Fadlan nala soo xiriir.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d131f]/95">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {t.inquiriesDeskTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.inquiriesDeskSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table / Card List */}
        <div className="overflow-y-auto p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              {lang === 'so' ? 'Weli ma jiraan codsiyo diiwaangashan.' : 'No inquiries recorded yet.'}
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-[#0a0f19] border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-slate-700"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-amber-400 font-semibold">
                        {booking.id}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <h4 className="text-sm font-bold text-white">
                        {booking.clientName}
                      </h4>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {booking.clientPhone}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {booking.propertyTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="tabular-nums">{booking.date} ({booking.timeSlot})</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1">
                        {booking.tourType === 'virtual-video' ? (
                          <Video className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{booking.tourType === 'virtual-video' ? 'Virtual Video' : 'In-Person'}</span>
                      </span>
                      {booking.notes && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="italic text-slate-400">"{booking.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value as TourBooking['status'])}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                          : booking.status === 'completed'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-700/60'
                          : 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                      }`}
                    >
                      <option value="pending">{lang === 'so' ? 'Sugaya (Pending)' : 'Pending'}</option>
                      <option value="confirmed">{lang === 'so' ? 'La Xaqiijiyay (Confirmed)' : 'Confirmed'}</option>
                      <option value="completed">{lang === 'so' ? 'Dhammaaday (Completed)' : 'Completed'}</option>
                    </select>

                    <a
                      href={getClientWhatsappUrl(booking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors"
                      title="WhatsApp Client"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>
              {lang === 'so' ? 'Xogtaan waxaa si toos ah loogu keydiyaa diiwaanka browser-ka.' : 'Records are securely stored in persistent local database.'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
