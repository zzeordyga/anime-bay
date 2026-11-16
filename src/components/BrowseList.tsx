import { useQuery } from '@apollo/client';
import { useState } from 'react';
import AnimeCard from './AnimeCard';
import { Pagination, SkeletonCard } from './Pagination';
import { Button } from './buttons';
import { BROWSE } from '@/lib/queries/browse';
import type { AnimeListResponse } from '@/types/anime';

interface Props {
  variables: Record<string, unknown>;
  perPage?: number;
  emptyText?: string;
}

export default function BrowseList({ variables, perPage = 15, emptyText = 'Nothing found.' }: Props) {
  const [page, setPage] = useState(1);
  const key = JSON.stringify(variables);
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setPage(1);
  }

  const { data, loading, error, refetch } = useQuery<AnimeListResponse>(BROWSE, {
    variables: { ...variables, page, perPage },
    fetchPolicy: 'cache-and-network',
  });

  const media = data?.Page.media ?? [];
  const info = data?.Page.pageInfo;

  if (error) {
    return (
      <div className="mt-8 p-6 text-center rounded-[var(--radius-lg)]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-[color:var(--danger)]">Failed to load — AniList may be rate-limiting.</p>
        <Button variant="ghost" className="mt-3" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-5">
        {loading && media.length === 0
          ? Array.from({ length: perPage }).map((_, i) => <SkeletonCard key={i} />)
          : media.map((a) => <AnimeCard key={a.id} anime={a} />)}
      </div>
      {!loading && media.length === 0 && (
        <p className="mt-12 text-center text-[color:var(--text-muted)]">{emptyText}</p>
      )}
      {info && (
        <Pagination currentPage={info.currentPage} lastPage={info.lastPage} total={info.total} perPage={info.perPage} onChange={setPage} />
      )}
    </>
  );
}
