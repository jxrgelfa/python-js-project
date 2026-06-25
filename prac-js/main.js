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
        activo: document.getElementById("activo").checked,
        imagen: document.getElementById('imagen').value
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
        console.log("respuesta PUT: ", datos);
        if (respuesta.ok) {
            saveLibroData({id: id, ...nuevoLibro});
        }

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
        imagen: document.getElementById("edit-imagen").value || null
    }

    editarLibro(datosFormulario, id)
})


//=============================================
// BORRAR | Buscar por ID y borrar
// ============================================

async function borrarLibro(id) { 
    try {
        const respuesta = await fetch(`${API_URL}${id}?logico=false`,{
        method: "DELETE"
        });

        if (respuesta.ok){
            const datos = await respuesta.json();
            console.log("Libro eliminado en la PI:", datos);
            alert(`Articulo con ID ${id} eliminado con exito`);


            const idStr = String(id);

            const todos = getLibrosData();
            if(todos[idStr]) {
                delete todos [idStr];
                localStorage.setItem('libros_data', JSON.stringify(todos));
            }

            let favs = getFavorites();
            if (favs.includes(idStr)){
                favs=favs.filter(favId => favId !== idStr);
                localStorage.setItem('libros_favs', JSON/stringify(favs));
            }

            await cargarLibros();
            await obtenerLibros();
        }else{
            alert("No se pudo eliminar el libro. Verifiqeu el ID");
        }
    }catch (error) {
        console.error("Eror al borrar el libro:", error);
    }
}

async function borrarDesdeBusqueda() {
    const id = parseInt(document.getElementById("buscar-id").value);
    if (!id){ 
        alert("Debe ingresar un ID en el buscador para eliminar"); 
        return;   
    }

    const confirmar = confirm(`¿Estas seguro que desea eliminar el libro con ID ${id}?`)
    if (confirmar){
        await borrarLibro(id);
    }
}

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

    // Actualizacion del icono
    const btn = document.querySelector(`[data-fav-id="${idStr}"]`)
    if (btn) {
        const isFavorite = favs.includes(idStr)
        btn.className = `fav-btn absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-lg transition-all duration-300 border focus:outline-none ${isFavorite 
            ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-lg' 
            : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'}`
        btn.querySelector('svg').setAttribute('fill', isFavorite ? 'currentColor' : 'none')

        // Actualiza en tiempo real los libros "favoritos"
        const enVistaFavs = document.querySelector('#librosContainer .fav-banner');
        if (enVistaFavs && !isFavorite) {
            btn.closest('.relative').remove();
            const restantes = document.querySelectorAll('#librosContainer .relative').length;
            enVistaFavs.firstChild.textContent = `❤️ Mostrando ${restantes} favorito(s) — `;
  
        }
    }
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

    const favs = getFavorites();

    libros.forEach(libro => {
    saveLibroData(libro);

    const isFavorite = favs.includes(String(libro.id));
    const card = document.createElement('div');
    card.className = 'relative bg-black p-4 rounded shadow text-center hover:shadow-lg transition'; // 👈 relative acá

    let portada = libro.imagen;
    if (!portada || portada === "null" || portada === null || portada.trim() === "") {
        portada = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300"; 
    }

    const titulo = libro.nombre;
    const precio = libro.precio;
    const id = libro.id;

    // Como luce la carta entera 
    // SVG de icono de corazon
    card.innerHTML = `
        <img src="${portada}" alt="${titulo}" class="w-full h-60 object-cover rounded-md mb-3">
        <button
            data-fav-id="${id}"
            class="fav-btn absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-lg transition-all duration-300 border focus:outline-none ${isFavorite 
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-lg' 
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'}"
        >   
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 16 16">
                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
            </svg>
        </button>
        <h3 class="font-bold text-white mb-2">${titulo}</h3>
        <h5 class="font-bold text-white mb-2">$${precio}</h5>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.closest('[data-fav-id]')) return;
        card.classList.toggle('ring-2');
        card.classList.toggle('ring-white');
    });

    card.querySelector('[data-fav-id]').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(id);
    });

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
        `<p class="fav-banner text-center w-full text-yellow-400 font-bold mb-4">
            ❤️ Mostrando ${librosFav.length} favorito(s) — 
            <button onclick="cargarLibros()" class="underline">Ver todos</button>
        </p>`
    );
}
 
// ============================================================
// INICIALIZACIÓN
// ============================================================

cargarLibros();


// Trae solamente los libros favoritos
const btnFavoritos = document.getElementById('btn-favoritos');
if (btnFavoritos) {
    btnFavoritos.addEventListener('click', renderFavoritos);
}

    
    
    
