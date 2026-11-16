import Head from 'next/head';

export const SITE_URL = 'https://zzeordyga.github.io/anime-bay';
const SITE_NAME = 'anime-bay';
const DEFAULT_DESC = 'Browse AniList anime, explore by season and genre, and curate your own collections.';

interface Props {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export default function Seo({ title, description = DEFAULT_DESC, path = '/', image, noindex, jsonLd }: Props) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — browse anime & build collections`;
  const url = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/?$/, '/')}`;
  const img = image ?? `${SITE_URL}/og.png`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </Head>
  );
}
