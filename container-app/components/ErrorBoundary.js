import React from 'react';
import styles from '../styles/Home.module.css';

/**
 * Isola falhas de um micro: se o remote estiver fora do ar, só o bloco
 * correspondente mostra mensagem de erro, sem derrubar a página inteira.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: false };
  }

  static getDerivedStateFromError() {
    return { erro: true };
  }

  render() {
    if (this.state.erro) {
      return (
        <div className={styles.falha} role="alert">
          Não foi possível carregar o {this.props.nome}. Verifique se o micro está rodando e tente novamente.
        </div>
      );
    }
    return this.props.children;
  }
}
