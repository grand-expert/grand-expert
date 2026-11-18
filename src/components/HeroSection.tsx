import React from 'react';
import { Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { Search, ShieldCheck, MapPin, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
  onExploreProperties: () => void;
  onScheduleTour: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onExploreProperties,
  onScheduleTour,
}) => {
  const t = translations[lang];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Hero Image with measured scrim */}
      <div className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_grand_export_estate_1794132036523.jpg"
            alt="Grand-Export Real Estate Luxury Coastal Villa"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000"
          />
          {/* Gradients ensuring 4.5:1 text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/75 to-[#0b0f17]/50" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0b0f17]/40 to-[#0b0f17]/90" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Quiet text kicker / badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Sized clamp(2.25rem, 4vw, 3.75rem) Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display max-w-4xl text-balance leading-[1.15]">
            {t.heroTitle}
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl text-balance font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Quick Search Box */}
          <div className="mt-9 w-full max-w-2xl bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2.5 px-3 py-2 w-full text-left">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={onSearchSubmit}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg whitespace-nowrap shrink-0 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>{lang === 'so' ? 'Raadi Hadda' : 'Search Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <button
              onClick={onExploreProperties}
              className="px-5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium border border-slate-700 transition-colors"
            >
              {lang === 'so' ? 'Daawo Dhammaan Guryaha (450+)' : 'Browse All Properties (450+)'}
            </button>
            <button
              onClick={onScheduleTour}
              className="px-5 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{lang === 'so' ? 'Kormeer Toos ah & Qurbajoogta' : 'Live Walkthrough for Diaspora'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proof / KPI Strip adjacent to Hero */}
      <div className="w-full bg-slate-900/90 border-y border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display tabular-nums">
              {t.statVolume}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.statVolumeDesc}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
              {t.statProperties}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.statPropertiesDesc}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display tabular-nums">
              {t.statInvestors}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.statInvestorsDesc}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
              {t.statTrust}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.statTrustDesc}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
