import 'cypress-xpath';

describe('Pruebas de pagina "Tax"', () => {

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

    it('Caso de Prueba No. 33: Exportar Excel de "Tax"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "Tax"
        cy.contains('Tax').click();
        cy.url().should('include', '/Tax');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/Tax/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.contains('Excel Export').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');

    });

    it('Caso de Prueba No. 34: Añadir una nueva entrada en "Tax"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "Tax"
        cy.contains('Tax').click();
        cy.url().should('include', '/Tax');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/Taxes/TaxForm?action=create');

        // Llena los datos correspondientes en los campos
        cy.get('#TaxForm_Name').type('T01');
        cy.get('#TaxForm_Percentage').type('1');
        cy.get('#TaxForm_Description').type('tax');

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de éxito
        cy.contains('Success create new data.').should('be.visible');
    });

    it('Caso de Prueba No. 35: Añadir sin el campo "Name" en "Tax"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "Tax"
        cy.contains('Tax').click();
        cy.url().should('include', '/Tax');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/Taxes/TaxForm?action=create');

        // Llena los datos correspondientes en los campos
        cy.get('#TaxForm_Percentage').type('1');
        cy.get('#TaxForm_Description').type('tax');

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error
        cy.contains('The Name field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 36: Añadir sin el campo "Percentage" en "Tax"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Tax"
        cy.contains('Tax').click();
        cy.url().should('include', '/Tax');
    
        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/Taxes/TaxForm?action=create');
    
        // Llena los datos correspondientes en los campos
        cy.get('#TaxForm_Name').type('T01');
        cy.get('#TaxForm_Description').type('tax');
    
        // Verifica que el campo de porcentaje esté vacío
        cy.get('#TaxForm_Percentage').should('be.empty');
    
        // Envía el formulario
        cy.get('#btnSubmit').click();
    
        // Verifica que el mensaje de error genérico de "campo requerido" esté visible
        cy.contains('This field is required.', { timeout: 10000 }).should('be.visible');
    });
    

    it('Caso de Prueba No. 37: Verificar opción "Items per page" en "Tax"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Tax"
        cy.contains('Tax').click();
        cy.url().should('include', '/Tax');
    
        // Lista de opciones a probar
        const itemsPerPageOptions = [10, 20, 50, 100, 200, 'all'];
    
        // Itera sobre cada opción y verifica el cambio en la lista
        itemsPerPageOptions.forEach(option => {
            cy.contains('Items per page').click();
            cy.contains(option.toString(), { timeout: 8000 }).click({ force: true });
            cy.wait(2000);
            cy.get('.tax-list-item').should('have.length.lte', option === 'all' ? Infinity : option);
        });
    });
    it('Caso de Prueba No. 50: Modificar una entrada existente en "Tax"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Tax"
        cy.contains('Tax').click();
        cy.url().should('include', '/Tax');
    
        // Buscar un "Tax" existente en la lista
        cy.get('.tax-list-item:contains("T01")').parent().within(() => {
            // Hacer clic en "Edit" para modificar el "Tax" existente
            cy.contains('Edit').click();
        });
    
        // Verifica que la URL contenga '/Taxes/TaxForm' y 'action=edit'
        cy.url().should('include', '/Taxes/TaxForm').and('include', 'action=edit');
    
        // Modificar los datos de la entrada
        cy.get('#TaxForm_Name').clear().type('T02');  // Modificar nombre
        cy.get('#TaxForm_Percentage').clear().type('2');  // Modificar porcentaje
        cy.get('#TaxForm_Description').clear().type('taxedit');  // Modificar descripción
    
        // Enviar el formulario
        cy.get('#btnSubmit').click();
    
        // Verificar que se muestre la notificación de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });
    
    
});
