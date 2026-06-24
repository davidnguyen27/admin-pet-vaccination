import dayjs from 'dayjs';

export function formatDate(date?: string, format = 'DD MM YYYY') {
  if (!date) return '-';
  return dayjs(date).format(format);
}

export function formatDateTime(value?: string, format = 'DD-MM-YYYY HH:mm') {
  if (!value) return '-';
  return dayjs(value).format(format);
}
