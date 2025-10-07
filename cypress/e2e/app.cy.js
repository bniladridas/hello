describe('Hello Blog App', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for app to load
    cy.contains('Hello').should('be.visible')
  })

  it('displays the main title', () => {
    // Already checked in beforeEach
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

    // Wait for drawer to open
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')

    // Click Privacy Policy in drawer
    cy.get('.fixed.top-0.left-0 a').contains('Privacy Policy').click()

    // Close drawer
    cy.get('[aria-label="Close menu"]').click()

    // Check that Privacy Policy content is visible (confirms navigation worked)
    cy.contains('We are committed to protecting your privacy').should('be.visible')
  })

  it('navigates to Terms of Service page', () => {
    // Open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Wait for drawer to open
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')

    // Click Terms of Service in drawer
    cy.get('.fixed.top-0.left-0 a').contains('Terms of Service').click()

    // Close drawer
    cy.get('[aria-label="Close menu"]').click()

    // Check that Terms of Service content is visible (confirms navigation worked)
    cy.contains('Welcome to our blog').should('be.visible')
  })

  it('navigates back to home from pages', () => {
    // Go to Privacy Policy
    cy.visit('/privacy')

    // Verify we're on privacy page
    cy.contains('We are committed to protecting your privacy').should('be.visible')

    // Open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Wait for drawer to open
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')

    // Click Home in drawer
    cy.get('.fixed.top-0.left-0 a').contains('Home').click()

    // Close drawer
    cy.get('[aria-label="Close menu"]').click()

    // Check we're back to blog view
    cy.contains('Hello').should('be.visible')
  })
})