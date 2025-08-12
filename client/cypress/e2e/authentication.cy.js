describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  describe('Login', () => {
    it('should successfully log in with valid credentials', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.query?.includes('login')) {
          req.reply({
            data: {
              login: {
                token: 'valid-jwt-token',
                user: {
                  _id: 'user123',
                  username: 'testuser',
                  email: 'test@example.com',
                  role: 'user'
                }
              }
            }
          })
        }
      }).as('loginMutation')

      cy.visit('/login')
      
      // Login form should be visible
      cy.get('[data-cy=login-form]').should('be.visible')
      cy.get('[data-cy=username-input]').should('be.visible')
      cy.get('[data-cy=password-input]').should('be.visible')
      cy.get('[data-cy=login-button]').should('be.visible')
      
      // Fill in credentials
      cy.get('[data-cy=username-input]').type('testuser')
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=login-button]').click()
      
      cy.wait('@loginMutation')
      
      // Should redirect to home page
      cy.url().should('not.include', '/login')
      cy.get('[data-cy=user-menu]').should('be.visible')
      cy.contains('Welcome, testuser')
    })

    it('should display error with invalid credentials', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.query?.includes('login')) {
          req.reply({
            errors: [{
              message: 'Invalid username or password'
            }]
          })
        }
      }).as('failedLogin')

      cy.visit('/login')
      cy.get('[data-cy=username-input]').type('wronguser')
      cy.get('[data-cy=password-input]').type('wrongpass')
      cy.get('[data-cy=login-button]').click()
      
      cy.wait('@failedLogin')
      
      // Should show error message
      cy.get('[data-cy=error-message]').should('be.visible')
      cy.contains('Invalid username or password')
      
      // Should remain on login page
      cy.url().should('include', '/login')
    })

    it('should validate required fields', () => {
      cy.visit('/login')
      
      // Try to submit empty form
      cy.get('[data-cy=login-button]').click()
      
      // Should show validation errors
      cy.get('[data-cy=username-error]').should('contain', 'Username is required')
      cy.get('[data-cy=password-error]').should('contain', 'Password is required')
    })
  })

  describe('Signup', () => {
    it('should successfully create a new account', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.query?.includes('createUser')) {
          req.reply({
            data: {
              createUser: {
                token: 'new-user-token',
                user: {
                  _id: 'newuser123',
                  username: 'newuser',
                  email: 'newuser@example.com',
                  role: 'user'
                }
              }
            }
          })
        }
      }).as('signupMutation')

      cy.visit('/signup')
      
      // Signup form should be visible
      cy.get('[data-cy=signup-form]').should('be.visible')
      
      // Fill in registration details
      cy.get('[data-cy=username-input]').type('newuser')
      cy.get('[data-cy=email-input]').type('newuser@example.com')
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=confirm-password-input]').type('password123')
      cy.get('[data-cy=signup-button]').click()
      
      cy.wait('@signupMutation')
      
      // Should redirect to home page
      cy.url().should('not.include', '/signup')
      cy.contains('Welcome, newuser')
    })

    it('should validate email format', () => {
      cy.visit('/signup')
      
      cy.get('[data-cy=email-input]').type('invalid-email')
      cy.get('[data-cy=signup-button]').click()
      
      cy.get('[data-cy=email-error]').should('contain', 'Please enter a valid email')
    })

    it('should validate password confirmation', () => {
      cy.visit('/signup')
      
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=confirm-password-input]').type('differentpassword')
      cy.get('[data-cy=signup-button]').click()
      
      cy.get('[data-cy=password-error]').should('contain', 'Passwords do not match')
    })

    it('should handle duplicate username error', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.query?.includes('createUser')) {
          req.reply({
            errors: [{
              message: 'Username already exists'
            }]
          })
        }
      }).as('duplicateUser')

      cy.visit('/signup')
      cy.get('[data-cy=username-input]').type('existinguser')
      cy.get('[data-cy=email-input]').type('test@example.com')
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=confirm-password-input]').type('password123')
      cy.get('[data-cy=signup-button]').click()
      
      cy.wait('@duplicateUser')
      
      cy.get('[data-cy=error-message]').should('contain', 'Username already exists')
    })
  })

  describe('Logout', () => {
    it('should successfully log out user', () => {
      cy.login()
      cy.visit('/')
      
      // User should be logged in
      cy.get('[data-cy=user-menu]').should('be.visible')
      
      // Click logout
      cy.get('[data-cy=user-menu]').click()
      cy.get('[data-cy=logout-button]').click()
      
      // Should be logged out
      cy.get('[data-cy=login-link]').should('be.visible')
      cy.get('[data-cy=user-menu]').should('not.exist')
      
      // Local storage should be cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })
  })

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      // Try to access protected route
      cy.visit('/saved-homes')
      
      // Should redirect to login
      cy.url().should('include', '/login')
      cy.contains('Please log in to access this page')
    })

    it('should allow authenticated users to access protected routes', () => {
      cy.login()
      cy.visit('/saved-homes')
      
      // Should not redirect
      cy.url().should('include', '/saved-homes')
      cy.get('[data-cy=saved-homes-page]').should('be.visible')
    })
  })

  describe('Token Persistence', () => {
    it('should persist login across page refreshes', () => {
      cy.login()
      cy.visit('/')
      
      // User should be logged in
      cy.get('[data-cy=user-menu]').should('be.visible')
      
      // Refresh page
      cy.reload()
      
      // Should still be logged in
      cy.get('[data-cy=user-menu]').should('be.visible')
    })

    it('should handle expired tokens gracefully', () => {
      // Set expired token
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired-token')
      })
      
      cy.intercept('POST', '**/graphql', {
        statusCode: 401,
        body: { errors: [{ message: 'Token expired' }] }
      }).as('expiredToken')
      
      cy.visit('/')
      cy.wait('@expiredToken')
      
      // Should redirect to login
      cy.url().should('include', '/login')
      cy.contains('Your session has expired')
    })
  })

  describe('Form UX', () => {
    it('should show loading state during login', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        // Add delay to see loading state
        req.reply((res) => {
          setTimeout(() => {
            res.send({
              data: {
                login: {
                  token: 'token',
                  user: { _id: 'user', username: 'test' }
                }
              }
            })
          }, 1000)
        })
      }).as('slowLogin')

      cy.visit('/login')
      cy.get('[data-cy=username-input]').type('testuser')
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=login-button]').click()
      
      // Should show loading state
      cy.get('[data-cy=loading-spinner]').should('be.visible')
      cy.get('[data-cy=login-button]').should('be.disabled')
      
      cy.wait('@slowLogin')
    })

    it('should have proper accessibility attributes', () => {
      cy.visit('/login')
      
      cy.get('[data-cy=login-form]').should('have.attr', 'role', 'form')
      cy.get('[data-cy=username-input]').should('have.attr', 'aria-label', 'Username')
      cy.get('[data-cy=password-input]').should('have.attr', 'type', 'password')
      
      // Error messages should have proper ARIA attributes
      cy.get('[data-cy=login-button]').click()
      cy.get('[data-cy=username-error]').should('have.attr', 'role', 'alert')
    })

    it('should allow navigation between login and signup', () => {
      cy.visit('/login')
      
      cy.get('[data-cy=signup-link]').click()
      cy.url().should('include', '/signup')
      cy.get('[data-cy=signup-form]').should('be.visible')
      
      cy.get('[data-cy=login-link]').click()
      cy.url().should('include', '/login')
      cy.get('[data-cy=login-form]').should('be.visible')
    })
  })
})