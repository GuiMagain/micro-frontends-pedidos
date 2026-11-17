import React from 'react';
import styles from './Pedido.module.css';

const formatarPreco = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

/**
 * Micro Pedido.
 * Escuta o evento global 'pedido:adicionar' disparado pelo Micro Cardápio
 * e mantém a lista de itens do pedido.
 *
 * Implementado como componente de classe para funcionar com a React
 * do próprio container, sem depender de hooks compartilhados.
 */
export default class Pedido extends React.Component {
  constructor(props) {
    super(props);
    this.state = { itens: [] };
    this.aoAdicionar = this.aoAdicionar.bind(this);
  }

  componentDidMount() {
    window.addEventListener('pedido:adicionar', this.aoAdicionar);
  }

  componentWillUnmount() {
    // Remove o listener ao desmontar, evitando vazamento de memória.
    window.removeEventListener('pedido:adicionar', this.aoAdicionar);
  }

  aoAdicionar(evento) {
    const prato = evento.detail;

    this.setState((estado) => {
      const existente = estado.itens.find((item) => item.id === prato.id);

      if (existente) {
        return {
          itens: estado.itens.map((item) =>
            item.id === prato.id ? { ...item, quantidade: item.quantidade + 1 } : item
          ),
        };
      }

      return { itens: [...estado.itens, { ...prato, quantidade: 1 }] };
    });
  }

  render() {
    const { itens } = this.state;
    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    return (
      <section className={styles.pedido} aria-labelledby="titulo-pedido">
        <h2 id="titulo-pedido" className={styles.titulo}>
          Seu pedido
        </h2>

        {itens.length === 0 ? (
          <p className={styles.vazio}>Nenhum item ainda. Escolha pratos no cardápio para começar.</p>
        ) : (
          <>
            <ul className={styles.lista}>
              {itens.map((item) => (
                <li key={item.id} className={styles.item}>
                  <span>
                    <span className={styles.quantidade}>{item.quantidade}×</span> {item.nome}
                  </span>
                  <span>{formatarPreco(item.preco * item.quantidade)}</span>
                </li>
              ))}
            </ul>

            <div className={styles.rodape}>
              <span className={styles.totalRotulo}>Total</span>
              <span className={styles.total}>{formatarPreco(total)}</span>
            </div>
          </>
        )}
      </section>
    );
  }
}
