import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {simulate,locations} from '../src/lib/rescue-engine.ts';
const g=JSON.parse(readFileSync(new URL('../src/data/network.json',import.meta.url)));
const base={origin:'bellandur',custom:null,scenario:'watch',tick:0,closed:[],wheelchair:false,medical:false,people:4,destination:'auto',mode:'walk',operative:false,busDisrupted:false,metroDisrupted:false,flood:0};
const a=simulate(base,g);assert(a.route,'baseline route exists');assert(a.route.geometry.length>5,'uses street geometry');
const ids=a.route.roads;const b=simulate({...base,closed:ids},g);assert(!b.route||b.route.roads.every(id=>!ids.includes(id)),'closed edges excluded');
assert(!simulate({...base,people:300},g).route,'capacity filter');
assert(!simulate({...base,mode:'vehicle'},g).route,'public user cannot route rescue vehicles');
assert(!simulate({...base,mode:'boat',operative:true},g).route,'boat unavailable without authorised network');
assert(!simulate({...base,mode:'metro'},g).route,'metro unknown fails closed');
assert(!simulate({...base,mode:'bus',busDisrupted:true},g).route,'suspended bus excluded');
assert(!simulate({...base,custom:[77.88,13.18]},g).route,'out of network fails closed');
for(const scenario of ['watch','heavy','extreme'])for(const mode of ['walk','mixed','vehicle']){const r=simulate({...base,scenario,mode,operative:true},g);if(r.route){assert(r.route.maxDepth<(mode==='walk'?10:20),'impassable edges excluded');assert(r.route.legs.every(l=>l.mode!=='Walking'||l.depth<10),'walking hazard threshold');assert(r.routes.every((x,i,rs)=>i===0||rs[i-1].riskExposure<=x.riskExposure),'risk first ranking')}}
const med=simulate({...base,medical:true,wheelchair:true},g);assert(!med.route||(med.route.shelter.medical&&med.route.shelter.accessible&&med.route.maxDepth===0));
console.log('PASS: baseline, actual geometry, closure exclusion, capacity, operative restriction, boat/metro fail-closed, bus disruption, coverage, 9 scenario/mode combinations, risk ranking, accessibility.');
console.log(JSON.stringify({baseline:a.route.shelter.name,km:a.route.km,minutes:a.route.minutes,legs:a.route.legs.length,closureReroute:b.route?.shelter.name||'none',heavy:simulate({...base,scenario:'heavy'},g).route?.shelter.name||'none'}));

for(const location of locations){
 const result=simulate({...base,destination:'area:'+location.id},g);
 assert(result.route,'route to '+location.name);
 assert.equal(result.route.shelter.id,'area:'+location.id);
 assert.equal(result.route.shelter.kind,'area');
 assert(result.route.geometry.length>0,'non-empty map geometry');
 if(location.id!==base.origin)assert(result.route.geometry.length>2,'street-following route to '+location.name);
}
const arrived=simulate({...base,destination:'area:bellandur'},g).route;
assert(arrived.atDestination&&arrived.sameRoadPoint,'same point clearly identified');
assert.equal(arrived.km,0);
assert.equal(arrived.geometry.length,1,'retain endpoint for same-point map state');
const blocked=simulate({...base,scenario:'extreme',destination:'area:bellandur'},g);
assert.equal(blocked.route,null,'hazard still blocks area routing');
const area=simulate({...base,people:300,medical:true,destination:'area:indiranagar'},g);
assert(area.route,'facility capacity and medical filters do not exclude neighbourhoods');
assert.equal(area.route.shelter.medical,false,'area does not claim medical facilities');
console.log('PASS: 12 area destinations, matching endpoint IDs, geometry, arrival state, blocked hazards and area/facility distinction.');
