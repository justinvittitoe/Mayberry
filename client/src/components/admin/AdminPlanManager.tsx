import { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PLANS_WITH_OPTIONS } from '../../graphQl/planOptionQueries';
import { CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN } from '../../graphQl/mutations';
import PlanOptionManager from './PlanOptionManager';
import './AdminPlanManager.css';
import { Plan } from '../../models/graphql';


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
    totalSqft: 1500,
    resSqft: 1200,
    garage: 2,
    basePrice: 300000,
    description: '',
    colorScheme: [],
    width: 35,
    length: 41,
  });

  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('basic');

  // Queries
  const { data: plansData, loading: plansLoading, refetch: refetchPlans } = useQuery(GET_PLANS_WITH_OPTIONS);

  // Mutations
  const [createPlan] = useMutation(CREATE_PLAN, {
    onCompleted: (data) => {
      console.log('✅ CREATE_PLAN Success:', data);
      showAlert('success', 'Plan created successfully!');
      handleCloseModal();
      refetchPlans();
    },
    onError: (error) => {
      console.error('❌ CREATE_PLAN Error:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      });
      showAlert('danger', `Error creating plan: ${error.message}`);
    }
  });

  const [updatePlan] = useMutation(UPDATE_PLAN, {
    onCompleted: (data) => {
      console.log('✅ UPDATE_PLAN Success:', data);
      showAlert('success', 'Plan updated successfully!');
      handleCloseModal();
      refetchPlans();
    },
    onError: (error) => {
      console.error('❌ UPDATE_PLAN Error:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      });
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

  // Data is ready when plans are loaded
  const isDataReady = !plansLoading;

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Helper function to clean GraphQL objects and remove __typename
  const cleanGraphQLObject = (obj: any) => {
    if (!obj || typeof obj !== 'object') return obj;
    const { __typename, ...cleaned } = obj;
    return cleaned;
  };

  const handleShowModal = (plan?: Plan) => {
    // Ensure data is loaded before opening modal
    if (!isDataReady) return;

    if (plan) {
      setSelectedPlan(plan);
      setFormData(plan);
      setIsEditing(true);
    } else {
      setSelectedPlan(null);
      setFormData({
        planType: plans.length > 0 ? Math.max(...plans.map((p: Plan) => p.planType), -1) + 1 : 1,
        name: '',
        bedrooms: 3,
        bathrooms: 2,
        totalSqft: 1500,
        resSqft: 1200,
        garage: 2,
        basePrice: 300000,
        description: '',
        colorScheme: [],
        width: 35,
        length: 41,
      });
      setIsEditing(false);
    }
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleManageOptions = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPlanOptions(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormData({});
    setActiveTab('basic');
  };

  const handleClosePlanOptions = () => {
    setShowPlanOptions(false);
    setSelectedPlan(null);
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
      totalSqft: formData.totalSqft!,
      resSqft: formData.resSqft!,
      garage: formData.garage!,
      basePrice: formData.basePrice!,
      description: formData.description || '',
      colorScheme: formData.colorScheme || [],
      width: formData.width!,
      length: formData.length!,
      elevations: [],
      interiors: [],
      structural: [],
      additional: [],
      kitchenAppliance: [],
      laundryAppliance: [],
      lotPremium: []
    };

    console.log('📤 Sending Plan Data:', planInput);
    console.log('🔍 Form Data State:', formData);

    try {
      if (isEditing && selectedPlan) {
        console.log('🔄 Updating Plan ID:', selectedPlan._id);
        await updatePlan({
          variables: {
            id: selectedPlan._id,
            plan: planInput
          }
        });
      } else {
        console.log('✨ Creating New Plan');
        await createPlan({
          variables: {
            plan: planInput
          }
        });
      }
    } catch (error) {
      console.error('💥 Plan Submit Error:', error);
    }
  };

  const handleDelete = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      await deletePlan({
        variables: { id: planId }
      });
    }
  };

  const handlePlanUpdate = () => {
    refetchPlans();
  };

  const formatPriceDisplay = (price: number) => {
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
            <Button
              variant="primary"
              onClick={() => handleShowModal()}
              disabled={!isDataReady}
            >
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
                    <th>Options</th>
                    <th>Base Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan: Plan) => (
                    <tr key={plan._id}>
                      <td>
                        <Badge bg="primary">{typeof plan.planType === 'number' ? plan.planType : '?'}</Badge>
                      </td>
                      <td>
                        <strong>{typeof plan.name === 'string' ? plan.name : 'Unknown Plan'}</strong>
                        {plan.description && typeof plan.description === 'string' && (
                          <div className="small text-muted">{plan.description}</div>
                        )}
                      </td>
                      <td>
                        <div className="small">
                          <div>{typeof plan.bedrooms === 'number' ? plan.bedrooms : 0} BR / {typeof plan.bathrooms === 'number' ? plan.bathrooms : 0} BA</div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">
                          {typeof plan.totalSqft === 'number' ? plan.totalSqft.toLocaleString() : '0'} sq ft
                        </div>
                        <div className="small text-muted">
                          Res: {typeof plan.resSqft === 'number' ? plan.resSqft.toLocaleString() : '0'} sq ft
                        </div>
                      </td>
                      <td>
                        <div className="small">{typeof plan.garage === 'number' ? `${plan.garage}-Car` : 'Unknown'}</div>
                      </td>
                      <td>
                        <div className="small">
                          <div>Elevations: {plan.elevations?.length || 0}</div>
                          <div>Interiors: {plan.interiors?.length || 0}</div>
                          <div>Structural: {plan.structural?.length || 0}</div>
                          <div>Additional: {plan.additional?.length || 0}</div>
                          <div>Appliances: {(plan.kitchenAppliance?.length || 0) + (plan.laundryAppliance?.length || 0)}</div>
                          <div>Lots: {plan.lotPremium?.length || 0}</div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-success">
                          {formatPriceDisplay(typeof plan.basePrice === 'number' ? plan.basePrice : 0)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowModal(plan)}
                            disabled={!isDataReady}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleManageOptions(plan)}
                            disabled={!isDataReady}
                          >
                            Options
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
      <Modal show={showModal} onHide={handleCloseModal} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Floor Plan' : 'Create New Floor Plan'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="basic-info-form">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Plan Type Number</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.planType !== undefined ? formData.planType : ''}
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
                    <Form.Label>Total Square Footage</Form.Label>
                    <Form.Control
                      type="number"
                      min="500"
                      value={formData.totalSqft || ''}
                      onChange={(e) => handleInputChange('totalSqft', parseInt(e.target.value))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Residential Square Footage</Form.Label>
                    <Form.Control
                      type="number"
                      min="400"
                      value={formData.resSqft || ''}
                      onChange={(e) => handleInputChange('resSqft', parseInt(e.target.value))}
                      required
                    />
                    <Form.Text className="text-muted">
                      Typically 80% of total square footage
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Garage Size</Form.Label>
                    <Form.Select
                      value={formData.garage || ''}
                      onChange={(e) => handleInputChange('garage', parseInt(e.target.value))}
                      required
                    >
                      <option value="">Select garage size</option>
                      <option value={2}>2-Car Garage</option>
                      <option value={3}>3-Car Garage</option>
                      <option value={4}>4-Car Garage</option>
                      <option value={5}>5-Car Garage</option>
                      <option value={6}>6-Car Garage</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Base Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="1"
                      value={formData.basePrice || ''}
                      onChange={(e) => handleInputChange('basePrice', parseInt(e.target.value))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Width</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={formData.width || ''}
                      onChange={(e) => handleInputChange('width', parseInt(e.target.value))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Depth</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={formData.length || ''}
                      onChange={(e) => handleInputChange('length', parseInt(e.target.value))}
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

              <Alert variant="info">
                <strong>Note:</strong> After creating this plan, use the "Options" button to add elevations, interiors, appliances, and other plan-specific options.
              </Alert>
            </div>
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

      {/* Plan Options Manager Modal */}
      {showPlanOptions && selectedPlan && (
        <Modal show={showPlanOptions} onHide={handleClosePlanOptions} size="xl" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>Manage Options - {selectedPlan.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <PlanOptionManager
              plan={selectedPlan}
              onPlanUpdate={handlePlanUpdate}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePlanOptions}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AdminPlanManager;