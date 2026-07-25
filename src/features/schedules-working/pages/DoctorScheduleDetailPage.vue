<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  IconArrowLeft,
  IconStethoscope,
  IconBuildingStore,
  IconCalendar,
  IconPhone,
  IconMail,
  IconCalendarPlus,
  IconChevronRight,
  IconChartBar,
  IconUserCheck,
  IconAlertCircle,
} from '@tabler/icons-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import ShiftFormDrawer from '../components/ShiftFormDrawer.vue';
import type { DoctorScheduleInfo } from '@/shared/types/workingSchedule.type';

const route = useRoute();
const router = useRouter();
const { t } = useLocale();

const scheduleStore = useWorkingScheduleStore();
const { doctors, shifts, loading } = storeToRefs(scheduleStore);

const activeTab = ref('roster');
const isAddShiftDrawerOpen = ref(false);

const doctorId = computed(() => route.params.id as string);

const doctor = computed<DoctorScheduleInfo | undefined>(() => {
  return doctors.value.find(d => d.id === doctorId.value) || doctors.value[0];
});

const doctorShifts = computed(() => {
  if (!doctor.value) return [];
  return shifts.value.filter(s => s.doctorId === doctor.value?.id);
});

const totalBookedAppointments = computed(() => {
  return doctorShifts.value.reduce((acc, curr) => acc + curr.bookedCount, 0);
});

onMounted(() => {
  if (shifts.value.length === 0) {
    scheduleStore.fetchShifts();
  }
});

const handleBack = () => {
  router.push('/schedules-working');
};

const handleGoToShift = (shiftId: string) => {
  router.push(`/schedules-working/shifts/${shiftId}`);
};
</script>

<template>
  <PageLayout>
    <a-spin :spinning="loading">
      <div v-if="!doctor" class="bg-surface border-divider rounded border p-8 text-center">
        <IconAlertCircle size="48" class="text-text-muted mb-2 stroke-1" />
        <h2 class="text-text text-lg font-bold">Không tìm thấy Bác sĩ</h2>
        <p class="text-text-muted mt-1 mb-4 text-xs">Thông tin bác sĩ không tồn tại hoặc đã bị thay đổi.</p>
        <a-button type="primary" @click="handleBack">Quay lại Lịch làm việc</a-button>
      </div>

      <div v-else class="space-y-5">
        <!-- Top Back Navigation Bar -->
        <div class="flex items-center justify-between">
          <button
            class="text-text-muted hover:text-primary flex cursor-pointer items-center gap-1.5 text-xs font-semibold transition-colors"
            @click="handleBack"
          >
            <IconArrowLeft size="16" />
            <span>Quay lại Lịch làm việc Bác sĩ</span>
          </button>

          <a-button type="primary" size="small" class="flex items-center gap-1" @click="isAddShiftDrawerOpen = true">
            <IconCalendarPlus size="14" />
            <span>Phân ca mới cho Bác sĩ</span>
          </a-button>
        </div>

        <!-- Doctor Profile Card Header -->
        <div class="bg-surface border-divider rounded border p-5 shadow-2xs">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-start gap-4">
              <a-avatar :src="doctor.avatar" :size="64" class="border-divider shrink-0 border">
                <template #icon><IconStethoscope /></template>
              </a-avatar>

              <div class="flex min-w-0 flex-col">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-text text-xl font-extrabold tracking-tight">
                    {{ doctor.name }}
                  </h1>
                  <a-tag color="success" class="mr-0! font-semibold">
                    {{ doctor.status === 'ACTIVE' ? 'Đang làm việc' : 'Nghỉ phép' }}
                  </a-tag>
                </div>

                <span class="text-text-muted mt-0.5 text-xs">{{ doctor.title }}</span>
                <span class="text-primary mt-0.5 text-xs font-medium">{{ doctor.specialization }}</span>
              </div>
            </div>

            <!-- Doctor Contact & Station Info -->
            <div
              class="border-divider flex flex-wrap items-center gap-3 border-t pt-3 text-xs md:border-t-0 md:border-l md:pt-0 md:pl-5"
            >
              <div class="text-text-muted flex flex-col gap-1">
                <div class="flex items-center gap-1.5">
                  <IconPhone size="14" class="text-text-subtle" />
                  <span>{{ doctor.phone }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <IconMail size="14" class="text-text-subtle" />
                  <span>{{ doctor.email }}</span>
                </div>
                <div v-if="doctor.assignedRoom" class="text-text mt-0.5 flex items-center gap-1.5 font-medium">
                  <IconBuildingStore size="14" class="text-primary" />
                  <span>Trạm chính: {{ doctor.assignedRoom }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Workload Statistics Cards -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Tổng ca phân công</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text font-mono text-2xl font-bold">{{ doctorShifts.length }}</span>
              <span class="text-text-subtle text-xs">Ca trực</span>
            </div>
          </div>

          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Tổng lượt hẹn đã nhận</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text font-mono text-2xl font-bold">{{ totalBookedAppointments }}</span>
              <span class="text-text-subtle text-xs">Ca tiêm / khám</span>
            </div>
          </div>

          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Số giờ trực tích lũy</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text font-mono text-2xl font-bold"> {{ doctorShifts.length * 4 }}h </span>
              <span class="text-text-subtle text-xs">Giờ làm việc</span>
            </div>
          </div>

          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Trạng thái chuyên môn</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text text-sm font-bold">Sẵn sàng tiêm chủng</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
          <a-tabs v-model:activeKey="activeTab">
            <!-- Tab 1: Full Roster Schedule -->
            <a-tab-pane key="roster">
              <template #tab>
                <span class="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  <IconCalendar size="16" />
                  <span>Danh sách Ca trực ({{ doctorShifts.length }})</span>
                </span>
              </template>

              <div class="mt-3 space-y-3">
                <div
                  v-if="doctorShifts.length === 0"
                  class="bg-bg border-divider text-text-subtle rounded border p-6 text-center text-xs"
                >
                  Chưa có ca trực nào được phân công cho bác sĩ này.
                </div>

                <div v-else class="space-y-2.5">
                  <div
                    v-for="s in doctorShifts"
                    :key="s.id"
                    class="bg-bg hover:bg-surface border-divider flex cursor-pointer flex-col gap-3 rounded border p-3.5 text-xs transition-all sm:flex-row sm:items-center sm:justify-between"
                    @click="handleGoToShift(s.id)"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex flex-col">
                        <span class="text-text text-sm font-bold">{{ t(`schedule.shiftType.${s.shiftType}`) }}</span>
                        <span class="text-text-muted font-mono text-xs"
                          >{{ s.date }} ({{ s.startTime }} - {{ s.endTime }})</span
                        >
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="text-text flex items-center gap-1.5 font-medium">
                        <IconBuildingStore size="15" class="text-primary" />
                        <span>{{ s.roomName }}</span>
                      </div>

                      <a-tag color="processing"> {{ s.bookedCount }}/{{ s.maxCapacity }} ca </a-tag>

                      <IconChevronRight size="16" class="text-text-subtle" />
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <!-- Tab 2: Station Analytics -->
            <a-tab-pane key="analytics">
              <template #tab>
                <span class="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  <IconChartBar size="16" />
                  <span>Phân bổ Trạm & Khối lượng</span>
                </span>
              </template>

              <div class="mt-4 space-y-3 text-xs">
                <div class="bg-bg border-divider space-y-2 rounded border p-4">
                  <h4 class="text-text-muted text-xs font-bold uppercase">Phân bổ chuyên khoa phụ trách</h4>
                  <div class="flex items-center gap-2">
                    <a-tag color="blue">{{ doctor.specialization }}</a-tag>
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <!-- Tab 3: Leave & Shift Swaps -->
            <a-tab-pane key="leave">
              <template #tab>
                <span class="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  <IconUserCheck size="16" />
                  <span>Đổi ca & Nghỉ phép</span>
                </span>
              </template>

              <div class="text-text-subtle border-divider bg-bg mt-4 rounded border py-6 text-center text-xs">
                Không ghi nhận yêu cầu đổi ca hoặc nghỉ phép nào gần đây.
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <!-- Add Shift Drawer -->
      <ShiftFormDrawer
        v-model:open="isAddShiftDrawerOpen"
        :initial-doctor-id="doctor?.id"
        @saved="scheduleStore.fetchShifts"
      />
    </a-spin>
  </PageLayout>
</template>
