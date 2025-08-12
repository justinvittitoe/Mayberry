import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';

interface ApplianceStepProps {
    kitchenOptions: any[];
    laundryOptions: any[];
    selectedKitchen: any;
    selectedLaundry: any;
    onKitchenSelect: (appliance: any) => void;
    onLaundrySelect: (appliance: any) => void;
}

const ApplianceStep: React.FC<ApplianceStepProps> = ({
    kitchenOptions,
    laundryOptions,
    selectedKitchen,
    selectedLaundry,
    onKitchenSelect,
    onLaundrySelect
}) => {
    const getPackageLevel = (packageName: string) => {
        const name = packageName.toLowerCase();
        if (name.includes('premium') || name.includes('luxury') || name.includes('pro')) {
            return { level: 'Premium', color: 'warning', icon: '⭐' };
        } else if (name.includes('upgraded') || name.includes('plus') || name.includes('enhanced')) {
            return { level: 'Upgraded', color: 'info', icon: '🔧' };
        }
        return { level: 'Standard', color: 'secondary', icon: '🏠' };
    };

    const getApplianceFeatures = (appliance: any, type: 'kitchen' | 'laundry') => {
        const features = [];
        
        if (type === 'kitchen') {
            features.push('Range/Oven');
            features.push('Refrigerator');
            features.push('Dishwasher');
            features.push('Microwave');
            if (appliance.name.toLowerCase().includes('disposal')) {
                features.push('Garbage Disposal');
            }
        } else {
            features.push('Washer Connection');
            features.push('Dryer Connection');
            if (appliance.name.toLowerCase().includes('sink') || appliance.name.toLowerCase().includes('utility')) {
                features.push('Utility Sink');
            }
            if (appliance.name.toLowerCase().includes('cabinet')) {
                features.push('Storage Cabinet');
            }
        }
        
        return features;
    };

    return (
        <div className="appliance-step">
            <div className="mb-5">
                <h5 className="mb-3">Kitchen Appliance Package</h5>
                <p className="text-muted mb-4">Choose your kitchen appliance package with coordinated finishes and features.</p>
                
                <Row>
                    {kitchenOptions.map((appliance) => {
                        const packageLevel = getPackageLevel(appliance.name);
                        const features = getApplianceFeatures(appliance, 'kitchen');
                        const isSelected = selectedKitchen?._id === appliance._id || selectedKitchen?.name === appliance.name;
                        
                        return (
                            <Col key={appliance._id || appliance.name} md={6} lg={4} className="mb-4">
                                <Card 
                                    className={`h-100 appliance-option ${isSelected ? 'border-primary selected' : 'border-light'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => onKitchenSelect(appliance)}
                                >
                                    <div className="position-relative">
                                        {appliance.img && (
                                            <Card.Img 
                                                variant="top" 
                                                src={`/images/appliances/${appliance.img}`}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        {!appliance.img && (
                                            <div 
                                                className="d-flex align-items-center justify-content-center bg-light text-muted"
                                                style={{ height: '200px' }}
                                            >
                                                <div className="text-center">
                                                    <div style={{ fontSize: '3rem' }}>🍳</div>
                                                    <div>Kitchen Package</div>
                                                </div>
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="position-absolute top-0 end-0 p-2">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                    ✓
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2" style={{ fontSize: '1.2rem' }}>{packageLevel.icon}</span>
                                                <h6 className="mb-0">{appliance.name}</h6>
                                            </div>
                                            <Badge bg={packageLevel.color}>
                                                {packageLevel.level}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex-grow-1">
                                            <p className="text-muted small mb-3">
                                                {appliance.description || 'Complete kitchen appliance package'}
                                            </p>
                                            
                                            <div className="features-list mb-3">
                                                <div className="small fw-bold text-muted mb-2">Included:</div>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {features.map((feature, index) => (
                                                        <Badge key={index} bg="light" text="dark" className="small">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <div className="fw-bold text-primary">
                                                {appliance.price > 0 ? `+$${appliance.price.toLocaleString()}` : 'Included'}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {kitchenOptions.length === 0 && (
                    <div className="text-center py-4 bg-light rounded">
                        <div className="text-muted">
                            <div style={{ fontSize: '2rem' }} className="mb-2">🍳</div>
                            <p className="mb-0">No kitchen appliance packages available for this plan.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <h5 className="mb-3">Laundry Setup</h5>
                <p className="text-muted mb-4">Select your laundry room configuration and appliance connections.</p>
                
                <Row>
                    {laundryOptions.map((appliance) => {
                        const packageLevel = getPackageLevel(appliance.name);
                        const features = getApplianceFeatures(appliance, 'laundry');
                        const isSelected = selectedLaundry?._id === appliance._id || selectedLaundry?.name === appliance.name;
                        
                        return (
                            <Col key={appliance._id || appliance.name} md={6} lg={4} className="mb-4">
                                <Card 
                                    className={`h-100 appliance-option ${isSelected ? 'border-primary selected' : 'border-light'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => onLaundrySelect(appliance)}
                                >
                                    <div className="position-relative">
                                        {appliance.img && (
                                            <Card.Img 
                                                variant="top" 
                                                src={`/images/appliances/${appliance.img}`}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        {!appliance.img && (
                                            <div 
                                                className="d-flex align-items-center justify-content-center bg-light text-muted"
                                                style={{ height: '200px' }}
                                            >
                                                <div className="text-center">
                                                    <div style={{ fontSize: '3rem' }}>🧺</div>
                                                    <div>Laundry Setup</div>
                                                </div>
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="position-absolute top-0 end-0 p-2">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                    ✓
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2" style={{ fontSize: '1.2rem' }}>{packageLevel.icon}</span>
                                                <h6 className="mb-0">{appliance.name}</h6>
                                            </div>
                                            <Badge bg={packageLevel.color}>
                                                {packageLevel.level}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex-grow-1">
                                            <p className="text-muted small mb-3">
                                                {appliance.description || 'Laundry room setup with connections'}
                                            </p>
                                            
                                            <div className="features-list mb-3">
                                                <div className="small fw-bold text-muted mb-2">Included:</div>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {features.map((feature, index) => (
                                                        <Badge key={index} bg="light" text="dark" className="small">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <div className="fw-bold text-primary">
                                                {appliance.price > 0 ? `+$${appliance.price.toLocaleString()}` : 'Included'}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {laundryOptions.length === 0 && (
                    <div className="text-center py-4 bg-light rounded">
                        <div className="text-muted">
                            <div style={{ fontSize: '2rem' }} className="mb-2">🧺</div>
                            <p className="mb-0">No laundry options available for this plan.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 p-3 bg-info bg-opacity-10 rounded border-start border-info border-4">
                <div className="d-flex align-items-start">
                    <div className="me-3" style={{ fontSize: '1.5rem' }}>ℹ️</div>
                    <div>
                        <h6 className="mb-1">Appliance Package Information</h6>
                        <ul className="small mb-0 text-muted">
                            <li><strong>Kitchen packages</strong> include coordinated appliances with matching finishes</li>
                            <li><strong>Laundry setups</strong> include necessary connections and utility preparations</li>
                            <li>Actual appliance models and brands may vary based on availability</li>
                            <li>Installation and electrical connections are included in the package price</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplianceStep;