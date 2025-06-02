console.log('🚀 JS realtime.js cargado 1');

const socket = io();
console.log('🚀 JS realtime.js cargado 2');

const form = document.getElementById('product-form');
const list = document.getElementById('product-list');
console.log('form:', document.getElementById('product-form'));


// Enviar nuevo producto
form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.price = Number(data.price);
    data.stock = Number(data.stock);
    socket.emit('createProduct', data);
    form.reset();
});

// Eliminar producto
list.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        socket.emit('deleteProduct', id);
    }
});

// Renderizar productos en tiempo real
socket.on('products', products => {
    list.innerHTML = '';
    products.forEach(p => {
        const row = `
            <tr data-id="${p.id}">
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>$${p.price}</td>
                <td>${p.stock}</td>
                <td><button class="delete-btn" data-id="${p.id}">Eliminar</button></td>
            </tr>`;
        list.innerHTML += row;
    });
});
