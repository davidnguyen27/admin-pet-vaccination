export type HealthCertificateStatus = 'VALID' | 'EXPIRED' | 'REVOKED';

export type HealthCertificatePurpose =
  | 'DOMESTIC_TRAVEL'
  | 'INTERNATIONAL_EXPORT'
  | 'GENERAL_HEALTH'
  | 'SHOW_COMPETITION';

export interface HealthCertificate {
  id: string;
  certificateNo: string;
  petId?: string;
  petName: string;
  species: string;
  breed?: string;
  ownerName: string;
  ownerPhone?: string;
  microchipNo?: string;
  status: HealthCertificateStatus;
  purpose: HealthCertificatePurpose;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  clinicalNotes?: string;
  rabiesVaccinated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthCertificateFilters {
  search?: string;
  status?: string;
  purpose?: string;
}
