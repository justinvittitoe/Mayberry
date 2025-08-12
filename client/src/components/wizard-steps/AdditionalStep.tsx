import React from 'react';
import { Row, Col, Card, Form, Badge } from 'react-bootstrap';

interface AdditionalStepProps {
    options: any[];
    selected: any[];
    onToggle: (option: any, checked: boolean) => void;
}

const AdditionalStep: React.FC<AdditionalStepProps> = ({
    options,
    selected,
    onToggle
}) => {
    const isSelected = (option: any) => {
        return selected.some(item => item._id === option._id || item.name === option.name);
    };

    const getFeatureIcon = (optionName: string) => {
        const name = optionName.toLowerCase();
        if (name.includes('air') || name.includes('ac') || name.includes('conditioning')) return '❄️';
        if (name.includes('window') || name.includes('covering') || name.includes('blind')) return '🪟';
        if (name.includes('laundry')) return '🧺';
        if (name.includes('electrical') || name.includes('outlet')) return '⚡';
        if (name.includes('deck') || name.includes('patio')) return '🏡';
        if (name.includes('lighting') || name.includes('light')) return '💡';
        if (name.includes('security') || name.includes('alarm')) return '🔒';
        if (name.includes('smart') || name.includes('automation')) return '📱';
        if (name.includes('fireplace')) return '🔥';
        if (name.includes('water') || name.includes('plumb')) return '🚰';
        return '✨';
    };

    const categorizeOptions = (options: any[]) => {
        const categories: { [key: string]: any[] } = {
            'Climate & Comfort': [],
            'Electrical & Technology': [],
            'Window Treatments': [],
            'Outdoor Living': [],
            'Other Features': []
        };

        options.forEach(option => {
            const name = option.name.toLowerCase();
            if (name.includes('air') || name.includes('ac') || name.includes('conditioning') || name.includes('heating')) {
                categories['Climate & Comfort'].push(option);
            } else if (name.includes('electrical') || name.includes('outlet') || name.includes('smart') || name.includes('tech')) {
                categories['Electrical & Technology'].push(option);
            } else if (name.includes('window') || name.includes('covering') || name.includes('blind') || name.includes('shade')) {
                categories['Window Treatments'].push(option);
            } else if (name.includes('deck') || name.includes('patio') || name.includes('outdoor')) {
                categories['Outdoor Living'].push(option);
            } else {
                categories['Other Features'].push(option);
            }
        });

        // Remove empty categories
        Object.keys(categories).forEach(key => {
            if (categories[key].length === 0) {
                delete categories[key];
            }
        });

        return categories;
    };

    const categorizedOptions = categorizeOptions(options);

    return (
        <div className="additional-step">
            <div className="mb-4">
                <h5 className="mb-3">Additional Features & Upgrades</h5>
                <p className="text-muted">
                    Personalize your home with additional features and convenience upgrades. 
                    Mix and match options to create your perfect living experience.
                </p>
            </div>

            {Object.keys(categorizedOptions).length > 0 ? (
                Object.entries(categorizedOptions).map(([categoryName, categoryOptions]) => (
                    <div key={categoryName} className="mb-5">
                        <h6 className="mb-3 text-primary">{categoryName}</h6>
                        <Row>
                            {categoryOptions.map((option) => {
                                const isOptionSelected = isSelected(option);
                                
                                return (
                                    <Col key={option._id || option.name} md={6} lg={4} className="mb-3">
                                        <Card 
                                            className={`h-100 additional-option ${isOptionSelected ? 'border-primary selected' : 'border-light'}`}
                                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                        >
                                            <Card.Body className="d-flex flex-column">
                                                <div className="d-flex align-items-start justify-content-between mb-2">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <span className="me-2" style={{ fontSize: '1.5rem' }}>
                                                            {getFeatureIcon(option.name)}
                                                        </span>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1">{option.name}</h6>
                                                        </div>
                                                    </div>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={isOptionSelected}
                                                        onChange={(e) => onToggle(option, e.target.checked)}
                                                        className="ms-2"
                                                    />
                                                </div>
                                                
                                                <div className="flex-grow-1">
                                                    <p className="text-muted small mb-2">
                                                        {option.description || 'Premium upgrade feature'}
                                                    </p>
                                                </div>
                                                
                                                <div className="mt-auto">
                                                    <div className="fw-bold text-primary">
                                                        {option.price > 0 ? `+$${option.price.toLocaleString()}` : 'Included'}
                                                    </div>
                                                    {option.img && (
                                                        <small className="text-muted">📷 Images available</small>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                ))
            ) : (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <div style={{ fontSize: '3rem' }} className="mb-3">✨</div>
                        <h5>No additional options available</h5>
                        <p>This plan may include all premium features as standard, or custom options may be available upon request.</p>
                    </div>
                </div>
            )}

            {selected.length > 0 && (
                <div className="mt-4 p-3 bg-success bg-opacity-10 rounded border-start border-success border-4">
                    <div className="d-flex align-items-start">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>🎁</div>
                        <div>
                            <h6 className="mb-1">Selected Additional Features</h6>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {selected.map((option, index) => (
                                    <Badge key={index} bg="success" className="d-flex align-items-center">
                                        {getFeatureIcon(option.name)} {option.name}
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
                            <p className="small mb-0 text-muted">
                                Total additional features: <strong>+${selected.reduce((total, opt) => total + (opt.price || 0), 0).toLocaleString()}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {options.length > 0 && (
                <div className="mt-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-start">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>💡</div>
                        <div>
                            <h6 className="mb-1">Smart Selection Tips</h6>
                            <ul className="small mb-0 text-muted">
                                <li>Consider your daily routine and lifestyle needs</li>
                                <li>Some features may be easier to add during construction than as upgrades later</li>
                                <li>Energy-efficient options like upgraded HVAC can provide long-term savings</li>
                                <li>Window treatments and smart home features enhance both comfort and resale value</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdditionalStep;