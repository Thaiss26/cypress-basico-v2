describe('Central de Atendimento ao Cliente TAT', () => {
  const THREE_SECONDS_IN_MS = 3000
 
  beforeEach(function() { 
    cy.visit('./src/index.html') 
  })
    it('Verifica o título da aplicação', () => {
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste,Teste, Teste, Teste'
    
    cy.clock()
   
    cy.get('#firstName').type('Thais')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('thais@exemplo.com')
    cy.get('#open-text-area').type(longText)
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
    
    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.success').should('not.be.visible')
  })


  it('Exibe mensagem de um erro ao submeter com email com a formatação inválida', () => {

    cy.clock()

    cy.get('#firstName').type('Thais')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('thais@exemplo,com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  }) 

  it('Campo de telefone continua vazio quando preenchido com valor não-númerico', () => {
    cy.get('#phone')
    .type('abcdefhij')
    .should('have.value', "")
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do erro do formulário', () => {

    cy.clock()

    cy.get('#firstName').type('Thais')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('thais@exemplo.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get(".error").should('not.be.visible')
  })
  
  Cypress._.times(5,() => {
    it('Preenche e limpa os campos nome, sobrenome, email e telefone', () => {
      cy.get('#firstName')
        .type('Thais')
        .should('have.value', 'Thais')
        .clear()
        .should('have.value', '')
      cy.get('#lastName')
        .type('Silva')
        .should('have.value', 'Silva')
        .clear()
        .should('have.value', '')
      cy.get('#email')
        .type('thais@exemplo.com')
        .should('have.value', 'thais@exemplo.com')
        .clear()
        .should('have.value', '')
      cy.get('#phone')
        .type('993224107')
        .should('have.value', '993224107')
        .clear()
        .should('have.value', '')
    })
  })
  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {

    cy.clock()

    cy.contains('button', 'Enviar').click()
    
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('Envia o formulário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
  })

  it('Seleciona um produto (Youtube) por sor seu texto', () => {
    cy.get('#product').select('youtube')
      .should('have.value', 'youtube')
  })

  it('Seleciona um produto (Mentoria) por seu valor', () => {
    cy.get('#product').select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('Seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1)
      .should('have.value', 'blog')
  })

  it('Marca o tipo de atendimento "Feedback"', () => {
    cy.get('[type="radio"]').check('feedback')
      .should('have.value', 'feedback')
  })

  it('Marca cada tipo de atendimento', () => {
    cy.get('[type="radio"]')
    .should('have.length', 3)
    .each(function($radio) {
      cy.wrap($radio).check()
      
      cy.wrap($radio).should('be.checked')

    })
  })

  it('Marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]').check()
  });

  it('Seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="File"]')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json')
    .should(function($input) {
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })
   
  it('Seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="File"]')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
    .should(function($input) {
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('Seleciona um arquivo utilizando uma fixture para a qual doi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
    .selectFile('@sampleFile')
    .should(function($input) {
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
    .invoke('removeAttr', 'target')
    .click()

    cy.contains('Talking About Testing').should('be.visible')
  })

  it('Exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('Preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area')
    .invoke('val', longText)
    .should('have.value', longText)
  })

  it('Faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
    .then((response) => {
      expect(response.status).to.equal(200)
      expect(response.statusText).to.equal('OK')
      expect(response.body).to.include('CAC TAT')
    })
  })

  it('Encontre o gato', () => {
    cy.get('#cat')
    .invoke('show')
    .should('be.visible')
  })
})


