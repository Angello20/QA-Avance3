import 'cypress-xpath';

describe('Pruebas de pagina "Sequence"', () => {

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

    it('Caso de Prueba No. 48: Exportar Excel de "Sequence"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Sequence"
        cy.contains('Sequence').click();
        cy.url({ timeout: 10000 }).should('include', '/NumberSequences/NumberSequenceList');
    
        // Intercepta la solicitud de exportación
        cy.intercept('POST', '/odata/NumberSequence/**').as('excelExport');
    
        // Simula un clic en el botón de exportación de Excel
        cy.contains('Excel Export').click();
    
        // Espera a que se complete la solicitud de exportación
        cy.wait(4000);
    
        const downloadsFolder = Cypress.config('downloadsFolder'); 
        cy.readFile(`${downloadsFolder}/Export.xlsx`).should('exist');
    });
    
    it('Caso de Prueba No. 49: Verificar opción "Items per page" en "Sequence"', () => {
        // Navega a la pestaña "Settings"
        cy.contains('Settings').click();
    
        // Navega a la pestaña "Sequence"
        cy.contains('Sequence').click();
        cy.url({ timeout: 10000 }).should('include', '/NumberSequences/NumberSequenceList');
    
        // Lista de opciones a probar
        const itemsPerPageOptions = [10, 20, 50, 100, 200, 'all'];
    
        // Itera sobre cada opción y verifica el cambio en la lista
        itemsPerPageOptions.forEach(option => {
            cy.contains('Items per page').click({ force: true });
            cy.contains(option.toString()).click({ force: true });
            cy.wait(2000);
    
            // Verificación: La lista debería mostrar la cantidad de elementos seleccionados o menos
            cy.get('.sequence-list-item').should('have.length.lte', option === 'all' ? Infinity : option);
        });
    });
    
});
