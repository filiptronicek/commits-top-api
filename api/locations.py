import json
import re
from http.server import BaseHTTPRequestHandler

import requests as req
import yaml

from os import environ, getenv

if environ.get("TOKEN") is None:
    from dotenv import load_dotenv
    load_dotenv()

def getLocs():
    user = "lauripiispanen"
    repo = "github-top"

    url = "https://api.github.com/repos/{}/{}/git/trees/master?recursive=2".format(
        user, repo)
    headers = {"Authorization": f"token {getenv('TOKEN')}"}
    r = req.get(url, headers=headers)
    res = r.json()

    locs = []

    for file in res["tree"]:
        if "_data/locations/" in file["path"]:
            fileNm = (file["path"].split("/")[-1]).replace(".yml", "")
            locs.append(fileNm)
    return '{"locations": ' + json.dumps(locs) + "}"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        message = getLocs()
        self.wfile.write(str(message).encode())
        return
