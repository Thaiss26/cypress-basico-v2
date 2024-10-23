
it.only('Testa a página da política de privacidade de forma independent', () => {
  cy.visit('./src/privacy.html') 

  cy.contains('Talking About Testing').should('be.visible')
})