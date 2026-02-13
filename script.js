const productos = [
{nombre:"Soberna Botella",precio:12.00,categoria:"cerveza",img:"img/cervesas/soberana.jpeg",desc:"Caja de 24 unidades de botella."},
{nombre:"Panama Ligth Botella",precio:13.50,categoria:"cerveza",img:"img/cervesas/panama-lithe.png",desc:"Caja de 24 unidades de botella."},
{nombre:"Atlas Manga Larga",precio:18.00,categoria:"cerveza",img:"img/cervesas/atlas.png",desc:"Caja de 24 unidades de botella"},
{nombre:"Bolboa roja Botellla",precio:16.00,categoria:"cerveza",img:"img/cervesas/balboa.png",desc:"Caja de 24 unidades de botella."},
{nombre:"Cristal Botella",precio:14.00,categoria:"cerveza",img:"img/cervesas/cristal.jpeg",desc:"Caja de 24 unidades de botella."},
{nombre:"Botella de Ron Abuelo",precio:10.00,categoria:"licor",img:"img/licores/botellea-ron.png",desc:"Botella de 750ml de ron abuelo."},
{nombre:"Botella de Seco",precio:7.50,categoria:"licor",img:"img/licores/seco.jpg",desc:"Botella de 750ml de Seco Herrerano."},
{nombre:"Antioqueño tapa Azul",precio:14.00,categoria:"licor",img:"img/licores/aguardiente.webp",desc:"Botella de 750ml de aguadiente antioqueño."},
{nombre:"Botella de Old Parr",precio:22.00,categoria:"licor",img:"img/licores/oldparr.jpg",desc:"Botella de 750ml de Old Parr."},
{nombre:"Botella de Vodka Smirnoff",precio:12.00,categoria:"licor",img:"img/licores/smirnoff.webp",desc:"Botella Vodka Smirnoff de 750ml."},
{nombre:"Six pack Coors Lata",precio:4.50,categoria:"cerveza",img:"img/cervesas/coors.webp",desc:" 6 unidades de lata de 355ml."},
{nombre:"Six pack de Corona",precio:7.50,categoria:"cerveza",img:"img/cervesas/corona.png",desc:" 6 unidades de lata de 355ml."},
{nombre:"Smirnoff Manzana",precio:7.50,categoria:"cerveza",img:"img/cervesas/monzana.webp",desc:" 6 unidades de lata de 355ml."},
{nombre:"1/4 de seco",precio:2.75,categoria:"licor",img:"img/licores/seco.jpg",desc:"Cuarto de seco Herrerano 250ml."},
{nombre:"1/2 de Ron Abuelo",precio:5.50,categoria:"licor",img:"img/licores/botellea-ron.png",desc:"Media de ron abuelo de 350ml."},

];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let ubicacionCliente = "";
let cantidades = new Array(productos.length).fill(1);

/* TOAST */
function mostrarToast(){
let t = document.getElementById("toast");
t.style.display="block";
setTimeout(()=> t.style.display="none",1500);
}

/* PRODUCTOS */
function mostrarProductos(lista){

const cont = document.getElementById("productos");
cont.innerHTML="";

lista.forEach((p)=>{

let i = productos.findIndex(prod=>prod.nombre===p.nombre);

cont.innerHTML+=`
<div class="card">
<img src="${p.img}">
<h3>${p.nombre}</h3>
<p>${p.desc}</p>
<p>$${p.precio}</p>

<div class="cantidad">
<button class="btmas-meno" onclick="cambiarCantidad(${i},-1)">➖</button>
<span id="cant-${i}">${cantidades[i]}</span>
<button  class="btmas-meno" onclick="cambiarCantidad(${i},1)">➕</button>
</div>

<button class="btAgregar" onclick="agregar(${i})">Agregar</button>
</div>
`;
});
}

function cambiarCantidad(i,v){
cantidades[i]+=v;
if(cantidades[i]<1) cantidades[i]=1;
document.getElementById("cant-"+i).innerText=cantidades[i];
}

function agregar(i){

let p = productos[i];
let cant = cantidades[i];

let ex = carrito.find(x=>x.nombre===p.nombre);

if(ex){
ex.cantidad+=cant;
}else{
carrito.push({...p,cantidad:cant});
}

cantidades[i]=1;
guardar();
mostrarCarrito();
mostrarProductos(productos);
mostrarToast();
}

function guardar(){
localStorage.setItem("carrito",JSON.stringify(carrito));
}

function eliminarProducto(index){
carrito.splice(index,1);
guardar();
mostrarCarrito();
}

function cambiarCarrito(index,v){

carrito[index].cantidad+=v;

if(carrito[index].cantidad<=0){
carrito.splice(index,1);
}

guardar();
mostrarCarrito();
}

function filtrar(cat){
let lista = productos.filter(p=>p.categoria===cat);
mostrarProductos(lista);
}

function buscarProducto(){

let texto = document.getElementById("buscador").value.toLowerCase();

let filtrados = productos.filter(p =>
p.nombre.toLowerCase().includes(texto)
);

mostrarProductos(filtrados);

}


mostrarProductos(productos);

/* MODAL */
function abrirCarrito(){
document.getElementById("modalCarrito").style.display="flex";
mostrarCarrito();
}

function cerrarCarrito(){
document.getElementById("modalCarrito").style.display="none";
}

function cerrarFuera(e){
if(e.target.id==="modalCarrito"){
cerrarCarrito();
}
}

/* MOSTRAR CARRITO */
function mostrarCarrito(){

let div=document.getElementById("listaCarrito");
div.innerHTML="";

let envio=parseFloat(document.getElementById("envio").value||0);
let subtotal=0;

carrito.forEach((p,index)=>{

subtotal+=p.precio*p.cantidad;

div.innerHTML+=`
<p>
${p.nombre}
<button class="btmasMenos-pantalla" onclick="cambiarCarrito(${index},-1)">➖</button>
${p.cantidad}
<button class="btmasMenos-pantalla" onclick="cambiarCarrito(${index},1)">➕</button>
= $${(p.precio*p.cantidad).toFixed(2)}
<button class="bt-eliminar" onclick="eliminarProducto(${index})">🗑️</button>
</p>
`;
});

let total=subtotal+envio;

document.getElementById("btnEnviar").innerText=
`Enviar WhatsApp $${total.toFixed(2)}`;
}

/* UBICACION */
function obtenerUbicacion(){

navigator.geolocation.getCurrentPosition(
pos=>{
let lat=pos.coords.latitude;
let lon=pos.coords.longitude;
ubicacionCliente=`https://maps.google.com/?q=${lat},${lon}`;
alert("Ubicación capturada");
},
()=> alert("Debes permitir el GPS")
);
}

/* WHATSAPP */
function enviarPedido(){

if(carrito.length===0){
alert("Carrito vacío");
return;
}

if(ubicacionCliente===""){
alert("Captura la ubicación primero");
return;
}

let nombre=document.getElementById("nombre").value;
let tel=document.getElementById("telefono").value;
let envio=parseFloat(document.getElementById("envio").value);
let ubicacion=parseFloat(document.getElementById("ubicasion-des").value);
let pago=document.getElementById("pago").value;

let mensaje="🛒 NUEVO PEDIDO\n\n";

mensaje+=`Cliente: ${nombre}\n`;
mensaje+=`Teléfono: ${tel}\n`;
mensaje+=`Ubicación: ${ubicacionCliente}\n\n`;
mensaje+=`Ubicación: ${ubicacion}\n\n`;

mensaje+="Productos:\n";

let subtotal=0;

carrito.forEach(p=>{
mensaje+=`${p.nombre} x${p.cantidad} = $${(p.precio*p.cantidad).toFixed(2)}\n`;
subtotal+=p.precio*p.cantidad;
});

let total=subtotal+envio;

mensaje+=`\nEnvío: $${envio}`;
mensaje+=`\nPago: ${pago}`;
mensaje+=`\nTotal: $${total.toFixed(2)}`;

let url=`https://wa.me/50762980868?text=${encodeURIComponent(mensaje)}`;
window.open(url);
}
