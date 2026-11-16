import { gql } from '@apollo/client';

export const GET_ANIME = gql`
  query GetAnime($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id: $id, search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        episodes
        averageScore
        genres
        seasonYear
        bannerImage
        coverImage {
          large
          medium
        }
        title {
          romaji
        }
      }
    }
  }
`;

export const GET_ANIME_BY_ID = gql`
  query GetAnimeById($id: Int, $page: Int, $perPage: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        native
        userPreferred
        romaji
      }
      coverImage {
        extraLarge
        large
        medium
      }
      bannerImage
      description
      episodes
      duration
      genres
      format
      tags { name rank isMediaSpoiler }
      averageScore
      season
      seasonYear
      studios {
        nodes {
          name
        }
      }
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      reviews(perPage: $perPage, page: $page, sort: ID) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        nodes {
          user {
            name
          }
          score
          summary
        }
      }
    }
  }
`;