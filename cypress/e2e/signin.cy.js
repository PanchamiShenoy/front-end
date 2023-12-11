
describe('Sign In', () => {
    it('successfully signs in a user', () => {
      cy.visit('http://localhost:3000/signin'); 
     
      cy.get('input[name="email"]').type('dd@gmail.com');
      cy.get('input[name="password"]').type('12345');
  
      
      cy.intercept('POST', 'http://167.71.176.188:5000/signin').as('signInRequest');
  
      
      cy.get('button[role="Submit button"]').click();
  

      cy.wait('@signInRequest').its('response.statusCode').should('eq', 200);
      cy.wait(2000); 

    });
  });
  