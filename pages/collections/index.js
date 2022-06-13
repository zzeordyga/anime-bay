import Head from 'next/head'
import React from 'react'
import { PaddedContent } from '../../components/containers'
import { Footer, Navbar } from '../../components/layouts'
import { InputModal } from '../../components/modals'
import { createCollection } from '../../lib/storage'

export const Collection = () => {
  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      <InputModal title={"Input your Collection Name"} click={createCollection}/>
      <Navbar />
      <PaddedContent verticalMargin='2rem'>
      </PaddedContent>
      <Footer/>
    </div>
  )
}
