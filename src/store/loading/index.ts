import { defineStore } from 'pinia';

export const loadingStore = defineStore('loading', {
  state: () => ({
    globalLoading: false,
  }),

  actions: {
    start() {
      this.globalLoading = true;
    },
    stop() {
      this.globalLoading = false;
    },
  },
});
