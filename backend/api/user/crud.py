from typing import Optional,Any
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


async def query_user_info_for_pwd_auth(
        db: DB, /, email: str
) -> Optional[dict]:
    sql = f'''
        SELECT id,hashed_pwd FROM users
            WHERE users.email='{email}';
    '''
    return await db.fetch_one(sql)

async def query_access_token(
        db: DB, /, user_id: str
) -> Any:
    sql = f'''
        SELECT access_token FROM access_tokens
            WHERE userid='{user_id}' AND is_valid=true;
        '''
    return await db.fetch_value(sql)

async def updata_access_token(
        db: DB, /, user_id
) -> None:
    sql = f'''
        UPDATE access_tokens SET is_valid=false
            WHERE userid='{user_id}';
    '''
    await db.execute(sql)

async def inster_access_token(
        db: DB, /, user_id: str, access_token: str
) -> None:
    sql = f'''
        INSERT INTO access_tokens(userid,access_token,is_valid)
            VALUES('{user_id}','{access_token}',true);
    '''
    await db.execute(sql)
