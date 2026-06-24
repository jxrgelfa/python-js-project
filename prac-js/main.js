//=============================================
// CONFIGURACION
// ============================================

const API_URL = "http://127.0.0.1:8000/libros/"

//=============================================
// LECTURA 
// ============================================

async function obtenerLibros(){
    try {
        const res = await fetch(API_URL);
        const datos = await res.json();
        document.getElementById('pantalla').innerHTML = JSON.stringify(datos, null, 2);
    } catch (err) {
        console.error("Error al obtener los libros", err);
    }
}


//=============================================
// CREAR
// ============================================


async function crearLibro(nuevoLibro) {
    try{
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nuevoLibro)
        });

        const datos = await respuesta.json();
        console.log("respuesta POST", datos);
        await cargarLibros();
    } catch (error) {
        console.error("Error al crear el libro", error);
    }
}

const formularioCrear = document.getElementById("form-crear");

formularioCrear.addEventListener("submit", (e) => {
    e.preventDefault();

    const datosFormulario = {
        id: parseInt(document.getElementById("id").value),
        nombre: document.getElementById("nombre").value,
        precio: parseFloat(document.getElementById("precio").value),
        activo: document.getElementById("activo").checked
    }

    crearLibro(datosFormulario)

})

//=============================================
// EDITAR || Buscar por ID y modificar existentes
// ============================================

async function editarLibro(nuevoLibro, id) {
    try{
        const respuesta = await fetch(`${API_URL}${id}`,{
         method: "PUT",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(nuevoLibro)
        });

        const datos = await respuesta.json();
        console.log("respuesta PUT: ", datos)
        await cargarLibros();

    }catch (error) {
        console.error("Eror al editar el libro;", error);
    }
}



async function buscarPorId() {
    const id = document.getElementById("buscar-id").value;
    if (!id) {alert("Debe ingresar un ID"); return;
        
    }

    try{
        const respuesta = await fetch(`${API_URL}${id}`);
        const articulo = await respuesta.json();

        document.getElementById("edit-id").value = articulo.id;
        document.getElementById("edit-nombre").value = articulo.nombre;
        document.getElementById("edit-precio").value = articulo.precio;
        document.getElementById("edit-activo").checked = articulo.activo;

    }catch (error){
        console.error("Erro al buscar el libro por ID:", error);
    }
}


const formularioEditar = document.getElementById("form-editar");

formularioEditar.addEventListener("submit", (e) =>{
    e.preventDefault()

    const id = parseInt(document.getElementById("edit-id").value);

    const datosFormulario = {
        nombre: document.getElementById("edit-nombre").value,
        precio: parseFloat(document.getElementById("edit-precio").value),
        activo: document.getElementById("edit-activo").checked,
        imagen: document.getElementById("imagen").value || null
    }

    editarLibro(datosFormulario, id)
})
//-------local storage y render-----// 



//=============================================
// BORRAR | Buscar por ID y borrar
// ============================================



// ============================================================
// FAVORITOS — Gestion con localStorage
// ============================================================


// Devuelve los ID favoritos guardados localmente
function getFavorites(){
    const favs = localStorage.getItem('libros_favs');
    return favs ? JSON.parse(favs) : [];
}


// Agrega/Quita libros de favoritos
function toggleFavorite(libroId){ 
    let favs = getFavorites()
    const idStr = String(libroId)
    if (favs.includes(idStr)){
        favs = favs.filter(id => id !== idStr)
    } else {
        favs.push(idStr)
    }
    localStorage.setItem('libros_favs', JSON.stringify(favs))
}

// Guarda el objeto completo del libro en localStorage
function saveLibroData(libro){
    const todos = getLibrosData()
    todos[String(libro.id)] = libro
    localStorage.setItem('libros_data', JSON.stringify(todos))
}

// Devuelve todo los objetos de libros cacheados
function getLibrosData(){
    const data = localStorage.getItem('libros_data')
    return data ? JSON.parse(data) : {}
}
 
// ============================================================
// RENDER — Mostrar libros como tarjetas en el DOM
// ============================================================



function renderLibros(libros){
    document.getElementById('librosContainer').innerHTML = '';
    if (!libros.length){
        document.getElementById('librosContainer').innerHTML = '<p class = "text-center w-full">No se encontraron libros para mostrar.</p>';
        return;
    }

    libros.forEach(libro => {
        const card = document.createElement('div');
        card.className = 'bg-black p-4 rounded shadow text-center hover:shadow-lg transition';

        let portada = libro.imagen;
        if (!portada || portada === "null" || portada === null || portada.trim() === "") {
            portada = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300"; 
        }
        const titulo = libro.nombre;
        const precio = libro.precio;
        const id = libro.id;

        card.innerHTML = `
            <img src="${portada}" alt="${titulo}" class="w-full h-60 object-cover rounded-md mb-3">
            <h3 class="font-bold text-white mb-2">${titulo}</h3>
            <h5 class="font-bold text-white mb-2">$${precio}</h5>
            <div class="flex justify-center gap-1 mb-2" data-id="${id}">
            </div>

        `;
        document.getElementById('librosContainer').appendChild(card);

    });
    
}

async function cargarLibros(){ // Carga los libros desde la API y lo renderiza
    try {
        const res = await fetch(API_URL);
        const libros = await res.json();
        renderLibros(libros);
    } catch (err) {
        console.error("Error al obtener los libros", err);
    }
}


// ============================================================
// VISTA FAVORITOS — Mostrar solo los libros guardados
// ============================================================

function renderFavoritos(){
    const favIds = getFavorites();
    const todosLosLibros = getLibrosData();

    const librosFav = favIds
        .map(id => todosLosLibros[id])
        .filter(Boolean); // filtra IDs que ya no existen en cache

    renderLibros(librosFav);

    // Resalta visualmente que estamos en la vista de favoritos
    document.getElementById('librosContainer').insertAdjacentHTML(
        'afterbegin',
        `<p class="text-center w-full text-yellow-400 font-bold mb-4">
            ❤️ Mostrando ${librosFav.length} favorito(s) — 
            <button onclick="cargarLibros()" class="underline">Ver todos</button>
        </p>`
    );
}
 
// ============================================================
// INICIALIZACIÓN
// ============================================================

cargarLibros();



    
    
    
