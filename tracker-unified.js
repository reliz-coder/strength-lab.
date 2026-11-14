/* Strength Lab 5.6: unified tracker-first dashboard, logger, library and analytics */
(()=>{
"use strict";
const esc=s=>escapeHTML(String(s??""));
const totals=()=>{const sessions=state.sessions||[];let sets=0,volume=0;for(const session of sessions)for(const ex of session.exercises||[])for(const set of ex.sets||[])if(set.done){sets++;volume+=(Number(set.weight)||0)*(Number(set.reps)||0)}return {sessions:sessions.length,sets,volume}};
function recent(name){for(const session of [...state.sessions].reverse()){const ex=(session.exercises||[]).find(x=>x.name===name);if(ex){const sets=(ex.sets||[]).filter(s=>s.done);if(sets.length)return {date:session.date,sets}}}return null}
function hero(){
 if(page!=="train")return;
 const app=document.querySelector("#app"),overview=app?.querySelector(".sl55-overview");if(!app)return;
 const metrics=totals(),last=state.sessions?.at(-1),next=PROGRAMS[day];
 const panel=document.createElement("section");panel.className="sl56-home";
 panel.innerHTML='<div class="sl56-kicker">YOUR TRAINING HUB</div><div class="sl56-home-title"><div><h2>Ready to train?</h2><p>Continue your rolling strength program</p></div><span class="sl56-orbit">✦</span></div><div class="sl56-home-grid"><div><small>WORKOUTS LOGGED</small><strong>'+metrics.sessions+'</strong></div><div><small>SETS COMPLETED</small><strong>'+metrics.sets+'</strong></div><div><small>TOTAL VOLUME</small><strong>'+Math.round(metrics.volume).toLocaleString()+'</strong><em>lb</em></div></div><div class="sl56-next"><span>SELECTED SESSION</span><strong>'+esc(next.name)+'</strong><small>'+next.items.length+' exercises · 75-minute lifting goal</small></div><button type="button" class="sl56-cta" id="sl56-jump">Continue workout <span>→</span></button>'+(last?'<p class="sl56-last">Last logged: '+esc(last.program)+' · '+esc(last.date)+'</p>':'<p class="sl56-last">Your workout history stays on this device.</p>');
 if(overview)overview.before(panel);else app.prepend(panel);
 panel.querySelector("#sl56-jump").onclick=()=>document.querySelector(".sl55-list-heading,.sl-workout-anchor,.lift-card")?.scrollIntoView({behavior:"smooth",block:"start"});
 const exerciseCards=[...app.querySelectorAll(".sl55-exercise")];
 for(const card of exerciseCards){
  const i=Number(card.dataset.exercise),ex=draft[i];if(!ex)continue;
  const last=recent(ex.name),header=card.querySelector(".sl55-ex-head");
  if(header){const meta=document.createElement("div");meta.className="sl56-exmeta";meta.innerHTML='<span>'+esc(ex.range)+' reps</span><span>'+(last?'Last: '+esc(last.date):'First session')+'</span>';header.after(meta)}
  const sets=card.querySelectorAll(".sl55-setrow");
  sets.forEach((row,j)=>{
   const weight=row.querySelector('[data-field="weight"]'),reps=row.querySelector('[data-field="reps"]'),rir=row.querySelector('[data-field="rir"]');
   if(!weight||!reps||!rir)return;
   row.classList.add("sl56-logrow");
   const bar=document.createElement("div");bar.className="sl56-quick";bar.innerHTML='<button type="button" data-adjust="-2.5">−2.5 lb</button><button type="button" data-adjust="2.5">+2.5 lb</button><button type="button" data-copy>Copy previous</button>';
   row.append(bar);
   bar.querySelectorAll("[data-adjust]").forEach(b=>b.onclick=()=>{const val=Math.max(0,(Number(weight.value)||0)+Number(b.dataset.adjust));weight.value=val;weight.dispatchEvent(new Event("change",{bubbles:true}))});
   bar.querySelector("[data-copy]").onclick=()=>{const p=last?.sets?.[j]||last?.sets?.[0];if(!p)return;for(const [el,v] of [[weight,p.weight],[reps,p.reps],[rir,p.rir??2]]){el.value=v;el.dispatchEvent(new Event("change",{bubbles:true}))}};
   if(!last)bar.querySelector("[data-copy]").disabled=true;
  });
 }
}
function library(){
 if(page!=="guide")return;
 const app=document.querySelector("#app");if(!app)return;
 const header=document.createElement("section");header.className="sl56-library-head";
 const names=[...new Set(typeof EXERCISES!=="undefined"?EXERCISES:PROGRAMS.flatMap(p=>p.items.map(x=>x[0])))].sort();
 header.innerHTML='<div class="sl56-kicker">EXERCISE EXPLORER</div><h2>Find your next movement</h2><p>Search the full library, including workout alternatives. Tap a result to view its exercise guide.</p><input type="search" id="sl56-search" placeholder="Search exercises…" autocomplete="off"><div class="sl56-chips"><button data-filter="all" class="active">All</button><button data-filter="upper">Upper body</button><button data-filter="lower">Lower body</button><button data-filter="core">Core</button></div><div class="sl56-results" id="sl56-results"></div>';
 app.prepend(header);
 let filter="all";
 const group=n=>/squat|lunge|leg |calf|hip |glute|deadlift|step.up|hamstring|abduction/i.test(n)?"lower":/crunch|plank|pallof|knee raise|dead bug|ab wheel/i.test(n)?"core":"upper";
 const paint=()=>{
  const q=header.querySelector("#sl56-search").value.trim().toLowerCase();
  const found=names.filter(n=>(filter==="all"||group(n)===filter)&&n.toLowerCase().includes(q));
  header.querySelector("#sl56-results").innerHTML='<small>'+found.length+' matching exercises</small>'+found.slice(0,60).map(n=>'<button type="button" class="sl56-result" data-exercise="'+esc(n)+'"><span>'+esc(n)+'</span><span>View guide →</span></button>').join("")+(found.length>60?'<p>Refine your search to see more results.</p>':'');
  header.querySelectorAll("[data-exercise]").forEach(b=>b.onclick=()=>{
   selectedExercise=b.dataset.exercise;
   if(typeof showDetail==="function")showDetail();
   document.querySelector("#exerciseDetail")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
 };
 header.querySelector("#sl56-search").addEventListener("input",paint);
 header.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;header.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));paint()});
 paint();
}
function analytics(){
 if(page!=="progress")return;
 const app=document.querySelector("#app");if(!app)return;
 const sessions=state.sessions||[],now=Date.now(),weeks=Array.from({length:6},(_,i)=>{const end=now-(5-i)*7*86400000,start=end-7*86400000;let count=0,volume=0;for(const s of sessions){const d=new Date(s.date+"T12:00:00").getTime();if(d>=start&&d<end)for(const ex of s.exercises||[])for(const set of ex.sets||[])if(set.done){count++;volume+=(Number(set.weight)||0)*(Number(set.reps)||0)}}return {count,volume}}),max=Math.max(1,...weeks.map(w=>w.volume));
 const panel=document.createElement("section");panel.className="sl56-analytics";
 panel.innerHTML='<div class="sl56-kicker">PERFORMANCE INSIGHTS</div><h2>Your training consistency</h2><p>Six rolling seven-day periods · completed sets and logged volume</p><div class="sl56-bars">'+weeks.map((w,i)=>'<div class="sl56-barcol"><strong>'+w.count+'</strong><div class="sl56-bartrack"><span style="height:'+Math.max(3,Math.round(w.volume/max*100))+'%"></span></div><small>W'+(i+1)+'</small></div>').join("")+'</div><div class="sl56-legend">Bar height: logged volume (lb × reps). Numbers: completed sets.</div><div class="sl56-analytics-grid"><div><small>AVERAGE SETS / SESSION</small><strong>'+(sessions.length?(sessions.reduce((a,s)=>a+(s.exercises||[]).reduce((n,e)=>n+(e.sets||[]).filter(z=>z.done).length,0),0)/sessions.length).toFixed(1):"—")+'</strong></div><div><small>SESSIONS IN LAST 7 DAYS</small><strong>'+sessions.filter(s=>new Date(s.date+"T12:00:00").getTime()>now-7*86400000).length+'</strong></div></div>';
 app.prepend(panel);
}
const oldTrain=trainView;trainView=function(){oldTrain();hero()};
const oldGuide=guideView;guideView=function(){oldGuide();library()};
const oldProgress=progressView;progressView=function(){oldProgress();analytics()};
render();
})();