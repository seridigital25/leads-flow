export type StageId = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';

export type PriorityId = 'urgent' | 'high' | 'medium' | 'low';

export type ActivityType = 'whatsapp' | 'call' | 'meeting' | 'note';

export interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  author: string;
  timestamp: string;
}

export interface BANT {
  budget: boolean;
  authority: boolean;
  need: boolean;
  timeline: boolean;
}

export interface DocumentItem {
  description: string;
  qty: number;
  unitPrice: number;
  total?: number;
}

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'declined';

export interface Quotation {
  id: string;
  number: string;
  date: string;
  validUntil?: string;
  status: QuotationStatus;
  items: DocumentItem[];
  subtotal?: number;
  tax?: number;
  total: number;
  notes?: string;
}

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate?: string;
  status: InvoiceStatus;
  items: DocumentItem[];
  subtotal?: number;
  tax?: number;
  total: number;
  paidAt?: string | null;
  paymentMethod?: string | null;
  notes?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  stage: StageId;
  priority: PriorityId;
  source: string;
  dealValue: number;
  notes?: string;
  bant?: BANT;
  activities?: Activity[];
  quotations?: Quotation[];
  invoices?: Invoice[];
  lostReason?: string;
  nextFollowUpDate?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StageConfig {
  id: StageId;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
}

export interface PriorityConfig {
  id: PriorityId;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
}

export interface QuickTemplate {
  id: string;
  title: string;
  template: string;
}

export type SortOption = 'newest' | 'value_desc' | 'value_asc' | 'followup' | 'name_asc';

export type ViewMode = 'kanban' | 'table' | 'analytics' | 'reports' | 'contacts' | 'sources' | 'audit' | 'privacy';

/* ── Contacts Module ── */
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  linkedLeadIds: string[];
}

/* ── Lead Sources Management ── */
export interface LeadSource {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── Audit Trail ── */
export type AuditAction =
  | 'lead_created'
  | 'lead_updated'
  | 'lead_deleted'
  | 'lead_stage_changed'
  | 'lead_lost'
  | 'export_csv'
  | 'export_json'
  | 'demo_reset';

export interface AuditEvent {
  id: string;
  action: AuditAction;
  actor: string;
  targetId?: string;
  targetName?: string;
  details?: string;
  timestamp: string;
}

/* ── Privacy Notices ── */
export interface PrivacyConsent {
  noticeVersion: string;
  consentTimestamp: string | null;
}

export interface Stats {
  totalLeads: number;
  activePipelineValue: number;
  wonRevenue: number;
  winRate: number;
  avgDealSize: number;
  followUpsDueCount: number;
  lostRevenue: number;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface FollowUpInfo {
  status: 'overdue' | 'today' | 'upcoming' | 'none';
  label: string;
  daysDiff: number | null;
}

export interface LeadContextType {
  mode: 'demo' | 'owner';
  loading?: boolean;
  signOut?: () => void;
  leads: Lead[];
  maxLeads: number;
  isLimitReached: boolean;
  filteredLeads: Lead[];
  stats: Stats;
  selectedLead: Lead | null;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  lostModalLeadId: string | null;
  setLostModalLeadId: (id: string | null) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  addLead: (leadData: Partial<Lead>) => Lead | null;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveStage: (leadId: string, newStage: StageId | string) => void;
  confirmLostReason: (leadId: string, reason: string) => void;
  addActivity: (leadId: string, activityData: Omit<Activity, 'id' | 'timestamp'>) => void;
  toggleBANT: (leadId: string, criteriaKey: keyof BANT) => void;
  quickAddDemoLead: () => void;
  resetToDefaults: () => void;
  exportData: () => void;
  exportCsv: () => void;
  /* Contacts module */
  contacts: Contact[];
  getLinkedLeads: (contactId: string) => Lead[];
  /* Sources management */
  sources: LeadSource[];
  addSource: (data: { name: string; category: string }) => LeadSource | null;
  updateSource: (id: string, updates: Partial<LeadSource>) => void;
  deleteSource: (id: string) => void;
  /* Audit trail */
  auditEvents: AuditEvent[];
  clearAuditLog: () => void;
}
