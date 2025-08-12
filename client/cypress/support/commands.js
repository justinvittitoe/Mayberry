// Custom Cypress commands for the home builder application

/**
 * Login command with GraphQL mutation
 */
Cypress.Commands.add('login', (username = 'testuser', password = 'password123') => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.query?.includes('login')) {
      req.reply({
        data: {
          login: {
            token: 'mock-jwt-token',
            user: {
              _id: 'user1',
              username: username,
              email: `${username}@example.com`,
              role: 'user'
            }
          }
        }
      })
    }
  }).as('loginMutation')

  cy.visit('/login')
  cy.get('[data-cy=username-input]').type(username)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-button]').click()
  cy.wait('@loginMutation')
})

/**
 * Mock GraphQL responses for floor plans
 */
Cypress.Commands.add('mockFloorPlans', () => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.query?.includes('getAllPlanTypes')) {
      req.reply({
        data: {
          getAllPlanTypes: [
            {
              _id: 'plan1',
              name: 'The Aspen',
              bedrooms: 3,
              bathrooms: 2,
              squareFootage: 1620,
              garageType: '2-Car Garage',
              basePrice: 399000,
              description: 'Cozy ranch-style home',
              elevations: [
                {
                  _id: 'elev1',
                  name: 'Farmhouse',
                  price: 0,
                  classification: 'elevation'
                }
              ],
              interiors: [
                {
                  _id: 'int1',
                  name: 'Casual',
                  totalPrice: 15000
                }
              ],
              structural: [],
              additional: [],
              kitchenAppliance: [],
              laundryAppliance: []
            }
          ]
        }
      })
    }
  }).as('floorPlansQuery')
})

/**
 * Mock lot premiums
 */
Cypress.Commands.add('mockLotPremiums', () => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.query?.includes('getAllLotPremiums')) {
      req.reply({
        data: {
          getAllLotPremiums: [
            {
              _id: 'lot1',
              filing: 1,
              lot: 101,
              width: 60,
              length: 120,
              price: 5000
            }
          ]
        }
      })
    }
  }).as('lotPremiumsQuery')
})

/**
 * Navigate through customization wizard steps
 */
Cypress.Commands.add('navigateToStep', (stepNumber) => {
  cy.get(`[data-cy=step-indicator-${stepNumber}]`).click()
  cy.get(`[data-cy=step-content-${stepNumber}]`).should('be.visible')
})

/**
 * Select an option in the customization wizard
 */
Cypress.Commands.add('selectOption', (optionType, optionName) => {
  cy.get(`[data-cy=${optionType}-option]`).contains(optionName).click()
})

/**
 * Verify pricing calculation
 */
Cypress.Commands.add('verifyTotalPrice', (expectedPrice) => {
  cy.get('[data-cy=total-price]').should('contain', expectedPrice)
})

/**
 * Save customization progress
 */
Cypress.Commands.add('saveProgress', () => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.query?.includes('saveUserHomeProgress')) {
      req.reply({
        data: {
          saveUserHomeProgress: {
            _id: 'home1',
            planTypeId: 'plan1',
            totalPrice: 414000,
            isComplete: false
          }
        }
      })
    }
  }).as('saveProgressMutation')

  cy.get('[data-cy=save-progress]').click()
  cy.wait('@saveProgressMutation')
})

/**
 * Complete home customization
 */
Cypress.Commands.add('completeCustomization', (homeName = 'My Dream Home') => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.query?.includes('saveUserHome')) {
      req.reply({
        data: {
          saveUserHome: {
            _id: 'home1',
            planTypeId: 'plan1',
            planTypeName: 'The Aspen',
            totalPrice: 414000,
            isComplete: true
          }
        }
      })
    }
  }).as('saveHomeMutation')

  cy.get('[data-cy=home-name-input]').type(homeName)
  cy.get('[data-cy=complete-customization]').click()
  cy.wait('@saveHomeMutation')
})

/**
 * Print pricing sheet
 */
Cypress.Commands.add('printPricingSheet', () => {
  // Mock the print functionality
  cy.window().then((win) => {
    cy.stub(win, 'print').as('printStub')
  })
  
  cy.get('[data-cy=print-button]').click()
  cy.get('@printStub').should('have.been.called')
})

// TypeScript declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>
      mockFloorPlans(): Chainable<void>
      mockLotPremiums(): Chainable<void>
      navigateToStep(stepNumber: number): Chainable<void>
      selectOption(optionType: string, optionName: string): Chainable<void>
      verifyTotalPrice(expectedPrice: string): Chainable<void>
      saveProgress(): Chainable<void>
      completeCustomization(homeName?: string): Chainable<void>
      printPricingSheet(): Chainable<void>
    }
  }
}