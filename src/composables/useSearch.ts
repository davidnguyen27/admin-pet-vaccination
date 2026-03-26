import { ref, watch } from 'vue';

export function useSearch<T>(fetcher: (keyword: string) => Promise<T>, delay = 500) {
  const keyword = ref('');
  const loading = ref(false);
  const data = ref<T | null>(null);

  let timeout: ReturnType<typeof setTimeout>;

  watch(keyword, value => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      if (!value) {
        data.value = null;
        return;
      }

      try {
        loading.value = true;
        data.value = await fetcher(value);
      } finally {
        loading.value = false;
      }
    }, delay);
  });

  return {
    keyword,
    data,
    loading,
  };
}
