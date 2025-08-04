import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PLANS, GET_OPTIONS, GET_INTERIOR_PACKAGES, GET_LOT_PREMIUMS } from '../utils/queries';
import { CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN } from '../utils/mutations';
import OptionSelector from './OptionSelector';
import { calculatePlanTotalPricing, formatPrice, getPriceBreakdown, getSelectedOptionsCount } from '../utils/priceCalculator';
import './AdminPlanManager.css';

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

  const [selectedOptions, setSelectedOptions] = useState({
    elevations: [] as string[],
    interiors: [] as string[],
    structural: [] as string[],
    additional: [] as string[],
    kitchenAppliance: [] as string[],
    laundryAppliance: [] as string[],
    lotPremiums: [] as string[]
  });

  const [activeTab, setActiveTab] = useState<string>('basic');

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
      setSelectedOptions({
        elevations: plan.elevations?.map(e => e._id) || [],
        interiors: plan.interiors?.map(i => i._id) || [],
        structural: plan.structural?.map(s => s._id) || [],
        additional: plan.additional?.map(a => a._id) || [],
        kitchenAppliance: plan.kitchenAppliance?.map(k => k._id) || [],
        laundryAppliance: plan.laundryAppliance?.map(l => l._id) || [],
        lotPremiums: plan.lotPremium?.map(lp => lp._id) || []
      });
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
      setSelectedOptions({
        elevations: [],
        interiors: [],
        structural: [],
        additional: [],
        kitchenAppliance: [],
        laundryAppliance: [],
        lotPremiums: []
      });
      setIsEditing(false);
    }
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormData({});
    setSelectedOptions({
      elevations: [],
      interiors: [],
      structural: [],
      additional: [],
      kitchenAppliance: [],
      laundryAppliance: [],
      lotPremiums: []
    });
    setActiveTab('basic');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert selected option IDs to option inputs
    const getOptionInputs = (selectedIds: string[], availableOptions: any[]) => {
      return selectedIds.map(id => {
        const option = availableOptions.find(opt => opt._id === id);
        if (!option) return null;
        return {
          name: option.name,
          price: option.price || option.totalPrice,
          classification: option.classification,
          description: option.description,
          img: option.img
        };
      }).filter(Boolean);
    };

    const getLotPremiumInputs = (selectedIds: string[], availableLots: any[]) => {
      return selectedIds.map(id => {
        const lot = availableLots.find(l => l._id === id);
        if (!lot) return null;
        return {
          filing: lot.filing,
          lot: lot.lot,
          width: lot.width,
          length: lot.length,
          price: lot.price
        };
      }).filter(Boolean);
    };

    const getInteriorInputs = (selectedIds: string[], availableInteriors: any[]) => {
      return selectedIds.map(id => {
        const interior = availableInteriors.find(int => int._id === id);
        if (!interior) return null;
        return {
          name: interior.name,
          totalPrice: interior.totalPrice,
          fixtures: interior.fixtures || [],
          lvp: interior.lvp || [],
          carpet: interior.carpet || [],
          backsplash: interior.backsplash || [],
          masterBathTile: interior.masterBathTile || [],
          countertop: interior.countertop || [],
          primaryCabinets: interior.primaryCabinets || [],
          secondaryCabinets: interior.secondaryCabinets || [],
          upgrade: interior.upgrade || false
        };
      }).filter(Boolean);
    };

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
      elevations: getOptionInputs(selectedOptions.elevations, options),
      interiors: getInteriorInputs(selectedOptions.interiors, interiors),
      structural: getOptionInputs(selectedOptions.structural, options),
      additional: getOptionInputs(selectedOptions.additional, options),
      kitchenAppliance: getOptionInputs(selectedOptions.kitchenAppliance, options),
      laundryAppliance: getOptionInputs(selectedOptions.laundryAppliance, options),
      lotPremium: getLotPremiumInputs(selectedOptions.lotPremiums, lotPremiums)
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

  const handleOptionSelectionChange = (category: keyof typeof selectedOptions, selectedIds: string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: selectedIds
    }));
  };

  // Calculate current plan pricing
  const currentPricing = calculatePlanTotalPricing(
    formData.basePrice || 0,
    selectedOptions,
    {
      options,
      interiors,
      lotPremiums
    }
  );

  const priceBreakdown = getPriceBreakdown(currentPricing);
  const totalSelectedOptions = getSelectedOptionsCount(selectedOptions);

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
                          {formatPriceDisplay(plan.basePrice)}
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
      <Modal show={showModal} onHide={handleCloseModal} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex justify-content-between align-items-center w-100">
            <span>{isEditing ? 'Edit Floor Plan' : 'Create New Floor Plan'}</span>
            <div className="d-flex align-items-center gap-3">
              {totalSelectedOptions > 0 && (
                <Badge bg="info">
                  {totalSelectedOptions} options selected
                </Badge>
              )}
              <div className="text-end">
                <div className="small text-muted">Estimated Total</div>
                <div className="fw-bold text-primary h5 mb-0">
                  {formatPrice(currentPricing.grandTotal)}
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="tabs-container">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'basic')}
                className="mb-4"
              >
              <Tab eventKey="basic" title="Basic Info">
                <div className="basic-info-tab">
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
                </div>
              </Tab>

              <Tab eventKey="elevations" title="Elevations">
                <OptionSelector
                  title="Elevation Options"
                  options={options.filter(opt => opt.classification === 'elevation')}
                  selectedIds={selectedOptions.elevations}
                  onSelectionChange={(ids) => handleOptionSelectionChange('elevations', ids)}
                  type="option"
                  multiSelect={true}
                />
              </Tab>

              <Tab eventKey="interiors" title="Interior Packages">
                <OptionSelector
                  title="Interior Package Options"
                  options={interiors}
                  selectedIds={selectedOptions.interiors}
                  onSelectionChange={(ids) => handleOptionSelectionChange('interiors', ids)}
                  type="interior"
                  multiSelect={true}
                />
              </Tab>

              <Tab eventKey="structural" title="Structural">
                <OptionSelector
                  title="Structural Options"
                  options={options.filter(opt => opt.classification === 'structural')}
                  selectedIds={selectedOptions.structural}
                  onSelectionChange={(ids) => handleOptionSelectionChange('structural', ids)}
                  type="option"
                  multiSelect={true}
                />
              </Tab>

              <Tab eventKey="additional" title="Additional">
                <OptionSelector
                  title="Additional Options"
                  options={options.filter(opt => opt.classification === 'additional')}
                  selectedIds={selectedOptions.additional}
                  onSelectionChange={(ids) => handleOptionSelectionChange('additional', ids)}
                  type="option"
                  multiSelect={true}
                />
              </Tab>

              <Tab eventKey="appliances" title="Appliances">
                <Row>
                  <Col md={6}>
                    <OptionSelector
                      title="Kitchen Appliances"
                      options={options.filter(opt => opt.classification === 'kitchen-appliance')}
                      selectedIds={selectedOptions.kitchenAppliance}
                      onSelectionChange={(ids) => handleOptionSelectionChange('kitchenAppliance', ids)}
                      type="option"
                      multiSelect={true}
                    />
                  </Col>
                  <Col md={6}>
                    <OptionSelector
                      title="Laundry Appliances"
                      options={options.filter(opt => opt.classification === 'laundry-appliance')}
                      selectedIds={selectedOptions.laundryAppliance}
                      onSelectionChange={(ids) => handleOptionSelectionChange('laundryAppliance', ids)}
                      type="option"
                      multiSelect={true}
                    />
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="lots" title="Lot Premiums">
                <OptionSelector
                  title="Available Lot Premiums"
                  options={lotPremiums}
                  selectedIds={selectedOptions.lotPremiums}
                  onSelectionChange={(ids) => handleOptionSelectionChange('lotPremiums', ids)}
                  type="lot"
                  multiSelect={true}
                />
              </Tab>

              <Tab eventKey="pricing" title="Pricing Summary">
                <div className="pricing-summary">
                  <Row>
                    <Col md={8}>
                      <h5 className="mb-3">Price Breakdown</h5>
                      <Table striped>
                        <tbody>
                          {priceBreakdown.map((item, index) => (
                            <tr key={index} className={item.isBase ? 'table-primary' : ''}>
                              <td className={item.isBase ? 'fw-bold' : ''}>{item.label}</td>
                              <td className="text-end">
                                <span className={item.isBase ? 'fw-bold' : ''}>
                                  {formatPrice(item.amount)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="table-success">
                            <td className="fw-bold">Grand Total</td>
                            <td className="text-end fw-bold h5">
                              {formatPrice(currentPricing.grandTotal)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </Col>
                    <Col md={4}>
                      <div className="summary-card">
                        <Card className="bg-light">
                          <Card.Body>
                            <h6 className="mb-3">Selection Summary</h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Elevations:</span>
                              <Badge bg="secondary">{selectedOptions.elevations.length}</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Interior Packages:</span>
                              <Badge bg="secondary">{selectedOptions.interiors.length}</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Structural:</span>
                              <Badge bg="secondary">{selectedOptions.structural.length}</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Additional:</span>
                              <Badge bg="secondary">{selectedOptions.additional.length}</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Kitchen Appliances:</span>
                              <Badge bg="secondary">{selectedOptions.kitchenAppliance.length}</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Laundry Appliances:</span>
                              <Badge bg="secondary">{selectedOptions.laundryAppliance.length}</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                              <span>Lot Premiums:</span>
                              <Badge bg="secondary">{selectedOptions.lotPremiums.length}</Badge>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                              <strong>Total Options:</strong>
                              <Badge bg="primary">{totalSelectedOptions}</Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Tab>
              </Tabs>
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
    </Container>
  );
};

export default AdminPlanManager;