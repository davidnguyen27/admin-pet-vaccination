<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import UserDetail from './UserDetail.vue';
import UserManagement from './UserManagement.vue';

const route = useRoute();

const shouldShowDetail = computed(() => {
  const queryId = route.query.userId;
  if (Array.isArray(queryId)) {
    return Boolean(queryId[0]);
  }

  return typeof queryId === 'string' && Boolean(queryId);
});
</script>

<template>
  <user-detail v-if="shouldShowDetail" />
  <user-management v-else />
</template>
