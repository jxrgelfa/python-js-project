from fastapi import FastAPI, HTTPException, Body, Path, Query
from typing import Annotated
from pydantic import BaseModel, Field


app = FastAPI()

app.title = "LIBRERIA"

app.version = "1.0"