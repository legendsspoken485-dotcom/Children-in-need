import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Coins,
  ArrowUpRight,
  FileCheck2,
  Lock,
  Search,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  getDonations,
  getDisbursements,
  getVerifiedExpenses,
  getFinancialOverview,
  subscribeToStore
} from '../db/storage';
import { DonationRecord, DisbursementRecord, VerifiedExpense, PageId } from '../types';

interface TransparencyPageProps {
  onNavigate: (page: PageId) => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'donations' | 'disbursements' | 'expenses'>('donations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    return subscribeToStore(() => setRefreshTick((t) => t + 1));
  }, []);

  const donations = getDonations();
  const disbursements = getDisbursements();
  const expenses = getVerifiedExpenses();
  const financials = getFinancialOverview();

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const q = searchQuery.toLowerCase();
      return (
        d.referenceCode.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        d.campaignTitle?.toLowerCase().includes(q) ||
        d.paymentStatus.toLowerCase().includes(q)
      );
    });
  }, [donations, searchQuery]);

  const filteredDisbursements = useMemo(() => {
    return disbursements.filter((d) => {
      const q = searchQuery.toLowerCase();
      return (
        d.referenceCode.toLowerCase().includes(q) ||
        d.recipientOrganization.toLowerCase().includes(q) ||
        d.campaignTitle.toLowerCase().includes(q) ||
        d.purpose.toLowerCase().includes(q)
      );
    });
  }, [disbursements, searchQuery]);

  const handlePrintReceipt = (record: DonationRecord) => {
    setSelectedReceipt(record);
  };

  const handleExportCsv = () => {
    const headers = ['Reference Code', 'Date', 'Donor', 'Amount', 'Currency', 'Fund', 'Status', 'SHA-256 Hash'];
    const rows = donations.map((d) => [
      d.referenceCode,
      d.timestamp,
      d.isAnonymous ? 'Anonymous' : d.donorName,
      d.amount,
      d.currency,
      d.campaignTitle || d.fundCategory,
      d.paymentStatus,
      d.sha256Hash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HOPEBRIDGE_financial_ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Institutional Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Open Humanitarian Ledger · SHA-256 Verified</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Financial Transparency & Aid Accountability
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every dollar entrusted to HOPEBRIDGE is recorded, tracked, and reconciled against verified field receipts. We believe donor trust requires absolute institutional visibility, zero fabricated statistics, and verified delivery to vulnerable children.
          </p>
        </div>

        {/* Live Transparency KPI Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="glass-card rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              <span>Total Received</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              ${financials.totalDonationsUSD.toLocaleString()}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              From {financials.donationCount} verified donor ledger entries
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              <span>Disbursed to Field</span>
              <ArrowUpRight className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              ${financials.totalDisbursedUSD.toLocaleString()}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {financials.settlementRatePercent}% of received funds already transferred
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              <span>Reconciled Expenses</span>
              <FileCheck2 className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              ${financials.totalExpensesUSD.toLocaleString()}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Backed by {financials.verifiedExpenseCount} verified partner receipts
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              <span>Field Escrow Pool</span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              ${financials.escrowBalance.toLocaleString()}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Reserved for active verified assistance cases
            </p>
          </div>
        </div>

        {/* Search, Filter & Action Toolbar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'donations'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Donations Ledger ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab('disbursements')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'disbursements'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Aid Disbursements ({disbursements.length})
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'expenses'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Reconciled Receipts ({expenses.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger by ref, donor, cause..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
              title="Download CSV Ledger"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Donations Ledger */}
        {activeTab === 'donations' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ledger Reference</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Donor Name</th>
                    <th className="py-3 px-4">Fund Destination</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt & Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 bg-white/70">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-500 text-xs">
                        No donation records match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((don) => (
                      <tr key={don.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-stone-900">
                          {don.referenceCode}
                        </td>
                        <td className="py-3 px-4 text-stone-600 text-xs whitespace-nowrap">
                          {new Date(don.timestamp).toLocaleDateString()} {new Date(don.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800">
                          {don.isAnonymous ? (
                            <span className="inline-flex items-center gap-1 text-stone-500 italic text-xs">
                              <Lock className="w-3 h-3" /> Anonymous Donor
                            </span>
                          ) : (
                            don.donorName
                          )}
                        </td>
                        <td className="py-3 px-4 text-stone-700 max-w-xs truncate">
                          {don.campaignTitle || 'General Children Fund'}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {don.currency} {don.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Settled
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handlePrintReceipt(don)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer transition-colors"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-orange-600" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Aid Disbursements */}
        {activeTab === 'disbursements' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Disbursement Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Recipient Partner NGO</th>
                    <th className="py-3 px-4">Country & Purpose</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Reconciled Status</th>
                    <th className="py-3 px-4 text-right">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 bg-white/70">
                  {filteredDisbursements.map((disb) => (
                    <tr key={disb.id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-stone-900">
                        {disb.referenceCode}
                      </td>
                      <td className="py-3 px-4 text-stone-600 text-xs whitespace-nowrap">
                        {new Date(disb.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {disb.recipientOrganization}
                      </td>
                      <td className="py-3 px-4 text-stone-700 max-w-sm">
                        <span className="font-semibold text-orange-700 block">{disb.country}</span>
                        <span className="text-xs text-stone-600 leading-tight block">{disb.purpose}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {disb.currency} {disb.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                          <CheckCircle2 className="w-3 h-3" />
                          {disb.status.toUpperCase()} ({disb.verifiedExpenseCount} receipts)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-stone-600">
                        {disb.authorizedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reconciled Expenses */}
        {activeTab === 'expenses' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Receipt Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Vendor & Supplier</th>
                    <th className="py-3 px-4">Itemized Goods / Assistance Provided</th>
                    <th className="py-3 px-4">Cost</th>
                    <th className="py-3 px-4 text-right">Field Verification Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 bg-white/70">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-stone-800">
                        {exp.receiptRef}
                      </td>
                      <td className="py-3 px-4 text-stone-600 text-xs">
                        {exp.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {exp.vendor}
                      </td>
                      <td className="py-3 px-4 text-stone-700 text-xs">
                        {exp.description}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {exp.currency} {exp.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-stone-600">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {exp.verifiedByOfficer}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verifiable Receipt Modal */}
        {selectedReceipt && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setSelectedReceipt(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Receipt Top Header */}
              <div className="text-center pb-5 border-b border-stone-200">
                <span className="text-[11px] font-mono tracking-widest text-orange-600 uppercase font-bold block mb-1">
                  Official Aid Contribution Receipt
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  HOPEBRIDGE International
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Child Welfare Humanitarian Initiative · Ref: {selectedReceipt.receiptNumber}
                </p>
              </div>

              {/* Receipt Details */}
              <div className="py-4 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Transaction Date:</span>
                  <span className="font-semibold">{new Date(selectedReceipt.timestamp).toUTCString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Contributor:</span>
                  <span className="font-semibold">{selectedReceipt.isAnonymous ? 'Anonymous Donor' : selectedReceipt.donorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Assigned Allocation:</span>
                  <span className="font-semibold text-right max-w-[240px] truncate">{selectedReceipt.campaignTitle || selectedReceipt.fundCategory}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Payment Channel:</span>
                  <span className="font-semibold uppercase">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 text-base font-bold text-stone-900 bg-orange-50/60 rounded-xl px-3 border border-orange-100">
                  <span>Total Settled Amount:</span>
                  <span className="text-orange-700">{selectedReceipt.currency} {selectedReceipt.amount.toLocaleString()}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-stone-400 font-mono block mb-1">SHA-256 Ledger Cryptographic Proof:</span>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-[10px] font-mono break-all text-stone-600 select-all">
                    {selectedReceipt.sha256Hash}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
