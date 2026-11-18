import React, { useState } from 'react';
import { Language, Currency } from '../types/realEstate';
import { translations } from '../locales/dictionary';
import { RealEstateDB } from '../services/db';
import { X, Calculator, PieChart, Info, DollarSign } from 'lucide-react';

interface MortgageCalculatorModalProps {
  lang: Language;
  currency: Currency;
  onClose: () => void;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  lang,
  currency,
  onClose,
}) => {
  const t = translations[lang];

  const [price, setPrice] = useState(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termYears, setTermYears] = useState(10);
  const [annualRate, setAnnualRate] = useState(6.0);

  const downPaymentAmount = (price * downPaymentPercent) / 100;
  const principal = price - downPaymentAmount;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  // Monthly payment formula: M = P * (r*(1+r)^n) / ((1+r)^n - 1)
  const monthlyPayment =
    monthlyRate > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : principal / totalMonths;

  const totalPayment = monthlyPayment * totalMonths + downPaymentAmount;
  const totalProfitOrInterest = totalPayment - price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d131f]/95">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              {t.calculatorTitle}
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
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-400">
            {t.calculatorSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.calcPrice}
                </label>
                <input
                  type="number"
                  step="5000"
                  value={price}
                  onChange={(e) => setPrice(Math.max(10000, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>{t.calcDownPayment} ({downPaymentPercent}%)</span>
                  <span className="font-mono text-amber-400">
                    {RealEstateDB.formatPrice(downPaymentAmount, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>{t.calcTenure}</span>
                  <span className="font-mono text-amber-400">{termYears} {lang === 'so' ? 'Sano' : 'Years'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>{t.calcRate}</span>
                  <span className="font-mono text-amber-400">{annualRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="12.0"
                  step="0.5"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculations Breakdown Card */}
            <div className="bg-[#080d16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  {lang === 'so' ? 'Qiyaasta Bixinta' : 'Repayment Projection'}
                </span>

                <div className="mt-3">
                  <span className="text-xs text-slate-400">{t.calcMonthlyPay}</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display tabular-nums mt-0.5">
                    {RealEstateDB.formatPrice(Math.round(monthlyPayment), currency)}
                    <span className="text-xs text-slate-400 font-normal"> / bishii</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-300">
                    <span>{t.calcPrincipal}:</span>
                    <span className="font-mono tabular-nums text-white">
                      {RealEstateDB.formatPrice(Math.round(principal), currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{lang === 'so' ? 'Faa\'iidada Dheeraadka ah' : 'Total Financing Margin'}:</span>
                    <span className="font-mono tabular-nums text-amber-300">
                      +{RealEstateDB.formatPrice(Math.round(totalProfitOrInterest), currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold border-t border-slate-800/80 pt-2">
                    <span>{t.calcTotalPayment}:</span>
                    <span className="font-mono tabular-nums text-white">
                      {RealEstateDB.formatPrice(Math.round(totalPayment), currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{t.calcSummary}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
