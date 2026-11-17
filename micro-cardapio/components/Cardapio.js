import React from 'react';
import pratos from '../data/pratos';
import styles from './Cardapio.module.css';

/**
 * Micro Cardápio.
 * Ao clicar em "Adicionar ao pedido", dispara o evento global 'pedido:adicionar'
 * com o prato no campo `detail`. O Micro Pedido escuta esse evento.
 */
export default function Cardapio() {
  function adicionarAoPedido(prato) {
    window.dispatchEvent(new CustomEvent('pedido:adicionar', { detail: prato }));
  }

  return (
    <section className={styles.cardapio} aria-labelledby="titulo-cardapio">
      <h2 id="titulo-cardapio" className={styles.titulo}>
        Cardápio
      </h2>

      <ul className={styles.lista}>
        {pratos.map((prato) => (
          <li key={prato.id} className={styles.item}>
            <div>
              <p className={styles.nome}>{prato.nome}</p>
              <p className={styles.descricao}>{prato.descricao}</p>
              <span className={styles.preco}>R$ {prato.preco.toFixed(2).replace('.', ',')}</span>
            </div>
            <button
              type="button"
              className={styles.botao}
              onClick={() => adicionarAoPedido(prato)}
            >
              Adicionar ao pedido
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
