let productos = [];
let carrito = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://localhost:3000/productos");
  productos = await res.json();
  mostrarProductos(productos);

  const filtro = document.getElementById("filtro");
  filtro.addEventListener("input", () => {
    const texto = filtro.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
  });

  const almacenado = localStorage.getItem("carrito");
  if (almacenado) {
    carrito = JSON.parse(almacenado);
    renderizarCarrito();
  }
});

function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.desc}</p>
      <p><strong>$${p.precio}</strong></p>
      <button class="btn" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

function renderizarCarrito() {
  const ul = document.getElementById("carrito");
  ul.innerHTML = "";
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad}`;
    ul.appendChild(li);
  });
}

async function realizarCompra() {
  const venta = {
    id_usuario: 1,
    fecha: new Date().toISOString().split("T")[0],
    direccion: "Dirección de prueba",
    total: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    productos: carrito.map(p => ({ id: p.id, cantidad: p.cantidad }))
  };

  const res = await fetch("http://localhost:3000/ventas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta)
  });

  if (res.ok) {
    alert("Compra realizada con éxito!");
    carrito = [];
    localStorage.removeItem("carrito");
    renderizarCarrito();
  } else {
    alert("Hubo un error al procesar la compra.");
  }
}