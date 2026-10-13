import React from 'react';
import { ShieldCheck, Lock, FileText, ArrowLeft, Mail } from 'lucide-react';
import { PageId } from '../types';

interface PolicyPageProps {
  initialPolicy: 'safeguarding' | 'privacy' | 'donation-terms';
  onNavigateHome: () => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
  initialPolicy,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = React.useState<'safeguarding' | 'privacy' | 'donation-terms'>(
    initialPolicy
  );

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to HOPEBRIDGE Home</span>
          </button>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
            Governance & Legal Policies
          </span>
        </div>

        {/* Tab Selector (Glass Segmented Controls) */}
        <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1.5 mb-8 overflow-x-auto shadow-sm">
          <button
            onClick={() => setActiveTab('safeguarding')}
            className={`flex-1 min-w-[180px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'safeguarding'
                ? 'bg-stone-900 text-white shadow-xs scale-[1.01]'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>Child Safeguarding Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 min-w-[180px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-stone-900 text-white shadow-xs scale-[1.01]'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Lock className="w-4 h-4 text-teal-400" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('donation-terms')}
            className={`flex-1 min-w-[180px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'donation-terms'
                ? 'bg-stone-900 text-white shadow-xs scale-[1.01]'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Donation Terms & Conditions</span>
          </button>
        </div>

        {/* Policy Content Container with Glass Panel */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-xl border border-white/80 animate-modal-in">
          {activeTab === 'safeguarding' && (
            <div className="prose prose-stone max-w-none text-stone-700 text-sm leading-relaxed space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
                  Official Standard
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-3">
                  HOPEBRIDGE Child Safeguarding Policy
                </h1>
                <p className="text-xs text-stone-500">
                  Last updated: October 2026 · Governing Document Ref: HB-CSP-01
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Mandatory Reporting Channel:</strong> Any suspected harm, physical mistreatment, or breach of safeguarding must be reported immediately to{' '}
                  <a href="mailto:safeguarding@hopebridge.org" className="underline font-bold">
                    safeguarding@hopebridge.org
                  </a>
                  . Reports are treated confidentially and investigated without delay.
                </div>
              </div>

              <h3 className="text-base font-bold text-stone-900 pt-2">1. Core Commitment to Children</h3>
              <p>
                HOPEBRIDGE maintains an absolute zero-tolerance commitment against child abuse, neglect, exploitation, trafficking, and discrimination. We believe that every child has the fundamental right to be protected from all forms of physical and emotional harm, in accordance with the United Nations Convention on the Rights of the Child (UNCRC).
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">2. Digital Media & Privacy Standards</h3>
              <p>
                To protect child beneficiaries and prevent unauthorized profiling:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                <li>We do not publish identifiable home addresses, shelter locations, full legal names, or medical records.</li>
                <li>We do not create public browseable directories of individual children for sponsorship or direct messaging.</li>
                <li>We strictly prohibit unmonitored or private donor-to-child communication across all online and offline platforms.</li>
                <li>Images used in organizational media must be dignified, respectful, and taken with informed consent. We ban imagery depicting distressing suffering or vulnerability for emotional fundraising appeal.</li>
              </ul>

              <h3 className="text-base font-bold text-stone-900 pt-2">3. Safe Recruitment & Field Staff</h3>
              <p>
                All representatives, contractors, volunteers, and implementing partner staff with access to children must undergo comprehensive background checks, verification of references, and mandatory annual child protection training before deployment.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">4. Alternative Care Standards</h3>
              <p>
                HOPEBRIDGE actively supports family preservation, kinship care, and community-based foster care. We do not fund or support unaccredited institutional orphanages or commercial orphanage-tourism initiatives.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="prose prose-stone max-w-none text-stone-700 text-sm leading-relaxed space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-teal-700 font-bold block mb-1">
                  Information Security
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-3">
                  HOPEBRIDGE Privacy Policy
                </h1>
                <p className="text-xs text-stone-500">
                  Last updated: October 2026 · Governing Document Ref: HB-PRIV-01
                </p>
              </div>

              <h3 className="text-base font-bold text-stone-900 pt-2">1. Protection of Children’s Information</h3>
              <p>
                HOPEBRIDGE does not collect personal data from children via this website. We do not allow minors under 16 to submit personal data without verified parental or legal guardian consent. No identifiable child beneficiary records are stored in browser local storage, public web cookies, or client-side telemetry.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">2. Donor & Visitor Information</h3>
              <p>
                When you interact with our website to make an inquiry, submit a volunteer application, or test a donation journey, we collect only the necessary contact details provided by you (such as name, email address, and voluntary message content).
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">3. Zero Selling or Trading of Data</h3>
              <p>
                We do not sell, rent, commercialize, or trade donor lists or email addresses to commercial marketers or external fundraising agencies.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">4. Payment Credentials Security</h3>
              <p>
                HOPEBRIDGE does not capture or store raw credit card numbers or CVV codes on our servers. When live payment gateways are enabled, all financial processing is conducted through authorized, PCI-DSS Level 1 certified third-party merchant processors via TLS 1.3 encryption.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">5. Inquiries & Data Rights</h3>
              <p>
                You may request access to, correction of, or deletion of your contact records at any time by contacting{' '}
                <a href="mailto:privacy@hopebridge.org" className="underline font-semibold text-stone-900">
                  privacy@hopebridge.org
                </a>.
              </p>
            </div>
          )}

          {activeTab === 'donation-terms' && (
            <div className="prose prose-stone max-w-none text-stone-700 text-sm leading-relaxed space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1">
                  Charitable Giving Standards
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-3">
                  Donation Terms & Conditions
                </h1>
                <p className="text-xs text-stone-500">
                  Last updated: October 2026 · Governing Document Ref: HB-DON-01
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <strong>Staging Notice:</strong> During this development and review stage, all donation journeys on this site operate in simulated preview mode. No live funds are deducted.
              </div>

              <h3 className="text-base font-bold text-stone-900 pt-2">1. Nature of Charitable Contributions</h3>
              <p>
                Charitable gifts to HOPEBRIDGE are voluntary and irrevocable. Contributions are directed toward programs supporting child protection, emergency nutrition, safe shelter, education, healthcare, and water sanitation.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">2. Fund Allocation & Priority Needs</h3>
              <p>
                While donors may express a preference for a specific cause or regional campaign, HOPEBRIDGE retains administrative discretion to allocate resources to the areas of greatest humanitarian urgency if a specific initiative becomes fully funded or operational conditions change.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">3. Refund Policy</h3>
              <p>
                If a duplicate transaction or clerical error occurs in live production, donors may request a review within 30 days of the transaction date by emailing{' '}
                <a href="mailto:giving@hopebridge.org" className="underline font-semibold text-stone-900">
                  giving@hopebridge.org
                </a>. Verified errors will be refunded to the original payment method.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">4. Tax Receipts & Documentation</h3>
              <p>
                Formal tax receipts are provided once official tax-exempt status in the applicable jurisdiction is confirmed and recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
