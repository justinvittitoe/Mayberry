import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INTERIOR_PACKAGES } from '../utils/queries';
import { CREATE_INTERIOR_PACKAGE, UPDATE_INTERIOR_PACKAGE, DELETE_INTERIOR_PACKAGE } from '../utils/mutations';

interface InteriorPackage {
  _id: string;
  name: string;
  totalPrice: number;
  fitures: string;
  lvp: string;
  carpet: string;
  kitchenBackspash: string;
  masterBathTile: string;
  countertop: string;
  primaryCabinets: string;
  secondaryCabinets: string;
  upgrade: string;
}

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

  const handleShowModal = (pkg?: InteriorPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        totalPrice: pkg.totalPrice,
        fitures: pkg.fitures,
        lvp: pkg.lvp,
        carpet: pkg.carpet,
        kitchenBackspash: pkg.kitchenBackspash,
        masterBathTile: pkg.masterBathTile,
        countertop: pkg.countertop,
        primaryCabinets: pkg.primaryCabinets,
        secondaryCabinets: pkg.secondaryCabinets,
        upgrade: pkg.upgrade
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
      if (editingPackage) {
        await updateInteriorPackage({
          variables: {
            id: editingPackage._id,
            interiorPackage: formData
          }
        });
      } else {
        await createInteriorPackage({
          variables: {
            interiorPackage: formData
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
                    <td className="fw-semibold">{pkg.name}</td>
                    <td>${pkg.totalPrice.toLocaleString()}</td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {pkg.fitures}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      LVP: {pkg.lvp}, Carpet: {pkg.carpet}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {pkg.primaryCabinets}
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