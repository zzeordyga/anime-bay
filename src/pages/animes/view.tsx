import { useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/buttons';
import { useCollections } from '@/lib/useCollections';
import { GET_ANIME_BY_ID } from '@/lib/queries/getAnime';
import { truncate, convertDate } from '@/lib/utils';
import type { AnimeDetailResponse, CollectionItem } from '@/types/anime';

export default function AnimeDetail() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '0';
  const [less, setLess] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const { data, loading, error } = useQuery<AnimeDetailResponse>(GET_ANIME_BY_ID, {
    variables: { id: Number(id), page: 1, perPage: 5 },
    skip: !router.isReady,
  });

  const anime = data?.Media;

  const item: CollectionItem | null = anime
    ? {
        id: anime.id,
        title: anime.title.userPreferred ?? anime.title.romaji ?? 'Untitled',
        coverImage: anime.coverImage,
        averageScore: anime.averageScore,
        episodes: anime.episodes,
      }
    : null;

  const { collections, containing, addTo, createWith, removeFrom, refresh } = useCollections(item, [id]);

  if (!router.isReady || loading) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="py-16 text-center text-[color:var(--text-muted)]">Loading…</div>
        </Container>
      </>
    );
  }

  if (error || !anime) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="py-16 text-center">
            <p className="text-[color:var(--danger)]">Couldn't load this title.</p>
            <Link href="/" className="mt-3 inline-block text-[color:var(--brand)]">← Back</Link>
          </div>
        </Container>
      </>
    );
  }

  const description = anime.description ?? '';
  const shown = less && description.length > 400 ? truncate(description, 400, '…') : description;
  const aired =
    anime.startDate.year && anime.endDate.year
      ? anime.startDate.year === anime.endDate.year
        ? convertDate(anime.startDate.year, anime.startDate.month, anime.startDate.day)
        : `${convertDate(anime.startDate.year, anime.startDate.month, anime.startDate.day)} → ${convertDate(anime.endDate.year, anime.endDate.month, anime.endDate.day)}`
      : 'Unknown';

  return (
    <>
      <Head>
        <title>{anime.title.userPreferred ?? anime.title.romaji} — anime-bay</title>
      </Head>
      <Navbar />
      <main>
        {anime.bannerImage && (
          // biome-ignore lint/performance/noImgElement: static export
          <img
            src={anime.bannerImage}
            alt=""
            className="h-48 w-full object-cover sm:h-64"
            style={{ filter: 'brightness(0.6)' }}
          />
        )}
        <Container>
          <nav className="py-3 text-sm text-[color:var(--text-muted)]">
            <Link href="/" className="hover:text-[color:var(--brand)]">Browse</Link>
            <span className="px-1">/</span>
            <span className="text-[color:var(--text)]">{anime.title.userPreferred}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <aside>
              {/* biome-ignore lint/performance/noImgElement: static export */}
              <img
                src={anime.coverImage.extraLarge || anime.coverImage.large}
                alt={anime.title.userPreferred ?? ''}
                className="w-full rounded-[var(--radius-lg)] border object-cover"
                style={{ borderColor: 'var(--border)' }}
                loading="lazy"
                decoding="async"
              />
              <div className="mt-4 space-y-3 rounded-[var(--radius-lg)] border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                <Stat label="Episodes" value={anime.episodes ? `${anime.episodes}` : '—'} />
                <Stat label="Average" value={`${anime.averageScore ?? '—'} / 100`} />
                <Stat label="Status" value={anime.status ?? '—'} />
                <Stat label="Aired" value={aired} />
                <Stat
                  label="Studios"
                  value={anime.studios.nodes.map((s) => s.name).join(', ') || '—'}
                />
              </div>
              <Button variant="brand" className="mt-4 w-full" onClick={() => setAddOpen(true)}>
                + Add to collection
              </Button>
            </aside>

            <section>
              <h1 className="text-3xl font-bold sm:text-4xl">{anime.title.userPreferred ?? anime.title.romaji}</h1>
              {anime.title.native && anime.title.native !== anime.title.userPreferred && (
                <p className="mt-1 text-[color:var(--text-muted)]">{anime.title.native}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {anime.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h2 className="mt-6 text-lg font-bold">Description</h2>
              <div className="mt-2 [&_br]:block [&_a]:text-[color:var(--brand)] [&_b]:font-semibold" style={{ color: 'var(--text)' }}>
                {parse(shown)}
              </div>
              {description.length > 400 && (
                <button onClick={() => setLess(!less)} className="mt-1 text-sm text-[color:var(--brand)]">
                  {less ? 'Show more' : 'Show less'}
                </button>
              )}

              {containing.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold">In your collections</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {containing.map((c) => (
                      <Link
                        key={c}
                        href={`/collections/view?name=${encodeURIComponent(c)}`}
                        className="rounded-full px-3 py-1 text-sm hover:text-[color:var(--brand)]"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {anime.reviews && anime.reviews.nodes.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold">Reviews</h2>
                  <div className="mt-2 space-y-3">
                    {anime.reviews.nodes.slice(0, 3).map((r, i) => (
                      <article key={i} className="rounded-[var(--radius-lg)] border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{r.user.name}</span>
                          <span className="text-[color:var(--text-muted)]">·</span>
                          <span className="text-[color:var(--accent)]">{r.score}/100</span>
                        </div>
                        {r.summary && <p className="mt-1 text-sm text-[color:var(--text-muted)] line-clamp-3">{r.summary}</p>}
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </Container>
      </main>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add to collection">
        <div className="max-h-64 space-y-1 overflow-auto">
          {collections.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No collections yet — create one below.</p>
          ) : (
            collections.map((c) => (
              <label key={c.name} className="flex items-center gap-3 rounded-[var(--radius)] p-2 hover:bg-[color:var(--surface-2)]">
                <input
                  type="checkbox"
                  defaultChecked={c.array.some((x) => x.id === item?.id)}
                  onChange={(e) => {
                    if (item) {
                      if (e.target.checked) addTo(c.name);
                      else removeFrom(c.name, item);
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
        <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <NewCollectionInput onCreate={(name) => { if (item) createWith(name); refresh(); setAddOpen(false); }} />
        </div>
      </Modal>

      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[color:var(--text-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function NewCollectionInput({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New collection"
        className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
      />
      <Button type="submit" variant="brand" disabled={!name.trim()} onClick={() => name.trim() && onCreate(name.trim())}>
        Create
      </Button>
    </>
  );
}