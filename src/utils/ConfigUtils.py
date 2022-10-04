import yaml
from src.utils.storage_utils import *


class ConfigUtils():
    path_to_config = get_project_root() + '/config/keys.yaml'
    
    with open(path_to_config, 'r') as f:
        valuesYaml = yaml.load(f, Loader=yaml.FullLoader)

    TWITTER_API_KEY = valuesYaml["twitter"]["api_key"]
    TWITTER_API_KEY_SECRET = valuesYaml["twitter"]["api_key_secret"]
    BEARER_TOKEN = valuesYaml["twitter"]["bearer_token"]

    REDDIT_CLIENT_ID = valuesYaml["reddit"]['client_id']
    REDDIT_CLIENT_SECRET = valuesYaml['reddit']['secret']






