import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/utils';
import LotSelectionStep from '../../../components/wizard-steps/LotSelectionStep';

describe('LotSelectionStep', () => {
  const mockLotPremiums = [
    {
      _id: 'lot1',
      filing: 1,
      lot: 101,
      width: 60,
      length: 120,
      price: 5000,
      premiumType: 'Corner Lot'
    },
    {
      _id: 'lot2',
      filing: 1,
      lot: 102,
      width: 65,
      length: 110,
      price: 8000,
      premiumType: 'Cul-de-sac'
    },
    {
      _id: 'lot3',
      filing: 2,
      lot: 201,
      width: 70,
      length: 130,
      price: 15000,
      premiumType: 'Oversized'
    },
    {
      _id: 'lot4',
      filing: 2,
      lot: 202,
      width: 55,
      length: 100,
      price: 30000,
      premiumType: 'Waterfront'
    }
  ];

  const mockSelectedPlan = {
    _id: 'plan1',
    name: 'Test Plan',
    basePrice: 300000
  };

  const mockProps = {
    lotPremiums: mockLotPremiums,
    selectedPlan: mockSelectedPlan,
    selected: mockLotPremiums[0],
    onSelect: vi.fn()
  };

  it('renders lot selection interface', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByText('Choose Your Lot')).toBeInTheDocument();
    expect(screen.getByText('Select the perfect lot for your new home')).toBeInTheDocument();
  });

  it('displays filtering controls', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByLabelText(/filter by filing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
  });

  it('shows filing options in filter dropdown', () => {
    render(<LotSelectionStep {...mockProps} />);

    const filingFilter = screen.getByLabelText(/filter by filing/i);
    
    // Should have options for each unique filing plus "All Filings"
    expect(filingFilter.children).toHaveLength(3); // All + Filing 1 + Filing 2
  });

  it('displays lot cards with information', () => {
    render(<LotSelectionStep {...mockProps} />);

    // Check for lot numbers
    expect(screen.getByText('Lot 101')).toBeInTheDocument();
    expect(screen.getByText('Lot 102')).toBeInTheDocument();
    expect(screen.getByText('Lot 201')).toBeInTheDocument();
    expect(screen.getByText('Lot 202')).toBeInTheDocument();

    // Check for filing information
    expect(screen.getAllByText(/Filing 1/)).toHaveLength(2);
    expect(screen.getAllByText(/Filing 2/)).toHaveLength(2);
  });

  it('shows lot pricing correctly', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByText('+$5,000')).toBeInTheDocument();
    expect(screen.getByText('+$8,000')).toBeInTheDocument();
    expect(screen.getByText('+$15,000')).toBeInTheDocument();
    expect(screen.getByText('+$30,000')).toBeInTheDocument();
  });

  it('displays lot dimensions', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByText('60\' × 120\'')).toBeInTheDocument();
    expect(screen.getByText('65\' × 110\'')).toBeInTheDocument();
    expect(screen.getByText('70\' × 130\'')).toBeInTheDocument();
    expect(screen.getByText('55\' × 100\'')).toBeInTheDocument();
  });

  it('shows premium type badges', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByText('Corner Lot')).toBeInTheDocument();
    expect(screen.getByText('Cul-de-sac')).toBeInTheDocument();
    expect(screen.getByText('Oversized')).toBeInTheDocument();
    expect(screen.getByText('Waterfront')).toBeInTheDocument();
  });

  it('highlights selected lot', () => {
    render(<LotSelectionStep {...mockProps} />);

    // First lot should be selected
    const lotCards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('lot-option')
    );
    
    expect(lotCards[0]).toHaveClass('border-primary');
    expect(lotCards[0]).toHaveClass('selected');
  });

  it('calls onSelect when lot is clicked', () => {
    const mockOnSelect = vi.fn();
    render(<LotSelectionStep {...mockProps} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Lot 102'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockLotPremiums[1]);
  });

  it('filters lots by filing', async () => {
    render(<LotSelectionStep {...mockProps} />);

    const filingFilter = screen.getByLabelText(/filter by filing/i);
    fireEvent.change(filingFilter, { target: { value: '1' } });

    await waitFor(() => {
      // Should only show Filing 1 lots
      expect(screen.getByText('Lot 101')).toBeInTheDocument();
      expect(screen.getByText('Lot 102')).toBeInTheDocument();
      expect(screen.queryByText('Lot 201')).not.toBeInTheDocument();
      expect(screen.queryByText('Lot 202')).not.toBeInTheDocument();
    });
  });

  it('filters lots by price range', async () => {
    render(<LotSelectionStep {...mockProps} />);

    const priceFilter = screen.getByLabelText(/price range/i);
    fireEvent.change(priceFilter, { target: { value: 'low' } });

    await waitFor(() => {
      // Should only show lots under $10,000
      expect(screen.getByText('Lot 101')).toBeInTheDocument();
      expect(screen.getByText('Lot 102')).toBeInTheDocument();
      expect(screen.queryByText('Lot 201')).not.toBeInTheDocument();
      expect(screen.queryByText('Lot 202')).not.toBeInTheDocument();
    });
  });

  it('sorts lots correctly', async () => {
    render(<LotSelectionStep {...mockProps} />);

    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    await waitFor(() => {
      // Should sort by price ascending
      const lotCards = screen.getAllByText(/Lot \d+/);
      expect(lotCards[0]).toHaveTextContent('Lot 101'); // $5,000
      expect(lotCards[1]).toHaveTextContent('Lot 102'); // $8,000
      expect(lotCards[2]).toHaveTextContent('Lot 201'); // $15,000
      expect(lotCards[3]).toHaveTextContent('Lot 202'); // $30,000
    });
  });

  it('shows lot details modal when "View Details" is clicked', async () => {
    render(<LotSelectionStep {...mockProps} />);

    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);

    await waitFor(() => {
      expect(screen.getByText('Lot 101 Details')).toBeInTheDocument();
      expect(screen.getByText('Filing 1')).toBeInTheDocument();
      expect(screen.getByText('Corner Lot')).toBeInTheDocument();
    });
  });

  it('closes lot details modal', async () => {
    render(<LotSelectionStep {...mockProps} />);

    // Open modal
    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);

    await waitFor(() => {
      expect(screen.getByText('Lot 101 Details')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Lot 101 Details')).not.toBeInTheDocument();
    });
  });

  it('handles empty lot premiums array', () => {
    render(<LotSelectionStep {...mockProps} lotPremiums={[]} />);

    expect(screen.getByText('Choose Your Lot')).toBeInTheDocument();
    expect(screen.getByText('No lots available')).toBeInTheDocument();
  });

  it('handles no selected lot', () => {
    const mockOnSelect = vi.fn();
    render(<LotSelectionStep {...mockProps} selected={null} onSelect={mockOnSelect} />);

    // No lot should be highlighted
    const lotCards = screen.getAllByRole('generic').filter(el => 
      el.className?.includes('lot-option')
    );
    
    lotCards.forEach(card => {
      expect(card).not.toHaveClass('border-primary');
      expect(card).not.toHaveClass('selected');
    });

    // Should still be clickable
    fireEvent.click(screen.getByText('Lot 101'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockLotPremiums[0]);
  });

  it('shows map view toggle', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByText('🗺️ Map View')).toBeInTheDocument();
    expect(screen.getByText('📋 List View')).toBeInTheDocument();
  });

  it('toggles between map and list view', () => {
    render(<LotSelectionStep {...mockProps} />);

    const mapViewButton = screen.getByText('🗺️ Map View');
    fireEvent.click(mapViewButton);

    expect(mapViewButton).toHaveClass('btn-primary');
    
    const listViewButton = screen.getByText('📋 List View');
    expect(listViewButton).toHaveClass('btn-outline-primary');
  });

  it('shows site map in map view', () => {
    render(<LotSelectionStep {...mockProps} />);

    const mapViewButton = screen.getByText('🗺️ Map View');
    fireEvent.click(mapViewButton);

    expect(screen.getByText('Interactive Site Map')).toBeInTheDocument();
  });

  it('displays lot summary statistics', () => {
    render(<LotSelectionStep {...mockProps} />);

    expect(screen.getByText(/4 lots available/)).toBeInTheDocument();
    expect(screen.getByText(/Price range: \$5,000 - \$30,000/)).toBeInTheDocument();
  });

  it('handles medium price range filter', async () => {
    render(<LotSelectionStep {...mockProps} />);

    const priceFilter = screen.getByLabelText(/price range/i);
    fireEvent.change(priceFilter, { target: { value: 'medium' } });

    await waitFor(() => {
      // Should show lots between $10,000-$25,000
      expect(screen.queryByText('Lot 101')).not.toBeInTheDocument(); // $5,000
      expect(screen.queryByText('Lot 102')).not.toBeInTheDocument(); // $8,000
      expect(screen.getByText('Lot 201')).toBeInTheDocument(); // $15,000
      expect(screen.queryByText('Lot 202')).not.toBeInTheDocument(); // $30,000
    });
  });

  it('handles high price range filter', async () => {
    render(<LotSelectionStep {...mockProps} />);

    const priceFilter = screen.getByLabelText(/price range/i);
    fireEvent.change(priceFilter, { target: { value: 'high' } });

    await waitFor(() => {
      // Should show lots $25,000 and above
      expect(screen.queryByText('Lot 101')).not.toBeInTheDocument();
      expect(screen.queryByText('Lot 102')).not.toBeInTheDocument();
      expect(screen.queryByText('Lot 201')).not.toBeInTheDocument();
      expect(screen.getByText('Lot 202')).toBeInTheDocument(); // $30,000
    });
  });
});