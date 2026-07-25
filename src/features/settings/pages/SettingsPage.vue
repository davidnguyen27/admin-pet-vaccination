<script setup lang="ts">
import { ref } from 'vue';
import { useLocale } from '@/shared/composables/useLocale';
import PageLayout from '@/layouts/PageLayout.vue';
import GeneralSettingsTab from '../components/GeneralSettingsTab.vue';
import OperatingHoursTab from '../components/OperatingHoursTab.vue';
import VaccinationSettingsTab from '../components/VaccinationSettingsTab.vue';
import NotificationSettingsTab from '../components/NotificationSettingsTab.vue';
import SystemBackupTab from '../components/SystemBackupTab.vue';
import {
  IconBuilding,
  IconClock,
  IconVaccine,
  IconBell,
  IconServer,
} from '@tabler/icons-vue';

const { t } = useLocale();
const activeTab = ref('general');
</script>

<template>
  <PageLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <h1 class="font-ibm text-text text-xl font-bold">
          {{ t('settings.title') }}
        </h1>
        <p class="text-text-muted text-xs sm:text-sm">
          {{ t('settings.subtitle') }}
        </p>
      </div>

      <!-- Settings Tabs -->
      <a-tabs v-model:activeKey="activeTab" class="settings-tabs">
        <!-- General Clinic Info Tab -->
        <a-tab-pane key="general">
          <template #tab>
            <div class="flex items-center gap-2">
              <IconBuilding size="18" />
              <span>{{ t('settings.tabs.general') }}</span>
            </div>
          </template>
          <GeneralSettingsTab />
        </a-tab-pane>

        <!-- Operating Hours Tab -->
        <a-tab-pane key="operating">
          <template #tab>
            <div class="flex items-center gap-2">
              <IconClock size="18" />
              <span>{{ t('settings.tabs.operating') }}</span>
            </div>
          </template>
          <OperatingHoursTab />
        </a-tab-pane>

        <!-- Vaccination & Protocol Defaults Tab -->
        <a-tab-pane key="vaccination">
          <template #tab>
            <div class="flex items-center gap-2">
              <IconVaccine size="18" />
              <span>{{ t('settings.tabs.vaccination') }}</span>
            </div>
          </template>
          <VaccinationSettingsTab />
        </a-tab-pane>

        <!-- Notifications & Stock Alert Tab -->
        <a-tab-pane key="notifications">
          <template #tab>
            <div class="flex items-center gap-2">
              <IconBell size="18" />
              <span>{{ t('settings.tabs.notifications') }}</span>
            </div>
          </template>
          <NotificationSettingsTab />
        </a-tab-pane>

        <!-- System & Backup Tab -->
        <a-tab-pane key="system">
          <template #tab>
            <div class="flex items-center gap-2">
              <IconServer size="18" />
              <span>{{ t('settings.tabs.system') }}</span>
            </div>
          </template>
          <SystemBackupTab />
        </a-tab-pane>
      </a-tabs>
    </div>
  </PageLayout>
</template>
