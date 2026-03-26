import { axiosInstance } from '@/configs/axios.config';
import type { IParams } from '@/interfaces/i-params';

export interface VaccineBody {
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
}

const VACCINE_URL = '/vaccine';

export const vaccineApi = {
  async getAllVaccines(params: IParams) {
    return axiosInstance.request({
      method: 'GET',
      url: VACCINE_URL,
      params,
    });
  },

  async getVaccineById(id: string) {
    return axiosInstance.request({
      method: 'GET',
      url: `${VACCINE_URL}/${id}`,
    });
  },

  async createVaccine(vaccine: VaccineBody) {
    return axiosInstance.request({
      method: 'POST',
      url: VACCINE_URL,
      data: vaccine,
    });
  },

  async updateVaccine(id: string, vaccine: VaccineBody) {
    return axiosInstance.request({
      method: 'PUT',
      url: `${VACCINE_URL}/${id}`,
      data: vaccine,
    });
  },

  async deleteVaccine(id: string) {
    return axiosInstance.request({
      method: 'DELETE',
      url: `${VACCINE_URL}/${id}`,
    });
  },
};
