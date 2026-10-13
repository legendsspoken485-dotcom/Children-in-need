import React, { useState } from 'react';
import { Mail, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Send, HelpCircle } from 'lucide-react';
import { ContactSubmission, PageId } from '../types';

interface ContactPageProps {
  onNavigatePolicy: (policy: PageId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigatePolicy }) => {
  const [formData, setFormData] = useState<ContactSubmission>({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  // Human anti-spam challenge
  const [spamAnswer, setSpamAnswer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedTime, setLastSubmittedTime] = useState<number | null>(null);

  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    submittedAt: string;
    category: string;
  } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    // Rate limiting check (prevent submissions within 15 seconds)
    if (lastSubmittedTime && Date.now() - lastSubmittedTime < 15000) {
      errs.form = 'Please wait a moment before sending another message.';
    }

    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please enter a message subject.';
    } else if (formData.subject.trim().length < 4) {
      errs.subject = 'Subject must be at least 4 characters long.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please provide your message.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must be at least 15 characters long.';
    }

    // Anti-spam math verification
    if (spamAnswer.trim() !== '7') {
      errs.spam = 'Please enter the correct answer to the verification question (4 + 3 = 7).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate secure server-side transmission and ticket creation
    setTimeout(() => {
      setIsSubmitting(false);
      const ref = `HB-INQ-${Date.now().toString().slice(-6)}`;
      setLastSubmittedTime(Date.now());
      setSubmissionResult({
        referenceId: ref,
        submittedAt: new Date().toLocaleTimeString(),
        category: formData.category
      });
      setFormData({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: ''
      });
      setSpamAnswer('');
    }, 1000);
  };

  // Interactive FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How are child safeguarding reports handled?',
      a: 'Reports regarding the safety or welfare of a child are escalated immediately to our designated safeguarding officer. All disclosures are treated with strict confidentiality and investigated according to our Child Protection Protocols.'
    },
    {
      q: 'How quickly does the team respond to general inquiries?',
      a: 'General administrative inquiries and partnership requests receive a formal response within 1 to 2 business days. Emergency safeguarding concerns receive immediate priority.'
    },
    {
      q: 'What is required to volunteer or partner with HOPEBRIDGE?',
      a: 'All prospective volunteers and implementing partners undergo standard child safeguarding vetting, legal verification, and adherence to our Child Protection Code of Conduct.'
    }
  ];

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-bold block mb-1">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Contact HOPEBRIDGE
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Have questions about our child-welfare programs, partnership criteria, or safeguarding practices? Our team is here to assist.
          </p>
        </div>

        {/* Priority Child Protection Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-950 flex items-start gap-3.5 text-xs shadow-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-semibold text-rose-900">
              Reporting Urgent Child Safeguarding Concerns
            </strong>
            If your message concerns the immediate safety, potential abuse, or exploitation of a child, please select "Child Safeguarding Concern" below or contact our designated protection officer directly at{' '}
            <a
              href="mailto:safeguarding@hopebridge.org"
              className="underline font-semibold text-rose-900"
            >
              safeguarding@hopebridge.org
            </a>
            . Reports are handled with absolute confidentiality and immediate priority.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Official Contact Info & Interactive FAQ Sidebar */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Official Channels
              </h3>
              <div className="space-y-3 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 font-medium block">General Inquiries:</span>
                  <span className="text-stone-900 font-semibold">info@hopebridge.org</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Child Safeguarding:</span>
                  <span className="text-rose-700 font-semibold">safeguarding@hopebridge.org</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Partnerships & Field:</span>
                  <span className="text-stone-900 font-semibold">partners@hopebridge.org</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Donations & Support:</span>
                  <span className="text-stone-900 font-semibold">giving@hopebridge.org</span>
                </div>
              </div>
            </div>

            {/* Interactive Accordion for Common Inquiries */}
            <div className="glass-card rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                Frequent Questions
              </h3>
              <div className="space-y-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-stone-200/60 rounded-xl overflow-hidden bg-white/60 transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-2.5 text-left text-xs font-bold text-stone-800 hover:text-rose-700 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="text-stone-400 font-mono text-sm shrink-0">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-2.5 pb-2.5 text-[11px] text-stone-600 leading-relaxed border-t border-stone-100 animate-modal-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                Office Information
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                HOPEBRIDGE maintains an administrative staging desk during regional program preparation. Official regional representation offices are published in coordination with local government registration.
              </p>
              <div className="mt-4 pt-3 border-t border-stone-200/50">
                <button
                  type="button"
                  onClick={() => onNavigatePolicy('safeguarding')}
                  className="text-xs text-rose-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Safeguarding Policy</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Functional Contact Form with Glassmorphism */}
          <div className="md:col-span-2">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
              {submissionResult ? (
                <div className="p-8 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been logged securely under reference ticket{' '}
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                      {submissionResult.referenceId}
                    </span>
                    . Our administrative team will review your message within 1–2 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmissionResult(null)}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errors.form && (
                    <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                      {errors.form}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="First and last name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                      />
                      {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                      />
                      {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="general">General Information Inquiry</option>
                      <option value="safeguarding">🚨 Child Safeguarding Concern (High Priority)</option>
                      <option value="partnerships">Partner / Implementer Assessment</option>
                      <option value="donations">Donations & Support Assistance</option>
                      <option value="media">Press & Academic Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      placeholder="Brief topic of your inquiry"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                      }}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                    />
                    {errors.subject && <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please write your message clearly..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                      }}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                    />
                    {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
                  </div>

                  {/* Anti-Spam Security Question */}
                  <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Security Verification: What is 4 + 3? *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the number 7"
                      value={spamAnswer}
                      onChange={(e) => {
                        setSpamAnswer(e.target.value);
                        if (errors.spam) setErrors((prev) => ({ ...prev, spam: '' }));
                      }}
                      className="w-32 px-3 py-1.5 text-sm rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-rose-500"
                    />
                    {errors.spam && <p className="text-xs text-rose-600 mt-1">{errors.spam}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to HOPEBRIDGE</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-stone-500 text-center">
                    Messages are transmitted securely. Submitted inquiries are never displayed publicly.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
