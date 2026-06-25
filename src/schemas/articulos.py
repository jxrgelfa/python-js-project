from pydantic import BaseModel, Field
from typing import Annotated

INT_ID = Annotated[int, Field(gt=0)]
STR_NOMBRE = Annotated[str, Field(min_length=1)]
INT_PV = Annotated[float, Field(gt=0, lt=9999999)]
BOOL_ACTIVO = Annotated [bool, Field(description="Sigue disponible?", deprecated=True)]
IMG_PRODUCTO = Annotated[str | None, Field(default=None, description="URL de la imagen del libro")]


class LibroSchema(BaseModel):
    id: INT_ID
    nombre: STR_NOMBRE
    precio: INT_PV
    activo: BOOL_ACTIVO = True
    imagen: IMG_PRODUCTO = None

class LibroUpdateSchema(BaseModel):
    nombre: STR_NOMBRE
    precio: INT_PV
    activo: BOOL_ACTIVO = True
    imagen: IMG_PRODUCTO = None