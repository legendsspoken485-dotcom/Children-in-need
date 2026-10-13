import React, { useState } from 'react';
import { Heart, Users, Handshake, BookOpen, Share2, CheckCircle2, RefreshCw, Send, AlertCircle } from 'lucide-react';
import { PageId, VolunteerSubmission } from '../types';

interface GetInvolvedPageProps {
  onNavigate: (page: PageId, causeId?: string) => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<VolunteerSubmission>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    areaOfInterest: 'education',
    availability: 'monthly',
    backgroundNote: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    submittedAt: string;
    data: VolunteerSubmission;
  } | null>(null);

  const involvementPillars = [
    {
      title: 'Make a Contribution',
      desc: 'Support ongoing family preservation, hot lunches, emergency shelter, and water borehole projects.',
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      actionText: 'Make a Donation',
      action: () => onNavigate('donate')
    },
    {
      title: 'Volunteer Skills',
      desc: 'Offer professional expertise in educational curriculum, medical coordination, translation, or graphic design.',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      actionText: 'Apply Below',
      action: () => {
        const el = document.getElementById('application-form');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      title: 'Organizational Partnership',
      desc: 'Schools, healthcare clinics, and community associations can coordinate joint relief and educational drives.',
      icon: <Handshake className="w-6 h-6 text-teal-600" />,
      actionText: 'Inquire to Partner',
      action: () => {
        const el = document.getElementById('application-form');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      title: 'Support Education Drives',
      desc: 'Organize school supplies collection drives to send exercise books and pencils to under-resourced classrooms.',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      actionText: 'View Education Cause',
      action: () => onNavigate('cause-detail', 'education')
    },
    {
      title: 'Community Programs',
      desc: 'Help organize local charity runs, community dinners, or awareness roundtables to support child welfare.',
      icon: <Users className="w-6 h-6 text-amber-600" />,
      actionText: 'Join Outreach',
      action: () => {
        const el = document.getElementById('application-form');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      title: 'Share Verified Campaigns',
      desc: 'Amplify verified child-welfare stories and combat sensationalized poverty marketing across networks.',
      icon: <Share2 className="w-6 h-6 text-sky-600" />,
      actionText: 'Browse Campaigns',
      action: () => onNavigate('campaigns')
    }
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email.';
    }
    if (!formData.country.trim()) errs.country = 'Please enter your country of residence.';
    if (!formData.backgroundNote.trim() || formData.backgroundNote.length < 20) {
      errs.backgroundNote = 'Please provide at least 20 characters describing your skills or proposal.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket({
        ticketId: `HB-VOL-${Date.now().toString().slice(-6)}`,
        submittedAt: new Date().toLocaleDateString(),
        data: { ...formData }
      });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        areaOfInterest: 'education',
        availability: 'monthly',
        backgroundNote: ''
      });
    }, 900);
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
            Community Collaboration
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Get Involved with HOPEBRIDGE
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every contribution of time, expertise, advocacy, or financial assistance bridges a child toward security, nutrition, and learning.
          </p>
        </div>

        {/* 6 Involvement Pillars Grid with Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {involvementPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between active:scale-[0.99] transition-all duration-300"
            >
              <div>
                <div className="p-3 bg-stone-100/80 rounded-xl inline-block mb-4 border border-stone-200/50">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                  {pillar.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={pillar.action}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-rose-600 cursor-pointer pt-3 border-t border-stone-200/60 transition-colors group/btn"
              >
                <span>{pillar.actionText}</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Volunteer & Partnership Application Form in Glass Panel */}
        <div
          id="application-form"
          className="glass-panel rounded-3xl p-6 sm:p-10 scroll-mt-24 shadow-xl"
        >
          <div className="border-b border-stone-200 pb-6 mb-6">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
              Application & Inquiries
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Volunteer or Partner With Our Team
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Tell us how you would like to participate. All applicants working with children or sensitive materials undergo standard child safeguarding vetting.
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">
                Application Received Successfully
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{submittedTicket.data.fullName}</strong>. Your inquiry reference number is{' '}
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {submittedTicket.ticketId}
                </span>.
              </p>
              <div className="text-xs text-stone-600 bg-white p-4 rounded-lg border border-emerald-200/60 max-w-lg mx-auto text-left leading-normal">
                <strong>Review Protocol Note:</strong> In accordance with our child safeguarding standards, submission of an application does not guarantee placement. Our volunteer coordinator evaluates applications based on current program requirements, verified credentials, and safeguarding checks.
              </div>
              <button
                type="button"
                onClick={() => setSubmittedTicket(null)}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your legal name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                  />
                  {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="you@domain.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Canada, Germany, Kenya"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                  />
                  {errors.country && <p className="text-xs text-rose-600 mt-1">{errors.country}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Area of Primary Interest *
                  </label>
                  <select
                    value={formData.areaOfInterest}
                    onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="education">Education & School Supplies Support</option>
                    <option value="field-support">Field Logistics & Community Distribution</option>
                    <option value="community-outreach">Community Outreach & Awareness</option>
                    <option value="professional">Professional Skills (Medical, Legal, IT)</option>
                    <option value="fundraising">Grassroots Fundraising & Advocacy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Estimated Availability *
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="weekly">Regular Weekly Commitment (2-5 hrs)</option>
                    <option value="monthly">Monthly Community Drives</option>
                    <option value="occasional">Project-based / Seasonal Initiatives</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Experience, Background & Proposal *
                </label>
                <textarea
                  rows={4}
                  placeholder="Share a brief overview of your background, relevant qualifications, or what partnership your organization envisions..."
                  value={formData.backgroundNote}
                  onChange={(e) => setFormData({ ...formData, backgroundNote: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                />
                {errors.backgroundNote && (
                  <p className="text-xs text-rose-600 mt-1">{errors.backgroundNote}</p>
                )}
              </div>

              {/* Safeguarding notice */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Safe Recruitment Standard: </strong> All candidates whose volunteer roles involve direct contact with children or child beneficiary records must agree to criminal background screening, reference verification, and our Child Safeguarding Code of Conduct.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Volunteer / Partnership Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
