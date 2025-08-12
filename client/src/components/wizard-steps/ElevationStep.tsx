import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';

interface ElevationStepProps {
    elevations: any[];
    selected: any;
    onSelect: (elevation: any) => void;
    colorScheme: number;
    onColorSchemeChange: (scheme: number) => void;
    availableColorSchemes: number[];
}

const ElevationStep: React.FC<ElevationStepProps> = ({
    elevations,
    selected,
    onSelect,
    colorScheme,
    onColorSchemeChange,
    availableColorSchemes
}) => {
    const colorSchemeOptions = [
        { id: 1, name: 'Classic White', preview: '#f8f9fa' },
        { id: 2, name: 'Warm Beige', preview: '#f5f1eb' },
        { id: 5, name: 'Natural Stone', preview: '#e9ecef' },
        { id: 7, name: 'Modern Gray', preview: '#6c757d' },
        { id: 8, name: 'Charcoal', preview: '#495057' },
        { id: 9, name: 'Sage Green', preview: '#8fbc8f' },
        { id: 13, name: 'Navy Blue', preview: '#1e3a8a' },
        { id: 14, name: 'Forest Green', preview: '#2d5016' },
        { id: 16, name: 'Desert Sand', preview: '#ddbf85' }
    ];

    const availableColors = colorSchemeOptions.filter(color => 
        availableColorSchemes.includes(color.id)
    );

    return (
        <div className="elevation-step">
            <div className="mb-5">
                <h5 className="mb-3">Choose Your Exterior Style</h5>
                <Row>
                    {elevations.map((elevation) => (
                        <Col key={elevation._id || elevation.name} md={6} className="mb-4">
                            <Card 
                                className={`h-100 elevation-option ${selected?._id === elevation._id || selected?.name === elevation.name ? 'border-primary selected' : 'border-light'}`}
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onClick={() => onSelect(elevation)}
                            >
                                <div className="position-relative">
                                    {elevation.img && (
                                        <Card.Img 
                                            variant="top" 
                                            src={`/images/elevations/${elevation.img}`}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {!elevation.img && (
                                        <div 
                                            className="d-flex align-items-center justify-content-center bg-light text-muted"
                                            style={{ height: '200px' }}
                                        >
                                            <div className="text-center">
                                                <div style={{ fontSize: '3rem' }}>🏠</div>
                                                <div>Preview Coming Soon</div>
                                            </div>
                                        </div>
                                    )}
                                    {(selected?._id === elevation._id || selected?.name === elevation.name) && (
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                ✓
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <Card.Title className="h6 mb-1">{elevation.name}</Card.Title>
                                            <Card.Text className="text-muted small mb-2">
                                                {elevation.description || 'Classic exterior styling'}
                                            </Card.Text>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-primary">
                                                {elevation.price > 0 ? `+$${elevation.price.toLocaleString()}` : 'Included'}
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="color-scheme-section">
                <h5 className="mb-3">Select Color Scheme</h5>
                <Row>
                    {availableColors.map((color) => (
                        <Col key={color.id} sm={6} md={4} lg={3} className="mb-3">
                            <div
                                className={`color-option p-3 border rounded text-center ${colorScheme === color.id ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onClick={() => onColorSchemeChange(color.id)}
                            >
                                <div 
                                    className="color-preview mx-auto mb-2 border"
                                    style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        backgroundColor: color.preview,
                                        borderRadius: '8px'
                                    }}
                                />
                                <div className="small fw-bold">{color.name}</div>
                                {colorScheme === color.id && (
                                    <div className="mt-1">
                                        <small className="text-primary">✓ Selected</small>
                                    </div>
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {elevations.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <div style={{ fontSize: '3rem' }} className="mb-3">🏠</div>
                        <h5>No elevation options available</h5>
                        <p>Please contact our team for custom elevation options.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElevationStep;