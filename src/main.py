from fastapi import FastAPI, HTTPException, Body, Path, Query
from typing import Annotated
from pydantic import BaseModel, Field
from routers.articulos import articulos_routers


app = FastAPI()

app.title = "LIBRERIA"

app.version = "1.0"

app.include_router(articulos_routers, tags=["Articulos"], prefix="/articulos")