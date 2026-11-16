import Link from 'next/link';
import Navbar, { Footer } from '@/components/Navbar';
import { Container } from '@/components/primitives';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" noindex />
      <Navbar />
      <main className="py-24 text-center">
        <Container>
          <p className="text-6xl font-black" style={{ color: 'var(--brand)' }}>404</p>
          <h1 className="mt-4 text-2xl font-bold">This page drifted off-air</h1>
          <p className="mt-2 text-[color:var(--text-muted)]">The page you are looking for does not exist.</p>
          <Link href="/" className="mt-6 inline-block rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-white" style={{ background: 'var(--brand)' }}>
            Back to browse
          </Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}
