// AniList GraphQL response shapes (subset selected by our queries).

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AnimeListItem {
  id: number;
  episodes: number | null;
  averageScore: number | null;
  coverImage: { large: string; medium: string };
  title: { romaji: string | null };
  genres?: string[];
  seasonYear?: number | null;
  bannerImage?: string | null;
}

export interface AnimeDetail {
  id: number;
  title: { native: string | null; userPreferred: string | null; romaji: string | null };
  coverImage: { extraLarge: string; large: string; medium: string };
  bannerImage?: string | null;
  description: string | null;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  averageScore: number | null;
  studios: { nodes: { name: string }[] };
  status: string | null;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  season?: string | null;
  seasonYear?: number | null;
  reviews: {
    pageInfo: PageInfo;
    nodes: { user: { name: string }; score: number; summary: string }[];
  } | null;
}

export interface AnimeListResponse {
  Page: { pageInfo: PageInfo; media: AnimeListItem[] };
}

export interface AnimeDetailResponse {
  Media: AnimeDetail;
}

/** Shape persisted to localStorage in a collection. */
export interface CollectionItem {
  id: number;
  title: string;
  coverImage: { extraLarge: string; large: string; medium: string };
  averageScore: number | null;
  episodes: number | null;
}

export interface Collection {
  name: string;
  array: CollectionItem[];
}