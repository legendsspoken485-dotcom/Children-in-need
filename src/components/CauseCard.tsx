import React, { useState } from 'react';
import { ArrowRight, Heart, BookOpen, Utensils, Home, Stethoscope, Droplets, Users } from 'lucide-react';
import { CauseItem } from '../types';

interface CauseCardProps {
  cause: CauseItem;
  onSelect: (causeId: string) => void;
  onDonateToCause: (causeId: string) => void;
}

export const CauseCard: React.FC<CauseCardProps> = ({ cause, onSelect, onDonateToCause }) => {
  const [imageError, setImageError] = useState(false);

  // Cause icon mapping
  const getCauseIcon = () => {
    switch (cause.id) {
      case 'parental-care':
        return <Users className="w-5 h-5 text-rose-600" aria-hidden="true" />;
      case 'nutrition':
        return <Utensils className="w-5 h-5 text-amber-600" aria-hidden="true" />;
      case 'shelter':
        return <Home className="w-5 h-5 text-indigo-600" aria-hidden="true" />;
      case 'education':
        return <BookOpen className="w-5 h-5 text-emerald-600" aria-hidden="true" />;
      case 'healthcare':
        return <Stethoscope className="w-5 h-5 text-cyan-600" aria-hidden="true" />;
      case 'clean-water':
        return <Droplets className="w-5 h-5 text-sky-600" aria-hidden="true" />;
      default:
        return <Heart className="w-5 h-5 text-rose-600" aria-hidden="true" />;
    }
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col active:scale-[0.99] transition-all duration-300">
      {/* Visual Photography Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={cause.image}
            alt={cause.imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-100 text-stone-500">
            {getCauseIcon()}
            <span className="text-xs font-medium mt-2 text-stone-600 text-center">{cause.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Content with Refined Typography & Glass Surface */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata & Category Header */}
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-2.5">
            <span className="p-1 rounded-md bg-stone-100/80 group-hover:bg-rose-50 transition-colors">
              {getCauseIcon()}
            </span>
            <span className="uppercase tracking-wider text-[11px]">Priority Area</span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-700 transition-colors leading-snug">
            {cause.title}
          </h3>

          <p className="text-stone-600 text-sm mt-2.5 leading-relaxed line-clamp-3">
            {cause.shortDescription}
          </p>
        </div>

        {/* Dual Actions: Learn More & Support */}
        <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between gap-3">
          <button
            onClick={() => onSelect(cause.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-rose-600 transition-all cursor-pointer py-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 rounded-sm group/btn"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
          </button>

          <button
            onClick={() => onDonateToCause(cause.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50/90 hover:bg-rose-100/90 border border-rose-200/60 rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500/20" aria-hidden="true" />
            <span>Support Cause</span>
          </button>
        </div>
      </div>
    </div>
  );
};
