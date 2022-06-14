import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, LinkButton } from '../components/buttons';
import { Card, Container, Flexbox, Grid } from '../components/containers';
import { initializeApollo } from '../lib/apollo';
import GET_ANIME from '../lib/queries/getAnime';
import Image from 'next/image';
import { css } from '@emotion/react';
import { Layout, Pagination } from '../components/layouts';
import { RICH_BLACK, VIVID_CERULEAN } from '../components/colors';
import { truncate } from '../lib/utils/word';
import { CollectionModal, InputModal } from '../components/modals';
import { getAllCollection } from '../lib/storage';

export const AnimeList = () => {
  const [currPage, setCurrPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState([]);
  const [isBulking, setIsBulking] = useState(false);

  useEffect(() => {

  }, []);

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

  const addToCollection = (name) => {
    const result = createCollection(name);
    console.log(result);
    setFlag(!flag);
    setOpen(false);
    setCollectionOpen(true);
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

  return (
    <>
      <InputModal open={open} setOpen={setOpen} title={'Create a new Collection'} click={addToCollection} />
      {
        getAllCollection().length === 0
          ?
          <>
            <CollectionModal item={selectedAnime} open={collectionOpen} setOpen={setCollectionOpen} action={() => setFlag(flag => !flag)} />
          </>
          :
          <CollectionModal item={selectedAnime} open={collectionOpen} setOpen={setCollectionOpen} action={() => setFlag(flag => !flag)} />
      }
      <Layout>
        <Flexbox justify='space-between' >
          <h1>Anime List</h1>
          {
            !isBulking
              ?
              <Button click={() => {
                setIsBulking(true);
              }} textColor={RICH_BLACK} css={css`font-weight:800;border-width:2px;`}>+ Add to Collection</Button>
              :
              <Button click={() => {
                setIsBulking(false);
                if (getAllCollection().length === 0)
                  setOpen(!open);
                else
                  setCollectionOpen(!collectionOpen);
              }} textColor={RICH_BLACK} css={css`font-weight:800;border-width:2px;`}>Finalize Selection</Button>
          }
        </Flexbox>
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
            <p>Loading...</p>
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
