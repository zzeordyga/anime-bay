export const STATUS: Record<string, { label: string; color: string }> = {
  RELEASING: { label: 'Ongoing', color: 'var(--success)' },
  FINISHED: { label: 'Completed', color: 'var(--accent)' },
  NOT_YET_RELEASED: { label: 'Upcoming', color: 'oklch(0.75 0.15 80)' },
  CANCELLED: { label: 'Cancelled', color: 'var(--danger)' },
  HIATUS: { label: 'Hiatus', color: 'oklch(0.75 0.15 60)' },
};

export const scoreColor = (s: number) =>
  s >= 80 ? 'var(--success)' : s >= 70 ? 'var(--accent)' : s >= 55 ? 'oklch(0.75 0.15 80)' : 'var(--danger)';

export const stripHtml = (s?: string | null) =>
  (s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// AniList scores are 0-100; show them on a 10-point scale, e.g. 85 -> "8.5".
export const formatScore = (s?: number | null) => (s ? (s / 10).toFixed(1) : '–');
