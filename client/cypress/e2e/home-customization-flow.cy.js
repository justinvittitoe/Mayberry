describe('Home Customization Flow', () => {
  beforeEach(() => {
    cy.mockFloorPlans()
    cy.mockLotPremiums()
  })

  describe('Unauthenticated User Flow', () => {
    it('should display floor plans and allow browsing without login', () => {
      cy.visit('/')
      cy.get('[data-cy=navbar]').should('be.visible')
      cy.get('[data-cy=floor-plan-card]').should('have.length.at.least', 1)
      
      // Should show floor plan details
      cy.get('[data-cy=floor-plan-card]').first().within(() => {
        cy.contains('The Aspen')
        cy.contains('3 bed')
        cy.contains('2 bath') 
        cy.contains('1,620 sq ft')
        cy.contains('$399,000')
      })
    })

    it('should redirect to login when trying to customize without auth', () => {
      cy.visit('/')
      cy.get('[data-cy=customize-button]').first().click()
      
      // Should redirect to login page
      cy.url().should('include', '/login')
      cy.contains('Please log in to start customizing your home')
    })
  })

  describe('Authenticated User Flow', () => {
    beforeEach(() => {
      cy.login('testuser', 'password123')
      cy.visit('/')
    })

    it('should navigate to customization wizard after login', () => {
      cy.get('[data-cy=customize-button]').first().click()
      
      // Should be on customization page
      cy.url().should('include', '/customize')
      cy.get('[data-cy=customization-wizard]').should('be.visible')
      cy.get('[data-cy=step-indicator]').should('have.length', 7)
    })

    it('should complete full customization wizard flow', () => {
      // Start customization
      cy.get('[data-cy=customize-button]').first().click()
      
      // Step 1: Exterior/Elevation
      cy.get('[data-cy=step-content-1]').should('be.visible')
      cy.contains('Choose Your Exterior Style')
      cy.selectOption('elevation', 'Farmhouse')
      cy.get('[data-cy=next-button]').click()
      
      // Step 2: Interior
      cy.get('[data-cy=step-content-2]').should('be.visible')
      cy.contains('Choose Your Interior Package')
      cy.selectOption('interior', 'Casual')
      cy.get('[data-cy=next-button]').click()
      
      // Step 3: Structural
      cy.get('[data-cy=step-content-3]').should('be.visible')
      cy.contains('Add Structural Features')
      cy.get('[data-cy=next-button]').click()
      
      // Step 4: Additional Features
      cy.get('[data-cy=step-content-4]').should('be.visible')
      cy.contains('Additional Amenities')
      cy.get('[data-cy=next-button]').click()
      
      // Step 5: Appliances
      cy.get('[data-cy=step-content-5]').should('be.visible')
      cy.contains('Kitchen & Laundry')
      cy.get('[data-cy=next-button]').click()
      
      // Step 6: Lot Selection
      cy.get('[data-cy=step-content-6]').should('be.visible')
      cy.contains('Choose Your Lot')
      cy.selectOption('lot', 'Lot 101')
      cy.get('[data-cy=next-button]').click()
      
      // Step 7: Review & Save
      cy.get('[data-cy=step-content-7]').should('be.visible')
      cy.contains('Review & Save')
      cy.verifyTotalPrice('$419,000') // Base + Interior + Lot
      
      // Complete customization
      cy.completeCustomization('My Test Home')
      
      // Should redirect to saved homes or success page
      cy.url().should('include', '/saved-homes')
      cy.contains('My Test Home')
    })

    it('should save progress during customization', () => {
      cy.get('[data-cy=customize-button]').first().click()
      
      // Make some selections
      cy.selectOption('elevation', 'Farmhouse')
      cy.get('[data-cy=next-button]').click()
      cy.selectOption('interior', 'Casual')
      
      // Save progress
      cy.saveProgress()
      cy.contains('Progress saved')
    })

    it('should allow navigation between steps', () => {
      cy.get('[data-cy=customize-button]').first().click()
      
      // Navigate forward
      cy.get('[data-cy=next-button]').click()
      cy.get('[data-cy=step-content-2]').should('be.visible')
      
      // Navigate backward
      cy.get('[data-cy=back-button]').click()
      cy.get('[data-cy=step-content-1]').should('be.visible')
      
      // Navigate using step indicators
      cy.navigateToStep(3)
      cy.get('[data-cy=step-content-3]').should('be.visible')
    })

    it('should update pricing in real-time', () => {
      cy.get('[data-cy=customize-button]').first().click()
      
      // Initial price (base + default selections)
      cy.verifyTotalPrice('$414,000')
      
      // Select premium interior
      cy.get('[data-cy=next-button]').click()
      cy.selectOption('interior', 'Premium')
      
      // Price should update
      cy.verifyTotalPrice('$426,000')
    })
  })

  describe('Error Handling', () => {
    it('should display error state when API fails', () => {
      cy.intercept('POST', '**/graphql', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('failedRequest')

      cy.visit('/')
      cy.wait('@failedRequest')
      
      cy.get('[data-cy=error-state]').should('be.visible')
      cy.contains('Something went wrong')
      cy.get('[data-cy=retry-button]').should('be.visible')
    })

    it('should handle network timeouts gracefully', () => {
      cy.intercept('POST', '**/graphql', {
        delay: 15000 // Longer than timeout
      }).as('timeoutRequest')

      cy.visit('/')
      
      cy.get('[data-cy=loading-spinner]').should('be.visible')
      // Should eventually show error or timeout message
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667) // iPhone SE
      cy.login()
      cy.visit('/')
      
      cy.get('[data-cy=navbar]').should('be.visible')
      cy.get('[data-cy=floor-plan-card]').should('be.visible')
      
      // Mobile menu should work
      cy.get('[data-cy=mobile-menu-toggle]').click()
      cy.get('[data-cy=mobile-menu]').should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024) // iPad
      cy.login()
      cy.visit('/')
      
      cy.get('[data-cy=floor-plan-card]').should('be.visible')
      // Grid should adapt to tablet layout
    })
  })

  describe('Accessibility', () => {
    it('should be navigable with keyboard', () => {
      cy.visit('/')
      
      // Tab through main navigation
      cy.get('body').tab()
      cy.focused().should('have.attr', 'role', 'button')
      
      // Should be able to reach all interactive elements
    })

    it('should have proper ARIA attributes', () => {
      cy.login()
      cy.visit('/customize/plan1')
      
      cy.get('[data-cy=customization-wizard]').should('have.attr', 'role', 'main')
      cy.get('[data-cy=step-indicator]').should('have.attr', 'role', 'tablist')
      cy.get('[data-cy=step-content]').should('have.attr', 'role', 'tabpanel')
    })
  })
})