export type PageId =
  | 'home'
  | 'causes'
  | 'cause-detail'
  | 'campaigns'
  | 'about'
  | 'get-involved'
  | 'donate'
  | 'contact'
  | 'safeguarding'
  | 'privacy'
  | 'donation-terms';

export type CauseCategory =
  | 'parental-care'
  | 'nutrition'
  | 'shelter'
  | 'education'
  | 'healthcare'
  | 'clean-water';

export interface CauseItem {
  id: CauseCategory;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
  whyItMatters: string[];
  typesOfAssistance: string[];
  responsibleDelivery: string[];
  partnerRole: string;
  stagedCampaignIds: string[];
}

export interface CampaignItem {
  id: string;
  title: string;
  causeId: CauseCategory;
  causeName: string;
  region: string;
  country: string;
  description: string;
  detailedNeed: string;
  image: string;
  imageAlt: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  status: 'active-preparation' | 'community-pilot' | 'fully-funded-staged';
  isDemonstrationData: boolean;
}

export interface DonationSubmission {
  campaignId?: string;
  campaignTitle?: string;
  frequency: 'one-time' | 'monthly';
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  coverFees: boolean;
  donorName: string;
  donorEmail: string;
  dedication?: string;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
}

export interface ContactSubmission {
  name: string;
  email: string;
  category: 'general' | 'safeguarding' | 'partnerships' | 'donations' | 'media';
  subject: string;
  message: string;
}

export interface VolunteerSubmission {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  areaOfInterest: 'education' | 'field-support' | 'community-outreach' | 'fundraising' | 'professional';
  availability: 'weekly' | 'monthly' | 'occasional';
  backgroundNote: string;
}
