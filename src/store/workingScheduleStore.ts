import { defineStore } from 'pinia';
import type {
  DoctorScheduleInfo,
  DoctorShift,
  ScheduleFilters,
  ScheduleOverview,
  ScheduleViewMode,
} from '@/shared/types/workingSchedule.type';

export const MOCK_DOCTORS: DoctorScheduleInfo[] = [
  {
    id: 'doc-101',
    name: 'BS. CKII. Nguyễn Văn Minh',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    title: 'Trưởng khoa Lâm sàng & Tiêm chủng',
    specialization: 'Tiêm chủng vắc-xin & Bệnh truyền nhiễm',
    phone: '0903 123 456',
    email: 'minh.nguyen@pvms-clinic.vn',
    status: 'ACTIVE',
    assignedRoom: 'Phòng Tiêm 01',
  },
  {
    id: 'doc-102',
    name: 'BS. CKI. Trần Thị Ngọc',
    avatar: 'https://images.unsplash.com/photo-1594824813570-78988072613d?w=150&auto=format&fit=crop&q=80',
    title: 'Bác sĩ Phẫu thuật Trưởng',
    specialization: 'Phẫu thuật Mô mềm & Triệt sản',
    phone: '0912 987 654',
    email: 'ngoc.tran@pvms-clinic.vn',
    status: 'ACTIVE',
    assignedRoom: 'Phòng Phẫu thuật A',
  },
  {
    id: 'doc-103',
    name: 'BS. Lê Hoàng Nam',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    title: 'Bác sĩ Khám Tổng quát',
    specialization: 'Nội khoa & Chẩn đoán hình ảnh',
    phone: '0988 555 444',
    email: 'nam.le@pvms-clinic.vn',
    status: 'ACTIVE',
    assignedRoom: 'Phòng Khám 02',
  },
  {
    id: 'doc-104',
    name: 'BS. Phạm Mỹ Linh',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    title: 'Bác sĩ Tiêm chủng & Nhi khoa Thú cưng',
    specialization: 'Tiêm ngừa định kỳ & Dinh dưỡng thú cưng',
    phone: '0934 777 888',
    email: 'linh.pham@pvms-clinic.vn',
    status: 'ACTIVE',
    assignedRoom: 'Phòng Tiêm 02',
  },
  {
    id: 'doc-105',
    name: 'BS. Vũ Đức Thắng',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    title: 'Bác sĩ Trực Cấp cứu 24/7',
    specialization: 'Cấp cứu đa khoa & Hồi sức tích cực',
    phone: '0977 111 222',
    email: 'thang.vu@pvms-clinic.vn',
    status: 'ACTIVE',
    assignedRoom: 'Phòng Cấp cứu 24/7',
  },
];

export const MOCK_SHIFTS: DoctorShift[] = [
  {
    id: 'shift-001',
    doctorId: 'doc-101',
    doctorName: 'BS. CKII. Nguyễn Văn Minh',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    doctorTitle: 'Trưởng khoa Tiêm chủng',
    doctorSpecialization: 'Tiêm chủng vắc-xin & Bệnh truyền nhiễm',
    date: '2026-07-24',
    shiftType: 'MORNING',
    startTime: '07:30',
    endTime: '11:30',
    roomCode: 'RM-VAC-01',
    roomName: 'Phòng Tiêm chủng #01',
    department: 'VACCINATION',
    maxCapacity: 15,
    bookedCount: 12,
    status: 'IN_PROGRESS',
    notes: 'Ưu tiên các ca tiêm vắc-xin Dại & Combo 7 bệnh cho chó con.',
    appointments: [
      {
        id: 'app-01',
        petName: 'Miu Miu',
        species: 'Mèo Mỹ Lông Ngắn',
        ownerName: 'Nguyễn Thu Hà',
        ownerPhone: '0901 234 567',
        serviceName: 'Tiêm Combo 4 Bệnh FVRCP',
        timeSlot: '08:00 - 08:30',
        status: 'CHECKED_IN',
      },
      {
        id: 'app-02',
        petName: 'Lucky',
        species: 'Chó Golden Retriever',
        ownerName: 'Trần Văn Mạnh',
        ownerPhone: '0918 888 999',
        serviceName: 'Tiêm Vắc-xin Dại Rabies',
        timeSlot: '08:30 - 09:00',
        status: 'WAITING',
      },
      {
        id: 'app-03',
        petName: 'Kiki',
        species: 'Chó Poodle',
        ownerName: 'Lê Minh Anh',
        ownerPhone: '0972 333 444',
        serviceName: 'Tiêm Nhắc Combo 7 Bệnh',
        timeSlot: '09:15 - 09:45',
        status: 'WAITING',
      },
    ],
  },
  {
    id: 'shift-002',
    doctorId: 'doc-103',
    doctorName: 'BS. Lê Hoàng Nam',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    doctorTitle: 'Bác sĩ Khám Tổng quát',
    doctorSpecialization: 'Nội khoa & Chẩn đoán hình ảnh',
    date: '2026-07-24',
    shiftType: 'MORNING',
    startTime: '07:30',
    endTime: '11:30',
    roomCode: 'RM-EXAM-02',
    roomName: 'Phòng Khám Lâm sàng #02',
    department: 'GENERAL_EXAM',
    maxCapacity: 12,
    bookedCount: 10,
    status: 'IN_PROGRESS',
    notes: 'Kiểm tra sức khỏe tiền tiêm phòng và khám tổng quát định kỳ.',
    appointments: [
      {
        id: 'app-04',
        petName: 'Bún',
        species: 'Chó Corgi',
        ownerName: 'Phạm Thị Hải',
        ownerPhone: '0933 222 111',
        serviceName: 'Khám tổng quát tiền tiêm',
        timeSlot: '08:15 - 08:45',
        status: 'CHECKED_IN',
      },
    ],
  },
  {
    id: 'shift-003',
    doctorId: 'doc-104',
    doctorName: 'BS. Phạm Mỹ Linh',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    doctorTitle: 'Bác sĩ Tiêm chủng Nhi khoa',
    doctorSpecialization: 'Tiêm ngừa định kỳ & Dinh dưỡng thú cưng',
    date: '2026-07-24',
    shiftType: 'AFTERNOON',
    startTime: '13:00',
    endTime: '17:00',
    roomCode: 'RM-VAC-02',
    roomName: 'Phòng Tiêm chủng #02',
    department: 'VACCINATION',
    maxCapacity: 15,
    bookedCount: 8,
    status: 'SCHEDULED',
    notes: 'Tiêm phòng cho mèo con sơ sinh và tư vấn lịch tiêm định kỳ.',
    appointments: [],
  },
  {
    id: 'shift-004',
    doctorId: 'doc-102',
    doctorName: 'BS. CKI. Trần Thị Ngọc',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813570-78988072613d?w=150&auto=format&fit=crop&q=80',
    doctorTitle: 'Bác sĩ Phẫu thuật Trưởng',
    doctorSpecialization: 'Phẫu thuật Mô mềm & Triệt sản',
    date: '2026-07-24',
    shiftType: 'AFTERNOON',
    startTime: '13:00',
    endTime: '17:00',
    roomCode: 'RM-SURG-A',
    roomName: 'Phòng Phẫu thuật Vô trùng A',
    department: 'SURGERY',
    maxCapacity: 6,
    bookedCount: 5,
    status: 'SCHEDULED',
    notes: 'Lịch phẫu thuật triệt sản chó mèo và theo dõi hậu phẫu.',
    appointments: [],
  },
];

export const useWorkingScheduleStore = defineStore('workingSchedule', {
  state: () => ({
    doctors: MOCK_DOCTORS as DoctorScheduleInfo[],
    shifts: MOCK_SHIFTS as DoctorShift[],
    filters: {
      date: '2026-07-24',
      search: '',
      shiftType: undefined,
      department: undefined,
      status: undefined,
      viewMode: 'SHIFT_GRID',
    } as ScheduleFilters,
    loading: false,
    selectedShift: null as DoctorShift | null,
  }),

  getters: {
    overviewStats(state): ScheduleOverview {
      const activeShifts = state.shifts.filter(s => s.date === state.filters.date);
      const morningCount = activeShifts.filter(s => s.shiftType === 'MORNING').length;
      const afternoonCount = activeShifts.filter(s => s.shiftType === 'AFTERNOON').length;

      const totalCapacity = activeShifts.reduce((acc, curr) => acc + curr.maxCapacity, 0);
      const bookedCapacity = activeShifts.reduce((acc, curr) => acc + curr.bookedCount, 0);

      const uniqueVets = new Set(activeShifts.map(s => s.doctorId));

      return {
        totalScheduledToday: activeShifts.length,
        morningCount,
        afternoonCount,
        totalCapacity,
        bookedCapacity,
        activeVetsCount: uniqueVets.size,
      };
    },

    filteredShifts(state): DoctorShift[] {
      let result = [...state.shifts];

      if (state.filters.date) {
        result = result.filter(s => s.date === state.filters.date);
      }

      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        result = result.filter(
          s =>
            s.doctorName.toLowerCase().includes(q) ||
            s.roomName.toLowerCase().includes(q) ||
            s.doctorSpecialization.toLowerCase().includes(q),
        );
      }

      if (state.filters.shiftType) {
        result = result.filter(s => s.shiftType === state.filters.shiftType);
      }

      if (state.filters.department) {
        result = result.filter(s => s.department === state.filters.department);
      }

      if (state.filters.status) {
        result = result.filter(s => s.status === state.filters.status);
      }

      return result;
    },
  },

  actions: {
    async fetchShifts() {
      this.loading = true;
      try {
        // Mock state is maintained locally
      } finally {
        this.loading = false;
      }
    },

    setFilters(partial: Partial<ScheduleFilters>) {
      this.filters = { ...this.filters, ...partial };
    },

    resetFilters() {
      this.filters = {
        date: this.filters.date || '2026-07-24',
        search: '',
        shiftType: undefined,
        department: undefined,
        status: undefined,
        viewMode: this.filters.viewMode || 'SHIFT_GRID',
      };
    },

    setViewMode(mode: ScheduleViewMode) {
      this.filters.viewMode = mode;
    },

    setDate(dateStr: string) {
      this.filters.date = dateStr;
    },

    selectShift(shift: DoctorShift | null) {
      this.selectedShift = shift;
    },

    async createShift(data: Partial<DoctorShift>) {
      this.loading = true;
      try {
        const foundDoctor = this.doctors.find(d => d.id === data.doctorId) ?? this.doctors[0];
        const doctor = foundDoctor ?? {
          id: 'doc-101',
          name: 'BS. CKII. Nguyễn Văn Minh',
          avatar: '',
          title: 'Trưởng khoa Tiêm chủng',
          specialization: 'Tiêm chủng vắc-xin & Bệnh truyền nhiễm',
          phone: '',
          email: '',
          status: 'ACTIVE' as const,
        };

        const newShift: DoctorShift = {
          id: `shift-${Date.now()}`,
          doctorId: doctor.id,
          doctorName: doctor.name,
          doctorAvatar: doctor.avatar,
          doctorTitle: doctor.title,
          doctorSpecialization: doctor.specialization,
          date: data.date || this.filters.date || '2026-07-24',
          shiftType: data.shiftType || 'MORNING',
          startTime: data.startTime || '07:30',
          endTime: data.endTime || '11:30',
          roomCode: data.roomCode || 'RM-VAC-01',
          roomName: data.roomName || 'Phòng Tiêm chủng #01',
          department: data.department || 'VACCINATION',
          maxCapacity: data.maxCapacity || 12,
          bookedCount: 0,
          status: data.status || 'SCHEDULED',
          notes: data.notes || '',
          appointments: [],
        };

        this.shifts.unshift(newShift);
        return newShift;
      } finally {
        this.loading = false;
      }
    },

    async updateShift(id: string, data: Partial<DoctorShift>) {
      this.loading = true;
      try {
        const idx = this.shifts.findIndex(s => s.id === id);
        if (idx !== -1 && this.shifts[idx]) {
          const current = this.shifts[idx];
          this.shifts[idx] = {
            ...current,
            ...data,
            id: current.id,
          };
          if (this.selectedShift?.id === id) {
            this.selectedShift = this.shifts[idx];
          }
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteShift(id: string) {
      this.loading = true;
      try {
        const idx = this.shifts.findIndex(s => s.id === id);
        if (idx !== -1) {
          this.shifts.splice(idx, 1);
        }
        if (this.selectedShift?.id === id) {
          this.selectedShift = null;
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
