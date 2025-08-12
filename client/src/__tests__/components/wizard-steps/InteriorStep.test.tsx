import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import InteriorStep from '../../../components/wizard-steps/InteriorStep';

describe('InteriorStep', () => {
  const mockInteriors = [
    {
      _id: 'int1',
      name: 'Casual',
      totalPrice: 15000,
      upgrade: false,
      fixtures: [{ name: 'Standard fixtures', price: 1000 }],
      lvp: [{ name: 'Standard LVP flooring', price: 2000 }],
      carpet: [{ name: 'Standard carpet', price: 1500 }],
      countertop: [{ name: 'Laminate countertops', price: 1200 }],
      primaryCabinets: [{ name: 'Basic cabinets', price: 5000 }],
      backsplash: [{ name: 'Subway tile', price: 800 }],
      masterBathTile: [{ name: 'Ceramic tile', price: 1200 }]
    },
    {
      _id: 'int2',
      name: 'Designer',
      totalPrice: 28000,
      upgrade: true,
      fixtures: [
        { name: 'Designer fixtures', price: 2000 },
        { name: 'Pendant lighting', price: 1500 }
      ],
      countertop: [{ name: 'Granite countertops', price: 3500 }],
      primaryCabinets: [
        { name: 'Custom oak cabinets', price: 8000 },
        { name: 'Soft-close drawers', price: 1200 }
      ]
    },
    {
      _id: 'int3',
      name: 'Basic',
      totalPrice: 8000,
      upgrade: false
      // No features to test empty feature handling
    }
  ];

  const mockProps = {
    interiors: mockInteriors,
    selected: mockInteriors[0],
    onSelect: vi.fn()
  };

  it('renders interior package options', () => {
    render(<InteriorStep {...mockProps} />);

    expect(screen.getByText('Choose Your Interior Package')).toBeInTheDocument();
    expect(screen.getByText('Casual')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('displays pricing information', () => {
    render(<InteriorStep {...mockProps} />);

    expect(screen.getByText('+$15,000')).toBeInTheDocument();
    expect(screen.getByText('+$28,000')).toBeInTheDocument();
    expect(screen.getByText('+$8,000')).toBeInTheDocument();
  });

  it('shows package level badges', () => {
    render(<InteriorStep {...mockProps} />);

    // Standard packages
    const standardBadges = screen.getAllByText('🏠 Standard');
    expect(standardBadges).toHaveLength(2); // Casual and Basic

    // Premium package
    expect(screen.getByText('⭐ Premium')).toBeInTheDocument();
  });

  it('displays package features correctly', () => {
    render(<InteriorStep {...mockProps} />);

    // Casual package features
    expect(screen.getByText('1 Fixture')).toBeInTheDocument();
    expect(screen.getByText('Premium Countertops')).toBeInTheDocument();
    expect(screen.getByText('Custom Cabinets')).toBeInTheDocument();
    expect(screen.getByText('Designer Backsplash')).toBeInTheDocument();
    expect(screen.getByText('LVP Flooring')).toBeInTheDocument();
    expect(screen.getByText('Premium Carpet')).toBeInTheDocument();
    expect(screen.getByText('Bath Tile Upgrade')).toBeInTheDocument();

    // Designer package features (multiple fixtures)
    expect(screen.getByText('2 Fixtures')).toBeInTheDocument();
  });

  it('highlights selected interior package', () => {
    render(<InteriorStep {...mockProps} />);

    const cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('interior-option')
    );
    
    // First card (Casual) should be selected
    expect(cards[0]).toHaveClass('border-primary');
    expect(cards[0]).toHaveClass('selected');
  });

  it('calls onSelect when interior package is clicked', () => {
    const mockOnSelect = vi.fn();
    render(<InteriorStep {...mockProps} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Designer'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockInteriors[1]);
  });

  it('handles packages with no features', () => {
    render(<InteriorStep {...mockProps} />);

    // Basic package has no features, should still render
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('+$8,000')).toBeInTheDocument();
    
    // Should show "No additional features" or similar
    const basicCard = screen.getByText('Basic').closest('.card');
    expect(basicCard).toBeInTheDocument();
  });

  it('handles empty interiors array', () => {
    render(<InteriorStep {...mockProps} interiors={[]} />);

    expect(screen.getByText('Choose Your Interior Package')).toBeInTheDocument();
    // Should not crash
  });

  it('handles no selected interior', () => {
    const mockOnSelect = vi.fn();
    render(<InteriorStep {...mockProps} selected={null} onSelect={mockOnSelect} />);

    // No card should be highlighted
    const cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('interior-option')
    );
    
    cards.forEach(card => {
      expect(card).not.toHaveClass('border-primary');
      expect(card).not.toHaveClass('selected');
    });

    // Should still be clickable
    fireEvent.click(screen.getByText('Casual'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockInteriors[0]);
  });

  it('shows feature count with correct pluralization', () => {
    render(<InteriorStep {...mockProps} />);

    // Single fixture
    expect(screen.getByText('1 Fixture')).toBeInTheDocument();
    // Multiple fixtures  
    expect(screen.getByText('2 Fixtures')).toBeInTheDocument();
  });

  it('displays different package levels correctly', () => {
    render(<InteriorStep {...mockProps} />);

    // Standard packages should have secondary badge color
    const standardBadges = screen.getAllByText('🏠 Standard');
    standardBadges.forEach(badge => {
      expect(badge).toHaveClass('badge-secondary');
    });

    // Premium package should have warning badge color
    const premiumBadge = screen.getByText('⭐ Premium');
    expect(premiumBadge).toHaveClass('badge-warning');
  });

  it('applies hover effects and transitions', () => {
    render(<InteriorStep {...mockProps} />);

    const cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('interior-option')
    );

    cards.forEach(card => {
      expect(card).toHaveStyle('cursor: pointer');
      expect(card).toHaveStyle('transition: all 0.3s ease');
    });
  });

  it('shows detailed features breakdown', () => {
    render(<InteriorStep {...mockProps} />);

    // Check that various feature types are detected and displayed
    expect(screen.getByText('Premium Countertops')).toBeInTheDocument();
    expect(screen.getByText('Custom Cabinets')).toBeInTheDocument();
    expect(screen.getByText('Designer Backsplash')).toBeInTheDocument();
    expect(screen.getByText('LVP Flooring')).toBeInTheDocument();
    expect(screen.getByText('Premium Carpet')).toBeInTheDocument();
    expect(screen.getByText('Bath Tile Upgrade')).toBeInTheDocument();
  });

  it('handles packages with only some feature types', () => {
    const partialFeaturesInterior = {
      _id: 'int4',
      name: 'Minimal',
      totalPrice: 5000,
      fixtures: [{ name: 'Basic fixture', price: 500 }],
      // Only fixtures, no other features
    };

    render(<InteriorStep {...mockProps} interiors={[partialFeaturesInterior]} />);

    expect(screen.getByText('1 Fixture')).toBeInTheDocument();
    // Should not show other feature types
    expect(screen.queryByText('Premium Countertops')).not.toBeInTheDocument();
  });
});