import React, { useState } from 'react';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import { CampaignItem } from '../types';

interface CampaignCardProps {
  campaign: CampaignItem;
  onDonateToCampaign: (campaign: CampaignItem) => void;
  onSelectCampaign?: (campaign: CampaignItem) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onDonateToCampaign,
  onSelectCampaign
}) => {
  const [imageError, setImageError] = useState(false);

  const percentRaised = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
  );

  const getStatusLabel = () => {
    switch (campaign.status) {
      case 'active-preparation':
        return 'Active Staging';
      case 'community-pilot':
        return 'Community Pilot';
      case 'fully-funded-staged':
        return 'Goal Reached (Staged)';
      default:
        return 'Staging';
    }
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col active:scale-[0.99] transition-all duration-300">
      {/* Campaign Photography */}
      <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={campaign.image}
            alt={campaign.imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">
            {campaign.causeName}
          </div>
        )}

        {/* Refined Glass Staging Notice */}
        <div className="absolute top-3 right-3 glass-dark text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
          Staged Prototype
        </div>
      </div>

      {/* Campaign Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-bold text-rose-700">{campaign.causeName}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" aria-hidden="true" />
              <span>
                {campaign.country}, {campaign.region}
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[11px] font-medium text-stone-500">{getStatusLabel()}</span>
          </div>

          <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700 transition-colors leading-snug">
            {campaign.title}
          </h3>

          <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
            {campaign.description}
          </p>
        </div>

        {/* Financial Progress & Metric Block */}
        <div className="mt-5 pt-4 border-t border-stone-200/60">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
            <span className="font-medium">
              <strong className="text-stone-900 font-bold tabular-nums">
                ${campaign.raisedAmount.toLocaleString()}
              </strong>{' '}
              raised
            </span>
            <span className="text-stone-500 tabular-nums">
              Target: ${campaign.targetAmount.toLocaleString()}
            </span>
          </div>

          {/* Progress bar with smooth width transition */}
          <div className="w-full h-2.5 bg-stone-100/90 rounded-full overflow-hidden mb-4 p-0.5 border border-stone-200/50">
            <div
              className="h-full bg-linear-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-1000 ease-out shadow-xs"
              style={{ width: `${percentRaised}%` }}
              role="progressbar"
              aria-valuenow={percentRaised}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            {onSelectCampaign ? (
              <button
                type="button"
                onClick={() => onSelectCampaign(campaign)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer transition-colors group/link"
              >
                <span>Read Plan</span>
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <span className="text-[11px] text-stone-400">Verified Staging</span>
            )}

            <button
              type="button"
              onClick={() => onDonateToCampaign(campaign)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white/20" aria-hidden="true" />
              <span>Simulate Gift</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
