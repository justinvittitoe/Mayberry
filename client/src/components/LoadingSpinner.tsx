import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'lg';
  fullPage?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size,
  fullPage = false,
  className = ''
}) => {
  const content = (
    <div className={`text-center py-4 ${className}`}>
      <Spinner 
        animation="border" 
        size={size}
        variant="primary"
        className="mb-3"
      />
      <p className="text-muted mb-0">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        {content}
      </Container>
    );
  }

  return content;
};

export default LoadingSpinner;