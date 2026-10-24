import json,math,pathlib,datetime
P=pathlib.Path(__file__).resolve().parents[1];rows=json.loads((P/'src/data/corridors.json').read_text());nodes=[];idx={};edges={};names=[];ni={}
def node(p):
 k=tuple(round(v,5) for v in p)
 if k not in idx:idx[k]=len(nodes);nodes.append(list(k))
 return idx[k]
def dist(p,q):return math.hypot((p[0]-q[0])*108300,(p[1]-q[1])*111320)
def add(a,b,n,m,flag):
 k=(a,b,n)
 if k not in edges:edges[k]=[a,b,n,round(m,1),0,0]
 edges[k][flag]=1
for row in rows:
 for s in row['steps']:
  name=s['name']
  if name not in ni:ni[name]=len(names);names.append(name)
  for p,q in zip(s['geometry'],s['geometry'][1:]):
   a,b=node(p),node(q);m=dist(nodes[a],nodes[b])
   if a==b:continue
   add(a,b,ni[name],m,4 if row['mode']=='walk' else 5)
   if row['mode']=='walk':add(b,a,ni[name],m,4)
g=dict(nodes=nodes,edges=list(edges.values()),names=names,source='OpenStreetMap via OSRM driving and routed-foot; limited corridor snapshot',retrieved=datetime.datetime.now(datetime.timezone.utc).isoformat())
(P/'src/data/network.json').write_text(json.dumps(g,separators=(',',':')))
print('GRAPH',len(nodes),len(edges),'bytes',(P/'src/data/network.json').stat().st_size)
