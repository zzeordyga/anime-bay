import type { Theme } from '@emotion/react';

// Emotion theme, mirroring the revival design tokens (CSS custom properties).
// Components read either this object or the CSS vars directly.
export const theme: Theme = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surface2: 'var(--surface-2)',
  border: 'var(--border)',
  text: 'var(--text)',
  muted: 'var(--text-muted)',
  brand: 'var(--brand)',
  brandStrong: 'var(--brand-strong)',
  accent: 'var(--accent)',
  danger: 'var(--danger)',
  success: 'var(--success)',
  ring: 'var(--ring)',
} as unknown as Theme;

export type AppTheme = typeof theme;