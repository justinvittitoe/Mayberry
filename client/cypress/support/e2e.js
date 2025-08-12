// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR logs
const origLog = Cypress.log
Cypress.log = function (opts, ...other) {
  if (opts.displayName === 'xhr' || opts.displayName === 'fetch') {
    return
  }
  return origLog(opts, ...other)
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded') ||
      err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  return true
})

beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage()
  
  // Set up common intercepts
  cy.intercept('POST', '**/graphql', (req) => {
    // You can add GraphQL request/response mocking here if needed
  }).as('graphqlRequest')
})