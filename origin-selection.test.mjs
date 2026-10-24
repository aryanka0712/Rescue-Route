import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveStartingArea,startingAreaSuggestions} from '../src/lib/origin-selection.ts';
import {simulate,distance} from '../src/lib/rescue-engine.ts';
const graph=JSON.parse(fs.readFileSync(new URL('../src/data/network.json',import.meta.url)));
const base={origin:'bellandur',custom:null,scenario:'watch',tick:0,closed:[],wheelchair:false,medical:false,people:4,destination:'area:majestic',mode:'walk',operative:false,busDisrupted:false,metroDisrupted:false,flood:0};
assert.equal(resolveStartingArea(''),undefined,'empty input cannot select a default');
assert.equal(resolveStartingArea('unrecognised address'),undefined,'unknown address cannot silently become Bellandur');
assert.equal(resolveStartingArea('  WHITEFIELD ').id,'whitefield');
assert.equal(resolveStartingArea('KR Pura').id,'krpuram');
assert.equal(resolveStartingArea('electroniccity').id,'electronic');
assert(startingAreaSuggestions('indra').length===0,'do not silently accept a misspelling');
assert(startingAreaSuggestions('white').some(p=>p.id==='whitefield'));
const geometries=[];
for(const name of ['Whitefield','Indiranagar','MG Road','Jayanagar']){
 const chosen=resolveStartingArea(name);const point=[chosen.lng,chosen.lat];
 // Retain a stale named origin deliberately: explicit coordinates must win.
 const result=simulate({...base,custom:point},graph);
 assert.deepEqual(result.origin,point,name+' is the actual route origin');
 assert(result.route,name+' has a route');
 assert(distance(result.route.start,point)<250,name+' route starts near the chosen point');
 geometries.push(JSON.stringify(result.route.geometry));
}
assert.equal(new Set(geometries).size,4,'changing origin changes the road route');
console.log('PASS: no empty/unknown fallback, case and aliases, area suggestions, and four distinct user-selected route origins.');
