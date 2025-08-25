import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COLOR_SCHEMES } from '../utils/queries';
import { CREATE_COLOR_SCHEME, UPDATE_COLOR_SCHEME, DELETE_COLOR_SCHEME } from '../utils/mutations';
import { getColorPalette, createGradientFromPalette } from '../utils/colorService';
import { cleanColorSchemeForMutation } from '../utils/cleanGraphQLObject';

interface ColorScheme {
  _id: string;
  name: string;
  description: string;
  price: number;
  colorValues: {
    primary: string;
    secondary: string;
    roof: string;
    accent: string;
    foundation?: string;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const AdminColorSchemeManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_COLOR_SCHEMES);
  const [createColorScheme] = useMutation(CREATE_COLOR_SCHEME);
  const [updateColorScheme] = useMutation(UPDATE_COLOR_SCHEME);
  const [deleteColorScheme] = useMutation(DELETE_COLOR_SCHEME);

  const [showModal, setShowModal] = useState(false);
  const [editingColorScheme, setEditingColorScheme] = useState<ColorScheme | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    colorValues: {
      primary: '#8B4513',
      secondary: '#FFFFFF',
      roof: '#2F2F2F',
      accent: '#1E3A8A',
      foundation: '#696969'
    },
    isActive: true,
    sortOrder: 0
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const colorSchemes = data?.colorSchemes || [];

  const handleShowModal = (colorScheme?: ColorScheme) => {
    if (colorScheme) {
      setEditingColorScheme(colorScheme);
      setFormData({
        name: colorScheme.name,
        description: colorScheme.description || '',
        price: colorScheme.price,
        colorValues: colorScheme.colorValues,
        isActive: colorScheme.isActive,
        sortOrder: colorScheme.sortOrder || 0
      });
    } else {
      setEditingColorScheme(null);
      const maxSortOrder = colorSchemes.length > 0 ? Math.max(...colorSchemes.map((cs: ColorScheme) => cs.sortOrder || 0)) : 0;
      setFormData({
        name: '',
        description: '',
        price: 0,
        colorValues: {
          primary: '#8B4513',
          secondary: '#FFFFFF',
          roof: '#2F2F2F',
          accent: '#1E3A8A',
          foundation: '#696969'
        },
        isActive: true,
        sortOrder: maxSortOrder + 1
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingColorScheme(null);
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
    } else if (name.startsWith('colorValues.')) {
      const colorKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        colorValues: {
          ...prev.colorValues,
          [colorKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'sortOrder' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!formData.name) {
      setFormError('Name is required');
      setSubmitting(false);
      return;
    }

    // Validate hex colors
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const colorValues = formData.colorValues;
    
    if (!hexColorRegex.test(colorValues.primary) || 
        !hexColorRegex.test(colorValues.secondary) || 
        !hexColorRegex.test(colorValues.roof) || 
        !hexColorRegex.test(colorValues.accent) ||
        (colorValues.foundation && !hexColorRegex.test(colorValues.foundation))) {
      setFormError('All colors must be valid hex codes (e.g., #FF0000)');
      setSubmitting(false);
      return;
    }

    try {
      const colorSchemeInput = cleanColorSchemeForMutation(formData);

      if (editingColorScheme) {
        await updateColorScheme({
          variables: {
            id: editingColorScheme._id,
            colorScheme: colorSchemeInput
          }
        });
      } else {
        await createColorScheme({
          variables: {
            colorScheme: colorSchemeInput
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

  const handleDelete = async (colorSchemeId: string, colorSchemeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${colorSchemeName}"?`)) {
      try {
        await deleteColorScheme({
          variables: { id: colorSchemeId }
        });
        await refetch();
      } catch (err: any) {
        alert(`Error deleting color scheme: ${err.message}`);
      }
    }
  };

  const toggleActive = async (colorScheme: ColorScheme) => {
    try {
      const updatedColorScheme = {
        ...colorScheme,
        isActive: !colorScheme.isActive
      };
      
      await updateColorScheme({
        variables: {
          id: colorScheme._id,
          colorScheme: cleanColorSchemeForMutation(updatedColorScheme)
        }
      });
      await refetch();
    } catch (err: any) {
      alert(`Error updating color scheme: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading color schemes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading color schemes: {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Color Scheme Management</h3>
          <p className="text-muted mb-0">Manage color palettes for home exteriors</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Color Scheme
        </Button>
      </div>

      <Card>
        <Card.Body>
          {colorSchemes.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No color schemes found. Add your first color scheme to get started.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Colors</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Sort Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...colorSchemes]
                  .sort((a: ColorScheme, b: ColorScheme) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((colorScheme: ColorScheme) => {
                    const palette = getColorPalette(colorScheme);
                    const gradient = createGradientFromPalette(palette);
                    
                    return (
                      <tr key={colorScheme._id}>
                        <td>
                          <div 
                            className="color-preview border rounded"
                            style={{ 
                              width: '60px', 
                              height: '40px', 
                              background: gradient 
                            }}
                            title="Color scheme preview"
                          />
                        </td>
                        <td>
                          <div className="fw-semibold">{colorScheme.name}</div>
                          {colorScheme.description && (
                            <div className="small text-muted">{colorScheme.description}</div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            {palette.slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="border rounded"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: color
                                }}
                                title={`${['Primary', 'Secondary', 'Roof', 'Accent'][index]}: ${color}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td>${colorScheme.price.toLocaleString()}</td>
                        <td>
                          <Badge 
                            bg={colorScheme.isActive ? 'success' : 'secondary'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleActive(colorScheme)}
                          >
                            {colorScheme.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>{colorScheme.sortOrder || 0}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleShowModal(colorScheme)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(colorScheme._id, colorScheme.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingColorScheme ? 'Edit Color Scheme' : 'Add New Color Scheme'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formError && (
              <Alert variant="danger">{formError}</Alert>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Classic Farmhouse"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the color scheme"
                  />
                </Form.Group>

                <Row>
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sort Order</Form.Label>
                      <Form.Control
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    label="Active (visible to customers)"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h6 className="mb-3">Color Palette</h6>
                
                <Form.Group className="mb-3">
                  <Form.Label>Primary Color (Main Siding)</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="color"
                      name="colorValues.primary"
                      value={formData.colorValues.primary}
                      onChange={handleInputChange}
                      style={{ width: '50px', height: '38px' }}
                    />
                    <Form.Control
                      type="text"
                      name="colorValues.primary"
                      value={formData.colorValues.primary}
                      onChange={handleInputChange}
                      placeholder="#8B4513"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Secondary Color (Trim)</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="color"
                      name="colorValues.secondary"
                      value={formData.colorValues.secondary}
                      onChange={handleInputChange}
                      style={{ width: '50px', height: '38px' }}
                    />
                    <Form.Control
                      type="text"
                      name="colorValues.secondary"
                      value={formData.colorValues.secondary}
                      onChange={handleInputChange}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Roof Color</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="color"
                      name="colorValues.roof"
                      value={formData.colorValues.roof}
                      onChange={handleInputChange}
                      style={{ width: '50px', height: '38px' }}
                    />
                    <Form.Control
                      type="text"
                      name="colorValues.roof"
                      value={formData.colorValues.roof}
                      onChange={handleInputChange}
                      placeholder="#2F2F2F"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Accent Color (Doors, Shutters)</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="color"
                      name="colorValues.accent"
                      value={formData.colorValues.accent}
                      onChange={handleInputChange}
                      style={{ width: '50px', height: '38px' }}
                    />
                    <Form.Control
                      type="text"
                      name="colorValues.accent"
                      value={formData.colorValues.accent}
                      onChange={handleInputChange}
                      placeholder="#1E3A8A"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Foundation Color (Optional)</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="color"
                      name="colorValues.foundation"
                      value={formData.colorValues.foundation || '#696969'}
                      onChange={handleInputChange}
                      style={{ width: '50px', height: '38px' }}
                    />
                    <Form.Control
                      type="text"
                      name="colorValues.foundation"
                      value={formData.colorValues.foundation || ''}
                      onChange={handleInputChange}
                      placeholder="#696969"
                    />
                  </div>
                </Form.Group>

                {/* Color Preview */}
                <div className="mt-4">
                  <h6>Preview</h6>
                  <div 
                    className="color-preview-large border rounded shadow-sm"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
                      background: createGradientFromPalette(getColorPalette({ colorValues: formData.colorValues } as any))
                    }}
                  />
                  <div className="d-flex justify-content-center mt-2" style={{ gap: '4px' }}>
                    {getColorPalette({ colorValues: formData.colorValues } as any).slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="border rounded"
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: color
                        }}
                        title={`${['Primary', 'Secondary', 'Roof', 'Accent'][index]}: ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingColorScheme ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingColorScheme ? 'Update Color Scheme' : 'Create Color Scheme'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminColorSchemeManager;