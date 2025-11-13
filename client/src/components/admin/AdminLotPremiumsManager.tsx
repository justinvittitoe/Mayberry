import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOTS } from '../../graphQl/queries';
import { CREATE_LOT, UPDATE_LOT, DELETE_LOT } from '../../graphQl/mutations';

interface Lot {
  _id: string;
  filing: number;
  lot: number;
  width: number;
  length: number;
  lotSqft: number;
  streetNumber: string;
  streetName: string;
  garageDir: string;
  parcelNumber: string;
  notes?: string;
  isActive: boolean;
}

const AdminLotPremiumsManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_LOTS);
  const [createLot] = useMutation(CREATE_LOT);
  const [updateLot] = useMutation(UPDATE_LOT);
  const [deleteLot] = useMutation(DELETE_LOT);

  const [showModal, setShowModal] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [formData, setFormData] = useState({
    filing: 0,
    lot: 0,
    width: 0,
    length: 0,
    streetNumber: '',
    streetName: '',
    garageDir: '',
    parcelNumber: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const lots = data?.lots || [];

  const handleShowModal = (lot?: Lot) => {
    if (lot) {
      setEditingLot(lot);
      setFormData({
        filing: lot.filing,
        lot: lot.lot,
        width: lot.width,
        length: lot.length,
        streetNumber: lot.streetNumber,
        streetName: lot.streetName,
        garageDir: lot.garageDir,
        parcelNumber: lot.parcelNumber,
        notes: lot.notes || ''
      });
    } else {
      setEditingLot(null);
      setFormData({
        filing: 0,
        lot: 0,
        width: 0,
        length: 0,
        streetNumber: '',
        streetName: '',
        garageDir: '',
        parcelNumber: '',
        notes: ''
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLot(null);
    setFormError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['filing', 'lot', 'width', 'length'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!formData.filing || !formData.lot) {
      setFormError('Filing and lot number are required');
      setSubmitting(false);
      return;
    }

    try {
      const lotInput = {
        filing: formData.filing,
        lot: formData.lot,
        width: formData.width,
        length: formData.length,
        lotSqft: formData.width * formData.length,
        streetNumber: formData.streetNumber,
        streetName: formData.streetName,
        garageDir: formData.garageDir,
        parcelNumber: formData.parcelNumber,
        notes: formData.notes || undefined,
        isActive: true
      };

      if (editingLot) {
        await updateLot({
          variables: {
            id: editingLot._id,
            lot: lotInput
          }
        });
      } else {
        await createLot({
          variables: {
            lot: lotInput
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

  const handleDelete = async (lotId: string, filing: number, lot: number) => {
    if (window.confirm(`Are you sure you want to delete lot "${lot}" in filing "${filing}"?`)) {
      try {
        await deleteLot({
          variables: { id: lotId }
        });
        await refetch();
      } catch (err: any) {
        alert(`Error deleting lot: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading lots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading lots: {error.message}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Lot Management</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Lot
        </Button>
      </div>

      <Card>
        <Card.Body>
          {lots.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No lots found. Add your first lot to get started.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Filing</th>
                  <th>Lot</th>
                  <th>Address</th>
                  <th>Dimensions</th>
                  <th>Square Footage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot: Lot) => (
                  <tr key={lot._id}>
                    <td className="fw-semibold">{lot.filing}</td>
                    <td>
                      <span className="badge bg-info">{lot.lot}</span>
                    </td>
                    <td>{lot.streetNumber} {lot.streetName}</td>
                    <td>{lot.width}' × {lot.length}'</td>
                    <td>{lot.lotSqft.toLocaleString()} sq ft</td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(lot)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(lot._id, lot.filing, lot.lot)}
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
            {editingLot ? 'Edit Lot' : 'Add New Lot'}
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
                    type="number"
                    name="filing"
                    value={formData.filing}
                    onChange={handleInputChange}
                    placeholder="e.g., 1, 2, 3"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lot Number *</Form.Label>
                  <Form.Control
                    type="number"
                    name="lot"
                    value={formData.lot}
                    onChange={handleInputChange}
                    placeholder="e.g., 101"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Street Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 123"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Street Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="streetName"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    placeholder="e.g., Main Street"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lot Width (ft) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lot Length (ft) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Garage Direction *</Form.Label>
                  <Form.Control
                    type="text"
                    name="garageDir"
                    value={formData.garageDir}
                    onChange={handleInputChange}
                    placeholder="e.g., Front, Side, Rear"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Parcel Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="parcelNumber"
                    value={formData.parcelNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 123-456-789"
                    required
                  />
                </Form.Group>

                {formData.width > 0 && formData.length > 0 && (
                  <Alert variant="info">
                    <strong>Total Square Footage:</strong> {(formData.width * formData.length).toLocaleString()} sq ft
                  </Alert>
                )}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Optional notes about this lot"
              />
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
                  {editingLot ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingLot ? 'Update Lot' : 'Create Lot'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminLotPremiumsManager;