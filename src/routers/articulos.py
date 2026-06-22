from typing import Annotated
from fastapi import HTTPException, Path, Query, APIRouter
from schemas.articulos import LibroSchema

articulos_routers = APIRouter()

dict_not_found:dict = {
    404: {
        "description": "Si el artículo no se encuentra en la lista",
        "content": {
            "aplication/json": {
                "example": {
                    "detail": "Articulo no encontrado"
                }
            }
        }
        }
    }

libros = [
    { "id": 1, "nombre":"El Principito", "precio": 11000, "activo": True},
    { "id": 2, "nombre": "Don Quijote de la Mancha", "precio": 27900, "activo": True},
    { "id": 3, "nombre": "Cien años de Soledad", "precio": 33500, "activo": True},
    { "id": 4, "nombre": "El señor de los Anillos", "precio": 38200, "activo": True},
    { "id": 5, "nombre": "El diario de Ana Frank", "precio": 20000, "activo": True},
    { "id": 6, "nombre": "Orgullo y prejuicio", "precio": 23499, "activo": True},
    { "id": 7, "nombre": "Moby Dick", "precio": 18500, "activo": True},
    { "id": 8, "nombre": "Rayuela", "precio": 28000, "activo": True},
    { "id": 9, "nombre": "Cronicas de una muerte anunciada", "precio": 21000, "activo": True},
    { "id": 10, "nombre": "Ugly Love", "precio": 22100, "activo": True},
    { "id": 11, "nombre": "Buscando a Nemo", "precio": 12500, "activo": True},
    { "id": 12, "nombre": "El código Da Vinci", "precio": 22500, "activo": True},
]

@articulos_routers.get("/", response_model=list[LibroSchema])
async def get_articulos():
    articulos_disponibles = []
    for libro in libros:
        if libro["activo"]:
            articulos_disponibles.append(libro)
    return articulos_disponibles

@articulos_routers.get(
        "/{id}",
        responses=dict_not_found,
        response_model=LibroSchema
        ) 
async def get_productos_id(id: Annotated[int, Path(gt=0, description="El ID debe ser mayor a cero")]):
    for libro in libros:
        if libro["id"] == id:
            return libro
    raise HTTPException(status_code=404, detail="Producto no encontrado")

@articulos_routers.post(
        "/libros",
        response_model=list[LibroSchema])
async def publicar_libro(nuevo_libro:LibroSchema):
    libros.append(nuevo_libro.model_dump())
    return libros