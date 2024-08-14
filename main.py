import requests
import os

def login(session, user, passwd, url):
    login_data = {
        'username': user,
        'password': passwd
    }

    headers = {
        'Cache-Control': 'max-age=0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'Origin': f'http://{url.split("/")[2]}',
        'Referer': f'http://{url.split("/")[2]}/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive'
    }

    response = session.post(url, data=login_data, headers=headers)

    print("Status Code Login:", response.status_code)
    return response.cookies

def upload_config_file(host, file_content, filename, sid, cookies):
    url = f"http://{host}/cgi-bin/upload_cfg"
    
    headers = {
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": "1",
        "Origin": f"http://{host}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Referer": f"http://{host}/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
    }
    
    files = {
        "file": (filename, file_content, "text/plain"),
        "fname": (None, filename),
        "sid": (None, sid),
    }

    cookies_dict = {
        "session-role": "admin",
        "session-identity": sid,
    }

    cookies_dict.update(cookies)

    response = requests.post(url, headers=headers, files=files, cookies=cookies_dict)
    print("Status Code Upload File Config", response.status_code)
    print("Response Request Upload File config", response.text)

    return response

IP = '172.16.130.43'
USER = 'admin'
PASSWD = 'voippass20'
URL_LOGIN = f"http://{IP}/cgi-bin/dologin"
URL_UPLOAD = f"http://{IP}/cgi-bin/upload_cfg"
FILE_PATH = f'{os.getcwd()}/config.txt'
FILE_NAME = 'config.txt'
with open(FILE_PATH, 'r') as c_config:
    CONTENT_FILE = c_config.read()
session = requests.Session()

cookies = login(session, USER, PASSWD, URL_LOGIN)
SID = cookies['session-identity']

upload_config_file(IP, CONTENT_FILE, FILE_NAME, SID, cookies)
