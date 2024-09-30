import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você pode registrar o erro ou realizar outras ações aqui
    console.error('Erro capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode personalizar a mensagem de erro a ser exibida
      return <h1>Algo deu errado. Por favor, recarregue a página.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
