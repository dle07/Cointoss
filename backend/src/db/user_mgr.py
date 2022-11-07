import bcrypt
from pprint import pprint

from backend.src.db.db_util import getCursor
import re

from backend.src.routers.models import UserRegistration   

def registerUser(userRegistration: UserRegistration):

    try:
        if(emailTaken(userRegistration.email)):
            raise ValueError("Email Taken")
        with getCursor() as cur:
            salt = bcrypt.gensalt()

            pwd = userRegistration.password.encode()
            encrypted_password = bcrypt.hashpw(pwd ,salt)
            cur.execute("""
            INSERT INTO users (email, pass_word)
            VALUES(%s, %s)
            """, ( userRegistration.email, encrypted_password.decode()))
    except Exception as e:
        pprint(e)
        return e
        
def getUserByEmail(email):
    try:
        query = "select * from users where email = %s LIMIT 1"
        with getCursor() as cur:
            cur.execute(query, (email,))
            result = cur.fetchone()
            pprint(cur.description)
            return result
        
    except Exception as e:
        pprint(e)


def emailTaken(email):
    with getCursor() as cur:
        cur.execute("SELECT user_id from users where email = %s",(email,))
        return  True if cur.fetchone() is not None else False




    