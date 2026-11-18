import React from 'react';
import { Property, Language, Currency } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import { MapPin, BedDouble, Bath, Maximize2, Heart, Calendar, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  lang: Language;
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookTour: (property: Property) => void;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  lang,
  currency,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onBookTour,
  viewMode = 'grid',
}) => {
  const t = translations[lang];
  const title = lang === 'so' ? property.titleSo : property.title;
  const formattedPrice = RealEstateDB.formatPrice(property.price, currency);

  const getPurposeLabel = (purpose: Property['purpose']) => {
    switch (purpose) {
      case 'sale':
        return lang === 'so' ? 'Iib' : 'For Sale';
      case 'rent':
        return lang === 'so' ? 'Kiro / Billeed' : 'For Rent / Month';
      case 'off-plan':
        return lang === 'so' ? 'Dhisid Socota' : 'Off-Plan Project';
    }
  };

  const getWhatsappUrl = () => {
    const phone = (property.agent?.whatsapp || '252616904444').replace(/[^0-9]/g, '') || '252616904444';
    const text = encodeURIComponent(
      `Hello Grand-Expart Real Estate, I am interested in "${title}" (${formattedPrice}, Ref: ${property.id}) located at ${property.location.neighborhood}, ${property.location.city}. Please share more details.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-[#0f1523] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col md:flex-row shadow-lg">
        {/* Image Slot */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelectProperty(property)}>
          <img
            src={property.images[0]}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle status tag (simple non-pill text banner) */}
          <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 px-2.5 py-1 text-[11px] font-semibold text-amber-300 tracking-wide rounded">
            {getPurposeLabel(property.purpose)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorite ? 'bg-red-500/90 text-white' : 'bg-slate-950/70 text-slate-300 hover:text-white'
            }`}
            title={isFavorite ? t.favorited : t.favorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Location row */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{property.location.neighborhood}, {property.location.city}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{property.location.country}</span>
            </div>

            {/* Title */}
            <h3
              onClick={() => onSelectProperty(property)}
              className="text-lg md:text-xl font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer font-display leading-snug"
            >
              {title}
            </h3>

            {/* Clean unboxed metadata with dot separators */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-slate-400" />
                  <span className="tabular-nums">{property.bedrooms}</span>
                  <span className="text-slate-400">{t.beds}</span>
                </div>
              )}
              {property.bedrooms > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}

              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-slate-400" />
                  <span className="tabular-nums">{property.bathrooms}</span>
                  <span className="text-slate-400">{t.baths}</span>
                </div>
              )}
              {property.bathrooms > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}

              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums">{property.areaSqm}</span>
                <span className="text-slate-400">{t.sqm}</span>
              </div>

              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{property.location.neighborhood}</span>
            </div>

            {/* Snippet */}
            <p className="mt-3 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {lang === 'so' ? property.descriptionSo : property.description}
            </p>
          </div>

          {/* Bottom Bar: Price + Actions */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">{t.filterPrice}</div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-display tabular-nums">
                {formattedPrice}
                {property.purpose === 'rent' && <span className="text-xs text-slate-400 font-normal"> / bishii</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => onBookTour(property)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.ctaBookTour}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="group bg-[#0f1523] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-amber-500/5">
      {/* Visual Image Slot */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 cursor-pointer"
        onClick={() => onSelectProperty(property)}
      >
        <img
          src={property.images[0]}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle Status Label */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 px-2.5 py-1 text-[11px] font-semibold text-amber-300 tracking-wide rounded">
          {getPurposeLabel(property.purpose)}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-red-500/90 text-white' : 'bg-slate-950/70 text-slate-300 hover:text-white'
          }`}
          title={isFavorite ? t.favorited : t.favorite}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Image count indicator if multiple */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded">
            1 / {property.images.length}
          </div>
        )}
      </div>

      {/* Content Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location row */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer font-display line-clamp-1"
          >
            {title}
          </h3>

          {/* Clean unboxed metadata with dot separators */}
          <div className="mt-3 flex items-center gap-2.5 text-xs text-slate-300">
            {property.bedrooms > 0 && (
              <>
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tabular-nums font-medium">{property.bedrooms}</span>
                  <span className="text-slate-400">{t.beds}</span>
                </div>
                <span aria-hidden="true" className="text-slate-600">·</span>
              </>
            )}

            {property.bathrooms > 0 && (
              <>
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tabular-nums font-medium">{property.bathrooms}</span>
                  <span className="text-slate-400">{t.baths}</span>
                </div>
                <span aria-hidden="true" className="text-slate-600">·</span>
              </>
            )}

            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums font-medium">{property.areaSqm}</span>
              <span className="text-slate-400">{t.sqm}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">{t.filterPrice}</div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-display tabular-nums">
              {formattedPrice}
              {property.purpose === 'rent' && <span className="text-[11px] text-slate-400 font-normal"> / mo</span>}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-lg transition-colors flex items-center gap-1"
              title="Chat on WhatsApp about this property"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat on WhatsApp</span>
            </a>
            <button
              onClick={() => onSelectProperty(property)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700/60"
            >
              {t.propertyDetails}
            </button>
            <button
              onClick={() => onBookTour(property)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm flex items-center gap-1"
              title={t.ctaBookTour}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.ctaBookTour}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
