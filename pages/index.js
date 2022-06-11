import Head from 'next/head'
import Image from 'next/image'
import { Button, LinkButton } from '../components/button'
import { Card, flexbox as flexCss} from '../components/containers'
import styles from '../styles/Home.module.css'

export default function Home() {
  const flexbox = flexCss();
  
  return (
    <div className={styles.container}>
      <Button uppercase={true}>Something</Button>
      <LinkButton href={`/animes`}>Find Animes</LinkButton>
      <Card css={flexbox}>
        <ul>
            {
              [1, 3, 5].map(el => (
                <li key={el}>{el}</li>
              ))
            }
          </ul>
      </Card>
    </div>
  )
}
