import 'cypress-xpath';

describe('Pruebas de pagina "User Profile"', () => {

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

    it('Caso de Prueba No. 38: Exportar Excel de "User Profile"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User Profile"
        cy.contains('User Profile').click();
        cy.url().should('include', '/UserProfile');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/UserProfile/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.contains('Excel Export').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');

        // Abre el archivo y verifica su contenido
        // Nota: La verificación del contenido del archivo se hace fuera de Cypress
    });

    it('Caso de Prueba No. 39: Añadir una nueva entrada en "User Profile"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User Profile"
        cy.contains('User Profile').click();
        cy.url().should('include', '/UserProfile');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/UserProfile/Form');

        // Llena los datos correspondientes en los campos
        cy.get('#UserProfileForm_FullName').type('Pablo Peraza');
        cy.get('#UserProfileForm_JobTitle').type('Developer');
        cy.get('#UserProfileForm_Address').type('123 Street');
        cy.get('#UserProfileForm_City').type('San Jose');
        cy.get('#UserProfileForm_State').type('CA');
        cy.get('#UserProfileForm_Country').type('Costa Rica');
        cy.get('#UserProfileForm_ZipCode').type('94016');
        cy.get('#UserProfileForm_UserType').select('Admin');
        cy.get('#UserProfileForm_IsDefaultAdmin').check();
        cy.get('#UserProfileForm_IsOnline').check();
        cy.get('#UserProfileForm_SelectedCompany').select('Default Company, LLC.');

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de éxito
        cy.contains('Success create new data.').should('be.visible');
    });

    it('Caso de Prueba No. 40: Añadir sin el campo "FullName" en "User Profile"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User Profile"
        cy.contains('User Profile').click();
        cy.url().should('include', '/UserProfile');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/UserProfile/Form');

        // Llena los datos correspondientes en los campos
        cy.get('#UserProfileForm_JobTitle').type('Developer');
        cy.get('#UserProfileForm_Address').type('123 Street');
        cy.get('#UserProfileForm_City').type('San Jose');
        cy.get('#UserProfileForm_State').type('CA');
        cy.get('#UserProfileForm_Country').type('Costa Rica');
        cy.get('#UserProfileForm_ZipCode').type('94016');
        cy.get('#UserProfileForm_UserType').select('Admin');
        cy.get('#UserProfileForm_IsDefaultAdmin').check();
        cy.get('#UserProfileForm_IsOnline').check();
        cy.get('#UserProfileForm_SelectedCompany').select('Default Company, LLC.');

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error
        cy.contains('The FullName field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 41: Añadir sin el campo "SelectedCompany" en "User Profile"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User Profile"
        cy.contains('User Profile').click();
        cy.url().should('include', '/UserProfile');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/UserProfile/Form');

        // Llena los datos correspondientes en los campos
        cy.get('#UserProfileForm_FullName').type('Pablo Peraza');
        cy.get('#UserProfileForm_JobTitle').type('Developer');
        cy.get('#UserProfileForm_Address').type('123 Elm Street');
        cy.get('#UserProfileForm_City').type('San Jose');
        cy.get('#UserProfileForm_State').type('CA');
        cy.get('#UserProfileForm_Country').type('Costa Rica');
        cy.get('#UserProfileForm_ZipCode').type('94016');
        cy.get('#UserProfileForm_UserType').select('Admin');
        cy.get('#UserProfileForm_IsDefaultAdmin').check();
        cy.get('#UserProfileForm_IsOnline').check();

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error
        cy.contains('The SelectedCompany field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 42: Verificar opción "Items per page" en "User Profile"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User Profile"
        cy.contains('User Profile').click();
        cy.url().should('include', '/UserProfile');

        // Lista de opciones a probar
        const itemsPerPageOptions = [10, 20, 50, 100, 200, 'all'];

        // Itera sobre cada opción y verifica el cambio en la lista
        itemsPerPageOptions.forEach(option => {
            cy.contains('Items per page').click();
            cy.contains(option.toString()).click();
            cy.wait(2000); // Espera a que la lista se actualice
            // Verificación: La lista debería mostrar la cantidad de elementos seleccionados o menos, si hay menos datos disponibles
            cy.get('.user-profile-list-item').should('have.length.lte', option === 'all' ? Infinity : option);
        });
    });
});
