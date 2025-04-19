from fastapi import FastAPI
from dotenv import load_dotenv
from backend.routers.user.router import router as user_router
from typing import Dict

load_dotenv()

app = FastAPI()
app.include_router(user_router)

@app.get("/")       # type: ignore
async def read_root() -> Dict[str, str]:
    return {"hello": "world"}

