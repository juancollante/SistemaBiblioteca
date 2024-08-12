const libros = JSON.parse(localStorage.getItem('libros')) || [
    { title: "Cien Años de Soledad", author: "Gabriel García Márquez", year: 1967, publisher: "Editorial Sudamericana", available: true },
    { title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", year: 1605, publisher: "Francisco de Robles", available: true },
    { title: "El Amor en los Tiempos del Cólera", author: "Gabriel García Márquez", year: 1985, publisher: "Editorial Oveja Negra", available: true },
    { title: "La Sombra del Viento", author: "Carlos Ruiz Zafón", year: 2001, publisher: "Editorial Planeta", available: true },
    { title: "Crónica de una Muerte Anunciada", author: "Gabriel García Márquez", year: 1981, publisher: "Editorial Bruguera", available: true }
];

const loanedBooks = JSON.parse(localStorage.getItem('loanedBooks')) || [];
const returnedBooks = JSON.parse(localStorage.getItem('returnedBooks')) || [];
const reservedBooks = JSON.parse(localStorage.getItem('reservedBooks')) || [];

function buscarLibro() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const results = libros.filter(libro => libro.title.toLowerCase().includes(searchInput));
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = results.length ? results.map(libro => `
        <div>
            <p><strong>Título:</strong> ${libro.title}</p>
            <p><strong>Autor:</strong> ${libro.author}</p>
            <p><strong>Año:</strong> ${libro.year}</p>
            <p><strong>Editorial:</strong> ${libro.publisher}</p>
            <p><strong>Estado:</strong> ${libro.available ? 'Disponible' : 'No Disponible'}</p>
            ${libro.available ? `<button onclick="prestarLibro('${libro.title}')">Prestar libro</button>` : `<button onclick="reservarLibro('${libro.title}')">Reservar libro</button>`}
        </div>
    `).join('') : '<p>No se encontraron libros.</p>';
}

function prestarLibro(libroTitle) {
    const libroIndex = libros.findIndex(l => l.title === libroTitle);
    const libro = libros[libroIndex];
    const loanMessage = document.getElementById('loan-message');

    if (libro && libro.available) {
        const loanDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(loanDate.getDate() + 14);  // 14 días de préstamo

        const newLoan = {
            title: libro.title,
            loanDate: loanDate.toLocaleDateString(),
            returnDate: returnDate.toLocaleDateString()
        };

        loanedBooks.push(newLoan);
        libros[libroIndex].available = false;  // Cambiar el estado a No disponible
        localStorage.setItem('loanedBooks', JSON.stringify(loanedBooks));
        localStorage.setItem('libros', JSON.stringify(libros));

        loanMessage.textContent = `El préstamo del libro "${libro.title}" ha sido exitoso.`;
    } else {
        loanMessage.textContent = `El libro "${libroTitle}" no se encuentra disponible para préstamos.`;
    }
}

function reservarLibro(libroTitle) {
    const libroIndex = libros.findIndex(l => l.title === libroTitle);
    const libro = libros[libroIndex];
    const loanMessage = document.getElementById('loan-message');

    if (libro && !libro.available) {
        reservedBooks.push({
            title: libro.title
        });
        localStorage.setItem('reservedBooks', JSON.stringify(reservedBooks));
        loanMessage.textContent = `El libro "${libro.title}" ha sido reservado.`;
    }
}

function devolverLibro(libroTitle) {
    const libroIndex = libros.findIndex(l => l.title === libroTitle);
    const loanIndex = loanedBooks.findIndex(book => book.title === libroTitle);
    const loanMessage = document.getElementById('loan-message');

    if (libroIndex > -1 && loanIndex > -1) {
        returnedBooks.push(loanedBooks[loanIndex]);
        loanedBooks.splice(loanIndex, 1);
        libros[libroIndex].available = true;  // Cambiar el estado a disponible
        localStorage.setItem('loanedBooks', JSON.stringify(loanedBooks));
        localStorage.setItem('returnedBooks', JSON.stringify(returnedBooks));
        localStorage.setItem('libros', JSON.stringify(libros));

        loanMessage.textContent = `El libro "${libroTitle}" ha sido devuelto.`;
    } else {
        loanMessage.textContent = `El libro "${libroTitle}" no se encuentra en la lista de préstamos.`;
    }
}

function cargarListas() {
    cargarPrestados();
    cargarDevueltos();
    cargarReservados();
}

function cargarPrestados() {
    const loanedList = document.getElementById('loaned-books-list');
    if (loanedList) {
        loanedList.innerHTML = loanedBooks.map(book => `
            <li>
                Título: ${book.title}<br>
                Fecha de Préstamo: ${book.loanDate}<br>
                Fecha de Devolución: ${book.returnDate}<br>
                <button class="return-book-button" data-title="${book.title}">Devolver</button>
            </li>
        `).join('');
        const returnBookButtons = document.querySelectorAll('.return-book-button');
        returnBookButtons.forEach(button => {
            button.addEventListener('click', () => {
                devolverLibro(button.dataset.title);
                cargarPrestados();
            });
        });
    }
}

function cargarDevueltos() {
    const returnedList = document.getElementById('returned-books-list');
    if (returnedList) {
        returnedList.innerHTML = returnedBooks.map(book => `
            <li>
                Título: ${book.title}<br>
                Fecha de Préstamo: ${book.loanDate}<br>
                Fecha de Devolución: ${book.returnDate}
            </li>
        `).join('');
    }
}

function cargarReservados() {
    const reservedList = document.getElementById('reserved-books-list');
    if (reservedList) {
        reservedList.innerHTML = reservedBooks.map(book => `
            <li>
                Título: ${book.title}
            </li>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-input')) {
        document.getElementById('search-button').addEventListener('click', buscarLibro);
    }
    cargarListas();
});

function resetearDatos() {
    localStorage.clear();
    location.reload();
}
