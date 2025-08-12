import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { vi } from 'vitest';

// Mock data for testing
export const mockFloorPlan = {
  _id: '1',
  id: '1',
  name: 'The Aspen',
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1620,
  garageType: '2-Car Garage',
  basePrice: 399000,
  description: 'Cozy ranch-style home perfect for first-time buyers',
  elevations: [
    {
      _id: 'elev1',
      name: 'Farmhouse',
      price: 0,
      classification: 'elevation',
      description: 'Classic farmhouse style',
      img: 'farmhouse.jpg'
    },
    {
      _id: 'elev2',
      name: 'Prairie',
      price: 2500,
      classification: 'elevation',
      description: 'Prairie style exterior',
      img: 'prairie.jpg'
    }
  ],
  interiors: [
    {
      _id: 'int1',
      name: 'Casual',
      totalPrice: 15000,
      fixtures: [{ name: 'Standard fixtures', price: 1000 }],
      lvp: [{ name: 'Standard LVP flooring', price: 2000 }],
      carpet: [{ name: 'Standard carpet', price: 1500 }]
    }
  ],
  structural: [
    {
      _id: 'struct1',
      name: 'Covered Patio',
      price: 3500,
      classification: 'structural',
      description: 'Covered outdoor living space'
    }
  ],
  additional: [
    {
      _id: 'add1',
      name: 'Air-conditioning',
      price: 4500,
      classification: 'additional',
      description: 'Central air conditioning'
    }
  ],
  kitchenAppliance: [
    {
      _id: 'kitchen1',
      name: 'Appliance Package 0',
      price: 0,
      classification: 'kitchen-appliance',
      description: 'Basic appliance package'
    }
  ],
  laundryAppliance: [
    {
      _id: 'laundry1',
      name: 'Laundry Appliance A',
      price: 0,
      classification: 'laundry-appliance',
      description: 'Basic washer and dryer connections'
    }
  ]
};

export const mockLotPremium = {
  _id: 'lot1',
  filing: 1,
  lot: 101,
  width: 60,
  length: 120,
  price: 5000
};

export const mockUser = {
  _id: 'user1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  homeCount: 0,
  savedHomes: []
};

// Apollo Client test wrapper
interface AllTheProvidersProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  initialEntries?: string[];
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  mocks = [],
  initialEntries = ['/']
}) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MockedProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    mocks?: MockedResponse[];
    initialEntries?: string[];
  }
) => {
  const { mocks, initialEntries, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders mocks={mocks} initialEntries={initialEntries}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock AuthService
export const mockAuthService = {
  loggedIn: vi.fn(() => false),
  getProfile: vi.fn(() => null),
  getRole: vi.fn(() => null),
  getToken: vi.fn(() => null),
  login: vi.fn(),
  logout: vi.fn(),
  isTokenExpired: vi.fn(() => false),
};

// Mock react-router-dom hooks
export const mockNavigate = vi.fn();
export const mockUseParams = vi.fn(() => ({ planId: '1' }));

// Mock Apollo Client hooks
export const mockUseQuery = vi.fn();
export const mockUseMutation = vi.fn();

// Mock react-to-print
export const mockUseReactToPrint = vi.fn(() => vi.fn());

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const createMockMutation = (mutationName: string, result: any) => ({
  request: {
    query: expect.any(Object),
    variables: expect.any(Object),
  },
  result: { data: { [mutationName]: result } },
});

export const createMockQuery = (queryName: string, result: any) => ({
  request: {
    query: expect.any(Object),
    variables: expect.any(Object),
  },
  result: { data: { [queryName]: result } },
});

// Custom matchers
export const expectElementToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectElementToHaveClass = (element: HTMLElement | null, className: string) => {
  expect(element).toHaveClass(className);
};

export const expectElementToHaveTextContent = (element: HTMLElement | null, text: string) => {
  expect(element).toHaveTextContent(text);
};

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };