
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const productos = JSON.parse(fs.readFileSync('./data/productos.json'));
const usuarios = JSON.parse(fs.readFileSync('./data/usuarios.json'));
const ventas = JSON.parse(fs.readFileSync('./data/ventas.json'));

app.get('/productos', (req, res) => res.json(productos));
app.get('/productos/:id', (req, res) => {
  const prod = productos.find(p => p.id == req.params.id);
  res.json(prod || {});
});
app.post('/productos', (req, res) => {
  productos.push(req.body);
  res.status(201).json(req.body);
});
app.put('/productos/:id', (req, res) => {
  const index = productos.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...req.body };
    res.json(productos[index]);
  } else res.status(404).send("Producto no encontrado");
});
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (ventas.some(v => v.productos.some(p => p.id === id))) {
    return res.status(400).send("El producto está en una venta y no puede eliminarse.");
  }
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    const eliminado = productos.splice(index, 1);
    res.json(eliminado);
  } else res.status(404).send("Producto no encontrado");
});
app.get('/usuarios', (req, res) => res.json(usuarios));
app.post('/usuarios', (req, res) => {
  usuarios.push(req.body);
  res.status(201).json(req.body);
});
app.get('/ventas', (req, res) => res.json(ventas));
app.post('/ventas', (req, res) => {
  ventas.push(req.body);
  res.status(201).json(req.body);
});
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
