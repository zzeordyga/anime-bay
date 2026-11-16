import { useQuery } from '@apollo/client';
import Link from 'next/link';
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
import Seo from '@/components/Seo';
import Chip from '@/components/Chip';
import { BROWSE, GENRES, SORTS } from '@/lib/queries/browse';
import type { AnimeListResponse, CollectionItem } from '@/types/anime';

const PER_PAGE = 12;

export default function Home() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query);
  const [sort, setSort] = useState<string>(SORTS[0].value);
  const [genre, setGenre] = useState<string | null>(null);
  const [bulk, setBulk] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [newCollName, setNewCollName] = useState('');

  const emptyItem: CollectionItem | null = null;
  const { collections, refresh, addTo, createWith } = useCollections(emptyItem, []);
  const items = collections;

  const { data, loading, error } = useQuery<AnimeListResponse>(BROWSE, {
    variables: {
      page,
      perPage: PER_PAGE,
      search: debounced.trim() || undefined,
      genre: genre ?? undefined,
      sort: debounced.trim() ? ['SEARCH_MATCH'] : [sort],
    },
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
      <Seo
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'anime-bay',
          url: 'https://zzeordyga.github.io/anime-bay/',
          description: 'Browse AniList anime and curate your own collections.',
        }}
      />
      <Navbar />
      <section
        className="border-b py-10 sm:py-14"
        style={{
          borderColor: 'var(--border)',
          background: 'radial-gradient(60rem 24rem at 10% -10%, color-mix(in srgb, var(--brand) 22%, transparent), transparent), radial-gradient(40rem 20rem at 90% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent)',
        }}
      >
        <Container>
          <p className="eyebrow">AniList · free · no account needed</p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Find your next anime, build your own shelves.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg">
            Search thousands of titles, explore by <Link className="text-[color:var(--brand)] hover:underline" href="/seasonal">season</Link> or{' '}
            <Link className="text-[color:var(--brand)] hover:underline" href="/genres">genre</Link>, and save favourites to collections.
          </p>
        </Container>
      </section>
      <main className="py-8">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{debounced.trim() ? `Results for “${debounced.trim()}”` : 'Browse anime'}</h2>
            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
              <select
                aria-label="Sort by"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                disabled={!!debounced.trim()}
                className="rounded-[var(--radius)] border px-3 py-2 text-sm disabled:opacity-50"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
              >
                {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input
                aria-label="Search anime"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title…"
                className="min-w-0 flex-1 rounded-[var(--radius)] border px-3 py-2 text-sm focus:outline-none focus:ring-2 lg:w-64 lg:flex-none"
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

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" aria-label="Filter by genre">
            {[null, ...GENRES].map((g) => (
              <Chip key={g ?? 'all'} active={genre === g} onClick={() => { setGenre(g); setPage(1); }}>{g ?? 'All'}</Chip>
            ))}
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
            <div className="mt-8 grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:grid-cols-4">
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