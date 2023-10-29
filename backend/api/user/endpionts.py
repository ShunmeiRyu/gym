from loguru import logger
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from providers.db_provider import get_session, DB
from securities import pwd
from utils import email_sender
from utils import verufy_code
from .schemas import NewUser

from .crud import query_user_with_email
from .crud import insert_new_user


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

        await insert_new_user(
            db,
            email=new_user.email,
            hashed_pwd=(pwd.hash_password(new_user.plan_pwd)),
        )

        new_verufy_code = verufy_code.generate()

        email_sender.send(target_eamil=new_user.email, verify_code=new_verufy_code)

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
