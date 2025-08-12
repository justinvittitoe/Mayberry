import React from 'react';
import { Row, Col, Card, Form, Badge } from 'react-bootstrap';

interface StructuralStepProps {
    options: any[];
    selected: any[];
    onToggle: (option: any, checked: boolean) => void;
}

const StructuralStep: React.FC<StructuralStepProps> = ({
    options,
    selected,
    onToggle
}) => {
    const isSelected = (option: any) => {
        return selected.some(item => item._id === option._id || item.name === option.name);
    };

    const getStructuralIcon = (optionName: string) => {
        const name = optionName.toLowerCase();
        if (name.includes('garage')) return '🚗';
        if (name.includes('patio') || name.includes('deck')) return '🏡';
        if (name.includes('loft') || name.includes('bonus')) return '🏠';
        if (name.includes('multi') || name.includes('generation')) return '👨‍👩‍👧‍👦';
        if (name.includes('basement')) return '🏠';
        if (name.includes('covered')) return '☂️';
        return '🏗️';
    };

    const getOptionDimensions = (option: any) => {
        if (option.width && option.length) {
            return `${option.width}' × ${option.length}'`;
        }
        return null;
    };

    return (
        <div className="structural-step">
            <div className="mb-4">
                <h5 className="mb-3">Structural Upgrades & Additions</h5>
                <p className="text-muted">
                    Enhance your home with structural modifications and additional spaces. 
                    These options may affect your home's footprint and foundation requirements.
                </p>
            </div>

            {options.length > 0 ? (
                <Row>
                    {options.map((option) => {
                        const selected = isSelected(option);
                        const dimensions = getOptionDimensions(option);
                        
                        return (
                            <Col key={option._id || option.name} md={6} lg={4} className="mb-4">
                                <Card 
                                    className={`h-100 structural-option ${selected ? 'border-primary selected' : 'border-light'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                >
                                    <div className="position-relative">
                                        {option.img && (
                                            <Card.Img 
                                                variant="top" 
                                                src={`/images/structural/${option.img}`}
                                                style={{ height: '180px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        {!option.img && (
                                            <div 
                                                className="d-flex align-items-center justify-content-center bg-light text-muted"
                                                style={{ height: '180px' }}
                                            >
                                                <div className="text-center">
                                                    <div style={{ fontSize: '3rem' }}>
                                                        {getStructuralIcon(option.name)}
                                                    </div>
                                                    <div>Preview Coming Soon</div>
                                                </div>
                                            </div>
                                        )}
                                        {selected && (
                                            <div className="position-absolute top-0 end-0 p-2">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                    ✓
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Card.Body className="d-flex flex-column">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-start justify-content-between mb-2">
                                                <h6 className="mb-1 flex-grow-1">{option.name}</h6>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={(e) => onToggle(option, e.target.checked)}
                                                    className="ms-2"
                                                />
                                            </div>
                                            
                                            {dimensions && (
                                                <Badge bg="secondary" className="mb-2">
                                                    {dimensions}
                                                </Badge>
                                            )}
                                            
                                            <p className="text-muted small mb-2">
                                                {option.description || 'Structural enhancement option'}
                                            </p>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <div className="fw-bold text-primary">
                                                {option.price > 0 ? `+$${option.price.toLocaleString()}` : 'Included'}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <div style={{ fontSize: '3rem' }} className="mb-3">🏗️</div>
                        <h5>No structural options available</h5>
                        <p>This plan may include all structural features as standard, or custom options may be available upon request.</p>
                    </div>
                </div>
            )}

            {selected.length > 0 && (
                <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded border-start border-primary border-4">
                    <div className="d-flex align-items-start">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>✨</div>
                        <div>
                            <h6 className="mb-1">Selected Structural Upgrades</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {selected.map((option, index) => (
                                    <Badge key={index} bg="primary" className="d-flex align-items-center">
                                        {option.name}
                                        <button 
                                            type="button"
                                            className="btn-close btn-close-white ms-2"
                                            style={{ fontSize: '0.7rem' }}
                                            onClick={() => onToggle(option, false)}
                                            aria-label="Remove"
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <p className="small mb-0 mt-2 text-muted">
                                Total structural upgrades: <strong>+${selected.reduce((total, opt) => total + (opt.price || 0), 0).toLocaleString()}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded border-start border-warning border-4">
                <div className="d-flex align-items-start">
                    <div className="me-3" style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <div>
                        <h6 className="mb-1">Important Note</h6>
                        <p className="small mb-0 text-muted">
                            Structural modifications may affect lot placement, foundation requirements, and construction timeline. 
                            Some options may not be compatible with certain lots or local building codes. 
                            Our team will verify all selections during the design process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StructuralStep;