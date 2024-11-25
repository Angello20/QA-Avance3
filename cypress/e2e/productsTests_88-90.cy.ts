import 'cypress-xpath';

describe('Pruebas de pagina "Products"', () => {
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


    
    
    it('Caso de Prueba No. 88: Añade un nuevo registro en "Products"', () => {
        cy.contains('Inventory').click();

        cy.contains('Products').click();
        cy.url().should('include', '/Products/ProductList');

        cy.contains('Add').click();
        cy.url().should('include', '/Products/ProductForm');

        // Introduce el nombre del nuevo producto
        cy.get('#ProductForm_Name').type('Cisco Firewall');

        // Selecciona un grupo de productos en "Product Group"
        cy.get('span[aria-owns="ProductForm_ProductGroupId_options"]').click(); 
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'Networking').should('be.visible').click(); 

        // Selecciona una unidad de medida en "Unit Measure"
        cy.get('span[aria-owns="ProductForm_UnitMeasureId_options"]').click(); 
        cy.wait(500); 
        cy.contains('.e-popup .e-list-item', 'unit').should('be.visible').click(); 

        // Introduce el precio unitario 
        cy.get('#ProductForm_UnitPrice').click().type('3500.00');

        // Marca la casilla para indicar que el producto es físico
        cy.get('#ProductForm_Physical').check({ force: true });

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');
    });
    
    it('Caso de Prueba No. 89: Intenta añadir un registro sin los campos obligatorios en "Products"', () => {
        cy.contains('Inventory').click();

        cy.contains('Products').click();
        cy.url().should('include', '/Products/ProductList');

        cy.contains('Add').click();
        cy.url().should('include', '/Products/ProductForm');

        // Añade una descripción
        cy.get('#ProductForm_Description').type('Descripción de prueba para el producto');

        // Introduce un precio unitario para el nuevo registro
        cy.get('#ProductForm_UnitPrice').click().type('3500.00');

        // Marca la casilla "Physical"
        cy.get('#ProductForm_Physical').check({ force: true });

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensajes de errores
        cy.contains('The Name field is required.').should('be.visible');
        cy.contains('The Product Group field is required.').should('be.visible');
        cy.contains('The Unit Measure field is required.').should('be.visible');

        // Verifica que la URL no haya cambiado 
        cy.url().should('include', '/Products/ProductForm');

    });


    it('Caso de Prueba No. 90: Edita un registro en "Products"', () => {
        cy.contains('Inventory').click();

        cy.contains('Products').click();
        cy.url().should('include', '/Products/ProductList');

        // Selecciona un registro existente
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'Cisco Firewall').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/Products/ProductForm');

        // Edita el campo "Name"
        cy.get('#ProductForm_Name').clear().type('Cisco Firewall actualizado');

        // Edita el campo "Description"
        cy.get('#ProductForm_Description').clear().type('descripción actualizada');

        // Selecciona un grupo de productos existente
        cy.get('span[aria-owns="ProductForm_ProductGroupId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'Networking').click();

        // Selecciona una unidad de medida existente
        cy.get('span[aria-owns="ProductForm_UnitMeasureId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'unit').click();

        // Edita el precio unitario
        cy.get('#ProductForm_UnitPrice').clear().type('5000.00');

        // Marca la casilla "Physical"
        cy.get('#ProductForm_Physical').check({ force: true });

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');

        // Verifica que la URL se redirige correctamente
        cy.url().should('include', '/Products/ProductForm');
    });


});
