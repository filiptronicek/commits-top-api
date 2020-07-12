import yaml
import requests as req
import re
import json
from http.server import BaseHTTPRequestHandler


def getCommiters(u: str):
    country = u.split("?c=")[1].split("HTTP")[0].replace(" ", "")
    country = "czech_republic"
    url = f"https://raw.githubusercontent.com/lauripiispanen/github-top/master/_data/locations/{country}.yml"
    resp = req.get(url)
    y = yaml.safe_load(resp.text)
    return '{"users": ' + json.dumps(y) + "}"


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        message = getCommiters(self.requestline)
        self.wfile.write(str(message).encode())
        return
