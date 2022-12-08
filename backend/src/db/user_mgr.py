import bcrypt
from pprint import pprint
from fastapi import APIRouter, HTTPException

from backend.src.db.db_util import getCursor
from backend.src.routers.models import UserRegistration   

### USER MANAGER API FUNCTIONS
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
    except ValueError as e:
        raise HTTPException(status_code=422, detail = str(e))

def getUserByEmail(email):
    try:
        query = "select * from users where email = %s LIMIT 1"
        with getCursor() as cur:
            cur.execute(query, (email,))
            result = cur.fetchone()
            return result
        
    except Exception as e:
        pprint(e)

def getUserIdByEmail(email:str) -> int:
    user = getUserByEmail(email)
    pprint(user[0])
    return user[0]



def addStock(email:str, ticker:str):
    print(email)
    user = getUserByEmail(email)
    user_id = user[0]
    print(user_id)
    with getCursor() as cur:   # Stock already tacked by user
        cur.execute("SELECT * FROM user_stock_assets WHERE user_id = %s and ticker = %s ", (user_id, ticker))
        if( cur.fetchone() != None ):  # We found a value
            return
    with getCursor() as cur:
        cur.execute("insert into user_stock_assets values( DEFAULT,%s,%s)", (user_id, ticker))

def deleteStock(email:str,ticker:str):

    id = getUserIdByEmail(email)
    query = "delete from user_stock_assets where user_id = %s and ticker = %s"
    try:
        with getCursor() as cur:
            cur.execute(query,(id,ticker))
    except Exception as e:
        print(e)

def retrieveTrackedStocks(email):
    id = getUserIdByEmail(email)
    query = "select ticker from user_stock_assets where user_id = %s"
    try:
        with getCursor() as cur:
            cur.execute(query, (id,))
            stocks = cur.fetchall()
            return [x[0] for x in stocks]
    except Exception as e:
        print(e)

### UTILITY FUNCTIONS
def emailTaken(email):
    with getCursor() as cur:
        cur.execute("SELECT user_id from users where email = %s",(email,))
        return  True if cur.fetchone() is not None else False


    