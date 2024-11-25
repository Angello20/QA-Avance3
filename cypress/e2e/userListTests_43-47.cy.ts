import 'cypress-xpath';

describe('Pruebas de pagina "User List"', () => {

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

    it('Caso de Prueba No. 39: Exportar Excel de "User List"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/UserList/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.contains('Excel Export').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');

    });
    it('Caso de Prueba No. 40: Añadir un nuevo usuario en "User List" llenando todos los campos', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Simula un clic en el botón para añadir un nuevo usuario
        cy.contains('Add').click();
        cy.url().should('include', '/Users/UserForm?action=create');


        // Espera explícitamente a que los campos estén visibles
        cy.get('#UserForm_Email').should('be.visible').type('example@gmail.com');
        cy.get('#UserForm_Password').should('be.visible').type('password123');
        cy.get('#UserForm_ConfirmPassword').should('be.visible').type('password123');
        cy.get('span[aria-owns="UserForm_SelectedCompanyId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'Default Company, LLC.').should('be.visible').click();

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de éxito o una confirmación de creación de usuario
        cy.contains('Success create new data.').should('be.visible');
    });
    it('Caso de Prueba No. 41: Añadir un nuevo usuario en "User List" sin llenar el campo "Email"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Simula un clic en el botón para añadir un nuevo usuario
        cy.contains('Add').click();
        cy.url().should('include', '/Users/UserForm?action=create');

        // Espera explícitamente a que los campos estén visibles
        cy.get('#UserForm_Password').should('be.visible').type('password123');
        cy.get('#UserForm_ConfirmPassword').should('be.visible').type('password123');
        cy.get('span[aria-owns="UserForm_SelectedCompanyId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'Default Company, LLC.').should('be.visible').click();

        // Envía el formulario sin llenar el campo "Email"
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error para el campo "Email"
        cy.contains('The Email field is required.').should('be.visible');
    });
    it('Caso de Prueba No. 42: Añadir un nuevo usuario en "User List" sin seleccionar la compañía', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Simula un clic en el botón para añadir un nuevo usuario
        cy.contains('Add').click();
        cy.url().should('include', '/Users/UserForm?action=create');

        // Espera explícitamente a que los campos estén visibles
        cy.get('#UserForm_Email').should('be.visible').type('example@example.com');
        cy.get('#UserForm_Password').should('be.visible').type('password123');
        cy.get('#UserForm_ConfirmPassword').should('be.visible').type('password123');

        // Deja el campo "Selected Company" vacío (no se selecciona ninguna opción)
        cy.get('span[aria-owns="UserForm_SelectedCompanyId_options"]').should('be.visible'); // Asegúrate de que esté visible pero no seleccionas nada

        // Envía el formulario sin seleccionar la compañía
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error para el campo "Selected Company"
        cy.contains('The Selected Company field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 44: Añadir un nuevo usuario en "User List" sin llenar el campo "Password"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');
    
        // Simula un clic en el botón para añadir un nuevo usuario
        cy.contains('Add').click();
        cy.url().should('include', '/Users/UserForm?action=create');
    
        // Espera explícitamente a que los campos estén visibles
        cy.get('span[aria-owns="UserForm_SelectedCompanyId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'Default Company, LLC.').should('be.visible').click();
    
        // Deja el campo "Password" vacío
        cy.get('#UserForm_ConfirmPassword').should('be.visible').type('password123');
    
        // Envía el formulario sin llenar el campo "Password"
        cy.get('#btnSubmit').click();
    
        // Verifica que se muestre una notificación de error para el campo "Password"
        cy.contains('The Password field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 43: Añadir un nuevo usuario en "User List" sin llenar el campo "Confirm Password"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');
    
        // Simula un clic en el botón para añadir un nuevo usuario
        cy.contains('Add').click();
        cy.url().should('include', '/Users/UserForm?action=create');
    
        // Espera explícitamente a que los campos estén visibles
        cy.get('span[aria-owns="UserForm_SelectedCompanyId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'Default Company, LLC.').should('be.visible').click();
    
        // Llena el campo "Password" pero deja "Confirm Password" vacío
        cy.get('#UserForm_Password').should('be.visible').type('password123');
    
        // Envía el formulario sin llenar el campo "Confirm Password"
        cy.get('#btnSubmit').click();
    
        // Verifica que se muestre una notificación de error para el campo "Confirm Password"
        cy.contains('The Confirm Password field is required.').should('be.visible');
    });
    it('Caso de Prueba No. 45: Añadir un nuevo usuario en "User List" con "Password" diferente a "Confirm Password"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');
    
        // Simula un clic en el botón para añadir un nuevo usuario
        cy.contains('Add').click();
        cy.url().should('include', '/Users/UserForm?action=create');
    
        // Espera explícitamente a que los campos estén visibles
        cy.get('span[aria-owns="UserForm_SelectedCompanyId_options"]').click();
        cy.wait(500);
        cy.contains('.e-popup .e-list-item', 'Default Company, LLC.').should('be.visible').click();
    
        // Rellena el campo "Password" con un valor
        cy.get('#UserForm_Password').should('be.visible').type('password123');
    
        // Rellena el campo "Confirm Password" con un valor diferente
        cy.get('#UserForm_ConfirmPassword').should('be.visible').type('password456');
    
        // Envía el formulario con las contraseñas que no coinciden
        cy.get('#btnSubmit').click();
    
        // Verifica que se muestre una notificación de error por contraseñas no coincidentes
        cy.contains('The Password and Confirm Password fields do not match.').should('be.visible');
    });    

});
