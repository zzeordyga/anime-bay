import { useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react'
import { LG, MD, SM, XL } from '../../components/breakpoints';
import { Button, LinkButton, TextButton } from '../../components/buttons';
import { BLACK, RICH_BLACK, VIVID_CERULEAN } from '../../components/colors';
import { Container, Flexbox, PaddedContent } from '../../components/containers';
import { Footer, Navbar } from '../../components/layouts';
import { initializeApollo } from '../../lib/apollo';
import GET_ANIME_BY_ID from '../../lib/queries/getAnimeById';
import { truncate } from '../../lib/utils/word';
import parse from 'html-react-parser'
import { convertDate } from '../../lib/utils/dateConverter';

const AnimeDetail = ({ animeId }) => {
    const [currPage, setCurrPage] = useState(1);
    const [less, setLess] = useState(true);

    const { loading, error, data: animeInfo } = useQuery(GET_ANIME_BY_ID, {
        variables: {
            "id": animeId,
            "page": currPage,
            "perPage": 10,
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
        endDate,
        startDate,
        status,
        studios: { nodes: studios }, // Studios has nodes and nodes has all the studios (?)
        reviews
    } = animeInfo.Media;

    console.log(studios);

    const addToCollection = () => {

    }

    const showLess = () => {
        setLess(l => !l);
    }

    return (
        <>
            <Head>
                <title>Anime Bay</title>
            </Head>
            <Navbar />
            <PaddedContent>
                <Flexbox css={
                    css`
                        margin-top: 1rem;
                        margin-bottom: 0;
                        z-index: 1;
                        position: relative;
                        display: block;

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
                            <Flexbox minHeight='1rem'>
                                <div>
                                    <Flexbox alignment='center' css={css`
                                                & > * {
                                                    margin : 1rem 0;
                                                }
                                            `}
                                        minHeight='1rem'>
                                        <div>
                                            <div>
                                                <LinkButton href='/animes' textColor={RICH_BLACK}>
                                                    Anime List
                                                </LinkButton>
                                            </div>
                                        </div>
                                        <div>
                                            <Flexbox>
                                                <Container css={css`
                                                            height: 1.5rem;
                                                            height: 1.5rem;
                                                        `}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {/* Somehow you need this */}
                                                    <Container css={css`
                                                                visibility: hidden;
                                                            `}>S</Container>
                                                </Container>
                                                <div>
                                                    <LinkButton href={`/animes/` + animeId} textColor={RICH_BLACK}>
                                                        {titles.userPreferred}
                                                    </LinkButton>
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
                        font-size: 48px;
                        font-weight: 600;
                    `}>
                            {titles.userPreferred}
                        </Container>
                        <Container css={css`
                            font-weight: 500;
                            margin-left: 0.1rem;
                            ${titles.userPreferred === titles.native ? 'display : none;' : ''}
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
                                    <Container
                                        key={genre}
                                        css={css`
                                        padding: 0.25rem 0.75rem;
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
                        margin-top: 1rem;
                        justify-self: end;
                    `}>
                        <Button click={addToCollection} textColor={RICH_BLACK} css={css`font-weight:800;border-width:2px;`}>+ Add to Collection</Button>
                    </Container>
                </Flexbox>
                <Flexbox alignment='start' css={
                    css`
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
                    <Container>
                        <Image src={coverImage.extraLarge} alt={`Cover Image`} width={350} height={350} />
                        <Flexbox direction='column' alignment='center' css={css`
                            & > * {
                                width: 100%;
                            }

                            & p, & h4 {
                                width: 50%;
                                word-wrap: normal;
                            }

                            & h4 {
                                text-align: end;
                            }
                        `}>
                            <Flexbox justify='space-between'>
                                <p>Episodes</p>
                                <h4>{episodes} Episodes</h4>
                            </Flexbox>
                            <Flexbox justify='space-between'>
                                <p>Average Score</p>
                                <h4>
                                    <Container css={css`
                                        font-weight: bolder;
                                        border: 5px solid ${VIVID_CERULEAN};
                                        padding: 0.25rem 0.3rem;
                                        border-radius: 100%;
                                        display: inline;
                                        margin: 0 0.25rem;
                                    `}>
                                        {averageScore ? averageScore : '0'}
                                    </Container>
                                    <Container css={css`
                                        display: inline;
                                        margin: 0 4px;
                                        font-weight:normal;
                                    `}>
                                        from
                                    </Container>
                                    {reviews.pageInfo.total}
                                    <Container css={css`
                                        display:inline;
                                        font-weight:normal;
                                        margin: 0 4px;
                                    `}>
                                        users
                                    </Container>
                                </h4>
                            </Flexbox>
                            <Flexbox justify='space-between'>
                                <p>Status</p>
                                <h4>{status}</h4>
                            </Flexbox>
                            <Flexbox justify='space-between'>
                                <p>Aired</p>
                                <h4
                                >
                                    {convertDate(startDate.year, startDate.month, startDate.day) + ' '}
                                    to
                                    {' ' + convertDate(endDate.year, endDate.month, endDate.day)}
                                </h4>
                            </Flexbox>
                            <Flexbox justify='space-between' alignment='flex-start' css={css`
                                & > h4 {
                                    margin: 0;
                                }
                            `}>
                                <p>
                                    <Container
                                        css={css`
                                            align-self: flex-start;
                                            position: relative;
                                            top: 0;
                                        `}
                                    >
                                        Studios
                                    </Container>
                                </p>
                                <h4>
                                    <ul>
                                        {
                                            studios.map(studio => (
                                                <li key={studio}>{studio.name}</li>
                                            ))
                                        }
                                    </ul>
                                </h4>
                            </Flexbox>
                        </Flexbox>
                    </Container>
                    <Container css={
                        css`
                        margin: 0;
                        width: 100%;
                        padding-left: 0rem;
                        font-weight: bold;
                        font-size: 2rem;
                        align-self: flex-start;

                        & > p {
                            width: 100%;
                            font-size: 1rem;
                            font-weight: 100;
                        }

                        @media only screen and (min-width: ${MD}) {
                            
                            padding-left: 2rem;
                            font-size: 3rem;
                            width: 80%;
                        }

                        @media only screen and (min-width: ${XL}) {
                            font-size: 3rem;
                            
                            & > p {
                                width: 80%;
                                font-size: 1rem;
                                font-weight: 100;
                            }
                        }
                    `}>
                        <span>Description</span>
                        <p>
                            {less ? parse(truncate(description, 400, '...')) : parse(description)}
                            {description.length > 400 ?
                                <TextButton click={showLess}>
                                    Show {!less ? 'Less' : 'More'}
                                </TextButton>
                                :
                                ''}
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