import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import ColorableSVG from '../ColorableSVG';
import { getColorZoneMapping, generateElevationKey } from '../../utils/colorZoneMappings';
import { getColorPreviewFromName, getColorPalette, createGradientFromPalette } from '../../utils/colorService';
import { Option, ColorScheme } from '../../models/graphql';

interface ElevationStepProps {
    elevations: Option[];
    selected: Option | null;
    onSelect: (elevation: Option) => void;
    colorScheme: ColorScheme | null;
    onColorSchemeChange: (scheme: ColorScheme) => void;
    availableColorSchemes: ColorScheme[];
    planType?: number;
}

const ElevationStep: React.FC<ElevationStepProps> = ({
    elevations,
    selected,
    onSelect,
    colorScheme,
    onColorSchemeChange,
    availableColorSchemes,
    planType = 0
}) => {

    // Render elevation preview (SVG if available, otherwise traditional image)
    const renderElevationPreview = (elevation: Option) => {
        const isSelected = selected?._id === elevation._id || selected?.name === elevation.name;

        if (elevation.svgPath && elevation.supportsColorSchemes) {
            // Use ColorableSVG for dynamic coloring
            const elevationKey = generateElevationKey(planType, elevation.name);
            const colorZoneMapping = getColorZoneMapping(elevationKey);

            return (
                <ColorableSVG
                    svgPath={elevation.svgPath}
                    colorScheme={colorScheme}
                    colorZoneMapping={colorZoneMapping}
                    height={200}
                    className="elevation-svg"
                    onLoadError={() => console.warn(`Failed to load SVG: ${elevation.svgPath}`)}
                />
            );
        } else if (elevation.img) {
            // Use traditional image
            return (
                <Card.Img
                    variant="top"
                    src={`/images/elevations/${elevation.img}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
            );
        } else {
            // Fallback placeholder
            return (
                <div
                    className="d-flex align-items-center justify-content-center bg-light text-muted"
                    style={{ height: '200px' }}
                >
                    <div className="text-center">
                        <div style={{ fontSize: '3rem' }}>🏠</div>
                        <div>Preview Coming Soon</div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="elevation-step">
            {/* Selection requirement notice */}
            {!selected && (
                <div className="alert alert-info mb-4">
                    <strong>Required:</strong> Please select an exterior elevation style to continue.
                </div>
            )}

            <div className="mb-5">
                <h5 className="mb-3">Choose Your Exterior Style</h5>
                <Row>
                    {elevations.map((elevation) => {
                        const isSelected = selected?._id === elevation._id || selected?.name === elevation.name;
                        return (
                            <Col key={elevation._id || elevation.name} md={6} className="mb-4">
                                <Card
                                    className={`h-100 elevation-option ${isSelected ? 'border-primary border-3 selected shadow' : 'border-light'}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: isSelected ? 'translateY(-2px)' : 'none',
                                        boxShadow: isSelected ? '0 8px 25px rgba(13, 110, 253, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={() => onSelect(elevation)}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                        }
                                    }}
                                >
                                    <div className="position-relative">
                                        {renderElevationPreview(elevation)}

                                        {isSelected && (
                                            <div className="position-absolute top-0 end-0 p-2">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '32px', height: '32px' }}>
                                                    ✓
                                                </div>
                                            </div>
                                        )}

                                        {elevation.supportsColorSchemes && (
                                            <div className="position-absolute bottom-0 start-0 p-2">
                                                <div className="bg-success text-white rounded px-2 py-1 shadow-sm" style={{ fontSize: '0.75rem' }}>
                                                    🎨 Color Options
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
                        );
                    })}
                </Row>
            </div>

            <div className="color-scheme-section">
                <h5 className="mb-3">Select Color Scheme</h5>

                {/* Color scheme requirement notice */}
                {!colorScheme && (
                    <div className="alert alert-info mb-3">
                        <strong>Required:</strong> Please select a color scheme for your home's exterior.
                    </div>
                )}

                <Row>
                    {availableColorSchemes.map((color) => {
                        const isSelected = colorScheme?._id === color._id;
                        const palette = getColorPalette(color);
                        const gradientBackground = createGradientFromPalette(palette);

                        return (
                            <Col key={color._id} sm={6} md={4} lg={3} className="mb-3">
                                <div
                                    className={`color-option p-3 border rounded text-center ${isSelected ? 'border-primary border-3 bg-primary bg-opacity-10 shadow' : 'border-light'}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: isSelected ? 'scale(1.02)' : 'none'
                                    }}
                                    onClick={() => onColorSchemeChange(color)}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.transform = 'scale(1.01)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {/* Color palette preview */}
                                    <div
                                        className="color-palette mx-auto mb-2 border shadow-sm"
                                        style={{
                                            width: '60px',
                                            height: '40px',
                                            background: gradientBackground,
                                            borderRadius: '8px'
                                        }}
                                    />

                                    {/* Individual color swatches */}
                                    <div className="d-flex justify-content-center mb-2" style={{ gap: '2px' }}>
                                        {palette.slice(0, 4).map((paletteColor, index) => (
                                            <div
                                                key={index}
                                                className="border shadow-sm"
                                                style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: paletteColor,
                                                    borderRadius: '2px'
                                                }}
                                                title={`${['Primary', 'Secondary', 'Roof', 'Accent'][index]} Color: ${paletteColor}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="small fw-bold">{color.name}</div>
                                    <div className="small text-muted mb-1">
                                        {color.price > 0 ? `+$${color.price.toLocaleString()}` : 'Included'}
                                    </div>

                                    {isSelected && (
                                        <div className="position-relative">
                                            <div className="position-absolute top-0 end-0" style={{ marginTop: '-40px', marginRight: '-10px' }}>
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>
                                                    ✓
                                                </div>
                                            </div>
                                            <small className="text-primary fw-bold">Selected</small>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        );
                    })}
                </Row>

                {/* Live preview of selected combination */}
                {selected && colorScheme && selected.supportsColorSchemes && (
                    <div className="mt-4 p-3 bg-light rounded">
                        <h6 className="mb-2">Live Preview</h6>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                                {renderElevationPreview(selected)}
                            </div>
                            <div>
                                <div className="fw-bold">{selected.name} - {colorScheme.name}</div>
                                <div className="small text-muted">
                                    Total: {selected.price > 0 ? `$${selected.price.toLocaleString()}` : 'Included'} + {colorScheme.price > 0 ? `$${colorScheme.price.toLocaleString()}` : 'Included'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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