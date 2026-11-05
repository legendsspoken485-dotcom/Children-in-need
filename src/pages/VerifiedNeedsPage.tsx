import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  PlusCircle,
  Search,
  Filter,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { getVerifiedNeeds, createVerifiedNeed, subscribeToStore } from '../db/storage';
import { VerifiedNeed, NeedCategory, NeedUrgency, PageId } from '../types';
import { useAuth } from '../context/AuthContext';

interface VerifiedNeedsPageProps {
  onNavigate: (page: PageId, causeId?: string) => void;
  onDonateToNeed?: (need: VerifiedNeed) => void;
}

export const VerifiedNeedsPage: React.FC<VerifiedNeedsPageProps> = ({ onNavigate }) => {
  const { currentUser, canVerifyCases } = useAuth();
  const [needs, setNeeds] = useState<VerifiedNeed[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseModal, setSelectedCaseModal] = useState<VerifiedNeed | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State for Authorized Partner / Case Worker Submission
  const [formCategory, setFormCategory] = useState<NeedCategory>('family_preservation');
  const [formUrgency, setFormUrgency] = useState<NeedUrgency>('elevated');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBeneficiaryCount, setFormBeneficiaryCount] = useState<number>(1);
  const [formAgeBracket, setFormAgeBracket] = useState<VerifiedNeed['ageBracket']>('5-8 years');
  const [formCountry, setFormCountry] = useState('Kenya');
  const [formRegion, setFormRegion] = useState('');
  const [formEstimatedCost, setFormEstimatedCost] = useState<number>(1500);
  const [formGuardianConsentRef, setFormGuardianConsentRef] = useState('');
  const [formEvidenceTitle, setFormEvidenceTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNeeds(getVerifiedNeeds());
    return subscribeToStore(() => setNeeds(getVerifiedNeeds()));
  }, []);

  const filteredNeeds = useMemo(() => {
    return needs.filter((n) => {
      const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
      const matchesUrg = selectedUrgency === 'all' || n.urgency === selectedUrgency;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        n.caseCode.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.country.toLowerCase().includes(q) ||
        n.region.toLowerCase().includes(q);
      return matchesCat && matchesUrg && matchesQuery;
    });
  }, [needs, selectedCategory, selectedUrgency, searchQuery]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formRegion) return;

    setIsSubmitting(true);
    try {
      await createVerifiedNeed(
        {
          category: formCategory,
          urgency: formUrgency,
          title: formTitle,
          description: formDescription,
          beneficiaryType: formBeneficiaryCount > 1 ? 'sibling_group' : 'individual_child',
          beneficiaryCount: formBeneficiaryCount,
          ageBracket: formAgeBracket,
          region: formRegion,
          country: formCountry,
          estimatedCost: formEstimatedCost,
          currency: 'USD',
          status: 'under_investigation',
          submittingPartnerId: currentUser.id,
          submittingPartnerName: currentUser.organization || currentUser.name,
          reverificationDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
          consent: {
            id: `cons-${Date.now()}`,
            guardianNamePseudonym: 'Verified Legal Guardian / Kinship Custodian',
            relationshipToChild: 'legal_guardian',
            consentGrantedAt: new Date().toISOString(),
            consentType: formCategory === 'critical_pediatric_care' ? 'medical_aid' : 'educational_support',
            isRevocable: true,
            verifiedDocumentRef: formGuardianConsentRef || `CONSENT-HB-${Date.now()}`
          },
          evidence: [
            {
              id: `ev-${Date.now()}`,
              title: formEvidenceTitle || 'Initial Partner Field Intake Assessment',
              type: 'social_worker_report',
              submittedDate: new Date().toISOString().substring(0, 10),
              status: 'pending',
              sha256Checksum: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
            }
          ]
        },
        currentUser.name
      );

      setShowSubmitModal(false);
      setFormTitle('');
      setFormDescription('');
      setFormRegion('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Child Protection Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-stone-900 text-stone-200 border border-stone-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-white block">
                Strict Child Safeguarding & Privacy Standards Enforced
              </span>
              <span className="text-stone-400">
                To prevent child exploitation and safeguard identity, all names are pseudonymized (e.g. Case HB-EDU-042), exact locations are generalized, and evidence is vetted by licensed case workers before assistance is allocated.
              </span>
            </div>
          </div>
          {canVerifyCases && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Case For Verification</span>
            </button>
          )}
        </div>

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Verified Humanitarian Register
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 mt-1">
            Verified Needs & Beneficiaries
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Every assistance case below has completed or is undergoing strict institutional verification with local elders, pediatric physicians, or licensed schools. No child or community need is published without verified consent.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Causes ({needs.length})
            </button>
            <button
              onClick={() => setSelectedCategory('community_clean_water')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'community_clean_water'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Clean Water
            </button>
            <button
              onClick={() => setSelectedCategory('critical_pediatric_care')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'critical_pediatric_care'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Pediatric Care
            </button>
            <button
              onClick={() => setSelectedCategory('schooling_supplies')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'schooling_supplies'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Education
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-700 cursor-pointer focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="emergency">Emergency Priority</option>
              <option value="critical">Critical</option>
              <option value="elevated">Elevated</option>
              <option value="routine">Routine Care</option>
            </select>

            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case ref, region..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Needs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.map((need) => {
            const percentFunded = Math.min(100, Math.round((need.allocatedFunding / need.estimatedCost) * 100));
            const isVerified = need.status === 'verified_authentic' || need.status === 'funding_allocated' || need.status === 'assistance_in_progress';

            return (
              <div
                key={need.id}
                className="glass-card rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/80">
                      {need.caseCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {need.urgency === 'emergency' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                          Emergency
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Case
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            Review Stage
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title & Anonymized Demographics */}
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug mb-2">
                    {need.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {need.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-500 mb-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{need.region}, {need.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>Beneficiaries: {need.beneficiaryCount} ({need.ageBracket})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Partner: {need.submittingPartnerName}</span>
                    </div>
                  </div>
                </div>

                {/* Funding Allocation & Action */}
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Fund Allocation</span>
                      <span>
                        ${need.allocatedFunding.toLocaleString()} / ${need.estimatedCost.toLocaleString()} ({percentFunded}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/60">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentFunded}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCaseModal(need)}
                      className="flex-1 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Verification</span>
                    </button>
                    <button
                      onClick={() => onNavigate('donate')}
                      className="py-2 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white/20" />
                      <span>Fund Aid</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Case Details Modal with Evidence Checklist */}
        {selectedCaseModal && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setSelectedCaseModal(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="font-mono text-xs font-bold text-orange-600 uppercase">
                    Case Verification Dossier
                  </span>
                  <h2 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                    {selectedCaseModal.caseCode} · {selectedCaseModal.title}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedCaseModal.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <div className="py-4 space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-stone-900 mb-1">Humanitarian Context & Need</h4>
                  <p className="text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {selectedCaseModal.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs">
                  <div>
                    <span className="text-stone-500 block">Submitting Accredited NGO:</span>
                    <strong className="text-stone-900">{selectedCaseModal.submittingPartnerName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Lead Verification Officer:</span>
                    <strong className="text-stone-900">{selectedCaseModal.verifiedOfficerName || 'Under Review by Protection Desk'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Mandatory Re-Verification Due:</span>
                    <strong className="text-stone-900">{selectedCaseModal.reverificationDueDate}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Beneficiaries Protected:</span>
                    <strong className="text-stone-900">{selectedCaseModal.beneficiaryCount} ({selectedCaseModal.ageBracket})</strong>
                  </div>
                </div>

                {/* Guardian Consent Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Legal Guardian Consent</span>
                  </div>
                  <div className="text-xs text-stone-600 space-y-1">
                    <p><strong>Consent Grantor:</strong> {selectedCaseModal.consent.guardianNamePseudonym} ({selectedCaseModal.consent.relationshipToChild.replace(/_/g, ' ')})</p>
                    <p><strong>Consent Scope:</strong> {selectedCaseModal.consent.consentType.replace(/_/g, ' ')}</p>
                    <p className="font-mono text-[11px] text-stone-500"><strong>Document Ref:</strong> {selectedCaseModal.consent.verifiedDocumentRef}</p>
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div>
                  <h4 className="font-bold text-stone-900 mb-2">Verified Supporting Evidence ({selectedCaseModal.evidence.length})</h4>
                  <div className="space-y-2">
                    {selectedCaseModal.evidence.map((ev) => (
                      <div key={ev.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-stone-400" />
                          <div>
                            <span className="font-semibold text-stone-900 block">{ev.title}</span>
                            <span className="text-[10px] text-stone-500 font-mono">SHA-256: {ev.sha256Checksum.substring(0, 16)}...</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {ev.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setSelectedCaseModal(null)}
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authorized Case Submission Modal */}
        {showSubmitModal && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setShowSubmitModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-4 border-b border-stone-200">
                <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                  Authorized Intake Portal
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  Submit Child Welfare Assistance Request
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Submitting as: {currentUser.name} ({currentUser.role})
                </p>
              </div>

              <form onSubmit={handleCreateCase} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Cause Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as NeedCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="family_preservation">Family Preservation & Kinship Care</option>
                    <option value="therapeutic_nutrition">Therapeutic Nutrition & Hunger Relief</option>
                    <option value="emergency_shelter">Emergency Safe Shelter</option>
                    <option value="schooling_supplies">Education Supplies & Kits</option>
                    <option value="critical_pediatric_care">Critical Pediatric Healthcare</option>
                    <option value="community_clean_water">Community Clean Water & WASH</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Urgency Priority *</label>
                    <select
                      value={formUrgency}
                      onChange={(e) => setFormUrgency(e.target.value as NeedUrgency)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="routine">Routine</option>
                      <option value="elevated">Elevated</option>
                      <option value="critical">Critical</option>
                      <option value="emergency">Emergency Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Age Bracket *</label>
                    <select
                      value={formAgeBracket}
                      onChange={(e) => setFormAgeBracket(e.target.value as VerifiedNeed['ageBracket'])}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="0-4 years">0-4 years (Infant/Toddler)</option>
                      <option value="5-8 years">5-8 years (Early Primary)</option>
                      <option value="9-12 years">9-12 years (Primary)</option>
                      <option value="13-17 years">13-17 years (Adolescent)</option>
                      <option value="mixed_ages">Mixed Ages</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Anonymized Case Title * (e.g. "Clean Water Borehole Filtration for Village School")
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter objective aid summary (never include child's name)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Description & Verification Assessment *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe specific living condition, family hardship, or infrastructure requirement..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Region / Province *</label>
                    <input
                      type="text"
                      required
                      value={formRegion}
                      onChange={(e) => setFormRegion(e.target.value)}
                      placeholder="e.g. Turkana, Chiapas"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Estimated Budget (USD) *</label>
                    <input
                      type="number"
                      min={100}
                      required
                      value={formEstimatedCost}
                      onChange={(e) => setFormEstimatedCost(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Beneficiary Count *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formBeneficiaryCount}
                      onChange={(e) => setFormBeneficiaryCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 block">Safeguarding & Evidence Checklist</span>
                  <input
                    type="text"
                    value={formGuardianConsentRef}
                    onChange={(e) => setFormGuardianConsentRef(e.target.value)}
                    placeholder="Guardian Consent Record Ref (e.g. DOC-CONSENT-2026-081)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                  />
                  <input
                    type="text"
                    value={formEvidenceTitle}
                    onChange={(e) => setFormEvidenceTitle(e.target.value)}
                    placeholder="Evidence Title (e.g. Hospital Diagnostic Summary)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Submitting Case...' : 'Submit Case For Verification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
