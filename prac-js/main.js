const API_URL = "http://127.0.0.1:8000/articulos/"


async function obtenerLibros(){
    try {
        const res = await fetch(API_URL);
        const datos = await res.json();
        document.getElementById('pantalla').innerHTML = JSON.stringify(datos, null, 2);
    } catch (err) {
        console.error("Error al obtener los libros", err);
    }
}