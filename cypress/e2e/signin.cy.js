describe('Sign In', () => {
    it('successfully signs in a user', () => {
      cy.visit('http://localhost:3000/signin'); // Visit the sign-in page
  
      // Fill out the sign-in form
      cy.get('input[name="email"]').type('johndoe@example.com');
      cy.get('input[name="password"]').type('strongpassword');
  
      // Intercept the network request upon successful sign-in
      cy.intercept('POST', 'http://localhost:5000/signin').as('signInRequest');
  
      // Submit the sign-in form
      cy.get('button[role="Submit button"]').click();
  
      // Wait for the sign-in request to complete
      cy.wait('@signInRequest').its('response.statusCode').should('eq', 200);
  
      // Assert redirection to the dashboard
      cy.url().should('include', '/dashboard');
    });
  });
  