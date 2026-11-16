'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Container } from './primitives';

const Links = [
  { href: '/', label: 'Browse' },
  { href: '/seasonal', label: 'Seasonal' },
  { href: '/genres', label: 'Genres' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'color-mix(in srgb, var(--surface-2) 80%, transparent)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <div className="flex h-16 items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white font-black"
              style={{ background: 'var(--brand)' }}
            >
              a
            </span>
            <span>anime-bay</span>
          </Link>

          <nav className="ml-auto flex items-center gap-0.5 overflow-x-auto text-sm">
            {Links.map((l) => (
              <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-[color:var(--text-muted)] transition hover:text-[color:var(--text)] hover:bg-[color:var(--surface)]">
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={toggle}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </Container>
    </header>
  );
}

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FooterWrap = styled.footer`
  border-top: 1px solid var(--border);
  background: var(--surface);
  margin-top: 3rem;
  padding: 1.5rem 0;
  color: var(--text-muted);
  font-size: 0.85rem;
`;

export function Footer() {
  return (
    <FooterWrap>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} anime-bay · data from AniList</p>
          <nav className="flex gap-4" aria-label="Footer">
            {Links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[color:var(--text)]">{l.label}</Link>
            ))}
          </nav>
        </div>
      </Container>
    </FooterWrap>
  );
}