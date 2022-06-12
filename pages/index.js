import Head from 'next/head'
import { flexbox as flexCss, PaddedContent} from '../components/containers'
import { Navbar } from '../components/layouts'
import styles from '../styles/Home.module.css'

export default function Home() {
  const flexbox = flexCss();
  
  return (
    <div>
      <Head>
        <title>Anime Bay</title>
      </Head>
      <Navbar/>
      <PaddedContent verticalMargin='2rem'>
        Hello!
      </PaddedContent>
    </div>
  )
}
