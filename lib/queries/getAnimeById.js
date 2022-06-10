import gql from 'graphql-tag';

const GET_ANIME_BY_ID = gql`
    query ($id: Int, $page: Int, $perPage: Int) {
        Media(id : $id, type : ANIME) {
            title {
                native
                userPreferred
            }
            coverImage {
                extraLarge
                large
                medium
                color
            }
            description
            episodes
            genres
            averageScore
            reviews (perPage : $perPage, page : $page, sort : ID) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                nodes {
                    user{
                        name
                    }
                    score
                    summary
                }
            }
        }
    }
`;

export default GET_ANIME_BY_ID;