import type { Owner } from '../users';

interface Species {
  id: string;
  code: string;
  name: string;
  defaultVaccinePlan: boolean;
}

export interface Pet {
  id: string;
  owner: Owner;
  name: string;
  species: Species;
  sex: string;
  dob: string;
  weight: number;
  color: string;
  breed: string;
  note: string;
  isSterilized: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}
