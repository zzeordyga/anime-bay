import Head from 'next/head'
import { PaddedContent } from '../components/containers'
import { Footer, Navbar } from '../components/layouts'
import { CollectionModal } from '../components/modals'
import { getAllCollection } from '../lib/storage'

export default function Home() {

  const collections = getAllCollection();

  // console.log(collections);

  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      <CollectionModal tempCollections={collections} item={{id : 1}}>
        
      </CollectionModal>
      <Navbar />
      <PaddedContent verticalMargin='2rem'>

      </PaddedContent>
      <Footer />
    </div>
  )
}
