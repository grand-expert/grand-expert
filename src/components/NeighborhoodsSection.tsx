import React from 'react';
import { Language } from '../types/realEstate';
import { MapPin, TrendingUp, Compass } from 'lucide-react';

interface NeighborhoodsSectionProps {
  lang: Language;
  onSelectCity: (city: string) => void;
}

export const NeighborhoodsSection: React.FC<NeighborhoodsSectionProps> = ({
  lang,
  onSelectCity,
}) => {
  const hubs = [
    {
      city: 'Mogadishu',
      title: lang === 'so' ? 'Xeebta Liido & Abdiaziz' : 'Liido Beachfront & Abdiaziz',
      sub: lang === 'so' ? 'Muuqaalka badda, filooyin raaxo ah & dalxiis' : 'Luxury coastal villas & high-yield hospitality',
      growth: '+18% YoY',
      img: '/src/assets/images/hero_grand_export_estate_1794132036523.jpg',
    },
    {
      city: 'Mogadishu',
      title: lang === 'so' ? 'Wadada Garoonka & KM4' : 'Airport Road & KM4 Corridor',
      sub: lang === 'so' ? 'Daaraha ganacsiga, safaaradaha & xarumaha hay\'adaha' : 'Diplomatic missions, towers & corporate HQs',
      growth: '+22% YoY',
      img: '/src/assets/images/property_commercial_tower_1794132038854.jpg',
    },
    {
      city: 'Hargeisa',
      title: lang === 'so' ? 'Jigjiga Yar Heights' : 'Jigjiga Yar Scenic Heights',
      sub: lang === 'so' ? 'Deegaanka qoyska ugu sarreeya ee Hargeysa' : 'Prestigious residential villas with mountain views',
      growth: '+15% YoY',
      img: '/src/assets/images/property_modern_villa_1794132038393.jpg',
    },
    {
      city: 'Dubai',
      title: lang === 'so' ? 'Dubai Marina & Downtown' : 'Dubai Marina & Downtown UAE',
      sub: lang === 'so' ? 'Golden Visa & faa\'iido kireed oo caalami ah' : 'Golden Visa eligible waterfront penthouses',
      growth: '+12% YoY',
      img: '/src/assets/images/property_seaside_penthouse_1794132038189.jpg',
    },
  ];

  return (
    <section id="neighborhoods" className="w-full py-16 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {lang === 'so' ? 'Goobaha Ugu Qiimaha Badan' : 'Prime Investment Corridors'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
              {lang === 'so' ? 'Xaafadaha & Suuqyada Hoggaaminaya' : 'Neighborhood & City Spotlights'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            {lang === 'so'
              ? 'Xulasho gaar ah oo ku saabsan goobaha ugu kobaca sarreeya uguna faa\'iidada badan ee hantida ma-guurtada ah.'
              : 'Carefully curated micro-locations offering highest historical capital appreciation and premium yields.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hubs.map((hub, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCity(hub.city)}
              className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer hover:border-amber-500/50 transition-all duration-300 shadow-lg"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={hub.img}
                  alt={hub.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{hub.city}</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {hub.growth}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-display">
                  {hub.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {hub.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
