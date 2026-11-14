/* Strength Lab 7.0 — strength-first progress dashboard. Read-only workout analysis. */
(()=>{
"use strict";
const esc=x=>escapeHTML(String(x??"")),n=x=>Number(x)||0,dayMs=86400000;
const groups=[["Chest",/bench press|chest press|cable fly|pec deck|push-up/i],["Back",/pulldown|pull-up|row|pullover/i],["Shoulders",/lateral raise|shoulder press|reverse fly|face pull/i],["Biceps",/biceps curl|hammer curl|bayesian|preacher curl/i],["Triceps",/triceps|pressdown/i],["Quads",/squat|lunge|leg extension|leg press/i],["Hamstrings",/leg curl|romanian deadlift|deadlift/i],["Glutes & hips",/hip thrust|hip abduction|hip adduction|glute bridge/i],["Calves",/calf raise/i],["Core",/crunch|pallof|plank|knee raise/i]];
const group=name=>groups.find(g=>g[1].test(name))?.[0]||"Other";
const e1rm=(w,r)=>w>0&&r>0&&r<=15?w*(1+r/30):null;
const stamp=d=>{const t=new Date(String(d||"")+"T12:00:00").getTime();return Number.isFinite(t)?t:0};
const format=x=>Number.isFinite(x)?x.toFixed(1):"—";
const change=(a,b)=>a>0?(b-a)/a*100:null;
const info={
 strength:"Estimated strength combines weight and reps using the Epley formula: weight × (1 + reps / 30). This is an estimate, not a tested one-rep maximum. Only completed sets of 1–15 reps with positive weight count.",
 index:"Overall strength trend is the median percentage change across exercises with at least two logged sessions in the selected period. Each exercise counts once, so heavy lifts do not dominate. Results may be sensitive to exercise selection and effort.",
 improving:"Improving, stable and declining compare the average of your first two and latest two session-best estimated strengths. At least four sessions are required for a trend classification. A difference within ±2% is stable.",
 pb:"A personal best is a new highest estimated strength for an exercise within the selected period, compared with all earlier logged sessions. This counts exercises, not sets.",
 volume:"Volume is completed reps multiplied by the weight you entered. Dumbbell weights are per hand and are not doubled. Volume is not a direct measure of strength.",
 body:"Weight and waist are separate measurements. Their trends can help assess body composition but cannot directly measure muscle or fat."
};
let period="8",expanded=new Set();
function hint(key){return '<button class="sl70-info" type="button" data-sl70-info="'+key+'" aria-label="Explain this metric">ⓘ</button>'}
function data(){
 const all=[];for(const s of state.sessions||[])for(const ex of s.exercises||[])for(const set of ex.sets||[])if(set.done){const w=n(set.weight),reps=n(set.reps),score=e1rm(w,reps);if(score!==null)all.push({name:ex.name,date:s.date,ts:stamp(s.date),id:s.id,weight:w,reps,rir:set.rir,score})}
 all.sort((a,b)=>a.ts-b.ts||String(a.id).localeCompare(String(b.id)));
 const by=new Map();for(const x of all){if(!by.has(x.name))by.set(x.name,new Map());const m=by.get(x.name),key=String(x.id)+"|"+x.date,prev=m.get(key);if(!prev||x.score>prev.score)m.set(key,x)}
 return {all,exercises:[...by].map(([name,m])=>({name,group:group(name),points:[...m.values()].sort((a,b)=>a.ts-b.ts||String(a.id).localeCompare(String(b.id)))}))};
}
function median(arr){const a=[...arr].sort((x,y)=>x-y),i=Math.floor(a.length/2);return a.length?(a.length%2?a[i]:(a[i-1]+a[i])/2):null}
function summarize(ex,start){
 const p=ex.points.filter(x=>x.ts>=start),first=p[0],last=p.at(-1);
 if(!first||!last)return {...ex,p,first,last,pct:null,status:"Insufficient data",baseline:null,latest:null};
 const early=p.slice(0,Math.min(2,p.length)),late=p.slice(-Math.min(2,p.length));
 const baseline=early.reduce((a,x)=>a+x.score,0)/early.length,latest=late.reduce((a,x)=>a+x.score,0)/late.length;
 const pct=p.length>=2?change(baseline,latest):null;
 const status=p.length<4?"Insufficient data":pct>2?"Improving":pct< -2?"Declining":"Stable";
 return {...ex,p,first,last,pct,status,baseline,latest};
}
function svg(points){if(!points.length)return '<div class="sl70-empty">No comparable sessions</div>';const values=points.map(x=>x.score),min=Math.min(...values),max=Math.max(...values),range=max-min||1;const coords=values.map((v,i)=>[10+(i/Math.max(1,values.length-1))*290,74-((v-min)/range)*60]);return '<svg viewBox="0 0 310 85" preserveAspectRatio="none" role="img" aria-label="Estimated strength across sessions"><path d="M10 75H300" stroke="#38516a" fill="none"/><polyline fill="none" stroke="#7dc8ff" stroke-width="3" points="'+coords.map(c=>c.join(",")).join(" ")+'"/>'+coords.map(c=>'<circle cx="'+c[0]+'" cy="'+c[1]+'" r="3" fill="#a3dcff"/>').join("")+'</svg>'}
function pctText(p){return p===null?"—":(p>0?"+":"")+format(p)+"%"}
function build(){
 const app=document.querySelector("#app");if(!app)return;
 const d=data(),now=Date.now(),start=period==="all"?0:now-Number(period)*7*dayMs;
 const summaries=d.exercises.map(x=>summarize(x,start)).filter(x=>x.p.length);
 const comparable=summaries.filter(x=>x.p.length>=2&&x.pct!==null);
 const overall=median(comparable.map(x=>x.pct));
 const classified=summaries.filter(x=>x.p.length>=4);
 const improving=classified.filter(x=>x.status==="Improving").length;
 const pbs=summaries.filter(ex=>{if(!ex.p.length)return false;const prior=ex.points.filter(x=>x.ts<start);const previousBest=Math.max(0,...prior.map(x=>x.score));let best=previousBest;let got=false;for(const x of ex.p){if(x.score>best+0.001){got=true;best=x.score}}return got}).length;
 const labels=period==="all"?"All logged history":period+" weeks";
 const headline=overall===null?"Not enough data":pctText(overall);
 const groupSummaries=groups.map(([name])=>{const entries=comparable.filter(x=>x.group===name);return {name,pct:median(entries.map(x=>x.pct)),count:entries.length}}).filter(x=>x.count);
 const keyNames=["Hack squat","Flat dumbbell bench press","Incline dumbbell press","Lat pulldown","Seated cable row","Dumbbell Romanian deadlift","Lying leg curl machine"];
 const ordered=[...summaries].sort((a,b)=>{const ai=keyNames.indexOf(a.name),bi=keyNames.indexOf(b.name);return (ai<0?100:ai)-(bi<0?100:bi)||a.name.localeCompare(b.name)});
 const logs=(state.sessions||[]).filter(s=>stamp(s.date)>=start);
 const sets=logs.reduce((a,s)=>a+(s.exercises||[]).reduce((b,e)=>b+(e.sets||[]).filter(t=>t.done).length,0),0);
 const volume=logs.reduce((a,s)=>a+(s.exercises||[]).reduce((b,e)=>b+(e.sets||[]).filter(t=>t.done).reduce((c,t)=>c+n(t.weight)*n(t.reps),0),0),0);
 const measurements=[...(state.measurements||[])].sort((a,b)=>stamp(a.date)-stamp(b.date));
 const latest=(field)=>measurements.filter(m=>n(m[field])>0).at(-1);
 app.innerHTML='<section class="sl70-hero"><small>STRENGTH LAB · PERFORMANCE</small><h2>Your Strength</h2><p>Understand where you are getting stronger and what to do next.</p><div class="sl70-period" role="group" aria-label="Progress period">'+[["4","4 weeks"],["8","8 weeks"],["all","All time"]].map(([id,label])=>'<button data-sl70-period="'+id+'" class="'+(period===id?"selected":"")+'">'+label+'</button>').join("")+'</div></section>'+
 '<section class="sl70-card sl70-main"><div class="sl70-heading"><span>OVERALL ESTIMATED STRENGTH '+hint("index")+'</span><small>'+labels+'</small></div><strong class="sl70-big">'+headline+'</strong><p>'+(overall===null?"Log the same exercise in at least two sessions to begin measuring progress.":"Median change across "+comparable.length+" comparable exercises. A positive value suggests improving performance.")+'</p><div class="sl70-subnote">Uses weight + reps, not just the heaviest weight.</div></section>'+
 '<section class="sl70-kpis"><div><small>EXERCISES IMPROVING '+hint("improving")+'</small><strong>'+improving+' / '+classified.length+'</strong><span>With enough sessions to classify</span></div><div><small>NEW STRENGTH BESTS '+hint("pb")+'</small><strong>'+pbs+'</strong><span>Exercises setting a new high</span></div></section>'+
 '<section class="sl70-card"><div class="sl70-heading"><h3>Your key lifts</h3>'+hint("strength")+'</div><p>Progress uses estimated strength from your best completed set each session. Tap a lift for its trend and next step.</p>'+(ordered.length?ordered.map((x,i)=>{const previous=x.first,last=x.last;const open=expanded.has(x.name);const lastTwo=x.p.slice(-2);let advice="Keep logging comparable sets to establish your trend.";if(x.status==="Improving")advice="You are progressing. Keep adding reps within your target range; increase weight only when all sets reach the top with good form and 1–2 RIR.";else if(x.status==="Stable")advice="Performance is steady. Check rest, technique, sleep and RIR before changing the load.";else if(x.status==="Declining")advice="Recent performance is lower. Check recovery, technique and training consistency; avoid forcing a weight increase.";return '<article class="sl70-lift"><button type="button" data-sl70-ex="'+i+'" class="sl70-lift-toggle" aria-expanded="'+open+'"><span><b>'+esc(x.name)+'</b><small>'+(previous?previous.weight+' lb × '+previous.reps+' → '+last.weight+' lb × '+last.reps:'No sets')+'</small></span><span class="sl70-lift-result"><b>'+pctText(x.pct)+'</b><small>'+x.status+'</small></span></button>'+(open?'<div class="sl70-lift-detail">'+svg(x.p)+'<div class="sl70-detail-row"><span>'+x.p.length+' logged sessions</span><span>Latest e1RM: '+format(last.score)+' lb</span></div><p><b>Next step:</b> '+advice+'</p></div>':'')+'</article>'}).join(""):'<p class="sl70-empty">No completed sets logged for this period.</p>')+'</section>'+
 '<section class="sl70-card"><div class="sl70-heading"><h3>Strength by muscle group</h3>'+hint("index")+'</div><p>Median change across comparable exercises in each group. Groups without sufficient data are omitted.</p>'+(groupSummaries.length?groupSummaries.map(g=>'<div class="sl70-group"><div><b>'+esc(g.name)+'</b><span>'+pctText(g.pct)+'</span></div><div class="sl70-bar"><span style="width:'+Math.min(100,Math.max(2,50+(g.pct||0)*2))+'%"></span></div><small>'+g.count+' exercises compared</small></div>').join(""):'<p class="sl70-empty">Log repeat sessions to see muscle-group trends.</p>')+'</section>'+
 '<section class="sl70-card"><div class="sl70-heading"><h3>Training consistency</h3>'+hint("volume")+'</div><div class="sl70-three"><div><small>WORKOUTS</small><strong>'+logs.length+'</strong></div><div><small>SETS</small><strong>'+sets+'</strong></div><div><small>VOLUME</small><strong>'+Math.round(volume).toLocaleString()+'</strong></div></div><p>Volume is logged weight × reps, not a strength score.</p></section>'+
 '<section class="sl70-card"><div class="sl70-heading"><h3>Body composition</h3>'+hint("body")+'</div><div class="sl70-two"><div><small>LAST WEIGHT</small><strong>'+(latest("weight")?latest("weight").weight+" lb":"Not logged")+'</strong></div><div><small>LAST WAIST</small><strong>'+(latest("waist")?latest("waist").waist+" in":"Not logged")+'</strong></div></div><button class="sl70-body-button" id="sl70-body">Log measurements</button></section>'+
 '<p class="sl70-foot">Estimated strength is not a measured maximum or proof of muscle growth. Compare the same movement with similar form and effort. No workout history has been changed.</p>';
 app.querySelectorAll("[data-sl70-period]").forEach(b=>b.onclick=()=>{period=b.dataset.sl70Period;build()});
 app.querySelectorAll("[data-sl70-ex]").forEach(b=>b.onclick=()=>{const x=ordered[Number(b.dataset.sl70Ex)];if(expanded.has(x.name))expanded.delete(x.name);else expanded.add(x.name);build()});
 app.querySelectorAll("[data-sl70-info]").forEach(b=>b.onclick=()=>alert(info[b.dataset.sl70Info]||"Metric information unavailable."));
 app.querySelector("#sl70-body").onclick=()=>{page="body";render();window.scrollTo(0,0)};
}
progressView=build;
render();
})();