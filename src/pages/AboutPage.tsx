import React from 'react';
import { Shield, Eye, Heart, Users, CheckCircle, Scale, ArrowRight } from 'lucide-react';
import { PageId } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageId, causeId?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
            Our Purpose & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            "Every Child Deserves a Chance."
          </h1>
          <p className="text-stone-600 text-base mt-4 leading-relaxed">
            HOPEBRIDGE exists to help children in difficult circumstances by connecting legitimate humanitarian assistance with genuine, verified needs.
          </p>
        </div>

        {/* Hero Photo / Volunteer Community Spirit */}
        <div className="rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm mb-14 bg-stone-100">
          <img
            src="/src/assets/images/community_volunteers_1791836399931.jpg"
            alt="Compassionate community volunteers packing school supplies and food relief parcels with care"
            className="w-full h-[380px] object-cover"
          />
          <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 italic text-center">
            Community volunteers and educators working together to prepare essential student learning and nutrition relief kits.
          </div>
        </div>

        {/* Founding Principles & Operational Context */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 mb-12 space-y-8 shadow-xl">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
              The HOPEBRIDGE Mission
            </h2>
            <p className="text-stone-700 text-base leading-relaxed">
              Every child deserves safety, care, education, and the opportunity to build a brighter future. When economic hardship, family loss, health crises, or displacement occur, children are the most vulnerable. HOPEBRIDGE is structured to bridge the gap between people who want to help and community organizations delivering legitimate, verified aid directly where it counts.
            </p>
          </div>

          {/* Transparent Organizational Notice */}
          <div className="p-5 rounded-2xl glass-card text-xs text-stone-600 leading-relaxed space-y-2 border border-stone-200/80">
            <strong className="block text-stone-900 font-semibold text-sm">
              Operational Roadmap & Organizational Transparency Notice
            </strong>
            <p>
              HOPEBRIDGE is currently presenting its founding architectural framework. In strict keeping with our core transparency principles, we do not claim unverified historical founding milestones, fabricated awards, or unearned global ratings.
            </p>
            <p>
              As our operations expand into regional communities, every official registration certificate, independent audit report, and partner credential will be published openly for public verification.
            </p>
          </div>

          {/* Intended Goals */}
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">
              Our Primary Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl glass-card">
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  1. Preserve & Strengthen Families
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Support kinship and community care networks to keep children safely with their relatives and out of unregulated institutions.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card">
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  2. Eradicate Preventable Malnutrition
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Partner with local smallholder farms and school kitchens to provide wholesome, balanced daily nutrition during key developmental years.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card">
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  3. Guarantee Schooling & Literacy
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Equip classrooms with textbooks, stationery, and learning spaces so that no child is excluded from learning due to poverty.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card">
                <span className="font-bold text-stone-900 text-sm block mb-1">
                  4. Secure Community Health & Clean Water
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Support certified pediatric clinics and long-term solar water installations to shield children from preventable illnesses.
                </p>
              </div>
            </div>
          </div>

          {/* Approach to Child Welfare */}
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
              Our Approach to Child Welfare & Safeguarding
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed mb-4">
              HOPEBRIDGE adheres strictly to the United Nations Convention on the Rights of the Child and the UN Guidelines for the Alternative Care of Children. We reject dehumanizing "poverty marketing" and sensationalized imagery. Every child has an inherent right to dignity, privacy, and self-respect.
            </p>
            <div className="space-y-2.5 text-sm text-stone-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Zero exposure of vulnerable children's private home addresses, medical diagnoses, or personal identification records.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Strict background checks and child safeguarding accreditation for all field staff and local partners.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>Preference for community-based family support over long-term institutional residential facilities.</span>
              </div>
            </div>
          </div>

          {/* Partner Vetting Standards */}
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
              How We Work with Legitimate Partner Organizations
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed mb-4">
              Aid is only effective when delivered through legitimate, accountable hands. HOPEBRIDGE does not distribute unrestricted cash blindly. We require all prospective implementing partners to meet our Four-Tier Vetting Standard:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl glass-card">
                <strong className="text-xs uppercase font-bold text-stone-900 block mb-1">Legal Registration</strong>
                <p className="text-xs text-stone-600">Proof of non-profit incorporation and authorization with host-country regulatory authorities.</p>
              </div>
              <div className="p-4 rounded-xl glass-card">
                <strong className="text-xs uppercase font-bold text-stone-900 block mb-1">Child Protection Policy</strong>
                <p className="text-xs text-stone-600">Formally adopted child safeguarding protocols with designated reporting officers.</p>
              </div>
              <div className="p-4 rounded-xl glass-card">
                <strong className="text-xs uppercase font-bold text-stone-900 block mb-1">Financial Integrity</strong>
                <p className="text-xs text-stone-600">Dual-signatory bank controls, documented invoice tracking, and independent audit compliance.</p>
              </div>
              <div className="p-4 rounded-xl glass-card">
                <strong className="text-xs uppercase font-bold text-stone-900 block mb-1">Community Accountability</strong>
                <p className="text-xs text-stone-600">Active engagement with local village councils, school boards, and health officers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to get involved */}
        <div className="bg-stone-900 text-white rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500 mb-4 fill-rose-500/20" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Join the HOPEBRIDGE Movement
          </h2>
          <p className="text-stone-300 text-sm max-w-lg mb-6 leading-relaxed">
            Whether through contributing to programs, volunteering your skills, or partnering your school or business, your commitment matters.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('donate')}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm cursor-pointer shadow-xs"
            >
              Donate Now
            </button>
            <button
              onClick={() => onNavigate('get-involved')}
              className="px-6 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm cursor-pointer border border-stone-700"
            >
              Explore Volunteer & Partner Opportunities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
