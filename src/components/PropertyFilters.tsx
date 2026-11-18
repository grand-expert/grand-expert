import React from 'react';
import { FilterState, Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { LayoutGrid, List, Map, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface PropertyFiltersProps {
  lang: Language;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'grid' | 'list' | 'map';
  setViewMode: (v: 'grid' | 'list' | 'map') => void;
  totalCount: number;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  lang,
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalCount,
}) => {
  const t = translations[lang];

  const handlePurposeChange = (purpose: FilterState['purpose']) => {
    setFilters(prev => ({ ...prev, purpose }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      purpose: 'all',
      propertyType: 'all',
      city: 'all',
      minPrice: 0,
      maxPrice: 2500000,
      bedrooms: 'all',
      sortBy: 'featured',
    });
  };

  return (
    <div className="w-full bg-[#0f1523] border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      {/* Top Row: Purpose Tabs + View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        {/* Purpose Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => handlePurposeChange('all')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filters.purpose === 'all'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.purposeAll}
          </button>
          <button
            onClick={() => handlePurposeChange('sale')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filters.purpose === 'sale'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.purposeSale}
          </button>
          <button
            onClick={() => handlePurposeChange('rent')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filters.purpose === 'rent'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.purposeRent}
          </button>
          <button
            onClick={() => handlePurposeChange('off-plan')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filters.purpose === 'off-plan'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.purposeOffPlan}
          </button>
        </div>

        {/* View Mode Toggle & Counter */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <span className="text-xs sm:text-sm text-slate-400">
            {lang === 'so' ? 'Waxaa la helay' : 'Showing'}{' '}
            <strong className="text-amber-400 font-semibold tabular-nums">{totalCount}</strong>{' '}
            {lang === 'so' ? 'Guri' : 'properties'}
          </span>

          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title={t.viewGrid}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title={t.viewList}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'map' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title={t.viewMap}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Detailed Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {/* City Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            {t.filterCity}
          </label>
          <select
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="w-full bg-slate-900 text-xs sm:text-sm text-slate-200 border border-slate-700/80 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="all">{t.filterAllCities}</option>
            <option value="Mogadishu">Muqdisho (Mogadishu)</option>
            <option value="Hargeisa">Hargeysa (Hargeisa)</option>
            <option value="Dubai">Dubai (UAE)</option>
            <option value="Nairobi">Nairobi (Kenya)</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            {t.propTypeSelect}
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
            className="w-full bg-slate-900 text-xs sm:text-sm text-slate-200 border border-slate-700/80 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="all">{t.typeAll}</option>
            <option value="villa">{t.typeVilla}</option>
            <option value="apartment">{t.typeApartment}</option>
            <option value="penthouse">{t.typePenthouse}</option>
            <option value="commercial">{t.typeCommercial}</option>
            <option value="land">{t.typeLand}</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            {t.filterBedrooms}
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
            className="w-full bg-slate-900 text-xs sm:text-sm text-slate-200 border border-slate-700/80 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="all">{t.filterAnyBeds}</option>
            <option value="1">1+ {t.beds}</option>
            <option value="2">2+ {t.beds}</option>
            <option value="3">3+ {t.beds}</option>
            <option value="4">4+ {t.beds}</option>
            <option value="5">5+ {t.beds}</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            {t.filterSort}
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
            className="w-full bg-slate-900 text-xs sm:text-sm text-slate-200 border border-slate-700/80 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="featured">{t.sortFeatured}</option>
            <option value="price-asc">{t.sortPriceLow}</option>
            <option value="price-desc">{t.sortPriceHigh}</option>
            <option value="newest">{t.sortNewest}</option>
            <option value="area">{t.sortArea}</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full py-2 px-3 text-xs sm:text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
