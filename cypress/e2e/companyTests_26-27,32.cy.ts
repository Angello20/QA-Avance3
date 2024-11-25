import 'cypress-xpath';

describe('Pruebas de pagina "Company"', () => {

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

    it('Caso de Prueba No. 26: Exportar Excel de "Company"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();

        // Navega a la pestaña "Company"
        cy.contains('Company').click();
        cy.url().should('include', '/Company');

        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/Company/**').as('excelExport');

        // Simula un clic en el botón de exportación de Excel
        cy.contains('Excel Export').click();

        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);

        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');

    });

    it('Caso de Prueba No. 27: Añadir una nueva compañía en "Company"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Company"
        cy.contains('Company').click();
        cy.url().should('include', '/Company');
    
        // Verifica que el botón "Add" esté visible y habilitado, luego haz clic
        cy.contains('Add').should('be.visible').and('not.be.disabled').click();
    
        // Incrementa el tiempo de espera para verificar la redirección
        cy.url({ timeout: 20000 }).should('include', '/Company/Form');
    
        // Llena los datos correspondientes en los campos
        cy.get('#CompanyForm_Name').type('Empresa01');
        cy.get('#CompanyForm_Currency').select('US$');
        cy.get('#CompanyForm_TimeZone').select('SE Asia Standard Time');
        cy.get('#CompanyForm_Street').type('123 Elm Street');
        cy.get('#CompanyForm_PhoneNumber').type('123-456-7890');
        cy.get('#CompanyForm_EmailAddress').type('empresa01@example.com');
    
        // Envía el formulario
        cy.get('#btnSubmit').click();
    
        // Verifica que se muestre una notificación de éxito
        cy.contains('Success create new data.').should('be.visible');
    });

    it('Caso de Prueba No. 32: Verificar opción "Items per page" en "Company"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Company"
        cy.contains('Company').click();
        cy.url().should('include', '/Company');
    
        // Lista de opciones para "Items per page"
        const itemsPerPageOptions = [10, 20, 50, 100, 200];
    
        // Itera sobre cada opción y verifica el número de elementos mostrados
        itemsPerPageOptions.forEach(option => {
            // Selecciona la opción de "Items per page"
            cy.contains('Items per page').click();
            cy.contains(option.toString()).click();
    
            // Verifica que la solicitud a la API use el parámetro correcto ($top)
            cy.intercept(`/odata/Company/?$count=true&$orderby=CreatedAtUtc%20desc&$top=${option}`).as('getData');
            cy.wait('@getData');
    
            // Verifica que el número de elementos visibles en la tabla no exceda la opción seleccionada
            cy.get('.company-list-item').should('have.length.lte', option);
        });
    
        // Verifica la opción "all"
        cy.contains('Items per page').click();
        cy.contains('all').click();
    
        // Para "all", no limitamos el número de elementos; verificamos que la lista esté cargada
        cy.get('.company-list-item').should('exist');
    }); 
});

