import React, { useState } from 'react';
import { Property, Language, Currency } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import { MapPin, Navigation, ExternalLink, Calendar, PhoneCall, X } from 'lucide-react';

interface InteractiveMapViewProps {
  properties: Property[];
  lang: Language;
  currency: Currency;
  onSelectProperty: (property: Property) => void;
  onBookTour: (property: Property) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  properties,
  lang,
  currency,
  onSelectProperty,
  onBookTour,
}) => {
  const t = translations[lang];
  const [selectedPin, setSelectedPin] = useState<Property | null>(properties[0] || null);

  // Group coordinates or normalize on SVG viewbox
  // Default coordinates center around East Africa & Gulf (Mogadishu ~2.04 N, 45.34 E, Hargeisa 9.56 N, 44.07 E, Dubai 25.08 N, 55.14 E, Nairobi -1.29 S, 36.78 E)
  // Mapping bounds: Longitude 35 to 58, Latitude -3 to 27
  const minLng = 34;
  const maxLng = 58;
  const minLat = -3;
  const maxLat = 27;

  const getSvgCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500;
    return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(470, y)) };
  };

  return (
    <div className="relative w-full bg-[#0a0e17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>{lang === 'so' ? 'Khariidadda Hantida & Goobaha Maalgashiga' : 'Interactive Regional Property Map'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'so'
              ? 'Guji calaamadaha si aad u aragto guryaha Muqdisho, Hargeysa, Dubai, iyo Nairobi.'
              : 'Click any location pin to preview properties across Mogadishu, Hargeisa, Dubai, and Nairobi.'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>{lang === 'so' ? 'Guryo Iib ah' : 'Sale'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>{lang === 'so' ? 'Guryo Kiro ah' : 'Rent / Off-plan'}</span>
          </span>
        </div>
      </div>

      <div className="relative w-full h-[420px] sm:h-[480px] bg-[#070b12] rounded-xl overflow-hidden border border-slate-800/80">
        {/* Stylized Topographic / Cartographic Grid */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#141c2e" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f213d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#070b12" stopOpacity="0.9" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#oceanGlow)" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Regional Landmass Outlines (Horn of Africa & Arabian Peninsula stylized contours) */}
          <path
            d="M 120 180 Q 200 120 340 110 T 520 80 T 680 70 L 740 130 L 620 220 L 500 240 L 450 310 L 410 400 L 320 480 L 220 450 L 150 380 L 120 280 Z"
            fill="#0c1322"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Coastal water shimmer lines */}
          <path
            d="M 390 310 Q 430 360 400 420"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <path
            d="M 340 110 Q 420 100 520 80"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Regional Labels on Map */}
          <text x="375" y="360" fill="#475569" fontSize="12" fontWeight="600" letterSpacing="2">
            MOGADISHU / SOOMAALIYA
          </text>
          <text x="300" y="210" fill="#475569" fontSize="11" fontWeight="600" letterSpacing="1.5">
            HARGEISA / SOMALILAND
          </text>
          <text x="610" y="85" fill="#475569" fontSize="11" fontWeight="600" letterSpacing="1.5">
            DUBAI / UAE
          </text>
          <text x="180" y="440" fill="#475569" fontSize="11" fontWeight="600" letterSpacing="1.5">
            NAIROBI / KENYA
          </text>
          <text x="470" y="380" fill="#0284c7" fontSize="11" fontStyle="italic" opacity="0.5">
            Indian Ocean / Badda Hindiya
          </text>

          {/* Property Pins */}
          {properties.map((prop) => {
            const { x, y } = getSvgCoords(prop.location.lat, prop.location.lng);
            const isSelected = selectedPin?.id === prop.id;
            const isSale = prop.purpose === 'sale';

            return (
              <g
                key={prop.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedPin(prop)}
              >
                {/* Ping aura */}
                <circle
                  r={isSelected ? '16' : '10'}
                  fill={isSale ? '#f59e0b' : '#38bdf8'}
                  opacity={isSelected ? '0.35' : '0.15'}
                  className={isSelected ? 'animate-ping' : ''}
                />
                {/* Pin core */}
                <circle
                  r={isSelected ? '7' : '5'}
                  fill={isSale ? '#f59e0b' : '#38bdf8'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="shadow-lg"
                />
                {/* City name text */}
                <text
                  y="-12"
                  textAnchor="middle"
                  fill={isSelected ? '#fde68a' : '#94a3b8'}
                  fontSize={isSelected ? '11' : '9'}
                  fontWeight={isSelected ? '700' : '500'}
                  className="select-none"
                >
                  {prop.location.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Property Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-20">
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              <img
                src={selectedPin.images[0]}
                alt={selectedPin.title}
                referrerPolicy="no-referrer"
                className="w-20 h-20 object-cover rounded-lg shrink-0 border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  {selectedPin.location.city} · {selectedPin.purpose.toUpperCase()}
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                  {lang === 'so' ? selectedPin.titleSo : selectedPin.title}
                </h4>
                <div className="text-xs text-slate-300 mt-1">
                  {selectedPin.bedrooms > 0 ? `${selectedPin.bedrooms} ${t.beds} · ` : ''}
                  {selectedPin.areaSqm} {t.sqm}
                </div>
                <div className="text-sm font-extrabold text-amber-400 tabular-nums mt-1 font-display">
                  {RealEstateDB.formatPrice(selectedPin.price, currency)}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectProperty(selectedPin)}
                className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1"
              >
                <span>{t.propertyDetails}</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </button>
              <button
                onClick={() => onBookTour(selectedPin)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                <span>{t.ctaBookTour}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
