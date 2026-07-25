export type VaccineStatus = 'ACTIVE' | 'INACTIVE';

export type VaccineLotStatus = 'AVAILABLE' | 'LOW_STOCK' | 'EXPIRING' | 'EXPIRED';

export interface Vaccine {
  id: string;
  code: string;
  name: string;
  disease: string;
  manufacturer: string;
  type: string;
  species: string;
  dose: string;
  intervalDays: number;
  boosterRequired: boolean;
  status: VaccineStatus;
  lotCount: number;
  totalStock: number;
  lowStockLots: number;
  expiringLots: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VaccineLot {
  id: string;
  vaccineId: string;
  lotNo: string;
  manufacturer: string;
  importDate: string;
  expiryDate: string;
  quantity: number;
  reservedQuantity: number;
  status: VaccineLotStatus;
}

export interface VaccineProtocol {
  id: string;
  species: 'dog' | 'cat';
  disease: string;
  ageRange: string;
  vaccineCode: string;
  vaccineName: string;
  isRequired: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
