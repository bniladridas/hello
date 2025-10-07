describe('Hello Blog App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the main title', () => {
    cy.contains('Hello').should('be.visible')
  })

  it('displays the footer with LinkedIn link', () => {
    cy.contains('Follow us on:').should('be.visible')
    cy.contains('LinkedIn').should('have.attr', 'href', 'https://www.linkedin.com/in/bniladridas/')
  })
})