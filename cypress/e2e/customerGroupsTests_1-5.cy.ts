import 'cypress-xpath';

describe('Pruebas de pagina "Unit Measures"', () => {

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            // Evita que Cypress falle el test en caso de excepciones no capturadas
            return false;
        });

        // Precondición: Iniciar sesión como admin
        cy.visit('https://whms-lte.csharpasp.net');

        
        // Hace clic en el botón para desbloquear y acceder a la página de login
        cy.get('.lock-icon').click();

        // Inicia sesión como administrador
        cy.get('input[placeholder="Email"]').clear().type('admin@gmail.com'); 
        cy.get('input[placeholder="Password"]').clear().type('123456');
        cy.get('button[type="submit"]').click();

        // Verifica que el usuario accede correctamente al Dashboard
        cy.url().should('include', '/Dashboards');
    });

    it('Caso de Prueba No. 1: Exportar excel de "Customer Groups"', () => {
        // Visita la pagina que queremos probar
        cy.contains('Sales').click();

        cy.contains('Customer Groups').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupList');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/CustomerGroup/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.get('#Grid_excelexport').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist'); 
    });

    it('Caso de Prueba No. 2: Añadir un nuevo registro en "Customer Groups"', () => {
        cy.contains('Sales').click();


        cy.contains('Customer Groups').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupList');


        cy.contains('Add').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerGroupForm_Name').type('Art');

        // Añade una descripción en el campo "Description"
        cy.get('#CustomerGroupForm_Description').type('testing description');


        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });


    it('Caso de Prueba No. 3: Intenta añadir un registro sin los campos obligatorios en "Customer Groups" ', () => {
        cy.contains('Sales').click();


        cy.contains('Customer Groups').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupList');


        cy.contains('Add').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupForm');

        // Deja el campo "Name" vacío y llena el campo "Description"
        cy.get('#CustomerGroupForm_Description').type('testing description');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/CustomerGroups/CustomerGroupForm');

    });



    it('Caso de Prueba No. 4: Edita un registro en "Customer Groups"', () => {
        cy.contains('Sales').click();

        cy.contains('Customer Groups').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupList');


        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            
            cy.contains('td', 'Art').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerGroupForm_Name').clear().type('Art');

        // Añade una descripción en el campo "Description"
        cy.get('#CustomerGroupForm_Description').clear().type('testing description');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });




    it('Caso de Prueba No. 5: Intenta editar un registro sin los campos obligatorios en "Customer Groups"', () => {
        cy.contains('Sales').click();

        cy.contains('Customer Groups').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'Art').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/CustomerGroups/CustomerGroupForm');

        cy.get('#CustomerGroupForm_Name').clear();

        // Introduce una descripción opcional en el campo "Description"
        cy.get('#CustomerGroupForm_Description').clear().type('testing description');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/CustomerGroups/CustomerGroupForm');

        
    });
    

}); 