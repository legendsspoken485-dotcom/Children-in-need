import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Shield, Heart, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { CauseItem, CampaignItem } from '../types';
import { CampaignCard } from './CampaignCard';
import { CAUSES_DATA } from '../data/causes';

interface CauseDetailProps {
  cause: CauseItem;
  relatedCampaigns: CampaignItem[];
  onBack: () => void;
  onSelectCause: (causeId: string) => void;
  onDonate: (causeId: string, campaignId?: string) => void;
  onGetInvolved: () => void;
}

export const CauseDetail: React.FC<CauseDetailProps> = ({
  cause,
  relatedCampaigns,
  onBack,
  onSelectCause,
  onDonate,
  onGetInvolved
}) => {
  const [imageError, setImageError] = useState(false);

  const otherCauses = CAUSES_DATA.filter((c) => c.id !== cause.id);

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Causes</span>
          </button>

          <span className="text-xs text-stone-500 uppercase tracking-widest font-medium">
            Cause Briefing
          </span>
        </div>

        {/* Hero Glass Card */}
        <div className="glass-panel rounded-3xl overflow-hidden mb-12 shadow-xl border border-white/80">
          <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden max-h-[460px] group">
            {!imageError ? (
              <img
                src={cause.image}
                alt={cause.imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                {cause.title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent flex items-end p-6 sm:p-10">
              <div className="max-w-3xl text-white">
                <span className="text-xs font-bold tracking-widest uppercase text-rose-300 block mb-2">
                  HOPEBRIDGE Core Mission
                </span>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                  {cause.title}
                </h1>
                <p className="text-stone-200 text-sm sm:text-base mt-2 font-medium">
                  {cause.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Ribbon with Glass Surface */}
          <div className="bg-stone-50/70 backdrop-blur-xs px-6 sm:px-10 py-4 border-b border-stone-200/60 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-stone-600 max-w-xl">
              Qualified assistance delivered strictly in accordance with international child-welfare standards.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDonate(cause.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-white/20" />
                <span>Support This Cause</span>
              </button>
              <button
                onClick={onGetInvolved}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-white/90 hover:bg-white border border-stone-300/80 rounded-xl cursor-pointer active:scale-95 transition-all"
              >
                <span>Volunteer & Partner</span>
              </button>
            </div>
          </div>

          {/* Main Narrative Article */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-3">
                Overview & Context
              </h2>
              <p className="text-stone-700 text-base leading-relaxed">
                {cause.fullDescription}
              </p>
            </div>

            {/* Why It Matters */}
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4">
                Why This Priority Matters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cause.whyItMatters.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl glass-card flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-700 leading-normal">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Types of Assistance */}
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4">
                Types of Assistance Provided
              </h2>
              <ul className="space-y-3">
                {cause.typesOfAssistance.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-stone-700 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsible Delivery Standards */}
            <div className="p-6 rounded-2xl glass-card border border-stone-200/80">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Responsible Delivery & Safeguarding Framework
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-stone-700 mb-4">
                {cause.responsibleDelivery.map((principle, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{principle}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs text-stone-500 pt-3 border-t border-stone-200/80">
                <strong>Local Partner Protocol: </strong> {cause.partnerRole}
              </div>
            </div>
          </div>
        </div>

        {/* Related Staged Campaigns */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Staged Program Initiatives
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Demonstration campaign frameworks staged for field partner readiness in this focus area.
              </p>
            </div>
          </div>

          {relatedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedCampaigns.map((camp) => (
                <CampaignCard
                  key={camp.id}
                  campaign={camp}
                  onDonateToCampaign={() => onDonate(cause.id, camp.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-white border border-stone-200 text-center">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm text-stone-700 font-medium">
                Our campaigns for this category are being prepared.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Please check back soon or explore general fund support.
              </p>
            </div>
          )}
        </div>

        {/* Explore Other Causes */}
        <div className="border-t border-stone-200 pt-10">
          <h3 className="text-base font-bold text-stone-900 mb-4">
            Explore Other Areas of Support
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {otherCauses.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectCause(item.id)}
                className="p-3 text-left bg-white rounded-lg border border-stone-200/90 hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <span className="text-xs font-semibold text-stone-800 group-hover:text-rose-700 block line-clamp-1">
                  {item.title}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 inline-flex items-center gap-1 group-hover:text-stone-600">
                  <span>View</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
