import json
import urllib
import time
import csv
import pprint

apikey = "your google API key here"
filename = "cities.csv"
sep = ";"

def query(addr):
    try:
        req = urllib.request.urlopen("https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=" + apikey)
    except err:
        print(err)
    j = json.loads(req.read())
    if j['status'] != "OK":
        raise Exception('Google said ' + addr + ' query was not OK')
        
    return j['results']

resolved = {}

with open(filename) as fd:
    for addr in fd.readlines():
        for result in query(addr):
            l = result['geometry']['location']
            resolved[addr.strip()] = l
            time.sleep(1)

for key in resolved:
    print(key + sep + str(resolved[key]['lat']) + sep + str(resolved[key]['lng']))
