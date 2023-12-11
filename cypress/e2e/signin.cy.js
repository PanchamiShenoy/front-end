
describe('Sign In', () => {
    it('successfully signs in a user', () => {
      cy.visit('http://localhost:3000/signin'); 
     
      cy.get('input[name="email"]').type('johndoe@example.com');
      cy.get('input[name="password"]').type('strongpassword');
  
      
      cy.intercept('POST', 'http://localhost:5000/signin').as('signInRequest');
  
      
      cy.get('button[role="Submit button"]').click();
  

      cy.wait('@signInRequest').its('response.statusCode').should('eq', 200);
      cy.wait(2000); 

    });
  });
  