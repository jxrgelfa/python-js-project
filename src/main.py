from fastapi import FastAPI, HTTPException, Body, Path, Query
from typing import Annotated
from pydantic import BaseModel, Field
from routers.articulos import articulos_routers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.title = "LIBRERIA"

app.version = "1.0"

app.include_router(articulos_routers, tags=["Libros"], prefix="/libros")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
