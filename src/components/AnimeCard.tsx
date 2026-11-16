'use client';

import Link from 'next/link';
import Chip from './Chip';
import { STATUS, formatScore, scoreColor, stripHtml } from '@/lib/status';
import type { AnimeListItem } from '@/types/anime';

interface Props {
  anime: AnimeListItem;
  selected?: boolean;
  bulk?: boolean;
  onToggleSelect?: (id: number) => void;
}

const formatLabel = (f?: string | null) =>
  !f ? null : f.length <= 3 ? f : f.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase());

function ScoreRing({ score }: { score: number }) {
  const c = 2 * Math.PI * 16;
  return (
    <div className="relative h-11 w-11 shrink-0" title={score ? `${formatScore(score)} out of 10` : 'Not rated'}>
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border)" strokeWidth="4" />
        {score > 0 && (
          <circle cx="20" cy="20" r="16" fill="none" stroke={scoreColor(score)} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold tabular-nums">{formatScore(score)}</span>
    </div>
  );
}

export default function AnimeCard({ anime, selected, bulk, onToggleSelect }: Props) {
  const score = anime.averageScore ?? 0;
  const title = anime.title.romaji ?? anime.title.english ?? 'Untitled';
  const href = `/animes/view?id=${anime.id}`;
  const status = anime.status ? STATUS[anime.status] : null;
  const desc = stripHtml(anime.description);
  const tags = (anime.tags ?? []).filter((t) => !t.isMediaSpoiler).slice(0, 3);
  const meta = [formatLabel(anime.format), anime.episodes ? `${anime.episodes} eps` : null, anime.seasonYear]
    .filter(Boolean)
    .join(' · ');

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
      style={{ background: 'var(--surface)', borderColor: selected ? 'var(--brand)' : 'var(--border)' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--surface-2)]">
        <Link href={href}>
          {/** biome-ignore lint/performance/noImgElement: static export */}
          <img src={anime.coverImage.large} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        </Link>
        {status && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
            {status.label}
          </span>
        )}
        {bulk && (
          <button
            onClick={() => onToggleSelect?.(anime.id)}
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: selected ? 'var(--brand)' : 'color-mix(in srgb, var(--bg) 70%, transparent)', border: '1px solid var(--border)', color: selected ? '#fff' : 'var(--text)' }}
            aria-label="toggle select"
          >
            {selected ? '✓' : '+'}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <Link href={href} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-[color:var(--brand)]">{title}</Link>
            {anime.title.native && <p className="mt-0.5 truncate text-xs text-[color:var(--text-muted)]" lang="ja">{anime.title.native}</p>}
          </div>
          <ScoreRing score={score} />
        </div>

        {meta && <p className="text-xs font-medium text-[color:var(--text-muted)]">{meta}</p>}

        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {anime.genres.slice(0, 3).map((g) => (
              <Chip key={g} size="xs" active>{g}</Chip>
            ))}
          </div>
        )}

        {desc && <p className="line-clamp-3 text-xs leading-relaxed text-[color:var(--text-muted)]">{desc}</p>}

        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {tags.map((t) => (
              <Chip key={t.name} size="xs">{t.name}</Chip>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
