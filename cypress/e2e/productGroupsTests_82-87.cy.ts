import 'cypress-xpath';

describe('Pruebas de pagina "Product Groups"', () => {
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

    it('Caso de Prueba No. 82: Añade un nuevo registro en "Product Groups"', () => {
        cy.contains('Inventory').click();

        cy.contains('Product Groups').click();
        cy.url().should('include', '/ProductGroups/ProductGroupList');

        cy.contains('Add').click();
        cy.url().should('include', '/ProductGroups/ProductGroupForm');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#ProductGroupForm_Name').type('Database');

        // Introduce una descripción opcional en el campo "Description"
        cy.get('#ProductGroupForm_Description').type('description test');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success create new data.').should('be.visible');

    });


    it('Caso de Prueba No. 83: Intenta añadir un registro sin los campos obligatorios en "Product Groups"', () => {
        cy.contains('Inventory').click();

        cy.contains('Product Groups').click();
        cy.url().should('include', '/ProductGroups/ProductGroupList');

        cy.contains('Add').click();
        cy.url().should('include', '/ProductGroups/ProductGroupForm');

        // Deja el campo "Name" vacío y llena el campo "Description"
        cy.get('#ProductGroupForm_Description').type('description test');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/ProductGroups/ProductGroupForm');
    });



    it('Caso de Prueba No. 84: Edita un registro en "Product Groups"', () => {
        cy.contains('Inventory').click();

        cy.contains('Product Groups').click();
        cy.url().should('include', '/ProductGroups/ProductGroupList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'Database').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/ProductGroups/ProductGroupForm');

        // Introduce un nombre en el campo "Name"
        cy.get('#ProductGroupForm_Name').clear().type('Database');

        // Añade una descripción para el registro en el campo "Description"
        cy.get('#ProductGroupForm_Description').clear().type('description test actualizada');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de éxito
        cy.contains('Success update existing data.').should('be.visible');
    });



    it('Caso de Prueba No. 85: Intenta editar un registro sin los campos obligatorios en "Product Groups"', () => {
        cy.contains('Inventory').click();

        cy.contains('Product Groups').click();
        cy.url().should('include', '/ProductGroups/ProductGroupList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'Database').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Edit').click();
        cy.url().should('include', '/ProductGroups/ProductGroupForm');

        // Limpia el campo "Name" dejándolo vacío
        cy.get('#ProductGroupForm_Name').clear();

        // Introduce una descripción en el campo "Description"
        cy.get('#ProductGroupForm_Description').clear().type('description test');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');

        // Verifica que no se redirige a la página de éxito
        cy.url().should('include', '/ProductGroups/ProductGroupForm');
    });

    
    it('Caso de Prueba No. 86: Eliminar un registro en "Product Groups"', () => {
        cy.contains('Inventory').click();

        cy.contains('Product Groups').click();
        cy.url().should('include', '/ProductGroups/ProductGroupList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'Database').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Delete').click();

        // Verifica que aparece el mensaje de confirmación
        cy.contains('Are you sure you want to permanently delete these items?').should('be.visible');

        // Confirma la acción haciendo clic en "Ok"
        cy.get('.e-dialog .e-primary').click();

        // Verifica que la URL contiene la acción "delete"
        cy.url().should('include', '/ProductGroups/ProductGroupForm').and('include', 'action=delete');

        // Introduce el nombre del registro en el campo "Name"
        cy.get('#ProductGroupForm_Name').clear().type('Database');
    
        // Introduce una descripción en el campo "Description"
        cy.get('#ProductGroupForm_Description').clear().type('description test actualizada');
    
        cy.get('#btnSubmit').click();


        // Resultado esperado: Mensaje de éxito
        cy.contains('Success delete existing data.').should('be.visible');
    });



    it('Caso de Prueba No. 87: Intenta eliminar un registro sin los campos obligatorios en "Product Groups"', () => {
        cy.contains('Inventory').click();

        cy.contains('Product Groups').click();
        cy.url().should('include', '/ProductGroups/ProductGroupList');

        // Selecciona un registro específico de la tabla
        cy.get('#Grid').should('be.visible').within(() => {
            cy.contains('td', 'Hardware').parent().within(() => {
                cy.get('input[type="checkbox"]').check({ force: true });
            });
        });

        cy.contains('Delete').click();

        // Verifica que aparece el mensaje de confirmación
        cy.contains('Are you sure you want to permanently delete these items?').should('be.visible');

        // Confirma la acción haciendo clic en "Ok"
        cy.get('.e-dialog .e-primary').click();

        // Verifica que la URL contiene la acción "delete"
        cy.url().should('include', '/ProductGroups/ProductGroupForm').and('include', 'action=delete');

        // Limpia el campo "Name" para dejarlo vacío
        cy.get('#ProductGroupForm_Name').clear();

        // Introduce una descripción en el campo "Description"
        cy.get('#ProductGroupForm_Description').clear().type('description tests');

        cy.get('#btnSubmit').click();

        // Resultado esperado: Mensaje de error
        cy.contains('The Name field is required.').should('be.visible');
    });




});
