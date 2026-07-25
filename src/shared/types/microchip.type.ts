export interface Microchip {
  id: string;
  microchipNo: string;
  implantDate?: string;
  implantLocation?: string;
  status: 'AVAILABLE' | 'IMPLANTED' | 'DEFECTIVE';
  petId?: string;
  petName?: string;
  ownerName?: string;
  manufacturer?: string;
  implantedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
