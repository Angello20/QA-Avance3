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

    it('Caso de Prueba No. 76: Añadir un nuevo registro en "Unit Measures"', () => {
        cy.contains('Inventory').click();


        cy.contains('Unit Measures').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureList');


        cy.contains('Add').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#UnitMeasureForm_Name').type('liter');

        // Añade una descripción en el campo "Description"
        cy.get('#UnitMeasureForm_Description').type('Unidad de volumen');


        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });


    it('Caso de Prueba No. 77: Intenta añadir un registro sin los campos obligatorios en "Unit Measures" ', () => {
        cy.contains('Inventory').click();

        cy.contains('Unit Measures').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureList');

        cy.contains('Add').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm');

        // Deja el campo "Name" vacío y llena el campo "Description"
        cy.get('#UnitMeasureForm_Description').type('Unidad de volumen');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm');

    });



    it('Caso de Prueba No. 78: Edita un registro en "Unit Measures"', () => {
        cy.contains('Inventory').click();

        cy.contains('Unit Measures').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureList');


        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            
            cy.contains('td', 'liter').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#UnitMeasureForm_Name').clear().type('liter');

        // Añade una descripción para el registro en el campo "Description"
        cy.get('#UnitMeasureForm_Description').clear().type('unit of volume');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });




    it('Caso de Prueba No. 79: Intenta editar un registro sin los campos obligatorios en "Unit Measures"', () => {
        cy.contains('Inventory').click();


        cy.contains('Unit Measures').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'liter').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm');

        cy.get('#UnitMeasureForm_Name').clear();

        // Introduce una descripción opcional en el campo "Description"
        cy.get('#UnitMeasureForm_Description').clear().type('Unidad de volumen');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm');

        
    });


    it('Caso de Prueba No. 80: Eliminar un registro en "Unit Measures"', () => {
        cy.contains('Inventory').click();
    
        cy.contains('Unit Measures').click();
        cy.url().should('include', '/UnitMeasures/UnitMeasureList');
    
        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'liter').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });
    
        cy.contains('Delete').click();
    
        // Verifica que aparece el mensaje de confirmación
        cy.contains('Are you sure you want to permanently delete these items?').should('be.visible');
    
        // Confirma la acción haciendo clic en "Ok"
        cy.get('.e-dialog .e-primary').click();
    
        // Verifica que la URL contiene la acción "delete"
        cy.url().should('include', '/UnitMeasures/UnitMeasureForm').and('include', 'action=delete');
    
        // Introduce el nombre del registro en el campo "Name"
        cy.get('#UnitMeasureForm_Name').clear().type('liter');
    
        // Introduce una descripción opcional en el campo "Description"
        cy.get('#UnitMeasureForm_Description').clear().type('Unidad de volumen');
    
        cy.get('#btnSubmit').click();
    
        // Resultado esperado: Mensaje de éxito
        cy.contains('Success delete existing data.').should('be.visible');
    });
    

}); 
