import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import LoadingSpinner, { 
  SkeletonLoader, 
  CardSkeleton, 
  PlanCardSkeleton,
  ErrorState,
  EmptyState
} from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders basic loading spinner', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Loading plans..." />);
    
    expect(screen.getByText('Loading plans...')).toBeInTheDocument();
  });

  it('renders full page spinner', () => {
    const { container } = render(<LoadingSpinner fullPage />);
    
    const spinnerContainer = container.querySelector('.d-flex.align-items-center.justify-content-center');
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveStyle({ minHeight: '50vh' });
  });

  it('renders inline spinner', () => {
    const { container } = render(<LoadingSpinner inline />);
    
    // Should be wrapped in a span for inline display
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender, container } = render(<LoadingSpinner variant="success" />);
    
    let spinner = container.querySelector('.text-success');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner variant="danger" />);
    spinner = container.querySelector('.text-danger');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(<LoadingSpinner size="sm" />);
    
    let spinner = container.querySelector('.spinner-border-sm');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    spinner = container.querySelector('.spinner-border-lg');
    expect(spinner).toBeInTheDocument();
  });
});

describe('SkeletonLoader', () => {
  it('renders default skeleton lines', () => {
    const { container } = render(<SkeletonLoader />);
    
    // Default is 3 lines
    const placeholders = container.querySelectorAll('.placeholder');
    expect(placeholders).toHaveLength(3);
  });

  it('renders custom number of lines', () => {
    const { container } = render(<SkeletonLoader lines={5} />);
    
    const placeholders = container.querySelectorAll('.placeholder');
    expect(placeholders).toHaveLength(5);
  });

  it('applies custom height', () => {
    const { container } = render(<SkeletonLoader height={30} />);
    
    const firstPlaceholder = container.querySelector('.placeholder');
    expect(firstPlaceholder).toHaveStyle({ height: '30px' });
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonLoader className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders skeleton placeholders', () => {
    const { container } = render(<SkeletonLoader lines={3} />);
    
    // Should have placeholders
    const placeholders = container.querySelectorAll('.placeholder');
    expect(placeholders.length).toBeGreaterThan(0);
  });
});

describe('CardSkeleton', () => {
  it('renders default number of cards', () => {
    const { container } = render(<CardSkeleton />);
    
    // Default is 3 cards
    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(3);
  });

  it('renders custom number of cards', () => {
    const { container } = render(<CardSkeleton cards={5} />);
    
    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(5);
  });

  it('shows image placeholders by default', () => {
    const { container } = render(<CardSkeleton cards={1} />);
    
    const imagePlaceholder = container.querySelector('.placeholder[style*="height: 200px"]');
    expect(imagePlaceholder).toBeInTheDocument();
  });

  it('hides image placeholders when showImage is false', () => {
    const { container } = render(<CardSkeleton cards={1} showImage={false} />);
    
    const imagePlaceholder = container.querySelector('.placeholder[style*="height: 200px"]');
    expect(imagePlaceholder).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardSkeleton className="custom-cards" />);
    
    expect(container.firstChild).toHaveClass('custom-cards');
  });
});

describe('PlanCardSkeleton', () => {
  it('renders default number of plan cards', () => {
    const { container } = render(<PlanCardSkeleton />);
    
    // Default is 6 cards
    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(6);
  });

  it('renders custom number of plan cards', () => {
    const { container } = render(<PlanCardSkeleton count={3} />);
    
    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(3);
  });

  it('includes spec skeleton items', () => {
    const { container } = render(<PlanCardSkeleton count={1} />);
    
    // Should have 4 spec items (bedrooms, bathrooms, sq ft, garage) plus 1 lg-4 col
    const specItems = container.querySelectorAll('[class*="col-"]');
    expect(specItems.length).toBeGreaterThanOrEqual(4);
  });

  it('includes image placeholder', () => {
    const { container } = render(<PlanCardSkeleton count={1} />);
    
    const imagePlaceholder = container.querySelector('.placeholder[style*="height: 200px"]');
    expect(imagePlaceholder).toBeInTheDocument();
  });

  it('includes button placeholder', () => {
    const { container } = render(<PlanCardSkeleton count={1} />);
    
    const buttonPlaceholder = container.querySelector('.btn');
    expect(buttonPlaceholder).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders default error message', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an issue loading this content. Please try again.')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(<ErrorState message="Custom error occurred" />);
    
    expect(screen.getByText('Custom error occurred')).toBeInTheDocument();
  });

  it('shows retry button when onRetry provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorState onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('🔄 Try Again');
    expect(retryButton).toBeInTheDocument();
    
    retryButton.click();
    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it('hides retry button when onRetry not provided', () => {
    render(<ErrorState />);
    
    expect(screen.queryByText('🔄 Try Again')).not.toBeInTheDocument();
  });

  it('shows home button by default', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('🏠 Go Home')).toBeInTheDocument();
  });

  it('hides home button when showHomeButton is false', () => {
    render(<ErrorState showHomeButton={false} />);
    
    expect(screen.queryByText('🏠 Go Home')).not.toBeInTheDocument();
  });

  it('navigates home when home button clicked', () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    render(<ErrorState />);
    
    const homeButton = screen.getByText('🏠 Go Home');
    homeButton.click();
    
    expect(window.location.href).toBe('/');

    // Restore original location
    window.location = originalLocation;
  });

  it('displays error emoji', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('😕')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders default empty state', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText("There's nothing to show here yet.")).toBeInTheDocument();
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<EmptyState title="No plans found" message="Try adjusting your filters." />);
    
    expect(screen.getByText('No plans found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<EmptyState icon="🏠" />);
    
    expect(screen.getByText('🏠')).toBeInTheDocument();
  });

  it('shows action button when provided', () => {
    const mockAction = vi.fn();
    const actionButton = {
      text: 'Add New Item',
      onClick: mockAction,
      variant: 'success'
    };

    render(<EmptyState actionButton={actionButton} />);
    
    const button = screen.getByText('Add New Item');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-success');
    
    button.click();
    expect(mockAction).toHaveBeenCalledOnce();
  });

  it('uses default button variant when not specified', () => {
    const actionButton = {
      text: 'Default Button',
      onClick: vi.fn()
    };

    render(<EmptyState actionButton={actionButton} />);
    
    const button = screen.getByText('Default Button');
    expect(button).toHaveClass('btn-primary');
  });

  it('hides action button when not provided', () => {
    render(<EmptyState />);
    
    // Should not have any buttons
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });
});