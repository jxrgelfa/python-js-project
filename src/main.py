from fastapi import FastAPI, HTTPException, Body, Path, Query
from typing import Annotated
from pydantic import BaseModel, Field
from routers.articulos import articulos_router


app = FastAPI()

app.title = "LIBRERIA"

app.version = "1.0"

app.include_router(articulos_router, tags=["Articulos"], prefix="/articulos")