export interface Vaccine {
  id: string;
  speciesId: string;
  code: string;
  name: string;
  brand: string;
  description: string;
  doseValue: number;
  doseUnit: string;
  status: string;
  defaultTotalDoses: number;
  defaultNextDueDays: number;
  createdAt: string;
  updatedAt: string;
}
