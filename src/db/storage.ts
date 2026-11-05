import {
  DonationRecord,
  DisbursementRecord,
  VerifiedExpense,
  VerifiedNeed,
  VolunteerProfile,
  PartnerOrganization,
  AssistanceTask,
  MatchingProposal,
  AuditLogEntry,
  SafeguardingIncident,
  UserRole,
  DonationSubmission,
  VolunteerSubmission,
  ContactSubmission
} from '../types';

const STORAGE_KEYS = {
  DONATIONS: 'hopebridge_db_donations',
  DISBURSEMENTS: 'hopebridge_db_disbursements',
  EXPENSES: 'hopebridge_db_expenses',
  NEEDS: 'hopebridge_db_needs',
  VOLUNTEERS: 'hopebridge_db_volunteers',
  PARTNERS: 'hopebridge_db_partners',
  TASKS: 'hopebridge_db_tasks',
  MATCHES: 'hopebridge_db_matches',
  AUDIT: 'hopebridge_db_audit_logs',
  SAFEGUARDING: 'hopebridge_db_safeguarding_reports',
  INITIALIZED: 'hopebridge_db_initialized_v2'
};

// Simple in-memory fallback for SSR/prerender environments
const memoryCache: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return memoryCache[key] || null;
  } catch {
    return memoryCache[key] || null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
    memoryCache[key] = value;
  } catch {
    memoryCache[key] = value;
  }
}

// ----------------------------------------------------
// Cryptographic Web Crypto SHA-256 Utility
// ----------------------------------------------------
export async function calculateSha256(data: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // fallback simple hash
    }
  }
  // Deterministic fallback hash for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'hb_hash_' + Math.abs(hash).toString(16).padStart(8, '0');
}

// ----------------------------------------------------
// Event Emitter for Real-Time UI Reactivity
// ----------------------------------------------------
type StoreListener = () => void;
const listeners: Set<StoreListener> = new Set();

export function subscribeToStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifySubscribers(): void {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Store listener error:', e);
    }
  });
}

// ----------------------------------------------------
// Baseline Initial Organizational Records
// ----------------------------------------------------
const SEED_PARTNERS: PartnerOrganization[] = [
  {
    id: 'org-kenya-wash',
    name: 'Turkana Community Water & Health Mission',
    registrationNumber: 'NGO-KE-2018-9941',
    country: 'Kenya',
    city: 'Lodwar',
    focusAreas: ['clean-water', 'healthcare'],
    accreditationStatus: 'accredited_active',
    auditExpiryDate: '2027-06-30',
    contactEmail: 'turkana.mission@hopebridge.org',
    leadOfficer: 'Dr. Joseph Lokiru, MD',
    verifiedCaseCount: 14,
    activeDisbursementsTotal: 12500
  },
  {
    id: 'org-peru-edu',
    name: 'Andean Children Literacy & Family Preservation Foundation',
    registrationNumber: 'NGO-PE-2019-3382',
    country: 'Peru',
    city: 'Cusco',
    focusAreas: ['education', 'parental-care'],
    accreditationStatus: 'accredited_active',
    auditExpiryDate: '2027-04-15',
    contactEmail: 'andean.kids@hopebridge.org',
    leadOfficer: 'Elena Quispe, MSW',
    verifiedCaseCount: 22,
    activeDisbursementsTotal: 8400
  },
  {
    id: 'org-honduras-shelter',
    name: 'Valle de Ángeles Safe Haven & Crisis Center',
    registrationNumber: 'NGO-HN-2021-0417',
    country: 'Honduras',
    city: 'Tegucigalpa',
    focusAreas: ['shelter', 'nutrition'],
    accreditationStatus: 'accredited_active',
    auditExpiryDate: '2027-08-31',
    contactEmail: 'valle.shelter@hopebridge.org',
    leadOfficer: 'Sister Maria Hernandez',
    verifiedCaseCount: 18,
    activeDisbursementsTotal: 15200
  }
];

const SEED_NEEDS: VerifiedNeed[] = [
  {
    id: 'need-001',
    caseCode: 'HB-WAT-2026-014',
    category: 'community_clean_water',
    urgency: 'critical',
    title: 'Solar Deep-Well Filtration for 220 Primary Students & Caregivers',
    description: 'Borehole water contains unsafe bacterial contamination. Solar powered UV filtration system required to provide clean drinking water and prevent waterborne gastrointestinal illnesses.',
    beneficiaryType: 'school_community',
    beneficiaryCount: 220,
    ageBracket: '5-8 years',
    region: 'Turkana Basin',
    country: 'Kenya',
    estimatedCost: 4800,
    allocatedFunding: 4800,
    currency: 'USD',
    status: 'funding_allocated',
    submittingPartnerId: 'org-kenya-wash',
    submittingPartnerName: 'Turkana Community Water & Health Mission',
    verifiedOfficerName: 'Marcus Vance, Lead Verification Officer',
    verifiedDate: '2026-10-14',
    reverificationDueDate: '2027-04-14',
    consent: {
      id: 'cons-001',
      guardianNamePseudonym: 'Elder Council of Katilu',
      relationshipToChild: 'community_elder',
      consentGrantedAt: '2026-10-10',
      consentType: 'medical_aid',
      isRevocable: false,
      verifiedDocumentRef: 'DOC-TURKANA-WAT-CONSENT-2026'
    },
    evidence: [
      {
        id: 'ev-001',
        title: 'Ministry of Water Bacterial Analysis Report',
        type: 'ngo_audit',
        submittedDate: '2026-10-09',
        verifiedBy: 'Dr. Joseph Lokiru',
        verifiedDate: '2026-10-12',
        status: 'verified',
        sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ],
    allocatedVolunteerIds: ['vol-001'],
    lastUpdated: '2026-10-28'
  },
  {
    id: 'need-002',
    caseCode: 'HB-EDU-2026-042',
    category: 'schooling_supplies',
    urgency: 'elevated',
    title: 'Textbooks, Uniforms & Learning Kits for 45 Displaced Children',
    description: 'Providing comprehensive bilingual Spanish/Quechua school learning kits, warm uniforms, and backpacks for children living with elderly kin caregivers to prevent classroom dropout.',
    beneficiaryType: 'sibling_group',
    beneficiaryCount: 45,
    ageBracket: '9-12 years',
    region: 'Sacred Valley Highlands',
    country: 'Peru',
    estimatedCost: 3150,
    allocatedFunding: 2400,
    currency: 'USD',
    status: 'assistance_in_progress',
    submittingPartnerId: 'org-peru-edu',
    submittingPartnerName: 'Andean Children Literacy Foundation',
    verifiedOfficerName: 'Clara Santos, Social Worker Lead',
    verifiedDate: '2026-10-18',
    reverificationDueDate: '2027-04-18',
    consent: {
      id: 'cons-002',
      guardianNamePseudonym: 'Kinship Caregivers Association',
      relationshipToChild: 'legal_guardian',
      consentGrantedAt: '2026-10-15',
      consentType: 'educational_support',
      isRevocable: true,
      verifiedDocumentRef: 'DOC-ANDES-EDU-2026'
    },
    evidence: [
      {
        id: 'ev-002',
        title: 'Accredited Rural District School Enrollment Rolls',
        type: 'school_enrollment',
        submittedDate: '2026-10-16',
        verifiedBy: 'Elena Quispe',
        verifiedDate: '2026-10-17',
        status: 'verified',
        sha256Checksum: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
      }
    ],
    allocatedVolunteerIds: ['vol-002'],
    lastUpdated: '2026-11-01'
  },
  {
    id: 'need-003',
    caseCode: 'HB-MED-2026-089',
    category: 'critical_pediatric_care',
    urgency: 'emergency',
    title: 'Specialized Pediatric Respiratory Therapy & Nutrition for Sibling Pair',
    description: 'Urgent nebulizer treatment and specialized infant caloric formula for two young siblings in temporary crisis shelter recovering from severe bronchitis.',
    beneficiaryType: 'individual_child',
    beneficiaryCount: 2,
    ageBracket: '0-4 years',
    region: 'Francisco Morazán',
    country: 'Honduras',
    estimatedCost: 1850,
    allocatedFunding: 1850,
    currency: 'USD',
    status: 'verified_authentic',
    submittingPartnerId: 'org-honduras-shelter',
    submittingPartnerName: 'Valle de Ángeles Safe Haven',
    verifiedOfficerName: 'Dr. Hector Morales, Safeguarding Physician',
    verifiedDate: '2026-11-03',
    reverificationDueDate: '2027-05-03',
    consent: {
      id: 'cons-003',
      guardianNamePseudonym: 'Maternal Grandmother (Sole Custodian)',
      relationshipToChild: 'legal_guardian',
      consentGrantedAt: '2026-11-02',
      consentType: 'medical_aid',
      isRevocable: false,
      verifiedDocumentRef: 'DOC-HON-MED-089-CONFIDENTIAL'
    },
    evidence: [
      {
        id: 'ev-003',
        title: 'Metropolitan Hospital Pediatric Diagnostic Summary',
        type: 'medical_record',
        submittedDate: '2026-11-02',
        verifiedBy: 'Dr. Hector Morales',
        verifiedDate: '2026-11-03',
        status: 'verified',
        sha256Checksum: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      }
    ],
    allocatedVolunteerIds: [],
    lastUpdated: '2026-11-04'
  }
];

const SEED_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: 'vol-001',
    fullName: 'David M. Lindqvist',
    email: 'd.lindqvist.volunteer@hopebridge.org',
    country: 'Sweden',
    region: 'Global Emergency Pool',
    skills: ['water_sanitation_engineer', 'logistics_supply_chain'],
    languages: ['English', 'Swedish', 'Swahili (conversational)'],
    availabilityHoursPerWeek: 12,
    emergencyDeploymentReady: true,
    backgroundCheckStatus: 'cleared',
    safeguardingTrained: true,
    assignedTaskCount: 2,
    registeredDate: '2026-08-12'
  },
  {
    id: 'vol-002',
    fullName: 'Maria Sofia Alvarez',
    email: 'm.alvarez.volunteer@hopebridge.org',
    country: 'Spain',
    region: 'Latin America Coordination',
    skills: ['early_childhood_education', 'translation_interpretation'],
    languages: ['Spanish (native)', 'English (fluent)', 'Quechua (basic)'],
    availabilityHoursPerWeek: 15,
    emergencyDeploymentReady: false,
    backgroundCheckStatus: 'cleared',
    safeguardingTrained: true,
    assignedTaskCount: 3,
    registeredDate: '2026-09-04'
  },
  {
    id: 'vol-003',
    fullName: 'Dr. Sarah Chen, RN',
    email: 's.chen.volunteer@hopebridge.org',
    country: 'Canada',
    region: 'Pediatric Medical Flight Team',
    skills: ['pediatric_nursing', 'trauma_counseling'],
    languages: ['English', 'Mandarin', 'French'],
    availabilityHoursPerWeek: 10,
    emergencyDeploymentReady: true,
    backgroundCheckStatus: 'cleared',
    safeguardingTrained: true,
    assignedTaskCount: 1,
    registeredDate: '2026-07-20'
  }
];

const SEED_DONATIONS: DonationRecord[] = [
  {
    id: 'don-1001',
    referenceCode: 'HB-DON-202610-8819',
    timestamp: '2026-10-15T14:22:00Z',
    amount: 500,
    currency: 'USD',
    donorName: 'Anonymous Supporter',
    donorEmail: 'verified-donor-88@proton.me',
    isAnonymous: true,
    fundCategory: 'clean-water',
    campaignId: 'camp-water-filters',
    campaignTitle: 'Emergency Clean Water & Hygiene for Children',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'verified_settled',
    feeCovered: true,
    receiptNumber: 'RCPT-2026-1001',
    sha256Hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'
  },
  {
    id: 'don-1002',
    referenceCode: 'HB-DON-202610-9104',
    timestamp: '2026-10-21T09:15:00Z',
    amount: 1200,
    currency: 'USD',
    donorName: 'Global Childhood Hope Circle',
    donorEmail: 'giving@hopecircle.org',
    isAnonymous: false,
    fundCategory: 'education',
    campaignId: 'camp-classroom-books',
    campaignTitle: 'Primary School Learning Supplies & Literacy Packs',
    paymentMethod: 'card',
    paymentStatus: 'verified_settled',
    feeCovered: true,
    receiptNumber: 'RCPT-2026-1002',
    sha256Hash: 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01'
  },
  {
    id: 'don-1003',
    referenceCode: 'HB-DON-202611-0422',
    timestamp: '2026-11-02T16:40:00Z',
    amount: 250,
    currency: 'USD',
    donorName: 'Elena Rostova',
    donorEmail: 'elena.rostova@gmail.com',
    isAnonymous: false,
    fundCategory: 'parental-care',
    campaignId: 'camp-kinship-stipends',
    campaignTitle: 'Kinship & Foster Family Stabilization Grants',
    paymentMethod: 'card',
    paymentStatus: 'verified_settled',
    feeCovered: true,
    receiptNumber: 'RCPT-2026-1003',
    sha256Hash: 'c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012'
  }
];

const SEED_DISBURSEMENTS: DisbursementRecord[] = [
  {
    id: 'disb-001',
    referenceCode: 'HB-DISB-202610-001',
    timestamp: '2026-10-18T11:00:00Z',
    campaignId: 'camp-water-filters',
    campaignTitle: 'Emergency Clean Water & Hygiene for Children',
    amount: 4800,
    currency: 'USD',
    recipientOrganization: 'Turkana Community Water & Health Mission',
    country: 'Kenya',
    purpose: 'Procurement and certified field installation of Solar UV filtration unit and 10,000L food-grade reservoir tank.',
    authorizedBy: 'Audrey Sinclair, Financial Controller',
    status: 'reconciled',
    verifiedExpenseCount: 3,
    receiptDocumentRef: 'RECON-TURKANA-2026-10',
    sha256Hash: 'd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0123'
  },
  {
    id: 'disb-002',
    referenceCode: 'HB-DISB-202610-002',
    timestamp: '2026-10-25T14:30:00Z',
    campaignId: 'camp-classroom-books',
    campaignTitle: 'Primary School Learning Supplies & Literacy Packs',
    amount: 2400,
    currency: 'USD',
    recipientOrganization: 'Andean Children Literacy & Family Preservation Foundation',
    country: 'Peru',
    purpose: 'Direct purchase of accredited Quechua/Spanish dual-language reader sets, notebooks, pencil kits, and thermal school sweaters for 45 registered students.',
    authorizedBy: 'Audrey Sinclair, Financial Controller',
    status: 'transferred',
    verifiedExpenseCount: 2,
    receiptDocumentRef: 'RECON-CUSCO-2026-10',
    sha256Hash: 'e5f67890123456789abcdef0123456789abcdef0123456789abcdef01234'
  }
];

const SEED_EXPENSES: VerifiedExpense[] = [
  {
    id: 'exp-001',
    disbursementId: 'disb-001',
    vendor: 'SolarFlow East Africa Ltd.',
    description: 'Commercial Solar Pump & Ultraviolet Stage 3 Disinfection Core',
    amount: 3200,
    currency: 'USD',
    date: '2026-10-20',
    receiptRef: 'INV-SOLARFLOW-8841',
    verifiedByOfficer: 'Eng. David Lindqvist (Inspector)'
  },
  {
    id: 'exp-002',
    disbursementId: 'disb-001',
    vendor: 'Lodwar Community Hardware & Logistics',
    description: 'High-density polyethylene piping and food-grade water storage tank',
    amount: 1600,
    currency: 'USD',
    date: '2026-10-22',
    receiptRef: 'INV-LODWAR-0943',
    verifiedByOfficer: 'Dr. Joseph Lokiru (Field Lead)'
  },
  {
    id: 'exp-003',
    disbursementId: 'disb-002',
    vendor: 'Editorial Andina Cusco',
    description: '45 Student Textbook and Bilingual Early Literacy Curriculum Sets',
    amount: 1800,
    currency: 'USD',
    date: '2026-10-27',
    receiptRef: 'BOL-CUSCO-44910',
    verifiedByOfficer: 'Elena Quispe (Lead Social Worker)'
  }
];

const SEED_TASKS: AssistanceTask[] = [
  {
    id: 'task-001',
    needId: 'need-001',
    needCaseCode: 'HB-WAT-2026-014',
    title: 'Water Quality Testing & Filtration Calibration',
    description: 'Conduct microbiological baseline and post-installation water testing at primary school borehole.',
    skillRequired: 'water_sanitation_engineer',
    estimatedHours: 16,
    assignedVolunteerId: 'vol-001',
    assignedVolunteerName: 'David M. Lindqvist',
    status: 'in_progress'
  },
  {
    id: 'task-002',
    needId: 'need-002',
    needCaseCode: 'HB-EDU-2026-042',
    title: 'Bilingual Educational Kit Delivery & Tutor Orientation',
    description: 'Distribute curriculum books to elderly kinship caregivers and conduct literacy coaching sessions.',
    skillRequired: 'early_childhood_education',
    estimatedHours: 20,
    assignedVolunteerId: 'vol-002',
    assignedVolunteerName: 'Maria Sofia Alvarez',
    status: 'in_progress'
  },
  {
    id: 'task-003',
    needId: 'need-003',
    needCaseCode: 'HB-MED-2026-089',
    title: 'Pediatric Nebulizer Administration & Caregiver Guidance',
    description: 'Assist clinic nurse with in-home delivery of pediatric respiratory medications and sanitizing equipment.',
    skillRequired: 'pediatric_nursing',
    estimatedHours: 8,
    status: 'open'
  }
];

const SEED_AUDIT: AuditLogEntry[] = [
  {
    id: 'audit-101',
    timestamp: '2026-10-14T10:15:00Z',
    actorName: 'Marcus Vance',
    actorRole: 'case_worker',
    action: 'CASE_VERIFIED',
    targetType: 'VerifiedNeed',
    targetId: 'need-001',
    description: 'Verified bacterial contamination water need for Turkana School with official Ministry lab report.',
    clientIpHash: 'e3b0c442',
    sha256Hash: 'f67890123456789abcdef0123456789abcdef0123456789abcdef01234567'
  },
  {
    id: 'audit-102',
    timestamp: '2026-10-18T11:05:00Z',
    actorName: 'Audrey Sinclair',
    actorRole: 'admin',
    action: 'DISBURSEMENT_AUTHORIZED',
    targetType: 'DisbursementRecord',
    targetId: 'disb-001',
    description: 'Authorized $4,800 USD field disbursement to Turkana Community Water & Health Mission for solar UV installation.',
    clientIpHash: '7f83b165',
    sha256Hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  },
  {
    id: 'audit-103',
    timestamp: '2026-11-03T17:00:00Z',
    actorName: 'Dr. Hector Morales',
    actorRole: 'safeguarding_officer',
    action: 'RECORD_CREATED',
    targetType: 'ConsentRecord',
    targetId: 'cons-003',
    description: 'Executed formal child medical consent with maternal grandmother custodian under HB Safeguarding Protocol v2.',
    clientIpHash: '6b86b273',
    sha256Hash: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0'
  }
];

// Initialize database with seed data if not present
export function initializeDatabase(): void {
  const initialized = safeGetItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    safeSetItem(STORAGE_KEYS.PARTNERS, JSON.stringify(SEED_PARTNERS));
    safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(SEED_NEEDS));
    safeSetItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(SEED_VOLUNTEERS));
    safeSetItem(STORAGE_KEYS.DONATIONS, JSON.stringify(SEED_DONATIONS));
    safeSetItem(STORAGE_KEYS.DISBURSEMENTS, JSON.stringify(SEED_DISBURSEMENTS));
    safeSetItem(STORAGE_KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
    safeSetItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
    safeSetItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT));
    safeSetItem(STORAGE_KEYS.SAFEGUARDING, JSON.stringify([]));
    safeSetItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));
    safeSetItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// ----------------------------------------------------
// Public Audit Logger
// ----------------------------------------------------
export async function logAuditEvent(
  actorName: string,
  actorRole: UserRole,
  action: AuditLogEntry['action'],
  targetType: string,
  targetId: string,
  description: string
): Promise<AuditLogEntry> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.AUDIT) || '[]';
  const logs: AuditLogEntry[] = JSON.parse(raw);

  const timestamp = new Date().toISOString();
  const payloadToHash = `${timestamp}|${actorName}|${action}|${targetType}|${targetId}|${description}`;
  const sha256Hash = await calculateSha256(payloadToHash);

  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    actorName,
    actorRole,
    action,
    targetType,
    targetId,
    description,
    clientIpHash: sha256Hash.substring(0, 8),
    sha256Hash
  };

  logs.unshift(entry);
  safeSetItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs.slice(0, 200))); // keep 200 latest logs
  notifySubscribers();
  return entry;
}

export function getAuditLogs(): AuditLogEntry[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.AUDIT) || '[]';
  return JSON.parse(raw);
}

// ----------------------------------------------------
// Donation Ledger & Financial Transparency
// ----------------------------------------------------
export async function recordDonation(
  submission: DonationSubmission,
  actorRole: UserRole = 'donor'
): Promise<DonationRecord> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.DONATIONS) || '[]';
  const list: DonationRecord[] = JSON.parse(raw);

  const timestamp = new Date().toISOString();
  const referenceCode = `HB-DON-${timestamp.substring(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const receiptNumber = `RCPT-${Date.now()}`;
  const hashString = `${referenceCode}|${submission.amount}|${submission.currency}|${submission.donorEmail}|${timestamp}`;
  const sha256Hash = await calculateSha256(hashString);

  const record: DonationRecord = {
    id: `don-${Date.now()}`,
    referenceCode,
    timestamp,
    amount: submission.amount,
    currency: submission.currency,
    donorName: submission.isAnonymous ? 'Anonymous Supporter' : submission.donorName,
    donorEmail: submission.donorEmail,
    isAnonymous: Boolean(submission.isAnonymous),
    fundCategory: submission.campaignId ? 'campaign_earmarked' : 'general_children_fund',
    campaignId: submission.campaignId,
    campaignTitle: submission.campaignTitle || 'General Children Support Fund',
    paymentMethod: submission.paymentMethod,
    paymentStatus: 'verified_settled',
    feeCovered: submission.coverFees,
    dedication: submission.dedication,
    receiptNumber,
    sha256Hash
  };

  list.unshift(record);
  safeSetItem(STORAGE_KEYS.DONATIONS, JSON.stringify(list));

  await logAuditEvent(
    submission.isAnonymous ? 'Anonymous Supporter' : submission.donorName,
    actorRole,
    'DONATION_RECORDED',
    'DonationRecord',
    record.id,
    `Recorded contribution of ${submission.currency} ${submission.amount.toLocaleString()} for ${record.campaignTitle}`
  );

  notifySubscribers();
  return record;
}

export function getDonations(): DonationRecord[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.DONATIONS) || '[]';
  return JSON.parse(raw);
}

export function getDisbursements(): DisbursementRecord[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.DISBURSEMENTS) || '[]';
  return JSON.parse(raw);
}

export function getVerifiedExpenses(): VerifiedExpense[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.EXPENSES) || '[]';
  return JSON.parse(raw);
}

export async function authorizeDisbursement(
  campaignId: string,
  campaignTitle: string,
  amount: number,
  currency: string,
  recipientOrganization: string,
  country: string,
  purpose: string,
  authorizedBy: string
): Promise<DisbursementRecord> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.DISBURSEMENTS) || '[]';
  const list: DisbursementRecord[] = JSON.parse(raw);

  const timestamp = new Date().toISOString();
  const referenceCode = `HB-DISB-${timestamp.substring(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
  const sha256Hash = await calculateSha256(`${referenceCode}|${amount}|${recipientOrganization}|${timestamp}`);

  const record: DisbursementRecord = {
    id: `disb-${Date.now()}`,
    referenceCode,
    timestamp,
    campaignId,
    campaignTitle,
    amount,
    currency,
    recipientOrganization,
    country,
    purpose,
    authorizedBy,
    status: 'transferred',
    verifiedExpenseCount: 0,
    receiptDocumentRef: `DOC-DISB-${Date.now()}`,
    sha256Hash
  };

  list.unshift(record);
  safeSetItem(STORAGE_KEYS.DISBURSEMENTS, JSON.stringify(list));

  await logAuditEvent(
    authorizedBy,
    'admin',
    'DISBURSEMENT_AUTHORIZED',
    'DisbursementRecord',
    record.id,
    `Authorized aid transfer of ${currency} ${amount.toLocaleString()} to ${recipientOrganization} (${country})`
  );

  notifySubscribers();
  return record;
}

export async function recordVerifiedExpense(
  disbursementId: string,
  vendor: string,
  description: string,
  amount: number,
  currency: string,
  receiptRef: string,
  verifiedByOfficer: string
): Promise<VerifiedExpense> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.EXPENSES) || '[]';
  const list: VerifiedExpense[] = JSON.parse(raw);

  const expense: VerifiedExpense = {
    id: `exp-${Date.now()}`,
    disbursementId,
    vendor,
    description,
    amount,
    currency,
    date: new Date().toISOString().substring(0, 10),
    receiptRef,
    verifiedByOfficer
  };

  list.unshift(expense);
  safeSetItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));

  // update expense count on disbursement
  const rawDisb = safeGetItem(STORAGE_KEYS.DISBURSEMENTS) || '[]';
  const disbursements: DisbursementRecord[] = JSON.parse(rawDisb);
  const disb = disbursements.find((d) => d.id === disbursementId);
  if (disb) {
    disb.verifiedExpenseCount = (disb.verifiedExpenseCount || 0) + 1;
    safeSetItem(STORAGE_KEYS.DISBURSEMENTS, JSON.stringify(disbursements));
  }

  await logAuditEvent(
    verifiedByOfficer,
    'case_worker',
    'RECORD_CREATED',
    'VerifiedExpense',
    expense.id,
    `Reconciled field expense of ${currency} ${amount.toLocaleString()} from ${vendor}`
  );

  notifySubscribers();
  return expense;
}

export function getFinancialOverview() {
  const donations = getDonations();
  const disbursements = getDisbursements();
  const expenses = getVerifiedExpenses();

  const totalDonationsUSD = donations.reduce((acc, d) => acc + d.amount, 0);
  const totalDisbursedUSD = disbursements.reduce((acc, d) => acc + d.amount, 0);
  const totalExpensesUSD = expenses.reduce((acc, e) => acc + e.amount, 0);
  const escrowBalance = Math.max(0, totalDonationsUSD - totalDisbursedUSD);

  return {
    totalDonationsUSD,
    totalDisbursedUSD,
    totalExpensesUSD,
    escrowBalance,
    donationCount: donations.length,
    disbursementCount: disbursements.length,
    verifiedExpenseCount: expenses.length,
    settlementRatePercent: totalDonationsUSD > 0 ? Math.min(100, Math.round((totalDisbursedUSD / totalDonationsUSD) * 100)) : 0
  };
}

// ----------------------------------------------------
// Child Protection & Verified Beneficiaries
// ----------------------------------------------------
export function getVerifiedNeeds(): VerifiedNeed[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.NEEDS) || '[]';
  return JSON.parse(raw);
}

export async function createVerifiedNeed(
  needData: Omit<VerifiedNeed, 'id' | 'caseCode' | 'lastUpdated' | 'allocatedFunding' | 'allocatedVolunteerIds'>,
  officerName: string
): Promise<VerifiedNeed> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.NEEDS) || '[]';
  const list: VerifiedNeed[] = JSON.parse(raw);

  const prefix = needData.category.substring(0, 3).toUpperCase();
  const caseCode = `HB-${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const need: VerifiedNeed = {
    ...needData,
    id: `need-${Date.now()}`,
    caseCode,
    allocatedFunding: 0,
    allocatedVolunteerIds: [],
    lastUpdated: new Date().toISOString()
  };

  list.unshift(need);
  safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    'case_worker',
    'RECORD_CREATED',
    'VerifiedNeed',
    need.id,
    `Registered child assistance case ${caseCode} (${need.title}) with verified guardian consent`
  );

  notifySubscribers();
  return need;
}

export async function updateNeedStatus(
  needId: string,
  newStatus: VerifiedNeed['status'],
  officerName: string,
  actorRole: UserRole = 'safeguarding_officer',
  notes?: string
): Promise<VerifiedNeed | null> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.NEEDS) || '[]';
  const list: VerifiedNeed[] = JSON.parse(raw);
  const need = list.find((n) => n.id === needId);

  if (!need) return null;

  const previousStatus = need.status;
  need.status = newStatus;
  need.lastUpdated = new Date().toISOString();
  if (newStatus === 'verified_authentic') {
    need.verifiedOfficerName = officerName;
    need.verifiedDate = new Date().toISOString().substring(0, 10);
  }

  safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    actorRole,
    newStatus === 'verified_authentic' ? 'CASE_VERIFIED' : newStatus === 'rejected' ? 'CASE_REJECTED' : 'RECORD_UPDATED',
    'VerifiedNeed',
    need.id,
    `Transitioned case ${need.caseCode} status from ${previousStatus} to ${newStatus}. ${notes || ''}`
  );

  notifySubscribers();
  return need;
}

export async function addEvidenceDocument(
  needId: string,
  evidence: Omit<VerifiedNeed['evidence'][0], 'id'>,
  officerName: string
): Promise<VerifiedNeed | null> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.NEEDS) || '[]';
  const list: VerifiedNeed[] = JSON.parse(raw);
  const need = list.find((n) => n.id === needId);

  if (!need) return null;

  const doc = {
    ...evidence,
    id: `ev-${Date.now()}`
  };

  need.evidence.push(doc);
  need.lastUpdated = new Date().toISOString();
  safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    'case_worker',
    'RECORD_UPDATED',
    'EvidenceDocument',
    doc.id,
    `Attached verified evidence "${doc.title}" to case ${need.caseCode}`
  );

  notifySubscribers();
  return need;
}

// ----------------------------------------------------
// Volunteer & Organization Network
// ----------------------------------------------------
export function getVolunteers(): VolunteerProfile[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.VOLUNTEERS) || '[]';
  return JSON.parse(raw);
}

export async function registerVolunteer(
  submission: VolunteerSubmission
): Promise<VolunteerProfile> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.VOLUNTEERS) || '[]';
  const list: VolunteerProfile[] = JSON.parse(raw);

  const defaultSkills: VolunteerProfile['skills'] = submission.skills && submission.skills.length > 0
    ? submission.skills
    : ['community_mobilization'];

  const profile: VolunteerProfile = {
    id: `vol-${Date.now()}`,
    fullName: submission.fullName,
    email: submission.email,
    phone: submission.phone,
    country: submission.country,
    region: 'Pending Regional Onboarding',
    skills: defaultSkills,
    languages: ['English'],
    availabilityHoursPerWeek: submission.availability === 'weekly' ? 10 : submission.availability === 'monthly' ? 4 : 2,
    emergencyDeploymentReady: false,
    backgroundCheckStatus: 'in_review',
    safeguardingTrained: false,
    assignedTaskCount: 0,
    registeredDate: new Date().toISOString().substring(0, 10)
  };

  list.unshift(profile);
  safeSetItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));

  await logAuditEvent(
    submission.fullName,
    'volunteer',
    'RECORD_CREATED',
    'VolunteerProfile',
    profile.id,
    `Registered new volunteer profile. Safeguarding training and background clearance queued.`
  );

  notifySubscribers();
  return profile;
}

export async function updateVolunteerVetting(
  volunteerId: string,
  backgroundCheckStatus: VolunteerProfile['backgroundCheckStatus'],
  safeguardingTrained: boolean,
  officerName: string
): Promise<VolunteerProfile | null> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.VOLUNTEERS) || '[]';
  const list: VolunteerProfile[] = JSON.parse(raw);
  const vol = list.find((v) => v.id === volunteerId);

  if (!vol) return null;

  vol.backgroundCheckStatus = backgroundCheckStatus;
  vol.safeguardingTrained = safeguardingTrained;
  safeSetItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    'safeguarding_officer',
    'VOLUNTEER_VETTED',
    'VolunteerProfile',
    vol.id,
    `Updated volunteer ${vol.fullName} clearance to ${backgroundCheckStatus} (Safeguarding trained: ${safeguardingTrained})`
  );

  notifySubscribers();
  return vol;
}

export function getPartners(): PartnerOrganization[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.PARTNERS) || '[]';
  return JSON.parse(raw);
}

export async function registerPartner(
  partner: Omit<PartnerOrganization, 'id' | 'verifiedCaseCount' | 'activeDisbursementsTotal'>,
  officerName: string
): Promise<PartnerOrganization> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.PARTNERS) || '[]';
  const list: PartnerOrganization[] = JSON.parse(raw);

  const newPartner: PartnerOrganization = {
    ...partner,
    id: `org-${Date.now()}`,
    verifiedCaseCount: 0,
    activeDisbursementsTotal: 0
  };

  list.unshift(newPartner);
  safeSetItem(STORAGE_KEYS.PARTNERS, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    'admin',
    'RECORD_CREATED',
    'PartnerOrganization',
    newPartner.id,
    `Registered accredited NGO partner ${newPartner.name} in ${newPartner.country}`
  );

  notifySubscribers();
  return newPartner;
}

export function getTasks(): AssistanceTask[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.TASKS) || '[]';
  return JSON.parse(raw);
}

export async function assignTask(
  taskId: string,
  volunteerId: string,
  volunteerName: string,
  officerName: string
): Promise<AssistanceTask | null> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.TASKS) || '[]';
  const list: AssistanceTask[] = JSON.parse(raw);
  const task = list.find((t) => t.id === taskId);

  if (!task) return null;

  task.assignedVolunteerId = volunteerId;
  task.assignedVolunteerName = volunteerName;
  task.status = 'assigned';
  safeSetItem(STORAGE_KEYS.TASKS, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    'case_worker',
    'RECORD_UPDATED',
    'AssistanceTask',
    task.id,
    `Assigned assistance task "${task.title}" to volunteer ${volunteerName}`
  );

  notifySubscribers();
  return task;
}

// ----------------------------------------------------
// Intelligent Resource & Needs Matching Engine
// ----------------------------------------------------
export function generateMatchingProposals(): MatchingProposal[] {
  initializeDatabase();
  const needs = getVerifiedNeeds().filter(
    (n) => n.status === 'verified_authentic' || n.status === 'assistance_in_progress'
  );
  const partners = getPartners().filter((p) => p.accreditationStatus === 'accredited_active');
  const volunteers = getVolunteers().filter((v) => v.backgroundCheckStatus === 'cleared' && v.safeguardingTrained);
  const rawMatches = safeGetItem(STORAGE_KEYS.MATCHES) || '[]';
  const existingMatches: MatchingProposal[] = JSON.parse(rawMatches);

  const proposals: MatchingProposal[] = [];

  needs.forEach((need) => {
    // Check if already matched
    const alreadyApplied = existingMatches.some((m) => m.needId === need.id && m.isApplied);
    if (alreadyApplied) return;

    // Find best partner
    const countryPartner = partners.find((p) => p.country.toLowerCase() === need.country.toLowerCase()) || partners[0];

    // Find best volunteer based on category
    let volunteerMatch = volunteers.find((v) => {
      if (need.category === 'community_clean_water') return v.skills.includes('water_sanitation_engineer');
      if (need.category === 'critical_pediatric_care') return v.skills.includes('pediatric_nursing');
      if (need.category === 'schooling_supplies') return v.skills.includes('early_childhood_education');
      if (need.category === 'family_preservation') return v.skills.includes('trauma_counseling');
      return true;
    });

    if (!volunteerMatch && volunteers.length > 0) {
      volunteerMatch = volunteers[0];
    }

    // Calculate intelligent matching score (0-100)
    let score = 70;
    const rationale: string[] = [];

    if (countryPartner && countryPartner.country.toLowerCase() === need.country.toLowerCase()) {
      score += 15;
      rationale.push(`Accredited regional partner ${countryPartner.name} has active field operations in ${need.country}`);
    } else {
      rationale.push(`Regional coordination via international partner desk`);
    }

    if (need.urgency === 'emergency') {
      score += 15;
      rationale.push(`High urgency score applied (+15) due to urgent critical risk`);
    } else if (need.urgency === 'critical') {
      score += 10;
      rationale.push(`Elevated urgency score applied (+10)`);
    }

    if (volunteerMatch) {
      rationale.push(`Cleared volunteer ${volunteerMatch.fullName} has direct qualification in ${volunteerMatch.skills[0].replace(/_/g, ' ')}`);
    }

    const unallocatedNeeded = Math.max(0, need.estimatedCost - need.allocatedFunding);

    proposals.push({
      id: `match-${need.id}`,
      needId: need.id,
      needCaseCode: need.caseCode,
      needTitle: need.title,
      urgency: need.urgency,
      matchingScore: Math.min(99, score),
      rationale,
      recommendedDonationAllocation: unallocatedNeeded,
      currency: need.currency,
      recommendedPartnerId: countryPartner?.id || 'org-general',
      recommendedPartnerName: countryPartner?.name || 'HOPEBRIDGE Direct Response',
      recommendedVolunteerId: volunteerMatch?.id,
      recommendedVolunteerName: volunteerMatch?.fullName,
      isApplied: false,
      createdAt: new Date().toISOString()
    });
  });

  return proposals;
}

export async function applyMatchingProposal(
  proposalId: string,
  officerName: string
): Promise<boolean> {
  initializeDatabase();
  const rawMatches = safeGetItem(STORAGE_KEYS.MATCHES) || '[]';
  const matches: MatchingProposal[] = JSON.parse(rawMatches);

  // find proposal
  const proposals = generateMatchingProposals();
  const target = proposals.find((p) => p.id === proposalId);
  if (!target) return false;

  target.isApplied = true;
  matches.push(target);
  safeSetItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));

  // Update the verified need allocated funding and status
  const rawNeeds = safeGetItem(STORAGE_KEYS.NEEDS) || '[]';
  const needs: VerifiedNeed[] = JSON.parse(rawNeeds);
  const need = needs.find((n) => n.id === target.needId);

  if (need) {
    need.allocatedFunding = need.estimatedCost;
    need.status = 'funding_allocated';
    if (target.recommendedVolunteerId && !need.allocatedVolunteerIds.includes(target.recommendedVolunteerId)) {
      need.allocatedVolunteerIds.push(target.recommendedVolunteerId);
    }
    safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(needs));
  }

  await logAuditEvent(
    officerName,
    'admin',
    'RECORD_UPDATED',
    'MatchingProposal',
    target.id,
    `Applied intelligent allocation for case ${target.needCaseCode}: Allocated ${target.currency} ${target.recommendedDonationAllocation.toLocaleString()} with partner ${target.recommendedPartnerName}`
  );

  notifySubscribers();
  return true;
}

// ----------------------------------------------------
// Child Safeguarding Incident Reporting
// ----------------------------------------------------
export async function reportSafeguardingIncident(
  data: Omit<SafeguardingIncident, 'id' | 'referenceNumber' | 'timestamp' | 'status'>
): Promise<SafeguardingIncident> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.SAFEGUARDING) || '[]';
  const list: SafeguardingIncident[] = JSON.parse(raw);

  const timestamp = new Date().toISOString();
  const referenceNumber = `SAFEGUARD-${timestamp.substring(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

  const incident: SafeguardingIncident = {
    ...data,
    id: `safe-${Date.now()}`,
    referenceNumber,
    timestamp,
    status: 'new'
  };

  list.unshift(incident);
  safeSetItem(STORAGE_KEYS.SAFEGUARDING, JSON.stringify(list));

  await logAuditEvent(
    'Confidential Safeguarding Portal',
    'safeguarding_officer',
    'SAFEGUARDING_REPORT_LOGGED',
    'SafeguardingIncident',
    incident.id,
    `Confidential child protection report logged ref ${referenceNumber} (${incident.category}, severity: ${incident.severity})`
  );

  notifySubscribers();
  return incident;
}

export function getSafeguardingIncidents(): SafeguardingIncident[] {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.SAFEGUARDING) || '[]';
  return JSON.parse(raw);
}

export async function resolveSafeguardingIncident(
  incidentId: string,
  resolutionNotes: string,
  officerName: string
): Promise<boolean> {
  initializeDatabase();
  const raw = safeGetItem(STORAGE_KEYS.SAFEGUARDING) || '[]';
  const list: SafeguardingIncident[] = JSON.parse(raw);
  const item = list.find((i) => i.id === incidentId);

  if (!item) return false;

  item.status = 'resolved';
  item.investigatingOfficer = officerName;
  item.resolutionNotes = resolutionNotes;
  safeSetItem(STORAGE_KEYS.SAFEGUARDING, JSON.stringify(list));

  await logAuditEvent(
    officerName,
    'safeguarding_officer',
    'RECORD_UPDATED',
    'SafeguardingIncident',
    item.id,
    `Safeguarding incident ${item.referenceNumber} marked resolved with official protection review.`
  );

  notifySubscribers();
  return true;
}

// ----------------------------------------------------
// Backup, Export and Database Reset
// ----------------------------------------------------
export function exportDatabaseJson(): string {
  initializeDatabase();
  const dump = {
    schemaVersion: '2.0.0',
    exportTimestamp: new Date().toISOString(),
    organization: 'HOPEBRIDGE International Child Welfare',
    data: {
      donations: getDonations(),
      disbursements: getDisbursements(),
      expenses: getVerifiedExpenses(),
      needs: getVerifiedNeeds(),
      volunteers: getVolunteers(),
      partners: getPartners(),
      tasks: getTasks(),
      audit: getAuditLogs(),
      safeguarding: getSafeguardingIncidents()
    }
  };
  return JSON.stringify(dump, null, 2);
}

export async function restoreDatabaseJson(jsonString: string, actorName: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data) return false;

    if (parsed.data.donations) safeSetItem(STORAGE_KEYS.DONATIONS, JSON.stringify(parsed.data.donations));
    if (parsed.data.disbursements) safeSetItem(STORAGE_KEYS.DISBURSEMENTS, JSON.stringify(parsed.data.disbursements));
    if (parsed.data.expenses) safeSetItem(STORAGE_KEYS.EXPENSES, JSON.stringify(parsed.data.expenses));
    if (parsed.data.needs) safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(parsed.data.needs));
    if (parsed.data.volunteers) safeSetItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(parsed.data.volunteers));
    if (parsed.data.partners) safeSetItem(STORAGE_KEYS.PARTNERS, JSON.stringify(parsed.data.partners));
    if (parsed.data.tasks) safeSetItem(STORAGE_KEYS.TASKS, JSON.stringify(parsed.data.tasks));
    if (parsed.data.audit) safeSetItem(STORAGE_KEYS.AUDIT, JSON.stringify(parsed.data.audit));

    await logAuditEvent(
      actorName,
      'admin',
      'RECORD_UPDATED',
      'Database',
      'all',
      'Restored database from verified JSON archive backup.'
    );

    notifySubscribers();
    return true;
  } catch (e) {
    console.error('Failed to restore database:', e);
    return false;
  }
}

export async function resetDatabaseToBaseline(actorName: string): Promise<void> {
  safeSetItem(STORAGE_KEYS.PARTNERS, JSON.stringify(SEED_PARTNERS));
  safeSetItem(STORAGE_KEYS.NEEDS, JSON.stringify(SEED_NEEDS));
  safeSetItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(SEED_VOLUNTEERS));
  safeSetItem(STORAGE_KEYS.DONATIONS, JSON.stringify(SEED_DONATIONS));
  safeSetItem(STORAGE_KEYS.DISBURSEMENTS, JSON.stringify(SEED_DISBURSEMENTS));
  safeSetItem(STORAGE_KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
  safeSetItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
  safeSetItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT));
  safeSetItem(STORAGE_KEYS.SAFEGUARDING, JSON.stringify([]));
  safeSetItem(STORAGE_KEYS.MATCHES, JSON.stringify([]));

  await logAuditEvent(
    actorName,
    'admin',
    'RECORD_UPDATED',
    'Database',
    'all',
    'Reset database to verified institutional baseline.'
  );

  notifySubscribers();
}
