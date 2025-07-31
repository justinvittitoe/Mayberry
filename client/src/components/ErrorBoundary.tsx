import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <Alert variant="danger">
              <h4>Something went wrong</h4>
              <p>An unexpected error occurred. Please try refreshing the page.</p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-3">
                  <summary>Error Details (Development)</summary>
                  <pre className="text-start mt-2">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </Alert>
            <Button variant="primary" onClick={this.handleReload}>
              Refresh Page
            </Button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;