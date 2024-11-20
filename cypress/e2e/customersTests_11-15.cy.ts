import 'cypress-xpath';

describe('Pruebas de pagina "Customers"', () => {

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

    it('Caso de Prueba No. 11: Exportar excel de "Customers"', () => {
        // Visita la pagina que queremos probar
        cy.contains('Sales').click();

        cy.contains('Customers').click();
        cy.url().should('include', '/Customers/CustomerList');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/Customer/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.get('#Grid_excelexport').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist'); 
    });

    it('Caso de Prueba No. 12: Añadir un nuevo registro en "Customers"', () => {
        cy.contains('Sales').click();


        cy.contains('Customers').click();
        cy.url().should('include', '/Customers/CustomerList');


        cy.contains('Add').click();
        cy.url().should('include', '/Customers/CustomerForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerForm_Name').type('Test LLC');

        // Añade un grupo en el campo "Group"
        cy.get('span[aria-owns="CustomerForm_CustomerGroupId_options"]').click();
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'Corporate').should('be.visible').click();


        // Añade una categoria en el campo "Category"
        cy.get('span[aria-owns="CustomerForm_CustomerCategoryId_options"]').click(); 
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'Enterprise').should('be.visible').click();


        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });


    it('Caso de Prueba No. 13: Intenta añadir un registro sin los campos obligatorios en "Customers" ', () => {
        cy.contains('Sales').click();


        cy.contains('Customers').click();
        cy.url().should('include', '/Customers/CustomerList');


        cy.contains('Add').click();
        cy.url().should('include', '/Customers/CustomerForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerForm_Name').type('Test LLC');

        // Añade un grupo en el campo "Group"
        cy.get('span[aria-owns="CustomerForm_CustomerGroupId_options"]').click();
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'Corporate').should('be.visible').click();

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Category field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/Customers/CustomerForm');

    });

    it('Caso de Prueba No. 14: Edita un registro en "Customers"', () => {
        cy.contains('Sales').click();

        cy.contains('Customers').click();
        cy.url().should('include', '/Customers/CustomerList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            
            cy.contains('td', 'Test LLC').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/Customers/CustomerForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerForm_Name').clear().type('Test LLC');

        // Añade un grupo en el campo "Group"
        cy.get('span[aria-owns="CustomerForm_CustomerGroupId_options"]').click();
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'Corporate').should('be.visible').click();

        // Añade una categoria en el campo "Category"
        cy.get('span[aria-owns="CustomerForm_CustomerCategoryId_options"]').click(); 
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'Enterprise').should('be.visible').click();

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });

    it('Caso de Prueba No. 15: Intenta editar un registro sin los campos obligatorios en "Customers"', () => {
        cy.contains('Sales').click();

        cy.contains('Customers').click();
        cy.url().should('include', '/Customers/CustomerList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            
            cy.contains('td', 'Test LLC').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/Customers/CustomerForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#CustomerForm_Name').clear();

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/Customers/CustomerForm');
        
    });
    
});