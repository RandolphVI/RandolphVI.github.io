export function getSeason(date: Date): string {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

export function getVolumeLabel(volume: number, date: Date): string {
  const padded = String(volume).padStart(2, '0');
  const year = date.getFullYear();
  const season = getSeason(date);
  return `VOL. ${padded} · ${year} ${season}`;
}
