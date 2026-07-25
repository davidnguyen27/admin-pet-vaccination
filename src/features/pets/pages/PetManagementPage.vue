<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import type { TableColumnsType } from 'ant-design-vue';
import {
  IconBone,
  IconEdit,
  IconEye,
  IconFilterOff,
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  IconPaw,
  IconPlus,
  IconReload,
  IconSearch,
  IconTrash,
} from '@tabler/icons-vue';
import dayjs from 'dayjs';
import PageLayout from '@/layouts/PageLayout.vue';
import Pagination from '@/shared/components/ui/Pagination.vue';
import { useLocale } from '@/shared/composables/useLocale';
import { getSpeciesColor } from '@/shared/helpers';
import { calculateAge, formatDate } from '@/shared/utils';
import { usePetStore } from '@/store/petStore';
import type { Pet } from '@/shared/types/pet.type';

const { t } = useLocale();
const petStore = usePetStore();
const { loading, listPet, overView, filters } = storeToRefs(petStore);

const selectedPet = ref<Pet | null>(null);
const isDetailOpen = ref(false);

const filterState = reactive({
  search: filters.value.search || '',
  species: filters.value.species,
});

const speciesOptions = computed(() => [
  { value: 'dog', label: t('pet.speciesOptions.dog') },
  { value: 'cat', label: t('pet.speciesOptions.cat') },
  { value: 'bird', label: t('pet.speciesOptions.bird') },
  { value: 'other', label: t('pet.speciesOptions.other') },
]);

const overviewCards = computed(() => [
  {
    key: 'total',
    label: t('all'),
    value: overView.value.total,
    icon: IconPaw,
    description: t('pet.totalPets'),
  },
  {
    key: 'dogs',
    label: t('pet.speciesOptions.dog'),
    value: overView.value.dogs,
    icon: IconBone,
    description: t('pet.dogRecords'),
  },
  {
    key: 'cats',
    label: t('pet.speciesOptions.cat'),
    value: overView.value.cats,
    icon: IconPaw,
    description: t('pet.catRecords'),
  },
  {
    key: 'others',
    label: t('pet.speciesOptions.other'),
    value: overView.value.others,
    icon: IconPaw,
    description: t('pet.otherSpecies'),
  },
]);

const columns = computed<TableColumnsType>(() => [
  { title: t('pet.info'), dataIndex: 'info', key: 'info', width: 260 },
  { title: t('pet.owner'), dataIndex: 'ownerName', key: 'ownerName', width: 180 },
  { title: t('pet.species'), dataIndex: 'speciesId', key: 'speciesId', width: 120 },
  { title: t('pet.sex'), dataIndex: 'sex', key: 'sex', width: 120 },
  { title: t('pet.details'), dataIndex: 'details', key: 'details', width: 220 },
  { title: t('pet.dob'), dataIndex: 'dob', key: 'dob', width: 150 },
  { title: t('pet.note'), dataIndex: 'note', key: 'note', ellipsis: true, width: 220 },
  { title: t('action'), key: 'action', align: 'center', fixed: 'right', width: 128 },
]);

const petsData = computed(() => listPet.value.data);
const totalPets = computed(() => listPet.value.total);
const currentRange = computed(() => {
  if (!totalPets.value) return '0';

  const start = (listPet.value.page - 1) * listPet.value.limit + 1;
  const end = Math.min(listPet.value.page * listPet.value.limit, totalPets.value);
  return `${start}-${end}`;
});

watch(
  () => filters.value,
  newFilters => {
    filterState.search = newFilters.search || '';
    filterState.species = newFilters.species;
  },
  { deep: true },
);

function fetchPets() {
  petStore.fetchPetList();
}

function refreshData() {
  petStore.fetchPetOverView();
  fetchPets();
}

function applyFilters() {
  petStore.setFilters({
    search: filterState.search,
    species: filterState.species,
  });
  fetchPets();
}

function resetFilters() {
  petStore.resetFilters();
  fetchPets();
}

function handlePageChange(page: number) {
  petStore.setPagination(page, listPet.value.limit);
  fetchPets();
}

function handlePageSizeChange(pageSize: number) {
  petStore.setPagination(1, pageSize);
  fetchPets();
}

function openPetDetail(pet: Pet) {
  selectedPet.value = pet;
  isDetailOpen.value = true;
}

function handleUnavailableAction() {
  message.info(t('pet.actionUnavailable'));
}

function getSpeciesLabel(speciesId?: string) {
  if (!speciesId) return t('pet.unknown');
  return t(`pet.speciesOptions.${speciesId}`);
}

function getSexLabel(sex?: string) {
  if (sex === 'MALE') return t('pet.male');
  if (sex === 'FEMALE') return t('pet.female');
  return t('pet.unknownSex');
}

onMounted(() => {
  refreshData();
});
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <div class="border-border bg-surface flex flex-col gap-4 border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-col gap-1">
          <h1 class="font-ibm text-text text-xl font-bold">{{ t('pet.management') }}</h1>
          <p class="text-text-muted text-sm">{{ t('pet.manageRecords') }}</p>
        </div>

        <div class="flex items-center gap-3">
          <a-tooltip :title="t('refresh')">
            <a-button type="default" size="large" class="flex items-center justify-center" @click="refreshData">
              <template #icon><IconReload size="18" class="text-text-muted" /></template>
            </a-button>
          </a-tooltip>
          <a-button type="primary" size="large" class="flex items-center justify-center gap-2" @click="handleUnavailableAction">
            <template #icon><IconPlus size="18" /></template>
            <span class="font-medium">{{ t('pet.addPet') }}</span>
          </a-button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div v-for="item in overviewCards" :key="item.key" class="bg-surface border-border flex flex-col border p-4">
          <div class="flex items-center justify-between">
            <span class="text-text-muted text-sm font-medium">{{ item.label }}</span>
            <div class="bg-primary-soft text-primary flex h-10 w-10 items-center justify-center rounded-sm">
              <component :is="item.icon" size="22" stroke="1.5" />
            </div>
          </div>
          <div class="text-text mt-2 text-2xl font-bold">{{ item.value }}</div>
          <span class="text-text-muted mt-1 text-xs">{{ item.description }}</span>
        </div>
      </div>

      <div class="border-border bg-surface border">
        <div class="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="flex flex-1 flex-wrap items-center gap-4">
            <div class="flex w-full flex-col gap-1 sm:w-[280px]">
              <label for="pet-search" class="text-text-muted text-xs font-semibold">{{ t('search') }}</label>
              <a-input
                id="pet-search"
                v-model:value="filterState.search"
                :placeholder="t('pet.searchPlaceholder')"
                allow-clear
                size="large"
                @press-enter="applyFilters"
              >
                <template #prefix>
                  <IconSearch class="text-text-muted size-4" />
                </template>
              </a-input>
            </div>

            <div class="flex w-full flex-col gap-1 sm:w-48">
              <label class="text-text-muted text-xs font-semibold">{{ t('pet.species') }}</label>
              <a-select
                v-model:value="filterState.species"
                :placeholder="t('pet.speciesPlaceholder')"
                :options="speciesOptions"
                allow-clear
                class="w-full"
                size="large"
                @change="applyFilters"
              />
            </div>
          </div>

          <div class="flex w-full gap-3 sm:w-auto">
            <a-button size="large" class="flex w-full items-center justify-center gap-2 sm:w-auto" @click="applyFilters">
              <template #icon><IconSearch class="size-4" /></template>
              <span class="font-medium">{{ t('search') }}</span>
            </a-button>
            <a-button size="large" class="flex w-full items-center justify-center gap-2 sm:w-auto" @click="resetFilters">
              <template #icon><IconFilterOff class="size-4" /></template>
              <span class="font-medium">{{ t('reset') }}</span>
            </a-button>
          </div>
        </div>

        <div class="border-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <div class="bg-primary-soft text-primary flex h-8 w-8 items-center justify-center rounded-sm">
              <IconPaw size="18" />
            </div>
            <div>
              <h2 class="text-text text-sm font-semibold">{{ t('pet.list') }}</h2>
              <p class="text-text-muted text-xs">
                {{ t('pet.showingRange', { range: currentRange, total: totalPets }) }}
              </p>
            </div>
          </div>
        </div>

        <a-table
          row-key="id"
          :columns="columns"
          :data-source="petsData"
          :loading="loading"
          :pagination="false"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'info'">
              <div class="flex items-center gap-3">
                <a-avatar :size="40" class="bg-primary-soft text-primary font-bold">
                  {{ record.name?.charAt(0).toUpperCase() || 'P' }}
                </a-avatar>
                <div class="flex min-w-0 flex-col">
                  <span class="text-text truncate text-sm font-semibold">{{ record.name || t('pet.unknown') }}</span>
                  <span class="text-text-muted truncate text-xs">{{ record.breed || t('pet.unknown') }}</span>
                </div>
              </div>
            </template>

            <template v-else-if="column.key === 'ownerName'">
              <span class="text-text text-sm">{{ record.ownerName || '-' }}</span>
            </template>

            <template v-else-if="column.key === 'speciesId'">
              <a-tag :color="getSpeciesColor(record.speciesId)" class="m-0 capitalize">
                {{ getSpeciesLabel(record.speciesId) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'sex'">
              <div class="flex items-center gap-1">
                <IconGenderMale v-if="record.sex === 'MALE'" size="16" class="text-info" />
                <IconGenderFemale v-else-if="record.sex === 'FEMALE'" size="16" class="text-error" />
                <IconGenderAgender v-else size="16" class="text-text-muted" />
                <span class="text-text text-sm">{{ getSexLabel(record.sex) }}</span>
              </div>
            </template>

            <template v-else-if="column.key === 'details'">
              <div class="flex flex-col gap-1">
                <span class="text-text text-sm">{{ t('pet.weight') }}: {{ record.weight ? `${record.weight} kg` : '-' }}</span>
                <span class="text-text-muted text-xs">{{ t('pet.color') }}: {{ record.color || '-' }}</span>
                <a-tag :color="record.isSterilized ? 'green' : 'orange'" class="m-0 w-fit">
                  {{ record.isSterilized ? t('pet.sterilized') : t('pet.notSterilized') }}
                </a-tag>
              </div>
            </template>

            <template v-else-if="column.key === 'dob'">
              <div class="flex flex-col">
                <span class="text-text text-sm">{{ record.dob ? dayjs(record.dob).format('DD/MM/YYYY') : '-' }}</span>
                <span v-if="record.dob" class="text-text-muted text-xs">{{ calculateAge(record.dob) }}</span>
              </div>
            </template>

            <template v-else-if="column.key === 'note'">
              <a-tooltip v-if="record.note" :title="record.note" placement="topLeft">
                <div class="text-text-muted max-w-[200px] truncate text-sm">{{ record.note }}</div>
              </a-tooltip>
              <span v-else class="text-text-muted text-sm">-</span>
            </template>

            <template v-else-if="column.key === 'action'">
              <div class="flex items-center justify-center gap-1">
                <a-tooltip :title="t('view')">
                  <a-button type="text" class="text-primary flex items-center justify-center" @click="openPetDetail(record)">
                    <template #icon><IconEye size="18" /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip :title="t('edit')">
                  <a-button type="text" class="text-primary flex items-center justify-center" @click="handleUnavailableAction">
                    <template #icon><IconEdit size="18" /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip :title="t('delete')">
                  <a-button type="text" danger class="flex items-center justify-center" @click="handleUnavailableAction">
                    <template #icon><IconTrash size="18" /></template>
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>

        <Pagination
          :current="listPet.page"
          :pageSize="listPet.limit"
          :total="listPet.total"
          @update:current="handlePageChange"
          @update:pageSize="handlePageSizeChange"
        />
      </div>
    </div>

    <a-drawer
      :open="isDetailOpen"
      :title="t('pet.detailTitle')"
      width="420"
      destroy-on-close
      @close="isDetailOpen = false"
    >
      <div v-if="selectedPet" class="flex flex-col gap-5">
        <div class="flex items-center gap-3">
          <a-avatar :size="48" class="bg-primary-soft text-primary text-lg font-bold">
            {{ selectedPet.name.charAt(0).toUpperCase() }}
          </a-avatar>
          <div>
            <h3 class="text-text text-base font-semibold">{{ selectedPet.name }}</h3>
            <p class="text-text-muted text-sm">{{ selectedPet.breed || t('pet.unknown') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div class="border-border border p-3">
            <p class="text-text-muted mb-1 text-xs">{{ t('pet.owner') }}</p>
            <p class="text-text text-sm font-medium">{{ selectedPet.ownerName || '-' }}</p>
          </div>
          <div class="border-border border p-3">
            <p class="text-text-muted mb-1 text-xs">{{ t('pet.species') }}</p>
            <p class="text-text text-sm font-medium">{{ getSpeciesLabel(selectedPet.speciesId) }}</p>
          </div>
          <div class="border-border border p-3">
            <p class="text-text-muted mb-1 text-xs">{{ t('pet.sex') }}</p>
            <p class="text-text text-sm font-medium">{{ getSexLabel(selectedPet.sex) }}</p>
          </div>
          <div class="border-border border p-3">
            <p class="text-text-muted mb-1 text-xs">{{ t('pet.dob') }}</p>
            <p class="text-text text-sm font-medium">{{ formatDate(selectedPet.dob) }}</p>
          </div>
          <div class="border-border border p-3">
            <p class="text-text-muted mb-1 text-xs">{{ t('pet.details') }}</p>
            <p class="text-text text-sm font-medium">
              {{ selectedPet.weight }} kg · {{ selectedPet.color || '-' }} ·
              {{ selectedPet.isSterilized ? t('pet.sterilized') : t('pet.notSterilized') }}
            </p>
          </div>
          <div class="border-border border p-3">
            <p class="text-text-muted mb-1 text-xs">{{ t('pet.note') }}</p>
            <p class="text-text text-sm font-medium">{{ selectedPet.note || t('pet.noNote') }}</p>
          </div>
        </div>
      </div>
    </a-drawer>
  </PageLayout>
</template>
