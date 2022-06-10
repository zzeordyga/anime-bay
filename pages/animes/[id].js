import { useQuery } from '@apollo/client';
import React, {useState} from 'react'
import { initializeApollo } from '../../lib/apollo';
import GET_ANIME_BY_ID from '../../lib/queries/getAnimeById';

const AnimeDetail = ({ animeId }) => {
    const [currPage, setCurrPage] = useState(1);

    const { loading, error, data : animeInfo} = useQuery(GET_ANIME_BY_ID, {
        variables: {
            id: animeId,
            page: currPage,
            perPage: 5,
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error...</p>;

    const {
        title : titles,
        coverImage,
        description,
        episodes,
        genres,
        averageScore,
        reviews
    } = animeInfo.Media;

    // console.log(animeInfo);

    return (
        <div>
            <h1>
                Titles
            </h1>
            <ul>
                <li>Native Title : {titles.native}</li>
                <li>User Prefered Title : {titles.userPreferred}</li>
            </ul>

            {/* <p>coverImage : {coverImage}</p>
            <p>description : {description}</p>
            <p>episodes : {episodes}</p>
            <p>genres : {genres}</p>
            <p>averageScore : {averageScore}</p>
            <p>reviews : {reviews}</p> */}
        </div>
    )
}

export const getServerSideProps = async ({ query }) => {
    const animeId = query.id;

    const apolloClient = initializeApollo();
    await apolloClient.query({
        query: GET_ANIME_BY_ID,
        variables: {
            id: animeId,
            page: 1,
            perPage: 5,
        },
    });
    return {
        props: { initialApolloState: apolloClient.cache.extract(), animeId },
    };
}

export default AnimeDetail;