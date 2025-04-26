from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.routers.user.router import router as user_router
from typing import Dict
import os

load_dotenv()

app = FastAPI()

origins = [
    os.environ.get("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)

@app.get("/")       # type: ignore
async def read_root() -> Dict[str, str]:
    return {"hello": "world"}

