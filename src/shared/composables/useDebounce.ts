import { ref, watch, onUnmounted } from 'vue';

export function useDebounce<T>(fetcher: (keyword: string) => Promise<T>, delay = 500) {
  const keyword = ref('');
  const loading = ref(false);
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);

  let timeout: ReturnType<typeof setTimeout>;
  // Used to track the latest request to prevent race conditions
  let currentRequestId = 0;

  const clearTimer = () => {
    if (timeout) clearTimeout(timeout);
  };

  watch(keyword, value => {
    clearTimer();

    timeout = setTimeout(async () => {
      currentRequestId += 1;
      const fetchId = currentRequestId;

      try {
        loading.value = true;
        error.value = null;
        const result = await fetcher(value.trim());

        if (fetchId === currentRequestId) {
          data.value = result;
        }
      } catch (err) {
        if (fetchId === currentRequestId) {
          error.value = err instanceof Error ? err : new Error(String(err));
        }
      } finally {
        if (fetchId === currentRequestId) {
          loading.value = false;
        }
      }
    }, delay);
  });

  onUnmounted(() => {
    clearTimer();
  });

  return {
    keyword,
    data,
    loading,
    error,
  };
}
