import 'cypress-xpath';

describe('Pruebas de pagina "Customer Categories"', () => {

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

    it('Caso de Prueba No. 6: Exportar excel de "Customer Categories"', () => {
        // Visita la pagina que queremos probar
        cy.contains('Sales').click();

        cy.contains('Customer Categories').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryList');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/CustomerCategory/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.get('#Grid_excelexport').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist'); 
    });

    it('Caso de Prueba No. 7: Añadir un nuevo registro en "Customer Categories"', () => {
        cy.contains('Sales').click();


        cy.contains('Customer Categories').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryList');


        cy.contains('Add').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerCategoryForm_Name').type('Big');

        // Añade una descripción en el campo "Description"
        cy.get('#CustomerCategoryForm_Description').type('testing description');


        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });


    it('Caso de Prueba No. 8: Intenta añadir un registro sin los campos obligatorios en "Customer Categories" ', () => {
        cy.contains('Sales').click();


        cy.contains('Customer Categories').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryList');


        cy.contains('Add').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryForm');

        // Deja el campo "Name" vacío y llena el campo "Description"
        cy.get('#CustomerCategoryForm_Description').type('testing description');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/CustomerCategories/CustomerCategoryForm');

    });

    it('Caso de Prueba No. 9: Edita un registro en "Customer Categories"', () => {
        cy.contains('Sales').click();

        cy.contains('Customer Categories').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            
            cy.contains('td', 'Big').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerCategoryForm_Name').clear().type('Big');

        // Añade una descripción en el campo "Description"
        cy.get('#CustomerCategoryForm_Description').clear().type('testing description');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });

    it('Caso de Prueba No. 10: Intenta editar un registro sin los campos obligatorios en "Customer Categories"', () => {
        cy.contains('Sales').click();

        cy.contains('Customer Categories').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            
            cy.contains('td', 'Big').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/CustomerCategories/CustomerCategoryForm');

        cy.get('#CustomerCategoryForm_Name').clear();

        // Introduce una descripción opcional en el campo "Description"
        cy.get('#CustomerCategoryForm_Description').clear().type('testing description');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/CustomerCategories/CustomerCategoryForm');
        
    });
    
});