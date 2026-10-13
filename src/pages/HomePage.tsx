import React, { useState } from 'react';
import { ArrowRight, Heart, Shield, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { CauseCard } from '../components/CauseCard';
import { CampaignCard } from '../components/CampaignCard';
import { CAUSES_DATA } from '../data/causes';
import { DEMO_CAMPAIGNS } from '../data/campaigns';
import { PageId, CampaignItem } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId, causeId?: string) => void;
  onSelectCause: (causeId: string) => void;
  onDonate: (causeId?: string, campaignId?: string) => void;
  onDonateCampaign: (campaign: CampaignItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCause,
  onDonate,
  onDonateCampaign
}) => {
  const [heroImageError, setHeroImageError] = useState(false);

  return (
    <div className="bg-[#FCFAF7] min-h-screen">
      {/* SECTION 1: HOMEPAGE HERO (Photography-Led, Dignified, Respectful) */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Human Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
                <span>International Child Welfare Initiative</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15] text-balance">
                Every Child Deserves a Chance.
              </h1>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Every child deserves safety, care, education, and the opportunity to build a brighter future. HOPEBRIDGE brings people and communities together to help make that possible.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('causes')}
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Our Causes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <span>How You Can Help</span>
                </button>
              </div>

              {/* Guiding Principles Strip */}
              <div className="pt-6 border-t border-stone-800 grid grid-cols-3 gap-4 text-xs text-stone-400">
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Family-First</strong>
                  <span>Kinship & Foster Care</span>
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Community-Led</strong>
                  <span>Verified Field Partners</span>
                </div>
                <div>
                  <strong className="block text-white font-semibold mb-0.5">Child Protection</strong>
                  <span>100% Safeguarding</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Hero Photography with Floating Glass Trust Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl bg-stone-800 aspect-16/10 group">
                {!heroImageError ? (
                  <img
                    src="/src/assets/images/hero_children_learning_1791836307952.jpg"
                    alt="Diverse smiling school children sitting together in a bright sunlit classroom, writing in notebooks with pencils"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImageError(true)}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 p-8 text-center text-sm">
                    Children learning safely in a supported community school environment
                  </div>
                )}
                {/* Subtle caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-4 sm:p-5">
                  <p className="text-xs text-stone-200">
                    Supporting open, safe classrooms where young minds learn and grow with dignity.
                  </p>
                </div>
              </div>

              {/* Floating Glass Quality Badge */}
              <div className="absolute -bottom-5 -left-4 sm:bottom-4 sm:left-4 glass-dark rounded-xl p-3 sm:p-4 shadow-xl border border-white/20 max-w-[240px] hidden sm:block animate-modal-in">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    Child Safeguarding
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 leading-tight">
                  100% adherence to UN Convention on the Rights of the Child.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OPERATIONAL TRUST RIBBON WITH GLASS CONTAINERS */}
      <section className="bg-white/80 backdrop-blur-md border-b border-stone-200/70 py-8 relative -mt-3 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 text-center md:text-left">
            <div className="glass-card p-4 rounded-xl flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">6 Vital Causes</h4>
                <p className="text-xs text-stone-500">Holistic child-centered aid</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Safeguarding First</h4>
                <p className="text-xs text-stone-500">Zero tolerance for harm</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Local Providers</h4>
                <p className="text-xs text-stone-500">Accredited community clinics</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Open Accounting</h4>
                <p className="text-xs text-stone-500">Transparent reporting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR 6 CAUSES */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
                Where We Work
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
                Our Six Core Areas of Support
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
                We believe assistance must address a child’s whole environment. Discover our six foundational support pillars.
              </p>
            </div>

            <button
              onClick={() => onNavigate('causes')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 transition-colors cursor-pointer py-1"
            >
              <span>View All Cause Briefs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Photographic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CAUSES_DATA.map((cause) => (
              <CauseCard
                key={cause.id}
                cause={cause}
                onSelect={onSelectCause}
                onDonateToCause={() => onDonate(cause.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: STAGED CAMPAIGNS SPOTLIGHT */}
      <section className="py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
                <span>Field Program Initiatives</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Staged Campaigns in Preparation
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Demonstration campaign frameworks staged for partner verification.
              </p>
            </div>

            <button
              onClick={() => onNavigate('campaigns')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <span>Explore All Initiatives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_CAMPAIGNS.slice(0, 3).map((camp) => (
              <CampaignCard
                key={camp.id}
                campaign={camp}
                onDonateToCampaign={onDonateCampaign}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW HOPEBRIDGE OPERATES RESPONSIBLY */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
              Accountability Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              How Assistance Is Delivered Responsibly
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              We uphold uncompromising standards to ensure aid reaches children with maximum impact and zero exploitation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
              <span className="text-xs font-mono font-bold text-stone-400 block mb-2">01.</span>
              <h3 className="text-base font-bold text-stone-900 mb-2">Preserving Families</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                We prioritize keeping children in their families and communities. Kinship care grants and caregiver support prevent unnecessary family separation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
              <span className="text-xs font-mono font-bold text-stone-400 block mb-2">02.</span>
              <h3 className="text-base font-bold text-stone-900 mb-2">Vetted Local Providers</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Rather than creating duplicative bureaucracy, we partner with verified local schools, licensed medical clinics, and water associations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
              <span className="text-xs font-mono font-bold text-stone-400 block mb-2">03.</span>
              <h3 className="text-base font-bold text-stone-900 mb-2">Strict Safeguarding</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every representative adheres to our Child Safeguarding Policy. We protect children’s privacy, dignity, and personal safety unconditionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: URGENT CALL TO ACTION BANNER */}
      <section className="bg-stone-900 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 bg-rose-600/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 fill-rose-500/20" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Help Give a Vulnerable Child the Future They Deserve
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            From clean water to warm meals and school backpacks, every contribution changes a child’s reality. Experience our transparent donation flow today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onDonate()}
              className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Simulate a Donation</span>
            </button>
            <button
              onClick={() => onNavigate('get-involved')}
              className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-700 cursor-pointer"
            >
              <span>Explore Involvement Options</span>
            </button>
          </div>

          <p className="text-xs text-stone-400 pt-2">
            Staging mode · No real credit cards processed · Strict child protection standards
          </p>
        </div>
      </section>
    </div>
  );
};
