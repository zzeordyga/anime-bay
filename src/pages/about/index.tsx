import Link from 'next/link';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import Seo from '@/components/Seo';

export default function About() {
  return (
    <>
      <Seo
        title="About"
        path="/about"
        description="anime-bay is a fast, open-source AniList browser with local collections. Built with Next.js 16 and React 19."
      />
      <Navbar />
      <main className="py-10">
        <Container maxWidth={46}>
          <p className="eyebrow">About</p>
          <h1 className="text-3xl font-bold">A small, fast AniList browser</h1>
          <div className="mt-6 space-y-4 leading-7 text-[color:var(--text-muted)]">
            <p>
              anime-bay lets you search the AniList catalogue, explore by <Link className="text-[color:var(--brand)] hover:underline" href="/seasonal">season</Link> or{' '}
              <Link className="text-[color:var(--brand)] hover:underline" href="/genres">genre</Link>, and group favourites into{' '}
              <Link className="text-[color:var(--brand)] hover:underline" href="/collections">collections</Link>.
            </p>
            <p>
              Collections are stored only in your browser (localStorage) — there are no accounts and nothing is sent to a server.
              Anime data comes from the public <a className="text-[color:var(--brand)] hover:underline" href="https://anilist.co" rel="noopener noreferrer" target="_blank">AniList</a> GraphQL API.
            </p>
            <p>
              Built with Next.js 16, React 19, TypeScript and Apollo Client. Source on{' '}
              <a className="text-[color:var(--brand)] hover:underline" href="https://github.com/zzeordyga/anime-bay" rel="noopener noreferrer" target="_blank">GitHub</a>.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
