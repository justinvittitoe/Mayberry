import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_PLANS } from '../utils/queries';
import { Link, useNavigate } from 'react-router-dom';
import EnhancedFloorPlanSelector from '../components/EnhancedFloorPlanSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthService from '../utils/auth';

const Home = () => {
  const { loading, data, error } = useQuery(GET_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const navigate = useNavigate();
  const isAuthenticated = AuthService.loggedIn();

  const plans = data?.plans || [];

  // Transform GraphQL data to match FloorPlanSelector interface
  const transformedPlans = plans.map((plan: any) => ({
    id: plan._id,
    name: plan.name,
    bedrooms: plan.bedrooms,
    bathrooms: plan.bathrooms,
    squareFootage: plan.squareFootage,
    garageType: plan.garageType,
    basePrice: plan.basePrice,
    description: plan.description
  }));
  //Floor plan selected state management
  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
  };
  
  //Customize selected floor plan
  const handleCustomizeClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/customize/${selectedPlan.id}` } } });
      return;
    }
    navigate(`/customize/${selectedPlan.id}`);
  };
  //loading
  if (loading) {
    return <LoadingSpinner message="Loading available plans..." fullPage />;
  }
  //Error loading
  if (error) {
    return (
      <div className="error-container">
        <Container>
          <div className="text-center py-5">
            <div className="alert alert-danger">
              <h4>Unable to Load Plans</h4>
              <p>We're having trouble loading the available floor plans. Please try refreshing the page.</p>
              <p className="mb-0"><small>Error: {error.message}</small></p>
            </div>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      {/* Modern Hero Section */}
      <div className="modern-hero-section">
        <div className="hero-content">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={10} xl={8}>
                <h1 className="hero-title mb-4">
                  Build Your Dream Home
                </h1>
                <p className="hero-subtitle mb-5">
                  Discover our collection of thoughtfully designed floor plans, each crafted to create the perfect foundation for your family's future.
                </p>
                {!isAuthenticated && (
                  <div className="hero-cta mb-5">
                    <Link to="/signup">
                      <Button variant="primary" size="lg" className="me-3">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline-light" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Admin Access Section */}
      {isAuthenticated && AuthService.getProfile()?.data.role === 'admin' && (
        <div className="admin-access-section">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <div className="admin-access-card text-center">
                  <h3 className="mb-3">Administrator Access</h3>
                  <p className="text-muted mb-4">
                    Manage floor plans, options, and application settings.
                  </p>
                  <Link to="/admin">
                    <Button variant="primary" size="lg" className="px-5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Floor Plan Selection */}
      <EnhancedFloorPlanSelector 
        onPlanSelect={isAuthenticated ? handlePlanSelect : undefined}
        selectedPlanId={selectedPlan?.id}
        plans={transformedPlans}
      />
      
      {!isAuthenticated && (
        <div className="sign-in-prompt">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={6}>
                <p className="lead text-muted mb-4">
                  Sign in to customize and save your favorite floor plans.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/login">
                    <Button variant="primary">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="outline-primary">Create Account</Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Selected Plan Action */}
      {selectedPlan && isAuthenticated && (
        <div className="selected-plan-action">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <div className="action-card text-center">
                  <h3 className="mb-3">Ready to customize {selectedPlan.name}?</h3>
                  <p className="text-muted mb-4">
                    Start personalizing your home with our interactive customization tools.
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleCustomizeClick}
                    className="px-5"
                  >
                    Customize This Plan
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="features-section">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="display-6 fw-bold mb-3">Why Choose Mayberry</h2>
              <p className="lead text-muted">
                Experience the difference of working with a trusted home builder.
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h4 className="fw-bold mb-3">Premium Quality</h4>
                <p className="text-muted">
                  Built with the finest materials and attention to detail in every aspect of construction.
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h4 className="fw-bold mb-3">Customizable</h4>
                <p className="text-muted">
                  Personalize every detail to create a home that perfectly matches your lifestyle and preferences.
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
                <h4 className="fw-bold mb-3">Great Value</h4>
                <p className="text-muted">
                  Competitive pricing with exceptional value, ensuring you get the most for your investment.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {plans.length === 0 && (
        <div className="empty-state">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={6}>
                <h3 className="text-muted mb-3">No plans available at the moment.</h3>
                <p className="text-muted">Please check back later or contact us for more information.</p>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Home;
