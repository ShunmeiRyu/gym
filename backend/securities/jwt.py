from loguru import logger
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Depends, Header, Body, status, HTTPException
from providers.db_provider import DB, get_session
from config.auth import auth_settings
from typing import Any
from app.crud import users as UsersCrud


def gen_access_token(
        payload: dict, expires_delta: int = auth_settings.ACCESS_TOKEN_EXP_HOURS
) -> str:
    # TODO
    # exp = datetime.utcnow()+timedelta(hours=expires_delta)
    exp = datetime.utcnow()+timedelta(seconds=expires_delta)
    return jwt.encode(
        claims={**payload, "exp": exp},
        key=auth_settings.SECRETS_KEY,
        algorithm=auth_settings.ALGORITHM,
        headers={"alg": auth_settings.ALGORITHM, "type": "JWT"}
    )


####


def gen_refresh_token(
        payload: dict, access_token: str, expire: Any = None
) -> str:
    # TODO
    exp = (expire
           if expire is not None
           else datetime.utcnow()+timedelta(hours=auth_settings.REFRESH_TOKEN_EXP_HOURS))
    return jwt.encode(
        claims={**payload, "exp": exp},
        key=auth_settings.SECRETS_KEY,
        headers={"alg": auth_settings.ALGORITHM, "type": "JWT"},
        algorithm=auth_settings.ALGORITHM,
        access_token=access_token,
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


async def get_payload_with_refresh_token(bdy_data: dict = Body(), db: DB = Depends(get_session)):
    try:
        refresh_token = bdy_data["refresh_token"]
        refresh_payload_unverified = jwt.get_unverified_claims(
            refresh_token)
        access_token = await UsersCrud.query_access_token(
            db, id=refresh_payload_unverified["id"])
        refresh_payload = jwt.decode(
            token=refresh_token,
            key=auth_settings.SECRETS_KEY,
            algorithms=[auth_settings.ALGORITHM],
            access_token=str(access_token),
        )
        return refresh_payload
    except Exception as e:
        logger.exception(e)
        # print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
