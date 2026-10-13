import React from 'react';
import { ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { PageId, CauseCategory } from '../types';

interface FooterProps {
  onNavigate: (page: PageId, causeId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Ribbon: Safeguarding & Ethical Commitment */}
        <div className="mb-12 pb-10 border-b border-stone-800/80 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-stone-800 text-rose-400 shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Child Safeguarding First</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Zero tolerance for exploitation, abuse, or harm. We protect children’s dignity, privacy, and identity in all activities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-stone-800 text-amber-400 shrink-0">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Family-Centered Care</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Prioritizing kinship care, family preservation, and community stability over unnecessary institutionalization.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-stone-800 text-teal-400 shrink-0">
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Transparent Aid Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Direct coordination with verified local community providers, licensed schools, and accredited health clinics.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Logo variant="light" size="lg" showTagline={true} />
            <p className="text-stone-400 text-sm mt-4 leading-relaxed max-w-sm">
              HOPEBRIDGE is an international humanitarian charity initiative dedicated to protecting vulnerable children through family preservation, emergency nutrition, safe shelter, quality education, healthcare, and clean water.
            </p>

            <div className="mt-6 p-4 rounded-lg bg-stone-800/80 border border-stone-700/60 max-w-sm">
              <span className="text-xs font-semibold text-rose-300 block mb-1">
                Report a Safeguarding Concern
              </span>
              <p className="text-xs text-stone-400 leading-normal">
                If you have concerns about the safety or welfare of any child connected to our initiatives, email our dedicated protection officer at{' '}
                <a
                  href="mailto:safeguarding@hopebridge.org"
                  className="text-white underline hover:text-rose-300"
                >
                  safeguarding@hopebridge.org
                </a>.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Organization
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  About Us & Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('causes')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Our Six Causes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('campaigns')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Staged Campaigns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('get-involved')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Get Involved & Volunteer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Causes Column */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Our 6 Causes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('cause-detail', 'parental-care' as CauseCategory)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Parental Care & Kinship
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cause-detail', 'nutrition' as CauseCategory)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Food and Nutrition
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cause-detail', 'shelter' as CauseCategory)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Safe Shelter & Housing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cause-detail', 'education' as CauseCategory)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Education & Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cause-detail', 'healthcare' as CauseCategory)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Pediatric Healthcare
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cause-detail', 'clean-water' as CauseCategory)}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Clean Water & Sanitation
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Policies & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('safeguarding')}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Child Safeguarding Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donation-terms')}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Donation Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Partner Vetting Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donate')}
                  className="text-stone-400 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Simulated Donor Journey
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HOPEBRIDGE. "Every Child Deserves a Chance." All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <span>Staging Prototype & Review</span>
            <span>·</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>·</span>
            <span>UN CRC Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
