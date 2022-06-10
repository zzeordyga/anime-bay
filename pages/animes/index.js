import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { initializeApollo } from '../../lib/apollo';
import GET_ANIME from '../../lib/queries/getAnime';

export const AnimeList = () => {
    const router = useRouter();
    const [currPage, setCurrPage] = useState(1);

    const { loading, error, data } = useQuery(GET_ANIME, {
        variables: {
            page: currPage,
            perPage: 10,
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error...</p>;

    const animeList = data.Page.media;
    const paginationInfo = data.Page.pageInfo;
    
    let prevPage = () => {
        setCurrPage(page => page - 1);
    }

    let nextPage = () => {
        setCurrPage(page => page + 1);
    }

    return (
        <div>
            <ul>
                {
                    animeList.map(anime => (
                        <li key={anime.id}>
                            <Link href={router.asPath + `/` + anime.id}>
                                <h3>{anime.title.romaji}</h3>
                            </Link>
                        </li>
                    ))
                }
            </ul>
            <button onClick={prevPage} disabled={currPage == 1 ? true : false}>Prev</button>
            <button onClick={nextPage} disabled={!paginationInfo.hasNextPage}>Next</button>
        </div>
    )
};

export const getServerSideProps = async () => {
    const apolloClient = initializeApollo();
    await apolloClient.query({
        query: GET_ANIME,
        variables: {
            page: 1,
            perPage: 10
        },
    });
    return {
        props: { initialApolloState: apolloClient.cache.extract() },
    };
}



export default AnimeList;
