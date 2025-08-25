import React, { useState, useMemo } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col, Badge, ButtonGroup, Tabs, Tab } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_OPTIONS } from '../utils/queries';
import { CREATE_OPTION, UPDATE_OPTION, DELETE_OPTION } from '../utils/mutations';
import { cleanOptionForMutation } from '../utils/cleanGraphQLObject';

interface InteriorOption {
  _id: string;
  name: string;
  price: number;
  classification: string;
  description: string;
  img: string;
}

const INTERIOR_CLASSIFICATIONS = [
  { key: 'fixture', label: 'Fixtures', description: 'Light fixtures, faucets, hardware' },
  { key: 'flooring', label: 'Flooring', description: 'LVP, hardwood, carpet options' },
  { key: 'countertop', label: 'Countertops', description: 'Kitchen and bathroom countertops' },
  { key: 'cabinet', label: 'Cabinets', description: 'Kitchen and bathroom cabinetry' },
  { key: 'tile', label: 'Tile', description: 'Bathroom and kitchen tile' },
  { key: 'backsplash', label: 'Backsplash', description: 'Kitchen backsplash options' }
];

const AdminInteriorOptionsManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_OPTIONS);
  const [createOption] = useMutation(CREATE_OPTION);
  const [updateOption] = useMutation(UPDATE_OPTION);
  const [deleteOption] = useMutation(DELETE_OPTION);

  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState<InteriorOption | null>(null);
  const [activeTab, setActiveTab] = useState('fixture');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    classification: 'fixture',
    description: '',
    img: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allOptions = data?.options || [];
  
  // Filter to only interior options
  const interiorOptions = useMemo(() => {
    const interiorClassifications = INTERIOR_CLASSIFICATIONS.map(ic => ic.key);
    return allOptions.filter((option: InteriorOption) => 
      interiorClassifications.includes(option.classification)
    );
  }, [allOptions]);

  // Filter options by active tab and search
  const filteredOptions = useMemo(() => {
    return interiorOptions.filter((option: InteriorOption) => {
      const matchesTab = option.classification === activeTab;
      const matchesSearch = searchTerm === '' || 
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [interiorOptions, activeTab, searchTerm]);

  // Get counts by classification
  const classificationCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    INTERIOR_CLASSIFICATIONS.forEach(ic => {
      counts[ic.key] = interiorOptions.filter((option: InteriorOption) => option.classification === ic.key).length;
    });
    return counts;
  }, [interiorOptions]);

  const handleShowModal = (option?: InteriorOption) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        name: option.name,
        price: option.price,
        classification: option.classification,
        description: option.description,
        img: option.img
      });
    } else {
      setEditingOption(null);
      setFormData({
        name: '',
        price: 0,
        classification: activeTab,
        description: '',
        img: ''
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOption(null);
    setFormError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!formData.name || !formData.classification) {
      setFormError('Name and classification are required');
      setSubmitting(false);
      return;
    }

    try {
      const cleanedOption = cleanOptionForMutation(formData);
      
      if (editingOption) {
        await updateOption({
          variables: {
            id: editingOption._id,
            option: cleanedOption
          }
        });
      } else {
        await createOption({
          variables: {
            option: cleanedOption
          }
        });
      }
      
      await refetch();
      handleCloseModal();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (optionId: string, optionName: string) => {
    if (window.confirm(`Are you sure you want to delete "${optionName}"?`)) {
      try {
        await deleteOption({
          variables: { id: optionId }
        });
        await refetch();
      } catch (err: any) {
        alert(`Error deleting option: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading interior options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading interior options: {error.message}
      </Alert>
    );
  }

  const currentClassification = INTERIOR_CLASSIFICATIONS.find(ic => ic.key === activeTab);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Interior Options Management</h3>
          <p className="text-muted mb-0">Manage individual interior components for custom packages</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New {currentClassification?.label.slice(0, -1) || 'Option'}
        </Button>
      </div>

      {/* Search Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group className="mb-0">
                <Form.Label>Search {currentClassification?.label}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Search ${currentClassification?.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="text-end">
              <div className="small text-muted">
                {filteredOptions.length} of {classificationCounts[activeTab] || 0} {currentClassification?.label.toLowerCase()}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Interior Type Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k || 'fixture');
          setSearchTerm(''); // Clear search when switching tabs
        }}
        className="mb-4"
      >
        {INTERIOR_CLASSIFICATIONS.map(classification => (
          <Tab
            key={classification.key}
            eventKey={classification.key}
            title={
              <div className="d-flex align-items-center gap-2">
                <span>{classification.label}</span>
                <Badge bg="secondary">{classificationCounts[classification.key] || 0}</Badge>
              </div>
            }
          >
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{classification.label}</h5>
                    <small className="text-muted">{classification.description}</small>
                  </div>
                  {searchTerm && (
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                {filteredOptions.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    {classificationCounts[activeTab] === 0 
                      ? `No ${classification.label.toLowerCase()} found. Add your first ${classification.label.toLowerCase().slice(0, -1)} to get started.`
                      : `No ${classification.label.toLowerCase()} match your search. Try a different search term.`
                    }
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOptions.map((option: InteriorOption) => (
                        <tr key={option._id}>
                          <td className="fw-semibold">{option.name}</td>
                          <td>${option.price.toLocaleString()}</td>
                          <td className="text-truncate" style={{ maxWidth: '300px' }}>
                            {option.description}
                          </td>
                          <td>
                            {option.img ? (
                              <Badge bg="success">✓ Has Image</Badge>
                            ) : (
                              <Badge bg="warning">No Image</Badge>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleShowModal(option)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(option._id, option.name)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>
        ))}
      </Tabs>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingOption ? 'Edit' : 'Add New'} {currentClassification?.label.slice(0, -1)}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formError && (
              <Alert variant="danger">{formError}</Alert>
            )}
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`e.g., Premium ${currentClassification?.label.slice(0, -1)}`}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Classification</Form.Label>
              <Form.Select
                name="classification"
                value={formData.classification}
                onChange={handleInputChange}
                required
              >
                {INTERIOR_CLASSIFICATIONS.map(ic => (
                  <option key={ic.key} value={ic.key}>{ic.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={`Describe this ${currentClassification?.label.slice(0, -1).toLowerCase()}...`}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="img"
                value={formData.img}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <Form.Text className="text-muted">
                Provide a URL to an image showing this {currentClassification?.label.slice(0, -1).toLowerCase()}
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingOption ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingOption ? `Update ${currentClassification?.label.slice(0, -1)}` : `Create ${currentClassification?.label.slice(0, -1)}`
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminInteriorOptionsManager;