'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Collection, CollectionItem } from '@/types/anime';
import {
  createCollection,
  createCollectionWithItem,
  getAllCollections,
  getCollectionsByItem,
  putItems,
  removeCollection,
  removeItem,
  updateCollection,
} from './storage';

export function useCollections(item: CollectionItem | null = null, deps: unknown[] = []) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [containing, setContaining] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setCollections(getAllCollections());
    if (item) setContaining(getCollectionsByItem(item.id));
  }, [item]);

  useEffect(() => {
    refresh();
  }, [refresh, ...deps]);

  const addTo = useCallback(
    (name: string) => {
      return item ? putItems(name, item) : { error: 'no item' };
    },
    [item],
  );

  const createWith = useCallback(
    (name: string) => (item ? createCollectionWithItem(name, item) : createCollection(name)),
    [item],
  );

  const rename = useCallback(updateCollection, []);
  const drop = useCallback(removeCollection, []);
  const removeFrom = useCallback((name: string, it: CollectionItem) => removeItem(name, it), []);

  return { collections, containing, refresh, addTo, createWith, rename, drop, removeFrom };
}