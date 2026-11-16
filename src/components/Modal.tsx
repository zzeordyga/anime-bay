'use client';

import { useEffect, type ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'color-mix(in srgb, #000 75%, transparent)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] p-5 shadow-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-3 flex items-center justify-between text-lg font-bold">
            {title}
            <button onClick={onClose} className="text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
              ✕
            </button>
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}