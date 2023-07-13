describe('MoviesList', () => {
  it('renders correctly', () => {
    cy.visit('/')

    // Verifica que el título se muestre correctamente
    cy.get('h1').should('have.text', 'Listado de Películas')

    // Verifica que el botón de búsqueda se muestre correctamente
    cy.get('#select-button').should('have.text', 'NombreAño de publicaciónPuntuación')

    // Verifica que el componente AppCard se muestre correctamente
    cy.get('.card').should('exist')
  })

  it('searches for movies correctly', () => {
    cy.visit('/')

    // Ingresa un título de película en el campo de búsqueda
    cy.get('#title-input').type('The Matrix')

    // Haz clic en el botón de búsqueda
    cy.get('#search-button').click()

    // Verifica que se muestren las películas correctamente
    cy.get('.card').should('exist')
  })

  it('displays an error message if no movies are found', () => {
    cy.visit('/')

    // Ingresa un título de película que no existe en el campo de búsqueda
    cy.get('#title-input').type('asdfghjkl')

    // Haz clic en el botón de búsqueda
    cy.get('#search-button').click()

    // Verifica que se muestre el mensaje de error
    cy.get('#notAvalaible').should('have.text', 'NO RESULTADOS HAY RESULTADOS DISPONIBLES')
  })

  it('displays a loading message while movies are loading', () => {
    cy.visit('/')

    // Ingresa un título de película en el campo de búsqueda
    cy.get('#title-input').type('The Matrix')

    // Haz clic en el botón de búsqueda
    cy.get('#search-button').click()

    // Verifica que se muestre el mensaje de carga
    cy.get('#spinner').should('exist')
  })

  it('updates the URL and check that the data is correct', () => {
    cy.visit('/')

    // Simula una respuesta exitosa al buscar películas
    cy.get('#title-input').type('The Matrix')

    // Haz clic en el botón de búsqueda
    cy.get('#search-button').click()

    // Intercepta la petición GET a /api/movies y devuelve un fixture
    cy.intercept('GET', '/', { fixture: 'movies.json' }).then(() => {
      // Verifica que se muestren las películas correctamente
      cy.get('.card').should('exist')
    })

    // Haz clic en la primera tarjeta de película
    cy.get('.card').first().click()

    // Verifica que la URL haya cambiado y que el movieId se haya guardado en el localStorage
    cy.url().should('include', '/movie')

    cy.intercept('GET', '/movie', { fixture: 'movie.json' }).then(() => {
      cy.get('#movie-title').should('contain', 'The Matrix')
      cy.get('#director-name').should('contain', 'Lilly Wachowski')
      cy.get('#movie-overview').should(
        'contain',
        'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.'
      )
      cy.get('.chip').should('have.length', 2)
      cy.get('.p-carousel-item').should('have.length', 10)
    })
  })
})
