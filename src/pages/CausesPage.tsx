import React, { useState } from 'react';
import { CauseCard } from '../components/CauseCard';
import { CAUSES_DATA } from '../data/causes';
import { CauseItem } from '../types';
import { ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface CausesPageProps {
  onSelectCause: (causeId: string) => void;
  onDonateToCause: (causeId: string) => void;
  onNavigateGetInvolved: () => void;
}

export const CausesPage: React.FC<CausesPageProps> = ({
  onSelectCause,
  onDonateToCause,
  onNavigateGetInvolved
}) => {
  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
            Our Program Pillars
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Six Critical Areas of Child Welfare
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            HOPEBRIDGE concentrates resources where vulnerable children need holistic support most. Every cause is backed by family-centered safeguards, verified community partners, and strict protection standards.
          </p>
        </div>

        {/* 6 Photographic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {CAUSES_DATA.map((cause) => (
            <CauseCard
              key={cause.id}
              cause={cause}
              onSelect={onSelectCause}
              onDonateToCause={onDonateToCause}
            />
          ))}
        </div>

        {/* Responsible Action Banner in Glass Panel */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/80">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>International Safeguarding Protocol</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Community-Led, Family-First Child Protection
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
              We never place children in unvetted institutional care. We work directly with licensed social workers, accredited foster networks, and community teachers to build durable support networks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateGetInvolved}
              className="px-5 py-2.5 rounded-xl border border-stone-300/80 bg-white/90 text-stone-800 hover:bg-white font-semibold text-xs cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              Partner With HOPEBRIDGE
            </button>
            <button
              onClick={() => onDonateToCause('general')}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-white/20" />
              <span>Support Priority Needs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
