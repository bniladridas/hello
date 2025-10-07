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
    // Wait for app to be ready (no loading state)
    cy.get('body').should('not.contain', 'Loading posts...')

    // Open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Wait for drawer to open
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')

    // Click Privacy Policy in drawer
    cy.get('.fixed.top-0.left-0').contains('Privacy Policy').click()

    // Check that we're no longer on the blog view (post form should not be visible)
    cy.get('input[placeholder="Post title"]').should('not.exist')

    // Check that Privacy Policy title is visible
    cy.get('h1').contains('Privacy Policy').should('be.visible')
  })

  it('navigates to Terms of Service page', () => {
    // Wait for app to be ready (no loading state)
    cy.get('body').should('not.contain', 'Loading posts...')

    // Open drawer
    cy.get('[aria-label="Open menu"]').click()

    // Wait for drawer to open
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')

    // Click Terms of Service in drawer
    cy.get('.fixed.top-0.left-0').contains('Terms of Service').click()

    // Check that we're no longer on the blog view (post form should not be visible)
    cy.get('input[placeholder="Post title"]').should('not.exist')

    // Check that Terms of Service title is visible
    cy.get('h1').contains('Terms of Service').should('be.visible')
  })

  it('navigates back to home from pages', () => {
    // Wait for app to be ready (no loading state)
    cy.get('body').should('not.contain', 'Loading posts...')

    // Go to Privacy Policy
    cy.get('[aria-label="Open menu"]').click()
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')
    cy.get('.fixed.top-0.left-0').contains('Privacy Policy').click()

    // Verify we're on privacy page (post form not visible, privacy title visible)
    cy.get('input[placeholder="Post title"]').should('not.exist')
    cy.get('h1').contains('Privacy Policy').should('be.visible')

    // Go back to home
    cy.get('[aria-label="Open menu"]').click()
    cy.get('.fixed.top-0.left-0').should('not.have.class', '-translate-x-full')
    cy.get('.fixed.top-0.left-0').contains('Home').click()

    // Check we're back to blog view
    cy.contains('Hello').should('be.visible')
    cy.get('input[placeholder="Post title"]').should('be.visible')
  })
})