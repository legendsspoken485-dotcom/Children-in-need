import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, ChevronDown, BookOpen, Utensils, Home, Stethoscope, Droplets, Users } from 'lucide-react';
import { Logo } from './Logo';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, causeId?: string, campaignId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [causesDropdownOpen, setCausesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCausesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCausesDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const causesList = [
    { id: 'parental-care', label: 'Children Without Parental Care', icon: <Users className="w-4 h-4 text-rose-500" /> },
    { id: 'nutrition', label: 'Food and Nutrition Relief', icon: <Utensils className="w-4 h-4 text-amber-500" /> },
    { id: 'shelter', label: 'Safe Shelter & Emergency Homes', icon: <Home className="w-4 h-4 text-indigo-500" /> },
    { id: 'education', label: 'Education & School Supplies', icon: <BookOpen className="w-4 h-4 text-emerald-500" /> },
    { id: 'healthcare', label: 'Pediatric Healthcare Support', icon: <Stethoscope className="w-4 h-4 text-cyan-500" /> },
    { id: 'clean-water', label: 'Clean Drinking Water & WASH', icon: <Droplets className="w-4 h-4 text-sky-500" /> },
  ];

  const handleLinkClick = (page: PageId, causeId?: string) => {
    onNavigate(page, causeId);
    setMobileMenuOpen(false);
    setCausesDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#FCFAF7]/85 backdrop-blur-lg border-stone-200/80 shadow-xs py-3'
          : 'bg-[#FCFAF7]/95 backdrop-blur-md border-stone-200/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark with Official Orange Bridge */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md shrink-0 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
          aria-label="HOPEBRIDGE Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700"
          aria-label="Primary Navigation"
        >
          <button
            onClick={() => handleLinkClick('home')}
            className={`transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer relative ${
              currentPage === 'home'
                ? 'text-rose-600 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Home
            {currentPage === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full animate-modal-in" />
            )}
          </button>

          {/* Causes Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCausesDropdownOpen(!causesDropdownOpen)}
              onMouseEnter={() => setCausesDropdownOpen(true)}
              className={`flex items-center gap-1 transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                currentPage === 'causes' || currentPage === 'cause-detail'
                  ? 'text-rose-600 font-semibold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              aria-expanded={causesDropdownOpen}
              aria-haspopup="true"
            >
              <span>Our Causes</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  causesDropdownOpen ? 'rotate-180 text-rose-600' : 'text-stone-400'
                }`}
              />
              {(currentPage === 'causes' || currentPage === 'cause-detail') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
              )}
            </button>

            {/* Glass Dropdown Panel */}
            {causesDropdownOpen && (
              <div
                onMouseLeave={() => setCausesDropdownOpen(false)}
                className="absolute left-0 mt-2 w-72 rounded-xl glass-panel p-2 shadow-xl border border-white/80 animate-modal-in z-50"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-200/50 mb-1">
                  Six Areas of Support
                </div>
                {causesList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleLinkClick('cause-detail', c.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <span className="p-1 rounded-md bg-stone-100/70">{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
                <div className="mt-1 pt-1.5 border-t border-stone-200/60">
                  <button
                    onClick={() => handleLinkClick('causes')}
                    className="w-full text-center py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    View All Causes Overview →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleLinkClick('campaigns')}
            className={`transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer relative ${
              currentPage === 'campaigns'
                ? 'text-rose-600 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Campaigns
            {currentPage === 'campaigns' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleLinkClick('about')}
            className={`transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer relative ${
              currentPage === 'about'
                ? 'text-rose-600 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            About Us
            {currentPage === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleLinkClick('get-involved')}
            className={`transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer relative ${
              currentPage === 'get-involved'
                ? 'text-rose-600 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Get Involved
            {currentPage === 'get-involved' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleLinkClick('contact')}
            className={`transition-all whitespace-nowrap shrink-0 py-1 cursor-pointer relative ${
              currentPage === 'contact'
                ? 'text-rose-600 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Contact
            {currentPage === 'contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleLinkClick('donate')}
            className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 animate-donate-cue active:scale-[0.98]"
          >
            <Heart className="w-4 h-4 fill-white/20 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
            <span>Donate Now</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 animate-modal-in" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Panel with Glass Backdrop */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-0 top-[65px] z-50 bg-stone-900/50 backdrop-blur-md md:hidden animate-modal-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="glass-panel border-b border-stone-200/80 px-6 py-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-3">
              <div className="pb-3 border-b border-stone-200/60 flex items-center justify-between">
                <Logo size="sm" showTagline={true} />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                Menu Navigation
              </span>

              {[
                { label: 'Home', page: 'home' as PageId },
                { label: 'Our Causes Overview', page: 'causes' as PageId },
                { label: 'Campaigns & Pilots', page: 'campaigns' as PageId },
                { label: 'About Us & Mission', page: 'about' as PageId },
                { label: 'Get Involved & Volunteer', page: 'get-involved' as PageId },
                { label: 'Contact & Safeguarding', page: 'contact' as PageId },
              ].map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleLinkClick(item.page)}
                    className={`text-left text-base py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-50/90 text-rose-700 font-bold border border-rose-200/60'
                        : 'text-stone-800 hover:bg-white/80 font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Mobile Causes Quick Jump */}
              <div className="pt-2 border-t border-stone-200/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-2 px-1">
                  Jump to Specific Cause:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {causesList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleLinkClick('cause-detail', c.id)}
                      className="text-left px-2 py-1.5 rounded-md bg-stone-100/70 hover:bg-rose-50 hover:text-rose-700 transition-colors truncate font-medium text-stone-700"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/80 flex flex-col gap-3">
                <button
                  onClick={() => handleLinkClick('donate')}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-rose-600 rounded-lg shadow-md hover:bg-rose-700 active:scale-[0.99] transition-all"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>Support a Child — Donate</span>
                </button>
                <div className="text-[11px] text-center text-stone-500 pt-1">
                  Confidential safeguarding line: safeguarding@hopebridge.org
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

