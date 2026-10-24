"""Fetch data (not executable code) from public OSM-based OSRM routing services.
Two workers, each paced to one request per second. Rebuild the limited demo corridor network.
"""
import urllib.request,json,time,concurrent.futures,pathlib
P=pathlib.Path(__file__).resolve().parents[1]
places=[('whitefield','Whitefield',12.9698,77.7499),('electronic','Electronic City',12.8452,77.6602),('silk','Silk Board',12.9177,77.6238),('bellandur','Bellandur',12.9255,77.6762),('marathahalli','Marathahalli',12.9562,77.7010),('hebbal','Hebbal',13.0358,77.5970),('krpuram','KR Puram',13.0077,77.6950),('majestic','Majestic',12.9774,77.5707),('indiranagar','Indiranagar',12.9784,77.6408),('jayanagar','Jayanagar',12.9250,77.5938),('mgroad','MG Road',12.9756,77.6066),('hsr','HSR Layout',12.9116,77.6474)]
pairs=[(0,4),(0,6),(4,3),(4,6),(4,8),(3,11),(3,8),(11,2),(11,1),(2,1),(2,9),(2,8),(9,7),(9,10),(7,10),(10,8),(8,6),(6,5),(5,7),(5,10)]
(P/'src/data/places.json').write_text(json.dumps([dict(id=a,name=b,lat=c,lng=d) for a,b,c,d in places]))
def fetch(mode):
 out=[]
 jobs=pairs if mode=='walk' else pairs+[(b,a) for a,b in pairs]
 host='https://routing.openstreetmap.de/routed-foot/route/v1/foot/' if mode=='walk' else 'https://router.project-osrm.org/route/v1/driving/'
 for a,b in jobs:
  p,q=places[a],places[b];url=host+f'{p[3]},{p[2]};{q[3]},{q[2]}?overview=full&geometries=geojson&steps=true&alternatives=true'
  try:
   data=json.load(urllib.request.urlopen(url,timeout=22))
   for i,r in enumerate(data.get('routes',[])[:2]):
    steps=[]
    for leg in r['legs']:
     for s in leg['steps']:
      if s['distance']>0:steps.append(dict(name=s.get('name') or 'Unnamed mapped road',geometry=s['geometry']['coordinates'],meters=s['distance'],instruction=(s['maneuver']['type']+' '+s['maneuver'].get('modifier','')).strip()))
    out.append(dict(id=f'{mode}-{a}-{b}-{i}',mode=mode,origin=p[0],destination=q[0],geometry=r['geometry']['coordinates'],steps=steps))
  except Exception as e:print(mode,a,b,str(e),flush=True)
  time.sleep(1)
 print(mode,len(out),flush=True);return out
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
 rows=sum(list(ex.map(fetch,['walk','drive'])),[])
(P/'src/data/corridors.json').write_text(json.dumps(rows,separators=(',',':')))
print('SAVED',len(rows),flush=True)
