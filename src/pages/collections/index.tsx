import Seo from '@/components/Seo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/buttons';
import { getAllCollections, removeCollection, updateCollection } from '@/lib/storage';
import type { Collection } from '@/types/anime';

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Collection | null>(null);
  const [del, setDel] = useState<Collection | null>(null);
  const [msg, setMsg] = useState('');

  const refresh = () => setCollections(getAllCollections());
  useEffect(() => { refresh(); }, []);

  const toast = (s: string) => { setMsg(s); setTimeout(() => setMsg(''), 2200); };

  return (
    <>
      <Seo title="Collections" path="/collections" description="Your personal anime collections, stored locally in your browser." />
      <Navbar />
      <main className="py-8">
        <Container>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Collections</h1>
            <Button variant="brand" onClick={() => setCreateOpen(true)}>+ New</Button>
          </div>

          {collections.length === 0 ? (
            <p className="mt-12 text-center text-[color:var(--text-muted)]">
              Nothing here yet — create your first collection.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-4">
              {collections.map((c) => (
                <article key={c.name} className="overflow-hidden rounded-[var(--radius-lg)] border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                  <Link href={`/collections/view?name=${encodeURIComponent(c.name)}`} className="aspect-[3/4] block overflow-hidden bg-[color:var(--surface-2)]">
                    {c.array[0] ? (
                      // biome-ignore lint/performance/noImgElement: static export
                      <img src={c.array[0].coverImage.large} alt="" className="h-full w-full object-cover transition hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[color:var(--text-muted)]">Empty</div>
                    )}
                  </Link>
                  <div className="p-3">
                    <Link href={`/collections/view?name=${encodeURIComponent(c.name)}`} className="line-clamp-1 font-medium hover:text-[color:var(--brand)]">{c.name}</Link>
                    <p className="text-xs text-[color:var(--text-muted)]">{c.array.length} anime</p>
                    <div className="mt-2 flex gap-2 text-xs">
                      <button className="text-[color:var(--brand)] hover:underline" onClick={() => setEdit(c)}>Rename</button>
                      <span className="text-[color:var(--text-muted)]">·</span>
                      <button className="text-[color:var(--danger)] hover:underline" onClick={() => setDel(c)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create collection">
        <NameInput
          initial=""
          submitLabel="Create"
          onSubmit={(n) => {
            import('@/lib/storage').then((m) => {
              const r = m.createCollection(n);
              if (r.success) { setCreateOpen(false); refresh(); toast('Created'); }
              else toast(r.error ?? 'Failed');
            });
          }}
        />
      </Modal>

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Rename collection">
        <NameInput
          initial={edit?.name ?? ''}
          submitLabel="Save"
          onSubmit={(n) => {
            if (edit) {
              const r = updateCollection(edit.name, n);
              if (r.success) { setEdit(null); refresh(); toast('Renamed'); }
              else toast(r.error ?? 'Failed');
            }
          }}
        />
      </Modal>

      <Modal open={!!del} onClose={() => setDel(null)} title="Delete collection?">
        <p className="text-sm text-[color:var(--text-muted)]">
          “{del?.name}” and its {del?.array.length ?? 0} entries will be removed.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDel(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { if (del) { removeCollection(del.name); setDel(null); refresh(); toast('Deleted'); } }}>Delete</Button>
        </div>
      </Modal>

      {msg && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm text-white" style={{ background: 'var(--text)' }}>
          {msg}
        </div>
      )}

      <Footer />
    </>
  );
}

function NameInput({ initial, submitLabel, onSubmit }: { initial: string; submitLabel: string; onSubmit: (n: string) => void }) {
  const [name, setName] = useState(initial);
  useEffect(() => setName(initial), [initial]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); }} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        placeholder="Collection name"
        className="flex-1 rounded-[var(--radius)] border px-3 py-2 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
      />
      <Button type="submit" variant="brand">{submitLabel}</Button>
    </form>
  );
}