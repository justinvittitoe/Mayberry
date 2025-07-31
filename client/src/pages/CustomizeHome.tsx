import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Alert,
    ProgressBar,
    Badge
} from 'react-bootstrap';
import { GET_PLAN, GET_OPTIONS, GET_INTERIOR_PACKAGES, GET_LOT_PREMIUMS } from '../utils/queries';
import { SAVE_USER_HOME } from '../utils/mutations';


interface CustomizationState {
    elevation: any;
    colorScheme: number;
    interior: any;
    structural: any[];
    additional: any[];
    kitchenAppliance: any;
    laundryAppliance: any;
    lotPremium: any;
}

const CustomizeHome = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    

    const [customization, setCustomization] = useState<CustomizationState>({
        elevation: null,
        colorScheme: 1,
        interior: null,
        structural: [],
        additional: [],
        kitchenAppliance: null,
        laundryAppliance: null,
        lotPremium: null
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [showAlert, setShowAlert] = useState(false);

    // Queries
    const { loading: planLoading, data: planData } = useQuery(GET_PLAN, {
        variables: { id: planId },
        skip: !planId
    });
    const { data: optionsData } = useQuery(GET_OPTIONS);
    const { data: interiorData } = useQuery(GET_INTERIOR_PACKAGES);
    const { data: lotData } = useQuery(GET_LOT_PREMIUMS);

    // Mutation
    const [saveHome] = useMutation(SAVE_USER_HOME);

    const plan = planData?.plan;
    const options = optionsData?.options || [];
    const interiorPackages = interiorData?.interiorPackages || [];
    const lotPremiums = lotData?.lotPremiums || [];

    // Calculate total price whenever customization changes
    useEffect(() => {
        if (plan) {
            let total = plan.basePrice || 0;

            if (customization.elevation) {
                total += customization.elevation.price || 0;
            }

            if (customization.interior) {
                total += customization.interior.totalPrice || 0;
            }

            if (customization.kitchenAppliance) {
                total += customization.kitchenAppliance.price || 0;
            }

            if (customization.laundryAppliance) {
                total += customization.laundryAppliance.price || 0;
            }

            if (customization.lotPremium) {
                total += customization.lotPremium.price || 0;
            }

            // Add structural options
            customization.structural.forEach((option: any) => {
                total += option.price || 0;
            });

            // Add additional options
            customization.additional.forEach((option: any) => {
                total += option.price || 0;
            });

            setTotalPrice(total);
        }
    }, [customization, plan]);

    // Set default selections when plan loads
    useEffect(() => {
        if (plan) {
            setCustomization(prev => ({
                ...prev,
                elevation: plan.elevations?.[0] || null,
                interior: plan.interiors?.[0] || null,
                kitchenAppliance: plan.kitchenAppliance?.[0] || null,
                laundryAppliance: plan.laundryAppliance?.[0] || null,
                lotPremium: plan.lotPremium?.[0] || null
            }));
        }
    }, [plan]);

    const handleOptionChange = (category: keyof CustomizationState, value: any) => {
        setCustomization(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleArrayOptionChange = (category: 'structural' | 'additional', option: any, checked: boolean) => {
        setCustomization(prev => ({
            ...prev,
            [category]: checked
                ? [...prev[category], option]
                : prev[category].filter((item: any) => item._id !== option._id)
        }));
    };

    const handleSaveHome = async () => {

        try {
            await saveHome({
                variables: {
                    userHome: {
                        planTypeId: plan._id,
                        planTypeName: plan.name,
                        basePrice: plan.basePrice,
                        elevation: customization.elevation,
                        colorScheme: customization.colorScheme,
                        interior: customization.interior,
                        structural: customization.structural,
                        additional: customization.additional,
                        kitchenAppliance: customization.kitchenAppliance,
                        laundryAppliance: customization.laundryAppliance,
                        lotPremium: customization.lotPremium
                    }
                }
            });

            navigate('/saved-homes');
        } catch (err) {
            console.error('Error saving home:', err);
            setShowAlert(true);
        }
    };

    if (planLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p className="mt-3 text-muted">Loading plan details...</p>
            </div>
        );
    }

    if (!plan) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <h4>Plan not found!</h4>
                    <p>The requested plan could not be found.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row>
                <Col lg={8}>
                    <div className="mb-4">
                        <h1 className="mb-2">Customize Your {plan.name}</h1>
                        <p className="text-muted">Design your dream home with our premium options</p>
                    </div>

                    <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='warning'>
                        Please log in to save your home customization!
                    </Alert>

                    {/* Elevation Selection */}
                    <div className="customization-section">
                        <div className="customization-header">
                            🏠 Exterior Elevation
                        </div>
                        <div className="customization-body">
                            <Row>
                                {plan.elevations?.map((elevation: any) => (
                                    <Col key={elevation._id} md={6} className="mb-3">
                                        <div
                                            className={`option-item ${customization.elevation?._id === elevation._id ? 'selected' : ''}`}
                                            onClick={() => handleOptionChange('elevation', elevation)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{elevation.name}</h6>
                                                    <p className="option-description mb-0">{elevation.description}</p>
                                                </div>
                                                <div className="option-price">
                                                    +${elevation.price?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>

                    {/* Interior Package Selection */}
                    <div className="customization-section">
                        <div className="customization-header">
                            🎨 Interior Package
                        </div>
                        <div className="customization-body">
                            <Row>
                                {plan.interiors?.map((interior: any) => (
                                    <Col key={interior._id} md={6} className="mb-3">
                                        <div
                                            className={`option-item ${customization.interior?._id === interior._id ? 'selected' : ''}`}
                                            onClick={() => handleOptionChange('interior', interior)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{interior.name}</h6>
                                                    <p className="option-description mb-0">{interior.description}</p>
                                                </div>
                                                <div className="option-price">
                                                    +${interior.totalPrice?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>

                    {/* Structural Options */}
                    <div className="customization-section">
                        <div className="customization-header">
                            🏗️ Structural Options
                        </div>
                        <div className="customization-body">
                            <Row>
                                {options.filter((option: any) => option.category === 'structural').map((option: any) => (
                                    <Col key={option._id} md={6} className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id={`structural-${option._id}`}
                                            label={
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1">{option.name}</h6>
                                                        <p className="option-description mb-0">{option.description}</p>
                                                    </div>
                                                    <div className="option-price">
                                                        +${option.price?.toLocaleString()}
                                                    </div>
                                                </div>
                                            }
                                            checked={customization.structural.some((item: any) => item._id === option._id)}
                                            onChange={(e) => handleArrayOptionChange('structural', option, e.target.checked)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>

                    {/* Additional Features */}
                    <div className="customization-section">
                        <div className="customization-header">
                            ✨ Additional Features
                        </div>
                        <div className="customization-body">
                            <Row>
                                {options.filter((option: any) => option.category === 'additional').map((option: any) => (
                                    <Col key={option._id} md={6} className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id={`additional-${option._id}`}
                                            label={
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1">{option.name}</h6>
                                                        <p className="option-description mb-0">{option.description}</p>
                                                    </div>
                                                    <div className="option-price">
                                                        +${option.price?.toLocaleString()}
                                                    </div>
                                                </div>
                                            }
                                            checked={customization.additional.some((item: any) => item._id === option._id)}
                                            onChange={(e) => handleArrayOptionChange('additional', option, e.target.checked)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>

                    {/* Lot Premium */}
                    <div className="customization-section">
                        <div className="customization-header">
                            🏞️ Lot Premium
                        </div>
                        <div className="customization-body">
                            <Row>
                                {lotPremiums.map((lot: any) => (
                                    <Col key={lot._id} md={6} className="mb-3">
                                        <div
                                            className={`option-item ${customization.lotPremium?._id === lot._id ? 'selected' : ''}`}
                                            onClick={() => handleOptionChange('lotPremium', lot)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{lot.name}</h6>
                                                    <p className="option-description mb-0">{lot.description}</p>
                                                </div>
                                                <div className="option-price">
                                                    +${lot.price?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                </Col>

                {/* Price Summary Sidebar */}
                <Col lg={4}>
                    <div className="sticky-sidebar">
                        <Card className="price-summary">
                            <Card.Header>
                                <h5 className="mb-0">💰 Price Summary</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="price-total">
                                    ${totalPrice.toLocaleString()}
                                </div>
                                <p className="text-center text-muted mb-4">Total Estimated Cost</p>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-100 mb-3"
                                    onClick={handleSaveHome}
                                    disabled={!isAuthenticated}
                                >
                                    {isAuthenticated ? 'Save Home Design' : 'Login to Save'}
                                </Button>

                                {!isAuthenticated && (
                                    <p className="text-center text-muted small">
                                        You must be logged in to save your home design
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomizeHome; 