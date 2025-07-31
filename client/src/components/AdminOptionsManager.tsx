import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_OPTIONS } from '../utils/queries';
import { CREATE_OPTION, UPDATE_OPTION, DELETE_OPTION } from '../utils/mutations';

interface Option {
  _id: string;
  name: string;
  price: number;
  classification: string;
  description: string;
  img: string;
}

const AdminOptionsManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_OPTIONS);
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
    img: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const options = data?.options || [];

  const handleShowModal = (option?: Option) => {
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
        classification: '',
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
      if (editingOption) {
        await updateOption({
          variables: {
            id: editingOption._id,
            option: formData
          }
        });
      } else {
        await createOption({
          variables: {
            option: formData
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
        <h3>Options Management</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Option
        </Button>
      </div>

      <Card>
        <Card.Body>
          {options.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No options found. Add your first option to get started.
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Classification</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option: Option) => (
                  <tr key={option._id}>
                    <td className="fw-semibold">{option.name}</td>
                    <td>
                      <span className="badge bg-secondary">{option.classification}</span>
                    </td>
                    <td>${option.price.toLocaleString()}</td>
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
                <option value="kitchen_appliance">Kitchen Appliance</option>
                <option value="laundry_appliance">Laundry Appliance</option>
              </Form.Select>
            </Form.Group>

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