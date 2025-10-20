const divFecha = document.getElementById('fecha');
const productosContainer = document.getElementById('productos');

const socket = io();

// Actualizar fecha en tiempo real
socket.on('fecha', (fecha) => {
  divFecha.textContent = new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

// Función para crear elemento de producto
function createProductElement(producto) {
  const li = document.createElement('li');
  li.className = 'product-card';
  li.setAttribute('data-id', producto.id || '');

  li.innerHTML = `
        <h3 class="product-title">${producto.title}</h3>
        <p class="product-description">${producto.description}</p>
        <div class="product-price">
            <span class="price-label">Precio:</span>
            <span class="price-value">$${producto.price}</span>
        </div>
    `;

  return li;
}

// Función para crear estado vacío
function createEmptyState() {
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';
  emptyDiv.innerHTML = `
        <div class="icon">📦</div>
        <h3>No hay productos disponibles</h3>
        <p>Los productos aparecerán aquí en tiempo real</p>
    `;
  return emptyDiv;
}

// Actualizar lista de productos
function updateProductList(productos) {
  productosContainer.innerHTML = '';
  productosContainer.className = 'products-grid';

  if (productos && productos.length > 0) {
    productos.forEach((producto, index) => {
      const productElement = createProductElement(producto);
      productElement.style.animationDelay = `${index * 0.1}s`;
      productosContainer.appendChild(productElement);
    });
  } else {
    productosContainer.appendChild(createEmptyState());
  }
}

// Escuchar actualizaciones de productos
socket.on('productos-actualizados', (productos) => {
  updateProductList(productos);
});

// Agregar efecto de pulso a productos actualizados
socket.on('producto-actualizado', (producto) => {
  const productElement = document.querySelector(`[data-id="${producto.id}"]`);
  if (productElement) {
    productElement.classList.add('updated');
    setTimeout(() => {
      productElement.classList.remove('updated');
    }, 1000);

    // Actualizar el contenido del producto
    const titleElement = productElement.querySelector('.product-title');
    const priceElement = productElement.querySelector('.price-value');

    if (titleElement) titleElement.textContent = producto.title;
    if (priceElement) priceElement.textContent = `$${producto.price}`;
  }
});

// Manejar nuevo producto agregado
socket.on('producto-agregado', (producto) => {
  const productElement = createProductElement(producto);

  // Si la lista está vacía, reemplazar el estado vacío
  const emptyState = productosContainer.querySelector('.empty-state');
  if (emptyState) {
    productosContainer.innerHTML = '';
    productosContainer.className = 'products-grid';
  }

  productElement.style.animationDelay = '0s';
  productosContainer.appendChild(productElement);
});

// Manejar producto eliminado
socket.on('producto-eliminado', (productoId) => {
  const productElement = document.querySelector(`[data-id="${productoId}"]`);
  if (productElement) {
    productElement.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
      productElement.remove();

      // Si no quedan productos, mostrar estado vacío
      if (productosContainer.children.length === 0) {
        productosContainer.appendChild(createEmptyState());
      }
    }, 500);
  }
});

// Agregar animación de fadeOut al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);
