import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/utils';
import ErrorBoundary from '../../components/ErrorBoundary';
import React from 'react';

// Test component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock console.error to avoid noise in test output
const originalError = console.error;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn(); // Suppress error logs during tests
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('😕 Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an unexpected error. Our team has been notified.')).toBeInTheDocument();
  });

  it('displays error details with expand/collapse', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    expect(showDetailsButton).toBeInTheDocument();

    // Click to expand details
    showDetailsButton.click();

    expect(screen.getByText('Hide Details')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
  });

  it('generates unique error IDs', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    const firstErrorId = screen.getByText(/Error ID:/).textContent?.split(': ')[1];

    // Reset and throw another error
    rerender(
      <ErrorBoundary>
        <div>No error</div>
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const secondShowDetailsButton = screen.getByText('Show Details');
    secondShowDetailsButton.click();

    const secondErrorId = screen.getByText(/Error ID:/).textContent?.split(': ')[1];

    expect(firstErrorId).not.toBe(secondErrorId);
  });

  it('provides refresh page functionality', () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByText('🔄 Refresh Page');
    refreshButton.click();

    expect(mockReload).toHaveBeenCalled();
  });

  it('provides go home functionality', () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('🏠 Go Home');
    homeButton.click();

    expect(window.location.href).toBe('/');

    // Restore original location
    window.location = originalLocation;
  });

  it('copies error details to clipboard', async () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    const copyButton = screen.getByText('📋 Copy Error Details');
    copyButton.click();

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    
    // Check that the copied text includes error information
    const copiedText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(copiedText).toContain('Error: Test error');
    expect(copiedText).toContain('Error ID:');
    expect(copiedText).toContain('Timestamp:');
  });

  it('shows copy success feedback', async () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    const copyButton = screen.getByText('📋 Copy Error Details');
    copyButton.click();

    // Should show success feedback
    expect(await screen.findByText('✅ Copied!')).toBeInTheDocument();
  });

  it('handles clipboard copy failure gracefully', async () => {
    // Mock clipboard to reject
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Clipboard failed'));

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    const copyButton = screen.getByText('📋 Copy Error Details');
    copyButton.click();

    // Should show failure feedback
    expect(await screen.findByText('❌ Copy failed')).toBeInTheDocument();
  });

  it('displays timestamp in error details', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    expect(screen.getByText(/Timestamp:/)).toBeInTheDocument();
  });

  it('captures error stack trace', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    expect(screen.getByText(/Stack trace:/)).toBeInTheDocument();
  });

  it('resets error state when children change to non-erroring component', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByText('😕 Oops! Something went wrong')).toBeInTheDocument();

    // Change to non-erroring component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should show the normal component
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('😕 Oops! Something went wrong')).not.toBeInTheDocument();
  });

  it('handles errors with different error messages', () => {
    const CustomError = () => {
      throw new Error('Custom error message');
    };

    render(
      <ErrorBoundary>
        <CustomError />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    expect(screen.getByText('Error: Custom error message')).toBeInTheDocument();
  });

  it('handles errors without stack traces', () => {
    const ErrorWithoutStack = () => {
      const error = new Error('No stack error');
      error.stack = undefined;
      throw error;
    };

    render(
      <ErrorBoundary>
        <ErrorWithoutStack />
      </ErrorBoundary>
    );

    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    expect(screen.getByText('Error: No stack error')).toBeInTheDocument();
    expect(screen.getByText('Stack trace: Not available')).toBeInTheDocument();
  });

  it('collapses details when hide button is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Expand details
    const showDetailsButton = screen.getByText('Show Details');
    showDetailsButton.click();

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();

    // Collapse details
    const hideDetailsButton = screen.getByText('Hide Details');
    hideDetailsButton.click();

    expect(screen.queryByText('Error: Test error')).not.toBeInTheDocument();
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });
});