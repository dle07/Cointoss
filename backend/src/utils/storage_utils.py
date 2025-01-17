
from pathlib import Path
from datetime import datetime
import csv
"""
project
|
|
|____>backend
        |
        |__src
            |___utils
            
"""

def get_project_root() -> str:
    return str( Path(__file__).parent.parent.parent.parent )


def create_csv_path(suffix:str) -> str:
    file_name = get_project_root()+ '\\{suffix}_'.format(suffix=suffix) + datetime.today().strftime('%Y.%m.%d-%H.%M.%S') +".csv"
    return file_name
    