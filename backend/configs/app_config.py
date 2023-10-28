from os import path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_prefix="APP_", strict=False, env_file_encoding="utf8"
    )
    NAME: str
    VERSION: str
    DEBUG: bool
    ENV: str
    LOG_LEVEL: str
    LOG_PATH: str = (
        path.dirname(path.dirname((path.abspath(__file__))))
        + "/logs/fastapi-{time:YYYY-MM-DD}.log"
    )
    LOG_RETENTION: str

app_settings = Settings()