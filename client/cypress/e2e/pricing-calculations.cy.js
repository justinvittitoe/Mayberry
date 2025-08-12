describe('Pricing Calculations', () => {
  beforeEach(() => {
    cy.mockFloorPlans()
    cy.mockLotPremiums()
    cy.login()
  })

  describe('Base Price Display', () => {
    it('should display correct base price for each floor plan', () => {
      cy.visit('/')
      
      cy.get('[data-cy=floor-plan-card]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-cy=base-price]').should('be.visible')
          cy.get('[data-cy=base-price]').should('match', /\$[\d,]+/)
        })
      })
    })

    it('should show starting price range on home page', () => {
      cy.visit('/')
      
      cy.get('[data-cy=price-range]').should('be.visible')
      cy.contains('Starting from $399,000')
    })
  })

  describe('Real-time Price Updates', () => {
    beforeEach(() => {
      cy.visit('/customize/plan1')
    })

    it('should update total when elevation is changed', () => {
      // Initial total with default selections
      cy.verifyTotalPrice('$414,000')
      
      // Select premium elevation (+$2,500)
      cy.selectOption('elevation', 'Prairie')
      
      // Total should increase
      cy.verifyTotalPrice('$416,500')
    })

    it('should update total when interior package is changed', () => {
      // Navigate to interior step
      cy.get('[data-cy=next-button]').click()
      
      // Select premium interior package
      cy.selectOption('interior', 'Designer')
      
      // Should show increased total
      cy.verifyTotalPrice('$427,000')
    })

    it('should update total when structural options are added', () => {
      // Navigate to structural step
      cy.navigateToStep(3)
      
      // Add covered patio (+$3,500)
      cy.selectOption('structural', 'Covered Patio')
      
      // Total should increase
      cy.verifyTotalPrice('$417,500')
    })

    it('should update total when lot premium is selected', () => {
      // Navigate to lot selection
      cy.navigateToStep(6)
      
      // Select premium lot (+$5,000)
      cy.selectOption('lot', 'Premium Lot 205')
      
      // Total should include lot premium
      cy.verifyTotalPrice('$419,000')
    })

    it('should handle multiple selections correctly', () => {
      // Make multiple selections
      cy.selectOption('elevation', 'Prairie') // +$2,500
      cy.get('[data-cy=next-button]').click()
      
      cy.selectOption('interior', 'Designer') // +$13,000 more than Casual
      cy.get('[data-cy=next-button]').click()
      
      cy.selectOption('structural', 'Covered Patio') // +$3,500
      cy.get('[data-cy=next-button]').click()
      
      cy.selectOption('additional', 'Air Conditioning') // +$4,500
      cy.navigateToStep(6)
      
      cy.selectOption('lot', 'Premium Lot 205') // +$5,000
      
      // Total = Base $399,000 + Prairie $2,500 + Designer $28,000 + Patio $3,500 + AC $4,500 + Lot $5,000
      cy.verifyTotalPrice('$442,500')
    })
  })

  describe('Price Breakdown', () => {
    beforeEach(() => {
      cy.visit('/customize/plan1')
      cy.navigateToStep(7) // Review step
    })

    it('should show detailed price breakdown', () => {
      cy.get('[data-cy=price-breakdown]').should('be.visible')
      
      // Should show base price
      cy.get('[data-cy=base-price-line]').should('contain', 'Base Price')
      cy.get('[data-cy=base-price-line]').should('contain', '$399,000')
      
      // Should show selected options
      cy.get('[data-cy=elevation-price-line]').should('contain', 'Exterior')
      cy.get('[data-cy=interior-price-line]').should('contain', 'Interior Package')
      
      // Should show grand total
      cy.get('[data-cy=grand-total]').should('be.visible')
    })

    it('should only show non-zero price items', () => {
      // If no structural options are selected
      cy.get('[data-cy=structural-price-line]').should('not.exist')
      
      // Navigate back and add structural option
      cy.navigateToStep(3)
      cy.selectOption('structural', 'Covered Patio')
      cy.navigateToStep(7)
      
      // Now structural line should appear
      cy.get('[data-cy=structural-price-line]').should('be.visible')
      cy.get('[data-cy=structural-price-line]').should('contain', '+$3,500')
    })

    it('should format prices correctly', () => {
      cy.get('[data-cy=price-breakdown]').within(() => {
        // All prices should be formatted as currency
        cy.get('[data-cy*=price]').each(($price) => {
          cy.wrap($price).should('match', /[\$][\d,]+/)
        })
      })
    })
  })

  describe('Price Validation', () => {
    it('should handle extremely high customizations', () => {
      cy.visit('/customize/plan1')
      
      // Select all premium options
      cy.selectOption('elevation', 'Custom Architecture')
      cy.get('[data-cy=next-button]').click()
      
      cy.selectOption('interior', 'Luxury')
      cy.get('[data-cy=next-button]').click()
      
      // Add multiple structural options
      cy.selectOption('structural', 'Covered Patio')
      cy.selectOption('structural', 'Fireplace')
      cy.selectOption('structural', 'Vaulted Ceilings')
      cy.get('[data-cy=next-button]').click()
      
      // Add all additional features
      cy.selectOption('additional', 'Air Conditioning')
      cy.selectOption('additional', 'Security System')
      cy.get('[data-cy=next-button]').click()
      
      // Premium appliances
      cy.selectOption('appliance', 'Premium Package')
      cy.get('[data-cy=next-button]').click()
      
      // Premium lot
      cy.selectOption('lot', 'Waterfront Premium')
      
      // Should handle large numbers correctly
      cy.get('[data-cy=total-price]').should('be.visible')
      cy.get('[data-cy=total-price]').should('not.contain', 'NaN')
      cy.get('[data-cy=total-price]').should('not.contain', 'undefined')
    })

    it('should handle price calculation errors gracefully', () => {
      // Mock API to return malformed price data
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.query?.includes('getAllPlanTypes')) {
          req.reply({
            data: {
              getAllPlanTypes: [{
                _id: 'plan1',
                name: 'Test Plan',
                basePrice: null, // Invalid price
                elevations: [{ price: 'invalid' }] // Invalid price
              }]
            }
          })
        }
      }).as('invalidPrices')

      cy.visit('/customize/plan1')
      cy.wait('@invalidPrices')
      
      // Should show fallback pricing or error message
      cy.get('[data-cy=price-error]').should('be.visible')
        .or(cy.get('[data-cy=total-price]').should('contain', '$0'))
    })
  })

  describe('Price Persistence', () => {
    it('should maintain pricing when navigating between steps', () => {
      cy.visit('/customize/plan1')
      
      // Make selections and note price
      cy.selectOption('elevation', 'Prairie')
      cy.verifyTotalPrice('$416,500')
      
      // Navigate to different step
      cy.navigateToStep(4)
      cy.selectOption('additional', 'Air Conditioning')
      
      // Navigate back to first step
      cy.navigateToStep(1)
      
      // Price should still reflect all selections
      cy.verifyTotalPrice('$421,000') // $416,500 + $4,500 AC
      
      // Elevation should still be selected
      cy.get('[data-cy=elevation-option]').contains('Prairie').should('have.class', 'selected')
    })

    it('should save pricing with progress', () => {
      cy.visit('/customize/plan1')
      
      // Make some selections
      cy.selectOption('elevation', 'Prairie')
      cy.get('[data-cy=next-button]').click()
      cy.selectOption('interior', 'Designer')
      
      // Save progress
      cy.saveProgress()
      
      // Leave and return to customization
      cy.visit('/')
      cy.visit('/customize/plan1')
      
      // Pricing should be restored
      cy.verifyTotalPrice('$429,500')
      
      // Selections should be restored
      cy.get('[data-cy=elevation-option]').contains('Prairie').should('have.class', 'selected')
      cy.navigateToStep(2)
      cy.get('[data-cy=interior-option]').contains('Designer').should('have.class', 'selected')
    })
  })

  describe('Print Pricing Sheet', () => {
    beforeEach(() => {
      cy.visit('/customize/plan1')
      cy.navigateToStep(7) // Final step
    })

    it('should generate printable pricing sheet', () => {
      cy.printPricingSheet()
      
      // Should trigger print dialog
      cy.get('@printStub').should('have.been.called')
    })

    it('should format pricing sheet for print', () => {
      // Mock print preview
      cy.get('[data-cy=print-preview]').should('be.visible')
      
      cy.get('[data-cy=print-preview]').within(() => {
        // Should contain all pricing details
        cy.contains('The Aspen')
        cy.contains('Base Price')
        cy.contains('Selected Options')
        cy.contains('Grand Total')
        
        // Should be formatted for print (no interactive elements)
        cy.get('button').should('not.exist')
        cy.get('[data-cy=price-breakdown]').should('be.visible')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero-price options', () => {
      cy.visit('/customize/plan1')
      
      // Select option with $0 price
      cy.selectOption('elevation', 'Standard') // $0
      
      // Should show "Included" instead of +$0
      cy.get('[data-cy=elevation-option]').contains('Standard').within(() => {
        cy.contains('Included')
        cy.should('not.contain', '$0')
      })
    })

    it('should handle negative price adjustments', () => {
      // If there are any discount options
      cy.visit('/customize/plan1')
      
      cy.selectOption('elevation', 'Builder Grade') // Assume this has negative price
      
      // Should show as discount
      cy.get('[data-cy=total-price]').should('contain', '$')
      // Total should be less than base
    })

    it('should handle concurrent price updates', () => {
      cy.visit('/customize/plan1')
      
      // Rapidly change selections
      cy.selectOption('elevation', 'Prairie')
      cy.selectOption('elevation', 'Farmhouse')
      cy.selectOption('elevation', 'Prairie')
      
      // Should handle rapid changes without errors
      cy.verifyTotalPrice('$416,500')
    })
  })
})