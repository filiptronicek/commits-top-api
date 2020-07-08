from bs4 import BeautifulSoup
import requests as req
import re
import json
from http.server import BaseHTTPRequestHandler


def getCommiters(u: str):
    country = u.split("?c=")[1].split("HTTP")[0].replace(" ", "")
    url = f'https://commits.top/{country}.html'
    resp = req.get(url)
    htmlGH = BeautifulSoup(resp.text, 'html.parser')
    count = htmlGH.select(".users-list > tr")

    r = []
    for i,c in enumerate(count):
        if i != 0:
            children = c.findAll("td" , recursive=False)
            s = children[1].get_text()
            username =  s[s.find('(')+1:s.find(')')]
            r.append({"rank": children[0].get_text().replace(".",""), "user": {"name": username, "username": s.split(" ")[0]}, "contributors": children[2].get_text()})
    return '{"users": '+json.dumps(r)+"}"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        message = getCommiters(self.requestline)
        self.wfile.write(str(message).encode())
        return