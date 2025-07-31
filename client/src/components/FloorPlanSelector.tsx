import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

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

interface FloorPlanSelectorProps {
  onPlanSelect?: (plan: FloorPlan) => void;
  selectedPlanId?: string;
  plans?: FloorPlan[];
}

const FloorPlanSelector = ({ onPlanSelect, selectedPlanId, plans }: FloorPlanSelectorProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(selectedPlanId || null);

  // Use provided plans or fallback to sample data
  const defaultFloorPlans: FloorPlan[] = [
    {
      id: '1',
      name: 'The Aspen',
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1620,
      garageType: '2-Car Garage',
      basePrice: 399000,
      description: 'Cozy ranch-style home perfect for first-time buyers'
    },
    {
      id: '2', 
      name: 'The Birch',
      bedrooms: 3,
      bathrooms: 2.5,
      squareFootage: 1847,
      garageType: '2-Car Garage',
      basePrice: 429000,
      description: 'Open-concept living with modern amenities'
    },
    {
      id: '3',
      name: 'The Cedar',
      bedrooms: 4,
      bathrooms: 2.5,
      squareFootage: 2134,
      garageType: '2-Car Garage', 
      basePrice: 469000,
      description: 'Spacious family home with bonus room'
    },
    {
      id: '4',
      name: 'The Dogwood',
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2389,
      garageType: '3-Car Garage',
      basePrice: 509000,
      description: 'Luxury living with premium finishes'
    },
    {
      id: '5',
      name: 'The Elm',
      bedrooms: 5,
      bathrooms: 3,
      squareFootage: 2675,
      garageType: '3-Car Garage',
      basePrice: 549000,
      description: 'Executive home with home office and guest suite'
    },
    {
      id: '6',
      name: 'The Fir',
      bedrooms: 4,
      bathrooms: 3.5,
      squareFootage: 2856,
      garageType: '3-Car Garage',
      basePrice: 574000,
      description: 'Grand two-story with formal dining and study'
    },
    {
      id: '7',
      name: 'The Grove',
      bedrooms: 5,
      bathrooms: 3.5,
      squareFootage: 3098,
      garageType: '3-Car Garage',
      basePrice: 599000,
      description: 'Stunning home with master suite retreat'
    },
    {
      id: '8',
      name: 'The Heritage',
      bedrooms: 5,
      bathrooms: 3.5,
      squareFootage: 3247,
      garageType: '3-Car Garage',
      basePrice: 629000,
      description: 'Premier floor plan with luxury throughout'
    }
  ];

  const floorPlans = plans || defaultFloorPlans;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFootage = (sqft: number): string => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const handlePlanSelect = (plan: FloorPlan) => {
    setSelectedPlan(plan.id);
    onPlanSelect?.(plan);
  };

  return (
    <div className="floor-plan-selector">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Choose Your Floor Plan</h2>
          <p className="lead text-muted">Select from our collection of thoughtfully designed homes</p>
        </div>
        
        <Row className="g-4">
          {floorPlans.map((plan) => (
            <Col key={plan.id} xs={12} md={6} lg={4}>
              <Card 
                className={`floor-plan-card h-100 ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <Card.Title className="h4 mb-2">{plan.name}</Card.Title>
                    {plan.description && (
                      <Card.Text className="text-muted small mb-3">{plan.description}</Card.Text>
                    )}
                  </div>
                  
                  <div className="plan-details mb-4">
                    <Row className="g-3">
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <div className="plan-icon me-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6c-1.65 0-3 1.35-3 3v2.78c-.61.55-1 1.34-1 2.22v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6c0-.88-.39-1.67-1-2.22zM7 9h4v2H7V9zm8 0h4v2h-4V9z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="fw-semibold">{plan.bedrooms}</div>
                            <div className="small text-muted">Bedrooms</div>
                          </div>
                        </div>
                      </Col>
                      
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <div className="plan-icon me-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21 10H3c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1zm-1 3H4c-.55 0-1 .45-1 1v5c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1zM8 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="fw-semibold">{plan.bathrooms}</div>
                            <div className="small text-muted">Bathrooms</div>
                          </div>
                        </div>
                      </Col>
                      
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <div className="plan-icon me-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2zm0 2.18L5.82 6.5 12 8.82 18.18 6.5 12 4.18zM5 8.82v8.36L11 19.64v-8.36L5 8.82zm8 10.82l6-2.46V8.82l-6 2.46v8.36z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="fw-semibold">{formatSquareFootage(plan.squareFootage)}</div>
                            <div className="small text-muted">Sq Ft</div>
                          </div>
                        </div>
                      </Col>
                      
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <div className="plan-icon me-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v8zM6 8v8h12V8H6zm2 2h2v2H8v-2zm4 0h2v2h-2v-2zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="fw-semibold">{plan.garageType}</div>
                            <div className="small text-muted">Garage</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="plan-price mb-3">
                      <span className="h4 fw-bold text-primary">
                        {formatPrice(plan.basePrice)}
                      </span>
                      <span className="small text-muted ms-1">starting at</span>
                    </div>
                    
                    {selectedPlan === plan.id && (
                      <div className="selected-indicator">
                        <div className="alert alert-primary mb-0 py-2">
                          <small className="fw-semibold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-1">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            Selected Plan
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FloorPlanSelector;