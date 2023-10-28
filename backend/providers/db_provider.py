import asyncpg
from fastapi.encoders import jsonable_encoder
from typing import List, Any
from configs.db_config import db_settings
from configs.app_config import app_settings
from loguru import logger

class DB:
    def __init__(self) -> None:
        self._connection_pool = None

    async def connect(self) -> None:
        if self._connection_pool is None:
            self._connection_pool = await asyncpg.create_pool(
                dsn=db_settings.DSN, min_size=1, max_size=10, command_timeout=60
            )

    async def fetch_one(self, query: str) -> dict:
        if self._connection_pool is None:
            await self.connect()
        async with self._connection_pool.acquire() as con:
            if app_settings.DEBUG:
                logger.info(query)
            result = await con.fetchrow(query)
            return jsonable_encoder(result)

    async def fetch_all(self, query: str) -> List:
        if self._connection_pool is None:
            await self.connect()
        async with self._connection_pool.acquire() as con:
            if app_settings.DEBUG:
                logger.info(query)
            result = await con.fetch(query)
            return jsonable_encoder(result)

    async def fetch_value(self, query: str) -> Any:
        if self._connection_pool is None:
            await self.connect()
        async with self._connection_pool.acquire() as con:
            if app_settings.DEBUG:
                logger.info(query)
            result = await con.fetchval(query)
            return result

    async def execute(self, query: str) -> None:
        if self._connection_pool is None:
            await self.connect()
        async with self._connection_pool.acquire() as con:
            if app_settings.DEBUG:
                logger.info(query)
            await con.execute(query)

db = DB()


async def register():
    await db.connect()


def get_session() -> DB:
    return db