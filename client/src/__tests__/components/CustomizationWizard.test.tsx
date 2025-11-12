import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '../../test/utils';
import { render } from '../../test/utils';
import CustomizationWizard from '../../components/CustomizationWizard';
import { SAVE_USER_HOME, SAVE_USER_HOME_PROGRESS } from '../../graphQl/mutations';
import * as AuthService from '../../utils/auth';

// Mock AuthService
vi.mock('../../utils/auth', () => ({
  default: {
    loggedIn: vi.fn(() => true),
    getProfile: vi.fn(() => ({ _id: 'user1', username: 'testuser' })),
    getRole: vi.fn(() => 'user'),
    getToken: vi.fn(() => 'mock-token'),
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('CustomizationWizard', () => {
  const mockPlan = {
    _id: 'plan1',
    name: 'Test Plan',
    basePrice: 300000,
    elevations: [
      { _id: 'elev1', name: 'Farmhouse', price: 0, classification: 'elevation' },
      { _id: 'elev2', name: 'Prairie', price: 2500, classification: 'elevation' }
    ],
    interiors: [
      { _id: 'int1', name: 'Casual', totalPrice: 15000 }
    ],
    structural: [
      { _id: 'struct1', name: 'Covered Patio', price: 3500, classification: 'structural' }
    ],
    additional: [
      { _id: 'add1', name: 'Air-conditioning', price: 4500, classification: 'additional' }
    ],
    kitchenAppliance: [
      { _id: 'kitchen1', name: 'Appliance Package 0', price: 0, classification: 'kitchen-appliance' }
    ],
    laundryAppliance: [
      { _id: 'laundry1', name: 'Laundry Appliance A', price: 0, classification: 'laundry-appliance' }
    ]
  };

  const mockOptions = [
    { _id: 'opt1', name: 'Option 1', price: 1000, classification: 'structural' },
    { _id: 'opt2', name: 'Option 2', price: 2000, classification: 'additional' }
  ];

  const mockInteriorPackages = [
    { _id: 'int1', name: 'Casual', totalPrice: 15000 }
  ];

  const mockLotPremiums = [
    { _id: 'lot1', filing: 1, lot: 101, price: 5000 }
  ];

  const mockMutationResults = [
    {
      request: {
        query: SAVE_USER_HOME_PROGRESS,
      },
      result: {
        data: {
          saveUserHomeProgress: {
            _id: 'home1',
            planTypeId: 'plan1',
            planTypeName: 'Test Plan',
            basePrice: 300000,
            totalPrice: 315000,
            isComplete: false,
            lastModified: new Date().toISOString()
          }
        }
      }
    },
    {
      request: {
        query: SAVE_USER_HOME,
      },
      result: {
        data: {
          saveUserHome: {
            _id: 'home1',
            planTypeId: 'plan1',
            planTypeName: 'Test Plan',
            basePrice: 300000,
            totalPrice: 315000,
            isComplete: true
          }
        }
      }
    }
  ];

  const defaultProps = {
    plan: mockPlan,
    options: mockOptions,
    interiorPackages: mockInteriorPackages,
    lotPremiums: mockLotPremiums
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wizard with initial step', () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Check if first step (Exterior) is active
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
    expect(screen.getByText('🏠 Exterior')).toBeInTheDocument();
    expect(screen.getByText('Choose your elevation style')).toBeInTheDocument();
  });

  it('displays progress bar correctly', () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    // First step should show ~14% progress (1/7 * 100)
    expect(progressBar).toHaveAttribute('aria-valuenow', '14');
  });

  it('shows step indicators with completion status', () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Should show 7 step indicators
    const stepIndicators = screen.getAllByRole('button').filter(
      button => button.textContent?.match(/^\d+$/)
    );
    expect(stepIndicators).toHaveLength(7);

    // First step should be active
    expect(stepIndicators[0]).toHaveClass('btn-primary');
    // Other steps should be inactive
    expect(stepIndicators[1]).toHaveClass('btn-outline-secondary');
  });

  it('navigates to next step when Next button clicked', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    const nextButton = screen.getByText('Next: Interior');
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
      expect(screen.getByText('🎨 Interior')).toBeInTheDocument();
    });
  });

  it('navigates to previous step when Back button clicked', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Navigate to step 2 first
    fireEvent.click(screen.getByText('Next: Interior'));

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
    });

    // Now click back
    const backButton = screen.getByText('← Back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
      expect(screen.getByText('🏠 Exterior')).toBeInTheDocument();
    });
  });

  it('calculates total price correctly with default selections', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    await waitFor(() => {
      // Base price (300000) + default interior (15000) + default elevation (0) + default appliances (0 each)
      expect(screen.getByText('$315,000')).toBeInTheDocument();
    });
  });

  it('shows save progress functionality for authenticated users', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    await waitFor(() => {
      // Should show auto-save indicator
      expect(screen.getByText(/Auto-saving/)).toBeInTheDocument();
    });
  });

  it('disables save functionality for unauthenticated users', () => {
    // Mock unauthenticated state
    vi.mocked(AuthService.default.loggedIn).mockReturnValue(false);

    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Should not show auto-save for unauthenticated users
    expect(screen.queryByText(/Auto-saving/)).not.toBeInTheDocument();
  });

  it('completes wizard flow and shows final step', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Navigate through all steps
    const steps = [
      'Next: Interior',
      'Next: Structure',
      'Next: Features',
      'Next: Appliances',
      'Next: Lot Selection',
      'Review & Save'
    ];

    for (let i = 0; i < steps.length; i++) {
      const button = screen.getByText(steps[i]);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(`Step ${i + 2} of 7`)).toBeInTheDocument();
      });
    }

    // Should be on final step
    expect(screen.getByText('💰 Review & Save')).toBeInTheDocument();
    expect(screen.getByText('Final pricing')).toBeInTheDocument();
  });

  it('handles step navigation via step indicators', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Click on step 3 indicator
    const stepIndicators = screen.getAllByRole('button').filter(
      button => button.textContent?.match(/^\d+$/)
    );

    fireEvent.click(stepIndicators[2]); // Step 3

    await waitFor(() => {
      expect(screen.getByText('Step 3 of 7')).toBeInTheDocument();
      expect(screen.getByText('🏗️ Structure')).toBeInTheDocument();
    });
  });

  it('prevents navigation to incomplete steps', () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Try to click on a future step (should be disabled or no-op)
    const stepIndicators = screen.getAllByRole('button').filter(
      button => button.textContent?.match(/^\d+$/)
    );

    // Future steps should be visually disabled
    expect(stepIndicators[6]).toHaveClass('btn-outline-secondary');
  });

  it('shows completion status for visited steps', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Navigate to step 2
    fireEvent.click(screen.getByText('Next: Interior'));

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
    });

    // Step 1 should now show as completed
    const stepIndicators = screen.getAllByRole('button').filter(
      button => button.textContent?.match(/^\d+$/)
    );

    expect(stepIndicators[0]).toHaveClass('btn-success'); // Completed step
    expect(stepIndicators[1]).toHaveClass('btn-primary'); // Current step
  });

  it('handles customization state updates', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // The component should set default values from the plan
    await waitFor(() => {
      // Check if default elevation is selected (should affect pricing)
      expect(screen.getByText('$315,000')).toBeInTheDocument();
    });
  });

  it('displays step icons and descriptions', () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Check step header displays
    expect(screen.getByText('🏠 Exterior')).toBeInTheDocument();
    expect(screen.getByText('Choose your elevation style')).toBeInTheDocument();
  });

  it('shows wizard completion state', async () => {
    render(<CustomizationWizard {...defaultProps} />, {
      mocks: mockMutationResults
    });

    // Navigate to final step
    const steps = [
      'Next: Interior',
      'Next: Structure',
      'Next: Features',
      'Next: Appliances',
      'Next: Lot Selection',
      'Review & Save'
    ];

    for (const step of steps) {
      fireEvent.click(screen.getByText(step));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await waitFor(() => {
      expect(screen.getByText('💰 Review & Save')).toBeInTheDocument();
      // Progress should be 100%
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });
  });
});