import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, Alert, Badge, Button, Spinner, Form, ListGroup } from 'react-bootstrap';
import {
  ADD_ELEVATION_TO_PLAN,
  REMOVE_ELEVATION_FROM_PLAN,
  ADD_STRUCTURAL_TO_PLAN,
  REMOVE_STRUCTURAL_FROM_PLAN,
  ADD_INTERIOR_PACKAGE_TO_PLAN,
  REMOVE_INTERIOR_PACKAGE_FROM_PLAN,
  ADD_APPLIANCE_TO_PLAN,
  REMOVE_APPLIANCE_FROM_PLAN,
  ADD_ADDITIONAL_TO_PLAN,
  REMOVE_ADDITIONAL_FROM_PLAN,
  ADD_COLOR_SCHEME_TO_PLAN,
  REMOVE_COLOR_SCHEME_FROM_PLAN,
  ADD_LOT_PRICING_TO_PLAN,
  REMOVE_LOT_PRICING_FROM_PLAN
} from '../../graphQl/planOptionMutations';
import {
  GET_ELEVATION_OPTIONS,
  GET_STRUCTURAL_OPTIONS,
  GET_INTERIOR_PACKAGES,
  GET_APPLIANCES,
  GET_ADDITIONAL_OPTIONS,
  GET_COLOR_SCHEMES,
  GET_LOT_PRICING
} from '../../graphQl/queries';
import { Plan } from '../../models/graphql';

interface SimplePlanOptionSelectorProps {
  plan: Plan;
  onUpdate: () => void;
}

const SimplePlanOptionSelector: React.FC<SimplePlanOptionSelectorProps> = ({ plan, onUpdate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('elevations');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger' | 'info'; message: string } | null>(null);

  // Fetch all available options
  const { data: elevationsData, loading: elevationsLoading } = useQuery(GET_ELEVATION_OPTIONS);
  const { data: structuralData, loading: structuralLoading } = useQuery(GET_STRUCTURAL_OPTIONS);
  const { data: interiorPackagesData, loading: interiorPackagesLoading } = useQuery(GET_INTERIOR_PACKAGES);
  const { data: appliancesData, loading: appliancesLoading } = useQuery(GET_APPLIANCES);
  const { data: additionalData, loading: additionalLoading } = useQuery(GET_ADDITIONAL_OPTIONS);
  const { data: colorSchemesData, loading: colorSchemesLoading } = useQuery(GET_COLOR_SCHEMES);
  const { data: lotPricingData, loading: lotPricingLoading } = useQuery(GET_LOT_PRICING);

  // Mutations
  const [addElevation] = useMutation(ADD_ELEVATION_TO_PLAN, { onCompleted: () => { showAlert('success', 'Elevation added'); onUpdate(); } });
  const [removeElevation] = useMutation(REMOVE_ELEVATION_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Elevation removed'); onUpdate(); } });
  const [addStructural] = useMutation(ADD_STRUCTURAL_TO_PLAN, { onCompleted: () => { showAlert('success', 'Structural option added'); onUpdate(); } });
  const [removeStructural] = useMutation(REMOVE_STRUCTURAL_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Structural option removed'); onUpdate(); } });
  const [addInteriorPackage] = useMutation(ADD_INTERIOR_PACKAGE_TO_PLAN, { onCompleted: () => { showAlert('success', 'Interior package added'); onUpdate(); } });
  const [removeInteriorPackage] = useMutation(REMOVE_INTERIOR_PACKAGE_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Interior package removed'); onUpdate(); } });
  const [addAppliance] = useMutation(ADD_APPLIANCE_TO_PLAN, { onCompleted: () => { showAlert('success', 'Appliance added'); onUpdate(); } });
  const [removeAppliance] = useMutation(REMOVE_APPLIANCE_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Appliance removed'); onUpdate(); } });
  const [addAdditional] = useMutation(ADD_ADDITIONAL_TO_PLAN, { onCompleted: () => { showAlert('success', 'Additional option added'); onUpdate(); } });
  const [removeAdditional] = useMutation(REMOVE_ADDITIONAL_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Additional option removed'); onUpdate(); } });
  const [addColorScheme] = useMutation(ADD_COLOR_SCHEME_TO_PLAN, { onCompleted: () => { showAlert('success', 'Color scheme added'); onUpdate(); } });
  const [removeColorScheme] = useMutation(REMOVE_COLOR_SCHEME_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Color scheme removed'); onUpdate(); } });
  const [addLotPricing] = useMutation(ADD_LOT_PRICING_TO_PLAN, { onCompleted: () => { showAlert('success', 'Lot pricing added'); onUpdate(); } });
  const [removeLotPricing] = useMutation(REMOVE_LOT_PRICING_FROM_PLAN, { onCompleted: () => { showAlert('success', 'Lot pricing removed'); onUpdate(); } });

  const showAlert = (type: 'success' | 'danger' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAdd = async (optionId: string, category: string) => {
    try {
      const variables = { planId: plan._id };

      switch (category) {
        case 'elevations':
          await addElevation({ variables: { ...variables, elevationId: optionId } });
          break;
        case 'structural':
          await addStructural({ variables: { ...variables, structuralId: optionId } });
          break;
        case 'interiorPackages':
          await addInteriorPackage({ variables: { ...variables, interiorPackageId: optionId } });
          break;
        case 'appliances':
          await addAppliance({ variables: { ...variables, applianceId: optionId } });
          break;
        case 'additional':
          await addAdditional({ variables: { ...variables, additionalId: optionId } });
          break;
        case 'colorSchemes':
          await addColorScheme({ variables: { ...variables, colorSchemeId: optionId } });
          break;
        case 'lotPricing':
          await addLotPricing({ variables: { ...variables, lotPricingId: optionId } });
          break;
      }
    } catch (error: any) {
      showAlert('danger', error.message);
    }
  };

  const handleRemove = async (optionId: string, category: string) => {
    try {
      const variables = { planId: plan._id };

      switch (category) {
        case 'elevations':
          await removeElevation({ variables: { ...variables, elevationId: optionId } });
          break;
        case 'structural':
          await removeStructural({ variables: { ...variables, structuralId: optionId } });
          break;
        case 'interiorPackages':
          await removeInteriorPackage({ variables: { ...variables, interiorPackageId: optionId } });
          break;
        case 'appliances':
          await removeAppliance({ variables: { ...variables, applianceId: optionId } });
          break;
        case 'additional':
          await removeAdditional({ variables: { ...variables, additionalId: optionId } });
          break;
        case 'colorSchemes':
          await removeColorScheme({ variables: { ...variables, colorSchemeId: optionId } });
          break;
        case 'lotPricing':
          await removeLotPricing({ variables: { ...variables, lotPricingId: optionId } });
          break;
      }
    } catch (error: any) {
      showAlert('danger', error.message);
    }
  };

  const isOptionSelected = (optionId: string, category: string): boolean => {
    switch (category) {
      case 'elevations':
        return plan.elevations?.some(e => e._id === optionId) || false;
      case 'structural':
        return plan.structural?.some(s => s._id === optionId) || false;
      case 'interiorPackages':
        return plan.interiors?.some(i => i._id === optionId) || false;
      case 'appliances':
        return [...(plan.kitchenAppliance || []), ...(plan.laundryAppliance || [])].some(a => a._id === optionId) || false;
      case 'additional':
        return plan.additional?.some(a => a._id === optionId) || false;
      case 'colorSchemes':
        return plan.colorScheme?.some(c => c._id === optionId) || false;
      case 'lotPricing':
        return plan.lot?.some(l => l._id === optionId) || false;
      default:
        return false;
    }
  };

  const renderOptionsList = (options: any[], category: string, loading: boolean) => {
    if (loading) {
      return <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>;
    }

    if (!options || options.length === 0) {
      return (
        <Alert variant="info" className="mb-0">
          No {category} available. Create options in their respective management pages first.
        </Alert>
      );
    }

    return (
      <ListGroup>
        {options.map((option: any) => {
          const isSelected = isOptionSelected(option._id, category);
          const displayPrice = option.clientPrice || option.price || option.totalCost || option.lotPremium || 0;
          // For lotPricing, display the lot reference ID or premium amount
          const displayName = option.name || (option.lotPremium !== undefined ? `Lot Pricing (Premium: $${option.lotPremium})` : 'Unnamed');

          return (
            <ListGroup.Item key={option._id} className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1">
                <div className="fw-semibold">{displayName}</div>
                <small className="text-muted">
                  {displayPrice > 0 && `$${displayPrice.toLocaleString()}`}
                  {option.description && ` • ${option.description.substring(0, 50)}${option.description.length > 50 ? '...' : ''}`}
                </small>
              </div>
              <div className="d-flex align-items-center gap-2">
                {isSelected && <Badge bg="success">Selected</Badge>}
                {isSelected ? (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleRemove(option._id, category)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleAdd(option._id, category)}
                  >
                    Add
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  };

  const categories = [
    {
      key: 'elevations',
      label: 'Elevations',
      data: elevationsData?.elevationOptions || [],
      loading: elevationsLoading,
      count: plan.elevations?.length || 0
    },
    {
      key: 'colorSchemes',
      label: 'Color Schemes',
      data: colorSchemesData?.colorSchemes || [],
      loading: colorSchemesLoading,
      count: plan.colorScheme?.length || 0
    },
    {
      key: 'interiorPackages',
      label: 'Interior Packages',
      data: interiorPackagesData?.interiorPackages || [],
      loading: interiorPackagesLoading,
      count: plan.interiors?.length || 0
    },
    {
      key: 'structural',
      label: 'Structural Options',
      data: structuralData?.structuralOptions || [],
      loading: structuralLoading,
      count: plan.structural?.length || 0
    },
    {
      key: 'additional',
      label: 'Additional Options',
      data: additionalData?.additionalOptions || [],
      loading: additionalLoading,
      count: plan.additional?.length || 0
    },
    {
      key: 'appliances',
      label: 'Appliances',
      data: appliancesData?.appliances || [],
      loading: appliancesLoading,
      count: (plan.kitchenAppliance?.length || 0) + (plan.laundryAppliance?.length || 0)
    },
    {
      key: 'lotPricing',
      label: 'Lot Pricing',
      data: lotPricingData?.lotPricing || [],
      loading: lotPricingLoading,
      count: plan.lot?.length || 0
    }
  ];

  const activeData = categories.find(c => c.key === activeCategory);

  return (
    <div className="simple-plan-option-selector">
      <h5 className="mb-3">Associate Options with {plan.name}</h5>

      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Alert variant="info" className="mb-3">
        <strong>How it works:</strong> Select from existing options below to associate them with this plan.
        Options must be created first in their respective management pages (e.g., create elevations in the Elevation Manager).
      </Alert>

      {/* Category Tabs */}
      <div className="mb-3">
        <div className="d-flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={activeCategory === cat.key ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label} <Badge bg={activeCategory === cat.key ? 'light' : 'primary'} text={activeCategory === cat.key ? 'primary' : 'light'}>{cat.count}</Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Options List */}
      <Card>
        <Card.Header>
          <h6 className="mb-0">Available {activeData?.label}</h6>
        </Card.Header>
        <Card.Body className="p-0">
          {activeData && renderOptionsList(activeData.data, activeData.key, activeData.loading)}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SimplePlanOptionSelector;
