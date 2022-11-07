from contextlib import contextmanager
from psycopg2.pool import SimpleConnectionPool
from backend.src.utils.ConfigUtils import ConfigUtils 
import atexit

connection_pool = SimpleConnectionPool(1,5,
    database= ConfigUtils.db_name, 
    user = ConfigUtils.db_username, 
    password = ConfigUtils.db_password, 
    host = ConfigUtils.db_host,
    port = ConfigUtils.db_port,
    
)
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




    
