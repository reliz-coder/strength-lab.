/* Strength Lab 6.0 — complete, dropdown-free progress dashboard */
(()=>{
"use strict";
const safe=v=>escapeHTML(String(v??""));
const num=v=>Number(v)||0;
const dayMs=86400000;
const dateMs=s=>{const t=new Date(String(s||"")+"T12:00:00").getTime();return Number.isFinite(t)?t:0};
const fmt=v=>Math.round(v).toLocaleString();
const GROUPS60=[
 ["Chest",/bench press|chest press|cable fly|pec deck|push-up/i],
 ["Back",/pulldown|pull-up|row|pullover/i],
 ["Shoulders",/lateral raise|shoulder press|reverse fly|reverse pec|face pull/i],
 ["Biceps & forearms",/biceps curl|hammer curl|bayesian|preacher curl|reverse curl/i],
 ["Triceps",/triceps|pressdown/i],
 ["Quads",/squat|lunge|leg extension|leg press|split squat/i],
 ["Hamstrings",/leg curl|romanian deadlift|deadlift/i],
 ["Glutes & hips",/hip thrust|hip abduction|hip adduction|glute bridge/i],
 ["Calves",/calf raise/i],
 ["Core",/crunch|pallof|plank|dead bug|knee raise|ab wheel/i]
];
function group(name){for(const [label,re] of GROUPS60)if(re.test(name))return label;return "Other"}
function logs(){const all=[];for(const session of state.sessions||[])for(const ex of session.exercises||[])for(const set of ex.sets||[])if(set.done){all.push({name:ex.name||"Unknown exercise",date:session.date||"",ts:dateMs(session.date),weight:num(set.weight),reps:num(set.reps),rir:num(set.rir),volume:num(set.weight)*num(set.reps),sessionId:session.id})}return all.sort((a,b)=>a.ts-b.ts)}
function spark(vals){if(!vals.length)return '<div class="sl60-nochart">Not enough completed sets yet</div>';const w=260,h=66,p=7,min=Math.min(...vals),max=Math.max(...vals),spread=max-min||1;const coords=vals.map((v,i)=>[p+(i/Math.max(1,vals.length-1))*(w-p*2),h-p-(v-min)/spread*(h-2*p)]);return '<svg class="sl60-spark" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" role="img" aria-label="Logged top-set weight trend"><path d="M7 59H253" stroke="#294a63" fill="none"/><polyline points="'+coords.map(x=>x.join(",")).join(" ")+'" stroke="#69bbff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+coords.map((c,i)=>i===coords.length-1?'<circle cx="'+c[0]+'" cy="'+c[1]+'" r="3.5" fill="#a5deff"/>':'').join("")+'</svg>'}
function bestBySession(rows){const map=new Map();for(const x of rows){const key=x.sessionId+"|"+x.date;const prev=map.get(key);if(!prev||x.weight>prev.weight)map.set(key,x)}return [...map.values()].sort((a,b)=>a.ts-b.ts)}
function movementCard(name,rows){const points=bestBySession(rows),positive=points.filter(x=>x.weight>0),first=positive[0],last=positive.at(-1),delta=first&&last&&first.weight>0&&positive.length>1?(last.weight-first.weight)/first.weight*100:null;return '<article class="sl60-ex"><div class="sl60-ex-head"><strong>'+safe(name)+'</strong><span>'+(delta===null?'—':(delta>0?'+':'')+delta.toFixed(1)+'%')+'</span></div>'+spark(positive.map(x=>x.weight))+'<div class="sl60-ex-foot"><span>'+points.length+' logged sessions</span><span>'+(last?'Latest top set: '+last.weight+' lb':'No loaded sets')+'</span></div></article>'}
function build(){
 const app=document.querySelector("#app");if(!app)return;
 const sessions=[...(state.sessions||[])].sort((a,b)=>dateMs(b.date)-dateMs(a.date)),rows=logs(),volume=rows.reduce((n,x)=>n+x.volume,0);
 const byExercise=new Map();for(const x of rows){if(!byExercise.has(x.name))byExercise.set(x.name,[]);byExercise.get(x.name).push(x)}
 const now=Date.now(),weeks=Array.from({length:8},(_,i)=>{const end=now-(7-i)*7*dayMs,start=end-7*dayMs;const data=rows.filter(x=>x.ts>=start&&x.ts<end);return {sets:data.length,volume:data.reduce((a,x)=>a+x.volume,0),sessions:new Set(data.map(x=>x.sessionId)).size}});
 const peak=Math.max(1,...weeks.map(x=>x.volume));
 const groups=GROUPS60.map(([name])=>({name,exercises:[...byExercise].filter(([n])=>group(n)===name)}));
 const ungrouped=[...byExercise].filter(([n])=>group(n)==="Other");if(ungrouped.length)groups.push({name:"Other",exercises:ungrouped});
 const measurements=[...(state.measurements||[])].sort((a,b)=>dateMs(a.date)-dateMs(b.date));
 const weight=measurements.filter(m=>num(m.weight)>0),waist=measurements.filter(m=>num(m.waist)>0);
 const trend=arr=>arr.length>1?((num(arr.at(-1)[1])-num(arr[0][1]))).toFixed(1):null;
 const bodyLine=(label,arr,unit)=>'<div class="sl60-body-item"><div><small>'+label+'</small><strong>'+(arr.length?num(arr.at(-1)[1])+unit:'Not logged')+'</strong></div><div class="sl60-body-trend">'+(arr.length>1?spark(arr.map(x=>num(x[1]))):'<small>Log at least two measurements to see a trend</small>')+'</div></div>';
 app.innerHTML='<section class="sl60-header"><div class="sl60-kicker">YOUR TRAINING · ALL IN ONE VIEW</div><h2>Performance dashboard</h2><p>Strength, consistency and body composition — without switching workouts.</p></section>'+
 '<section class="sl60-metrics"><div><small>WORKOUTS</small><strong>'+sessions.length+'</strong></div><div><small>COMPLETED SETS</small><strong>'+rows.length+'</strong></div><div><small>LOGGED VOLUME</small><strong>'+fmt(volume)+'</strong><em>lb × reps</em></div><div><small>LAST 7 DAYS</small><strong>'+sessions.filter(s=>dateMs(s.date)>=now-7*dayMs).length+'</strong><em>sessions</em></div></section>'+
 '<section class="sl60-panel"><div class="sl60-title"><h3>Training consistency</h3><span>Last 8 weeks</span></div><p>Weekly logged training volume. Labels show completed sets.</p><div class="sl60-bars">'+weeks.map((w,i)=>'<div class="sl60-barcol"><strong>'+w.sets+'</strong><div class="sl60-track"><span style="height:'+(w.volume?Math.max(4,w.volume/peak*100):0)+'%"></span></div><small>W'+(i+1)+'</small></div>').join("")+'</div><div class="sl60-note">Volume = completed reps × logged weight. Differences in exercise selection can affect totals.</div></section>'+
 '<section class="sl60-panel"><div class="sl60-title"><h3>Whole-body strength</h3><span>'+byExercise.size+' exercises logged</span></div><p>Representative movements by muscle group. Changes reflect recorded top-set load, not measured muscle growth.</p><div class="sl60-group-grid">'+groups.map(g=>{const ranked=g.exercises.map(([n,rr])=>{const p=bestBySession(rr).filter(x=>x.weight>0);return {n,p,latest:p.at(-1),first:p[0]}}).filter(x=>x.latest).sort((a,b)=>b.p.length-a.p.length);const top=ranked[0];const delta=top?.first&&top.p.length>1?(top.latest.weight-top.first.weight)/top.first.weight*100:null;return '<div class="sl60-group"><small>'+safe(g.name)+'</small><strong>'+(top?safe(top.n):'No logged sets yet')+'</strong><div class="sl60-group-bottom"><span>'+(top?'Latest '+top.latest.weight+' lb':'Log a workout to begin')+'</span><b>'+(delta===null?'—':(delta>0?'+':'')+delta.toFixed(1)+'%')+'</b></div></div>'}).join("")+'</div></section>'+
 '<section class="sl60-panel"><div class="sl60-title"><h3>Every exercise trend</h3><span>'+byExercise.size+' tracked</span></div><p>Each chart displays the heaviest completed set per session. Exercises with no saved sets will appear once logged.</p>'+ (groups.some(g=>g.exercises.length)?groups.filter(g=>g.exercises.length).map(g=>'<div class="sl60-ex-group"><h4>'+safe(g.name)+'</h4><div class="sl60-ex-grid">'+g.exercises.sort((a,b)=>a[0].localeCompare(b[0])).map(([n,rr])=>movementCard(n,rr)).join("")+'</div></div>').join(""):'<div class="sl60-empty">Complete and save your first workout to start tracking exercise trends.</div>')+'</section>'+
 '<section class="sl60-panel"><div class="sl60-title"><h3>Body composition</h3><span>From Body tab</span></div><p>Track weight and waist together to assess your physique goals. Neither metric alone proves muscle gain or fat loss.</p>'+bodyLine("BODY WEIGHT",weight.map(x=>[x.date,x.weight])," lb")+bodyLine("WAIST",waist.map(x=>[x.date,x.waist])," in")+'<button type="button" class="sl60-action" id="sl60-body">Log body measurements →</button></section>'+
 '<section class="sl60-panel"><div class="sl60-title"><h3>Workout history</h3><span>'+sessions.length+' saved</span></div>'+(sessions.length?sessions.map(s=>'<div class="sl60-history"><div><strong>'+safe(s.program)+'</strong><small>'+safe(s.date)+' · '+(s.exercises||[]).reduce((n,x)=>n+(x.sets||[]).filter(z=>z.done).length,0)+' completed sets'+(s.cardio?' · Incline walk':'')+'</small></div><button type="button" data-sl60-delete="'+safe(s.id)+'" aria-label="Delete workout">Delete</button></div>').join(""):'<p>No saved workouts yet.</p>')+'</section>';
 app.querySelector("#sl60-body").onclick=()=>{page="body";render();window.scrollTo(0,0)};
 app.querySelectorAll("[data-sl60-delete]").forEach(b=>b.onclick=()=>{if(!confirm("Permanently delete this saved workout? This cannot be undone without a backup."))return;state.sessions=state.sessions.filter(s=>String(s.id)!==b.dataset.sl60Delete);save();render()});
}
progressView=function(){build()};
render();
})();