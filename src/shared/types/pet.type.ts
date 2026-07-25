export interface Pet {
  id: string;
  ownerId: string;
  ownerName?: string;
  speciesId: string;
  name: string;
  sex: string;
  dob: string;
  weight: number;
  color: string;
  breed: string;
  note: string;
  isSterilized: boolean;
  createdAt?: string;
  updatedAt?: string;
}
