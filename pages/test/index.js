import Head from 'next/head'
import { PaddedContent } from '../../components/containers'
import { Footer, Navbar } from '../../components/layouts'

export default function Home() {

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      <Navbar />
      <PaddedContent verticalMargin='2rem'>

      </PaddedContent>
      <Footer />
    </div>
  )
}
