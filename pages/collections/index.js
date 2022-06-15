import { css } from '@emotion/react'
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { MD, SM } from '../../components/breakpoints'
import { Button, LinkButton, TextButton } from '../../components/buttons'
import { ERROR_RED, GREY, LIGHT_GREY, RICH_BLACK, VIVID_CERULEAN, WHITE } from '../../components/colors'
import { Card, Container, Flexbox, Grid, PaddedContent } from '../../components/containers'
import { Footer, Navbar } from '../../components/layouts'
import { InputModal, PromptModal, Snackbar } from '../../components/modals'
import { createCollection, getAllCollection, removeCollection, updateCollection } from '../../lib/storage'
import { truncate } from '../../lib/utils/word'
import defaultImage from '../../public/default.png'

export const Collection = () => {

  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const result = getAllCollection();
    setCollections(result);
  }, [flag]);


  const addToCollection = (name) => {
    const result = createCollection(name);
    if (!result.error) {
      setFlag(!flag);
      setOpen(false);
      setError(false);
    }
    else {
      setError(true);
      setSnackOpen(true);
      setSnackMessage(result.error);
    }
  }

  const updateCollectionName = (newName) => {
    const result = updateCollection(name, newName);

    if (result.success) {
      setUpdateOpen(!updateOpen);
      setFlag(!flag);
    }
    else {
      setSnackOpen(true);
      setSnackMessage(result.error);
    }
  }

  const deleteCollection = () => {
    const result = removeCollection(name);

    if (result.success) {
      setFlag(!flag);
    }
    else {
      setSnackOpen(true);
      setSnackMessage(result.error);
    }

  }

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
        <link rel="shortcut icon" href="/anime-bay-600.svg" />
      </Head>
      <InputModal open={open} setOpen={setOpen} title={'Create a new Collection'} click={addToCollection} error={error} />
      <InputModal open={updateOpen} setOpen={setUpdateOpen} title={'Update Collection Name'} click={updateCollectionName} error={error} />
      <PromptModal open={deleteOpen} setOpen={setDeleteOpen} title={'Deleting this collection'} description={'Are you sure you want to delete this collection? You cannot revert this action.'} prompt={'Delete'} action={deleteCollection} />
      <Snackbar setOpen={() => setSnackOpen(false)} open={snackOpen}>{snackMessage}</Snackbar>
      <Navbar />
      <PaddedContent verticalMargin='2rem'>
        <Flexbox
          justify='space-between'
        >
          <h1>Collection List</h1>
          <Button textColor={RICH_BLACK} css={css`font-weight:700;border-width:2px;`} click={() => setOpen(true)}>+ New Collection</Button>
        </Flexbox>
        <div>
          {
            collections.length !== 0
              ?
              <Grid gap='8' col={4}>
                {
                  collections.map((collection, id) => (
                    <Card key={id} maxWidth={'20rem'} borderRadius={'0.5rem'}
                      css={css`
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

                        {
                          collection.array[0]
                            ?
                            <Image
                              src={collection.array[0].coverImage.large}
                              alt={collection.name}
                              width={325}
                              height={275}
                            />
                            :
                            <Image
                              src={defaultImage}
                              alt={collection.name}
                              width={325}
                              height={275}
                            />
                        }

                        {/* Title */}
                        <Flexbox css={css`
                        padding: 0.5rem;
                        font-size: larger;
                        text-align: left;
                        width: 85%;
                        min-height: 5rem;
                        /* align-items: ; */
                    `}
                          direction="column"
                          justify="start"
                          alignment="flex-start"
                        >
                          <Container css={css`
                          overflow: hidden;
                          text-overflow: ellipsis;
                      `
                          }>
                            <Container css={css`
                            font-weight: bold;
                        `}>
                              <LinkButton href={`/collections/` + collection.name.replace(' ', '-')} padding='0px'>
                                {truncate(collection.name, 30)}
                              </LinkButton>
                            </Container>

                          </Container>
                          <Container css={css`
                            font-size: small;
                            padding: 0.25rem 0.3rem;
                            color: grey;
                        `}>
                            {collection.array.length} Anime(s)
                          </Container>
                        </Flexbox>

                        {/* Misc */}

                        <Flexbox css={css`
                            width: 100%;
                            border-top: 1px solid ${GREY};
                            font-size: small;
                            color: grey;
                            justify-content: space-evenly;

                            & > * {
                              flex-grow: 1;
                              min-width: 45%;
                              padding: 0.25rem 0;
                            }

                            & > *:hover {
                              background-color: ${LIGHT_GREY};
                              color: white;
                            }
                        `}>
                          <Container>
                            <TextButton textColor={GREY} click={() => {
                              setName(collection.name);
                              setUpdateOpen(!updateOpen);
                            }}>Edit Name</TextButton>
                          </Container>
                          <Container css={`
                              border: 0;
                              border-top : 1px solid ${GREY};

                              @media only screen and (min-width : ${SM}) {
                                border: 0;
                                border-left: 1px solid ${GREY};  
                              }
                          `}>
                            <TextButton textColor={GREY} hoverColor={ERROR_RED} click={() => {
                              setName(collection.name);
                              setDeleteOpen(!deleteOpen);
                            }}>Delete Collection</TextButton>
                          </Container>
                        </Flexbox>
                      </Flexbox>
                    </Card>
                  ))
                }
              </Grid>
              :
              <>Nothing here yet!</>
          }
          {/* <Pagination
                pages={paginationInfo.lastPage}
                hasNext={paginationInfo.hasNextPage}
                currPage={currPage}
                goToPageAction={goToPage}
                nextAction={nextPage}
                prevAction={prevPage}
                perPage={10}
                total={paginationInfo.total}
              /> */}
        </div>
      </PaddedContent>
      <Footer />
    </div>
  )
}

export default Collection;