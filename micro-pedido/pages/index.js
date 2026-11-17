import Head from 'next/head';
import Pedido from '../components/Pedido';

// Página de teste isolada: permite validar o micro sem o container.
export default function PedidoStandalone() {
  return (
    <>
      <Head>
        <title>Micro Pedido</title>
      </Head>
      <main style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem', background: '#1d2722', minHeight: '100vh' }}>
        <Pedido />
      </main>
    </>
  );
}
