import React, { useState, useMemo } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col, Badge, ButtonGroup } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_OPTIONS } from '../../utils/queries';
import { CREATE_OPTION, UPDATE_OPTION, DELETE_OPTION } from '../../utils/mutations';
import { cleanOptionForMutation } from '../../utils/cleanGraphQLObject';
import { InteriorOption, Option, Structural } from '../../models/graphql';


const AdminOptionsManager = () => {
  const { loading, error, data, refetch } = useQuery<Option | null>(GET_OPTIONS);
  const [createOption] = useMutation(CREATE_OPTION);
  const [updateOption] = useMutation(UPDATE_OPTION);
  const [deleteOption] = useMutation(DELETE_OPTION);

  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState<Option | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    classification: '',
    description: '',
    img: '',
    svgPath: '',
    supportsColorSchemes: false,
    width: 0,
    length: 0
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filtering state
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const options = data || [];

  // Get unique classifications for filtering
  const classifications = useMemo(() => {
    const uniqueClassifications = Array.from(new Set(options.map((option: Option) => option.classification)));
    return uniqueClassifications.sort();
  }, [options]);

  // Filter options based on classification and search term
  const filteredOptions = useMemo(() => {
    return options.filter((option: Option) => {
      const matchesClassification = selectedClassification === 'all' || option.classification === selectedClassification;
      const matchesSearch = searchTerm === '' || 
        option.name.toLowerCase().includes(searchTerm.toLowerCase());
        
      
      return matchesClassification && matchesSearch;
    });
  }, [options, selectedClassification, searchTerm]);

  // Get counts by classification
  const classificationCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: options.length };
    classifications.forEach(classification => {
      counts[classification] = options.filter((option: Option) => option.classification === classification).length;
    });
    return counts;
  }, [options, classifications]);

  const handleShowModal = (option?: Option) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        name: option.name,
        price: option.price,
        classification: option.classification,
        description: option.description,
        img: option.img,
        svgPath: (option as any).svgPath || '',
        supportsColorSchemes: (option as any).supportsColorSchemes || false,
        width: (option as any).width || 0,
        length: (option as any).length || 0
      });
    } else {
      setEditingOption(null);
      setFormData({
        name: '',
        price: 0,
        classification: selectedClassification !== 'all' ? selectedClassification : '',
        description: '',
        img: '',
        svgPath: '',
        supportsColorSchemes: false,
        width: 0,
        length: 0
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
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'width' || name === 'length' ? parseFloat(value) || 0 : value
      }));
    }
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
        <p className="mt-2">Loading options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading options: {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Options Management</h3>
          <p className="text-muted mb-0">Manage elevations, structural options, appliances, and more</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Option
        </Button>
      </div>

      {/* Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group className="mb-0">
                <Form.Label>Search Options</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-0">
                <Form.Label>Filter by Classification</Form.Label>
                <ButtonGroup className="w-100">
                  <Button
                    variant={selectedClassification === 'all' ? 'primary' : 'outline-primary'}
                    onClick={() => setSelectedClassification('all')}
                    className="text-nowrap"
                  >
                    All ({classificationCounts.all})
                  </Button>
                  {classifications.map(classification => (
                    <Button
                      key={classification}
                      variant={selectedClassification === classification ? 'primary' : 'outline-primary'}
                      onClick={() => setSelectedClassification(classification)}
                      className="text-nowrap"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {classification.replace('_', ' ')} ({classificationCounts[classification] || 0})
                    </Button>
                  ))}
                </ButtonGroup>
              </Form.Group>
            </Col>
          </Row>
          
          {/* Active filters display */}
          {(selectedClassification !== 'all' || searchTerm) && (
            <div className="mt-3">
              <small className="text-muted">Active filters:</small>
              <div className="d-flex gap-2 mt-1">
                {selectedClassification !== 'all' && (
                  <Badge bg="primary" className="d-flex align-items-center gap-1">
                    Classification: {selectedClassification.replace('_', ' ')}
                    <button 
                      className="btn-close btn-close-white" 
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setSelectedClassification('all')}
                    />
                  </Badge>
                )}
                {searchTerm && (
                  <Badge bg="primary" className="d-flex align-items-center gap-1">
                    Search: "{searchTerm}"
                    <button 
                      className="btn-close btn-close-white" 
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Options ({filteredOptions.length}
              {filteredOptions.length !== options.length && ` of ${options.length}`})
            </h5>
            {filteredOptions.length !== options.length && (
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => {
                  setSelectedClassification('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {filteredOptions.length === 0 ? (
            <div className="text-center py-4 text-muted">
              {options.length === 0 
                ? "No options found. Add your first option to get started."
                : "No options match your current filters. Try adjusting your search or classification filter."
              }
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Classification</th>
                  <th>Price</th>
                  <th>Features</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOptions.map((option: Option) => (
                  <tr key={option._id}>
                    <td className="fw-semibold">{option.name}</td>
                    <td>
                      <Badge bg="secondary">{option.classification.replace('_', ' ')}</Badge>
                    </td>
                    <td>${option.price.toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {(option as any).supportsColorSchemes && (
                          <Badge bg="info" title="Supports color schemes">🎨</Badge>
                        )}
                        {(option as any).svgPath && (
                          <Badge bg="success" title="Has SVG">📐</Badge>
                        )}
                        {option.img && (
                          <Badge bg="warning" title="Has image">🖼️</Badge>
                        )}
                        {((option as any).width || (option as any).length) && (
                          <Badge bg="dark" title={`${(option as any).width || 0}×${(option as any).length || 0}`}>📏</Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                      {option.description}
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingOption ? 'Edit Option' : 'Add New Option'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formError && (
              <Alert variant="danger">{formError}</Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Classification *</Form.Label>
                  <Form.Select
                    name="classification"
                    value={formData.classification}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select classification...</option>
                    <option value="elevation">Elevation</option>
                    <option value="structural">Structural</option>
                    <option value="additional">Additional</option>
                    <option value="kitchen-appliance">Kitchen Appliance</option>
                    <option value="laundry-appliance">Laundry Appliance</option>
                    <option value="fixture">Fixture</option>
                    <option value="flooring">Flooring</option>
                    <option value="countertop">Countertop</option>
                    <option value="cabinet">Cabinet</option>
                    <option value="tile">Tile</option>
                    <option value="backsplash">Backsplash</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Width (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Length (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
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
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>SVG Path (for elevations)</Form.Label>
              <Form.Control
                type="text"
                name="svgPath"
                value={formData.svgPath}
                onChange={handleInputChange}
                placeholder="path/to/elevation.svg"
              />
              <Form.Text className="text-muted">
                Used for color-customizable elevation previews
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="supportsColorSchemes"
                checked={formData.supportsColorSchemes}
                onChange={handleInputChange}
                label="Supports Color Schemes"
              />
              <Form.Text className="text-muted">
                Check if this option can be colored with different color schemes (usually elevations)
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
                editingOption ? 'Update Option' : 'Create Option'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOptionsManager;