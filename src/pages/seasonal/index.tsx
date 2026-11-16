import { useState } from 'react';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import BrowseList from '@/components/BrowseList';
import Seo from '@/components/Seo';
import { currentSeason, type Season } from '@/lib/queries/browse';

const SEASONS: Season[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const cap = (s: string) => s[0] + s.slice(1).toLowerCase();

export default function Seasonal() {
  const now = currentSeason();
  const [season, setSeason] = useState<Season>(now.season);
  const [year, setYear] = useState(now.year);
  const years = Array.from({ length: 12 }, (_, i) => now.year + 1 - i);
  const selectStyle = { borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' };

  return (
    <>
      <Seo
        title="Seasonal anime"
        path="/seasonal"
        description="See what is airing this season and browse past anime seasons, sorted by popularity."
      />
      <Navbar />
      <main className="py-8">
        <Container>
          <p className="eyebrow">Seasonal</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-3xl font-bold">{cap(season)} {year}</h1>
            <div className="flex gap-2">
              <select aria-label="Season" value={season} onChange={(e) => setSeason(e.target.value as Season)} className="rounded-[var(--radius)] border px-3 py-2 text-sm" style={selectStyle}>
                {SEASONS.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
              </select>
              <select aria-label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-[var(--radius)] border px-3 py-2 text-sm" style={selectStyle}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <BrowseList variables={{ season, seasonYear: year, sort: ['POPULARITY_DESC'] }} emptyText="No anime found for this season." />
        </Container>
      </main>
      <Footer />
    </>
  );
}
