import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_USER_HOME } from '../utils/mutations';
import AuthService from '../utils/auth';
import { removeHomeId } from '../utils/localStorage';

const SavedHomes = () => {
  const { loading, data } = useQuery(GET_ME);
  const [deleteHome] = useMutation(DELETE_USER_HOME);
  const { getProfile } = AuthService;

  const userData = data?.me;

  // CHECK THIS FUNTION THIS DOESN'T LOOK RIGHT create function that accepts the home's mongo _id value as param and deletes the home from the database
  const handleDeleteHome = async (homeId: string) => {
    try {
      await deleteHome({
        variables: { id: homeId },
        update: cache => {
          const data = cache.readQuery<{ me?: any }>({ query: GET_ME }) || {};
          const me = data.me || {};
          cache.writeQuery({
            query: GET_ME,
            data: {
              me: {
                ...me,
                savedHomes: me?.savedHomes?.filter((home: any) => home._id !== homeId) || []
              }
            }
          });
        }
      });

      // upon success, remove home's id from localStorage
      removeHomeId(homeId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="mt-3 text-muted">Loading your saved homes...</p>
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
                <h1 className="hero-title">🏠 My Saved Homes</h1>
                <p className="hero-subtitle">
                  View and manage your customized home designs
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Container className="py-5">
        {userData?.savedHomes?.length ? (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="text-center mb-0">
                  {userData.savedHomes.length} Saved {userData.savedHomes.length === 1 ? 'Home' : 'Homes'}
                </h2>
                <p className="text-center text-muted mt-2">
                  {/* Bug need to check what is returned from get profile */}
                  Welcome back, {getProfile?.name || 'User'}!
                </p>
              </Col>
            </Row>

            <Row>
              {userData.savedHomes.map((home: any) => (
                <Col lg={4} md={6} key={home._id} className="mb-4">
                  <Card className="h-100 plan-card fade-in">
                    <Card.Header>
                      <h5 className="mb-0">{home.planTypeName}</h5>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column">
                      <div className="text-center mb-3">
                        <div className="plan-price">
                          ${home.totalPrice?.toLocaleString()}
                        </div>
                        <p className="text-muted small mb-0">Total Price</p>
                      </div>

                      <div className="mb-3">
                        <h6 className="text-primary mb-2">Specifications:</h6>
                        <ul className="plan-features">
                          <li><strong>Base Price:</strong> ${home.basePrice?.toLocaleString()}</li>
                          <li><strong>Elevation:</strong> {home.elevation?.name || 'Standard'}</li>
                          <li><strong>Interior:</strong> {home.interior?.name || 'Standard Package'}</li>
                          {home.kitchenAppliance && (
                            <li><strong>Kitchen:</strong> {home.kitchenAppliance.name}</li>
                          )}
                          {home.laundryAppliance && (
                            <li><strong>Laundry:</strong> {home.laundryAppliance.name}</li>
                          )}
                          {home.lotPremium && (
                            <li><strong>Lot:</strong> {home.lotPremium.name || `Filing ${home.lotPremium.filing}, Lot ${home.lotPremium.lot}`}</li>
                          )}
                        </ul>
                      </div>

                      <div className="mt-auto">
                        <Button
                          variant="danger"
                          className="w-100"
                          onClick={() => handleDeleteHome(home._id)}
                        >
                          Delete Home Design
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Row>
            <Col className="text-center">
              <div className="py-5">
                <h3 className="text-muted mb-3">No saved homes yet!</h3>
                <p className="text-muted mb-4">
                  Start by browsing our home plans and customizing your dream home.
                </p>
                <Button variant="primary" size="lg" href="/">
                  Browse Home Plans
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default SavedHomes;
