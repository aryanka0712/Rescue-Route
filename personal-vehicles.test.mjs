import assert from 'node:assert/strict';
import fs from 'node:fs';
import {simulate,distance} from '../src/lib/rescue-engine.ts';
import {presentSituation} from '../src/lib/route-result.ts';
import {expandedSituation} from '../src/lib/expanded-routing.server.ts';
const start=[77.5938,12.925],bend=[77.60,12.9774],end=[77.5707,12.9774],footOnly=[77.58,12.95];
const nodes=[start,bend,end,footOnly];
const edge=(a,b,walk,drive)=>[a,b,0,distance(nodes[a],nodes[b]),walk,drive];
// Fixture roads test mode rules, not real-world journeys.
const graph={nodes,edges:[edge(0,1,0,1),edge(1,2,0,1),edge(0,3,1,0),edge(3,2,1,0),edge(2,3,1,0),edge(3,0,1,0)],names:['Fixture road'],source:'TEST ONLY',retrieved:'2026-10-23'};
const base={origin:'jayanagar',custom:null,scenario:'watch',tick:0,closed:[],closedNames:[],wheelchair:false,medical:false,people:1,destination:'area:majestic',mode:'car',operative:false,busDisrupted:false,metroDisrupted:false,flood:0};
const car=simulate(base,graph),bike=simulate({...base,mode:'two_wheeler'},graph);
assert(car.route&&bike.route,'personal transport requires no operative role');
assert.deepEqual(car.route.geometry,[start,bend,end]);assert.deepEqual(bike.route.geometry,car.route.geometry);
assert(car.route.legs.every(l=>l.mode==='Own car'));assert(bike.route.legs.every(l=>l.mode==='Two-wheeler'));
const meters=distance(start,bend)+distance(bend,end);
assert.equal(car.route.minutes,Math.ceil(meters/1000/20*60));assert.equal(bike.route.minutes,Math.ceil(meters/1000/25*60));assert(bike.route.minutes<car.route.minutes);
assert.equal(simulate({...base,custom:end,destination:'area:jayanagar'},graph).route,null,'car cannot reverse one-way driving roads or use foot-only shortcuts');
assert.equal(simulate({...base,closedNames:['Fixture road']},graph).route,null,'personal cars honour closures');
assert.equal(simulate({...base,mode:'vehicle'},graph).issue,'mode','rescue-vehicle restriction is retained');
const wetStart=[77.673,12.9315],wetBend=[77.66,12.94],wetEnd=start;
const wetNodes=[wetStart,wetBend,wetEnd];
const wetGraph={...graph,nodes:wetNodes,edges:[[0,1,0,distance(wetStart,wetBend),0,1],[1,2,0,distance(wetBend,wetEnd),0,1]]};
const wetInput={...base,custom:wetStart,destination:'area:jayanagar',scenario:'heavy',flood:7};
const wetCar=simulate(wetInput,wetGraph),wetBike=simulate({...wetInput,mode:'two_wheeler'},wetGraph);
assert(wetCar.route,'car fixture remains below the car model threshold');assert.equal(wetBike.route,null,'two-wheeler excludes the 16cm simulated start');
const blocked=presentSituation({...wetInput,mode:'two_wheeler'},wetGraph,wetBike,{state:'bundled',message:''});
assert(blocked.blockedPreview);assert(blocked.blockedPreview.riskSegments.some(s=>s.risk==='danger'),'preview uses the same two-wheeler flood rule');
const tiny={...graph,nodes:[[77.50,12.90],end],edges:[[0,1,0,12000,0,1]]};
for(const mode of ['car','two_wheeler']){const point=[77.556,12.934];let calls=0;const provider=async(url)=>{calls++;assert(String(url).startsWith('https://router.project-osrm.org/route/v1/driving/'));return new Response(JSON.stringify({code:'Ok',waypoints:[{distance:0},{distance:0}],routes:[{legs:[{steps:[{name:'Fixture driving connector',geometry:{coordinates:[point,[77.56,12.96],end]}}]}]}]}))};const result=await expandedSituation({...base,custom:point,mode},tiny,provider);assert.equal(calls,1);assert(result.route);assert.equal(result.route.mode,mode);assert.deepEqual(result.origin,point);}
const realGraph=JSON.parse(fs.readFileSync(new URL('../src/data/network.json',import.meta.url)));
for(const mode of ['car','two_wheeler']){const result=simulate({...base,origin:'bellandur',destination:'area:majestic',mode},realGraph);assert(result.route);assert(result.route.minutes>0);assert(result.route.legs.every(l=>l.mode===(mode==='car'?'Own car':'Two-wheeler')));console.log(JSON.stringify({mode,distanceKm:result.route.km,estimatedMinutes:result.route.minutes}));}
console.log('PASS: public car/two-wheeler access, driving-only and one-way roads, exact ETA arithmetic, closures, flood thresholds, blocked preview colours and driving-provider lookup.');
