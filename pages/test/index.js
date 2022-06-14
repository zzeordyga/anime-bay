import Head from 'next/head'
import { PaddedContent } from '../../components/containers'
import { Footer, Navbar } from '../../components/layouts'
import { PromptModal } from '../../components/modals'

export default function Home() {

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      {/* <PromptModal title={"Test"} description={"YEAH!"} action={() => { }} /> */}
      <Navbar />
      <PaddedContent verticalMargin='2rem'>
      </PaddedContent>
      <Footer />
    </div>
  )
}
