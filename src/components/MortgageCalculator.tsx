import React, { useState, useEffect } from 'react';
import { Currency, Language } from '../types/realEstate';
import { RealEstateDB } from '../services/db';
import { Calculator, RotateCcw } from 'lucide-react';

interface MortgageCalculatorProps {
  propertyPrice: number;
  currency: Currency;
  lang: Language;
  purpose?: 'sale' | 'rent' | 'off-plan';
}

const TERM_PRESETS = [5, 10, 15, 20, 30];
const DOWN_PAYMENT_PRESETS = [10, 20, 30];

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice,
  currency,
  lang,
  purpose = 'sale',
}) => {
  const defaultPrice = propertyPrice > 0 ? propertyPrice : 250000;

  const [price, setPrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(15);
  const [annualRate, setAnnualRate] = useState<number>(6.0);

  useEffect(() => {
    setPrice(propertyPrice > 0 ? propertyPrice : 250000);
  }, [propertyPrice]);

  const safePrice = Number.isFinite(price) && price > 0 ? price : 0;
  const clampedDownPct = Math.min(90, Math.max(0, Number.isFinite(downPaymentPercent) ? downPaymentPercent : 0));
  const clampedYears = Math.min(40, Math.max(1, Number.isFinite(termYears) ? termYears : 1));
  const clampedRate = Math.min(30, Math.max(0, Number.isFinite(annualRate) ? annualRate : 0));

  const downPaymentAmount = (safePrice * clampedDownPct) / 100;
  const principal = Math.max(0, safePrice - downPaymentAmount);
  const totalMonths = clampedYears * 12;
  const monthlyRate = clampedRate / 100 / 12;

  const monthlyPayment =
    principal === 0
      ? 0
      : monthlyRate > 0
        ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : principal / totalMonths;

  const totalLoanRepayment = monthlyPayment * totalMonths;
  const totalInterest = Math.max(0, totalLoanRepayment - principal);
  const totalOutlay = totalLoanRepayment + downPaymentAmount;
  const principalSharePct = totalLoanRepayment > 0 ? (principal / totalLoanRepayment) * 100 : 100;

  const handleReset = () => {
    setPrice(defaultPrice);
    setDownPaymentPercent(20);
    setTermYears(15);
    setAnnualRate(6.0);
  };

  const labels =
    lang === 'so'
      ? {
          title: 'Xisaabiyaha Deynta & Billeedka (Mortgage)',
          subtitle: 'Qiyaas lacagta bil kasta adigoo beddelaya muddada deynta iyo dulsaarka.',
          rentNotice: 'Hantidan waa kiro — waxaad ku beddeli kartaa qiimaha iibka hoose si aad u xisaabiso maalgelinta.',
          reset: 'Dib u deji',
          propertyValue: 'Qiimaha Hantida ($ USD)',
          downPayment: 'Lacagta Hore (Down Payment)',
          loanTerm: 'Muddada Deynta',
          years: 'Sano',
          months: 'bilood',
          interestRate: 'Dulsaarka Sanadlaha (%)',
          monthlyEstimate: 'Qiyaasta Billeedka ah',
          perMonth: '/ bishii',
          loanAmount: 'Lacagta la maalgelinayo',
          totalInterest: 'Wadarta Dulsaarka',
          totalCost: 'Wadarta Guud ee Bixinta',
          principalShare: 'Asalka Deynta',
          interestShare: 'Dulsaarka',
          disclaimer: 'Qiyaastaani waa mid hordhac ah (amaah & faa’iido); khidmadaha canshuurta iyo caymiska kuma jiraan.',
        }
      : {
          title: 'Mortgage Calculator',
          subtitle: 'Estimate monthly payments by adjusting down payment, loan term, and interest rate.',
          rentNotice: 'Listed for rent — adjust the purchase valuation below to model financing.',
          reset: 'Reset',
          propertyValue: 'Property Price ($ USD)',
          downPayment: 'Down Payment',
          loanTerm: 'Loan Term',
          years: 'Years',
          months: 'months',
          interestRate: 'Interest Rate (Annual %)',
          monthlyEstimate: 'Estimated Monthly Payment',
          perMonth: '/ month',
          loanAmount: 'Loan Principal',
          totalInterest: 'Total Interest',
          totalCost: 'Total Cost (incl. Down Payment)',
          principalShare: 'Principal',
          interestShare: 'Interest',
          disclaimer: 'Estimates are for planning purposes only and exclude property taxes, insurance, and closing fees.',
        };

  return (
    <section
      aria-label={labels.title}
      className="bg-[#0a0f19] border border-slate-800 rounded-xl p-5 space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{labels.title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">{labels.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{labels.reset}</span>
        </button>
      </div>

      {purpose === 'rent' && (
        <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          {labels.rentNotice}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="space-y-4 text-xs">
          {/* Property Price */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="mortgage-prop-price" className="text-slate-300 font-medium">
                {labels.propertyValue}
              </label>
              <span className="text-slate-400 tabular-nums">
                {RealEstateDB.formatPrice(Math.round(safePrice), currency)}
              </span>
            </div>
            <input
              id="mortgage-prop-price"
              type="number"
              min="1000"
              step="5000"
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono tabular-nums focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="mortgage-down-pct" className="text-slate-300 font-medium">
                {labels.downPayment} ({clampedDownPct}%)
              </label>
              <span className="font-mono tabular-nums text-amber-400 font-semibold">
                {RealEstateDB.formatPrice(Math.round(downPaymentAmount), currency)}
              </span>
            </div>
            <input
              id="mortgage-down-pct"
              type="range"
              min="0"
              max="60"
              step="5"
              value={clampedDownPct}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex items-center gap-1.5 mt-2">
              {DOWN_PAYMENT_PRESETS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                    clampedDownPct === pct
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="mortgage-term-years" className="text-slate-300 font-medium">
                {labels.loanTerm}
              </label>
              <span className="font-mono tabular-nums text-amber-400 font-semibold">
                {clampedYears} {labels.years} ({totalMonths} {labels.months})
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {TERM_PRESETS.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTermYears(yr)}
                  className={`py-1.5 px-2 rounded-md text-xs font-medium tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                    clampedYears === yr
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {yr}y
                </button>
              ))}
            </div>
            <input
              id="mortgage-term-years"
              type="range"
              min="1"
              max="35"
              step="1"
              value={clampedYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="mortgage-interest-rate" className="text-slate-300 font-medium">
                {labels.interestRate}
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="mortgage-interest-rate"
                  type="number"
                  min="0"
                  max="30"
                  step="0.25"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Math.min(30, Math.max(0, Number(e.target.value))))}
                  aria-label={labels.interestRate}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-right text-amber-400 font-mono tabular-nums text-xs focus:outline-none focus:border-amber-400"
                />
                <span className="text-slate-400 font-mono">%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.25"
              value={Math.min(15, clampedRate)}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              aria-label="Interest rate slider"
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Summary Output Column */}
        <div className="bg-[#0d131f] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-slate-400">{labels.monthlyEstimate}</span>
              <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                <span
                  data-testid="mortgage-monthly-payment"
                  className="text-2xl sm:text-3xl font-black text-amber-400 font-display tabular-nums tracking-tight"
                >
                  {RealEstateDB.formatPrice(Math.round(monthlyPayment), currency)}
                </span>
                <span className="text-xs text-slate-400">{labels.perMonth}</span>
              </div>
            </div>

            {/* Principal vs Interest Visual Bar */}
            <div>
              <progress
                value={Math.round(Math.min(100, Math.max(0, principalSharePct)))}
                max={100}
                aria-label={`${labels.principalShare} vs ${labels.interestShare}`}
                className="w-full h-2 rounded-full overflow-hidden bg-slate-700 [&::-webkit-progress-bar]:bg-slate-700 [&::-webkit-progress-value]:bg-amber-400 [&::-moz-progress-bar]:bg-amber-400"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 tabular-nums">
                <span>
                  {labels.principalShare}: {principalSharePct.toFixed(0)}%
                </span>
                <span>
                  {labels.interestShare}: {(100 - principalSharePct).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Numeric Breakdown */}
            <div className="space-y-2.5 text-xs border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between gap-2 text-slate-300">
                <span>{labels.loanAmount}</span>
                <span className="font-mono tabular-nums text-white font-medium">
                  {RealEstateDB.formatPrice(Math.round(principal), currency)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-300">
                <span>{labels.totalInterest}</span>
                <span className="font-mono tabular-nums text-amber-300 font-medium">
                  +{RealEstateDB.formatPrice(Math.round(totalInterest), currency)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-slate-100 font-bold border-t border-slate-800 pt-2.5">
                <span>{labels.totalCost}</span>
                <span className="font-mono tabular-nums text-white">
                  {RealEstateDB.formatPrice(Math.round(totalOutlay), currency)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
            {labels.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};
