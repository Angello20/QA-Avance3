import 'cypress-xpath';

describe('Pruebas de pagina "Vendor Groups"', () => {

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

    it('Caso de Prueba No. 51: Exportar excel de "Vendor Groups"', () => {
        // Visita la pagina que queremos probar
        cy.contains('Purchase').click();

        cy.contains('Vendor Groups').click();
        cy.url().should('include', '/VendorGroups/VendorGroupList');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/VendorGroup/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.get('#Grid_excelexport').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');
    });

    it('Caso de Prueba No. 52: Añadir un nuevo registro en "Vendor Groups"', () => {
        cy.contains('Purchase').click();


        cy.contains('Vendor Groups').click();
        cy.url().should('include', '/VendorGroups/VendorGroupList');


        cy.contains('Add').click();
        cy.url().should('include', '/VendorGroups/VendorGroupForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#VendorGroupForm_Name').type('Test');

        // Añade una descripción en el campo "Description"
        cy.get('#VendorGroupForm_Description').type('Testing functionality');


        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });


    it('Caso de Prueba No. 53: Intenta añadir un registro sin los campos obligatorios en "Vendor Groups" ', () => {
        cy.contains('Purchase').click();


        cy.contains('Vendor Groups').click();
        cy.url().should('include', '/VendorGroups/VendorGroupList');


        cy.contains('Add').click();
        cy.url().should('include', '/VendorGroups/VendorGroupForm');

        // Deja el campo "Name" vacío y llena el campo "Description"
        cy.get('#VendorGroupForm_Description').type('Testing functionality');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/VendorGroups/VendorGroupForm');

    });



    it('Caso de Prueba No. 54: Edita un registro en "Vendor Groups"', () => {
        cy.contains('Purchase').click();

        cy.contains('Vendor Groups').click();
        cy.url().should('include', '/VendorGroups/VendorGroupList');


        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {

            cy.contains('td', 'Test').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/VendorGroups/VendorGroupForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#VendorGroupForm_Name').clear().type('TestEdited');

        // Borra la descripción en el campo "Description"
        cy.get('#VendorGroupForm_Description').clear();

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });




    it('Caso de Prueba No. 55: Intenta editar un registro sin los campos obligatorios en "Vendor Groups"', () => {
        cy.contains('Purchase').click();

        cy.contains('Vendor Groups').click();
        cy.url().should('include', '/VendorGroups/VendorGroupList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'TestEdited').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/VendorGroups/VendorGroupForm');

        cy.get('#VendorGroupForm_Name').clear();

        // Introduce una descripción opcional en el campo "Description"
        cy.get('#VendorGroupForm_Description').clear().type('Testing Functionality Error');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/VendorGroups/VendorGroupForm');


    });


}); 