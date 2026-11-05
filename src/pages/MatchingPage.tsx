import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Brain,
  Scale,
  Users,
  Building,
  Coins,
  RefreshCw,
  Lock,
  ChevronRight
} from 'lucide-react';
import {
  generateMatchingProposals,
  applyMatchingProposal,
  getFinancialOverview,
  subscribeToStore
} from '../db/storage';
import { MatchingProposal, PageId } from '../types';
import { useAuth } from '../context/AuthContext';

interface MatchingPageProps {
  onNavigate: (page: PageId, causeId?: string) => void;
}

export const MatchingPage: React.FC<MatchingPageProps> = ({ onNavigate }) => {
  const { currentUser, canAuthorizeFunds } = useAuth();
  const [proposals, setProposals] = useState<MatchingProposal[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setProposals(generateMatchingProposals());
    refresh();
    return subscribeToStore(refresh);
  }, []);

  const financials = getFinancialOverview();

  const handleApplyAllocation = async (proposal: MatchingProposal) => {
    if (!canAuthorizeFunds) return;
    setApplyingId(proposal.id);
    try {
      await applyMatchingProposal(proposal.id, currentUser.name);
      setAppliedSuccess(proposal.needCaseCode);
      setTimeout(() => setAppliedSuccess(null), 3000);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Brain className="w-3.5 h-3.5" />
            <span>Algorithmic Humanitarian Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Intelligent Aid & Resource Allocation
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Our multi-factor matching engine pairs verified child welfare needs with accredited local organizations, qualified vetted volunteers, and available donor funds. Every decision is transparently scored to prioritize urgency, eliminate aid redundancy, and prevent double allocations.
          </p>
        </div>

        {/* Algorithm Safeguard Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700 shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-stone-900 block">
                Human-in-the-Loop Governance & Anti-Duplicate Guard
              </span>
              <span className="text-stone-500">
                Algorithms suggest optimal allocations based on urgency (medical/water weighted highest), regional proximity, and volunteer skill profiles. Allocation requires authorized officer authorization and locks funds to prevent double-spending.
              </span>
            </div>
          </div>
          <div className="text-right shrink-0 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <span className="text-stone-500 block">Available Field Escrow:</span>
            <strong className="text-stone-900 font-serif text-lg">${financials.escrowBalance.toLocaleString()} USD</strong>
          </div>
        </div>

        {/* Success Alert */}
        {appliedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-modal-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Successfully authorized and locked resource allocation for Case <strong>{appliedSuccess}</strong>. Updated verified registry and ledger.
            </span>
          </div>
        )}

        {/* Proposals Grid */}
        <div className="space-y-6">
          {proposals.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900">All Verified Cases Fully Allocated</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                All currently active verified child welfare needs have matching partner resources and funding assigned. Explore the verified register to review status or submit a new case.
              </p>
              <button
                onClick={() => onNavigate('verified-needs')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                View Verified Needs Register
              </button>
            </div>
          ) : (
            proposals.map((prop) => (
              <div
                key={prop.id}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-all space-y-6"
              >
                {/* Proposal Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">
                      {prop.needCaseCode}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      {prop.needTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-2">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Match Score</span>
                      <span className="text-lg font-bold text-orange-600">{prop.matchingScore}% Optimal</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        prop.urgency === 'emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : prop.urgency === 'critical'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {prop.urgency} Urgency
                    </span>
                  </div>
                </div>

                {/* Match Triad: Funds + NGO Partner + Vetted Volunteer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1: Financial Allocation */}
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-900 uppercase tracking-wider">
                      <Coins className="w-4 h-4 text-orange-600" />
                      <span>Recommended Funding</span>
                    </div>
                    <div className="text-xl font-bold font-serif text-stone-900">
                      ${prop.recommendedDonationAllocation.toLocaleString()} {prop.currency}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-tight">
                      Drawn from unrestricted general children fund and dedicated cause escrow.
                    </p>
                  </div>

                  {/* Column 2: Accredited Partner */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                      <Building className="w-4 h-4 text-stone-500" />
                      <span>Operational Partner</span>
                    </div>
                    <div className="text-sm font-bold text-stone-900 truncate">
                      {prop.recommendedPartnerName}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-tight">
                      Vetted local infrastructure & licensed community delivery oversight.
                    </p>
                  </div>

                  {/* Column 3: Qualified Volunteer */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Cleared Field Volunteer</span>
                    </div>
                    <div className="text-sm font-bold text-stone-900 truncate">
                      {prop.recommendedVolunteerName || 'Regional On-Call Specialist'}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-tight">
                      Background cleared & safeguarding certified for this specific care domain.
                    </p>
                  </div>
                </div>

                {/* Algorithmic Rationale Explanation */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
                  <span className="font-bold text-stone-900 block mb-2">
                    Algorithmic Decision Transparency & Scoring Rationale:
                  </span>
                  <ul className="space-y-1 text-stone-600 list-disc list-inside">
                    {prop.rationale.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Authorization Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Requires Executive Admin Authorization (HB-GOV-ALLOC-01)</span>
                  </div>

                  {canAuthorizeFunds ? (
                    <button
                      onClick={() => handleApplyAllocation(prop)}
                      disabled={applyingId === prop.id}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                    >
                      {applyingId === prop.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authorizing Allocation...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Authorize & Lock Resource Allocation</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-stone-400 italic">
                      Sign in as Executive Admin or Director to approve this allocation.
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
