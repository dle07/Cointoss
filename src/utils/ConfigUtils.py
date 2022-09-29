import yaml
from src.utils.storage_utils import *


class ConfigUtils():
    path_to_config = get_project_root() + '/config/keys.yaml'
    
    with open(path_to_config, 'r') as f:
        valuesYaml = yaml.load(f, Loader=yaml.FullLoader)

    API_KEY = valuesYaml["twitter"]["api_key"]
    API_KEY_SECRET = valuesYaml["twitter"]["api_key_secret"]
    BEARER_TOKEN = valuesYaml["twitter"]["bearer_token"]


