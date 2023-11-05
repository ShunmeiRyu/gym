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
        id,
        hashed_pwd
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
    RETURNING id
    """
    return await db.fetch_one(sql)


async def insert_verify_code(db: DB, /, user_id: str, verify_code: str):
    sql = f"""
    INSERT INTO VERIFY_CODES (user_id, verify_code)
    VALUES ('{user_id}', '{verify_code}')
    """

    await db.execute(sql)


async def query_verify_code_created_at(db: DB, /, user_id: str, verify_code: str):
    sql = f"""
    SELECT
        created_at
    FROM
        VERIFY_CODES
    WHERE
        user_id = '{user_id}'
        AND
        verify_code = '{verify_code}';
    """

    return await db.fetch_value(sql)


async def inster_access_token(
        db: DB, /, user_id: str, access_token: str
) -> None:
    sql = f'''
        INSERT INTO access_tokens(user_id,access_token)
            VALUES('{user_id}','{access_token}');
    '''
    await db.execute(sql)


async def update_user_pwd(db: DB, /, email: str, hashed_pwd: str
) -> None:
    sql = f'''
        UPDATE users SET hashed_pwd='{hashed_pwd}'
            WHERE users.email='{email}';
    '''
    await db.execute(sql)

async def update_user_status(db: DB, /, email: str, ) -> None:
    sql = f'''
        UPDATE users SET status='{UserStatus.new.value}'
            WHERE users.email='{email}';
    '''
    await db.execute(sql)

    