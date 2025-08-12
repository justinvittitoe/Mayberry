import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import ElevationStep from '../../../components/wizard-steps/ElevationStep';

describe('ElevationStep', () => {
  const mockElevations = [
    {
      _id: 'elev1',
      name: 'Farmhouse',
      price: 0,
      classification: 'elevation',
      description: 'Classic farmhouse style',
      img: 'farmhouse.jpg'
    },
    {
      _id: 'elev2',
      name: 'Prairie',
      price: 2500,
      classification: 'elevation',
      description: 'Prairie style exterior',
      img: 'prairie.jpg'
    },
    {
      _id: 'elev3',
      name: 'Modern',
      price: 3000,
      classification: 'elevation',
      description: 'Contemporary modern design'
      // No img property to test missing image handling
    }
  ];

  const mockProps = {
    elevations: mockElevations,
    selected: mockElevations[0],
    onSelect: vi.fn(),
    colorScheme: 1,
    onColorSchemeChange: vi.fn(),
    availableColorSchemes: [1, 2, 5, 7]
  };

  it('renders elevation options', () => {
    render(<ElevationStep {...mockProps} />);

    expect(screen.getByText('Choose Your Exterior Style')).toBeInTheDocument();
    expect(screen.getByText('Farmhouse')).toBeInTheDocument();
    expect(screen.getByText('Prairie')).toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
  });

  it('displays elevation descriptions', () => {
    render(<ElevationStep {...mockProps} />);

    expect(screen.getByText('Classic farmhouse style')).toBeInTheDocument();
    expect(screen.getByText('Prairie style exterior')).toBeInTheDocument();
    expect(screen.getByText('Contemporary modern design')).toBeInTheDocument();
  });

  it('shows pricing information', () => {
    render(<ElevationStep {...mockProps} />);

    expect(screen.getByText('Included')).toBeInTheDocument(); // For $0 price
    expect(screen.getByText('+$2,500')).toBeInTheDocument();
    expect(screen.getByText('+$3,000')).toBeInTheDocument();
  });

  it('highlights selected elevation', () => {
    render(<ElevationStep {...mockProps} />);

    // First elevation should be selected (border-primary class)
    const cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('elevation-option')
    );
    
    expect(cards[0]).toHaveClass('border-primary');
    expect(cards[0]).toHaveClass('selected');
  });

  it('calls onSelect when elevation is clicked', () => {
    const mockOnSelect = vi.fn();
    render(<ElevationStep {...mockProps} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Prairie'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockElevations[1]);
  });

  it('renders color scheme section', () => {
    render(<ElevationStep {...mockProps} />);

    expect(screen.getByText('Select Color Scheme')).toBeInTheDocument();
    expect(screen.getByText('Classic White')).toBeInTheDocument();
    expect(screen.getByText('Warm Beige')).toBeInTheDocument();
    expect(screen.getByText('Natural Stone')).toBeInTheDocument();
    expect(screen.getByText('Modern Gray')).toBeInTheDocument();
  });

  it('filters color schemes by available options', () => {
    render(<ElevationStep {...mockProps} />);

    // Should show available color schemes (1, 2, 5, 7)
    expect(screen.getByText('Classic White')).toBeInTheDocument();
    expect(screen.getByText('Warm Beige')).toBeInTheDocument();
    expect(screen.getByText('Natural Stone')).toBeInTheDocument();
    expect(screen.getByText('Modern Gray')).toBeInTheDocument();

    // Should not show unavailable color schemes
    expect(screen.queryByText('Charcoal')).not.toBeInTheDocument();
    expect(screen.queryByText('Sage Green')).not.toBeInTheDocument();
  });

  it('shows selected color scheme', () => {
    render(<ElevationStep {...mockProps} colorScheme={2} />);

    const colorOptions = screen.getAllByRole('radio');
    const warmBeigeOption = colorOptions.find(option => 
      (option as HTMLInputElement).value === '2'
    );
    
    expect(warmBeigeOption).toBeChecked();
  });

  it('calls onColorSchemeChange when color is selected', () => {
    const mockOnColorSchemeChange = vi.fn();
    render(<ElevationStep {...mockProps} onColorSchemeChange={mockOnColorSchemeChange} />);

    const warmBeigeOption = screen.getByRole('radio', { name: /warm beige/i });
    fireEvent.click(warmBeigeOption);
    
    expect(mockOnColorSchemeChange).toHaveBeenCalledWith(2);
  });

  it('handles elevations without images', () => {
    render(<ElevationStep {...mockProps} />);

    // Modern elevation doesn't have an img property, should still render
    expect(screen.getByText('Modern')).toBeInTheDocument();
    expect(screen.getByText('Contemporary modern design')).toBeInTheDocument();
  });

  it('displays color preview swatches', () => {
    render(<ElevationStep {...mockProps} />);

    const colorSwatches = screen.getAllByTitle(/color preview/i);
    expect(colorSwatches.length).toBeGreaterThan(0);

    // Check if color swatches have background colors
    colorSwatches.forEach(swatch => {
      expect(swatch).toHaveStyle('background-color');
    });
  });

  it('handles empty elevations array', () => {
    render(<ElevationStep {...mockProps} elevations={[]} />);

    expect(screen.getByText('Choose Your Exterior Style')).toBeInTheDocument();
    // Should not crash and should show color scheme section
    expect(screen.getByText('Select Color Scheme')).toBeInTheDocument();
  });

  it('handles empty available color schemes', () => {
    render(<ElevationStep {...mockProps} availableColorSchemes={[]} />);

    expect(screen.getByText('Choose Your Exterior Style')).toBeInTheDocument();
    expect(screen.getByText('Select Color Scheme')).toBeInTheDocument();
    
    // Should not show any color options
    expect(screen.queryByText('Classic White')).not.toBeInTheDocument();
  });

  it('handles selection with no previously selected elevation', () => {
    const mockOnSelect = vi.fn();
    render(<ElevationStep {...mockProps} selected={null} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Farmhouse'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockElevations[0]);
  });

  it('applies hover effects and transitions', () => {
    render(<ElevationStep {...mockProps} />);

    const cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('elevation-option')
    );

    cards.forEach(card => {
      expect(card).toHaveStyle('cursor: pointer');
      expect(card).toHaveStyle('transition: all 0.3s ease');
    });
  });

  it('shows correct elevation selection state for different selection methods', () => {
    // Test selection by _id
    const { rerender } = render(<ElevationStep {...mockProps} selected={mockElevations[1]} />);
    
    let cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('elevation-option')
    );
    expect(cards[1]).toHaveClass('border-primary');

    // Test selection by name (for elevations without _id)
    const elevationWithoutId = { name: 'Farmhouse', price: 0 };
    rerender(<ElevationStep {...mockProps} selected={elevationWithoutId} />);
    
    cards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('elevation-option')
    );
    expect(cards[0]).toHaveClass('border-primary');
  });
});