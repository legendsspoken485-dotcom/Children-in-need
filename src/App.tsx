import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CausesPage } from './pages/CausesPage';
import { CauseDetail } from './components/CauseDetail';
import { CampaignsPage } from './pages/CampaignsPage';
import { AboutPage } from './pages/AboutPage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { CAUSES_DATA } from './data/causes';
import { DEMO_CAMPAIGNS } from './data/campaigns';
import { PageId, CampaignItem, CauseCategory } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedCauseId, setSelectedCauseId] = useState<string>('parental-care');
  const [donationCauseId, setDonationCauseId] = useState<string | undefined>(undefined);
  const [donationCampaignId, setDonationCampaignId] = useState<string | undefined>(undefined);

  // Sync with browser hash if present on initial load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const [page, param] = hash.split('/');
      if (
        [
          'home',
          'causes',
          'cause-detail',
          'campaigns',
          'about',
          'get-involved',
          'donate',
          'contact',
          'safeguarding',
          'privacy',
          'donation-terms'
        ].includes(page)
      ) {
        setCurrentPage(page as PageId);
        if (page === 'cause-detail' && param) {
          setSelectedCauseId(param);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page: PageId, causeId?: string, campaignId?: string) => {
    setCurrentPage(page);
    if (causeId) {
      setSelectedCauseId(causeId);
    }
    if (page === 'donate') {
      setDonationCauseId(causeId);
      setDonationCampaignId(campaignId);
    }
    // Update hash for deep link
    if (page === 'cause-detail' && causeId) {
      window.location.hash = `${page}/${causeId}`;
    } else {
      window.location.hash = page;
    }
    // Scroll window smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCause = (causeId: string) => {
    navigateTo('cause-detail', causeId);
  };

  const handleDonateToCause = (causeId?: string) => {
    navigateTo('donate', causeId);
  };

  const handleDonateToCampaign = (campaign: CampaignItem) => {
    navigateTo('donate', campaign.causeId, campaign.id);
  };

  // Find currently active cause
  const currentCause =
    CAUSES_DATA.find((c) => c.id === selectedCauseId) || CAUSES_DATA[0];

  // Related campaigns for currently selected cause
  const relatedCampaigns = DEMO_CAMPAIGNS.filter(
    (camp) => camp.causeId === currentCause.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] text-stone-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navigation */}
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectCause={handleSelectCause}
            onDonate={handleDonateToCause}
            onDonateCampaign={handleDonateToCampaign}
          />
        )}

        {currentPage === 'causes' && (
          <CausesPage
            onSelectCause={handleSelectCause}
            onDonateToCause={handleDonateToCause}
            onNavigateGetInvolved={() => navigateTo('get-involved')}
          />
        )}

        {currentPage === 'cause-detail' && (
          <CauseDetail
            cause={currentCause}
            relatedCampaigns={relatedCampaigns}
            onBack={() => navigateTo('causes')}
            onSelectCause={handleSelectCause}
            onDonate={(cId, campId) => navigateTo('donate', cId, campId)}
            onGetInvolved={() => navigateTo('get-involved')}
          />
        )}

        {currentPage === 'campaigns' && (
          <CampaignsPage
            onDonateToCampaign={handleDonateToCampaign}
            onSelectCause={handleSelectCause}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}

        {currentPage === 'get-involved' && <GetInvolvedPage onNavigate={navigateTo} />}

        {currentPage === 'donate' && (
          <DonatePage
            initialCauseId={donationCauseId}
            initialCampaignId={donationCampaignId}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigatePolicy={(policy) => navigateTo(policy)} />
        )}

        {(currentPage === 'safeguarding' ||
          currentPage === 'privacy' ||
          currentPage === 'donation-terms') && (
          <PolicyPage
            initialPolicy={currentPage}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Comprehensive Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
