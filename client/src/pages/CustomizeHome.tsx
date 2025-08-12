import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Alert } from 'react-bootstrap';
import CustomizationWizard from '../components/CustomizationWizard';
import { GET_PLAN, GET_OPTIONS, GET_INTERIOR_PACKAGES, GET_LOT_PREMIUMS } from '../utils/queries';

const CustomizeHome = () => {
    const { planId } = useParams<{ planId: string }>();

    // Queries
    const { loading: planLoading, data: planData } = useQuery(GET_PLAN, {
        variables: { id: planId },
        skip: !planId
    });
    const { data: optionsData } = useQuery(GET_OPTIONS);
    const { data: interiorData } = useQuery(GET_INTERIOR_PACKAGES);
    const { data: lotData } = useQuery(GET_LOT_PREMIUMS);

    const plan = planData?.plan;
    const options = optionsData?.options || [];
    const interiorPackages = interiorData?.interiorPackages || [];
    const lotPremiums = lotData?.lotPremiums || [];

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
        <CustomizationWizard
            plan={plan}
            options={options}
            interiorPackages={interiorPackages}
            lotPremiums={lotPremiums}
        />
    );
};

export default CustomizeHome; 