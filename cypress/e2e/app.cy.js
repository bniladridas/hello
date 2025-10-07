describe('Hello Blog App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the main title', () => {
    cy.contains('Hello').should('be.visible')
  })

  it('toggles dark mode', () => {
    // Check initial state (light mode)
    cy.get('html').should('not.have.class', 'dark')

    // Click dark mode toggle
    cy.contains('Dark').click()

    // Check dark mode is enabled
    cy.get('html').should('have.class', 'dark')

    // Click to toggle back to light mode
    cy.contains('Light').click()

    // Check dark mode is disabled
    cy.get('html').should('not.have.class', 'dark')
  })

  it('opens and closes navigation drawer', () => {
    // Drawer should be closed initially
    cy.get('[aria-label="Open menu"]').should('be.visible')
    cy.get('.fixed.top-0.left-0').should('have.class', '-translate-x-full')

    // Click menu button to open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Drawer should be open
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')

    // Click overlay to close drawer
    cy.get('.fixed.inset-0.bg-black.bg-opacity-50').click()

    // Drawer should be closed
    cy.get('.fixed.top-0.left-0').should('have.class', '-translate-x-full')
  })

  it('navigates to Privacy Policy page', () => {
    // Open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Click Privacy Policy
    cy.contains('Privacy Policy').click()

    // Check that Privacy Policy content is displayed
    cy.contains('Privacy Policy').should('be.visible')
    cy.contains('Last updated').should('be.visible')
  })

  it('navigates to Terms of Service page', () => {
    // Open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Click Terms of Service
    cy.contains('Terms of Service').click()

    // Check that Terms of Service content is displayed
    cy.contains('Terms of Service').should('be.visible')
    cy.contains('Last updated').should('be.visible')
  })

  it('navigates back to home from pages', () => {
    // Go to Privacy Policy
    cy.get('[aria-label="Open menu"]').click()
    cy.contains('Privacy Policy').click()

    // Go back to home
    cy.get('[aria-label="Open menu"]').click()
    cy.contains('Home').click()

    // Check we're back to blog view
    cy.contains('Hello').should('be.visible')
    cy.get('input[placeholder="Post title"]').should('be.visible')
  })
})