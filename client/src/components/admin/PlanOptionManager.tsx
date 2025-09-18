import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_ELEVATION_TO_PLAN,
  UPDATE_PLAN_ELEVATION,
  REMOVE_PLAN_ELEVATION,
  ADD_STRUCTURAL_TO_PLAN,
  UPDATE_PLAN_STRUCTURAL,
  REMOVE_PLAN_STRUCTURAL,
  ADD_INTERIOR_TO_PLAN,
  UPDATE_PLAN_INTERIOR,
  REMOVE_PLAN_INTERIOR,
  ADD_APPLIANCE_TO_PLAN,
  UPDATE_PLAN_APPLIANCE,
  REMOVE_PLAN_APPLIANCE,
  ADD_ADDITIONAL_TO_PLAN,
  UPDATE_PLAN_ADDITIONAL,
  REMOVE_PLAN_ADDITIONAL,
  ADD_LOT_TO_PLAN,
  UPDATE_PLAN_LOT,
  REMOVE_PLAN_LOT,
  REORDER_PLAN_OPTIONS
} from '../../utils/planOptionMutations';
import { GET_PLAN_WITH_OPTIONS } from '../../utils/planOptionQueries';
import { Appliance, InteriorPackage, LotPremium, Structural } from '../../models/graphql';

interface PlanOption {
  _id: string;
  name: string;
  price: number;
  description?: string;
  img?: string;
  isActive: boolean;
  sortOrder: number;
  [key: string]: any;
}

interface PlanOptionManagerProps {
  plan: {
    _id: string;
    name: string;
    planType: number;
    elevations: PlanOption[];
    structural: PlanOption[];
    interiors: PlanOption[];
    kitchenAppliance: PlanOption[];
    laundryAppliance: PlanOption[];
    additional: PlanOption[];
    lotPremium: PlanOption[];
  };
  onPlanUpdate: () => void;
}

type OptionType = 'elevations' | 'structural' | 'interiors' | 'kitchenAppliance' | 'laundryAppliance' | 'additional' | 'lotPremium';

const PlanOptionManager: React.FC<PlanOptionManagerProps> = ({ plan, onPlanUpdate }) => {
  const [activeTab, setActiveTab] = useState<OptionType>('elevations');
  const [editingOption, setEditingOption] = useState<PlanOption | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mutations
  const [addElevation] = useMutation(ADD_ELEVATION_TO_PLAN);
  const [updateElevation] = useMutation(UPDATE_PLAN_ELEVATION);
  const [removeElevation] = useMutation(REMOVE_PLAN_ELEVATION);
  const [addStructural] = useMutation(ADD_STRUCTURAL_TO_PLAN);
  const [updateStructural] = useMutation(UPDATE_PLAN_STRUCTURAL);
  const [removeStructural] = useMutation(REMOVE_PLAN_STRUCTURAL);
  const [addInterior] = useMutation(ADD_INTERIOR_TO_PLAN);
  const [updateInterior] = useMutation(UPDATE_PLAN_INTERIOR);
  const [removeInterior] = useMutation(REMOVE_PLAN_INTERIOR);
  const [addAppliance] = useMutation(ADD_APPLIANCE_TO_PLAN);
  const [updateAppliance] = useMutation(UPDATE_PLAN_APPLIANCE);
  const [removeAppliance] = useMutation(REMOVE_PLAN_APPLIANCE);
  const [addAdditional] = useMutation(ADD_ADDITIONAL_TO_PLAN);
  const [updateAdditional] = useMutation(UPDATE_PLAN_ADDITIONAL);
  const [removeAdditional] = useMutation(REMOVE_PLAN_ADDITIONAL);
  const [addLot] = useMutation(ADD_LOT_TO_PLAN);
  const [updateLot] = useMutation(UPDATE_PLAN_LOT);
  const [removeLot] = useMutation(REMOVE_PLAN_LOT);
  const [reorderOptions] = useMutation(REORDER_PLAN_OPTIONS);

  const getMutations = (optionType: OptionType) => {
    switch (optionType) {
      case 'elevations':
        return { add: addElevation, update: updateElevation, remove: removeElevation };
      case 'structural':
        return { add: addStructural, update: updateStructural, remove: removeStructural };
      case 'interiors':
        return { add: addInterior, update: updateInterior, remove: removeInterior };
      case 'kitchenAppliance':
      case 'laundryAppliance':
        return { add: addAppliance, update: updateAppliance, remove: removeAppliance };
      case 'additional':
        return { add: addAdditional, update: updateAdditional, remove: removeAdditional };
      case 'lotPremium':
        return { add: addLot, update: updateLot, remove: removeLot };
      default:
        throw new Error(`Unknown option type: ${optionType}`);
    }
  };

  const handleAddOption = async (optionData: any) => {
    console.log(`Adding ${activeTab} option to plan ${plan._id}:`, optionData);
    try {
      const { add } = getMutations(activeTab);
      const result = await add({
        variables: {
          planId: plan._id,
          [activeTab === 'elevations' ? 'elevation' :
            activeTab === 'structural' ? 'structural' :
              activeTab === 'interiors' ? 'interior' :
                activeTab === 'kitchenAppliance' || activeTab === 'laundryAppliance' ? 'appliance' :
                  activeTab === 'additional' ? 'additional' : 'lot']: optionData
        },
        refetchQueries: [{ query: GET_PLAN_WITH_OPTIONS, variables: { id: plan._id } }]
      });
      console.log(`Added ${activeTab} option result:`, result);
      setShowAddForm(false);
      onPlanUpdate();
    } catch (error) {
      console.error(`Error adding ${activeTab} option:`, error);
    }
  };

  const handleUpdateOption = async (optionId: string, optionData: any) => {
    console.log(`Updating ${activeTab} option ${optionId} for plan ${plan._id}:`, optionData);
    try {
      const { update } = getMutations(activeTab);
      const result = await update({
        variables: {
          planId: plan._id,
          [`${activeTab === 'elevations' ? 'elevation' :
            activeTab === 'structural' ? 'structural' :
              activeTab === 'interiors' ? 'interior' :
                activeTab === 'kitchenAppliance' || activeTab === 'laundryAppliance' ? 'appliance' :
                  activeTab === 'additional' ? 'additional' : 'lot'}Id`]: optionId,
          [activeTab === 'elevations' ? 'elevation' :
            activeTab === 'structural' ? 'structural' :
              activeTab === 'interiors' ? 'interior' :
                activeTab === 'kitchenAppliance' || activeTab === 'laundryAppliance' ? 'appliance' :
                  activeTab === 'additional' ? 'additional' : 'lot']: optionData
        },
        refetchQueries: [{ query: GET_PLAN_WITH_OPTIONS, variables: { id: plan._id } }]
      });
      console.log(`Updated ${activeTab} option result:`, result);
      setEditingOption(null);
      onPlanUpdate();
    } catch (error) {
      console.error(`Error updating ${activeTab} option:`, error);
    }
  };

  const handleRemoveOption = async (optionId: string) => {
    console.log(`Removing ${activeTab} option ${optionId} from plan ${plan._id}`);
    try {
      const { remove } = getMutations(activeTab);
      const result = await remove({
        variables: {
          planId: plan._id,
          [`${activeTab === 'elevations' ? 'elevation' :
            activeTab === 'structural' ? 'structural' :
              activeTab === 'interiors' ? 'interior' :
                activeTab === 'kitchenAppliance' || activeTab === 'laundryAppliance' ? 'appliance' :
                  activeTab === 'additional' ? 'additional' : 'lot'}Id`]: optionId
        },
        refetchQueries: [{ query: GET_PLAN_WITH_OPTIONS, variables: { id: plan._id } }]
      });
      console.log(`Removed ${activeTab} option result:`, result);
      onPlanUpdate();
    } catch (error) {
      console.error(`Error removing ${activeTab} option:`, error);
    }
  };

  const handleReorderOptions = async (newOrder: string[]) => {
    console.log(`Reordering ${activeTab} options for plan ${plan._id}:`, newOrder);
    try {
      const result = await reorderOptions({
        variables: {
          planId: plan._id,
          optionType: activeTab,
          optionIds: newOrder
        },
        refetchQueries: [{ query: GET_PLAN_WITH_OPTIONS, variables: { id: plan._id } }]
      });
      console.log(`Reordered ${activeTab} options result:`, result);
      onPlanUpdate();
    } catch (error) {
      console.error(`Error reordering ${activeTab} options:`, error);
    }
  };

  const renderOptionsList = () => {
    const options = plan[activeTab] || [];
    const sortedOptions = [...options].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
      <div className="option-list">
        {sortedOptions.map((option, index) => (
          <div key={option._id} className="card mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title">{option.name}</h6>
                  <p className="text-muted mb-1">${option.price.toFixed(2)}</p>
                  {option.description && (
                    <p className="card-text small">{option.description}</p>
                  )}
                  <div className="d-flex align-items-center">
                    <span className={`badge ${option.isActive ? 'bg-success' : 'bg-secondary'} me-2`}>
                      {option.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-muted small">Order: {option.sortOrder}</span>
                  </div>
                </div>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingOption(option)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveOption(option._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { key: 'elevations', label: 'Elevations', count: plan.elevations?.length || 0 },
    { key: 'structural', label: 'Structural', count: plan.structural?.length || 0 },
    { key: 'interiors', label: 'Interiors', count: plan.interiors?.length || 0 },
    { key: 'kitchenAppliance', label: 'Kitchen Appliances', count: plan.kitchenAppliance?.length || 0 },
    { key: 'laundryAppliance', label: 'Laundry Appliances', count: plan.laundryAppliance?.length || 0 },
    { key: 'additional', label: 'Additional', count: plan.additional?.length || 0 },
    { key: 'lotPremium', label: 'Lot Premiums', count: plan.lotPremium?.length || 0 }
  ];

  return (
    <div className="plan-option-manager">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Manage Options for {plan.name}</h5>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Option
        </button>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-3">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as OptionType)}
            >
              {tab.label} ({tab.count})
            </button>
          </li>
        ))}
      </ul>

      {/* Options Content */}
      <div className="tab-content">
        {renderOptionsList()}
      </div>

      {/* Add Option Modal */}
      {showAddForm && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Option
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <OptionForm
                  optionType={activeTab}
                  onSubmit={handleAddOption}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Option Modal */}
      {editingOption && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Option
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingOption(null)}
                ></button>
              </div>
              <div className="modal-body">
                <OptionForm
                  optionType={activeTab}
                  initialData={editingOption}
                  onSubmit={(data) => handleUpdateOption(editingOption._id, data)}
                  onCancel={() => setEditingOption(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Form component for adding/editing options
interface OptionFormProps {
  optionType: OptionType;
  initialData?: PlanOption;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const OptionForm: React.FC<OptionFormProps> = ({ optionType, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Structural | InteriorPackage | Appliance | LotPremium | any>(() => {
    // Initialize based on optionType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting ${optionType} option form:`, formData);
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderBaseFields = () => (
    <>
      <div className="mb-3">
        <label className="form-label">Name *</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Price *</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={formData.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input
          type="url"
          className="form-control"
          value={formData.img}
          onChange={(e) => handleChange('img', e.target.value)}
        />
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Sort Order</label>
            <input
              type="number"
              className="form-control"
              value={formData.sortOrder}
              onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
              <label className="form-check-label">Active</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );


  //@ts-ignore
  const renderTypeSpecificFields = () => {
    switch (optionType) {
      case 'structural':
        const structuralData = formData as Structural;
        return (
          <>
            <h6>Structural Specifications</h6>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Garage</label>
                  <input
                    type="number"
                    className="form-control"
                    value={structuralData.garage || 0}
                    onChange={(e) => handleChange('garage', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    value={structuralData.bedrooms || 0}
                    onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={structuralData.bathrooms || 0}
                    onChange={(e) => handleChange('bathrooms', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Width (ft)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={structuralData.width || 0}
                    onChange={(e) => handleChange('width', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Length (ft)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={structuralData.length || 0}
                    onChange={(e) => handleChange('length', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Total Sq Ft</label>
                  <input
                    type="number"
                    className="form-control"
                    value={structuralData.totalSqft || 0}
                    onChange={(e) => handleChange('totalSqft', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Residential Sq Ft</label>
                  <input
                    type="number"
                    className="form-control"
                    value={structuralData.resSqft || 0}
                    onChange={(e) => handleChange('resSqft', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'interiors':
        const interiorData = formData as InteriorPackage;
        return (
          <>
            <h6>Interior Package Details</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Total Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={interiorData.totalPrice || 0}
                    onChange={(e) => handleChange('totalPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Client Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={interiorData.clientPrice || 0}
                    onChange={(e) => handleChange('clientPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={interiorData.upgrade}
                    onChange={(e) => handleChange('upgrade', e.target.checked)}
                  />
                  <label className="form-check-label">Upgrade Package</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={interiorData.basePackage}
                    onChange={(e) => handleChange('basePackage', e.target.checked)}
                  />
                  <label className="form-check-label">Base Package</label>
                </div>
              </div>
            </div>
          </>
        );

      case 'kitchenAppliance':
      case 'laundryAppliance':
        const applianceData = formData as Appliance;
        return (
          <>
            <h6>Appliance Details</h6>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Type *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={applianceData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={applianceData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={applianceData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                  />
                </div>
              </div> */}
            </div>
          </>
        );

      case 'additional':
        const additionalData = formData as any;
        return (
          <>
            <h6>Additional Option Details</h6>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={additionalData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
            </div>
          </>
        );

      case 'lotPremium':
        const lotPremiumData = formData as LotPremium;
        return (
          <>
            <h6>Lot Premium Details</h6>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Filing *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lotPremiumData.filing || 0}
                    onChange={(e) => handleChange('filing', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Lot *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lotPremiumData.lot || 0}
                    onChange={(e) => handleChange('lot', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Premium *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={lotPremiumData.premium || 0}
                    onChange={(e) => handleChange('premium', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Width (ft) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lotPremiumData.width || 0}
                    onChange={(e) => handleChange('width', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Length (ft) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lotPremiumData.length || 0}
                    onChange={(e) => handleChange('length', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Lot Sq Ft *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lotPremiumData.lotSqft || 0}
                    onChange={(e) => handleChange('lotSqft', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lotPremiumData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Parcel Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lotPremiumData.parcelNumber}
                    onChange={(e) => handleChange('parcelNumber', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderBaseFields()}
      {renderTypeSpecificFields()}
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update' : 'Add'} Option
        </button>
      </div>
    </form>
  );
}

export default PlanOptionManager;