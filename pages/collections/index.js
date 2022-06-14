import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Card, Flexbox, Grid, PaddedContent } from '../../components/containers'
import { Footer, Navbar } from '../../components/layouts'
import { InputModal } from '../../components/modals'
import { createCollection } from '../../lib/storage'

export const Collection = () => {

  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    
  }, [flag])
  

  const addToCollection = (name) => {
    const result = createCollection(name);
    console.log(result);
    setFlag(!flag);
    setOpen(false);
  }

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      <InputModal open={open} setOpen={setOpen} title={'Create a new Collection'} click={addToCollection} />
      <Navbar />
      <PaddedContent verticalMargin='2rem'>
        <Flexbox>
          <h1>Collection List</h1>
        </Flexbox>
        <div>
          <Grid gap='8'>
            {
              collections.map(collection => (
                <Card key={collection.id} maxWidth={'20rem'} borderRadius={'0.5rem'} css={css`
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
                      src={collection.coverImage.large}
                      alt={collection.title.romaji}
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
                        <LinkButton key={collection.id} href={`/collections/` + collection.id} padding='0px'>
                          {truncate(collection.title.romaji, 30)}
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
                      `}>
                      <Container css={css`
                          min-width: 2.25rem;
                          font-weight: bold;
                          border: 3px solid ${VIVID_CERULEAN};
                          padding: 0.25rem 0.3rem;
                          border-radius: 100%;
                      `}>
                        {collection.averageScore ? collection.averageScore : '0'}
                      </Container>
                      <Container css={css`
                          font-size: small;
                          padding: 0.25rem 0.3rem;
                          color: grey;
                      `}>
                        {collection.episodes ? collection.episodes : '0'} Episodes
                      </Container>
                    </Flexbox>
                  </Flexbox>
                </Card>
              ))
            }
          </Grid>
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