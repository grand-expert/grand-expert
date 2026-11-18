import React from 'react';
import { Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { ShieldCheck, Video, BadgeDollarSign, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

interface DiasporaSectionProps {
  lang: Language;
  onBookTour: () => void;
}

export const DiasporaSection: React.FC<DiasporaSectionProps> = ({
  lang,
  onBookTour,
}) => {
  const t = translations[lang];

  return (
    <section id="diaspora" className="w-full py-16 bg-[#0a0f19] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {lang === 'so' ? 'Barnaamijka Qurbajoogta' : 'Diaspora Gateway'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1.5 font-display text-balance">
              {t.diasporaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              {t.diasporaSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/252615558920?text=Asalaamu%20Calaykum%20Grand-Export%20Real%20Estate.%20Waxaan%20joogaa%20qurba-joogta,%20waxaan%20doonayaa%20in%20aan%20la%20tashado%20khabiir."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === 'so' ? 'Kala Xiriir Khadka Qurbajoogta' : 'Direct Diaspora WhatsApp Desk'}</span>
            </a>
            <button
              onClick={onBookTour}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors border border-slate-700"
            >
              {t.ctaBookTour}
            </button>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0f1626] border border-slate-800 rounded-2xl hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display mb-2">
              {t.diasporaFeature1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.diasporaFeature1Desc}
            </p>
          </div>

          <div className="p-6 bg-[#0f1626] border border-slate-800 rounded-2xl hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display mb-2">
              {t.diasporaFeature2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.diasporaFeature2Desc}
            </p>
          </div>

          <div className="p-6 bg-[#0f1626] border border-slate-800 rounded-2xl hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <BadgeDollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display mb-2">
              {t.diasporaFeature3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.diasporaFeature3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
