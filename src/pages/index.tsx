import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import { useState } from 'react';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import AnimeCard from '@/components/AnimeCard';
import { Pagination } from '@/components/Pagination';
import { SkeletonCard } from '@/components/Pagination';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/buttons';
import { useCollections } from '@/lib/useCollections';
import { useDebouncedValue } from '@/lib/useDebounce';
import type { AnimeListResponse, CollectionItem } from '@/types/anime';

const GET_ANIME = gql`
  query GetAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(type: ANIME, sort: POPULARITY_DESC) {
        id episodes averageScore
        coverImage { large medium }
        title { romaji }
      }
    }
  }
`;

const SEARCH = gql`
  query SearchAnime($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
        id episodes averageScore
        coverImage { large medium }
        title { romaji }
      }
    }
  }
`;

const PER_PAGE = 12;

export default function Home() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query);
  const [bulk, setBulk] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [newCollName, setNewCollName] = useState('');

  const emptyItem: CollectionItem | null = null;
  const { collections, refresh, addTo, createWith } = useCollections(emptyItem, []);
  const items = collections;

  const active = debounced.trim() ? SEARCH : GET_ANIME;
  const { data, loading, error } = useQuery<AnimeListResponse>(active, {
    variables: { page, perPage: PER_PAGE, search: debounced || undefined },
    fetchPolicy: 'cache-and-network',
  });

  const media = data?.Page.media ?? [];
  const info = data?.Page.pageInfo;

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const selectedAnimes = (): CollectionItem[] =>
    media
      .filter((m) => selected.includes(m.id))
      .map((m) => ({
        id: m.id,
        title: m.title.romaji ?? 'Untitled',
        coverImage: { extraLarge: m.coverImage.large, large: m.coverImage.large, medium: m.coverImage.medium },
        averageScore: m.averageScore,
        episodes: m.episodes,
      }));

  return (
    <>
      <Head>
        <title>anime-bay — browse</title>
      </Head>
      <Navbar />
      <main className="py-8">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Browse anime</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                Discover series from the AniList catalogue.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title…"
                className="w-full rounded-[var(--radius)] border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                }}
              />
              {bulk ? (
                <>
                  <Button variant="ghost" onClick={() => { setBulk(false); setSelected([]); }}>Cancel</Button>
                  <Button variant="brand" disabled={selected.length === 0} onClick={() => setAssignOpen(true)}>
                    Finalize ({selected.length})
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => setBulk(true)}>
                  + Bulk add
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-8 surface p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-[color:var(--danger)]">Failed to load — AniList may be rate-limiting. Try again.</p>
              <Button variant="ghost" className="mt-3" onClick={() => location.reload()}>Retry</Button>
            </div>
          )}

          {loading ? (
            <div className="mt-8 grid gap-5 [--cols:5] grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : media.length === 0 ? (
            <p className="mt-12 text-center text-[color:var(--text-muted)]">No results for “{debounced}”.</p>
          ) : (
            <div className="mt-8 grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-5">
              {media.map((a) => (
                <AnimeCard
                  key={a.id}
                  anime={a}
                  bulk={bulk}
                  selected={selected.includes(a.id)}
                  onToggleSelect={toggle}
                />
              ))}
            </div>
          )}

          {info && (
            <Pagination
              currentPage={info.currentPage}
              lastPage={info.lastPage}
              total={info.total}
              perPage={info.perPage}
              onChange={setPage}
            />
          )}
        </Container>
      </main>

      <Modal open={assignOpen} onClose={() => setAssignOpen(false)} title="Add selection to collections">
        <div className="max-h-72 space-y-1 overflow-auto pb-3">
          {items.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No collections yet — create one below.</p>
          ) : (
            items.map((c) => (
              <label key={c.name} className="flex items-center gap-3 rounded-[var(--radius)] p-2 hover:bg-[color:var(--surface-2)]">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      selectedAnimes().forEach(() => addTo(c.name));
                    }
                  }}
                  className="h-4 w-4"
                />
                <span className="font-medium">{c.name}</span>
                <span className="ml-auto text-xs text-[color:var(--text-muted)]">{c.array.length}</span>
              </label>
            ))
          )}
        </div>
        <div className="mt-4 flex gap-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <input
            value={newCollName}
            onChange={(e) => setNewCollName(e.target.value)}
            placeholder="New collection name"
            className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
          />
          <Button
            variant="brand"
            onClick={() => {
              if (!newCollName.trim()) return;
              selectedAnimes().forEach(() => createWith(newCollName.trim()));
              setNewCollName('');
              setAssignOpen(false);
              refresh();
              setSelected([]);
              setBulk(false);
            }}
          >
            Create
          </Button>
        </div>
      </Modal>

      <Footer />
    </>
  );
}