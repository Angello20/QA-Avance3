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

    it('Caso de Prueba No. 43: Exportar Excel de "User List"', () => {
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

        // Abre el archivo y verifica su contenido
        // Nota: La verificación del contenido del archivo se hace fuera de Cypress
    });

    it('Caso de Prueba No. 44: Añadir una nueva entrada en "User List"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/UserList/Form');

        // Llena los datos correspondientes en los campos
        cy.get('#UserListForm_FullName').type('Pablo Peraza');
        cy.get('#UserListForm_JobTitle').type('Developer');
        cy.get('#UserListForm_Address').type('123 Street');
        cy.get('#UserListForm_City').type('San Jose');
        cy.get('#UserListForm_State').type('CA');
        cy.get('#UserListForm_Country').type('Costa RIca');
        cy.get('#UserListForm_ZipCode').type('94016');
        cy.get('#UserListForm_UserType').select('Admin');
        cy.get('#UserListForm_IsDefaultAdmin').check();
        cy.get('#UserListForm_IsOnline').check();
        cy.get('#UserListForm_SelectedCompany').select('Default Company, LLC.');

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de éxito
        cy.contains('Success create new data.').should('be.visible');
    });

    it('Caso de Prueba No. 45: Añadir sin el campo "FullName" en "User List"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/UserList/Form');

        // Llena los datos correspondientes en los campos
        cy.get('#UserListForm_JobTitle').type('Developer');
        cy.get('#UserListForm_Address').type('123 Street');
        cy.get('#UserListForm_City').type('San Jose');
        cy.get('#UserListForm_State').type('CA');
        cy.get('#UserListForm_Country').type('Costa RIca');
        cy.get('#UserListForm_ZipCode').type('94016');
        cy.get('#UserListForm_UserType').select('Admin');
        cy.get('#UserListForm_IsDefaultAdmin').check();
        cy.get('#UserListForm_IsOnline').check();
        cy.get('#UserListForm_SelectedCompany').select('Default Company, LLC.');

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error
        cy.contains('The FullName field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 46: Añadir sin el campo "SelectedCompany" en "User List"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Simula un clic en el botón de añadir nueva entrada
        cy.contains('Add').click();
        cy.url().should('include', '/UserList/Form');

        // Llena los datos correspondientes en los campos
        cy.get('#UserListForm_FullName').type('Pablo Peraza');
        cy.get('#UserListForm_JobTitle').type('Developer');
        cy.get('#UserListForm_Address').type('123 Street');
        cy.get('#UserListForm_City').type('San Jose');
        cy.get('#UserListForm_State').type('CA');
        cy.get('#UserListForm_Country').type('Costa RIca');
        cy.get('#UserListForm_ZipCode').type('94016');
        cy.get('#UserListForm_UserType').select('Admin');
        cy.get('#UserListForm_IsDefaultAdmin').check();
        cy.get('#UserListForm_IsOnline').check();

        // Envía el formulario
        cy.get('#btnSubmit').click();

        // Verifica que se muestre una notificación de error
        cy.contains('The SelectedCompany field is required.').should('be.visible');
    });

    it('Caso de Prueba No. 47: Verificar opción "Items per page" en "User List"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "User List"
        cy.contains('User List').click();
        cy.url().should('include', '/UserList');

        // Lista de opciones a probar
        const itemsPerPageOptions = [10, 20, 50, 100, 200, 'all'];

        // Itera sobre cada opción y verifica el cambio en la lista
        itemsPerPageOptions.forEach(option => {
            cy.contains('Items per page').click();
            cy.contains(option.toString()).click();
            cy.wait(2000); // Espera a que la lista se actualice
            // Verificación: La lista debería mostrar la cantidad de elementos seleccionados o menos, si hay menos datos disponibles
            cy.get('.user-list-item').should('have.length.lte', option === 'all' ? Infinity : option);
        });
    });
});
