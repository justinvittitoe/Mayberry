import React from 'react';
import { Spinner, Container, Row, Col, Card, Placeholder } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
  size?: 'sm' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  inline?: boolean;
}

interface SkeletonLoaderProps {
  lines?: number;
  height?: number;
  className?: string;
}

interface CardSkeletonProps {
  cards?: number;
  showImage?: boolean;
  className?: string;
}

// Main Loading Spinner Component
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  fullPage = false,
  size,
  variant = 'primary',
  inline = false
}) => {
  const spinner = (
    <div className={`d-flex align-items-center ${inline ? '' : 'justify-content-center'}`}>
      <Spinner
        animation="border"
        variant={variant}
        size={size}
        className="me-2"
        role="status"
        aria-hidden="true"
      />
      <span className="visually-hidden">Loading...</span>
      {message && <span className={inline ? 'ms-2' : ''}>{message}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center" 
                 style={{ minHeight: '50vh' }}>
        <div className="text-center">
          {spinner}
        </div>
      </Container>
    );
  }

  if (inline) {
    return <span>{spinner}</span>;
  }

  return (
    <div className="text-center py-4">
      {spinner}
    </div>
  );
};

// Skeleton Loader for Text Content
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  height = 20,
  className = ''
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Placeholder key={index} animation="glow" className="mb-2">
          <Placeholder 
            xs={index === lines - 1 ? 7 : 12} 
            style={{ height: `${height}px` }}
          />
        </Placeholder>
      ))}
    </div>
  );
};

// Card Skeleton for Grid Layouts
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  cards = 3,
  showImage = true,
  className = ''
}) => {
  return (
    <Row className={className}>
      {Array.from({ length: cards }).map((_, index) => (
        <Col key={index} lg={4} md={6} className="mb-4">
          <Card>
            {showImage && (
              <Placeholder animation="glow">
                <Placeholder xs={12} style={{ height: '200px' }} />
              </Placeholder>
            )}
            <Card.Body>
              <Placeholder animation="glow">
                <Placeholder xs={8} className="mb-2" />
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={6} className="mb-3" />
                <Placeholder.Button xs={4} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Plan Card Skeleton (specific to our app)
export const PlanCardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <Row>
      {Array.from({ length: count }).map((_, index) => (
        <Col key={index} lg={4} md={6} className="mb-4">
          <Card className="h-100">
            <Placeholder animation="glow">
              <Placeholder xs={12} style={{ height: '200px' }} />
            </Placeholder>
            <Card.Body>
              <Placeholder animation="glow">
                <Placeholder xs={8} className="mb-2" style={{ height: '24px' }} />
                
                {/* Specs skeleton */}
                <Row className="g-2 mb-3">
                  {[...Array(4)].map((_, i) => (
                    <Col key={i} xs={6}>
                      <div className="d-flex align-items-center">
                        <Placeholder xs={3} className="me-2" style={{ height: '20px' }} />
                        <Placeholder xs={6} style={{ height: '16px' }} />
                      </div>
                    </Col>
                  ))}
                </Row>

                <Placeholder xs={12} className="mb-3" style={{ height: '40px' }} />
                
                <div className="d-flex justify-content-between align-items-end">
                  <Placeholder xs={6} style={{ height: '28px' }} />
                  <Placeholder.Button xs={3} />
                </div>
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Error State Component
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  onRetry,
  showHomeButton = true
}) => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6} className="text-center">
          <div style={{ fontSize: '4rem' }} className="mb-3">😕</div>
          <h4 className="mb-3">{message}</h4>
          <p className="text-muted mb-4">
            We encountered an issue loading this content. Please try again.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            {onRetry && (
              <button className="btn btn-primary" onClick={onRetry}>
                🔄 Try Again
              </button>
            )}
            {showHomeButton && (
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => window.location.href = '/'}
              >
                🏠 Go Home
              </button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// Empty State Component
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: string;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items found",
  message = "There's nothing to show here yet.",
  icon = "📭",
  actionButton
}) => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6} className="text-center">
          <div style={{ fontSize: '4rem' }} className="mb-3">{icon}</div>
          <h4 className="mb-3">{title}</h4>
          <p className="text-muted mb-4">{message}</p>
          {actionButton && (
            <button 
              className={`btn btn-${actionButton.variant || 'primary'}`}
              onClick={actionButton.onClick}
            >
              {actionButton.text}
            </button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;