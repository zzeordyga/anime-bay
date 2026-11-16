'use client';

import styled from '@emotion/styled';

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="aspect-[3/4] animate-pulse" style={{ background: 'var(--surface-2)' }} />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
        <div className="h-3 w-1/3 animate-pulse rounded" style={{ background: 'var(--surface-2)' }} />
      </div>
    </div>
  );
}

export const Pagination = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onChange,
}: {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}) => {
  if (lastPage <= 1) return null;
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);
  const window = 1;

  const pages: (number | 'ellipsis')[] = [currentPage];
  for (let offset = 1; offset <= window; offset++) {
    if (currentPage - offset >= 1) pages.unshift(currentPage - offset);
    if (currentPage + offset <= lastPage) pages.push(currentPage + offset);
  }
  if (pages[0] !== 1) pages.unshift(1);
  if (pages[pages.length - 1] !== lastPage) pages.push(lastPage);
  const peek = (i: number): number => (typeof pages[i] === 'number' ? (pages[i] as number) : NaN);
  if (peek(0) && peek(1) && peek(1) - peek(0) > 1) pages.splice(1, 0, 'ellipsis');
  const li = pages.length - 1;
  if (peek(li - 1) && peek(li) && peek(li) - peek(li - 1) > 1) {
    pages.splice(li, 0, 'ellipsis');
  }

  return (
    <Paginator>
      <span className="muted">
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Page onClick={() => onChange(currentPage - 1)} disabled={currentPage <= 1}>
          ‹
        </Page>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <Ellipsis key={`e${i}`}>…</Ellipsis>
          ) : (
            <Page key={p} active={p === currentPage} onClick={() => onChange(p as number)}>
              {p}
            </Page>
          ),
        )}
        <Page onClick={() => onChange(currentPage + 1)} disabled={currentPage >= lastPage}>
          ›
        </Page>
      </div>
    </Paginator>
  );
};

const Page = styled.button<{ active?: boolean }>`
  display: inline-flex;
  height: 2rem;
  min-width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 0.85rem;
  ${({ active }) => active && `background: var(--brand); border-color: var(--brand); color: #fff;`}
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Ellipsis = styled.span`
  padding: 0 0.4rem;
  color: var(--text-muted);
`;

const Paginator = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0;

  .muted { color: var(--text-muted); font-size: 0.85rem; }
`;