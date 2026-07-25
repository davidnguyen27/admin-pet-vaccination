<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  IconArrowLeft,
  IconStethoscope,
  IconClock,
  IconBuildingStore,
  IconCalendar,
  IconNotes,
  IconPaw,
  IconVaccine,
  IconCheck,
  IconEdit,
  IconRefresh,
  IconAlertCircle,
} from '@tabler/icons-vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { useWorkingScheduleStore } from '@/store/workingScheduleStore';
import ShiftFormDrawer from '../components/ShiftFormDrawer.vue';
import type { DoctorShift } from '@/shared/types/workingSchedule.type';

const route = useRoute();
const router = useRouter();
const { t } = useLocale();

const scheduleStore = useWorkingScheduleStore();
const { shifts, loading } = storeToRefs(scheduleStore);

const activeTab = ref('appointments');
const isEditDrawerOpen = ref(false);

const shiftId = computed(() => route.params.id as string);

const currentShift = computed<DoctorShift | undefined>(() => {
  return shifts.value.find(s => s.id === shiftId.value) || shifts.value[0];
});

onMounted(() => {
  if (shifts.value.length === 0) {
    scheduleStore.fetchShifts();
  }
});

const handleBack = () => {
  router.push('/schedules-working');
};

const handleRefresh = () => {
  scheduleStore.fetchShifts();
};

const capacityPercent = computed(() => {
  if (!currentShift.value || currentShift.value.maxCapacity === 0) return 0;
  return Math.round((currentShift.value.bookedCount / currentShift.value.maxCapacity) * 100);
});

const appointmentColumns = computed(() => [
  { title: 'Khung giờ', dataIndex: 'timeSlot', key: 'timeSlot', width: '130px' },
  { title: 'Thú cưng', dataIndex: 'petName', key: 'petName' },
  { title: 'Chủ nuôi', dataIndex: 'ownerName', key: 'ownerName' },
  { title: 'Vắc-xin / Dịch vụ', dataIndex: 'serviceName', key: 'serviceName' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: '130px' },
  { title: t('action'), key: 'action', width: '120px' },
]);

const getStatusColor = (st: string) => {
  switch (st) {
    case 'CHECKED_IN':
      return 'processing';
    case 'DONE':
      return 'success';
    default:
      return 'default';
  }
};
</script>

<template>
  <PageLayout>
    <a-spin :spinning="loading">
      <div v-if="!currentShift" class="bg-surface border-divider rounded border p-8 text-center">
        <IconAlertCircle size="48" class="text-text-muted mb-2 stroke-1" />
        <h2 class="text-text text-lg font-bold">Không tìm thấy ca trực</h2>
        <p class="text-text-muted mt-1 mb-4 text-xs">Ca trực bạn đang tìm kiếm không tồn tại hoặc đã bị thay đổi.</p>
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

          <div class="flex items-center gap-2">
            <a-button size="small" class="flex items-center gap-1" @click="handleRefresh">
              <IconRefresh size="14" />
              <span>{{ t('refresh') }}</span>
            </a-button>

            <a-button type="primary" size="small" class="flex items-center gap-1" @click="isEditDrawerOpen = true">
              <IconEdit size="14" />
              <span>{{ t('schedule.editShift') }}</span>
            </a-button>
          </div>
        </div>

        <!-- Main Header Banner -->
        <div class="bg-surface border-divider rounded border p-5 shadow-2xs">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-start gap-4">
              <a-avatar :src="currentShift.doctorAvatar" :size="64" class="border-divider shrink-0 border">
                <template #icon><IconStethoscope /></template>
              </a-avatar>

              <div class="flex min-w-0 flex-col">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-text text-xl font-extrabold tracking-tight">
                    {{ currentShift.doctorName }}
                  </h1>
                  <a-tag color="processing" class="mr-0! font-semibold">
                    {{ t(`schedule.status.${currentShift.status}`) }}
                  </a-tag>
                </div>

                <span class="text-text-muted mt-0.5 text-xs">{{ currentShift.doctorTitle }}</span>
                <span class="text-primary mt-0.5 text-xs font-medium">{{ currentShift.doctorSpecialization }}</span>
              </div>
            </div>

            <!-- Quick Shift Metadata Badges -->
            <div
              class="border-divider flex flex-wrap items-center gap-3 border-t pt-3 text-xs lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5"
            >
              <div class="flex flex-col">
                <span class="text-text-subtle text-2xs uppercase">Ngày trực</span>
                <span class="text-text flex items-center gap-1 font-bold">
                  <IconCalendar size="14" class="text-primary" />
                  {{ currentShift.date }}
                </span>
              </div>

              <div class="bg-divider hidden h-8 w-px sm:block"></div>

              <div class="flex flex-col">
                <span class="text-text-subtle text-2xs uppercase">Khung giờ</span>
                <span class="text-text flex items-center gap-1 font-mono font-bold">
                  <IconClock size="14" class="text-primary" />
                  {{ currentShift.startTime }} - {{ currentShift.endTime }}
                </span>
              </div>

              <div class="bg-divider hidden h-8 w-px sm:block"></div>

              <div class="flex flex-col">
                <span class="text-text-subtle text-2xs uppercase">Trạm / Phòng</span>
                <span class="text-text flex items-center gap-1 font-bold">
                  <IconBuildingStore size="14" class="text-primary" />
                  {{ currentShift.roomName }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Metrics Overview Row -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Tải tiếp nhận tiêm</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text font-mono text-2xl font-bold">
                {{ currentShift.bookedCount }}/{{ currentShift.maxCapacity }}
              </span>
              <span class="text-primary text-xs font-semibold">{{ capacityPercent }}%</span>
            </div>
            <a-progress
              :percent="capacityPercent"
              :stroke-color="capacityPercent >= 100 ? '#ef4444' : '#10b981'"
              :show-info="false"
              size="small"
              class="mt-2"
            />
          </div>

          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Ca đã Check-in</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text font-mono text-2xl font-bold">
                {{ currentShift.appointments?.filter(a => a.status === 'CHECKED_IN').length || 0 }}
              </span>
              <span class="text-text-subtle text-xs">Sẵn sàng tiêm</span>
            </div>
          </div>

          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Ca đang chờ tiếp nhận</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-text font-mono text-2xl font-bold">
                {{ currentShift.appointments?.filter(a => a.status === 'WAITING').length || 0 }}
              </span>
              <span class="text-text-subtle text-xs">Hàng đợi</span>
            </div>
          </div>

          <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
            <span class="text-text-muted text-xs font-semibold uppercase">Chuyên khoa ca trực</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-primary text-sm font-bold">
                {{ t(`schedule.department.${currentShift.department}`) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detailed Tabs Panel -->
        <div class="bg-surface border-divider rounded border p-4 shadow-2xs">
          <a-tabs v-model:activeKey="activeTab">
            <!-- Tab 1: Appointments Queue -->
            <a-tab-pane key="appointments">
              <template #tab>
                <span class="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  <IconPaw size="16" />
                  <span>Danh sách Lịch hẹn & Thú cưng ({{ currentShift.appointments?.length || 0 }})</span>
                </span>
              </template>

              <div class="mt-3 space-y-4">
                <a-table
                  :columns="appointmentColumns"
                  :data-source="currentShift.appointments || []"
                  row-key="id"
                  :pagination="false"
                  size="small"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'timeSlot'">
                      <span class="text-primary bg-primary/10 rounded px-2 py-1 font-mono text-xs font-bold">
                        {{ record.timeSlot }}
                      </span>
                    </template>

                    <template v-else-if="column.key === 'petName'">
                      <div class="flex flex-col">
                        <span class="text-text text-sm font-bold">{{ record.petName }}</span>
                        <span class="text-text-muted text-xs">{{ record.species }}</span>
                      </div>
                    </template>

                    <template v-else-if="column.key === 'ownerName'">
                      <div class="flex flex-col text-xs">
                        <span class="text-text font-semibold">{{ record.ownerName }}</span>
                        <span class="text-text-subtle font-mono">{{ record.ownerPhone }}</span>
                      </div>
                    </template>

                    <template v-else-if="column.key === 'status'">
                      <a-tag :color="getStatusColor(record.status)">
                        {{ record.status === 'CHECKED_IN' ? 'Đã Check-in' : 'Chờ tiêm' }}
                      </a-tag>
                    </template>

                    <template v-else-if="column.key === 'action'">
                      <a-button type="link" size="small" class="p-0!" @click="router.push('/pet-management')">
                        Xem thú cưng
                      </a-button>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-tab-pane>

            <!-- Tab 2: Station & Vaccine Preparation -->
            <a-tab-pane key="station">
              <template #tab>
                <span class="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  <IconVaccine size="16" />
                  <span>Trạm & Vắc-xin sẵn sàng</span>
                </span>
              </template>

              <div class="mt-4 space-y-4 text-xs">
                <div class="bg-bg border-divider space-y-3 rounded border p-4">
                  <h3 class="text-text flex items-center gap-2 text-sm font-bold">
                    <IconBuildingStore size="18" class="text-primary" />
                    <span>Thông tin Trạm / Phòng tiêm chủng: {{ currentShift.roomName }}</span>
                  </h3>
                  <div class="text-text-muted grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      Mã phòng: <span class="text-text font-mono font-bold">{{ currentShift.roomCode }}</span>
                    </div>
                    <div>
                      Nhiệt độ tủ bảo quản vắc-xin:
                      <span class="font-mono font-bold text-emerald-600">2.4°C (Chuẩn)</span>
                    </div>
                    <div>Tình trạng thiết bị tiêm: <span class="font-bold text-emerald-600">Sẵn sàng 100%</span></div>
                    <div>Y tá hỗ trợ ca trực: <span class="text-text font-bold">Y sĩ Nguyễn Hải Yến</span></div>
                  </div>
                </div>

                <div class="bg-bg border-divider rounded border p-4">
                  <h4 class="text-text-muted mb-2 text-xs font-bold uppercase">Danh mục Vắc-xin chuẩn bị ca trực</h4>
                  <ul class="text-text space-y-1.5">
                    <li class="flex items-center gap-2">
                      <IconCheck size="16" class="text-emerald-500" />
                      <span
                        >Vắc-xin Rabies Dại (Lô #LOT-2026-RAB):
                        <strong class="font-mono">25 liều sẵn sàng</strong></span
                      >
                    </li>
                    <li class="flex items-center gap-2">
                      <IconCheck size="16" class="text-emerald-500" />
                      <span
                        >Vắc-xin FVRCP 4 Bệnh cho Mèo (Lô #LOT-2026-FVR):
                        <strong class="font-mono">18 liều sẵn sàng</strong></span
                      >
                    </li>
                    <li class="flex items-center gap-2">
                      <IconCheck size="16" class="text-emerald-500" />
                      <span
                        >Vắc-xin DHPP 7 Bệnh cho Chó (Lô #LOT-2026-DHPP):
                        <strong class="font-mono">20 liều sẵn sàng</strong></span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </a-tab-pane>

            <!-- Tab 3: Handover & Notes -->
            <a-tab-pane key="notes">
              <template #tab>
                <span class="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  <IconNotes size="16" />
                  <span>Nhật ký bàn giao lâm sàng</span>
                </span>
              </template>

              <div class="mt-4 space-y-3 text-xs">
                <div class="rounded border border-amber-200 bg-amber-50/60 p-4 text-amber-900">
                  <h4 class="mb-1 text-sm font-bold">Ghi chú dặn dò ca trực</h4>
                  <p class="leading-relaxed">{{ currentShift.notes || 'Không có dặn dò đặc biệt cho ca trực này.' }}</p>
                </div>

                <div class="bg-bg border-divider space-y-2 rounded border p-4">
                  <h4 class="text-text-muted text-xs font-bold uppercase">Nhật ký theo dõi bác sĩ</h4>
                  <div class="text-text-subtle">Chưa có ghi nhận bất thường lâm sàng trong suốt ca trực.</div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <!-- Edit Shift Drawer -->
      <ShiftFormDrawer v-model:open="isEditDrawerOpen" :shift="currentShift" @saved="scheduleStore.fetchShifts" />
    </a-spin>
  </PageLayout>
</template>
