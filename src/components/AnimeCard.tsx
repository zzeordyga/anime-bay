'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import type { AnimeListItem } from '@/types/anime';

interface Props {
  anime: AnimeListItem;
  selected?: boolean;
  bulk?: boolean;
  onToggleSelect?: (id: number) => void;
}

export default function AnimeCard({ anime, selected, bulk, onToggleSelect }: Props) {
  const score = anime.averageScore ?? 0;
  const eps = anime.episodes ?? 0;

  return (
    <Card>
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-[var(--radius-lg)] bg-[color:var(--surface-2)]">
        <Link href={`/animes/view?id=${anime.id}`}>
          {/** biome-ignore lint/performance/noImgElement: static export */}
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji ?? 'anime'}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        </Link>
        {bulk && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSelect?.(anime.id);
            }}
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full"
            style={{
              background: selected ? 'var(--brand)' : 'color-mix(in srgb, var(--bg) 70%, transparent)',
              border: '1px solid var(--border)',
              color: selected ? '#fff' : 'var(--text)',
            }}
            aria-label="toggle select"
          >
            {selected ? '✓' : '+'}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <Link href={`/animes/view?id=${anime.id}`} className="line-clamp-1 font-medium hover:text-[color:var(--brand)]">
          {anime.title.romaji ?? 'Untitled'}
        </Link>
        <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
          <ScoreBadge score={score} />
          <span>{eps} ep</span>
        </div>
      </div>
    </Card>
  );
}

const Card = styled.article`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--text) 12%, transparent);
  }
`;

function ScoreBadge({ score }: { score: number }) {
  const hue = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent)' : 'var(--danger)';
  return (
    <span
      className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
      style={{ background: hue }}
    >
      {score || '–'}
    </span>
  );
}