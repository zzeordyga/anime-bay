import { useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { LG, MD, SM, XL } from '../../components/breakpoints';
import { Button, LinkButton, TextButton } from '../../components/buttons';
import { BLACK, GREY, RICH_BLACK, VIVID_CERULEAN, WHITE } from '../../components/colors';
import { Container, Flexbox, PaddedContent } from '../../components/containers';
import { Breadcrumb, Footer, Navbar } from '../../components/layouts';
import { initializeApollo } from '../../lib/apollo';
import GET_ANIME_BY_ID from '../../lib/queries/getAnimeById';
import { truncate } from '../../lib/utils/word';
import parse from 'html-react-parser'
import { convertDate } from '../../lib/utils/dateConverter';
import { CollectionModal, InputModal } from '../../components/modals';
import { createCollectionWithItem, getAllCollection, getCollectionsByItem } from '../../lib/storage';

const AnimeDetail = ({ animeId }) => {
    const [currPage, setCurrPage] = useState(1);
    const [less, setLess] = useState(true);
    const [open, setOpen] = useState(false);
    const [collectionOpen, setCollectionOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const tempCollections = getCollectionsByItem(animeId);
        setCollections(tempCollections.array);
    }, [flag])


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
        id,
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

    const addToCollection = (name) => {
        const result = createCollectionWithItem(name, { id, coverImage, averageScore, episodes });
        console.log(result);
        setFlag(!flag);
        setOpen(false);
        setCollectionOpen(true);
    }

    const showLess = () => {
        setLess(l => !l);
    }

    return (
        <>
            <Head>
                <title>Anime Bay</title>
            </Head>
            {
                getAllCollection().length === 0
                    ?
                    <>
                        <InputModal open={open} setOpen={setOpen} title={'Create a new Collection'} click={addToCollection} />
                        <CollectionModal item={{ id, title : titles.romaji, coverImage, averageScore, episodes }} open={collectionOpen} setOpen={setCollectionOpen} action={() => setFlag(flag => !flag)} />
                    </>
                    :
                    <CollectionModal item={{ id, title : titles.romaji, coverImage, averageScore, episodes }} open={collectionOpen} setOpen={setCollectionOpen} action={() => setFlag(flag => !flag)} />
            }
            <Navbar />
            <PaddedContent>
                <Breadcrumb links={[
                    {
                        href: '/',
                        name: 'Anime List',
                    },
                    {
                        href: '/animes/' + animeId,
                        name: titles.userPreferred,
                    }
                ]} />
                <Flexbox justify='space-between' alignment='baseline'
                    css={css`
                        flex-direction: column;
                        @media only screen and (min-width: ${SM}) {
                            flex-direction: row;
                        }
                    `}>
                    <Container css={css`
                        width: 70%;
                    `}>
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
                    </Container>
                    <Container css={css`
                        margin-top: 1rem;
                        justify-self: end;
                    `}>
                        <Button click={() => {
                            if (getAllCollection().length === 0)
                                setOpen(!open);
                            else
                                setCollectionOpen(!collectionOpen);
                        }} textColor={RICH_BLACK} css={css`font-weight:800;border-width:2px;`}>+ Add to Collection</Button>
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

                            & ul {
                                margin: 0;
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
                                <Container
                                    css={css`
                                            align-self: flex-start;
                                            position: relative;
                                            top: 0;
                                        `}
                                >
                                    Studios
                                </Container>
                                <h4>
                                    <ul>
                                        {
                                            studios.map(studio => (
                                                <li key={studio.name}>{studio.name}</li>
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
                        <div>
                            <Container css={css`
                                font-size: large;
                                ${collections.length == 0 && 'display : none;'}
                            `}>Collections with this Anime
                            </Container>
                            <Flexbox minHeight='1rem'
                                alignment='start'
                                css={css`
                                    font-size: medium;
                                    & > * {
                                        margin-top: 0.5rem;
                                    }
                                `}
                            >
                                {
                                    collections.map((collection, id) => (
                                        <Container
                                            key={id}
                                            css={css`
                                                padding: 0.25rem 0.75rem;
                                                background-color: ${RICH_BLACK};
                                                border-radius: 1rem;
                                                color: white;
                                                margin-top: 1rem;
                                                margin-right: 1rem;
                                                margin-left: 0;
                                            `}>
                                            <LinkButton href={'/collections/' + collection.replace(' ', '-')} textColor={GREY} hoverColor={WHITE}>
                                                {collection}
                                            </LinkButton>
                                        </Container>
                                    ))
                                }
                            </Flexbox>
                        </div>
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