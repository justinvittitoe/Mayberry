import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_PLANS } from '../utils/queries';
import { Link } from 'react-router-dom';

const Home = () => {
  const { loading, data } = useQuery(GET_PLANS);

  const plans = data?.plans || [];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="mt-3 text-muted">Loading available plans...</p>
      </div>
    );
  }

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <h1 className="hero-title">🏠 Mayberry Home Builder</h1>
                <p className="hero-subtitle">
                  Design your dream home with our customizable floor plans and premium options.
                </p>
                <p className="mb-0 opacity-75">
                  Choose from our selection of beautiful home designs and customize every detail to match your lifestyle.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Container className="py-5">
        <Row>
          <Col>
            <h2 className="text-center mb-5">Available Home Plans</h2>
          </Col>
        </Row>

        <Row>
          {plans.map((plan: any) => (
            <Col key={plan._id} lg={4} md={6} className="mb-4">
              <Card className="h-100 plan-card fade-in">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center mb-3">{plan.name}</Card.Title>
                  <div className="text-center mb-3">
                    <span className="badge bg-primary mb-2">{plan.planType}</span>
                    <div className="plan-price">
                      Starting at ${plan.basePrice?.toLocaleString()}
                    </div>
                  </div>

                  <ul className="plan-features">
                    <li>{plan.elevations?.length || 0} Elevation Options</li>
                    <li>{plan.interiors?.length || 0} Interior Packages</li>
                    <li>{plan.structural?.length || 0} Structural Options</li>
                    <li>{plan.additional?.length || 0} Additional Features</li>
                  </ul>

                  <div className="mt-auto text-center">
                    <Link to={`/customize/${plan._id}`}>
                      <Button variant="primary" className="w-100">
                        Customize This Plan
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {plans.length === 0 && (
          <Row>
            <Col className="text-center">
              <div className="py-5">
                <h3 className="text-muted">No plans available at the moment.</h3>
                <p className="text-muted">Please check back later or contact us for more information.</p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Home;
