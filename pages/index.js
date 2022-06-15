import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, LinkButton } from '../components/buttons';
import CheckboxContainer, { Card, Container, Flexbox, Grid } from '../components/containers';
import { initializeApollo } from '../lib/apollo';
import GET_ANIME from '../lib/queries/getAnime';
import Image from 'next/image';
import { css } from '@emotion/react';
import { Layout, Loading, Pagination } from '../components/layouts';
import { RICH_BLACK, VIVID_CERULEAN } from '../components/colors';
import { truncate } from '../lib/utils/word';
import { ArrayCollectionModal, CollectionModal, InputModal, Snackbar } from '../components/modals';
import { getAllCollection } from '../lib/storage';
import { LG, MD, SM } from '../components/breakpoints';

export const AnimeList = () => {
  const [currPage, setCurrPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [isBulking, setIsBulking] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setCollections(getAllCollection());
  }, [flag]);

  const { loading, error, data } = useQuery(GET_ANIME, {
    variables: {
      page: currPage,
      perPage: 10,
    }
  });

  if (loading) return <Loading />;
  if (error) return <p>Error...</p>;

  const animeList = data.Page.media;
  const paginationInfo = data.Page.pageInfo;

  const addToCollection = (name) => {
    const result = createCollection(name);

    if (result.success) {
      setFlag(!flag);
      setOpen(false);
      setCollectionOpen(true);
    }
    else {
      setSnackOpen(true);
      setSnackMessage(result.error);
    }
  }

  const prevPage = () => {
    setCurrPage(page => page - 1);
  }

  const nextPage = () => {
    setCurrPage(page => page + 1);
  }

  const goToPage = (newPage) => {
    setCurrPage(newPage);
  }

  const checkAnimeInCollection = (anime) => selectedAnime.indexOf(anime) != -1;

  return (
    <>
      {/* <InputModal open={open} setOpen={setOpen} title={'Create a new Collection'} click={addToCollection} /> */}
      {
        collections.length === 0
          ?
          <>
            <ArrayCollectionModal item={selectedAnime} open={collectionOpen} setOpen={setCollectionOpen} action={() => setFlag(flag => !flag)} />
        </>
          :
          <ArrayCollectionModal item={selectedAnime} open={collectionOpen} setOpen={setCollectionOpen} action={() => setFlag(flag => !flag)} />
      }
      <Snackbar setOpen={() => setSnackOpen(false)} open={snackOpen}>{snackMessage}</Snackbar>
      <Layout>
        <Flexbox justify='space-between' css={css`margin-bottom:1.5rem;`}>
          <h1>Anime List</h1>
          {
            !isBulking
              ?
              <Button click={() => {
                setIsBulking(true);
              }} textColor={RICH_BLACK} css={css`font-weight:800;border-width:2px;`}>+ Add to Collection</Button>
              :
              <Container>
                <Button click={() => {
                  setIsBulking(false);
                  if (getAllCollection().length === 0)
                    setOpen(!open);
                  else
                    setCollectionOpen(!collectionOpen);
                }} textColor={RICH_BLACK} css={css`font-weight:800;border-width:2px;`}>Finalize Selection</Button>
                <Button click={() => {
                  setIsBulking(false);
                  setSelectedAnime([]);
                }} textColor={RICH_BLACK} css={css`margin-left: 1rem;font-weight:800;border-width:2px;`}>Cancel</Button>
              </Container>
          }
        </Flexbox>
        {
          !loading ?
            <div>
              <Grid gap='8'>
                {
                  animeList.map(anime => (
                    <Card key={anime.id} maxWidth={'20rem'} borderRadius={'0.5rem'} css={
                        css`
                          position: relative;
                          transition: all 0.1s ease-in;
                          bottom: 0;
                          
                          &:hover {
                              bottom: 0.25rem;
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

                      {
                        isBulking &&
                        <Container css={css`
                        width: 100%;
                        background-color: rgba(0, 0, 0, 0.2);
                        height: 100%;
                        position: absolute;
                        z-index: 100;
                        border-radius: 0.5rem;

                        & > *{
                          position: absolute;
                          top: 0.25rem;
                          right: 0.25rem;
                        }

                        & input[type=checkbox] {
                          min-height: 2rem;
                          min-width: 2rem;
                          border-radius: 0.5rem;
                          color: aliceblue;
                          filter: invert(100%) brightness(1.7) saturate(50%);
                        }

                        @media only screen and (min-width: ${LG}) {
                          & input[type=checkbox] {
                            min-height: 1.25rem;
                            min-width: 1.25rem;
                          } 
                        }
                      `}
                          click={() => {
                            setSelectedAnime([...selectedAnime, anime]);
                          }}
                        >
                          <CheckboxContainer
                            changeAction={() => {
                              setSelectedAnime([...selectedAnime, anime]);
                            }}
                            isChecked={checkAnimeInCollection(anime)}
                            disabled={true}
                          />
                        </Container>
                      }
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
                            <LinkButton key={anime.id} href={`/animes/` + anime.id} padding='0px'>
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
            <Loading />
        }
      </Layout>
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
