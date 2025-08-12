import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Table } from 'react-bootstrap';
import { PlanCardSkeleton, ErrorState, EmptyState } from './LoadingSpinner';

interface FloorPlan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  garageType: string;
  basePrice: number;
  description?: string;
}

interface EnhancedFloorPlanSelectorProps {
  onPlanSelect?: (plan: FloorPlan) => void;
  selectedPlanId?: string;
  plans?: FloorPlan[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const EnhancedFloorPlanSelector: React.FC<EnhancedFloorPlanSelectorProps> = ({ 
  onPlanSelect, 
  selectedPlanId, 
  plans = [],
  loading = false,
  error,
  onRetry
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(selectedPlanId || null);
  const [filters, setFilters] = useState({
    minBedrooms: 0,
    maxBedrooms: 10,
    minBathrooms: 0,
    maxBathrooms: 10,
    minSquareFootage: 0,
    maxSquareFootage: 5000,
    minPrice: 0,
    maxPrice: 1000000,
    garageType: 'all'
  });
  const [sortBy, setSortBy] = useState<string>('price');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPlans, setComparisonPlans] = useState<FloorPlan[]>([]);

  // Filter and sort plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = plans.filter(plan => {
      return (
        plan.bedrooms >= filters.minBedrooms &&
        plan.bedrooms <= filters.maxBedrooms &&
        plan.bathrooms >= filters.minBathrooms &&
        plan.bathrooms <= filters.maxBathrooms &&
        plan.squareFootage >= filters.minSquareFootage &&
        plan.squareFootage <= filters.maxSquareFootage &&
        plan.basePrice >= filters.minPrice &&
        plan.basePrice <= filters.maxPrice &&
        (filters.garageType === 'all' || plan.garageType === filters.garageType)
      );
    });

    // Sort the filtered plans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.basePrice - b.basePrice;
        case 'priceDesc':
          return b.basePrice - a.basePrice;
        case 'size':
          return a.squareFootage - b.squareFootage;
        case 'sizeDesc':
          return b.squareFootage - a.squareFootage;
        case 'bedrooms':
          return a.bedrooms - b.bedrooms;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [plans, filters, sortBy]);

  // Get unique garage types for filter
  const uniqueGarageTypes = useMemo(() => {
    return [...new Set(plans.map(plan => plan.garageType))];
  }, [plans]);

  const handlePlanSelect = (plan: FloorPlan) => {
    setSelectedPlan(plan.id);
    onPlanSelect?.(plan);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minBedrooms: 0,
      maxBedrooms: 10,
      minBathrooms: 0,
      maxBathrooms: 10,
      minSquareFootage: 0,
      maxSquareFootage: 5000,
      minPrice: 0,
      maxPrice: 1000000,
      garageType: 'all'
    });
  };

  const addToComparison = (plan: FloorPlan) => {
    if (comparisonPlans.length < 3 && !comparisonPlans.find(p => p.id === plan.id)) {
      setComparisonPlans(prev => [...prev, plan]);
    }
  };

  const removeFromComparison = (planId: string) => {
    setComparisonPlans(prev => prev.filter(p => p.id !== planId));
  };

  const clearComparison = () => {
    setComparisonPlans([]);
  };

  const PlanCard: React.FC<{ plan: FloorPlan }> = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    const inComparison = comparisonPlans.find(p => p.id === plan.id);

    return (
      <Card 
        className={`floor-plan-card h-100 ${isSelected ? 'selected border-primary' : 'border-light'}`}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      >
        <div className="position-relative">
          <div 
            className="plan-image d-flex align-items-center justify-content-center bg-light"
            style={{ height: '200px' }}
            onClick={() => handlePlanSelect(plan)}
          >
            <div className="text-center text-muted">
              <div style={{ fontSize: '3rem' }}>🏠</div>
              <div>Floor Plan Preview</div>
            </div>
          </div>
          
          {isSelected && (
            <div className="position-absolute top-0 end-0 p-2">
              <Badge bg="primary">Selected</Badge>
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column" onClick={() => handlePlanSelect(plan)}>
          <div className="flex-grow-1">
            <Card.Title className="h5 mb-2">{plan.name}</Card.Title>
            
            <div className="plan-specs mb-3">
              <Row className="g-2">
                <Col xs={6}>
                  <div className="spec-item">
                    <div className="spec-icon">🛏️</div>
                    <div className="spec-text">
                      <div className="fw-bold">{plan.bedrooms}</div>
                      <small className="text-muted">Bedrooms</small>
                    </div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="spec-item">
                    <div className="spec-icon">🛁</div>
                    <div className="spec-text">
                      <div className="fw-bold">{plan.bathrooms}</div>
                      <small className="text-muted">Bathrooms</small>
                    </div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="spec-item">
                    <div className="spec-icon">📐</div>
                    <div className="spec-text">
                      <div className="fw-bold">{plan.squareFootage.toLocaleString()}</div>
                      <small className="text-muted">Sq Ft</small>
                    </div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="spec-item">
                    <div className="spec-icon">🚗</div>
                    <div className="spec-text">
                      <div className="fw-bold">{plan.garageType.charAt(0)}</div>
                      <small className="text-muted">Car Garage</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <p className="text-muted small mb-3">{plan.description}</p>
          </div>

          <div className="d-flex justify-content-between align-items-end">
            <div className="plan-price">
              <div className="h5 mb-0 text-primary">${plan.basePrice.toLocaleString()}</div>
              <small className="text-muted">Starting at</small>
            </div>
            
            <Button
              size="sm"
              variant={inComparison ? 'success' : 'outline-secondary'}
              onClick={(e) => {
                e.stopPropagation();
                if (inComparison) {
                  removeFromComparison(plan.id);
                } else {
                  addToComparison(plan);
                }
              }}
              disabled={!inComparison && comparisonPlans.length >= 3}
            >
              {inComparison ? '✓ Added' : '+ Compare'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const PlanListItem: React.FC<{ plan: FloorPlan }> = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    const inComparison = comparisonPlans.find(p => p.id === plan.id);

    return (
      <Card 
        className={`mb-3 ${isSelected ? 'border-primary' : 'border-light'}`}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        onClick={() => handlePlanSelect(plan)}
      >
        <Card.Body>
          <Row className="align-items-center">
            <Col md={2}>
              <div 
                className="d-flex align-items-center justify-content-center bg-light rounded"
                style={{ height: '80px' }}
              >
                <span style={{ fontSize: '2rem' }}>🏠</span>
              </div>
            </Col>
            <Col md={6}>
              <h5 className="mb-2">{plan.name}</h5>
              <div className="d-flex gap-4 mb-2">
                <span><strong>{plan.bedrooms}</strong> bed</span>
                <span><strong>{plan.bathrooms}</strong> bath</span>
                <span><strong>{plan.squareFootage.toLocaleString()}</strong> sq ft</span>
                <span><strong>{plan.garageType}</strong></span>
              </div>
              <p className="text-muted small mb-0">{plan.description}</p>
            </Col>
            <Col md={2} className="text-center">
              <div className="h5 mb-1 text-primary">${plan.basePrice.toLocaleString()}</div>
              <small className="text-muted">Starting at</small>
            </Col>
            <Col md={2}>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={inComparison ? 'success' : 'outline-secondary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (inComparison) {
                      removeFromComparison(plan.id);
                    } else {
                      addToComparison(plan);
                    }
                  }}
                  disabled={!inComparison && comparisonPlans.length >= 3}
                >
                  {inComparison ? '✓' : '+'}
                </Button>
                {isSelected && (
                  <Badge bg="primary">Selected</Badge>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // Handle loading state
  if (loading) {
    return (
      <Container className="enhanced-floor-plan-selector py-4">
        <div className="mb-4">
          <h3 className="mb-1">Choose Your Floor Plan</h3>
          <p className="text-muted mb-0">Browse our collection of thoughtfully designed homes</p>
        </div>
        <PlanCardSkeleton count={6} />
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container className="enhanced-floor-plan-selector py-4">
        <div className="mb-4">
          <h3 className="mb-1">Choose Your Floor Plan</h3>
          <p className="text-muted mb-0">Browse our collection of thoughtfully designed homes</p>
        </div>
        <ErrorState message={error} onRetry={onRetry} />
      </Container>
    );
  }

  // Handle empty state
  if (!loading && !error && plans.length === 0) {
    return (
      <Container className="enhanced-floor-plan-selector py-4">
        <div className="mb-4">
          <h3 className="mb-1">Choose Your Floor Plan</h3>
          <p className="text-muted mb-0">Browse our collection of thoughtfully designed homes</p>
        </div>
        <EmptyState 
          title="No floor plans available"
          message="We're working on adding new floor plans. Please check back soon!"
          icon="🏠"
          actionButton={{
            text: "Refresh",
            onClick: onRetry || (() => window.location.reload()),
            variant: "primary"
          }}
        />
      </Container>
    );
  }

  return (
    <Container className="enhanced-floor-plan-selector py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Choose Your Floor Plan</h3>
          <p className="text-muted mb-0">Browse our collection of thoughtfully designed homes</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            ☰ List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Filters</h6>
            <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
              Reset All
            </Button>
          </div>
          
          <Row>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Bedrooms</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Select 
                    size="sm"
                    value={filters.minBedrooms}
                    onChange={(e) => handleFilterChange('minBedrooms', Number(e.target.value))}
                  >
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Bathrooms</Form.Label>
                <Form.Select 
                  size="sm"
                  value={filters.minBathrooms}
                  onChange={(e) => handleFilterChange('minBathrooms', Number(e.target.value))}
                >
                  {[0,1,1.5,2,2.5,3,3.5,4].map(n => <option key={n} value={n}>{n}+</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Min Sq Ft</Form.Label>
                <Form.Select 
                  size="sm"
                  value={filters.minSquareFootage}
                  onChange={(e) => handleFilterChange('minSquareFootage', Number(e.target.value))}
                >
                  <option value={0}>Any</option>
                  <option value={1200}>1,200+</option>
                  <option value={1500}>1,500+</option>
                  <option value={2000}>2,000+</option>
                  <option value={2500}>2,500+</option>
                  <option value={3000}>3,000+</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Max Price</Form.Label>
                <Form.Select 
                  size="sm"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                >
                  <option value={1000000}>Any</option>
                  <option value={400000}>$400K</option>
                  <option value={500000}>$500K</option>
                  <option value={600000}>$600K</option>
                  <option value={700000}>$700K</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Garage</Form.Label>
                <Form.Select 
                  size="sm"
                  value={filters.garageType}
                  onChange={(e) => handleFilterChange('garageType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  {uniqueGarageTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label className="small">Sort By</Form.Label>
                <Form.Select 
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="priceDesc">Price (High to Low)</option>
                  <option value="size">Size (Small to Large)</option>
                  <option value="sizeDesc">Size (Large to Small)</option>
                  <option value="bedrooms">Bedrooms</option>
                  <option value="name">Name</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="text-muted">
            Showing {filteredAndSortedPlans.length} of {plans.length} floor plans
          </span>
        </div>
        {comparisonPlans.length > 0 && (
          <div className="d-flex gap-2 align-items-center">
            <Badge bg="primary">{comparisonPlans.length} to compare</Badge>
            <Button size="sm" onClick={() => setShowComparison(true)}>
              Compare Plans
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={clearComparison}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Plans Display */}
      {viewMode === 'grid' ? (
        <Row>
          {filteredAndSortedPlans.map((plan) => (
            <Col key={plan.id} lg={4} md={6} className="mb-4">
              <PlanCard plan={plan} />
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          {filteredAndSortedPlans.map((plan) => (
            <PlanListItem key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      {filteredAndSortedPlans.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <div style={{ fontSize: '3rem' }} className="mb-3">🏠</div>
            <h5>No floor plans match your criteria</h5>
            <p>Try adjusting your filters to see more options.</p>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <Modal show={showComparison} onHide={() => setShowComparison(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Compare Floor Plans</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comparisonPlans.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Feature</th>
                  {comparisonPlans.map(plan => (
                    <th key={plan.id} className="text-center">
                      <div>{plan.name}</div>
                      <Button 
                        size="sm" 
                        variant="outline-danger" 
                        onClick={() => removeFromComparison(plan.id)}
                        className="mt-1"
                      >
                        Remove
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Base Price</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">
                      <strong className="text-primary">${plan.basePrice.toLocaleString()}</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Square Footage</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">{plan.squareFootage.toLocaleString()} sq ft</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Bedrooms</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">{plan.bedrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Bathrooms</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">{plan.bathrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Garage</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">{plan.garageType}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Price per Sq Ft</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">
                      ${Math.round(plan.basePrice / plan.squareFootage).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Description</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center small">{plan.description}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Action</strong></td>
                  {comparisonPlans.map(plan => (
                    <td key={plan.id} className="text-center">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => {
                          handlePlanSelect(plan);
                          setShowComparison(false);
                        }}
                      >
                        Select Plan
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p>No plans selected for comparison. Add plans from the main view to compare them here.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowComparison(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS for spec items */}
      <style>{`
        .spec-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .spec-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }
        
        .spec-text {
          flex: 1;
          line-height: 1.2;
        }
        
        .floor-plan-card.selected {
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
          transform: translateY(-2px);
        }
        
        .floor-plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Container>
  );
};

export default EnhancedFloorPlanSelector;