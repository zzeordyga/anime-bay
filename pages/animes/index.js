import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { LinkButton } from '../../components/buttons';
import { Card, Container, Flexbox, Grid, PaddedContent } from '../../components/containers';
import { initializeApollo } from '../../lib/apollo';
import GET_ANIME from '../../lib/queries/getAnime';
import Image from 'next/image';
import { css } from '@emotion/react';
import { Footer, Navbar, Pagination } from '../../components/layouts';
import { VIVID_CERULEAN } from '../../components/colors';
import Head from 'next/head';
import { truncate } from '../../lib/utils/word';


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

    const prevPage = () => {
        setCurrPage(page => page - 1);
    }

    const nextPage = () => {
        setCurrPage(page => page + 1);
    }

    const goToPage = (newPage) => {
        setCurrPage(newPage);
    }

    return (
        <>
            <Head>
                <title>Anime Bay</title>
            </Head>
            <Navbar />
            <PaddedContent verticalMargin='2rem'>
                <h1>Anime List</h1>
                {
                    !loading ?
                        <div>
                            <Grid gap='8'>
                                {
                                    animeList.map(anime => (
                                        <Card key={anime.id} maxWidth={'20rem'} borderRadius={'0.5rem'} css={css`
                                position: relative;
                                transition: all 0.1s ease-in;
                                bottom: 0;
                                
                                &:hover {
                                    bottom: 0.5rem;
                                }

                                &:hover img {
                                    filter: brightness(90%);
                                }

                                & img {
                                    border-top-right-radius: 0.5rem;
                                    border-top-left-radius: 0.5rem;
                                }
                            `
                                        }>
                                            <Flexbox
                                                direction='column'
                                                justify='center' alignment='start'>
                                                <Image
                                                    src={anime.coverImage.large}
                                                    alt={anime.title.romaji}
                                                    width={325}
                                                    height={275}
                                                />

                                                {/* Title */}
                                                <Flexbox css={css`
                                            padding: 0.5rem;
                                            font-size: larger;
                                            text-align: left;
                                            width: 85%;
                                            min-height: 5rem;
                                            /* align-items: ; */
                                        `}
                                                    justify="start"
                                                    alignment="flex-start"
                                                >
                                                    <Container css={css`
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                
                                                &:hover {
                                                    text-decoration: underline ${VIVID_CERULEAN} 2px;
                                                }
                                            `
                                                    }>
                                                        <LinkButton key={anime.id} href={router.asPath + `/` + anime.id} padding='0px'>
                                                            {truncate(anime.title.romaji, 30)}
                                                        </LinkButton>
                                                    </Container>
                                                </Flexbox>

                                                {/* Misc */}
                                                <Flexbox
                                                    justify='space-between'
                                                    alignment='end'
                                                    css={css`
                                                width: 100%;
                                                padding: 0.5rem;
                                                justify-self: baseline;
                                                margin: 0.25rem;
                                            `}
                                                >
                                                    <Container css={css`
                                                        min-width: 2.25rem;
                                                        font-weight: bold;
                                                        border: 3px solid ${VIVID_CERULEAN};
                                                        padding: 0.25rem 0.3rem;
                                                        border-radius: 100%;
                                                    `}>
                                                        {anime.averageScore ? anime.averageScore : '0'}
                                                    </Container>
                                                    <Container css={css`
                                                        font-size: small;
                                                        padding: 0.25rem 0.3rem;
                                                        color: grey;
                                                    `}>
                                                        {anime.episodes ? anime.episodes : '0'} Episodes
                                                    </Container>
                                                </Flexbox>
                                            </Flexbox>
                                        </Card>
                                    ))
                                }
                            </Grid>
                            {/* <button onClick={prevPage} disabled={currPage == 1 ? true : false}>Prev</button>
                    <button onClick={nextPage} disabled={!paginationInfo.hasNextPage}>Next</button> */}
                            <Pagination
                                pages={paginationInfo.lastPage}
                                hasNext={paginationInfo.hasNextPage}
                                currPage={currPage}
                                goToPageAction={goToPage}
                                nextAction={nextPage}
                                prevAction={prevPage}
                                perPage={10}
                                total={paginationInfo.total}
                            />
                        </div>
                        :
                        <p>Loading...</p>
                }
            </PaddedContent>
            <Footer />
        </>
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
