from loguru import logger
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Depends, Header, Body, status, HTTPException
from providers.db_provider import DB, get_session
from configs.auth_config import auth_settings
from typing import Any


def gen_access_token(
    payload: dict, expires_delta: int = auth_settings.ACCESS_TOKEN_EXP_HOURS
) -> str:
    exp = datetime.utcnow() + timedelta(hours=expires_delta)
    return jwt.encode(
        claims={**payload, "exp": exp},
        key=auth_settings.SECRETS_KEY,
        algorithm=auth_settings.ALGORITHM,
        headers={"alg": auth_settings.ALGORITHM, "type": "JWT"},
    )


def get_user_id_with_access_token(authorization: str = Header()):
    try:
        [type_, token] = authorization.split(" ")
        payload = jwt.decode(
            token=token,
            key=auth_settings.SECRETS_KEY,
            algorithms=[auth_settings.ALGORITHM],
        )
        return payload["id"]
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
