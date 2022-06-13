import gql from 'graphql-tag';

const GET_ANIME = gql`
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (id: $id, search: $search, type : ANIME) {
                id
                episodes
                averageScore
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

export default GET_ANIME;