import React, { useState, useEffect } from 'react';
import {
  Users,
  Handshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Award,
  AlertCircle,
  Search,
  PlusCircle,
  Send,
  UserCheck
} from 'lucide-react';
import {
  getVolunteers,
  getPartners,
  getTasks,
  registerVolunteer,
  registerPartner,
  assignTask,
  subscribeToStore
} from '../db/storage';
import { VolunteerProfile, PartnerOrganization, AssistanceTask, VolunteerSkill, PageId } from '../types';
import { useAuth } from '../context/AuthContext';

interface NetworkPageProps {
  onNavigate: (page: PageId) => void;
}

export const NetworkPage: React.FC<NetworkPageProps> = ({ onNavigate }) => {
  const { currentUser, canVerifyCases } = useAuth();
  const [activeTab, setActiveTab] = useState<'volunteers' | 'partners' | 'tasks'>('volunteers');
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [partners, setPartners] = useState<PartnerOrganization[]>([]);
  const [tasks, setTasks] = useState<AssistanceTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // Volunteer registration form
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volCountry, setVolCountry] = useState('');
  const [volSkill, setVolSkill] = useState<VolunteerSkill>('early_childhood_education');
  const [volHours, setVolHours] = useState('weekly');
  const [volSuccessMessage, setVolSuccessMessage] = useState(false);

  // Partner organization form
  const [orgName, setOrgName] = useState('');
  const [orgReg, setOrgReg] = useState('');
  const [orgCountry, setOrgCountry] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgOfficer, setOrgOfficer] = useState('');
  const [orgSuccessMessage, setOrgSuccessMessage] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setVolunteers(getVolunteers());
      setPartners(getPartners());
      setTasks(getTasks());
    };
    refresh();
    return subscribeToStore(refresh);
  }, []);

  const handleRegisterVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volEmail || !volCountry) return;

    await registerVolunteer({
      fullName: volName,
      email: volEmail,
      phone: volPhone,
      country: volCountry,
      areaOfInterest: 'field-support',
      availability: volHours as 'weekly' | 'monthly' | 'occasional',
      backgroundNote: 'Volunteer application submitted via HOPEBRIDGE network portal.',
      skills: [volSkill]
    });

    setVolSuccessMessage(true);
    setTimeout(() => {
      setVolSuccessMessage(false);
      setShowVolunteerModal(false);
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setVolCountry('');
    }, 1800);
  };

  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !orgReg || !orgCountry) return;

    await registerPartner(
      {
        name: orgName,
        registrationNumber: orgReg,
        country: orgCountry,
        city: orgCity,
        focusAreas: ['clean-water', 'education'],
        accreditationStatus: 'provisional_review',
        auditExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        contactEmail: orgEmail,
        leadOfficer: orgOfficer
      },
      currentUser.name
    );

    setOrgSuccessMessage(true);
    setTimeout(() => {
      setOrgSuccessMessage(false);
      setShowPartnerModal(false);
      setOrgName('');
      setOrgReg('');
      setOrgCountry('');
      setOrgCity('');
      setOrgEmail('');
      setOrgOfficer('');
    }, 1800);
  };

  const handleAssignToMe = async (taskId: string) => {
    await assignTask(taskId, currentUser.id, currentUser.name, currentUser.name);
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Vetted Volunteer & Partner Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Humanitarian Coordination Network
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Delivering child welfare aid requires accredited local organizations and thoroughly background-checked volunteers. We verify legal accreditation, child safeguarding training, and field credentials before granting access to assistance coordination.
          </p>
        </div>

        {/* Tab Controls and Actions */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'volunteers'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Volunteers Roster ({volunteers.length})
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'partners'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Accredited NGOs ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Field Assistance Tasks ({tasks.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'volunteers' ? (
              <button
                onClick={() => setShowVolunteerModal(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Join Volunteer Roster</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPartnerModal(true)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Handshake className="w-4 h-4" />
                <span>Onboard NGO Partner</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Volunteers Roster */}
        {activeTab === 'volunteers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((vol) => (
              <div
                key={vol.id}
                className="glass-card rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-stone-900 text-base">
                      {vol.fullName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        vol.backgroundCheckStatus === 'cleared'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {vol.backgroundCheckStatus === 'cleared' ? 'Vetted & Cleared' : 'In Verification'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{vol.country} ({vol.region})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{vol.availabilityHoursPerWeek} hrs/week committed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Safeguarding Certified: {vol.safeguardingTrained ? 'Yes' : 'Pending Training'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
                      Vetted Skill Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vol.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200/60">
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Registered: {vol.registeredDate}</span>
                  <span className="font-semibold text-stone-700">{vol.assignedTaskCount} Active Tasks</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Partner Organizations */}
        {activeTab === 'partners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-stone-500">
                      {p.registrationNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {p.accreditationStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-2">
                    {p.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{p.city}, {p.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Lead: {p.leadOfficer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-orange-600" />
                      <span>Audit Valid Through: {p.auditExpiryDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Verified Cases</span>
                    <strong className="text-stone-900 text-sm">{p.verifiedCaseCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50/50 border border-orange-100">
                    <span className="text-orange-700 text-[10px] uppercase font-bold block">Aid Managed</span>
                    <strong className="text-stone-900 text-sm">${p.activeDisbursementsTotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Assistance Tasks */}
        {activeTab === 'tasks' && (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-100/80 border-b border-stone-200/80 text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case Ref</th>
                  <th className="py-3 px-4">Task Requirement</th>
                  <th className="py-3 px-4">Skill Required</th>
                  <th className="py-3 px-4">Est. Hours</th>
                  <th className="py-3 px-4">Assigned Volunteer</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 bg-white/70">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-stone-900">
                      {task.needCaseCode}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-stone-900 block">{task.title}</strong>
                      <span className="text-xs text-stone-500 leading-tight block">{task.description}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700 capitalize">
                      {task.skillRequired.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {task.estimatedHours} hrs
                    </td>
                    <td className="py-3 px-4">
                      {task.assignedVolunteerName ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {task.assignedVolunteerName}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic text-xs">Open for Assignment</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!task.assignedVolunteerName && (
                        <button
                          onClick={() => handleAssignToMe(task.id)}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Accept Mission
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Volunteer Application Modal */}
        {showVolunteerModal && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setShowVolunteerModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-4 border-b border-stone-200">
                <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                  Volunteer Application
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  Register for Child Welfare Support
                </h3>
              </div>

              {volSuccessMessage ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-stone-900">Application Submitted!</h4>
                  <p className="text-xs text-stone-600">
                    Your background clearance and safeguarding intake checklist have been initialized.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterVolunteer} className="py-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      placeholder="e.g. David Lindqvist"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                      placeholder="e.g. david@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        value={volCountry}
                        onChange={(e) => setVolCountry(e.target.value)}
                        placeholder="e.g. Kenya"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={volPhone}
                        onChange={(e) => setVolPhone(e.target.value)}
                        placeholder="+1 555-..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Primary Skill Domain *</label>
                    <select
                      value={volSkill}
                      onChange={(e) => setVolSkill(e.target.value as VolunteerSkill)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="pediatric_nursing">Pediatric Healthcare & Nursing</option>
                      <option value="early_childhood_education">Early Childhood Education & Literacy</option>
                      <option value="trauma_counseling">Child Trauma Counseling & Psychology</option>
                      <option value="water_sanitation_engineer">Clean Water & WASH Engineering</option>
                      <option value="translation_interpretation">Translation & Dialect Interpretation</option>
                      <option value="logistics_supply_chain">Emergency Logistics & Supply Chain</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVolunteerModal(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                    >
                      Submit Volunteer Profile
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Partner NGO Onboarding Modal */}
        {showPartnerModal && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-modal-in"
            onClick={() => setShowPartnerModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-4 border-b border-stone-200">
                <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                  Institutional Accreditation
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  Onboard Partner NGO
                </h3>
              </div>

              {orgSuccessMessage ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-stone-900">Partner Application Received!</h4>
                  <p className="text-xs text-stone-600">
                    Our compliance office will review your official registration document.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterPartner} className="py-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Organization Name *</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Lodwar Children Support NGO"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Government NGO Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={orgReg}
                      onChange={(e) => setOrgReg(e.target.value)}
                      placeholder="e.g. NGO-KE-2024-001"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        value={orgCountry}
                        onChange={(e) => setOrgCountry(e.target.value)}
                        placeholder="e.g. Kenya"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">City / Region *</label>
                      <input
                        type="text"
                        required
                        value={orgCity}
                        onChange={(e) => setOrgCity(e.target.value)}
                        placeholder="e.g. Lodwar"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Lead Executive Officer *</label>
                    <input
                      type="text"
                      required
                      value={orgOfficer}
                      onChange={(e) => setOrgOfficer(e.target.value)}
                      placeholder="e.g. Dr. Joseph Lokiru"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Official Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      placeholder="e.g. contact@lodwarchildren.org"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPartnerModal(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
                    >
                      Submit For Accreditation
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
