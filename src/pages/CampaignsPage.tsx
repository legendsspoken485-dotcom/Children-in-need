import React, { useState, useMemo } from 'react';
import { Filter, Search, Info, Sparkles } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { DEMO_CAMPAIGNS } from '../data/campaigns';
import { CAUSES_DATA } from '../data/causes';
import { BridgeIcon } from '../components/Logo';
import { CampaignItem, CauseCategory } from '../types';

interface CampaignsPageProps {
  onDonateToCampaign: (campaign: CampaignItem) => void;
  onSelectCause: (causeId: string) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({
  onDonateToCampaign,
  onSelectCause
}) => {
  const [selectedCause, setSelectedCause] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulateEmptyState, setSimulateEmptyState] = useState(false);
  const [selectedCampaignModal, setSelectedCampaignModal] = useState<CampaignItem | null>(null);

  const filteredCampaigns = useMemo(() => {
    if (simulateEmptyState) return [];

    return DEMO_CAMPAIGNS.filter((c) => {
      const matchesCause = selectedCause === 'all' || c.causeId === selectedCause;
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCause && matchesStatus && matchesSearch;
    });
  }, [selectedCause, selectedStatus, searchQuery, simulateEmptyState]);

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
            Program Initiatives
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Campaigns & Staged Initiatives
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Explore focused program initiatives targeting our six core areas of child welfare. Each initiative is structured with clear milestones and community oversight.
          </p>
        </div>

        {/* Staging / Demonstration Notice Banner */}
        <div className="mb-8 p-4 rounded-xl bg-stone-100 border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-700">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-stone-900">
                Staging & Demonstration Environment Notice:
              </strong>
              <span>
                These campaigns represent operational program models staged for partner onboarding. Real public fundraising campaigns will be published following verified field audits.
              </span>
            </div>
          </div>

          {/* Toggle to verify graceful empty state */}
          <button
            type="button"
            onClick={() => setSimulateEmptyState(!simulateEmptyState)}
            className="shrink-0 px-3 py-1.5 rounded-md border border-stone-300 bg-white hover:bg-stone-50 font-medium text-stone-700 transition-colors text-xs cursor-pointer"
          >
            {simulateEmptyState ? 'Restore Sample Records' : 'Simulate Empty State'}
          </button>
        </div>

        {/* Filter Toolbar (Glass Segmented Controls & Search) */}
        <div className="glass-panel p-4 rounded-2xl shadow-sm mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Cause Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCause('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                selectedCause === 'all'
                  ? 'bg-stone-900 text-white shadow-xs scale-[1.02]'
                  : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/80'
              }`}
            >
              All Causes ({DEMO_CAMPAIGNS.length})
            </button>
            {CAUSES_DATA.map((cause) => {
              const count = DEMO_CAMPAIGNS.filter((c) => c.causeId === cause.id).length;
              return (
                <button
                  key={cause.id}
                  onClick={() => setSelectedCause(cause.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    selectedCause === cause.id
                      ? 'bg-stone-900 text-white shadow-xs scale-[1.02]'
                      : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/80'
                  }`}
                >
                  {cause.title} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300/80 bg-white/90 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-300/80 bg-white/90 text-stone-700 cursor-pointer focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Statuses</option>
              <option value="active-preparation">Active Staging</option>
              <option value="community-pilot">Community Pilot</option>
              <option value="fully-funded-staged">Goal Reached (Staged)</option>
            </select>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => (
              <CampaignCard
                key={camp.id}
                campaign={camp}
                onDonateToCampaign={onDonateToCampaign}
                onSelectCampaign={(c) => setSelectedCampaignModal(c)}
              />
            ))}
          </div>
        ) : (
          /* Prescribed Empty State with Glass Panel */
          <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-orange-50/90 border border-orange-200/70 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <BridgeIcon size="md" variant="color" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Our campaigns are being prepared. Please check back soon.
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
              We do not publish active fundraising campaigns until field partners and safeguarding verifications are finalized. In the meantime, you can explore our six core cause areas or review our child protection protocols.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCause('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                  setSimulateEmptyState(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        )}

        {/* Campaign Detail Modal with Glass Backdrop and Animation */}
        {selectedCampaignModal && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setSelectedCampaignModal(null)}
          >
            <div
              className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  {selectedCampaignModal.causeName} · {selectedCampaignModal.country}
                </span>
                <button
                  onClick={() => setSelectedCampaignModal(null)}
                  className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer p-1 rounded-md hover:bg-stone-100/80 transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              <h2 className="text-xl font-bold text-stone-900 mt-4">
                {selectedCampaignModal.title}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Location: {selectedCampaignModal.region}, {selectedCampaignModal.country} · Target: ${selectedCampaignModal.targetAmount.toLocaleString()} USD
              </p>

              <div className="mt-4 aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60">
                <img
                  src={selectedCampaignModal.image}
                  alt={selectedCampaignModal.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900">Operational Plan & Needs Assessment:</h4>
                <p>{selectedCampaignModal.detailedNeed}</p>
                <div className="p-3.5 glass-card rounded-xl text-xs text-stone-600">
                  <strong>Staging Status: </strong> Program frameworks and logistical supply chain verified. Real donation processing begins upon authorized local distribution agreement.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCampaignModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer transition-colors"
                >
                  Close Brief
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const camp = selectedCampaignModal;
                    setSelectedCampaignModal(null);
                    onDonateToCampaign(camp);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Simulate Contribution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
