import React from 'react';
import { Language, Currency } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { Globe, DollarSign, CalendarCheck, PlusCircle, Building2, ClipboardList } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenBooking: () => void;
  onOpenAddProperty: () => void;
  onOpenInquiries: () => void;
  onOpenCalculator: () => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  currency,
  setCurrency,
  onOpenBooking,
  onOpenAddProperty,
  onOpenInquiries,
  onOpenCalculator,
  bookingsCount,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0f17]/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single-element) */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0">
            Grand-Export <span className="text-amber-400 font-normal">Real Estate</span>
          </span>
        </a>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#properties"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-amber-400"
          >
            {t.navProperties}
          </a>
          <a
            href="#diaspora"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-amber-400"
          >
            {t.navDiaspora}
          </a>
          <a
            href="#neighborhoods"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-amber-400"
          >
            {t.navNeighborhoods}
          </a>
          <button
            onClick={onOpenCalculator}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-amber-400"
          >
            {t.navCalculator}
          </button>
          <button
            onClick={onOpenInquiries}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-amber-400 flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <span>{t.navInquiries}</span>
            {bookingsCount > 0 && (
              <span className="text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded text-center">
                {bookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900/90 rounded-md border border-slate-700/60 p-0.5 text-xs">
            <button
              onClick={() => setLang('so')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 font-medium ${
                lang === 'so' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Af-Soomaali"
            >
              SO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 font-medium ${
                lang === 'en' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-slate-900 text-xs text-slate-300 border border-slate-700/60 rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-400 whitespace-nowrap shrink-0 cursor-pointer font-mono"
            aria-label="Currency"
          >
            <option value="USD">USD ($)</option>
            <option value="SOS">SOS (Sh.)</option>
            <option value="EUR">EUR (€)</option>
            <option value="AED">AED (Dh)</option>
          </select>

          {/* Add Property Button */}
          <button
            onClick={onOpenAddProperty}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.navAddProperty}</span>
          </button>

          {/* Zone 3 Primary Action */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
          >
            <CalendarCheck className="w-4 h-4 stroke-[2.2]" />
            <span>{t.ctaBookTour}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
