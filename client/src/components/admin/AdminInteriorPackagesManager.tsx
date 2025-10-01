import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INTERIOR_PACKAGES } from '../../utils/queries';
import { CREATE_INTERIOR_PACKAGE, UPDATE_INTERIOR_PACKAGE, DELETE_INTERIOR_PACKAGE } from '../../utils/mutations';
import { cleanInteriorPackageForMutation } from '../../utils/cleanGraphQLObject';
import { InteriorPackage } from '../../models/graphql';


const AdminInteriorPackagesManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_INTERIOR_PACKAGES);
  const [createInteriorPackage] = useMutation(CREATE_INTERIOR_PACKAGE);
  const [updateInteriorPackage] = useMutation(UPDATE_INTERIOR_PACKAGE);
  const [deleteInteriorPackage] = useMutation(DELETE_INTERIOR_PACKAGE);

  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<InteriorPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    totalPrice: 0,
    fitures: '',
    lvp: '',
    carpet: '',
    kitchenBackspash: '',
    masterBathTile: '',
    countertop: '',
    primaryCabinets: '',
    secondaryCabinets: '',
    upgrade: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const packages = data?.interiorPackages || [];

  // Helper function to safely render array of objects or fallback
  const renderOptionArray = (items: any[] | string): string => {
    if (typeof items === 'string') return items;
    if (!Array.isArray(items) || items.length === 0) return 'None';
    return items.map(item => typeof item === 'string' ? item : item?.name || 'Unknown').join(', ');
  };

  // Helper function to clean GraphQL objects
  const cleanGraphQLObject = (obj: any) => {
    if (!obj || typeof obj !== 'object') return obj;
    const { __typename, ...cleaned } = obj;
    return cleaned;
  };

  const handleShowModal = (pkg?: InteriorPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: typeof pkg.name === 'string' ? pkg.name : '',
        totalPrice: typeof pkg.totalPrice === 'number' ? pkg.totalPrice : 0,
        fitures: renderOptionArray(pkg.fixtures || ''),
        lvp: renderOptionArray(pkg.lvp || ''),
        carpet: renderOptionArray(pkg.carpet || ''),
        kitchenBackspash: renderOptionArray(pkg.backsplash || ''),
        masterBathTile: renderOptionArray(pkg.masterBathTile || ''),
        countertop: renderOptionArray(pkg.countertop || ''),
        primaryCabinets: renderOptionArray(pkg.primaryCabinets || ''),
        secondaryCabinets: renderOptionArray(pkg.secondaryCabinets || ''),
        upgrade: typeof pkg.upgrade === 'boolean' ? (pkg.upgrade ? 'Yes' : 'No') : (pkg.upgrade || '')
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        totalPrice: 0,
        fitures: '',
        lvp: '',
        carpet: '',
        kitchenBackspash: '',
        masterBathTile: '',
        countertop: '',
        primaryCabinets: '',
        secondaryCabinets: '',
        upgrade: ''
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPackage(null);
    setFormError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalPrice' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!formData.name) {
      setFormError('Package name is required');
      setSubmitting(false);
      return;
    }

    try {
      const cleanedPackage = cleanInteriorPackageForMutation(formData);
      
      if (editingPackage) {
        await updateInteriorPackage({
          variables: {
            id: editingPackage._id,
            interiorPackage: cleanedPackage
          }
        });
      } else {
        await createInteriorPackage({
          variables: {
            interiorPackage: cleanedPackage
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

  const handleDelete = async (packageId: string, packageName: string) => {
    if (window.confirm(`Are you sure you want to delete "${packageName}"?`)) {
      try {
        await deleteInteriorPackage({
          variables: { id: packageId }
        });
        await refetch();
      } catch (err: any) {
        alert(`Error deleting package: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading interior packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading interior packages: {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Interior Packages Management</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Package
        </Button>
      </div>

      <Card>
        <Card.Body>
          {packages.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No interior packages found. Add your first package to get started.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Price</th>
                  <th>Fixtures</th>
                  <th>Flooring</th>
                  <th>Cabinets</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg: InteriorPackage) => (
                  <tr key={pkg._id}>
                    <td className="fw-semibold">{typeof pkg.name === 'string' ? pkg.name : 'Unknown Package'}</td>
                    <td>${typeof pkg.totalPrice === 'number' ? pkg.totalPrice.toLocaleString() : '0'}</td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {renderOptionArray(pkg.fixtures || '')}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      LVP: {renderOptionArray(pkg.lvp || 'NO LVP')}, Carpet: {renderOptionArray(pkg.carpet || 'NO CARPET')}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {renderOptionArray(pkg.primaryCabinets || 'NO PRIMARY CABINETS')}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {renderOptionArray(pkg.secondaryCabinets || 'NO SECONDARY CABINETS')}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(pkg)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(pkg._id, pkg.name)}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPackage ? 'Edit Interior Package' : 'Add New Interior Package'}
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
                  <Form.Label>Package Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fixtures</Form.Label>
                  <Form.Control
                    type="text"
                    name="fitures"
                    value={formData.fitures}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>LVP Flooring</Form.Label>
                  <Form.Control
                    type="text"
                    name="lvp"
                    value={formData.lvp}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Carpet</Form.Label>
                  <Form.Control
                    type="text"
                    name="carpet"
                    value={formData.carpet}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kitchen Backsplash</Form.Label>
                  <Form.Control
                    type="text"
                    name="kitchenBackspash"
                    value={formData.kitchenBackspash}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Master Bath Tile</Form.Label>
                  <Form.Control
                    type="text"
                    name="masterBathTile"
                    value={formData.masterBathTile}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Countertop</Form.Label>
                  <Form.Control
                    type="text"
                    name="countertop"
                    value={formData.countertop}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Primary Cabinets</Form.Label>
                  <Form.Control
                    type="text"
                    name="primaryCabinets"
                    value={formData.primaryCabinets}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Secondary Cabinets</Form.Label>
                  <Form.Control
                    type="text"
                    name="secondaryCabinets"
                    value={formData.secondaryCabinets}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upgrade</Form.Label>
                  <Form.Control
                    type="text"
                    name="upgrade"
                    value={formData.upgrade}
                    onChange={handleInputChange}
                  />
                </Form.Group>
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
                  {editingPackage ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingPackage ? 'Update Package' : 'Create Package'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminInteriorPackagesManager;