import assert from 'node:assert/strict';
import fs from 'node:fs';
import {splitRiskSegment,routeRiskSegments,networkRiskSegments} from '../src/lib/road-risk.ts';
import {simulate,distance,buildFloodZones} from '../src/lib/rescue-engine.ts';
import {presentSituation} from '../src/lib/route-result.ts';
const a=[77.598,13],b=[77.602,13];
const zones=[{center:[77.6,13],radius:150,depth:6},{center:[77.6,13],radius:30,depth:18}];
const parts=splitRiskSegment(a,b,zones,10);
assert.deepEqual(parts.map(p=>p.risk),['low','caution','danger','caution','low']);
assert.deepEqual(parts[0].geometry[0],a);assert.deepEqual(parts.at(-1).geometry.at(-1),b);
for(let i=1;i<parts.length;i++)assert.deepEqual(parts[i-1].geometry.at(-1),parts[i].geometry[0],'risk colours meet exactly on the road');
assert(Math.abs(parts.reduce((sum,p)=>sum+distance(...p.geometry),0)-distance(a,b))<0.01);
assert(splitRiskSegment(a,b,zones,20).every(p=>p.risk!=='danger'),'driving uses its own model threshold');
assert(splitRiskSegment(a,b,[],10,true).every(p=>p.risk==='danger'),'closed road remains red even when dry');
assert(splitRiskSegment(a,b,[zones[0]],10,false,'Test',true).some(p=>p.risk==='danger'),'step-free model excludes wet segments');
assert.equal(routeRiskSegments([{name:'Test',mode:'Walking',geometry:[a,[77.6,13],b]}],[]).length,1,'adjacent same-risk road sections merge');
const graph=JSON.parse(fs.readFileSync(new URL('../src/data/network.json',import.meta.url)));
const input={origin:'hebbal',custom:null,scenario:'extreme',tick:2,closed:[],wheelchair:false,medical:false,people:4,destination:'area:majestic',mode:'walk',operative:false,busDisrupted:false,metroDisrupted:false,flood:0};
const blocked=presentSituation(input,graph,simulate(input,graph),{state:'bundled',message:''});
assert.equal(blocked.route,null);assert(blocked.blockedPreview.riskSegments.some(p=>p.risk==='danger'));assert.equal(blocked.routeRisk.length,0);
const dry={...input,scenario:'watch',tick:0};const result=presentSituation(dry,graph,simulate(dry,graph),{state:'bundled',message:''});
assert(result.route);assert(result.roadRisk.length>0);assert(result.routeRisk[0].every(p=>p.risk==='low'));assert.equal(result.blockedPreview,null);
const closed=networkRiskSegments(graph,{...dry,closedNames:[result.route.legs[0].name]},[],result.route.geometry);
assert(closed.some(p=>p.closed&&p.risk==='danger'));
console.log('PASS: exact road-boundary colour transitions, continuous geometry, transport thresholds, closures, step-free rules, admitted green route and red blocked preview.');

// Both severities appear on actual streets across the map in each wet preset.
for(const scenario of ['heavy','extreme']){
 const settings={...input,origin:'majestic',destination:'area:indiranagar',scenario,tick:0};
 const mixed=presentSituation(settings,graph,simulate(settings,graph),{state:'bundled',message:''});
 const counts={low:0,caution:0,danger:0};for(const part of mixed.roadRisk)counts[part.risk]++;
 assert(counts.caution>10&&counts.danger>10&&counts.low>10);
 const directions=new Set(mixed.roadRisk.filter(p=>p.risk==='danger').map(p=>(p.geometry[0][0]<77.62?'west':'east')+'-'+(p.geometry[0][1]<12.965?'south':'north')));
 assert.equal(directions.size,4,'high-risk road pockets span four directions');
 console.log(JSON.stringify({scenario,colouredRoadSections:counts,directions:[...directions]}));
}
assert(buildFloodZones({...input,scenario:'watch',tick:0,flood:0}).every(z=>z.depth===0));
console.log('PASS: red/yellow coexist in both wet presets, mixed risks span four directions and clear-flood mode is dry.');
