import { useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react'
import { LG, MD, SM, XL } from '../../components/breakpoints';
import { Button, LinkButton, TextButton } from '../../components/buttons';
import { FRENCH_BLUE, RICH_BLACK, VIVID_CERULEAN } from '../../components/colors';
import { Container, Flexbox, PaddedContent } from '../../components/containers';
import { Footer, LgElement, Navbar, SmElement } from '../../components/layouts';
import { initializeApollo } from '../../lib/apollo';
import GET_ANIME_BY_ID from '../../lib/queries/getAnimeById';
import { truncate } from '../../lib/utils/word';

const AnimeDetail = ({ animeId }) => {
    const [currPage, setCurrPage] = useState(1);
    const [less, setLess] = useState(true);

    const { loading, error, data: animeInfo } = useQuery(GET_ANIME_BY_ID, {
        variables: {
            id: animeId,
            page: currPage,
            perPage: 5,
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error...</p>;

    const {
        title: titles,
        coverImage,
        description,
        episodes,
        genres,
        averageScore,
        duration,
        studios : {nodes},
        reviews
    } = animeInfo.Media;

    const StyledHeader = styled.h1`
        margin-bottom: 0;
    `;

    const addToCollection = () => {

    }

    const showLess = () => {
        setLess(l => !l);
    }

    console.log(nodes)

    return (
        <>
            <Head>
                <title>Anime Bay</title>
            </Head>
            <Navbar />
            <PaddedContent>
                <Flexbox css={
                    css`
                        z-index: 1;
                        position: relative;
                        display: block;
                        margin: -3rem 0;
                        margin-top: -1rem;

                        @media only screen and (min-width: ${LG}) {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        }
                    `
                }
                    minHeight={'1rem'}
                >
                    <Flexbox shrink={1} grow={1} css={css`
                        min-width: 0;
                    `}>
                        <nav>
                            <Flexbox>
                                <div role='list'>
                                    <Flexbox alignment='center' css={css`
                                                & > * {
                                                    margin : 1rem 0;
                                                }
                                            `}>
                                        <div>
                                            <div>
                                                <LinkButton href='/animes' css={css`
                                                    color: ${RICH_BLACK};
                                                `}>Anime List</LinkButton>
                                            </div>
                                        </div>
                                        <div>
                                            <Flexbox>
                                                <Container css={css`
                                                            height: 1.5rem;
                                                            height: 1.5rem;
                                                        `}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                                    </svg>
                                                    <Container css={css`
                                                                /* color: white; */
                                                                visibility: hidden;
                                                            `}>S</Container>
                                                </Container>
                                                <div>
                                                    <LinkButton href={`/animes/` + animeId} css={css`
                                                        color: ${RICH_BLACK};
                                                    `}>{titles.userPreferred}</LinkButton>
                                                </div>
                                            </Flexbox>
                                        </div>
                                    </Flexbox>
                                </div>
                            </Flexbox>
                        </nav>
                    </Flexbox>
                </Flexbox>
                <Flexbox justify='space-between' alignment='baseline'
                    css={css`
                        flex-direction: column;
                        @media only screen and (min-width: ${SM}) {
                            flex-direction: row;
                        }
                    `}>
                    <div>
                        <Container css={css`
                        margin-top: 1rem;
                        font-size: 48px;
                        font-weight: 600;
                    `}>
                            {titles.userPreferred}
                        </Container>
                        <Container css={css`
                            font-weight: 500;
                            margin-left: 0.1rem;
                        `}>
                            {titles.native}
                        </Container>
                        <Flexbox minHeight='1rem'
                            alignment='start'
                            css={css`
                        & > * {
                            margin-top: 0.5rem;
                        }
                    `}
                        >
                            {
                                genres.map(genre => (
                                    <Container css={css`
                                        padding: 0.25rem 0.5rem;
                                        background-color: ${RICH_BLACK};
                                        border-radius: 1rem;
                                        color: white;
                                        margin-right: 1rem;
                                    `}>
                                        {genre}
                                    </Container>
                                ))
                            }
                        </Flexbox>
                    </div>
                    <Container css={css`
                        margin: 0.5rem 0;
                        justify-self: end;
                    `}>
                        <Button click={addToCollection} textColor={RICH_BLACK}>+ Add to Collection</Button>
                    </Container>
                </Flexbox>
                <Flexbox alignment='start' css={css`
                    padding : 2rem 0;

                    & > img { 
                        margin: 1rem;
                    }
                    
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: nowrap;
                    
                    @media only screen and (min-width: ${MD}){
                        flex-direction: row;
                        justify-content: start;
                        align-items: flex-start;
                        text-align: start;
                    }
                `}>
                    {/* <h1>Hello</h1> */}
                    <Container>
                        <Image src={coverImage.extraLarge} width={350} height={350} />
                        
                    </Container>
                    <Container css={css`
                        margin: 0;
                        width: 100%;
                        padding-top: 1.5rem;
                        padding-left: 1rem;
                        font-weight: bold;
                        font-size: 2rem;
                        align-self: flex-start;

                        & > p {
                            width: 100%;
                            font-size: 1rem;
                            font-weight: 100;
                        }

                        @media only screen and (min-width: ${MD}) {
                            padding-top: 0rem;
                            font-size: 3rem;
                            width: 60%;
                            
                            & > p {
                                width: 100%;
                                font-size: 1rem;
                                font-weight: 100;
                            }
                        }

                        @media only screen and (min-width: ${XL}) {
                            padding-top: 0rem;
                            font-size: 3rem;
                            
                            & > p {
                                width: 90%;
                                font-size: 1rem;
                                font-weight: 100;
                            }
                        }
                    `}>
                        Description
                        <p>
                            <SmElement>
                                {less ? truncate(description, 300, '...') : description}
                                {description.length > 300 ?
                                    <TextButton click={showLess}>
                                        Show {!less ? 'Less' : 'More'}
                                    </TextButton>
                                    :
                                    ''}
                            </SmElement>
                            <LgElement>
                                {less ? truncate(description, 600, '...') : description}
                                {description.length > 600 ?
                                    <TextButton click={showLess}>
                                        Show {!less ? 'Less' : 'More'}
                                    </TextButton>
                                    :
                                    ''}
                            </LgElement>
                        </p>
                    </Container>
                </Flexbox>
            </PaddedContent>
            <Footer />
        </>
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