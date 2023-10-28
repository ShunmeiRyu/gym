from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from configs.app_config import app_settings


from providers import db_provider
from providers import loguru_provider

@asynccontextmanager
async def lifespan(app: FastAPI):
    await loguru_provider.register()
    await db_provider.register()
    yield


app = FastAPI(
    title=app_settings.NAME,
    version=app_settings.VERSION,
    debug=app_settings.DEBUG,
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    from uvicorn import run
    run(app="main:app", host="0.0.0.0", port=8000, reload=True)