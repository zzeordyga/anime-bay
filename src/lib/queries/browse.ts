import { gql } from '@apollo/client';

export const BROWSE = gql`
  query Browse(
    $page: Int
    $perPage: Int
    $search: String
    $genre: String
    $season: MediaSeason
    $seasonYear: Int
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      media(
        type: ANIME
        search: $search
        genre: $genre
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        isAdult: false
      ) {
        id episodes averageScore genres seasonYear
        coverImage { large medium }
        title { romaji }
      }
    }
  }
`;

export const SORTS = [
  { value: 'POPULARITY_DESC', label: 'Most popular' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'SCORE_DESC', label: 'Top rated' },
  { value: 'START_DATE_DESC', label: 'Newest' },
] as const;

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mahou Shoujo',
  'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];

export type Season = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export function currentSeason(d = new Date()): { season: Season; year: number } {
  const m = d.getMonth();
  const season: Season = m < 3 ? 'WINTER' : m < 6 ? 'SPRING' : m < 9 ? 'SUMMER' : 'FALL';
  return { season, year: d.getFullYear() };
}
