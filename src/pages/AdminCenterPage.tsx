import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Coins,
  Users,
  AlertTriangle,
  FileText,
  Lock,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  KeyRound,
  Database,
  ArrowUpRight,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import {
  getDonations,
  getDisbursements,
  getVerifiedExpenses,
  getVerifiedNeeds,
  getVolunteers,
  getPartners,
  getAuditLogs,
  getSafeguardingIncidents,
  getFinancialOverview,
  updateNeedStatus,
  authorizeDisbursement,
  resolveSafeguardingIncident,
  updateVolunteerVetting,
  exportDatabaseJson,
  restoreDatabaseJson,
  resetDatabaseToBaseline,
  subscribeToStore
} from '../db/storage';
import { useAuth } from '../context/AuthContext';
import { UserRole, VerifiedNeed, SafeguardingIncident, AuditLogEntry, PageId } from '../types';

interface AdminCenterPageProps {
  onNavigate: (page: PageId) => void;
}

export const AdminCenterPage: React.FC<AdminCenterPageProps> = ({ onNavigate }) => {
  const { currentUser, switchRole, canAuthorizeFunds, canManageSafeguarding, canVerifyCases } = useAuth();
  const [activeSection, setActiveSection] = useState<'kpi' | 'verifications' | 'disbursements' | 'safeguarding' | 'audit' | 'database'>('kpi');
  const [, setRefreshTick] = useState(0);

  // New disbursement form state
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [disbOrg, setDisbOrg] = useState('');
  const [disbCountry, setDisbCountry] = useState('Kenya');
  const [disbAmount, setDisbAmount] = useState<number>(2000);
  const [disbPurpose, setDisbPurpose] = useState('');
  const [disbCampaignTitle, setDisbCampaignTitle] = useState('Emergency Child Nutrition Relief');
  const [disbSuccess, setDisbSuccess] = useState(false);

  // Safeguarding resolution state
  const [resolvingIncidentId, setResolvingIncidentId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Database JSON import state
  const [importJsonText, setImportJsonText] = useState('');
  const [dbNotice, setDbNotice] = useState<string | null>(null);

  // Audit filter state
  const [auditSearch, setAuditSearch] = useState('');

  useEffect(() => {
    return subscribeToStore(() => setRefreshTick((t) => t + 1));
  }, []);

  const donations = getDonations();
  const disbursements = getDisbursements();
  const needs = getVerifiedNeeds();
  const volunteers = getVolunteers();
  const partners = getPartners();
  const auditLogs = getAuditLogs();
  const safeguardingIncidents = getSafeguardingIncidents();
  const financials = getFinancialOverview();

  const pendingNeeds = needs.filter((n) => n.status === 'submitted' || n.status === 'under_investigation' || n.status === 'evidence_requested');
  const openSafeguarding = safeguardingIncidents.filter((s) => s.status !== 'resolved');

  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = auditSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.targetType.toLowerCase().includes(q)
    );
  });

  const handleApproveCase = async (needId: string) => {
    await updateNeedStatus(needId, 'verified_authentic', currentUser.name, currentUser.role, 'All supporting evidence verified.');
  };

  const handleRejectCase = async (needId: string) => {
    await updateNeedStatus(needId, 'rejected', currentUser.name, currentUser.role, 'Insufficient documentation provided.');
  };

  const handleExecuteDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disbOrg || !disbPurpose || disbAmount <= 0) return;

    await authorizeDisbursement(
      'camp-general-relief',
      disbCampaignTitle,
      disbAmount,
      'USD',
      disbOrg,
      disbCountry,
      disbPurpose,
      currentUser.name
    );

    setDisbSuccess(true);
    setTimeout(() => {
      setDisbSuccess(false);
      setShowDisburseModal(false);
      setDisbOrg('');
      setDisbPurpose('');
    }, 1500);
  };

  const handleResolveIncident = async (id: string) => {
    if (!resolutionNotes) return;
    await resolveSafeguardingIncident(id, resolutionNotes, currentUser.name);
    setResolvingIncidentId(null);
    setResolutionNotes('');
  };

  const handleDownloadBackup = () => {
    const json = exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HOPEBRIDGE_db_backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreDatabase = async () => {
    if (!importJsonText) return;
    const ok = await restoreDatabaseJson(importJsonText, currentUser.name);
    if (ok) {
      setDbNotice('Database restored successfully from JSON backup.');
      setImportJsonText('');
    } else {
      setDbNotice('Failed to restore database. Invalid JSON structure.');
    }
    setTimeout(() => setDbNotice(null), 4000);
  };

  const handleResetBaseline = async () => {
    if (window.confirm('Are you sure you want to reset the database to verified institutional baseline?')) {
      await resetDatabaseToBaseline(currentUser.name);
      setDbNotice('Database restored to institutional baseline.');
      setTimeout(() => setDbNotice(null), 3000);
    }
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Security Role Switcher Ribbon */}
        <div className="mb-8 p-4 rounded-2xl bg-stone-900 text-stone-200 border border-stone-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  Security Context: {currentUser.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                  {currentUser.role.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-xs text-stone-400">
                Institutional Access Level: {currentUser.badgeNumber || 'PUBLIC'} · {currentUser.organization || 'HOPEBRIDGE Global'}
              </span>
            </div>
          </div>

          {/* Quick Role Switcher for Testing & Production Governance */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-stone-400 uppercase mr-1">Switch Role:</span>
            {(['admin', 'safeguarding_officer', 'case_worker', 'partner_lead', 'volunteer', 'donor', 'public'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer capitalize ${
                  currentUser.role === r
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                {r.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block">
              HOPEBRIDGE Governance & Operational Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
              Administrative Command Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
            {canAuthorizeFunds && (
              <button
                onClick={() => setShowDisburseModal(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Issue Aid Disbursement</span>
              </button>
            )}
          </div>
        </div>

        {/* Operational Section Navigation */}
        <div className="glass-panel rounded-2xl p-2 mb-8 flex flex-wrap items-center gap-2 shadow-xs">
          {[
            { id: 'kpi', label: 'Operational Overview' },
            { id: 'verifications', label: `Pending Verifications (${pendingNeeds.length})` },
            { id: 'disbursements', label: `Aid Disbursements (${disbursements.length})` },
            { id: 'safeguarding', label: `Safeguarding Reports (${openSafeguarding.length})` },
            { id: 'audit', label: `SHA-256 Audit Logs (${auditLogs.length})` },
            { id: 'database', label: 'Database & Backups' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section 1: KPI Dashboard */}
        {activeSection === 'kpi' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="glass-card rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Total Donations</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-1 block">${financials.totalDonationsUSD.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-700 font-medium">{financials.donationCount} ledger receipts</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Disbursed Aid</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-1 block">${financials.totalDisbursedUSD.toLocaleString()}</span>
                <span className="text-[10px] text-orange-700 font-medium">{financials.disbursementCount} transfers executed</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Field Escrow</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-1 block">${financials.escrowBalance.toLocaleString()}</span>
                <span className="text-[10px] text-stone-400 font-medium">Unallocated reserve</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Verified Needs</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-1 block">{needs.length}</span>
                <span className="text-[10px] text-stone-600 font-medium">{pendingNeeds.length} awaiting review</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Volunteer Roster</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-1 block">{volunteers.length}</span>
                <span className="text-[10px] text-emerald-700 font-medium">{volunteers.filter(v => v.backgroundCheckStatus === 'cleared').length} background cleared</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Accredited NGOs</span>
                <span className="text-xl font-bold font-serif text-stone-900 mt-1 block">{partners.length}</span>
                <span className="text-[10px] text-sky-700 font-medium">100% audit compliant</span>
              </div>
            </div>

            {/* Quick Links & High Priority Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                    Recent Verification Queue
                  </h3>
                  <button onClick={() => setActiveSection('verifications')} className="text-xs font-bold text-orange-600 hover:underline">
                    View All ({pendingNeeds.length})
                  </button>
                </div>
                {pendingNeeds.slice(0, 3).map((pn) => (
                  <div key={pn.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-stone-900 block">{pn.caseCode}</span>
                      <span className="text-stone-600 line-clamp-1">{pn.title}</span>
                    </div>
                    {canVerifyCases && (
                      <button
                        onClick={() => handleApproveCase(pn.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] cursor-pointer hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                    Child Safeguarding Escalations
                  </h3>
                  <button onClick={() => setActiveSection('safeguarding')} className="text-xs font-bold text-orange-600 hover:underline">
                    View All ({safeguardingIncidents.length})
                  </button>
                </div>
                {openSafeguarding.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    Zero unresolved child protection escalations on file.
                  </div>
                ) : (
                  openSafeguarding.map((inc) => (
                    <div key={inc.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-rose-900">
                        <span>{inc.referenceNumber}</span>
                        <span className="uppercase">{inc.severity}</span>
                      </div>
                      <p className="text-stone-700 text-xs">{inc.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Verification Queue */}
        {activeSection === 'verifications' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case Code</th>
                  <th className="py-3 px-4">Case Title & Country</th>
                  <th className="py-3 px-4">Partner NGO</th>
                  <th className="py-3 px-4">Evidence Checklist</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 bg-white/70">
                {needs.map((n) => (
                  <tr key={n.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {n.caseCode}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-stone-900 block">{n.title}</strong>
                      <span className="text-xs text-stone-500">{n.region}, {n.country}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {n.submittingPartnerName}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {n.evidence.length} verified docs on file
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {n.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canVerifyCases && n.status !== 'verified_authentic' && (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleApproveCase(n.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                          >
                            Verify & Approve
                          </button>
                          <button
                            onClick={() => handleRejectCase(n.id)}
                            className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 3: Aid Disbursements */}
        {activeSection === 'disbursements' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Authorized Field Transfers ({disbursements.length})
              </span>
              {canAuthorizeFunds && (
                <button
                  onClick={() => setShowDisburseModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold cursor-pointer"
                >
                  + Authorize Aid Transfer
                </button>
              )}
            </div>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Recipient NGO</th>
                  <th className="py-3 px-4">Country & Purpose</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Audit Signoff</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 bg-white/70">
                {disbursements.map((d) => (
                  <tr key={d.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{d.referenceCode}</td>
                    <td className="py-3 px-4 font-semibold text-stone-800">{d.recipientOrganization}</td>
                    <td className="py-3 px-4 text-xs text-stone-600">{d.country} · {d.purpose}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{d.currency} {d.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs text-stone-600">{d.authorizedBy}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 4: Child Safeguarding Incidents */}
        {activeSection === 'safeguarding' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Strict Safeguarding Confidentiality Protocols:</strong>
                <span>All reports are stored encrypted and accessible strictly to designated Safeguarding Officers. Under international law, identities of children are protected and immediate intervention takes precedence over public disclosure.</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Case Reference</th>
                    <th className="py-3 px-4">Incident Category</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Confidential Report Summary</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Safeguarding Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 bg-white/70">
                  {safeguardingIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-stone-500">
                        No safeguarding incidents reported.
                      </td>
                    </tr>
                  ) : (
                    safeguardingIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{inc.referenceNumber}</td>
                        <td className="py-3 px-4 capitalize text-stone-800">{inc.category.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inc.severity === 'immediate_critical' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-stone-600 max-w-sm">{inc.description}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {canManageSafeguarding && inc.status !== 'resolved' && (
                            <button
                              onClick={() => setResolvingIncidentId(inc.id)}
                              className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-bold text-xs cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Incident Resolution Drawer */}
            {resolvingIncidentId && (
              <div className="p-5 rounded-2xl bg-white border border-stone-300 shadow-lg space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">
                  Document Safeguarding Incident Resolution
                </h4>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter official child protection actions taken, welfare follow-up, or partner notification notes..."
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs bg-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setResolvingIncidentId(null)}
                    className="px-4 py-1.5 rounded-xl border border-stone-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResolveIncident(resolvingIncidentId)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Mark Case Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 5: Cryptographic Audit Logs */}
        {activeSection === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Cryptographic Audit Trail (SHA-256 Hashed)
              </span>
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter logs by actor, action..."
                className="w-64 px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Actor</th>
                    <th className="py-2.5 px-4">Target</th>
                    <th className="py-2.5 px-4">Event Description</th>
                    <th className="py-2.5 px-4 text-right">SHA-256 Checksum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 bg-white/70 font-mono text-[11px]">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-orange-50/30">
                      <td className="py-2.5 px-4 text-stone-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-orange-700">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-4 text-stone-800">
                        {log.actorName} ({log.actorRole})
                      </td>
                      <td className="py-2.5 px-4 text-stone-600">
                        {log.targetType}:{log.targetId.substring(0, 10)}
                      </td>
                      <td className="py-2.5 px-4 text-stone-700 font-sans max-w-sm">
                        {log.description}
                      </td>
                      <td className="py-2.5 px-4 text-right text-stone-400 select-all" title={log.sha256Hash}>
                        {log.sha256Hash.substring(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 6: Database & Backup Management */}
        {activeSection === 'database' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm uppercase tracking-wider">
                <Database className="w-4 h-4 text-orange-600" />
                <span>Export & Synchronize Platform Database</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Download a complete verified JSON database archive containing the donation ledger, verified beneficiaries, volunteer profiles, accredited partners, and tamper-evident audit logs.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Encrypted JSON Archive</span>
              </button>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm uppercase tracking-wider">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Restore Database From Archive</span>
              </div>
              <textarea
                rows={3}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste valid HOPEBRIDGE backup JSON archive here..."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-mono bg-white"
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleRestoreDatabase}
                  disabled={!importJsonText}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer disabled:opacity-40"
                >
                  Verify & Restore
                </button>
                <button
                  onClick={handleResetBaseline}
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs cursor-pointer"
                >
                  Reset to Baseline
                </button>
              </div>
              {dbNotice && (
                <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-800 font-medium">
                  {dbNotice}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Authorize Aid Disbursement */}
        {showDisburseModal && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setShowDisburseModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-4 border-b border-stone-200">
                <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                  Aid Transfer Authorization
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  Authorize Field Disbursement
                </h3>
              </div>

              {disbSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-stone-900">Disbursement Recorded!</h4>
                  <p className="text-xs text-stone-600">
                    Aid funds transferred and registered on the open transparency ledger.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleExecuteDisbursement} className="py-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Recipient Accredited NGO *</label>
                    <select
                      value={disbOrg}
                      onChange={(e) => setDisbOrg(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="">Select Accredited Partner...</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Disbursement Amount (USD) *</label>
                      <input
                        type="number"
                        min={100}
                        required
                        value={disbAmount}
                        onChange={(e) => setDisbAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Target Country *</label>
                      <input
                        type="text"
                        required
                        value={disbCountry}
                        onChange={(e) => setDisbCountry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Campaign Allocation *</label>
                    <input
                      type="text"
                      required
                      value={disbCampaignTitle}
                      onChange={(e) => setDisbCampaignTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Specific Purpose & Deliverables *</label>
                    <textarea
                      rows={3}
                      required
                      value={disbPurpose}
                      onChange={(e) => setDisbPurpose(e.target.value)}
                      placeholder="e.g. Procurement of pediatric antibiotics and medical supplies for clinic..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDisburseModal(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                    >
                      Sign & Execute Transfer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
