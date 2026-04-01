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

  const addWorker = (workerData) => {
    cy.get('#addNewRecordButton').click();
    fillWorkerForm(workerData);
    cy.get('#submit').click();
  };

  const getRowByText = (text) => {
    return cy.contains('.rt-tr-group', text);
  };

  beforeEach(() => {
    cy.visit('https://demoqa.com/webtables');
  });

  it('should check pagination', () => {
    addWorker(worker);

    addWorker({
      ...worker,
      firstName: 'Second',
      email: 'second@test.com',
    });

    addWorker({
      ...worker,
      firstName: 'Third',
      email: 'third@test.com',
    });

    cy.get('select[aria-label="rows per page"]').select('5');

    cy.get('.-next')
      .should('not.have.class', '-disabled')
      .click({ force: true });

    cy.get('.-pageJump input').should('have.value', '2');

    cy.get('.-previous').click({ force: true });

    cy.get('.-pageJump input').should('have.value', '1');
  });

  it('should check rows count selection', () => {
    cy.get('select[aria-label="rows per page"]').select('5');
    cy.get('.rt-tbody .rt-tr-group').should('have.length', 5);

    cy.get('select[aria-label="rows per page"]').select('10');
    cy.get('.rt-tbody .rt-tr-group').should('have.length', 10);
  });

  it('should add a new worker', () => {
    addWorker(worker);

    getRowByText(worker.firstName).within(() => {
      cy.contains(worker.lastName).should('exist');
      cy.contains(worker.email).should('exist');
      cy.contains(worker.age).should('exist');
      cy.contains(worker.salary).should('exist');
      cy.contains(worker.department).should('exist');
    });
  });

  it('should delete a worker', () => {
    getRowByText('Cierra')
      .find('[id^="delete-record-"]')
      .click({ force: true });

    cy.contains('Cierra').should('not.exist');
  });

  it('should delete all workers', () => {
    cy.get('[id^="delete-record-"]').then(($buttons) => {
      const count = $buttons.length;

      for (let i = 0; i < count; i++) {
        cy.get('[id^="delete-record-"]').first().click({ force: true });
      }
    });

    cy.get('.rt-noData').should('contain', 'No rows found');
  });

  it('should find a worker, edit it and validate updated data', () => {
    cy.get('#searchBox').type('Cierra');

    getRowByText('Cierra').find('[id^="edit-record-"]').click({ force: true });

    fillWorkerForm(updatedWorker);

    cy.get('#submit').click();

    getRowByText(updatedWorker.firstName).within(() => {
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
