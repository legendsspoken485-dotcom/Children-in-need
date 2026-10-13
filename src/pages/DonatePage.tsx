import React, { useState } from 'react';
import { Heart, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Printer } from 'lucide-react';
import { CAUSES_DATA } from '../data/causes';
import { DEMO_CAMPAIGNS } from '../data/campaigns';
import { Logo } from '../components/Logo';
import { DonationSubmission } from '../types';

interface DonatePageProps {
  initialCauseId?: string;
  initialCampaignId?: string;
  onNavigateHome: () => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({
  initialCauseId,
  initialCampaignId,
  onNavigateHome
}) => {
  const [selectedFund, setSelectedFund] = useState<string>(
    initialCampaignId
      ? `campaign:${initialCampaignId}`
      : initialCauseId
      ? `cause:${initialCauseId}`
      : 'general'
  );

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'>('USD');
  const [coverFees, setCoverFees] = useState<boolean>(true);

  // Donor form
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [dedication, setDedication] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank_transfer'>('card');

  // State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<{
    referenceId: string;
    timestamp: string;
    details: DonationSubmission;
    feeAmount: number;
    totalAmount: number;
  } | null>(null);

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'AU$'
  };

  const presetAmounts = [25, 50, 100, 250, 500];

  const getImpactDescription = (val: number) => {
    if (val < 30) return 'Provides a child with a comprehensive school learning pack and reading supplies.';
    if (val < 75) return 'Supplies two weeks of warm, balanced daily lunches for two school learners.';
    if (val < 150) return 'Covers emergency pediatric medical visits, diagnostic checks, and essential prescriptions.';
    if (val < 350) return 'Funds winter heating subsidies and family-preservation care kits for a kinship household.';
    return 'Provides long-term community water point rehabilitation and comprehensive child safeguarding support.';
  };

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const estimatedFee = coverFees ? Math.round(finalAmount * 0.029 * 100) / 100 : 0;
  const totalCharged = finalAmount + estimatedFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!finalAmount || finalAmount < 5) {
      errs.amount = 'Minimum contribution amount is $5.';
    }
    if (!donorName.trim()) {
      errs.donorName = 'Please enter your full name.';
    }
    if (!donorEmail.trim()) {
      errs.donorEmail = 'Please provide an email address for donation receipts.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      errs.donorEmail = 'Please provide a valid email format.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSimulating(true);

    // Simulate reliable provider handshake and idempotency verification
    setTimeout(() => {
      setIsSimulating(false);
      const generatedRef = `DEMO-HB-${Date.now().toString().slice(-6)}`;
      setCompletedReceipt({
        referenceId: generatedRef,
        timestamp: new Date().toLocaleString(),
        details: {
          campaignId: selectedFund.startsWith('campaign:') ? selectedFund.split(':')[1] : undefined,
          campaignTitle: getSelectedFundLabel(),
          frequency,
          amount: finalAmount,
          currency,
          coverFees,
          donorName,
          donorEmail,
          dedication,
          paymentMethod
        },
        feeAmount: estimatedFee,
        totalAmount: totalCharged
      });
    }, 1200);
  };

  const getSelectedFundLabel = () => {
    if (selectedFund === 'general') return "General Children's Fund (Where needed most)";
    if (selectedFund.startsWith('cause:')) {
      const cId = selectedFund.replace('cause:', '');
      const cause = CAUSES_DATA.find((c) => c.id === cId);
      return cause ? `Priority Cause: ${cause.title}` : 'Selected Cause';
    }
    if (selectedFund.startsWith('campaign:')) {
      const campId = selectedFund.replace('campaign:', '');
      const camp = DEMO_CAMPAIGNS.find((c) => c.id === campId);
      return camp ? `Staged Campaign: ${camp.title}` : 'Selected Campaign';
    }
    return "General Children's Fund";
  };

  if (completedReceipt) {
    return (
      <div className="bg-[#FCFAF7] min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-8 sm:p-10">
            {/* HOPEBRIDGE Brand Header */}
            <div className="flex justify-center mb-6 pb-6 border-b border-stone-100">
              <Logo size="md" showTagline={true} />
            </div>

            {/* Simulation Confirmation Banner */}
            <div className="text-center pb-6 border-b border-stone-200">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 block mb-1">
                Demonstration Verification Complete
              </span>
              <h1 className="text-2xl font-serif font-bold text-stone-900">
                Simulated Contribution Recorded
              </h1>
              <p className="text-stone-600 text-sm mt-2">
                Thank you for reviewing the HOPEBRIDGE donation flow.
              </p>
            </div>

            {/* Crucial Transparency Notice */}
            <div className="my-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-semibold">Important Staging Disclosure:</strong>
                <span>
                  No real financial charge occurred. Payment provider gateway credentials are not yet configured for production transactions. No card details were stored.
                </span>
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/90 text-sm space-y-3 font-sans">
              <div className="flex justify-between text-stone-500 text-xs pb-2 border-b border-stone-200">
                <span>Reference Code:</span>
                <span className="font-mono font-bold text-stone-800">{completedReceipt.referenceId}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Fund Destination:</span>
                <span className="font-semibold text-right max-w-xs">{completedReceipt.details.campaignTitle}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Frequency:</span>
                <span className="capitalize">{completedReceipt.details.frequency}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Donor Name:</span>
                <span>{completedReceipt.details.donorName}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Email Confirmation:</span>
                <span>{completedReceipt.details.donorEmail}</span>
              </div>
              {completedReceipt.details.dedication && (
                <div className="flex justify-between text-stone-700">
                  <span>Dedication:</span>
                  <span className="italic">"{completedReceipt.details.dedication}"</span>
                </div>
              )}
              <div className="pt-3 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-base">
                <span>Simulated Total:</span>
                <span className="tabular-nums">
                  {currencySymbols[completedReceipt.details.currency]}
                  {completedReceipt.totalAmount.toFixed(2)} {completedReceipt.details.currency}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-semibold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Simulation Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompletedReceipt(null);
                  setCustomAmount('');
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-sm font-semibold cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Test Another Contribution</span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={onNavigateHome}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transparent Staging Alert */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold block text-amber-950">Demonstration Donation Journey (Staging Mode)</strong>
            Real financial processing requires an authenticated live merchant provider (e.g. Stripe, PayPal) with verified organizational status. In this preview build, no actual cards are charged, and you can test the complete, accessible donation verification flow safely.
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
            Support HOPEBRIDGE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Make a Life-Changing Gift for Children
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Your support delivers clean water, nutritious meals, emergency shelter, learning materials, and healthcare to children living in crisis.
          </p>
        </div>

        {/* Main Donation Journey Card with Glassmorphism */}
        <form
          onSubmit={handleSimulateDonation}
          className="glass-panel rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl"
        >
          {/* Step 1: Fund Selection */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              1. Choose a Fund or Staged Campaign
            </label>
            <div className="relative">
              <select
                value={selectedFund}
                onChange={(e) => setSelectedFund(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300/80 bg-white/90 text-stone-900 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 cursor-pointer shadow-2xs transition-all"
              >
                <option value="general">
                  🌟 General Children’s Fund (Allocated where need is highest)
                </option>
                <optgroup label="Our 6 Core Causes">
                  {CAUSES_DATA.map((c) => (
                    <option key={`cause:${c.id}`} value={`cause:${c.id}`}>
                      Priority Cause: {c.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Staged Demonstration Campaigns">
                  {DEMO_CAMPAIGNS.map((camp) => (
                    <option key={`campaign:${camp.id}`} value={`campaign:${camp.id}`}>
                      Initiative: {camp.title} ({camp.country})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Step 2: Frequency Selector (Interactive Glass Tabs) */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              2. Donation Frequency
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100/80 rounded-xl border border-stone-200/50">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  frequency === 'one-time'
                    ? 'bg-white text-stone-900 shadow-sm scale-[1.01]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-white text-stone-900 shadow-sm scale-[1.01]'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Monthly Sustainer (Recurring)
              </button>
            </div>
          </div>

          {/* Step 3: Contribution Amount with Animated Selectors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-stone-900">
                3. Select Contribution Amount
              </label>
              {/* Currency Picker */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span>Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="px-2 py-1 text-xs rounded-lg border border-stone-300/80 bg-white/90 text-stone-800"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (CA$)</option>
                  <option value="AUD">AUD (AU$)</option>
                </select>
              </div>
            </div>

            {/* Presets with Distinct Animation on Click */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
              {presetAmounts.map((preset) => {
                const isSelected = !customAmount && amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount('');
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                    }}
                    className={`py-3 text-sm font-bold rounded-xl border transition-all duration-200 cursor-pointer tabular-nums active:scale-95 ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/90 text-rose-700 ring-2 ring-rose-500 shadow-sm scale-[1.02]'
                        : 'border-stone-200/80 bg-white/80 text-stone-700 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    {currencySymbols[currency]}{preset}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input with Animated Floating Focus */}
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-stone-500">
                {currencySymbols[currency]}
              </span>
              <input
                type="number"
                min="5"
                step="1"
                placeholder="Or enter custom amount (e.g. 75)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border transition-all ${
                  customAmount
                    ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-500/20'
                    : 'border-stone-300/80 bg-white/80'
                } focus:ring-2 focus:ring-rose-500 focus:bg-white`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-600 mt-1.5 animate-modal-in">{errors.amount}</p>
            )}

            {/* Real Impact Note in Glass Container */}
            <div className="mt-3 p-3.5 rounded-xl glass-card text-xs text-stone-700 flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 fill-rose-500/20" />
              <span>
                <strong>Your Impact:</strong> {getImpactDescription(finalAmount)}
              </span>
            </div>
          </div>

          {/* Optional Fee Coverage with Animated Checkbox */}
          <div className="p-4 rounded-xl glass-card flex items-start gap-3 transition-colors hover:border-rose-200">
            <input
              id="cover-fees"
              type="checkbox"
              checked={coverFees}
              onChange={(e) => setCoverFees(e.target.checked)}
              className="mt-1 h-4 w-4 rounded-md border-stone-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
            />
            <label htmlFor="cover-fees" className="text-xs text-stone-700 cursor-pointer">
              <span className="font-semibold block text-stone-900">
                Cover transaction processing fees (+{currencySymbols[currency]}{estimatedFee.toFixed(2)})
              </span>
              100% of your intended contribution directly supports child welfare programs while covering merchant processing overhead.
            </label>
          </div>

          {/* Step 4: Donor Information */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              4. Donor Information & Receipt Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={donorName}
                  onChange={(e) => {
                    setDonorName(e.target.value);
                    if (errors.donorName) setErrors((prev) => ({ ...prev, donorName: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                />
                {errors.donorName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.donorName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="sarah@example.com"
                  value={donorEmail}
                  onChange={(e) => {
                    setDonorEmail(e.target.value);
                    if (errors.donorEmail) setErrors((prev) => ({ ...prev, donorEmail: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                />
                {errors.donorEmail && (
                  <p className="text-xs text-rose-600 mt-1">{errors.donorEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Dedication or Personal Note (Optional)
              </label>
              <input
                type="text"
                placeholder="In honor of someone special, or a note of encouragement..."
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Step 5: Payment Gateway Simulation Option */}
          <div className="pt-2 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-2">
              5. Simulated Gateway Channel
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'paypal', label: 'Digital Wallet / PayPal' },
                { id: 'bank_transfer', label: 'Direct Bank Wire' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                    paymentMethod === m.id
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review & Proceed */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between text-base font-bold text-stone-900">
              <span>Total Simulated Contribution:</span>
              <span className="text-xl font-bold text-rose-600 tabular-nums">
                {currencySymbols[currency]}{totalCharged.toFixed(2)} {currency}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying Staging Transaction...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white/20" />
                  <span>Complete Simulated Donation</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>TLS 1.3 Encrypted Handshake · Zero Raw Card Storage · Staging Sandbox</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
