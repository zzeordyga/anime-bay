import type { Collection, CollectionItem } from '@/types/anime';

const SENTINEL = '@';

function isUaObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'userAgent' in value;
}

export function createCollection(name: string): { success?: boolean; error?: string } {
  if (typeof window === 'undefined') return { error: 'client-only' };
  const key = name.trim();
  if (!validateName(key)) return { error: 'Invalid collection name.' };
  if (localStorage.getItem(key) !== null) return { error: 'Collection already exists.' };
  localStorage.setItem(key, JSON.stringify([]));
  return { success: true };
}

export function createCollectionWithItem(
  name: string,
  item: CollectionItem,
): { success?: boolean; error?: string } {
  if (typeof window === 'undefined') return { error: 'client-only' };
  const key = name.trim();
  if (!validateName(key)) return { error: 'Invalid collection name.' };
  if (localStorage.getItem(key) !== null) return { error: 'Collection already exists.' };
  localStorage.setItem(key, JSON.stringify([item]));
  writeReverseIndex(item.id, key);
  return { success: true };
}

export function getAllCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  const out: Collection[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);
    if (!name || name.includes(SENTINEL)) continue;
    const raw = localStorage.getItem(name);
    if (!raw) continue;
    try {
      const array = JSON.parse(raw);
      if (isUaObject(array)) continue;
      out.push({ name, array });
    } catch {
      // skip malformed
    }
  }
  return out;
}

export function isInCollection(name: string, item: CollectionItem): boolean {
  const col = getItem(name);
  return Array.isArray(col) && col.some((c) => c.id === item.id);
}

export function putItems(name: string, item: CollectionItem): { success?: boolean; error?: string } {
  if (typeof window === 'undefined') return { error: 'client-only' };
  const col = getItem(name);
  if (!Array.isArray(col)) return { error: 'Collection not found.' };
  if (col.some((c) => c.id === item.id)) return { error: 'Already in collection.' };
  col.push(item);
  localStorage.setItem(name, JSON.stringify(col));
  writeReverseIndex(item.id, name);
  return { success: true };
}

export function getItem(name: string): CollectionItem[] | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getCollectionsByItem(id: number): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`${id}${SENTINEL}`);
  if (!raw) return [];
  try {
    const names: string[] = JSON.parse(raw);
    return names.filter((n) => !n.includes(SENTINEL));
  } catch {
    return [];
  }
}

export function updateCollection(
  name: string,
  newName: string,
): { success?: boolean; error?: string } {
  if (typeof window === 'undefined') return { error: 'client-only' };
  const key = newName.trim();
  if (!validateName(key)) return { error: 'Invalid collection name.' };
  if (name === key) return { success: true };
  if (localStorage.getItem(key) !== null) return { error: 'Name already taken.' };
  const items = getItem(name);
  if (!items) return { error: 'Collection not found.' };
  localStorage.setItem(key, JSON.stringify(items));
  localStorage.removeItem(name);
  items.forEach((item) => {
    const idxNames = getCollectionsByItem(item.id);
    const updated = idxNames.map((n) => (n === name ? key : n));
    localStorage.setItem(`${item.id}${SENTINEL}`, JSON.stringify(updated));
  });
  return { success: true };
}

export function removeCollection(name: string): { success?: boolean; error?: string } {
  if (typeof window === 'undefined') return { error: 'client-only' };
  const items = getItem(name);
  if (!items) return { error: 'Collection not found.' };
  items.forEach((item) => removeItem(name, item));
  localStorage.removeItem(name);
  return { success: true };
}

export function removeItem(name: string, item: CollectionItem): { success?: boolean; error?: string } {
  if (typeof window === 'undefined') return { error: 'client-only' };
  const items = getItem(name);
  if (!items) return { error: 'Collection not found.' };
  const filtered = items.filter((c) => c.id !== item.id);
  localStorage.setItem(name, JSON.stringify(filtered));
  const idxNames = getCollectionsByItem(item.id).filter((n) => n !== name);
  if (idxNames.length) {
    localStorage.setItem(`${item.id}${SENTINEL}`, JSON.stringify(idxNames));
  } else {
    localStorage.removeItem(`${item.id}${SENTINEL}`);
  }
  return { success: true };
}

function validateName(name: string): boolean {
  if (!name) return false;
  return !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(name);
}

function writeReverseIndex(id: number, name: string): void {
  const key = `${id}${SENTINEL}`;
  const existing = getCollectionsByItem(id);
  if (!existing.includes(name)) existing.push(name);
  localStorage.setItem(key, JSON.stringify(existing));
}