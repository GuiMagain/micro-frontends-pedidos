import Head from 'next/head';
import Cardapio from '../components/Cardapio';

// Página de teste isolada: permite validar o micro sem o container.
export default function CardapioStandalone() {
  return (
    <>
      <Head>
        <title>Micro Cardápio</title>
      </Head>
      <main style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem', background: '#1d2722', minHeight: '100vh' }}>
        <Cardapio />
      </main>
    </>
  );
}
