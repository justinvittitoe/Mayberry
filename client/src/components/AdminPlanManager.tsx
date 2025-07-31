import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PLANS, GET_OPTIONS, GET_INTERIOR_PACKAGES, GET_LOT_PREMIUMS } from '../utils/queries';
import { CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN } from '../utils/mutations';

interface Plan {
  _id: string;
  planType: number;
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  garageType: string;
  basePrice: number;
  description?: string;
  elevations?: any[];
  interiors?: any[];
  structural?: any[];
  additional?: any[];
  kitchenAppliance?: any[];
  laundryAppliance?: any[];
  lotPremium?: any[];
  colorScheme?: number[];
}

const AdminPlanManager = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [formData, setFormData] = useState<Partial<Plan>>({
    planType: 0,
    name: '',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1500,
    garageType: '2-Car Garage',
    basePrice: 300000,
    description: '',
    colorScheme: [1, 2, 3]
  });

  // Queries
  const { data: plansData, loading: plansLoading, refetch: refetchPlans } = useQuery(GET_PLANS);
  const { data: optionsData } = useQuery(GET_OPTIONS);
  const { data: interiorsData } = useQuery(GET_INTERIOR_PACKAGES);
  const { data: lotPremumsData } = useQuery(GET_LOT_PREMIUMS);

  // Mutations
  const [createPlan] = useMutation(CREATE_PLAN, {
    onCompleted: () => {
      showAlert('success', 'Plan created successfully!');
      handleCloseModal();
      refetchPlans();
    },
    onError: (error) => {
      showAlert('danger', `Error creating plan: ${error.message}`);
    }
  });

  const [updatePlan] = useMutation(UPDATE_PLAN, {
    onCompleted: () => {
      showAlert('success', 'Plan updated successfully!');
      handleCloseModal();
      refetchPlans();
    },
    onError: (error) => {
      showAlert('danger', `Error updating plan: ${error.message}`);
    }
  });

  const [deletePlan] = useMutation(DELETE_PLAN, {
    onCompleted: () => {
      showAlert('success', 'Plan deleted successfully!');
      refetchPlans();
    },
    onError: (error) => {
      showAlert('danger', `Error deleting plan: ${error.message}`);
    }
  });

  const plans = plansData?.plans || [];
  const options = optionsData?.options || [];
  const interiors = interiorsData?.interiorPackages || [];
  const lotPremiums = lotPremumsData?.lotPremiums || [];

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleShowModal = (plan?: Plan) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData(plan);
      setIsEditing(true);
    } else {
      setSelectedPlan(null);
      setFormData({
        planType: Math.max(...plans.map((p: Plan) => p.planType), -1) + 1,
        name: '',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1500,
        garageType: '2-Car Garage',
        basePrice: 300000,
        description: '',
        colorScheme: [1, 2, 3]
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormData({});
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const planInput = {
      planType: formData.planType!,
      name: formData.name!,
      bedrooms: formData.bedrooms!,
      bathrooms: formData.bathrooms!,
      squareFootage: formData.squareFootage!,
      garageType: formData.garageType!,
      basePrice: formData.basePrice!,
      description: formData.description || '',
      colorScheme: formData.colorScheme || [1, 2, 3],
      elevations: [],
      interiors: [],
      structural: [],
      additional: [],
      kitchenAppliance: [],
      laundryAppliance: [],
      lotPremium: []
    };

    if (isEditing && selectedPlan) {
      await updatePlan({
        variables: {
          id: selectedPlan._id,
          plan: planInput
        }
      });
    } else {
      await createPlan({
        variables: {
          plan: planInput
        }
      });
    }
  };

  const handleDelete = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      await deletePlan({
        variables: { id: planId }
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (plansLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="mt-3 text-muted">Loading plans...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Floor Plan Management</h2>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Add New Plan
            </Button>
          </div>
          <p className="text-muted mt-2">Manage floor plans, specifications, and pricing</p>
        </Col>
      </Row>

      {alert && (
        <Row className="mb-4">
          <Col>
            <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Current Floor Plans ({plans.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Plan Type</th>
                    <th>Name</th>
                    <th>Specs</th>
                    <th>Square Footage</th>
                    <th>Garage</th>
                    <th>Base Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan: Plan) => (
                    <tr key={plan._id}>
                      <td>
                        <Badge bg="primary">{plan.planType}</Badge>
                      </td>
                      <td>
                        <strong>{plan.name}</strong>
                        {plan.description && (
                          <div className="small text-muted">{plan.description}</div>
                        )}
                      </td>
                      <td>
                        <div className="small">
                          <div>{plan.bedrooms} BR / {plan.bathrooms} BA</div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">
                          {plan.squareFootage.toLocaleString()} sq ft
                        </div>
                      </td>
                      <td>
                        <div className="small">{plan.garageType}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-success">
                          {formatPrice(plan.basePrice)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowModal(plan)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(plan._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {plans.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">No floor plans found. Create your first plan to get started.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Plan Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Floor Plan' : 'Create New Floor Plan'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Type Number</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.planType || ''}
                    onChange={(e) => handleInputChange('planType', parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., The Aspen"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bedrooms</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="10"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bathrooms</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Square Footage</Form.Label>
                  <Form.Control
                    type="number"
                    min="500"
                    value={formData.squareFootage || ''}
                    onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Garage Type</Form.Label>
                  <Form.Select
                    value={formData.garageType || ''}
                    onChange={(e) => handleInputChange('garageType', e.target.value)}
                    required
                  >
                    <option value="">Select garage type</option>
                    <option value="2-Car Garage">2-Car Garage</option>
                    <option value="3-Car Garage">3-Car Garage</option>
                    <option value="4-Car Garage">4-Car Garage</option>
                    <option value="RV Garage">RV Garage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.basePrice || ''}
                    onChange={(e) => handleInputChange('basePrice', parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Brief description of the floor plan..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminPlanManager;