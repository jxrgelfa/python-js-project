from typing import Annotated
from fastapi import HTTPException, Path, Query, APIRouter
from schemas.articulos import LibroSchema, LibroUpdateSchema

articulos_routers = APIRouter()

DICT_NOT_FOUND: dict = {
    404: {
        "description": "Si el artículo no se encuentra en la lista",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Articulo no encontrado"
                }
            }
        }
        }
    }

libros = [
    { "id": 1, "nombre":"El Principito", "precio": 11000, "activo": True, "imagen":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7svZcUJPdEdxpolnznz3owj-Ca1GOYQ6oSprBcmT76i0zLUp1"},
    { "id": 2, "nombre": "Don Quijote de la Mancha", "precio": 27900, "activo": True, "imagen":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiUWBKhZWHc3gDJbICGgoCgXbHHVXkoL199duFHhP4oeXVlzcF"},
    { "id": 3, "nombre": "Cien años de Soledad", "precio": 33500, "activo": True, "imagen":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-LP8BMltFVfBlDhoG_InKMECctld__Ke1JuIGURhjLO5v4YOEMpPszKMI3vX4iOYaREKYKyE71eWCXVgZokbyk3pazoY3__GYhI9UzPIo&s=10"},
    { "id": 4, "nombre": "El señor de los Anillos", "precio": 38200, "activo": True, "imagen":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNjoF3OGTmnFRtlIS6OZzHnpvTO0DMijNOoA&s"},
    { "id": 5, "nombre": "El diario de Ana Frank", "precio": 20000, "activo": True, "imagen": "https://m.media-amazon.com/images/I/71jRTwl-FKL._SL1500_.jpg"},
    { "id": 6, "nombre": "Orgullo y prejuicio", "precio": 23499, "activo": True, "imagen": "https://www.edicontinente.com.ar/image/titulos/9788491051329.jpg"},
    { "id": 7, "nombre": "Moby Dick", "precio": 18500, "activo": True, "imagen": "https://images.cdn2.buscalibre.com/fit-in/360x360/3b/6d/3b6d66ae13be47e5431b4b927c48b148.jpg"},
    { "id": 8, "nombre": "Rayuela", "precio": 28000, "activo": True, "imagen": "https://contentv2.tap-commerce.com/cover/large/9788420437484_1.jpg?id_com=1156"},
    { "id": 9, "nombre": "Cronicas de una muerte anunciada", "precio": 21000, "activo": True, "imagen": "https://www.penguinlibros.com/ar/4264593/cronica-de-una-muerte-anunciada.jpg"},
    { "id": 10, "nombre": "Ugly Love", "precio": 22100, "activo": True, "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicS9cgSp8bBqJE5YuChQ_pt9ZFbw48uhuqQ&s"},
    { "id": 11, "nombre": "Buscando a Nemo", "precio": 12500, "activo": True, "imagen": "https://www.penguinlibros.com/es/3555244-medium_default/buscando-a-nemo-disney-pixar-la-historia-completa.jpg"},
    { "id": 12, "nombre": "El código Da Vinci", "precio": 22500, "activo": True, "imagen":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqZXRoI4jiuVk7PJLyvP26yGKn2nIVWDaNA&s"},
]


##########################
# METODOS GET
##########################

@articulos_routers.get("/", response_model=list[LibroSchema])
async def get_libros():
    articulos_disponibles = []
    for libro in libros:
        if libro["activo"]:
            articulos_disponibles.append(libro)
    return articulos_disponibles

@articulos_routers.get(
        "/{id}",
        responses=DICT_NOT_FOUND,
        response_model=LibroSchema
        ) 
async def get_libros_id(id: Annotated[int, Path(gt=0, description="El ID debe ser mayor a cero")]):
    for libro in libros:
        if libro["id"] == id:
            return libro
    raise HTTPException(status_code=404, detail="Producto no encontrado")



##########################
# METODO POST 
##########################

@articulos_routers.post(
        "/",
        response_model=list[LibroSchema])
async def publicar_libro(nuevo_libro:LibroSchema):
    for libro in libros:
        if libro["id"] == nuevo_libro.id:
            raise HTTPException(status_code=400, detail="Ya existe un libro con ese id")
    libros.append(nuevo_libro.model_dump(mode="json"))
    return libros


##########################
# METODOS PUT
##########################
@articulos_routers.put("/{id}",responses=DICT_NOT_FOUND, response_model=LibroSchema)
async def actualizar_libros(
    id:Annotated[int,Path(gt=0)],
    libro_editar:LibroUpdateSchema
): 
    for libro in libros: 
        if libro["id"] == id:
            libro["nombre"] = libro_editar.nombre
            libro["precio"] = libro_editar.precio
            libro["activo"] = libro_editar.activo
            libro["imagen"] = libro_editar.imagen
            return libro
    raise HTTPException(status_code=404, detail="Libro no encontrado")


##########################
# METODO DELETE
##########################

@articulos_routers.delete(
    "/{id}",
    responses = DICT_NOT_FOUND,
    response_model = LibroSchema,
)
async def eliminar_libro(
    id:Annotated[int,Path(gt=0)],
    logico:Annotated[bool,Query(descrption="Indica si se debe eliminar un libro o no")] = True
) -> LibroSchema: 
    for libro in libros: 
        if libro ["id"] == id:
            if logico: 
                libro ["activo"] = False
            else: 
                libros.remove(libro)
            return libro
    raise HTTPException(status_code=404, detail="Libro no encontrado")