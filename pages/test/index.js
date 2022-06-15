import { css } from '@emotion/react'
import Head from 'next/head'
import { Container, PaddedContent } from '../../components/containers'
import { Footer, Loading, Navbar } from '../../components/layouts'
import { ContainerModal, PromptModal } from '../../components/modals'

export default function Home() {

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      {/* <PromptModal title={"Test"} description={"YEAH!"} action={() => { }} /> */}
      <Navbar />
      <PaddedContent verticalMargin='2rem' css={css`
        position: relative;
      `}>
      </PaddedContent>
      <Footer />
    </div>
  )
}
