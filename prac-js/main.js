const API_URL = "http://127.0.0.1:8000/libros/"

async function obtenerLibros(){
    try {
        const res = await fetch(API_URL);
        const datos = await res.json();
        document.getElementById('pantalla').innerHTML = JSON.stringify(datos, null, 2);
    } catch (err) {
        console.error("Error al obtener los libros", err);
    }
}


async function crearLibro(nuevoLibro) {
    try{
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(nuevoLibro)
        });

        const datos = await respuesta.json();
        console.log("respuesta POST", datos);
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