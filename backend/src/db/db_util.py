from contextlib import contextmanager
from psycopg2.pool import SimpleConnectionPool
from backend.src.utils.ConfigUtils import ConfigUtils 
import atexit
import requests
import os


def set_db_uri():
    res = requests.get("https://api.heroku.com/apps/cointoss-db/config-vars",headers={
        "Accept" :"application/vnd.heroku+json; version=3",
        "Authorization": "Bearer " + ConfigUtils.heroku_o_auth_token
    })
    body = res.json()
    db_uri = (body["DATABASE_URL"])
    os.environ["db_uri"] = db_uri

set_db_uri()

try:
    connection_pool = SimpleConnectionPool(1,5,
        dsn = os.environ["db_uri"]
        # database= ConfigUtils.db_name, 
        # user = ConfigUtils.db_username, 
        # password = ConfigUtils.db_password, 
        # host = ConfigUtils.db_host,
        # port = ConfigUtils.db_port
        
    )
except Exception as e:
    set_db_uri()
    print(str(e))
    pass
    
    
# 
@contextmanager                          # Used with 'with' statement
def getCursor():
    conn = connection_pool.getconn()
    conn.set_session(autocommit=True)
    try:
        yield conn.cursor()
    finally:                                # when the 'with staement ends' do this, equivalent to def __exit__()
        connection_pool.putconn(conn)




def closeConnectionPool():
    connection_pool.closeall()


atexit.register(closeConnectionPool)




    
