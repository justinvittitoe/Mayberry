import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ColorScheme } from '../../models/graphql';
import { getColorPalette, createGradientFromPalette } from '../../utils/colorService';

interface ColorSchemeStepProps {
    availableColorSchemes: ColorScheme[];
    selected: ColorScheme | null;
    onSelect: (colorScheme: ColorScheme) => void;
    title?: string;
    subtitle?: string;
    allowDeselect?: boolean;
}

const ColorSchemeStep: React.FC<ColorSchemeStepProps> = ({
    availableColorSchemes,
    selected,
    onSelect,
    title = "Choose Your Color Scheme",
    subtitle = "Select the perfect color palette for your home's exterior",
    allowDeselect = false
}) => {

    const handleColorSchemeClick = (colorScheme: ColorScheme) => {
        if (allowDeselect && selected?._id === colorScheme._id) {
            onSelect(null as any);
        } else {
            onSelect(colorScheme);
        }
    };

    const renderColorSchemeCard = (colorScheme: ColorScheme) => {
        const isSelected = selected?._id === colorScheme._id;
        const palette = getColorPalette(colorScheme);
        const gradientBackground = createGradientFromPalette(palette);

        return (
            <Col key={colorScheme._id} sm={6} md={4} lg={3} className="mb-4">
                <Card
                    className={`h-100 color-scheme-option ${isSelected ? 'border-primary selected' : 'border-light'}`}
                    style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(13, 110, 253, 0.25)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => handleColorSchemeClick(colorScheme)}
                >
                    <Card.Body className="text-center p-3">
                        {/* Main color palette preview */}
                        <div
                            className="color-palette mx-auto mb-3 border shadow-sm"
                            style={{
                                width: '80px',
                                height: '50px',
                                background: gradientBackground,
                                borderRadius: '12px'
                            }}
                        />

                        {/* Individual color swatches with labels */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-center mb-2" style={{ gap: '4px' }}>
                                {palette.slice(0, 4).map((color, index) => (
                                    <div
                                        key={index}
                                        className="border shadow-sm"
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            backgroundColor: color,
                                            borderRadius: '4px'
                                        }}
                                        title={`${['Primary', 'Secondary', 'Roof', 'Accent'][index]}: ${color}`}
                                    />
                                ))}
                            </div>

                            {/* Color names for reference */}
                            <div className="small text-muted" style={{ fontSize: '0.7rem' }}>
                                <div className="d-flex justify-content-between">
                                    <span>Primary</span>
                                    <span>Trim</span>
                                    <span>Roof</span>
                                    <span>Accent</span>
                                </div>
                            </div>
                        </div>

                        {/* Color scheme name and description */}
                        <div className="mb-2">
                            <Card.Title className="h6 mb-1">{colorScheme.name}</Card.Title>
                            {colorScheme.description && (
                                <Card.Text className="text-muted small mb-2">
                                    {colorScheme.description}
                                </Card.Text>
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="fw-bold text-primary mb-2">
                            {colorScheme.price > 0 ? `+$${colorScheme.price.toLocaleString()}` : 'Included'}
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="position-absolute top-0 end-0 p-2">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                    ✓
                                </div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    return (
        <div className="color-scheme-step">
            <div className="mb-4">
                <h5 className="mb-2">{title}</h5>
                {subtitle && (
                    <p className="text-muted">{subtitle}</p>
                )}
            </div>

            {availableColorSchemes.length > 0 ? (
                <Row>
                    {availableColorSchemes.map(renderColorSchemeCard)}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <div style={{ fontSize: '3rem' }} className="mb-3">🎨</div>
                        <h5>No color schemes available</h5>
                        <p>Please contact our design team for custom color options.</p>
                    </div>
                </div>
            )}

            {selected && (
                <div className="selected-summary mt-4 p-3 bg-light rounded">
                    <h6 className="mb-2">Selected Color Scheme</h6>
                    <div className="d-flex align-items-center">
                        <div
                            className="me-3 border rounded"
                            style={{
                                width: '40px',
                                height: '30px',
                                background: createGradientFromPalette(getColorPalette(selected))
                            }}
                        />
                        <div>
                            <div className="fw-bold">{selected.name}</div>
                            <div className="small text-muted">
                                {selected.price > 0 ? `Additional $${selected.price.toLocaleString()}` : 'No additional cost'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorSchemeStep;