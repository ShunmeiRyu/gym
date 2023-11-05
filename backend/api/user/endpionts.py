from loguru import logger
from datetime import datetime
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from providers.db_provider import get_session, DB
from securities import pwd
from securities import jwt
from utils import email_sender
from utils import verify_code
from .schemas import AuthUser
from .schemas import BasicUser
from .schemas import VerifyData
from .schemas import PasswordVerify

from .crud import query_user_with_email
from .crud import insert_new_user
from .crud import insert_verify_code
from .crud import query_verify_code_created_at
from .crud import inster_access_token
from .crud import update_user_pwd
from .crud import update_user_status


auth_router = APIRouter()


@auth_router.post("/user")
async def register(new_user: AuthUser, db: DB = Depends(get_session)):
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

        await insert_verify_code(
            db, user_id=new_db_user["id"], verify_code=new_verify_code
        )

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
        await update_user_status(db,email=verify_data.email)

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


@auth_router.post("/token")
async def auth_with_pwd(auth_user: AuthUser, db: DB = Depends(get_session)):
    try:
        db_user = await query_user_with_email(db, email=auth_user.email)
        if not db_user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "email is not exit"},
            )
        if not pwd.verify_password(auth_user.plan_pwd, db_user["hashed_pwd"]):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "password is invalid"},
            )
        access_token = jwt.gen_access_token(
            {k: v for k, v in db_user.items() if k != "hashed_pwd"}
        )

        await inster_access_token(db, user_id=db_user["id"], access_token=access_token)

        return JSONResponse(
            status_code=status.HTTP_200_OK, content={"access_token": access_token}
        )
    except Exception as e:
        logger.exception(e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "message": "An unknown exception occurred, please try again later."
            },
        )

@auth_router.post("/forgot_password")
async def forgot_password(user_email:BasicUser, db: DB = Depends(get_session)):
    try:
        db_user=await query_user_with_email(db, email=user_email.email)
        if db_user is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "email is not exist"},
            )
        new_verify_code = verify_code.generate()

        email_sender.send(target_eamil=user_email.email, verify_code=new_verify_code)
        await insert_verify_code(
            db, user_id=db_user["id"], verify_code=new_verify_code
        )

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
    

@auth_router.post("/password_verify_email")
async def password_verify_email(password_verify_email: PasswordVerify, db: DB = Depends(get_session)):
    try:
        db_user = await query_user_with_email(db, email=password_verify_email.email)
        if db_user is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "email is not exist"},
            )
        created_at = await query_verify_code_created_at(
            db, user_id=db_user["id"], verify_code=password_verify_email.code
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

        await update_user_pwd(db,email=password_verify_email.email,hashed_pwd=(pwd.hash_password(password_verify_email.password)))
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
    

@auth_router.post("/register_resend_code")
async def register_resend_code(user_email: BasicUser, db: DB = Depends(get_session)):
    try:
        new_verify_code = verify_code.generate()
        register_user_id=await query_user_with_email(db,email=user_email.email)
        email_sender.send(target_eamil=user_email.email, verify_code=new_verify_code)

        await insert_verify_code(
            db, user_id=register_user_id["id"], verify_code=new_verify_code
        )
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
        