import {useEffect,useRef,useState} from 'react';
import {SIMULATION_DOCUMENT} from './simulation-document';

type Experience='planner'|'simulation';
type Theme='light'|'dark';

export function ExperienceSwitcher({value,onChange,theme,onThemeChange}:{value:Experience;onChange:(value:Experience)=>void;theme:Theme;onThemeChange:(theme:Theme)=>void}){
 return <nav className="experience-switcher" aria-label="Switch workspace">
  <div className="experience-heading"><a className="experience-brand" href="/" aria-label="Rescue Route home"><span aria-hidden="true">↗</span><span>Rescue Route<small>PLAN · EXPLORE · PREPARE</small></span></a>
   <div className="experience-theme" role="group" aria-label="Workspace colour theme"><button type="button" aria-pressed={theme==='light'} onClick={()=>onThemeChange('light')}>☀ Light</button><button type="button" aria-pressed={theme==='dark'} onClick={()=>onThemeChange('dark')}>☾ Dark</button></div>
  </div>
  <div className="experience-options" role="group" aria-label="Choose a workspace">
   <button type="button" aria-pressed={value==='planner'} aria-controls="experience-planner" onClick={()=>onChange('planner')}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z M9 3v15 M15 6v15"/></svg><span>Bengaluru Route Planner<small>Locations, routes & transport</small></span></button>
   <button type="button" aria-pressed={value==='simulation'} aria-controls="experience-simulation" onClick={()=>onChange('simulation')}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z M3 7l9 5 9-5 M12 12v10"/></svg><span>Simulation<small>3D city & interactive demo</small></span></button>
  </div>
 </nav>;
}

export function SimulationExperience({active,theme}:{active:boolean;theme:Theme}){
 const [visited,setVisited]=useState(active);
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 const [attempt,setAttempt]=useState(0);
 const frame=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{if(active)setVisited(true)},[active]);
 useEffect(()=>{
  if(!visited)return;
  const timeout=window.setTimeout(()=>setStatus('error'),30000);
  const receive=(event:MessageEvent)=>{
   if(event.source!==frame.current?.contentWindow||event.origin!==window.location.origin)return;
   if(event.data?.type==='rescue-route:simulation-ready'){
    window.clearTimeout(timeout);
    setStatus('ready');
   }else if(event.data?.type==='rescue-route:simulation-error'){
    window.clearTimeout(timeout);
    setStatus('error');
   }
  };
  window.addEventListener('message',receive);
  return()=>{window.clearTimeout(timeout);window.removeEventListener('message',receive)};
 },[visited,attempt]);
 const synchronize=()=>frame.current?.contentWindow?.postMessage({type:'rescue-route:appearance',theme},window.location.origin);
 useEffect(()=>{
  if(status==='ready')frame.current?.contentWindow?.postMessage({type:'rescue-route:appearance',theme},window.location.origin);
 },[theme,status]);
 return <section id="experience-simulation" className="experience-simulation" hidden={!active} aria-label="Flood simulation">
  <div className="experience-context"><strong>SIMULATION · FICTIONAL RIVERGATE</strong><span>Simulated flood conditions, routes and response. Use the Bengaluru Route Planner for the Bengaluru map.</span></div>
  <div className="experience-frame-wrap" aria-busy={status==='loading'}>
   {status==='loading'&&<div className="experience-loading" role="status"><span className="experience-loading-ring" aria-hidden="true"/><strong>Opening the 3D flood simulation…</strong><span>Preparing the city and its bundled assets.</span></div>}
   {status==='error'&&<div className="experience-loading experience-load-error" role="alert"><strong>Simulation could not finish loading.</strong><span>Check your connection and try again.</span><button type="button" onClick={()=>{setStatus('loading');setAttempt(value=>value+1)}}>Retry simulation</button></div>}
   {visited&&<iframe key={attempt} ref={frame} className="experience-frame" title="Interactive 3D flood and evacuation simulation" srcDoc={SIMULATION_DOCUMENT} allow="fullscreen" allowFullScreen sandbox="allow-scripts allow-same-origin allow-downloads" referrerPolicy="no-referrer" onLoad={synchronize}/>}
  </div>
 </section>;
}
