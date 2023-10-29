from typing import Optional
from providers.db_provider import DB
from enums import UserStatus


async def query_user_with_email(
    db: DB,
    /,
    email: str,
) -> Optional[dict]:
    sql = f"""
    SELECT
        id
    FROM
        users
    WHERE
        users.email = '{email}';
    """
    return await db.fetch_one(sql)


async def insert_new_user(
    db: DB,
    /,
    email: str,
    hashed_pwd: str,
):
    sql = f"""
    INSERT INTO USERS (email, hashed_pwd, status)
    VALUES ('{email}', '{hashed_pwd}', '{UserStatus.unverify.value}')
    """
    await db.execute(sql)
