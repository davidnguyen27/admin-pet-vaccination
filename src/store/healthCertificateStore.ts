import { defineStore } from 'pinia';
import type {
  HealthCertificate,
  HealthCertificateFilters,
} from '@/shared/types/healthCertificate.type';

const MOCK_HEALTH_CERTIFICATES: HealthCertificate[] = [
  {
    id: 'hc-001',
    certificateNo: 'HC-2026-001',
    petId: 'pet-001',
    petName: 'Fluffy',
    species: 'Cat',
    breed: 'Persian',
    ownerName: 'John Doe',
    ownerPhone: '0901234567',
    microchipNo: '900215000123456',
    status: 'VALID',
    purpose: 'DOMESTIC_TRAVEL',
    issueDate: '2026-06-01',
    expiryDate: '2026-12-01',
    issuedBy: 'Dr. John Smith',
    clinicalNotes: 'Fit for domestic flight. All vaccinations up to date including Rabies.',
    rabiesVaccinated: true,
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'hc-002',
    certificateNo: 'HC-2026-002',
    petId: 'pet-002',
    petName: 'Bella',
    species: 'Dog',
    breed: 'Golden Retriever',
    ownerName: 'Jane Watson',
    ownerPhone: '0912345678',
    microchipNo: '900215000123457',
    status: 'VALID',
    purpose: 'INTERNATIONAL_EXPORT',
    issueDate: '2026-05-15',
    expiryDate: '2026-11-15',
    issuedBy: 'Dr. Sarah Johnson',
    clinicalNotes: 'International health clearance passed. Blood titer test verified negative for infectious diseases.',
    rabiesVaccinated: true,
    createdAt: '2026-05-15T10:30:00.000Z',
    updatedAt: '2026-05-15T10:30:00.000Z',
  },
  {
    id: 'hc-003',
    certificateNo: 'HC-2026-003',
    petId: 'pet-003',
    petName: 'Rocky',
    species: 'Dog',
    breed: 'French Bulldog',
    ownerName: 'Robert Downey',
    ownerPhone: '0922334455',
    microchipNo: '900215000579131',
    status: 'EXPIRED',
    purpose: 'GENERAL_HEALTH',
    issueDate: '2025-06-10',
    expiryDate: '2026-06-10',
    issuedBy: 'Dr. John Smith',
    clinicalNotes: 'Annual wellness check passed. Re-examination required before renewal.',
    rabiesVaccinated: true,
    createdAt: '2025-06-10T14:00:00.000Z',
    updatedAt: '2026-06-11T08:00:00.000Z',
  },
  {
    id: 'hc-004',
    certificateNo: 'HC-2026-004',
    petName: 'Milo',
    species: 'Cat',
    breed: 'British Shorthair',
    ownerName: 'Emily Clark',
    ownerPhone: '0933445566',
    microchipNo: '900215000987654',
    status: 'REVOKED',
    purpose: 'SHOW_COMPETITION',
    issueDate: '2026-04-01',
    expiryDate: '2026-10-01',
    issuedBy: 'Dr. Sarah Johnson',
    clinicalNotes: 'Revoked due to post-issue dermatological outbreak requiring quarantine treatment.',
    rabiesVaccinated: false,
    createdAt: '2026-04-01T11:20:00.000Z',
    updatedAt: '2026-04-15T16:00:00.000Z',
  },
  {
    id: 'hc-005',
    certificateNo: 'HC-2026-005',
    petName: 'Luna',
    species: 'Dog',
    breed: 'Poodle',
    ownerName: 'Michael Brown',
    ownerPhone: '0944556677',
    microchipNo: '900215000445566',
    status: 'VALID',
    purpose: 'GENERAL_HEALTH',
    issueDate: '2026-07-01',
    expiryDate: '2027-01-01',
    issuedBy: 'Dr. John Smith',
    clinicalNotes: 'Overall healthy condition, body condition score 3/5, teeth clean.',
    rabiesVaccinated: true,
    createdAt: '2026-07-01T08:45:00.000Z',
    updatedAt: '2026-07-01T08:45:00.000Z',
  },
];

interface HealthCertificateState {
  loading: boolean;
  healthCertificate: HealthCertificate | null;
  listHealthCertificate: {
    data: HealthCertificate[];
    total: number;
    page: number;
    limit: number;
  };
  filters: HealthCertificateFilters;
  overview: {
    total: number;
    valid: number;
    expired: number;
    revoked: number;
  };
}

export const useHealthCertificateStore = defineStore('healthCertificate', {
  state: (): HealthCertificateState => ({
    loading: false,
    healthCertificate: null,
    listHealthCertificate: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
    filters: {
      search: '',
      status: undefined,
      purpose: undefined,
    },
    overview: {
      total: 0,
      valid: 0,
      expired: 0,
      revoked: 0,
    },
  }),

  actions: {
    applyList(data: HealthCertificate[], page?: number, limit?: number) {
      const normalizedPage = Math.max(1, page ?? this.listHealthCertificate.page);
      const normalizedLimit = Math.max(1, limit ?? this.listHealthCertificate.limit);
      const start = (normalizedPage - 1) * normalizedLimit;

      this.listHealthCertificate.data = data.slice(start, start + normalizedLimit);
      this.listHealthCertificate.total = data.length;
      this.listHealthCertificate.page = normalizedPage;
      this.listHealthCertificate.limit = normalizedLimit;
    },

    getFilteredMockCertificates() {
      const search = this.filters.search?.trim().toLowerCase();
      const status = this.filters.status;
      const purpose = this.filters.purpose;

      return MOCK_HEALTH_CERTIFICATES.filter(cert => {
        const matchesSearch =
          !search ||
          [
            cert.certificateNo,
            cert.petName,
            cert.ownerName,
            cert.issuedBy,
            cert.microchipNo,
            cert.breed,
          ].some(val => val && val.toLowerCase().includes(search));

        const matchesStatus = !status || cert.status === status;
        const matchesPurpose = !purpose || cert.purpose === purpose;

        return matchesSearch && matchesStatus && matchesPurpose;
      });
    },

    applyOverview() {
      this.overview = {
        total: MOCK_HEALTH_CERTIFICATES.length,
        valid: MOCK_HEALTH_CERTIFICATES.filter(c => c.status === 'VALID').length,
        expired: MOCK_HEALTH_CERTIFICATES.filter(c => c.status === 'EXPIRED').length,
        revoked: MOCK_HEALTH_CERTIFICATES.filter(c => c.status === 'REVOKED').length,
      };
    },

    setFilters(filters: Partial<HealthCertificateFilters>) {
      this.filters = { ...this.filters, ...filters };
      this.listHealthCertificate.page = 1;
    },

    setPagination(page: number, limit: number) {
      this.listHealthCertificate.page = page;
      this.listHealthCertificate.limit = limit;
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: undefined,
        purpose: undefined,
      };
      this.listHealthCertificate.page = 1;
    },

    async fetchList() {
      this.loading = true;
      try {
        this.applyList(this.getFilteredMockCertificates());
      } finally {
        this.loading = false;
      }
    },

    async fetchOverview() {
      this.applyOverview();
    },

    async createCertificate(payload: Partial<HealthCertificate>) {
      this.loading = true;
      try {
        const count = MOCK_HEALTH_CERTIFICATES.length + 1;
        const certNo = payload.certificateNo || `HC-2026-${String(count).padStart(3, '0')}`;
        
        const newCert: HealthCertificate = {
          id: `hc-${Date.now()}`,
          certificateNo: certNo,
          petName: payload.petName || '',
          species: payload.species || 'Dog',
          breed: payload.breed || '',
          ownerName: payload.ownerName || '',
          ownerPhone: payload.ownerPhone || '',
          microchipNo: payload.microchipNo || '',
          status: payload.status || 'VALID',
          purpose: payload.purpose || 'GENERAL_HEALTH',
          issueDate: payload.issueDate || new Date().toISOString().slice(0, 10),
          expiryDate:
            payload.expiryDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          issuedBy: payload.issuedBy || 'Dr. John Smith',
          clinicalNotes: payload.clinicalNotes || '',
          rabiesVaccinated: payload.rabiesVaccinated ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        MOCK_HEALTH_CERTIFICATES.unshift(newCert);
        this.applyOverview();
        await this.fetchList();
        return { success: true };
      } finally {
        this.loading = false;
      }
    },

    async updateCertificate(id: string, payload: Partial<HealthCertificate>) {
      this.loading = true;
      try {
        const index = MOCK_HEALTH_CERTIFICATES.findIndex(c => c.id === id);
        if (index !== -1) {
          const original = MOCK_HEALTH_CERTIFICATES[index];
          MOCK_HEALTH_CERTIFICATES[index] = {
            ...original,
            ...payload,
            updatedAt: new Date().toISOString(),
          } as HealthCertificate;
          this.applyOverview();
          await this.fetchList();
          return { success: true };
        }
        throw new Error('Certificate not found');
      } finally {
        this.loading = false;
      }
    },

    async deleteCertificate(id: string) {
      this.loading = true;
      try {
        const index = MOCK_HEALTH_CERTIFICATES.findIndex(c => c.id === id);
        if (index !== -1) {
          MOCK_HEALTH_CERTIFICATES.splice(index, 1);
          this.applyOverview();
          await this.fetchList();
          return { success: true };
        }
        throw new Error('Certificate not found');
      } finally {
        this.loading = false;
      }
    },
  },
});
