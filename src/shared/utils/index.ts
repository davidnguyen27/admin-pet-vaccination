import dayjs from 'dayjs';

export function formatDate(date?: string, format = 'DD MM YYYY') {
  if (!date) return '-';
  return dayjs(date).format(format);
}

export function formatDateTime(value?: string, format = 'DD-MM-YYYY HH:mm') {
  if (!value) return '-';
  return dayjs(value).format(format);
}

export function calculateAge(dob: string) {
  if (!dob) return '';
  const years = dayjs().diff(dayjs(dob), 'year');
  const months = dayjs().diff(dayjs(dob), 'month') % 12;
  if (years > 0) {
    return `${years} yr ${months > 0 ? months + ' mo' : ''}`;
  }
  return `${months} mo`;
}
