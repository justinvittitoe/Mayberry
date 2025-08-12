import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Badge, Form, Button, Modal } from 'react-bootstrap';

interface LotSelectionStepProps {
    lotPremiums: any[];
    selectedPlan: any;
    selected: any;
    onSelect: (lot: any) => void;
}

const LotSelectionStep: React.FC<LotSelectionStepProps> = ({
    lotPremiums,
    selectedPlan,
    selected,
    onSelect
}) => {
    const [filterFiling, setFilterFiling] = useState<number | ''>('');
    const [filterPrice, setFilterPrice] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('filing');
    const [showLotDetails, setShowLotDetails] = useState<any>(null);

    // Group lots by filing
    const lotsByFiling = useMemo(() => {
        const grouped: { [key: number]: any[] } = {};
        lotPremiums.forEach(lot => {
            if (!grouped[lot.filing]) {
                grouped[lot.filing] = [];
            }
            grouped[lot.filing].push(lot);
        });
        return grouped;
    }, [lotPremiums]);

    // Get unique filings for filter
    const uniqueFilings = useMemo(() => {
        return [...new Set(lotPremiums.map(lot => lot.filing))].sort((a, b) => a - b);
    }, [lotPremiums]);

    // Filter and sort lots
    const filteredLots = useMemo(() => {
        let filtered = [...lotPremiums];

        // Apply filing filter
        if (filterFiling !== '') {
            filtered = filtered.filter(lot => lot.filing === filterFiling);
        }

        // Apply price filter
        switch (filterPrice) {
            case 'low':
                filtered = filtered.filter(lot => lot.price < 10000);
                break;
            case 'medium':
                filtered = filtered.filter(lot => lot.price >= 10000 && lot.price < 25000);
                break;
            case 'high':
                filtered = filtered.filter(lot => lot.price >= 25000);
                break;
        }

        // Apply sorting
        switch (sortBy) {
            case 'filing':
                filtered.sort((a, b) => a.filing - b.filing || a.lot - b.lot);
                break;
            case 'price':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'size':
                filtered.sort((a, b) => (b.width * b.length) - (a.width * a.length));
                break;
            case 'lot':
                filtered.sort((a, b) => a.lot - b.lot);
                break;
        }

        return filtered;
    }, [lotPremiums, filterFiling, filterPrice, sortBy]);

    const getLotStatusColor = (lot: any) => {
        if (selected?._id === lot._id) return 'primary';
        if (lot.price === 0) return 'success';
        if (lot.price < 15000) return 'info';
        if (lot.price < 30000) return 'warning';
        return 'danger';
    };

    const getLotStatusText = (lot: any) => {
        if (lot.price === 0) return 'No Premium';
        if (lot.price < 15000) return 'Low Premium';
        if (lot.price < 30000) return 'Medium Premium';
        return 'High Premium';
    };

    const calculateLotSize = (lot: any) => {
        if (lot.width && lot.length) {
            const sqFt = lot.width * lot.length;
            return {
                sqFt,
                displaySize: `${lot.width}' × ${lot.length}'`,
                acres: (sqFt / 43560).toFixed(2)
            };
        }
        return null;
    };

    return (
        <div className="lot-selection-step">
            <div className="mb-4">
                <h5 className="mb-3">Choose Your Lot</h5>
                <p className="text-muted">
                    Select from available lots in our subdivisions. Lot premiums vary based on location, size, and desirability.
                </p>
            </div>

            {/* Filters and Controls */}
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Filing/Subdivision</Form.Label>
                                <Form.Select 
                                    size="sm"
                                    value={filterFiling}
                                    onChange={(e) => setFilterFiling(e.target.value === '' ? '' : Number(e.target.value))}
                                >
                                    <option value="">All Filings</option>
                                    {uniqueFilings.map(filing => (
                                        <option key={filing} value={filing}>Filing {filing}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Price Range</Form.Label>
                                <Form.Select 
                                    size="sm"
                                    value={filterPrice}
                                    onChange={(e) => setFilterPrice(e.target.value)}
                                >
                                    <option value="all">All Prices</option>
                                    <option value="low">Under $10K</option>
                                    <option value="medium">$10K - $25K</option>
                                    <option value="high">$25K+</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Sort By</Form.Label>
                                <Form.Select 
                                    size="sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="filing">Filing & Lot #</option>
                                    <option value="price">Price (Low to High)</option>
                                    <option value="size">Size (Largest First)</option>
                                    <option value="lot">Lot Number</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <div className="small text-muted">
                                Showing {filteredLots.length} of {lotPremiums.length} lots
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Site Map Grid */}
            <div className="site-map-grid">
                <Row>
                    {filteredLots.map((lot) => {
                        const lotSize = calculateLotSize(lot);
                        const isSelected = selected?._id === lot._id;
                        const statusColor = getLotStatusColor(lot);
                        
                        return (
                            <Col key={lot._id} sm={6} md={4} lg={3} className="mb-3">
                                <Card 
                                    className={`lot-card h-100 ${isSelected ? 'border-primary selected' : 'border-light'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => onSelect(lot)}
                                >
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="mb-1">
                                                    Filing {lot.filing} - Lot {lot.lot}
                                                </h6>
                                                <Badge bg={statusColor} className="small">
                                                    {getLotStatusText(lot)}
                                                </Badge>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                                     style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                        
                                        {lotSize && (
                                            <div className="mb-2">
                                                <small className="text-muted d-block">
                                                    {lotSize.displaySize} • {lotSize.sqFt.toLocaleString()} sq ft
                                                </small>
                                                <small className="text-muted">
                                                    {lotSize.acres} acres
                                                </small>
                                            </div>
                                        )}
                                        
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div className="fw-bold text-primary">
                                                {lot.price > 0 ? `+$${lot.price.toLocaleString()}` : 'No Premium'}
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="outline-secondary" 
                                                className="py-0 px-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowLotDetails(lot);
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>

            {filteredLots.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted">
                        <div style={{ fontSize: '3rem' }} className="mb-3">🏞️</div>
                        <h5>No lots match your criteria</h5>
                        <p>Try adjusting your filters to see more available lots.</p>
                    </div>
                </div>
            )}

            {/* Selected Lot Summary */}
            {selected && (
                <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded border-start border-primary border-4">
                    <div className="d-flex align-items-start">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>🏞️</div>
                        <div>
                            <h6 className="mb-1">Selected Lot</h6>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Filing {selected.filing} - Lot {selected.lot}</span>
                                {calculateLotSize(selected) && (
                                    <Badge bg="secondary">
                                        {calculateLotSize(selected)?.displaySize} • {calculateLotSize(selected)?.acres} acres
                                    </Badge>
                                )}
                                <span className="text-muted">
                                    Lot premium: <strong className="text-primary">
                                        {selected.price > 0 ? `+$${selected.price.toLocaleString()}` : '$0'}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lot Details Modal */}
            <Modal show={!!showLotDetails} onHide={() => setShowLotDetails(null)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Filing {showLotDetails?.filing} - Lot {showLotDetails?.lot} Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showLotDetails && (
                        <Row>
                            <Col md={6}>
                                <h6>Lot Information</h6>
                                <div className="mb-3">
                                    <p><strong>Filing:</strong> {showLotDetails.filing}</p>
                                    <p><strong>Lot Number:</strong> {showLotDetails.lot}</p>
                                    {calculateLotSize(showLotDetails) && (
                                        <>
                                            <p><strong>Dimensions:</strong> {calculateLotSize(showLotDetails)?.displaySize}</p>
                                            <p><strong>Square Footage:</strong> {calculateLotSize(showLotDetails)?.sqFt.toLocaleString()} sq ft</p>
                                            <p><strong>Acreage:</strong> {calculateLotSize(showLotDetails)?.acres} acres</p>
                                        </>
                                    )}
                                    <p><strong>Lot Premium:</strong> {showLotDetails.price > 0 ? `$${showLotDetails.price.toLocaleString()}` : 'No Premium'}</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6>Compatibility</h6>
                                <div className="mb-3">
                                    <p className="text-success">✓ Compatible with {selectedPlan?.name}</p>
                                    <p className="text-muted small">
                                        This lot meets all requirements for your selected floor plan including setbacks, orientation, and utility access.
                                    </p>
                                </div>
                                
                                <h6>Location Features</h6>
                                <div className="mb-3">
                                    <Badge bg="light" text="dark" className="me-2 mb-1">Corner Lot</Badge>
                                    <Badge bg="light" text="dark" className="me-2 mb-1">Mature Trees</Badge>
                                    <Badge bg="light" text="dark" className="me-2 mb-1">Cul-de-Sac</Badge>
                                    <p className="text-muted small mt-2">
                                        Note: Actual lot features may vary. Please visit the site for current conditions.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLotDetails(null)}>
                        Close
                    </Button>
                    {showLotDetails && (
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                onSelect(showLotDetails);
                                setShowLotDetails(null);
                            }}
                        >
                            Select This Lot
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Information Panel */}
            <div className="mt-4 p-3 bg-light rounded">
                <div className="d-flex align-items-start">
                    <div className="me-3" style={{ fontSize: '1.5rem' }}>💡</div>
                    <div>
                        <h6 className="mb-1">Lot Selection Guide</h6>
                        <ul className="small mb-0 text-muted">
                            <li><strong>No Premium:</strong> Standard lots with base pricing</li>
                            <li><strong>Low Premium:</strong> Desirable locations with minor premiums</li>
                            <li><strong>Medium Premium:</strong> Premium locations with special features</li>
                            <li><strong>High Premium:</strong> Prime lots with exceptional locations or features</li>
                            <li>All lots are pre-approved for your selected floor plan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LotSelectionStep;