import { useEffect, useState } from 'react';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import BrowseList from '@/components/BrowseList';
import Seo from '@/components/Seo';
import Chip from '@/components/Chip';
import { GENRES } from '@/lib/queries/browse';

export default function Genres() {
  const [genre, setGenre] = useState<string>(GENRES[0]);
  useEffect(() => {
    const g = new URLSearchParams(location.search).get('g');
    if (g && GENRES.includes(g)) setGenre(g);
  }, []);

  return (
    <>
      <Seo
        title={`${genre} anime`}
        path="/genres"
        description={`Browse the most popular ${genre} anime, plus every other genre on AniList.`}
      />
      <Navbar />
      <main className="py-8">
        <Container>
          <p className="eyebrow">Genres</p>
          <h1 className="text-3xl font-bold">{genre} anime</h1>
          <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Genres">
            {GENRES.map((g) => (
              <Chip key={g} role="tab" active={g === genre} onClick={() => setGenre(g)}>{g}</Chip>
            ))}
          </div>
          <BrowseList variables={{ genre, sort: ['POPULARITY_DESC'] }} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
