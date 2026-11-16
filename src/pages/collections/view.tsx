import Seo from '@/components/Seo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/buttons';
import { getItem, removeCollection, removeItem, updateCollection } from '@/lib/storage';
import type { CollectionItem } from '@/types/anime';

export default function CollectionView() {
  const router = useRouter();
  const name = typeof router.query.name === 'string' ? router.query.name : '';

  const [items, setItems] = useState<CollectionItem[]>([]);
  const [delOpen, setDelOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [removing, setRemoving] = useState<CollectionItem | null>(null);

  const refresh = () => { if (name) setItems(getItem(name) ?? []); };
  useEffect(() => { refresh(); }, [name]);

  const viewLink = (n: string) => `/collections/view?name=${encodeURIComponent(n)}`;

  return (
    <>
      <Seo title={name || 'Collection'} path="/collections/view" noindex />
      <Navbar />
      <main className="py-8">
        <Container>
          <nav className="text-sm text-[color:var(--text-muted)]">
            <Link href="/collections" className="hover:text-[color:var(--brand)]">Collections</Link>
            <span className="px-1">/</span>
            <span className="text-[color:var(--text)]">{name}</span>
          </nav>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">{name || 'Collection'}</h1>
            {name && (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setRenameOpen(true)}>Rename</Button>
                <Button variant="danger" onClick={() => setDelOpen(true)}>Delete</Button>
              </div>
            )}
          </div>

          {!name ? (
            <p className="mt-12 text-center text-[color:var(--text-muted)]">No collection specified.</p>
          ) : items.length === 0 ? (
            <p className="mt-12 text-center text-[color:var(--text-muted)]">Nothing here yet — add anime from the browse page.</p>
          ) : (
            <div className="mt-8 grid gap-5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-5">
              {items.map((a) => (
                <article key={a.id} className="overflow-hidden rounded-[var(--radius-lg)] border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                  <Link href={`/animes/view?id=${a.id}`} className="block aspect-[3/4] overflow-hidden bg-[color:var(--surface-2)]">
                    {/* biome-ignore lint/performance/noImgElement: static export */}
                    <img src={a.coverImage.large} alt={a.title} className="h-full w-full object-cover transition hover:scale-105" loading="lazy" />
                  </Link>
                  <div className="p-3">
                    <Link href={`/animes/view?id=${a.id}`} className="line-clamp-1 font-medium hover:text-[color:var(--brand)]">{a.title || 'Untitled'}</Link>
                    <div className="mt-1 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
                      <span>{a.averageScore ?? '–'}/100</span>
                      <span>{a.episodes ?? '–'} ep</span>
                    </div>
                    <button
                      onClick={() => setRemoving(a)}
                      className="mt-2 w-full rounded-[var(--radius)] border py-1 text-xs text-[color:var(--danger)] hover:bg-[color:var(--danger)] hover:text-white"
                      style={{ borderColor: 'var(--danger)' }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="Delete collection?">
        <p className="text-sm text-[color:var(--text-muted)]">“{name}” will be permanently removed.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { removeCollection(name); router.push('/collections'); }}>Delete</Button>
        </div>
      </Modal>

      <Modal open={renameOpen} onClose={() => setRenameOpen(false)} title="Rename collection">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem('n') as HTMLInputElement).value.trim();
            if (input && input !== name) {
              const r = updateCollection(name, input);
              if (r.success) {
                setRenameOpen(false);
                router.push(viewLink(input));
              }
            }
          }}
          className="flex gap-2"
        >
          <input
            name="n"
            defaultValue={name}
            autoFocus
            className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
          />
          <Button type="submit" variant="brand">Save</Button>
        </form>
      </Modal>

      <Modal open={!!removing} onClose={() => setRemoving(null)} title="Remove from collection?">
        <p className="text-sm text-[color:var(--text-muted)]">“{removing?.title}” will be removed from {name}.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setRemoving(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { if (removing) { removeItem(name, removing); setRemoving(null); refresh(); } }}>Remove</Button>
        </div>
      </Modal>

      <Footer />
    </>
  );
}