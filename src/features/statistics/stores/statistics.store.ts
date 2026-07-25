import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Appointment {
  id: string;
  time: string;
  code: string;
  petName: string;
  owner: string;
  vaccine: string;
  status: 'Checked In' | 'Pending' | 'Overdue';
}

export interface UpcomingVaccination {
  id: string;
  pet: string;
  vaccine: string;
  datetime: string;
  urgency: 'today' | 'tomorrow' | 'later';
}

export interface InventoryAlert {
  id: string;
  type: 'Low Stock' | 'Expiring';
  name: string;
  desc: string;
  action: string;
}

export interface RecentActivity {
  id: string;
  type: 'appointment' | 'vaccine' | 'invoice';
  text: string;
  time: string;
}

export interface OverviewCard {
  key: string;
  labelKey: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  subLabelKey: string;
  iconName: string;
  bgClass: string;
  accentClass: string;
}

export const useStatisticsStore = defineStore('statistics', () => {
  const loading = ref(false);

  const appointmentsQueue = ref<Appointment[]>([]);
  const upcomingVaccinations = ref<UpcomingVaccination[]>([]);
  const inventoryAlerts = ref<InventoryAlert[]>([]);
  const recentActivities = ref<RecentActivity[]>([]);
  const overviewCards = ref<OverviewCard[]>([]);

  const fetchDashboardData = async () => {
    loading.value = true;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      appointmentsQueue.value = [
        {
          id: '1',
          time: '09:00 AM',
          code: 'APT-001',
          petName: 'Bella (Golden Retriever)',
          owner: 'Sarah Jenkins',
          vaccine: 'Annual Wellness Exam',
          status: 'Checked In',
        },
        {
          id: '2',
          time: '09:30 AM',
          code: 'APT-002',
          petName: 'Max (Siamese)',
          owner: 'David Chen',
          vaccine: 'Rabies Booster',
          status: 'Pending',
        },
        {
          id: '3',
          time: '08:15 AM',
          code: 'APT-003',
          petName: 'Luna (Pug)',
          owner: 'Maria Garcia',
          vaccine: 'FVRCP Booster',
          status: 'Overdue',
        },
      ];

      upcomingVaccinations.value = [
        { id: '1', pet: 'Luna', vaccine: 'FVRCP Booster', datetime: 'Today, 11:00 AM', urgency: 'today' },
        { id: '2', pet: 'Charlie', vaccine: 'Lyme Disease', datetime: 'Today, 2:15 PM', urgency: 'today' },
        { id: '3', pet: 'Daisy', vaccine: 'Bordetella', datetime: 'Tomorrow', urgency: 'tomorrow' },
      ];

      inventoryAlerts.value = [
        {
          id: '1',
          type: 'Low Stock',
          name: 'Rabies Vaccine (1yr)',
          desc: 'Only 5 doses remaining — Lot #RV-294',
          action: 'Reorder',
        },
        {
          id: '2',
          type: 'Expiring',
          name: 'DHPP',
          desc: 'Expires in 14 days — Lot #DP-102',
          action: 'View Lot',
        },
      ];

      recentActivities.value = [
        {
          id: '1',
          type: 'appointment',
          text: 'Sarah Jenkins booked a Rabies Booster for Bella.',
          time: '10 mins ago',
        },
        {
          id: '2',
          type: 'vaccine',
          text: 'FVRCP vaccine batch #1024 updated (added 50 doses).',
          time: '1 hour ago',
        },
        {
          id: '3',
          type: 'invoice',
          text: 'Invoice #INV-2023 for David Chen was marked as paid.',
          time: '2 hours ago',
        },
      ];

      overviewCards.value = [
        {
          key: 'appointments',
          labelKey: 'Appointments',
          value: '42',
          trend: 'up',
          trendValue: '+12%',
          subLabelKey: 'from yesterday',
          iconName: 'IconCalendarEvent',
          bgClass: 'bg-primary/10 text-primary',
          accentClass: 'border-l-primary',
        },
        {
          key: 'vaccines',
          labelKey: 'Vaccines Administered',
          value: '128',
          trend: 'up',
          trendValue: '+5%',
          subLabelKey: 'this week',
          iconName: 'IconVaccine',
          bgClass: 'bg-success-bg text-success',
          accentClass: 'border-l-success',
        },
        {
          key: 'inventory',
          labelKey: 'Low Stock Items',
          value: '3',
          trend: 'down',
          trendValue: '-2',
          subLabelKey: 'since last check',
          iconName: 'IconPackage',
          bgClass: 'bg-warning-bg text-warning',
          accentClass: 'border-l-warning',
        },
        {
          key: 'revenue',
          labelKey: 'Today Revenue',
          value: '$1,240',
          trend: 'up',
          trendValue: '+8%',
          subLabelKey: 'vs average',
          iconName: 'IconCash',
          bgClass: 'bg-indigo-50 text-indigo-500',
          accentClass: 'border-l-indigo-500',
        },
      ];
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    appointmentsQueue,
    upcomingVaccinations,
    inventoryAlerts,
    recentActivities,
    overviewCards,
    fetchDashboardData,
  };
});
