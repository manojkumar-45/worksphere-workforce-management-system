export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}

export function formatMinutes(minutes) {
  if (!minutes && minutes !== 0) return '-';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}
