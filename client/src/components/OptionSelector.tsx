import React from 'react';
import { Card, Form, Badge, Row, Col } from 'react-bootstrap';

interface Option {
  _id: string;
  name: string;
  price: number;
  classification?: string;
  description?: string;
  img?: string;
}

interface InteriorPackage {
  _id: string;
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
  _id: string;
  filing: number;
  lot: number;
  width: number;
  length: number;
  price: number;
}

interface OptionSelectorProps {
  title: string;
  options: Option[] | InteriorPackage[] | LotPremium[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  showPricing?: boolean;
  type: 'option' | 'interior' | 'lot';
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  title,
  options,
  selectedIds,
  onSelectionChange,
  multiSelect = true,
  showPricing = true,
  type
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSelectionChange = (optionId: string, isChecked: boolean) => {
    if (multiSelect) {
      if (isChecked) {
        onSelectionChange([...selectedIds, optionId]);
      } else {
        onSelectionChange(selectedIds.filter(id => id !== optionId));
      }
    } else {
      onSelectionChange(isChecked ? [optionId] : []);
    }
  };

  const renderOptionCard = (option: Option | InteriorPackage | LotPremium) => {
    const isSelected = selectedIds.includes(option._id);
    let displayName = '';
    let displayPrice = 0;
    let displayDescription = '';

    if (type === 'option') {
      const opt = option as Option;
      displayName = opt.name;
      displayPrice = opt.price;
      displayDescription = opt.description || '';
    } else if (type === 'interior') {
      const interior = option as InteriorPackage;
      displayName = interior.name;
      displayPrice = interior.totalPrice;
      displayDescription = `Interior package with ${interior.upgrade ? 'premium' : 'standard'} finishes`;
    } else if (type === 'lot') {
      const lot = option as LotPremium;
      displayName = `Filing ${lot.filing}, Lot ${lot.lot}`;
      displayPrice = lot.price;
      displayDescription = `${lot.width}' x ${lot.length}' lot`;
    }

    return (
      <Col key={option._id} md={6} lg={4} className="mb-3">
        <Card 
          className={`option-card h-100 ${isSelected ? 'border-primary bg-light' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleSelectionChange(option._id, !isSelected)}
        >
          <Card.Body className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <Form.Check
                type={multiSelect ? 'checkbox' : 'radio'}
                checked={isSelected}
                onChange={(e) => handleSelectionChange(option._id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mb-0"
              />
              {showPricing && (
                <Badge bg={isSelected ? 'primary' : 'secondary'}>
                  {formatPrice(displayPrice)}
                </Badge>
              )}
            </div>
            
            <Card.Title className="h6 mb-2">{displayName}</Card.Title>
            
            {displayDescription && (
              <Card.Text className="text-muted small mb-2">
                {displayDescription}
              </Card.Text>
            )}

            {type === 'option' && (option as Option).classification && (
              <div className="mt-auto">
                <Badge bg="info" className="small">
                  {(option as Option).classification}
                </Badge>
              </div>
            )}

            {type === 'interior' && (
              <div className="mt-auto">
                <small className="text-muted">
                  {(option as InteriorPackage).upgrade ? 'Premium Package' : 'Standard Package'}
                </small>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const calculateTotal = (): number => {
    return selectedIds.reduce((total, id) => {
      const option = options.find(opt => opt._id === id);
      if (!option) return total;
      
      if (type === 'option') {
        return total + (option as Option).price;
      } else if (type === 'interior') {
        return total + (option as InteriorPackage).totalPrice;
      } else if (type === 'lot') {
        return total + (option as LotPremium).price;
      }
      return total;
    }, 0);
  };

  return (
    <div className="option-selector">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{title}</h5>
        {showPricing && selectedIds.length > 0 && (
          <div className="text-end">
            <div className="small text-muted">
              {selectedIds.length} selected
            </div>
            <div className="fw-bold text-primary">
              {formatPrice(calculateTotal())}
            </div>
          </div>
        )}
      </div>

      {options.length === 0 ? (
        <div className="text-center py-4 text-muted">
          <p>No {title.toLowerCase()} available</p>
        </div>
      ) : (
        <Row>
          {options.map(renderOptionCard)}
        </Row>
      )}

      {selectedIds.length === 0 && multiSelect && (
        <div className="text-center py-2">
          <small className="text-muted">
            Select one or more {title.toLowerCase()} for this plan
          </small>
        </div>
      )}
    </div>
  );
};

export default OptionSelector;