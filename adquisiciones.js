const newAcquisitions = JSON.parse(localStorage.getItem('newAcquisitions')) || [];

function agregarAdquisicion(event) {
    event.preventDefault();
    const title = document.getElementById('acquisition-title').value;
    const author = document.getElementById('acquisition-author').value;
    const year = document.getElementById('acquisition-year').value;
    const publisher = document.getElementById('acquisition-publisher').value;

    const newAcquisition = {
        title,
        author,
        year: parseInt(year),
        publisher,
        status: 'pendiente por enviar',
        rejectionReason: ''
    };

    newAcquisitions.push(newAcquisition);
    localStorage.setItem('newAcquisitions', JSON.stringify(newAcquisitions));
    cargarAdquisiciones();
    document.getElementById('add-acquisition-form').reset();
}

function cargarAdquisiciones() {
    const acquisitionsList = document.getElementById('new-acquisitions-list');
    if (acquisitionsList) {
        acquisitionsList.innerHTML = newAcquisitions.map(acquisition => `
            <li>
                Título: ${acquisition.title}<br>
                Autor: ${acquisition.author}<br>
                Año: ${acquisition.year}<br>
                Editorial: ${acquisition.publisher}<br>
                Estado: ${acquisition.status}<br>
                ${acquisition.status === 'rechazado' ? `Razón de rechazo: ${acquisition.rejectionReason}` : ''}
                ${acquisition.status !== 'rechazado' ? `
                    <select onchange="actualizarEstado('${acquisition.title}', this.value)">
                        <option value="pendiente por enviar" ${acquisition.status === 'pendiente por enviar' ? 'selected' : ''}>Pendiente por enviar</option>
                        <option value="en camino" ${acquisition.status === 'en camino' ? 'selected' : ''}>En camino</option>
                        <option value="en proceso de inventario" ${acquisition.status === 'en proceso de inventario' ? 'selected' : ''}>En proceso de inventario</option>
                        <option value="en catalogo" ${acquisition.status === 'en catalogo' ? 'selected' : ''}>En catálogo</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                ` : ''}
                ${acquisition.status === 'rechazado' ? `
                    <input type="text" placeholder="Razón de rechazo" onchange="actualizarRazonRechazo('${acquisition.title}', this.value)" value="${acquisition.rejectionReason}">
                ` : ''}
            </li>
        `).join('');
    }
}

function actualizarEstado(title, newState) {
    const acquisitionIndex = newAcquisitions.findIndex(a => a.title === title);
    if (acquisitionIndex > -1) {
        newAcquisitions[acquisitionIndex].status = newState;
        localStorage.setItem('newAcquisitions', JSON.stringify(newAcquisitions));
        cargarAdquisiciones();
    }
}

function actualizarRazonRechazo(title, reason) {
    const acquisitionIndex = newAcquisitions.findIndex(a => a.title === title);
    if (acquisitionIndex > -1) {
        newAcquisitions[acquisitionIndex].rejectionReason = reason;
        localStorage.setItem('newAcquisitions', JSON.stringify(newAcquisitions));
        cargarAdquisiciones();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('add-acquisition-form')) {
        document.getElementById('add-acquisition-form').addEventListener('submit', agregarAdquisicion);
    }
    cargarAdquisiciones();
});
