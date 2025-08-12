import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOT_PREMIUMS } from '../utils/queries';
import { CREATE_LOT_PREMIUM, UPDATE_LOT_PREMIUM, DELETE_LOT_PREMIUM } from '../utils/mutations';

interface LotPremium {
  _id: string;
  filing: string;
  lot: string;
  width: number;
  length: number;
  price: number;
}

const AdminLotPremiumsManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_LOT_PREMIUMS);
  const [createLotPremium] = useMutation(CREATE_LOT_PREMIUM);
  const [updateLotPremium] = useMutation(UPDATE_LOT_PREMIUM);
  const [deleteLotPremium] = useMutation(DELETE_LOT_PREMIUM);

  const [showModal, setShowModal] = useState(false);
  const [editingLotPremium, setEditingLotPremium] = useState<LotPremium | null>(null);
  const [formData, setFormData] = useState({
    filing: '',
    lot: '',
    width: 0,
    length: 0,
    price: 0
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const lotPremiums = data?.lotPremiums || [];

  const handleShowModal = (lotPremium?: LotPremium) => {
    if (lotPremium) {
      setEditingLotPremium(lotPremium);
      setFormData({
        filing: lotPremium.filing,
        lot: lotPremium.lot,
        width: lotPremium.width,
        length: lotPremium.length,
        price: lotPremium.price
      });
    } else {
      setEditingLotPremium(null);
      setFormData({
        filing: '',
        lot: '',
        width: 0,
        length: 0,
        price: 0
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLotPremium(null);
    setFormError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['width', 'length', 'price'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!formData.filing || !formData.lot) {
      setFormError('Filing and lot are required');
      setSubmitting(false);
      return;
    }

    try {
      if (editingLotPremium) {
        await updateLotPremium({
          variables: {
            id: editingLotPremium._id,
            lotPremium: formData
          }
        });
      } else {
        await createLotPremium({
          variables: {
            lotPremium: formData
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

  const handleDelete = async (lotPremiumId: string, filing: string, lot: string) => {
    if (window.confirm(`Are you sure you want to delete lot "${lot}" in filing "${filing}"?`)) {
      try {
        await deleteLotPremium({
          variables: { id: lotPremiumId }
        });
        await refetch();
      } catch (err: any) {
        alert(`Error deleting lot premium: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading lot premiums...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading lot premiums: {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Lot Premiums Management</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Lot Premium
        </Button>
      </div>

      <Card>
        <Card.Body>
          {lotPremiums.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No lot premiums found. Add your first lot premium to get started.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Filing</th>
                  <th>Lot</th>
                  <th>Dimensions</th>
                  <th>Square Footage</th>
                  <th>Premium Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lotPremiums.map((lotPremium: LotPremium) => (
                  <tr key={lotPremium._id}>
                    <td className="fw-semibold">{lotPremium.filing}</td>
                    <td>
                      <span className="badge bg-info">{lotPremium.lot}</span>
                    </td>
                    <td>{lotPremium.width}' × {lotPremium.length}'</td>
                    <td>{(lotPremium.width * lotPremium.length).toLocaleString()} sq ft</td>
                    <td className={lotPremium.price > 0 ? 'text-success fw-semibold' : 'text-muted'}>
                      {lotPremium.price > 0 ? `+$${lotPremium.price.toLocaleString()}` : 'No premium'}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(lotPremium)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(lotPremium._id, lotPremium.filing, lotPremium.lot)}
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
            {editingLotPremium ? 'Edit Lot Premium' : 'Add New Lot Premium'}
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
                  <Form.Label>Filing *</Form.Label>
                  <Form.Control
                    type="text"
                    name="filing"
                    value={formData.filing}
                    onChange={handleInputChange}
                    placeholder="e.g., Mayberry Phase 1"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lot Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lot"
                    value={formData.lot}
                    onChange={handleInputChange}
                    placeholder="e.g., 101, A-1, etc."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Premium Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <Form.Text className="text-muted">
                    Additional cost for this lot (enter 0 for no premium)
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lot Width (ft)</Form.Label>
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

                <Form.Group className="mb-3">
                  <Form.Label>Lot Length (ft)</Form.Label>
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

                {formData.width > 0 && formData.length > 0 && (
                  <Alert variant="info">
                    <strong>Total Square Footage:</strong> {(formData.width * formData.length).toLocaleString()} sq ft
                  </Alert>
                )}
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
                  {editingLotPremium ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingLotPremium ? 'Update Lot Premium' : 'Create Lot Premium'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminLotPremiumsManager;