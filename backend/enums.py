from enum import Enum


class UserStatus(Enum):
    unverify = "0"
    new = "1"
    general = "2"
    stop = "8"
    forbidden = "9"