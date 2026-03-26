import dayjs from 'dayjs';

export function formatDateTime(value?: string | null, format = 'DD-MM-YYYY HH:mm'): string {
  if (!value) {
    return 'N/A';
  }
  const date = dayjs(value);
  return date.isValid() ? date.format(format) : 'N/A';
}
