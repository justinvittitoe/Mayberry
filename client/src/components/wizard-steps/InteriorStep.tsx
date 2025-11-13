import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, ButtonGroup, Modal, Form, Table } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_INTERIOR_OPTIONS } from '../../graphQl/queries';

interface InteriorStepProps {
    interiors: any[];
    selected: any;
    onSelect: (interior: any) => void;
}

const InteriorStep: React.FC<InteriorStepProps> = ({
    interiors,
    selected,
    onSelect
}) => {
    const [selectionMode, setSelectionMode] = useState<'package' | 'custom'>('package');
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customSelections, setCustomSelections] = useState({
        fixtures: null,
        lvp: null,
        carpet: null,
        backsplash: null,
        masterBathTile: null,
        countertop: null,
        primaryCabinets: null,
        secondaryCabinets: null
    });

    // Get interior options for custom selection
    const { data: optionsData } = useQuery(GET_INTERIOR_OPTIONS);
    const allOptions = optionsData?.interiorOptions || [];

    const interiorOptions = {
        fixtures: allOptions.filter((opt: any) => opt.classification === 'fixture'),
        lvp: allOptions.filter((opt: any) => opt.classification === 'flooring'),
        carpet: allOptions.filter((opt: any) => opt.classification === 'flooring'),
        backsplash: allOptions.filter((opt: any) => opt.classification === 'backsplash'),
        masterBathTile: allOptions.filter((opt: any) => opt.classification === 'tile'),
        countertop: allOptions.filter((opt: any) => opt.classification === 'countertop'),
        primaryCabinets: allOptions.filter((opt: any) => opt.classification === 'cabinet'),
        secondaryCabinets: allOptions.filter((opt: any) => opt.classification === 'cabinet')
    };
    const getPackageFeatures = (interior: any) => {
        const features = [];

        if (interior.fixtures?.length > 0) {
            features.push(`${interior.fixtures.length} Fixture${interior.fixtures.length > 1 ? 's' : ''}`);
        }
        if (interior.countertop?.length > 0) {
            features.push('Premium Countertops');
        }
        if (interior.primaryCabinets?.length > 0) {
            features.push('Custom Cabinets');
        }
        if (interior.backsplash?.length > 0) {
            features.push('Designer Backsplash');
        }
        if (interior.lvp?.length > 0) {
            features.push('LVP Flooring');
        }
        if (interior.carpet?.length > 0) {
            features.push('Premium Carpet');
        }
        if (interior.masterBathTile?.length > 0) {
            features.push('Bath Tile Upgrade');
        }

        return features;
    };

    const getPackageLevel = (interior: any) => {
        if (interior.upgrade === true) {
            return { level: 'Premium', color: 'warning', icon: '⭐' };
        }
        return { level: 'Standard', color: 'secondary', icon: '🏠' };
    };

    const calculateCustomTotal = () => {
        let total = 0;
        Object.values(customSelections).forEach((selection: any) => {
            if (selection && selection.price) {
                total += selection.price;
            }
        });
        return total;
    };

    const handleCustomSelection = (category: string, option: any) => {
        setCustomSelections(prev => ({
            ...prev,
            [category]: option
        }));
    };

    const createCustomPackage = () => {
        const customPackage = {
            _id: 'custom-package',
            name: 'Custom Interior Package',
            totalPrice: calculateCustomTotal(),
            ...customSelections,
            isCustom: true
        };

        onSelect(customPackage);
        setShowCustomModal(false);
    };

    const isCustomPackageComplete = () => {
        return Object.values(customSelections).some(selection => selection !== null);
    };

    return (
        <div className="interior-step">
            {/* Selection requirement notice */}
            {!selected && (
                <div className="alert alert-info mb-4">
                    <strong>Required:</strong> Please select an interior package or create a custom package to continue.
                </div>
            )}

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Choose Your Interior Design</h5>
                    <ButtonGroup>
                        <Button
                            variant={selectionMode === 'package' ? 'primary' : 'outline-primary'}
                            onClick={() => setSelectionMode('package')}
                        >
                            📦 Pre-Built Packages
                        </Button>
                        <Button
                            variant={selectionMode === 'custom' ? 'primary' : 'outline-primary'}
                            onClick={() => setSelectionMode('custom')}
                        >
                            🎨 Custom Selection
                        </Button>
                    </ButtonGroup>
                </div>
                <p className="text-muted">
                    {selectionMode === 'package'
                        ? 'Select from our curated interior packages featuring coordinated fixtures, finishes, and materials.'
                        : 'Build your own custom interior package by selecting individual components.'
                    }
                </p>
            </div>

            {selectionMode === 'package' ? (
                <Row>
                    {interiors.map((interior) => {
                        const features = getPackageFeatures(interior);
                        const packageLevel = getPackageLevel(interior);
                        const isSelected = selected?._id === interior._id || selected?.name === interior.name;

                        return (
                            <Col key={interior._id || interior.name} lg={6} className="mb-4">
                                <Card
                                    className={`h-100 interior-option ${isSelected ? 'border-primary selected' : 'border-light'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => onSelect(interior)}
                                >
                                    <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="me-2" style={{ fontSize: '1.5rem' }}>{packageLevel.icon}</span>
                                            <div>
                                                <h6 className="mb-0">{interior.name}</h6>
                                                <Badge bg={packageLevel.color} className="mt-1">
                                                    {packageLevel.level}
                                                </Badge>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                ✓
                                            </div>
                                        )}
                                    </Card.Header>

                                    <Card.Body>
                                        <div className="mb-3">
                                            <div className="fw-bold text-primary mb-2">
                                                +${interior.totalPrice?.toLocaleString() || 0}
                                            </div>
                                            <p className="text-muted small mb-3">
                                                {interior.description || 'Complete interior package with coordinated finishes'}
                                            </p>
                                        </div>

                                        {features.length > 0 && (
                                            <div className="features-list">
                                                <div className="small fw-bold text-muted mb-2">Included Features:</div>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {features.slice(0, 6).map((feature, index) => (
                                                        <Badge key={index} bg="light" text="dark" className="small">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                    {features.length > 6 && (
                                                        <Badge bg="light" text="muted" className="small">
                                                            +{features.length - 6} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Detailed breakdown for selected package */}
                                        {isSelected && (
                                            <div className="mt-3 pt-3 border-top">
                                                <div className="small text-muted mb-2">Package Details:</div>
                                                <div className="row small">
                                                    {interior.fixtures && interior.fixtures.length > 0 && (
                                                        <div className="col-6 mb-1">
                                                            <strong>Fixtures:</strong> {interior.fixtures[0].name}
                                                        </div>
                                                    )}
                                                    {interior.countertop && interior.countertop.length > 0 && (
                                                        <div className="col-6 mb-1">
                                                            <strong>Countertops:</strong> {interior.countertop[0].name}
                                                        </div>
                                                    )}
                                                    {interior.primaryCabinets && interior.primaryCabinets.length > 0 && (
                                                        <div className="col-6 mb-1">
                                                            <strong>Cabinets:</strong> {interior.primaryCabinets[0].name}
                                                        </div>
                                                    )}
                                                    {interior.backsplash && interior.backsplash.length > 0 && (
                                                        <div className="col-6 mb-1">
                                                            <strong>Backsplash:</strong> {interior.backsplash[0].name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                // Custom Selection Mode
                <div>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0">Custom Interior Package</h6>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCustomModal(true)}
                                    disabled={interiorOptions.fixtures.length === 0}
                                >
                                    🔧 Build Custom Package
                                </Button>
                            </div>

                            {selected?.isCustom ? (
                                <div className="bg-light p-3 rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong>Custom Interior Package</strong>
                                        <Badge bg="success">${selected.totalPrice?.toLocaleString()}</Badge>
                                    </div>
                                    <div className="small text-muted">
                                        Selected {Object.values(customSelections).filter(s => s !== null).length} custom components
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted mb-0">
                                    Build your own custom interior package by selecting individual fixtures, flooring, countertops, cabinets, and more.
                                </p>
                            )}
                        </Card.Body>
                    </Card>

                    {interiorOptions.fixtures.length === 0 && (
                        <div className="alert alert-warning">
                            <strong>Notice:</strong> Custom selection requires interior options to be configured by an administrator first.
                        </div>
                    )}
                </div>
            )}

            {interiors.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <div style={{ fontSize: '3rem' }} className="mb-3">🎨</div>
                        <h5>No interior packages available</h5>
                        <p>Please contact our design team for custom interior options.</p>
                    </div>
                </div>
            )}

            {interiors.length > 0 && (
                <div className="mt-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-start">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>💡</div>
                        <div>
                            <h6 className="mb-1">Interior Package Benefits</h6>
                            <p className="small mb-0 text-muted">
                                Our interior packages are professionally designed with coordinated materials and finishes.
                                Each package includes fixtures, flooring, countertops, cabinets, and tile selections that work beautifully together.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Selection Modal */}
            <Modal show={showCustomModal} onHide={() => setShowCustomModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Build Custom Interior Package</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 text-muted">Select individual components to create your custom interior package.</p>
                            <Badge bg="primary" className="fs-6">
                                Total: ${calculateCustomTotal().toLocaleString()}
                            </Badge>
                        </div>
                    </div>

                    {Object.entries(interiorOptions).map(([category, options]) => (
                        <Card key={category} className="mb-3">
                            <Card.Header>
                                <h6 className="mb-0">
                                    {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                                    {customSelections[category as keyof typeof customSelections] && (
                                        <Badge bg="success" className="ms-2">Selected</Badge>
                                    )}
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                {options.length > 0 ? (
                                    <Row>
                                        {options.map((option: any) => {
                                            const isSelected = customSelections[category as keyof typeof customSelections]?._id === option._id;
                                            return (
                                                <Col key={option._id} md={6} lg={4} className="mb-3">
                                                    <Card
                                                        className={`h-100 ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => handleCustomSelection(category, option)}
                                                    >
                                                        <Card.Body className="p-3">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <div className="fw-bold small">{option.name}</div>
                                                                {isSelected && (
                                                                    <div className="text-primary">✓</div>
                                                                )}
                                                            </div>
                                                            <div className="small text-muted mb-2">{option.description}</div>
                                                            <div className="fw-bold text-primary small">
                                                                ${option.price?.toLocaleString() || 0}
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                        <Col md={6} lg={4} className="mb-3">
                                            <Card
                                                className="h-100 border-secondary text-center d-flex align-items-center justify-content-center"
                                                style={{
                                                    cursor: 'pointer',
                                                    minHeight: '100px',
                                                    backgroundColor: customSelections[category as keyof typeof customSelections] === null ? '#f8f9fa' : 'transparent'
                                                }}
                                                onClick={() => handleCustomSelection(category, null)}
                                            >
                                                <Card.Body>
                                                    <div className="text-muted">
                                                        {customSelections[category as keyof typeof customSelections] === null ? '✓ ' : ''}
                                                        Skip {category}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                ) : (
                                    <div className="text-center py-3 text-muted">
                                        No {category} options available. Contact admin to add options.
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCustomModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={createCustomPackage}
                        disabled={!isCustomPackageComplete()}
                    >
                        Create Custom Package (${calculateCustomTotal().toLocaleString()})
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InteriorStep;