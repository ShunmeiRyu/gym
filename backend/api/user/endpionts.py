from loguru import logger
from datetime import datetime
from fastapi import APIRouter, Depends, status
from fastapi import BackgroundTasks
from fastapi.responses import JSONResponse
from providers.db_provider import get_session, DB
from securities import pwd
from utils import email_sender
from utils import verify_code
from .schemas import NewUser
from .schemas import VerifyData

from .crud import query_user_with_email
from .crud import insert_new_user
from .crud import insert_verify_code
from .crud import query_verify_code_created_at

auth_router = APIRouter()


@auth_router.post("/user")
async def register(new_user: NewUser, db: DB = Depends(get_session)):
    try:
        db_user = await query_user_with_email(db, email=new_user.email)

        if db_user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "email is exist"},
            )

        new_db_user = await insert_new_user(
            db,
            email=new_user.email,
            hashed_pwd=(pwd.hash_password(new_user.plan_pwd)),
        )

        new_verify_code = verify_code.generate()

        email_sender.send(target_eamil=new_user.email, verify_code=new_verify_code)

        await insert_verify_code(db, user_id=new_db_user["id"], verify_code=new_verify_code)

        return JSONResponse(
            status_code=status.HTTP_200_OK, content={"message": "successful created"}
        )

    except Exception as e:
        logger.exception(e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "message": "An unknown exception occurred, please try again later."
            },
        )


@auth_router.post("/verify_email")
async def verify_email(verify_data: VerifyData, db: DB = Depends(get_session)):
    try:
        db_user = await query_user_with_email(db, email=verify_data.email)
        if db_user is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "email is not exist"},
            )
        created_at = await query_verify_code_created_at(
            db, user_id=db_user["id"], verify_code=verify_data.code
        )
        if created_at is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "verify_code is not exist"},
            )

        if (datetime.now() - created_at).seconds > 60:
            return JSONResponse(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                content={"message": "verify_code is timeout"},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "verify_code is ok"},
        )
    except Exception as e:
        logger.exception(e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "message": "An unknown exception occurred, please try again later."
            },
        )
