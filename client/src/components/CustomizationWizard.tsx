import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SAVE_USER_HOME, SAVE_USER_HOME_PROGRESS } from '../utils/mutations';
import AuthService from '../utils/auth';
import { cleanUserHomeForMutation, validateUserHomeForSave } from '../utils/cleanGraphQLObject';
import type { CustomizationState } from '../models/models';

// Step Components
import ElevationStep from './wizard-steps/ElevationStep';
import InteriorStep from './wizard-steps/InteriorStep';
import StructuralStep from './wizard-steps/StructuralStep';
import AdditionalStep from './wizard-steps/AdditionalStep';
import ApplianceStep from './wizard-steps/ApplianceStep';
import LotSelectionStep from './wizard-steps/LotSelectionStep';
import PricingStep from './wizard-steps/PricingStep';

// CustomizationState is now imported from types/models

interface CustomizationWizardProps {
    plan: any;
    options: any[];
    interiorPackages: any[];
    lotPremiums: any[];
    colorSchemes: any[];
}

const CustomizationWizard: React.FC<CustomizationWizardProps> = ({
    plan,
    options,
    interiorPackages,
    lotPremiums,
    colorSchemes
}) => {
    const navigate = useNavigate();
    const isAuthenticated = AuthService.loggedIn();
    const [saveHome] = useMutation(SAVE_USER_HOME);
    const [saveProgress] = useMutation(SAVE_USER_HOME_PROGRESS);

    const [currentStep, setCurrentStep] = useState(0);
    const [customization, setCustomization] = useState<CustomizationState>({
        elevation: null,
        colorScheme: null,
        interior: null,
        structural: [],
        additional: [],
        kitchenAppliance: null,
        laundryAppliance: null,
        lotPremium: null
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const steps = [
        { id: 'elevation', title: 'Exterior', description: 'Choose your elevation style', icon: '🏠' },
        { id: 'interior', title: 'Interior', description: 'Select interior package', icon: '🎨' },
        { id: 'structural', title: 'Structure', description: 'Add structural features', icon: '🏗️' },
        { id: 'additional', title: 'Features', description: 'Additional amenities', icon: '✨' },
        { id: 'appliances', title: 'Appliances', description: 'Kitchen & laundry', icon: '🔧' },
        { id: 'lot', title: 'Lot Selection', description: 'Choose your lot', icon: '🏞️' },
        { id: 'pricing', title: 'Review & Save', description: 'Final pricing', icon: '💰' }
    ];

    // Initialize empty selections when plan loads (removed auto-selection)
    useEffect(() => {
        if (plan && colorSchemes.length > 0) {
            setCustomization(prev => ({
                ...prev,
                elevation: null,
                colorScheme: null,
                interior: null,
                kitchenAppliance: null,
                laundryAppliance: null,
            }));
        }
    }, [plan, colorSchemes]);

    // Calculate total price whenever customization changes
    useEffect(() => {
        if (plan) {
            let total = plan.basePrice || 0;

            if (customization.elevation) {
                total += customization.elevation.price || 0;
            }

            if (customization.colorScheme) {
                total += customization.colorScheme.price || 0;
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

            customization.structural.forEach((option: any) => {
                total += option.price || 0;
            });

            customization.additional.forEach((option: any) => {
                total += option.price || 0;
            });

            setTotalPrice(total);
        }
    }, [customization, plan]);

    // Check if current step is complete
    useEffect(() => {
        const checkStepComplete = () => {
            switch (currentStep) {
                case 0: // Elevation & Color Scheme
                    return !!customization.elevation && !!customization.colorScheme;
                case 1: // Interior
                    return !!customization.interior;
                case 2: // Structural
                    return true; // Optional step
                case 3: // Additional
                    return true; // Optional step
                case 4: // Appliances
                    return !!customization.kitchenAppliance && !!customization.laundryAppliance;
                case 5: // Lot
                    return !!customization.lotPremium;
                case 6: // Pricing/Review
                    return !!customization.elevation && !!customization.colorScheme &&
                        !!customization.interior && !!customization.kitchenAppliance &&
                        !!customization.laundryAppliance && !!customization.lotPremium;
                default:
                    return false;
            }
        };
        setIsComplete(checkStepComplete());
    }, [currentStep, customization]);

    // Auto-save progress when customization changes (debounced)
    useEffect(() => {
        if (!isAuthenticated || !plan) return;

        const timer = setTimeout(() => {
            handleSaveProgress(false);
        }, 2000); // Save after 2 seconds of inactivity

        return () => clearTimeout(timer);
    }, [customization, isAuthenticated, plan]);

    const handleSaveProgress = async (isCompleteCustomization: boolean = false) => {
        if (!isAuthenticated || !plan || isSaving) return;

        setIsSaving(true);
        try {
            await saveProgress({
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
                    },
                    isComplete: isCompleteCustomization
                }
            });
            setLastSaved(new Date());
        } catch (err) {
            console.error('Error saving progress:', err);
        } finally {
            setIsSaving(false);
        }
    };

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

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSaveHome = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            // Create user home object for validation and cleaning
            const userHomeData = {
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
                lotPremium: customization.lotPremium,
                totalPrice: totalPrice,
                isComplete: true
            };

            // Validate required fields
            const validationErrors = validateUserHomeForSave(userHomeData);
            if (validationErrors.length > 0) {
                alert(`Please complete the following before saving:\n${validationErrors.join('\n')}`);
                return;
            }

            // Clean the data for mutation
            const cleanedUserHome = cleanUserHomeForMutation(userHomeData);

            if (!cleanedUserHome) {
                throw new Error('Failed to prepare user home data for saving');
            }

            // Save as complete customization first
            await handleSaveProgress(true);

            // Then save to the main saved homes
            await saveHome({
                variables: {
                    userHome: cleanedUserHome
                }
            });

            navigate('/saved-homes');
        } catch (err: any) {
            console.error('Error saving home:', err);
            alert(`Error saving home: ${err.message || 'Unknown error occurred'}`);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <ElevationStep
                        elevations={plan?.elevations || []}
                        selected={customization.elevation}
                        onSelect={(elevation) => handleOptionChange('elevation', elevation)}
                        colorScheme={customization.colorScheme}
                        onColorSchemeChange={(scheme) => handleOptionChange('colorScheme', scheme)}
                        availableColorSchemes={colorSchemes}
                        planType={plan?.planType}
                    />
                );
            case 1:
                return (
                    <InteriorStep
                        interiors={plan?.interiors || []}
                        selected={customization.interior}
                        onSelect={(interior) => handleOptionChange('interior', interior)}
                    />
                );
            case 2:
                return (
                    <StructuralStep
                        options={options.filter(opt => opt.category === 'structural')}
                        selected={customization.structural}
                        onToggle={(option, checked) => handleArrayOptionChange('structural', option, checked)}
                    />
                );
            case 3:
                return (
                    <AdditionalStep
                        options={options.filter(opt => opt.category === 'additional')}
                        selected={customization.additional}
                        onToggle={(option, checked) => handleArrayOptionChange('additional', option, checked)}
                    />
                );
            case 4:
                return (
                    <ApplianceStep
                        kitchenOptions={plan?.kitchenAppliance || []}
                        laundryOptions={plan?.laundryAppliance || []}
                        selectedKitchen={customization.kitchenAppliance}
                        selectedLaundry={customization.laundryAppliance}
                        onKitchenSelect={(appliance) => handleOptionChange('kitchenAppliance', appliance)}
                        onLaundrySelect={(appliance) => handleOptionChange('laundryAppliance', appliance)}
                    />
                );
            case 5:
                return (
                    <LotSelectionStep
                        lotPremiums={lotPremiums}
                        selectedPlan={plan}
                        selected={customization.lotPremium}
                        onSelect={(lot) => handleOptionChange('lotPremium', lot)}
                    />
                );
            case 6:
                return (
                    <PricingStep
                        plan={plan}
                        customization={customization}
                        totalPrice={totalPrice}
                        onSave={handleSaveHome}
                        isAuthenticated={isAuthenticated}
                    />
                );
            default:
                return null;
        }
    };

    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    return (
        <Container className="customization-wizard py-4">
            {/* Progress Header */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h2 className="mb-1">Customize Your {plan?.name}</h2>
                            <p className="text-muted mb-0">Step {currentStep + 1} of {steps.length}</p>
                        </div>
                        <div className="text-end">
                            <h4 className="mb-0 text-primary">${totalPrice.toLocaleString()}</h4>
                            <small className="text-muted">Total Price</small>
                            {isAuthenticated && (
                                <div className="mt-1">
                                    {isSaving ? (
                                        <small className="text-warning">
                                            <div className="spinner-border spinner-border-sm me-1" style={{ width: '12px', height: '12px' }} />
                                            Saving...
                                        </small>
                                    ) : lastSaved ? (
                                        <small className="text-success">
                                            ✓ Saved {lastSaved.toLocaleTimeString()}
                                        </small>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    <ProgressBar
                        now={progressPercentage}
                        className="mb-3"
                        style={{ height: '8px' }}
                    />

                    <div className="step-indicators d-flex justify-content-between">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`step-indicator text-center ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                style={{ flex: 1 }}
                            >
                                <div
                                    className={`step-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${index === currentStep ? 'bg-primary text-white' :
                                            index < currentStep ? 'bg-success text-white' : 'bg-light text-muted'
                                        }`}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                >
                                    {index < currentStep ? '✓' : step.icon}
                                </div>
                                <div className="step-title">
                                    <small className={`fw-bold ${index === currentStep ? 'text-primary' : index < currentStep ? 'text-success' : 'text-muted'}`}>
                                        {step.title}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Step Content */}
            <Row>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-transparent border-0 p-4">
                            <div className="d-flex align-items-center">
                                <div className="step-icon me-3">
                                    <span style={{ fontSize: '2rem' }}>{steps[currentStep].icon}</span>
                                </div>
                                <div>
                                    <h4 className="mb-1">{steps[currentStep].title}</h4>
                                    <p className="text-muted mb-0">{steps[currentStep].description}</p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {renderStepContent()}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Navigation Sidebar */}
                <Col lg={4}>
                    <div className="sticky-sidebar">
                        {/* Step Navigation */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-light border-0">
                                <h6 className="mb-0">Navigation</h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="list-group list-group-flush">
                                    {steps.map((step, index) => (
                                        <button
                                            key={step.id}
                                            type="button"
                                            className={`list-group-item list-group-item-action d-flex align-items-center ${index === currentStep ? 'active' : ''
                                                }`}
                                            onClick={() => setCurrentStep(index)}
                                            disabled={index > currentStep}
                                        >
                                            <span className="me-2">{step.icon}</span>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold">{step.title}</div>
                                                <small className="text-muted">{step.description}</small>
                                            </div>
                                            {index < currentStep && (
                                                <Badge bg="success" className="ms-2">✓</Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                    >
                                        ← Previous
                                    </Button>

                                    {currentStep < steps.length - 1 ? (
                                        <Button
                                            variant="primary"
                                            onClick={nextStep}
                                            disabled={!isComplete}
                                        >
                                            Next →
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="success"
                                            onClick={handleSaveHome}
                                            disabled={!isAuthenticated}
                                            size="lg"
                                        >
                                            {isAuthenticated ? '💾 Save Home Design' : '🔐 Login to Save'}
                                        </Button>
                                    )}
                                </div>

                                {!isAuthenticated && currentStep === steps.length - 1 && (
                                    <p className="text-center text-muted small mt-2">
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

export default CustomizationWizard;