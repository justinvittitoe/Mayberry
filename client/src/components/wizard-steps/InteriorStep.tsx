import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';

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

    return (
        <div className="interior-step">
            <div className="mb-4">
                <h5 className="mb-3">Choose Your Interior Design Package</h5>
                <p className="text-muted">Select from our curated interior packages featuring coordinated fixtures, finishes, and materials.</p>
            </div>

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
        </div>
    );
};

export default InteriorStep;