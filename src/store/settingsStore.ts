import { defineStore } from 'pinia';

export interface GeneralSettings {
  clinicName: string;
  hotline: string;
  emergencyPhone: string;
  email: string;
  address: string;
  taxCode: string;
  currency: string;
  timezone: string;
  logoUrl?: string;
}

export interface OperatingHoursSettings {
  openingTime: string;
  closingTime: string;
  morningShiftStart: string;
  morningShiftEnd: string;
  afternoonShiftStart: string;
  afternoonShiftEnd: string;
  maxCapacityPerSlot: number;
  closedDays: string[];
}

export interface VaccinationSettings {
  defaultBoosterReminderDays: number;
  rabiesCertificateValidityMonths: number;
  autoSendSmsReminder: boolean;
  autoSendEmailReminder: boolean;
  autoSendZaloReminder: boolean;
}

export interface NotificationSettings {
  lowStockThresholdDoses: number;
  expiringVaccineAlertDays: number;
  enableSoundAlerts: boolean;
  emailAlertRecipients: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  systemVersion: string;
  lastBackupDate: string;
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    general: {
      clinicName: 'Bệnh viện & Trung tâm Tiêm chủng Thú cưng PetVax',
      hotline: '1900 888 999',
      emergencyPhone: '0909 123 456',
      email: 'contact@petvax.vn',
      address: '123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      taxCode: '0314998877',
      currency: 'VND',
      timezone: 'Asia/Ho_Chi_Minh',
      logoUrl: '',
    } as GeneralSettings,

    operatingHours: {
      openingTime: '07:30',
      closingTime: '17:30',
      morningShiftStart: '07:30',
      morningShiftEnd: '11:30',
      afternoonShiftStart: '13:00',
      afternoonShiftEnd: '17:00',
      maxCapacityPerSlot: 10,
      closedDays: ['SUNDAY'],
    } as OperatingHoursSettings,

    vaccination: {
      defaultBoosterReminderDays: 7,
      rabiesCertificateValidityMonths: 12,
      autoSendSmsReminder: true,
      autoSendEmailReminder: true,
      autoSendZaloReminder: true,
    } as VaccinationSettings,

    notifications: {
      lowStockThresholdDoses: 20,
      expiringVaccineAlertDays: 30,
      enableSoundAlerts: true,
      emailAlertRecipients: 'admin@petvax.vn, manager@petvax.vn',
    } as NotificationSettings,

    system: {
      maintenanceMode: false,
      systemVersion: 'v1.2.4-admin',
      lastBackupDate: '2026-07-24 23:00:00',
    } as SystemSettings,

    saving: false,
  }),

  actions: {
    updateGeneralSettings(payload: Partial<GeneralSettings>) {
      this.general = { ...this.general, ...payload };
    },

    updateOperatingHours(payload: Partial<OperatingHoursSettings>) {
      this.operatingHours = { ...this.operatingHours, ...payload };
    },

    updateVaccinationSettings(payload: Partial<VaccinationSettings>) {
      this.vaccination = { ...this.vaccination, ...payload };
    },

    updateNotificationSettings(payload: Partial<NotificationSettings>) {
      this.notifications = { ...this.notifications, ...payload };
    },

    updateSystemSettings(payload: Partial<SystemSettings>) {
      this.system = { ...this.system, ...payload };
    },

    async saveAllSettings() {
      this.saving = true;
      try {
        // Simulate async save delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      } finally {
        this.saving = false;
      }
    },
  },
});
