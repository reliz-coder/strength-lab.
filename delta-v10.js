/* Delta Lab 10.0 — focused training + performance-first insights.
   Non-destructive enhancement: original controls, listeners, data and backup remain intact. */
(()=>{
"use strict";
const esc=x=>escapeHTML(String(x??""));
let focusIndex=0,focused=true,range="all",selected="";
const n=x=>Number(x)||0,stamp=x=>new Date(String(x||"")+"T12:00:00").getTime()||0;
const e1rm=(w,reps)=>w>0&&reps>0&&reps<=15?w*(1+reps/30):null;
function focusTrain(){
 if(page!=="train")return;
 const app=document.querySelector("#app"),cards=[...app.querySelectorAll(".sl55-exercise[data-exercise]")];
 if(!cards.length)return;
 const visible=cards.filter(c=>c.offsetParent!==null||c.classList.contains("sl74-training-card"));
 const list=visible.length?visible:cards;
 focusIndex=Math.min(focusIndex,list.length-1);
 const first=list[0];
 let bar=app.querySelector(".dl10-exercise-nav");
 if(!bar){bar=document.createElement("section");bar.className="dl10-exercise-nav";first.before(bar)}
 const current=list[focusIndex];
 bar.innerHTML='<div class="dl10-navtop"><div><small>ACTIVE WORKOUT</small><strong>'+esc(PROGRAMS[day]?.name||"Workout")+'</strong></div><button type="button" id="dl10-focus">'+(focused?"Show all exercises":"Focus mode")+'</button></div><div class="dl10-pills" role="group" aria-label="Choose exercise">'+list.map((c,i)=>{const ex=draft[Number(c.dataset.exercise)];const done=ex?.sets?.length&&ex.sets.every(s=>s.done);return '<button type="button" class="'+(i===focusIndex?"selected ":"")+(done?"finished":"")+'" data-dl10-ex="'+i+'">'+(done?"✓ ":"")+(i+1)+'. '+esc(ex?.name||"Exercise")+'</button>'}).join("")+'</div><div class="dl10-navfoot"><span>Exercise '+(focusIndex+1)+' of '+list.length+'</span><button type="button" id="dl10-prev" '+(focusIndex===0?"disabled":"")+'>← Previous</button><button type="button" id="dl10-next" '+(focusIndex===list.length-1?"disabled":"")+'>Next →</button></div>';
 list.forEach((card,i)=>{
  card.classList.toggle("dl10-hidden",focused&&i!==focusIndex);
  if(!card.querySelector(".dl10-complete"))card.querySelectorAll(".sl55-setrow").forEach(row=>{
   if(row.querySelector(".dl10-complete"))return;
   const done=row.querySelector('[data-field="done"]');
   if(!done)return;
   const b=document.createElement("button");b.type="button";b.className="dl10-complete";
   const paint=()=>{b.textContent=done.checked?"✓ Set completed":"✓ Complete set";b.classList.toggle("is-done",done.checked)};
   paint();b.addEventListener("click",()=>{done.checked=!done.checked;done.dispatchEvent(new Event("change",{bubbles:true}));paint();});
   done.addEventListener("change",paint);row.append(b);
  });
  const swap=card.querySelector(".swap-row");
  if(swap&&!swap.closest("details.dl10-swap")){
   const details=document.createElement("details");details.className="dl10-swap";
   const summary=document.createElement("summary");summary.textContent="Swap exercise · alternatives";
   swap.before(details);details.append(summary,swap);
  }
 });
 const move=i=>{focusIndex=Math.max(0,Math.min(list.length-1,i));focusTrain();bar.scrollIntoView({block:"start",behavior:"smooth"})};
 bar.querySelectorAll("[data-dl10-ex]").forEach(b=>b.onclick=()=>move(Number(b.dataset.dl10Ex)));
 bar.querySelector("#dl10-prev").onclick=()=>move(focusIndex-1);
 bar.querySelector("#dl10-next").onclick=()=>move(focusIndex+1);
 bar.querySelector("#dl10-focus").onclick=()=>{focused=!focused;focusTrain()};
}
const oldTrain=trainView;
trainView=function(){oldTrain();focusTrain()};
function dataset(){
 const map=new Map();
 for(const session of state.sessions||[])for(const ex of session.exercises||[])for(const set of ex.sets||[]){
  if(!set.done)continue;
  const score=e1rm(n(set.weight),n(set.reps));if(score===null)continue;
  const name=ex.name||"Exercise",key=String(session.id)+"|"+session.date;
  if(!map.has(name))map.set(name,new Map());
  const m=map.get(name),old=m.get(key);
  if(!old||score>old.score)m.set(key,{score,date:session.date,weight:n(set.weight),reps:n(set.reps),ts:stamp(session.date)});
 }
 return [...map].map(([name,points])=>({name,points:[...points.values()].sort((a,b)=>a.ts-b.ts)})).sort((a,b)=>b.points.length-a.points.length||a.name.localeCompare(b.name));
}
function chart(points){
 if(points.length<2)return '<p class="dl10-empty">Log this lift in another session to establish a trend.</p>';
 const vals=points.map(x=>x.score),min=Math.min(...vals),max=Math.max(...vals),pad=Math.max(2,(max-min)*.15),lo=min-pad,hi=max+pad;
 const coords=points.map((x,i)=>[28+i*310/Math.max(1,points.length-1),160-(x.score-lo)/(hi-lo)*132]);
 return '<svg class="dl10-chart" viewBox="0 0 370 195" role="img" aria-label="Estimated one-rep maximum over logged sessions"><path d="M28 28H338M28 94H338M28 160H338" stroke="#34404d" stroke-dasharray="4 6" fill="none"/><polyline points="'+coords.map(p=>p.join(",")).join(" ")+'" fill="none" stroke="#ff990c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'+coords.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#ffb44c" stroke="#14181e" stroke-width="2"/>').join("")+'<text x="28" y="184" fill="#a8aeb8" font-size="11">'+esc(points[0].date)+'</text><text x="338" y="184" fill="#a8aeb8" font-size="11" text-anchor="end">'+esc(points.at(-1).date)+'</text></svg>';
}
function insights(){
 if(page!=="progress")return;
 const app=document.querySelector("#app");if(!app)return;
 const all=dataset(),threshold=range==="all"?0:Date.now()-Number(range)*86400000;
 const candidates=all.map(ex=>({...ex,filtered:ex.points.filter(p=>p.ts>=threshold)})).filter(ex=>ex.filtered.length);
 if(!candidates.some(x=>x.name===selected))selected=(candidates[0]||{}).name||"";
 const current=candidates.find(x=>x.name===selected),p=current?.filtered||[],latest=p.at(-1);
 const ranked=candidates.filter(x=>x.filtered.length>=2).map(x=>({...x,change:(x.filtered.at(-1).score/x.filtered[0].score-1)*100})).sort((a,b)=>b.change-a.change);
 const top=ranked.filter(x=>x.change>0).slice(0,3);
 const panel=document.createElement("section");panel.className="dl10-insights";
 panel.innerHTML='<div class="dl10-kicker">DELTA LAB · PERFORMANCE</div><h2>Insights</h2><p>Measure the change. Build on what works.</p><div class="dl10-insight-card"><h3>Estimated strength progression</h3><label for="dl10-lift">Exercise</label><select id="dl10-lift">'+candidates.map(x=>'<option '+(x.name===selected?"selected":"")+' value="'+esc(x.name)+'">'+esc(x.name)+'</option>').join("")+'</select><div class="dl10-period" role="group" aria-label="Chart timeframe">'+[["30","Last 30 days"],["90","Last 90 days"],["all","All time"]].map(([v,l])=>'<button data-dl10-range="'+v+'" class="'+(range===v?"selected":"")+'">'+l+'</button>').join("")+'</div><div class="dl10-graph"><div class="dl10-latest"><small>LATEST e1RM</small><strong>'+(latest?latest.score.toFixed(1)+" lb":"—")+'</strong></div>'+chart(p)+'</div><p class="dl10-method">Estimated 1RM uses weight × (1 + reps / 30), for completed sets of 1–15 reps. Not a tested maximum.</p></div><div class="dl10-insight-card"><div class="dl10-section-title"><h3>Top improvements</h3><span>GAINING</span></div>'+(top.length?top.map((x,i)=>'<div class="dl10-gain"><span class="dl10-rank">'+(i+1)+'</span><div><strong>'+esc(x.name)+'</strong><small>'+x.filtered.length+' comparable sessions</small></div><b>+'+x.change.toFixed(1)+'%</b></div>').join(""):'<p class="dl10-empty">More comparable sessions are needed to rank improvements.</p>')+'</div><details class="dl10-legacy"><summary>All exercise trends, training metrics & workout history</summary><div id="dl10-original"></div></details>';
 const original=document.createElement("div");original.id="dl10-old-content";
 while(app.firstChild)original.append(app.firstChild);
 app.append(panel);
 panel.querySelector("#dl10-original").append(original);
 panel.querySelector("#dl10-lift").onchange=e=>{selected=e.target.value;progressView()};
 panel.querySelectorAll("[data-dl10-range]").forEach(b=>b.onclick=()=>{range=b.dataset.dl10Range;progressView()});
}
const oldProgress=progressView;
progressView=function(){oldProgress();insights()};
render();
})();
