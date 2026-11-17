import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// Os remotes só são resolvidos no navegador, então o painel não é renderizado no servidor.
const PainelFederado = dynamic(() => import('../components/PainelFederado'), {
  ssr: false,
  loading: () => <p className={styles.carregando}>Carregando aplicação...</p>,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Sistema de Pedidos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <header className={styles.cabecalho}>
          <h1 className={styles.titulo}>Sistema de Pedidos</h1>
          <p className={styles.subtitulo}>Container com dois micro frontends independentes</p>
        </header>

        <PainelFederado />
      </main>
    </>
  );
}
