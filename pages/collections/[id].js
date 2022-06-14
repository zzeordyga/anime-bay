import { css } from '@emotion/react';
import Router from 'next/dist/server/router';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SM } from '../../components/breakpoints';
import { Button, LinkButton } from '../../components/buttons';
import { ERROR_RED, RICH_BLACK, VIVID_CERULEAN, WHITE } from '../../components/colors';
import { Card, Container, Flexbox, Grid, PaddedContent } from '../../components/containers';
import { Breadcrumb, Footer, Navbar } from '../../components/layouts';
import { InputModal, PromptModal } from '../../components/modals';
import { getItem, removeCollection, removeItem, updateCollection } from '../../lib/storage';
import { truncate } from '../../lib/utils/word';

const CollectionDetail = ({ id }) => {

  const router = useRouter();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [name, setName] = useState("");
  const [anime, setAnime] = useState({});
  const [collection, setCollection] = useState([]);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const tempId = id ? id.replace('-', ' ') : 'ERROR';

    setName(id ? id.replace('-', ' ') : 'ERROR');
    setCollection(getItem(tempId));
  }, [id, flag]);

  if (!collection) return <>Error...</>

  const updateCollectionName = (newName) => {
    const result = updateCollection(name, newName);

    if (result.success) {
      setUpdateOpen(!updateOpen);
      router.push('/collections/' + newName.replace(' ', '-'));
    }
  }

  const deleteCollection = () => {
    const result = removeCollection(name);

    if (result.success) router.push('/collections/');
  }

  const removeAnime = () => {
    const result = removeItem(name, anime);
    
    if (result.success)
    setFlag(!flag);

    console.log(result);
  }

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
        <link rel="shortcut icon" href="/anime-bay-600.svg" />
      </Head>
      <InputModal open={updateOpen} setOpen={setUpdateOpen} title={'Update Collection Name'} click={updateCollectionName} error={error} />
      <PromptModal open={deleteOpen} setOpen={setDeleteOpen} title={'Deleting this collection'} description={'Are you sure you want to delete this collection? You cannot revert this action.'} prompt={'Delete'} action={deleteCollection} />
      <PromptModal open={removeOpen} setOpen={setRemoveOpen} title={'Removing ' + anime.title} description={'Are you sure you want this anime removed from this collection? You cannot revert this action.'} prompt={'Remove'} action={removeAnime} />
      <Navbar />
      <PaddedContent verticalMargin='2rem'>
        <Breadcrumb links={[
          {
            href: '/collections',
            name: 'Your Collections',
          },
          {
            href: '/collections/' + id,
            name,
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
                font-weight: bold;
            `}>
              {name}
            </Container>
          </Container>
          <Container css={css`
              margin-top: 1rem;
              justify-self: end;
              margin-bottom: 1rem;

              & > * {
                margin-right: 1rem;
              }
          `}>
            <Button textColor={WHITE} hoverText={VIVID_CERULEAN} backgroundColor={VIVID_CERULEAN} css={css`border-color: ${VIVID_CERULEAN};font-weight:700;border-width:2px;`} click={() => setUpdateOpen(true)}>Update Collection</Button>
            <Button textColor={WHITE} hoverText={ERROR_RED} backgroundColor={ERROR_RED} css={css`border-color: ${ERROR_RED};font-weight:700;border-width:2px;`} click={() => setDeleteOpen(true)}>Delete Collection</Button>
          </Container>
        </Flexbox>
        <div>
          {
            collection.length !== 0
              ?
              <Grid gap='8' col={4}>
                {
                  collection.map((anime, id) => (
                    <Card key={id} maxWidth={'20rem'} borderRadius={'0.5rem'} css={css`
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
                          alt={"Cover Image"}
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
                              {anime.title ? truncate(anime.title, 30) : "A Title"}
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
                        <Button textColor={ERROR_RED} hoverText={WHITE} backgroundColor={WHITE} css={css`
                          border-color: ${WHITE};
                          font-weight:700;
                          border-width:0px;
                          width: 100%;
                          border-top-left-radius: 0;
                          border-top-right-radius: 0;
                          padding: 0.75rem 0;
                          cursor: pointer;
                        `} click={() => {
                          setAnime(anime);
                          setRemoveOpen(true);
                        }}>Remove</Button>
                      </Flexbox>
                    </Card>
                  ))
                }
              </Grid>
              :
              <>Nothing here yet!</>
          }
        </div>
      </PaddedContent>
      <Footer />
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  return {
    props: { id: query.id },
  };
}

export default CollectionDetail;