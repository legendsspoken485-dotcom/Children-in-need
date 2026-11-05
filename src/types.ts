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
  | 'donation-terms'
  | 'transparency'
  | 'verified-needs'
  | 'network'
  | 'matching'
  | 'admin';

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

// ----------------------------------------------------
// RBAC & Authentication Types
// ----------------------------------------------------
export type UserRole =
  | 'public'
  | 'donor'
  | 'volunteer'
  | 'partner_lead'
  | 'case_worker'
  | 'safeguarding_officer'
  | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  badgeNumber?: string;
  verifiedAt?: string;
}

// ----------------------------------------------------
// Donation Transparency & Financial Ledger Types
// ----------------------------------------------------
export type DonationPaymentStatus =
  | 'verified_settled'
  | 'simulated_staged'
  | 'pending_wire'
  | 'refunded';

export interface DonationRecord {
  id: string;
  referenceCode: string;
  timestamp: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  fundCategory: string;
  campaignId?: string;
  campaignTitle?: string;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  paymentStatus: DonationPaymentStatus;
  feeCovered: boolean;
  dedication?: string;
  receiptNumber: string;
  sha256Hash: string;
}

export interface DisbursementRecord {
  id: string;
  referenceCode: string;
  timestamp: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  currency: string;
  recipientOrganization: string;
  country: string;
  purpose: string;
  authorizedBy: string;
  status: 'authorized' | 'transferred' | 'reconciled';
  verifiedExpenseCount: number;
  receiptDocumentRef: string;
  sha256Hash: string;
}

export interface VerifiedExpense {
  id: string;
  disbursementId: string;
  vendor: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  receiptRef: string;
  verifiedByOfficer: string;
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
  isAnonymous?: boolean;
  dedication?: string;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
}

// ----------------------------------------------------
// Child Protection & Verified Beneficiaries Types
// ----------------------------------------------------
export type NeedCategory =
  | 'family_preservation'
  | 'therapeutic_nutrition'
  | 'emergency_shelter'
  | 'schooling_supplies'
  | 'critical_pediatric_care'
  | 'community_clean_water';

export type NeedUrgency = 'routine' | 'elevated' | 'critical' | 'emergency';

export type NeedVerificationStatus =
  | 'submitted'
  | 'under_investigation'
  | 'evidence_requested'
  | 'verified_authentic'
  | 'funding_allocated'
  | 'assistance_in_progress'
  | 'fulfilled'
  | 'rejected'
  | 'reverification_due';

export interface ConsentRecord {
  id: string;
  guardianNamePseudonym: string;
  relationshipToChild: 'parent' | 'legal_guardian' | 'community_elder' | 'institutional_director';
  consentGrantedAt: string;
  consentType: 'medical_aid' | 'educational_support' | 'food_aid' | 'shelter_placement';
  isRevocable: boolean;
  verifiedDocumentRef: string;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  type: 'medical_record' | 'school_enrollment' | 'elder_attestation' | 'social_worker_report' | 'ngo_audit';
  submittedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
  status: 'pending' | 'verified' | 'rejected';
  sha256Checksum: string;
}

export interface VerifiedNeed {
  id: string;
  caseCode: string; // e.g. "HB-EDU-2026-081" (Pseudonymized - NEVER exposes full child name)
  category: NeedCategory;
  urgency: NeedUrgency;
  title: string;
  description: string;
  beneficiaryType: 'individual_child' | 'sibling_group' | 'family_unit' | 'orphanage_ward' | 'school_community';
  beneficiaryCount: number;
  ageBracket: '0-4 years' | '5-8 years' | '9-12 years' | '13-17 years' | 'mixed_ages';
  region: string;
  country: string;
  estimatedCost: number;
  allocatedFunding: number;
  currency: string;
  status: NeedVerificationStatus;
  submittingPartnerId: string;
  submittingPartnerName: string;
  verifiedOfficerName?: string;
  verifiedDate?: string;
  reverificationDueDate: string;
  consent: ConsentRecord;
  evidence: EvidenceDocument[];
  allocatedVolunteerIds: string[];
  lastUpdated: string;
}

// ----------------------------------------------------
// Volunteer & Organization Network Types
// ----------------------------------------------------
export type VolunteerSkill =
  | 'pediatric_nursing'
  | 'early_childhood_education'
  | 'trauma_counseling'
  | 'logistics_supply_chain'
  | 'water_sanitation_engineer'
  | 'legal_child_advocacy'
  | 'translation_interpretation'
  | 'community_mobilization';

export interface VolunteerProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  skills: VolunteerSkill[];
  languages: string[];
  availabilityHoursPerWeek: number;
  emergencyDeploymentReady: boolean;
  backgroundCheckStatus: 'unverified' | 'in_review' | 'cleared' | 'expired';
  safeguardingTrained: boolean;
  assignedTaskCount: number;
  registeredDate: string;
}

export interface PartnerOrganization {
  id: string;
  name: string;
  registrationNumber: string;
  country: string;
  city: string;
  focusAreas: CauseCategory[];
  accreditationStatus: 'accredited_active' | 'provisional_review' | 'under_audit' | 'suspended';
  auditExpiryDate: string;
  contactEmail: string;
  leadOfficer: string;
  verifiedCaseCount: number;
  activeDisbursementsTotal: number;
}

export interface AssistanceTask {
  id: string;
  needId: string;
  needCaseCode: string;
  title: string;
  description: string;
  skillRequired: VolunteerSkill;
  estimatedHours: number;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  status: 'open' | 'assigned' | 'in_progress' | 'completed';
  completedDate?: string;
}

// ----------------------------------------------------
// Intelligent Matching Types
// ----------------------------------------------------
export interface MatchingProposal {
  id: string;
  needId: string;
  needCaseCode: string;
  needTitle: string;
  urgency: NeedUrgency;
  matchingScore: number; // 0 to 100
  rationale: string[];
  recommendedDonationAllocation: number;
  currency: string;
  recommendedPartnerId: string;
  recommendedPartnerName: string;
  recommendedVolunteerId?: string;
  recommendedVolunteerName?: string;
  isApplied: boolean;
  createdAt: string;
}

// ----------------------------------------------------
// Audit Trail & Admin Types
// ----------------------------------------------------
export type AuditAction =
  | 'RECORD_CREATED'
  | 'RECORD_UPDATED'
  | 'CASE_VERIFIED'
  | 'CASE_REJECTED'
  | 'DISBURSEMENT_AUTHORIZED'
  | 'DONATION_RECORDED'
  | 'VOLUNTEER_VETTED'
  | 'SAFEGUARDING_REPORT_LOGGED'
  | 'DATA_EXPORT_GENERATED'
  | 'SECURITY_ROLE_CHANGED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  targetType: string;
  targetId: string;
  description: string;
  clientIpHash: string;
  sha256Hash: string;
}

export interface SafeguardingIncident {
  id: string;
  referenceNumber: string;
  timestamp: string;
  reporterPseudonym: string;
  reporterContactEncrypted: string;
  category: 'immediate_physical_safety' | 'neglect' | 'exploitation_risk' | 'privacy_breach' | 'inappropriate_conduct';
  severity: 'low' | 'medium' | 'high' | 'immediate_critical';
  description: string;
  status: 'new' | 'escalated' | 'under_external_review' | 'resolved';
  investigatingOfficer?: string;
  resolutionNotes?: string;
}

export interface VolunteerSubmission {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  areaOfInterest: 'education' | 'field-support' | 'community-outreach' | 'fundraising' | 'professional';
  availability: 'weekly' | 'monthly' | 'occasional';
  backgroundNote: string;
  skills?: VolunteerSkill[];
}

export interface ContactSubmission {
  name: string;
  email: string;
  category: 'general' | 'safeguarding' | 'partnerships' | 'donations' | 'media';
  subject: string;
  message: string;
}
