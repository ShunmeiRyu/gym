from pydantic import BaseModel, Field


class BasicUser(BaseModel):
    email: str = Field(..., max_length=254)


class NewUser(BasicUser):
    plan_pwd: str = Field(...,min_length=8, max_length=16, validation_alias="password")