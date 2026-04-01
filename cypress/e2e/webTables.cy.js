/// <reference types="cypress" />

describe('DemoQA Web Tables', () => {
  const worker = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    age: '28',
    salary: '6000',
    department: 'QA',
  };

  const updatedWorker = {
    firstName: 'Updated',
    lastName: 'Worker',
    email: 'updated@test.com',
    age: '25',
    salary: '7000',
    department: 'Automation',
  };

  const fillWorkerForm = ({
    firstName,
    lastName,
    email,
    age,
    salary,
    department,
  }) => {
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('#userEmail').clear().type(email);
    cy.get('#age').clear().type(age);
    cy.get('#salary').clear().type(salary);
    cy.get('#department').clear().type(department);
  };

  beforeEach(() => {
    cy.visit('https://demoqa.com/webtables');
  });

  it('should check pagination', () => {
    cy.get('#addNewRecordButton').click();
    fillWorkerForm(worker);
    cy.get('#submit').click();

    cy.get('#addNewRecordButton').click();
    fillWorkerForm({
      ...worker,
      email: 'second@test.com',
    });
    cy.get('#submit').click();

    cy.get('select[aria-label="rows per page"]').select('5');

    cy.get('.-next').should('not.have.class', '-disabled').click();
    cy.get('.-pageJump input').should('have.value', '2');

    cy.get('.-previous').click();
    cy.get('.-pageJump input').should('have.value', '1');
  });

  it('should check rows count selection', () => {
    cy.get('select[aria-label="rows per page"]').select('5');
    cy.get('.rt-tbody .rt-tr-group:visible').should('have.length', 5);

    cy.get('select[aria-label="rows per page"]').select('10');
    cy.get('.rt-tbody .rt-tr-group:visible').its('length').should('be.lte', 10);
  });

  it('should add a new worker', () => {
    cy.get('#addNewRecordButton').click();

    fillWorkerForm(worker);

    cy.get('#submit').click();

    cy.contains(worker.firstName).should('exist');
    cy.contains(worker.lastName).should('exist');
    cy.contains(worker.email).should('exist');
  });

  it('should delete a worker', () => {
    cy.contains('Cierra').should('exist');

    cy.get('#delete-record-1').click();

    cy.contains('Cierra').should('not.exist');
  });

  it('should delete all workers', () => {
    cy.get('[id^="delete-record-"]').then(($buttons) => {
      const count = $buttons.length;

      for (let i = 0; i < count; i++) {
        cy.get('[id^="delete-record-"]').first().click();
      }
    });

    cy.get('.rt-noData').should('contain', 'No rows found');
  });

  it('should find a worker and edit it', () => {
    cy.get('#searchBox').type('Cierra');

    cy.get('#edit-record-1').click();

    fillWorkerForm(updatedWorker);

    cy.get('#submit').click();

    cy.contains(updatedWorker.firstName).should('exist');
  });

  it('should validate data after editing worker', () => {
    cy.get('#searchBox').type('Cierra');

    cy.get('#edit-record-1').click();

    fillWorkerForm(updatedWorker);

    cy.get('#submit').click();

    cy.contains(updatedWorker.firstName)
      .parents('.rt-tr-group')
      .within(() => {
        cy.contains(updatedWorker.lastName).should('exist');
        cy.contains(updatedWorker.email).should('exist');
        cy.contains(updatedWorker.age).should('exist');
        cy.contains(updatedWorker.salary).should('exist');
        cy.contains(updatedWorker.department).should('exist');
      });
  });

  it('should check search by all column values', () => {
    const searchableValues = [
      'Cierra',
      'Vega',
      'cierra@example.com',
      '39',
      '10000',
      'Insurance',
    ];

    searchableValues.forEach((value) => {
      cy.get('#searchBox').clear().type(value);
      cy.get('.rt-tbody').should('contain', value);
    });
  });
});
