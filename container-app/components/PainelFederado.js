import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import styles from '../styles/Home.module.css';

// Carregamento dinâmico dos micros via Module Federation.
const Cardapio = React.lazy(() => import('micro_cardapio/Cardapio'));
const Pedido = React.lazy(() => import('micro_pedido/Pedido'));

/**
 * Integra os dois micros no container.
 * Cada um tem seu próprio ErrorBoundary e Suspense.
 */
export default function PainelFederado() {
  return (
    <div className={styles.painel}>
      <ErrorBoundary nome="Micro Cardápio">
        <Suspense fallback={<p className={styles.carregando}>Carregando cardápio...</p>}>
          <Cardapio />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary nome="Micro Pedido">
        <Suspense fallback={<p className={styles.carregando}>Carregando pedido...</p>}>
          <Pedido />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
