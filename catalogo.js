const libros = JSON.parse(localStorage.getItem('libros')) || [
    { title: "Cien Años de Soledad", author: "Gabriel García Márquez", year: 1967, publisher: "Editorial Sudamericana", available: true },
    { title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", year: 1605, publisher: "Francisco de Robles", available: true },
    { title: "El Amor en los Tiempos del Cólera", author: "Gabriel García Márquez", year: 1985, publisher: "Editorial Oveja Negra", available: true },
    { title: "La Sombra del Viento", author: "Carlos Ruiz Zafón", year: 2001, publisher: "Editorial Planeta", available: true },
    { title: "Crónica de una Muerte Anunciada", author: "Gabriel García Márquez", year: 1981, publisher: "Editorial Bruguera", available: true }
];

function cargarLibros() {
    const catalogueList = document.getElementById('catalogue-list');
    if (catalogueList) {
        catalogueList.innerHTML = libros.map(libro => `
            <li>
                Título: ${libro.title}<br>
                Autor: ${libro.author}<br>
                Año: ${libro.year}<br>
                Editorial: ${libro.publisher}<br>
                Estado: ${libro.available ? 'Disponible' : 'No Disponible'}<br>
                <button onclick="eliminarLibro('${libro.title}')">Eliminar</button>
            </li>
        `).join('');
    }
}

function agregarLibro(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const publisher = document.getElementById('publisher').value;

    const newBook = {
        title,
        author,
        year: parseInt(year),
        publisher,
        available: true
    };

    libros.push(newBook);
    localStorage.setItem('libros', JSON.stringify(libros));
    cargarLibros();
    document.getElementById('add-book-form').reset();
}

function eliminarLibro(libroTitle) {
    const libroIndex = libros.findIndex(l => l.title === libroTitle);
    if (libroIndex > -1) {
        libros.splice(libroIndex, 1);
        localStorage.setItem('libros', JSON.stringify(libros));
        cargarLibros();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('catalogue-list')) {
        cargarLibros();
    }
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', agregarLibro);
    }
});
