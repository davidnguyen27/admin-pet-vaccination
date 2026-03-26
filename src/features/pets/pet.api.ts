import { axiosInstance } from '@/configs/axios.config';
import type { IResponse } from '@/interfaces/i-response';
import type { Pet } from './pet.type';
import type { IParams } from '@/interfaces/i-params';
import type { Owner } from '../users';

export interface Species {
  id: string;
  code: string;
  name: string;
  defaultVaccinePlan: boolean;
}

export interface PetBody {
  ownerId: string;
  speciesId: string;
  name: string;
  sex: string;
  dob: string;
  weight: number;
  color: string;
  breed: string;
  note: string;
  isSterilized: boolean;
}

export interface PetParams extends IParams {
  species?: string;
}

export const petApi = {
  async getAll(params: IParams) {
    const response = await axiosInstance.get<IResponse<Pet[]>>('/pets', { params });
    return response;
  },

  async getById(id: string) {
    const response = await axiosInstance.get<IResponse<Pet>>(`/pets/${id}`);
    return response;
  },

  async create(body: PetBody) {
    const response = await axiosInstance.post<IResponse<Pet>>('/pets', body);
    return response;
  },

  async update(id: string, body: PetBody) {
    const response = await axiosInstance.put<IResponse<Pet>>(`/pets/${id}`, body);
    return response;
  },

  async delete(id: string) {
    const response = await axiosInstance.delete<IResponse<void>>(`/pets/${id}`);
    return response;
  },

  async getAllOwners() {
    const response = await axiosInstance.get<IResponse<Owner[]>>('/owners');
    return response;
  },

  async getAllSpecies() {
    const response = await axiosInstance.get<IResponse<Species[]>>('/species');
    return response;
  },
};
