import json
import re
from http.server import BaseHTTPRequestHandler

import requests as req
import yaml


def getCommiters(u: str):
    splitRequestLine = (u.split("?c=")[1].split("HTTP")[0].replace(
        " ", "")).split("&v=")
    country = splitRequestLine[0]
    visibility = splitRequestLine[1]
    url = f"https://raw.githubusercontent.com/lauripiispanen/github-top/master/_data/locations/{country}.yml"
    resp = req.get(url)

    if resp.status_code == 200:
        y = yaml.safe_load(resp.text)
        # return u
        return '{"users": ' + json.dumps(y) + "}"
    elif resp.status_code == 404:
        return '{"message": "Location not found. Take a look at /locations for the available locations"}'
    elif resp.status_code == 500:
        return (
            '{"message": "An error occurred. A server one. Try again later, I guess."}'
        )


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        message = getCommiters(self.requestline)
        self.wfile.write(str(message).encode())
        return
