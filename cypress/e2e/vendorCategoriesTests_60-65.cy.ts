import 'cypress-xpath';

describe('Pruebas de pagina "Vendor Categories"', () => {

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

    it('Caso de Prueba No. 60: Exportar excel de "Vendor Categories"', () => {
        // Visita la pagina que queremos probar
        cy.contains('Purchase').click();

        cy.contains('Vendor Categories').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryList');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/VendorCategory/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.get('#Grid_excelexport').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');
    });

    it('Caso de Prueba No. 61: Añadir un nuevo registro en "Vendor Categories"', () => {
        cy.contains('Purchase').click();


        cy.contains('Vendor Categories').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryList');


        cy.contains('Add').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#VendorCategoryForm_Name').type('Test');

        // Añade una descripción en el campo "Description"
        cy.get('#VendorCategoryForm_Description').type('Testing functionality');


        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });


    it('Caso de Prueba No. 62: Intenta añadir un registro sin los campos obligatorios en "Vendor Categories" ', () => {
        cy.contains('Purchase').click();


        cy.contains('Vendor Categories').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryList');


        cy.contains('Add').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryForm');

        // Deja el campo "Name" vacío y llena el campo "Description"
        cy.get('#VendorCategoryForm_Description').type('Testing functionality');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/VendorCategories/VendorCategoryForm');

    });



    it('Caso de Prueba No. 63: Edita un registro en "Vendor Categories"', () => {
        cy.contains('Purchase').click();

        cy.contains('Vendor Categories').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryList');


        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {

            cy.contains('td', 'Test').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#VendorCategoryForm_Name').clear().type('TestEdited');

        // Borra la descripción en el campo "Description"
        cy.get('#VendorCategoryForm_Description').clear();

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });




    it('Caso de Prueba No. 64: Intenta editar un registro sin los campos obligatorios en "Vendor Categories"', () => {
        cy.contains('Purchase').click();

        cy.contains('Vendor Categories').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'TestEdited').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryForm');

        cy.get('#VendorCategoryForm_Name').clear();

        // Introduce una descripción opcional en el campo "Description"
        cy.get('#VendorCategoryForm_Description').clear().type('Testing Functionality Error');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/VendorCategories/VendorCategoryForm');


    });

    it('Caso de Prueba No. 65: Elimina un registro en "Vendor Categories"', () => {
        cy.contains('Purchase').click();

        cy.contains('Vendor Categories').click();
        cy.url().should('include', '/VendorCategories/VendorCategoryList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'TestEdited').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Delete').click();

        // Verifica que aparece el mensaje de confirmación
        cy.contains('Are you sure you want to permanently delete these items?').should('be.visible');

        // Confirma la acción haciendo clic en "Ok"
        cy.get('.e-dialog .e-primary').click();

        // Verifica que la URL contiene la acción "delete"
        cy.url().should('include', '/VendorCategories/VendorCategoryForm').and('include', 'action=delete');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('Success delete existing data.').should('be.visible');


    });
});