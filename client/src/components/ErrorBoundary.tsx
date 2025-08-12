import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    eventId: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Generate a unique error ID for support reference
    const eventId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      errorInfo,
      eventId
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo, tags: { eventId } });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoBack = () => {
    window.history.back();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorReport = {
      eventId: this.state.eventId,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // Copy error details to clipboard for user to share
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Error details copied to clipboard'))
      .catch(() => alert('Please manually copy the error ID: ' + this.state.eventId));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-danger shadow">
                <Card.Header className="bg-danger text-white">
                  <div className="d-flex align-items-center">
                    <span className="me-2" style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <h5 className="mb-0">Application Error</h5>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Alert variant="danger" className="mb-4">
                    <Alert.Heading>Something went wrong</Alert.Heading>
                    <p className="mb-2">
                      We encountered an unexpected error. Our team has been notified and is working on a fix.
                    </p>
                    {this.state.eventId && (
                      <p className="mb-0">
                        <strong>Error ID:</strong> <code>{this.state.eventId}</code>
                      </p>
                    )}
                  </Alert>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    <Button 
                      variant="primary" 
                      onClick={this.handleReload}
                      className="d-flex align-items-center"
                    >
                      <span className="me-1">🔄</span> Reload Page
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={this.handleGoBack}
                      className="d-flex align-items-center"
                    >
                      <span className="me-1">←</span> Go Back
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={this.handleGoHome}
                      className="d-flex align-items-center"
                    >
                      <span className="me-1">🏠</span> Home
                    </Button>
                    <Button 
                      variant="outline-info" 
                      onClick={this.handleReportError}
                      className="d-flex align-items-center"
                    >
                      <span className="me-1">📋</span> Copy Error Details
                    </Button>
                  </div>

                  <div className="text-muted small">
                    <p className="mb-1">
                      <strong>What you can do:</strong>
                    </p>
                    <ul className="mb-0">
                      <li>Try refreshing the page</li>
                      <li>Go back to the previous page and try again</li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Contact support with the Error ID above</li>
                    </ul>
                  </div>

                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4">
                      <summary className="text-muted mb-2" style={{ cursor: 'pointer' }}>
                        <strong>Developer Details (Development Mode Only)</strong>
                      </summary>
                      <div className="bg-light p-3 rounded mt-2">
                        <h6 className="text-danger">Error Message:</h6>
                        <pre className="small text-danger mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                          {this.state.error?.toString()}
                        </pre>
                        
                        <h6 className="text-danger">Stack Trace:</h6>
                        <pre className="small text-muted mb-3" style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                          {this.state.error?.stack}
                        </pre>
                        
                        {this.state.errorInfo && (
                          <>
                            <h6 className="text-danger">Component Stack:</h6>
                            <pre className="small text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </>
                        )}
                      </div>
                    </details>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;