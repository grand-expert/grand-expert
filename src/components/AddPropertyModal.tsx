import React, { useState } from 'react';
import { Property, Language } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import { X, PlusCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface AddPropertyModalProps {
  lang: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  lang,
  onClose,
  onSuccess,
}) => {
  const t = translations[lang];

  const [titleSo, setTitleSo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [price, setPrice] = useState(350000);
  const [purpose, setPurpose] = useState<Property['purpose']>('sale');
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('villa');
  const [city, setCity] = useState('Mogadishu');
  const [neighborhood, setNeighborhood] = useState('Liido Beachfront');
  const [bedrooms, setBedrooms] = useState(4);
  const [bathrooms, setBathrooms] = useState(4);
  const [areaSqm, setAreaSqm] = useState(380);
  const [descriptionSo, setDescriptionSo] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [selectedImage, setSelectedImage] = useState('/src/assets/images/hero_grand_export_estate_1794132036523.jpg');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const presetImages = [
    { label: 'Coastal Villa & Pool', url: '/src/assets/images/hero_grand_export_estate_1794132036523.jpg' },
    { label: 'Modern Luxury Villa', url: '/src/assets/images/property_modern_villa_1794132038393.jpg' },
    { label: 'Seaside Penthouse', url: '/src/assets/images/property_seaside_penthouse_1794132038189.jpg' },
    { label: 'Commercial Glass Tower', url: '/src/assets/images/property_commercial_tower_1794132038854.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = customImageUrl.trim() || selectedImage;

    RealEstateDB.saveProperty({
      title: titleEn.trim() || titleSo.trim(),
      titleSo: titleSo.trim() || titleEn.trim(),
      price: Number(price),
      purpose,
      propertyType,
      location: {
        city,
        neighborhood,
        country: city === 'Dubai' ? 'UAE' : city === 'Nairobi' ? 'Kenya' : city === 'Hargeisa' ? 'Somaliland' : 'Somalia',
        lat: city === 'Mogadishu' ? 2.04 : city === 'Hargeisa' ? 9.56 : city === 'Dubai' ? 25.08 : -1.29,
        lng: city === 'Mogadishu' ? 45.34 : city === 'Hargeisa' ? 44.07 : city === 'Dubai' ? 55.14 : 36.78,
        address: `${neighborhood}, ${city}`,
      },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqm: Number(areaSqm),
      featured: true,
      isNew: true,
      yearBuilt: 2026,
      parkingSpots: 2,
      images: [finalImage],
      description: descriptionEn.trim() || 'Prime verified property listed through Grand-Export Real Estate.',
      descriptionSo: descriptionSo.trim() || 'Hanti cusub oo diiwaangashan oo lagu daray Grand-Export Real Estate.',
      amenities: ['Verified Title Deed', '24/7 Security', 'Borehole / Water Supply', 'Backup Generator', 'High-Speed Fiber'],
      amenitiesSo: ['Shahaado Lahaansho Xaqiijisan', 'Ilaalo 24/7', 'Biyo & Koronto', 'Matoor Joogto ah', 'Khadka Xawaaraha Sare'],
      agent: {
        name: 'Grand-Export Registry Team',
        role: 'Verified Property Manager',
        roleSo: 'Maamulaha Hantida Diiwaangashan',
        phone: '+252 61 555 8920',
        email: 'listings@grandexport.so',
        whatsapp: '252615558920',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
    });

    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d131f]/95">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              {t.addPropertyModalTitle}
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
        <div className="overflow-y-auto p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">
                {t.propertyAddedSuccess}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'so' ? 'Gurigaaga waxaa lagu daray diiwaanka tooska ah!' : 'Your listing is now live in the directory!'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propTitleInput} *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleSo}
                    onChange={(e) => setTitleSo(e.target.value)}
                    placeholder="tusaale: Filo Casri ah oo Wadajir ku taal"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propTitleInputEn}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Modern Executive Villa in Wadajir"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propPriceInput} *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propPurposeSelect}
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as Property['purpose'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="sale">{t.purposeSale}</option>
                    <option value="rent">{t.purposeRent}</option>
                    <option value="off-plan">{t.purposeOffPlan}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propTypeSelect}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as Property['propertyType'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="villa">{t.typeVilla}</option>
                    <option value="apartment">{t.typeApartment}</option>
                    <option value="penthouse">{t.typePenthouse}</option>
                    <option value="commercial">{t.typeCommercial}</option>
                    <option value="land">{t.typeLand}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propCityInput}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Mogadishu">Muqdisho (Mogadishu)</option>
                    <option value="Hargeisa">Hargeysa (Hargeisa)</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="Nairobi">Nairobi (Kenya)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propNeighborhoodInput} *
                  </label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Liido, Hodan, KM4, Airport Rd"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propBedsInput}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propBathsInput}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.propAreaInput}
                  </label>
                  <input
                    type="number"
                    min={20}
                    value={areaSqm}
                    onChange={(e) => setAreaSqm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>{t.propImageUrlInput}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {presetImages.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setCustomImageUrl('');
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-slate-900 ${
                        selectedImage === preset.url && !customImageUrl
                          ? 'border-amber-400 ring-2 ring-amber-400/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} referrerPolicy="no-referrer" className="w-full h-16 object-cover rounded" />
                      <div className="text-[10px] text-slate-300 text-center py-1 truncate">{preset.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.propDescInput}
                </label>
                <textarea
                  rows={3}
                  value={descriptionSo}
                  onChange={(e) => setDescriptionSo(e.target.value)}
                  placeholder="Sharaxaad kooban oo ku saabsan guriga, adeegyada, iyo sharciyadiisa..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
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
                  {t.submitPropertyBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
