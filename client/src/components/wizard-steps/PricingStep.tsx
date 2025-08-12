import React, { useState, useRef } from 'react';
import { Card, Table, Button, Badge, Modal, Row, Col, Form } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

interface PricingStepProps {
    plan: any;
    customization: any;
    totalPrice: number;
    onSave: () => void;
    isAuthenticated: boolean;
}

const PricingStep: React.FC<PricingStepProps> = ({
    plan,
    customization,
    totalPrice,
    onSave,
    isAuthenticated
}) => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [showFinancing, setShowFinancing] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `${plan?.name} - Pricing Sheet`,
    });

    const calculateEarnestMoney = (price: number) => {
        // Typically 1-3% of home price, we'll use 2%
        return Math.round(price * 0.02);
    };

    const getFinancingEstimate = (homePrice: number, downPayment: number = 0.20) => {
        const loanAmount = homePrice * (1 - downPayment);
        const monthlyRate = 0.065 / 12; // Assuming 6.5% APR
        const numPayments = 30 * 12; // 30 year mortgage
        
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        return {
            loanAmount,
            downPaymentAmount: homePrice * downPayment,
            monthlyPayment,
            totalInterest: (monthlyPayment * numPayments) - loanAmount
        };
    };

    const getPriceBreakdown = () => {
        const breakdown = [
            { category: 'Base Price', item: plan?.name, amount: plan?.basePrice || 0, required: true }
        ];

        if (customization.elevation && customization.elevation.price > 0) {
            breakdown.push({
                category: 'Elevation',
                item: customization.elevation.name,
                amount: customization.elevation.price,
                required: false
            });
        }

        if (customization.interior) {
            breakdown.push({
                category: 'Interior Package',
                item: customization.interior.name,
                amount: customization.interior.totalPrice || 0,
                required: false
            });
        }

        if (customization.structural && customization.structural.length > 0) {
            customization.structural.forEach((option: any) => {
                breakdown.push({
                    category: 'Structural',
                    item: option.name,
                    amount: option.price || 0,
                    required: false
                });
            });
        }

        if (customization.additional && customization.additional.length > 0) {
            customization.additional.forEach((option: any) => {
                breakdown.push({
                    category: 'Additional Features',
                    item: option.name,
                    amount: option.price || 0,
                    required: false
                });
            });
        }

        if (customization.kitchenAppliance && customization.kitchenAppliance.price > 0) {
            breakdown.push({
                category: 'Kitchen Appliances',
                item: customization.kitchenAppliance.name,
                amount: customization.kitchenAppliance.price,
                required: false
            });
        }

        if (customization.laundryAppliance && customization.laundryAppliance.price > 0) {
            breakdown.push({
                category: 'Laundry Setup',
                item: customization.laundryAppliance.name,
                amount: customization.laundryAppliance.price,
                required: false
            });
        }

        if (customization.lotPremium) {
            breakdown.push({
                category: 'Lot Premium',
                item: `Filing ${customization.lotPremium.filing} - Lot ${customization.lotPremium.lot}`,
                amount: customization.lotPremium.price || 0,
                required: false
            });
        }

        return breakdown;
    };

    const priceBreakdown = getPriceBreakdown();
    const earnestMoney = calculateEarnestMoney(totalPrice);
    const financing = getFinancingEstimate(totalPrice);

    const PrintableSheet = () => (
        <div ref={printRef} className="printable-sheet" style={{ padding: '40px', backgroundColor: 'white' }}>
            <div className="text-center mb-4">
                <h2 className="mb-1">Mayberry Home Builder</h2>
                <h4 className="text-muted">Home Customization Pricing Sheet</h4>
                <p className="text-muted">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Header><strong>Selected Plan</strong></Card.Header>
                        <Card.Body>
                            <h5>{plan?.name}</h5>
                            <p className="mb-1">{plan?.bedrooms} Bedrooms • {plan?.bathrooms} Bathrooms</p>
                            <p className="mb-1">{plan?.squareFootage?.toLocaleString()} sq ft</p>
                            <p className="mb-0">{plan?.description}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header><strong>Pricing Summary</strong></Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Home Price:</span>
                                <strong>${totalPrice.toLocaleString()}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Earnest Money (2%):</span>
                                <strong>${earnestMoney.toLocaleString()}</strong>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span><strong>Amount Due at Contract:</strong></span>
                                <strong className="text-primary">${earnestMoney.toLocaleString()}</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header><strong>Detailed Price Breakdown</strong></Card.Header>
                <Card.Body className="p-0">
                    <Table className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Category</th>
                                <th>Item</th>
                                <th className="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priceBreakdown.map((item, index) => (
                                <tr key={index} className={item.required ? 'table-primary' : ''}>
                                    <td>{item.category}</td>
                                    <td>{item.item}</td>
                                    <td className="text-end">
                                        {item.amount > 0 ? `$${item.amount.toLocaleString()}` : 'Included'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="table-success">
                                <td colSpan={2}><strong>Total Home Price</strong></td>
                                <td className="text-end"><strong>${totalPrice.toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {showFinancing && (
                <Card className="mb-4">
                    <Card.Header><strong>Financing Estimate (20% Down)</strong></Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <p><strong>Home Price:</strong> ${totalPrice.toLocaleString()}</p>
                                <p><strong>Down Payment:</strong> ${financing.downPaymentAmount.toLocaleString()}</p>
                                <p><strong>Loan Amount:</strong> ${financing.loanAmount.toLocaleString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Estimated Monthly Payment:</strong> ${Math.round(financing.monthlyPayment).toLocaleString()}</p>
                                <p><strong>Interest Rate:</strong> 6.5% APR (estimated)</p>
                                <p><strong>Loan Term:</strong> 30 years</p>
                            </Col>
                        </Row>
                        <p className="small text-muted">
                            *Financing estimates are for reference only. Actual rates and terms depend on credit qualification and lender requirements.
                        </p>
                    </Card.Body>
                </Card>
            )}

            <div className="text-center mt-4">
                <p className="text-muted">
                    This pricing is valid for 30 days and subject to availability and final approval.
                    Contact us at (555) 123-4567 or info@mayberryhomes.com for more information.
                </p>
            </div>
        </div>
    );

    return (
        <div className="pricing-step">
            <div className="mb-4">
                <h5 className="mb-3">Review Your Home & Pricing</h5>
                <p className="text-muted">
                    Review your selections and total pricing. You can print or email this pricing sheet for your records.
                </p>
            </div>

            {/* Customization Summary */}
            <Row className="mb-4">
                <Col lg={8}>
                    <Card className="h-100">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Your Selections</h6>
                            <div className="d-flex gap-2">
                                <Button size="sm" variant="outline-primary" onClick={() => setShowFinancing(!showFinancing)}>
                                    {showFinancing ? 'Hide' : 'Show'} Financing
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={handlePrint}>
                                    🖨️ Print
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setShowEmailModal(true)}>
                                    📧 Email
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="selections-grid">
                                {customization.elevation && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>🏠 Elevation:</strong> {customization.elevation.name}
                                                <div className="small text-muted">Color Scheme: Option {customization.colorScheme}</div>
                                            </div>
                                            <Badge bg="primary">
                                                {customization.elevation.price > 0 ? `+$${customization.elevation.price.toLocaleString()}` : 'Included'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {customization.interior && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>🎨 Interior:</strong> {customization.interior.name}
                                            </div>
                                            <Badge bg="primary">+${customization.interior.totalPrice?.toLocaleString() || 0}</Badge>
                                        </div>
                                    </div>
                                )}

                                {customization.structural.length > 0 && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div>
                                            <strong>🏗️ Structural Options:</strong>
                                            {customization.structural.map((option: any, index: number) => (
                                                <div key={index} className="d-flex justify-content-between mt-1">
                                                    <span className="small">• {option.name}</span>
                                                    <Badge bg="secondary" className="small">
                                                        {option.price > 0 ? `+$${option.price.toLocaleString()}` : 'Included'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {customization.additional.length > 0 && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div>
                                            <strong>✨ Additional Features:</strong>
                                            {customization.additional.map((option: any, index: number) => (
                                                <div key={index} className="d-flex justify-content-between mt-1">
                                                    <span className="small">• {option.name}</span>
                                                    <Badge bg="secondary" className="small">
                                                        {option.price > 0 ? `+$${option.price.toLocaleString()}` : 'Included'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {customization.kitchenAppliance && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>🍳 Kitchen:</strong> {customization.kitchenAppliance.name}
                                            </div>
                                            <Badge bg="primary">
                                                {customization.kitchenAppliance.price > 0 ? `+$${customization.kitchenAppliance.price.toLocaleString()}` : 'Included'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {customization.laundryAppliance && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>🧺 Laundry:</strong> {customization.laundryAppliance.name}
                                            </div>
                                            <Badge bg="primary">
                                                {customization.laundryAppliance.price > 0 ? `+$${customization.laundryAppliance.price.toLocaleString()}` : 'Included'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {customization.lotPremium && (
                                    <div className="selection-item mb-3 p-2 bg-light rounded">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>🏞️ Lot:</strong> Filing {customization.lotPremium.filing} - Lot {customization.lotPremium.lot}
                                                {customization.lotPremium.width && customization.lotPremium.length && (
                                                    <div className="small text-muted">
                                                        {customization.lotPremium.width}' × {customization.lotPremium.length}'
                                                    </div>
                                                )}
                                            </div>
                                            <Badge bg="primary">
                                                {customization.lotPremium.price > 0 ? `+$${customization.lotPremium.price.toLocaleString()}` : 'No Premium'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="h-100">
                        <Card.Header>
                            <h6 className="mb-0">💰 Investment Summary</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="pricing-summary">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Base Price:</span>
                                    <strong>${plan?.basePrice?.toLocaleString() || 0}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Upgrades:</span>
                                    <strong>+${(totalPrice - (plan?.basePrice || 0)).toLocaleString()}</strong>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <span><strong>Total Price:</strong></span>
                                    <h4 className="text-primary mb-0">${totalPrice.toLocaleString()}</h4>
                                </div>
                                
                                <div className="earnest-money mb-3 p-3 bg-primary bg-opacity-10 rounded">
                                    <div className="text-center">
                                        <div className="small text-muted mb-1">Earnest Money (2%)</div>
                                        <h5 className="text-primary mb-0">${earnestMoney.toLocaleString()}</h5>
                                        <small className="text-muted">Due at contract signing</small>
                                    </div>
                                </div>

                                {showFinancing && (
                                    <div className="financing-info mb-3 p-3 bg-light rounded">
                                        <h6 className="mb-2">Financing Estimate</h6>
                                        <div className="small">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Down Payment (20%):</span>
                                                <strong>${financing.downPaymentAmount.toLocaleString()}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Monthly Payment:</span>
                                                <strong>${Math.round(financing.monthlyPayment).toLocaleString()}</strong>
                                            </div>
                                            <div className="text-muted">
                                                <small>*Est. 6.5% APR, 30 years</small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Action Buttons */}
            <div className="text-center">
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button
                        variant="success"
                        size="lg"
                        onClick={onSave}
                        disabled={!isAuthenticated}
                        className="px-4"
                    >
                        {isAuthenticated ? '💾 Save Home Design' : '🔐 Login to Save'}
                    </Button>
                    
                    {!isAuthenticated && (
                        <div className="text-muted mt-2">
                            <small>Create an account or log in to save your customization and access pricing sheets.</small>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Printable Component */}
            <div style={{ display: 'none' }}>
                <PrintableSheet />
            </div>

            {/* Email Modal */}
            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Email Pricing Sheet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email address"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                            />
                        </Form.Group>
                        <div className="text-muted small">
                            We'll send you a PDF copy of your pricing sheet. Your email will not be shared or used for marketing without permission.
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => {
                            // Here you would implement the email functionality
                            console.log('Sending pricing sheet to:', emailAddress);
                            setShowEmailModal(false);
                            setEmailAddress('');
                        }}
                        disabled={!emailAddress}
                    >
                        Send Email
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PricingStep;