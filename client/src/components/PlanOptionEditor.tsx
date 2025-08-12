import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Modal, Badge, Alert, Image } from 'react-bootstrap';
import ImageUpload from './ImageUpload';
import { getLotCompatibilityInfo } from '../utils/lotCompatibility';

interface Option {
  name: string;
  price: number;
  classification?: string;
  description?: string;
  img?: string;
  width?: number;
  length?: number;
}

interface InteriorPackage {
  name: string;
  totalPrice: number;
  fixtures?: Option[];
  lvp?: Option[];
  carpet?: Option[];
  backsplash?: Option[];
  masterBathTile?: Option[];
  countertop?: Option[];
  primaryCabinets?: Option[];
  secondaryCabinets?: Option[];
  upgrade?: boolean;
}

interface LotPremium {
  filing: number;
  lot: number;
  width: number;
  length: number;
  price: number;
}

interface PlanOptionEditorProps {
  title: string;
  options: (Option | InteriorPackage | LotPremium)[];
  onOptionsChange: (options: (Option | InteriorPackage | LotPremium)[]) => void;
  globalOptions: any[];
  type: 'option' | 'interior' | 'lot';
  planDimensions?: { width: number; length: number };
}

const PlanOptionEditor: React.FC<PlanOptionEditorProps> = ({
  title,
  options,
  onOptionsChange,
  globalOptions,
  type,
  planDimensions
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleAddFromGlobal = (globalOption: any) => {
    let newOption: Option | InteriorPackage | LotPremium;
    
    if (type === 'option') {
      newOption = {
        name: globalOption.name,
        price: globalOption.price || globalOption.totalPrice,
        classification: globalOption.classification,
        description: globalOption.description,
        img: globalOption.img,
        width: globalOption.width,
        length: globalOption.length
      };
    } else if (type === 'interior') {
      newOption = {
        name: globalOption.name,
        totalPrice: globalOption.totalPrice,
        fixtures: globalOption.fixtures || [],
        lvp: globalOption.lvp || [],
        carpet: globalOption.carpet || [],
        backsplash: globalOption.backsplash || [],
        masterBathTile: globalOption.masterBathTile || [],
        countertop: globalOption.countertop || [],
        primaryCabinets: globalOption.primaryCabinets || [],
        secondaryCabinets: globalOption.secondaryCabinets || [],
        upgrade: globalOption.upgrade || false
      };
    } else {
      newOption = {
        filing: globalOption.filing,
        lot: globalOption.lot,
        width: globalOption.width,
        length: globalOption.length,
        price: globalOption.price
      };
    }
    
    onOptionsChange([...options, newOption]);
    setShowAddModal(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...options[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    
    const updatedOptions = [...options];
    updatedOptions[editingIndex] = editForm;
    onOptionsChange(updatedOptions);
    setEditingIndex(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to remove this option from the plan?')) {
      const updatedOptions = options.filter((_, i) => i !== index);
      onOptionsChange(updatedOptions);
    }
  };

  const renderOptionCard = (option: Option | InteriorPackage | LotPremium, index: number) => {
    const isEditing = editingIndex === index;
    
    return (
      <Card key={index} className="mb-3">
        <Card.Body>
          {isEditing ? (
            <div>
              {type === 'option' && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </Form.Group>
                  {editForm.classification === 'structural' && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>Width (ft)</Form.Label>
                          <Form.Control
                            type="number"
                            value={editForm.width || ''}
                            onChange={(e) => setEditForm({ ...editForm, width: parseFloat(e.target.value) })}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>Length (ft)</Form.Label>
                          <Form.Control
                            type="number"
                            value={editForm.length || ''}
                            onChange={(e) => setEditForm({ ...editForm, length: parseFloat(e.target.value) })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                  <Form.Group className="mb-3">
                    <ImageUpload
                      currentImage={editForm.img}
                      onImageChange={(imageData) => setEditForm({ ...editForm, img: imageData })}
                      label="Option Image"
                    />
                  </Form.Group>
                </>
              )}
              
              {type === 'interior' && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Package Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Total Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={editForm.totalPrice || ''}
                      onChange={(e) => setEditForm({ ...editForm, totalPrice: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                </>
              )}
              
              {type === 'lot' && (
                <>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Filing</Form.Label>
                        <Form.Control
                          type="number"
                          value={editForm.filing || ''}
                          onChange={(e) => setEditForm({ ...editForm, filing: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Lot</Form.Label>
                        <Form.Control
                          type="number"
                          value={editForm.lot || ''}
                          onChange={(e) => setEditForm({ ...editForm, lot: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Width</Form.Label>
                        <Form.Control
                          type="number"
                          value={editForm.width || ''}
                          onChange={(e) => setEditForm({ ...editForm, width: parseFloat(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Length</Form.Label>
                        <Form.Control
                          type="number"
                          value={editForm.length || ''}
                          onChange={(e) => setEditForm({ ...editForm, length: parseFloat(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                </>
              )}
              
              <div className="d-flex gap-2">
                <Button variant="success" size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">
                    {option && 'name' in option && typeof option.name === 'string' ? option.name : option && 'filing' in option && typeof option.filing === 'number' ? `Filing ${option.filing}, Lot ${option.lot}` : 'Unknown Option'}
                  </h6>
                  <div className="text-success fw-semibold">
                    ${option && 'price' in option && typeof option.price === 'number' ? option.price.toLocaleString() : option && 'totalPrice' in option && typeof option.totalPrice === 'number' ? option.totalPrice.toLocaleString() : '0'}
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(index)}>
                    Remove
                  </Button>
                </div>
              </div>
              
              {type === 'option' && 'description' in option && typeof option.description === 'string' && option.description && (
                <p className="text-muted small mb-0">{option.description}</p>
              )}
              
              {type === 'option' && 'img' in option && typeof option.img === 'string' && option.img && (
                <div className="mt-2">
                  <Image 
                    src={option.img} 
                    alt={typeof option.name === 'string' ? option.name : 'Option image'} 
                    thumbnail 
                    style={{ maxWidth: '150px', maxHeight: '100px' }}
                  />
                </div>
              )}
              
              {type === 'lot' && option && 'width' in option && 'length' in option && typeof option.width === 'number' && typeof option.length === 'number' && (
                <div className="small">
                  <div className="text-muted">
                    Lot Size: {option.width} × {option.length} ft
                  </div>
                  {planDimensions && (
                    <div className="mt-1">
                      <Badge 
                        bg="success" 
                        className="small"
                      >
                        {getLotCompatibilityInfo(planDimensions, option).message}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>{title} <Badge bg="secondary">{options.length}</Badge></h5>
        <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
          Add Option
        </Button>
      </div>

      {options.length === 0 ? (
        <Alert variant="light" className="text-center">
          No options selected for this plan. Click "Add Option" to choose from available options.
        </Alert>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {options.map((option, index) => renderOptionCard(option, index))}
        </div>
      )}

      {/* Add Option Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Select an option to add to this plan. The option will be copied and can be customized independently.
          </p>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {globalOptions && globalOptions.length > 0 ? globalOptions.map((globalOption, index) => (
              <Card key={index} className="mb-2">
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">
                        {typeof globalOption?.name === 'string' ? globalOption.name : (typeof globalOption?.filing === 'number' ? `Filing ${globalOption.filing}, Lot ${globalOption.lot}` : 'Unknown Option')}
                      </div>
                      <div className="text-success">
                        ${typeof globalOption?.price === 'number' ? globalOption.price.toLocaleString() : (typeof globalOption?.totalPrice === 'number' ? globalOption.totalPrice.toLocaleString() : '0')}
                      </div>
                      {typeof globalOption?.description === 'string' && globalOption.description && (
                        <div className="small text-muted">{globalOption.description}</div>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddFromGlobal(globalOption)}
                    >
                      Add to Plan
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )) : (
              <Alert variant="info">No options available to add.</Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlanOptionEditor;