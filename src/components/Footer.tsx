import React from 'react';
import { Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { Building2, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onOpenCalculator: () => void;
  onOpenInquiries: () => void;
  onOpenAddProperty: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenCalculator,
  onOpenInquiries,
  onOpenAddProperty,
}) => {
  const t = translations[lang];

  return (
    <footer className="w-full bg-[#070a10] border-t border-slate-800 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Grand-Export <span className="text-amber-400 font-normal">Real Estate</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              {t.footerDesc}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-lg max-w-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'so'
                  ? 'Shirkad Sharciyeysan · Diiwaanka Ganacsiga & Notary-ga Guud'
                  : 'Licensed & Registered Real Estate Brokerage Entity'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-3 font-display">
              {lang === 'so' ? 'Bogagga Muhiimka ah' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#properties" className="hover:text-amber-400 transition-colors">
                  {t.navProperties}
                </a>
              </li>
              <li>
                <a href="#diaspora" className="hover:text-amber-400 transition-colors">
                  {t.navDiaspora}
                </a>
              </li>
              <li>
                <a href="#neighborhoods" className="hover:text-amber-400 transition-colors">
                  {t.navNeighborhoods}
                </a>
              </li>
              <li>
                <button onClick={onOpenCalculator} className="hover:text-amber-400 transition-colors">
                  {t.navCalculator}
                </button>
              </li>
              <li>
                <button onClick={onOpenInquiries} className="hover:text-amber-400 transition-colors">
                  {t.navInquiries}
                </button>
              </li>
              <li>
                <button onClick={onOpenAddProperty} className="hover:text-amber-400 transition-colors">
                  {t.navAddProperty}
                </button>
              </li>
            </ul>
          </div>

          {/* Global Offices */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold mb-3 font-display">
              {lang === 'so' ? 'Xafiisyada Dalka & Caalamka' : 'Our Prime Hubs'}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Mogadishu HQ:</strong> KM4 Airport Road, Hodan District, Banadir, Somalia.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Hargeisa Branch:</strong> Main Jigjiga Yar Road, Near Mansoor, Hargeisa.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Dubai Office:</strong> Level 18, Prime Business Bay Tower, Dubai, UAE.
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">+252 61 555 8920 / +971 50 892 4110</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">info@grandexport.so</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{t.footerCopyright}</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Mogadishu</span>
            <span aria-hidden="true">·</span>
            <span>Hargeisa</span>
            <span aria-hidden="true">·</span>
            <span>Dubai</span>
            <span aria-hidden="true">·</span>
            <span>Nairobi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
