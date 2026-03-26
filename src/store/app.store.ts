import { defineStore } from 'pinia';

export const appStore = defineStore('app', {
  state: () => ({
    loadingCount: 0,
  }),

  getters: {
    isLoading: state => state.loadingCount > 0,
  },

  actions: {
    startLoading() {
      this.loadingCount++;
    },
    stopLoading() {
      this.loadingCount = Math.max(0, this.loadingCount - 1);
    },
  },
});
