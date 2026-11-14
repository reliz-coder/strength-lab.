/* Strength Lab 5.5 — tracker-first training experience, inspired by gym loggers. */
(()=>{
"use strict";
const REST_SECONDS=90;
let restEnds=0,timer=null;
function secs(n){n=Math.max(0,Math.ceil(n));return Math.floor(n/60)+":"+String(n%60).padStart(2,"0")}
function lastSet(name,index){
 for(const session of [...state.sessions].reverse()){
  const ex=session.exercises?.find(x=>x.name===name);
  const set=ex?.sets?.[index];
  if(set?.done)return set;
 }
 return null;
}
function updateMetrics(){
 const all=draft.flatMap(x=>x.sets),done=all.filter(s=>s.done);
 const count=document.getElementById("sl55-done"),volume=document.getElementById("sl55-volume"),bar=document.getElementById("sl55-progress");
 if(count)count.textContent=done.length+" / "+all.length;
 if(volume)volume.textContent=Math.round(done.reduce((n,s)=>n+(Number(s.weight)||0)*(Number(s.reps)||0),0)).toLocaleString()+" lb";
 if(bar)bar.style.width=(all.length?done.length/all.length*100:0)+"%";
 document.querySelectorAll(".sl55-exercise").forEach(card=>{
  const i=Number(card.dataset.exercise),sets=draft[i]?.sets||[];
  const finished=sets.filter(s=>s.done).length;
  const label=card.querySelector(".sl55-setcount");
  if(label)label.textContent=finished+"/"+sets.length+" sets";
  card.classList.toggle("sl55-complete",finished===sets.length&&sets.length>0);
 });
}
function refreshTimer(){
 const display=document.getElementById("sl55-clock");
 if(!display){if(timer){clearInterval(timer);timer=null}return}
 const left=Math.max(0,(restEnds-Date.now())/1000);
 display.textContent=secs(left);
 if(left<=0){restEnds=0;display.closest(".sl55-rest")?.classList.remove("active");if(timer){clearInterval(timer);timer=null}}
}
function startRest(){
 restEnds=Date.now()+REST_SECONDS*1000;
 const widget=document.querySelector(".sl55-rest");
 if(widget)widget.classList.add("active");
 refreshTimer();
 if(timer)clearInterval(timer);
 timer=setInterval(refreshTimer,250);
}
function addTracker(){
 if(page!=="train")return;
 const app=document.getElementById("app");if(!app)return;
 const total=draft.reduce((n,x)=>n+x.sets.length,0);
 const intro=document.createElement("section");intro.className="sl55-overview";
 intro.innerHTML='<div class="sl55-eyebrow">WORKOUT TRACKER · STRENGTH LAB</div><div class="sl55-overview-top"><div><div class="sl55-date">TODAY’S SESSION</div><h2>'+escapeHTML(PROGRAMS[day].name)+'</h2><p>Rolling rotation · 75-minute lifting goal</p></div><span class="sl55-bolt">↗</span></div><div class="sl55-metrics"><div><small>COMPLETED SETS</small><strong id="sl55-done">0 / '+total+'</strong></div><div><small>TRAINING VOLUME</small><strong id="sl55-volume">0 lb</strong></div><div><small>EXERCISES</small><strong>'+draft.length+'</strong></div></div><div class="sl55-progress"><span id="sl55-progress"></span></div></section>';
 const hero=app.querySelector(".sl-hero");
 if(hero)hero.after(intro);else app.prepend(intro);
 const heading=document.createElement("div");heading.className="sl55-list-heading";heading.innerHTML='<h3>Log your sets</h3><span>Tap a checkmark to complete</span>';
 const first=app.querySelector(".lift-card")||app.querySelector(".sl-workout-anchor")||app.querySelector("[data-field]")?.closest(".card");
 if(first)first.before(heading);
 const fields=[...app.querySelectorAll('[data-field="done"]')];
 const cards=new Map();
 for(const input of fields){
  const i=Number(input.dataset.i),j=Number(input.dataset.j);
  const card=input.closest(".lift-card")||input.closest(".card");
  if(!card)continue;
  if(!cards.has(i)){
   cards.set(i,card);card.classList.add("sl55-exercise");card.dataset.exercise=i;
   const title=card.querySelector("h2,h3");
   const header=document.createElement("div");header.className="sl55-ex-head";
   header.innerHTML='<span class="sl55-index">'+String(i+1).padStart(2,"0")+'</span><span class="sl55-setcount"></span>';
   if(title)title.before(header);else card.prepend(header);
  }
  const setRow=input.closest(".set")||input.closest(".set-row")||input.parentElement?.parentElement;
  if(setRow){
   setRow.classList.add("sl55-setrow");
   const prior=lastSet(draft[i].name,j);
   const hint=document.createElement("span");hint.className="sl55-prior";
   hint.textContent=prior?"LAST "+prior.weight+" lb × "+prior.reps:"FIRST LOG";
   const row=setRow.querySelector(".row")||setRow;
   row.append(hint);
  }
  input.addEventListener("change",()=>{
   updateMetrics();
   if(input.checked)startRest();
  });
 }
 const rest=document.createElement("div");rest.className="sl55-rest";
 rest.innerHTML='<div><small>REST TIMER</small><strong id="sl55-clock">1:30</strong></div><div class="sl55-rest-actions"><button type="button" id="sl55-restart">Restart</button><button type="button" id="sl55-skip">Skip</button></div>';
 app.append(rest);
 rest.querySelector("#sl55-restart").onclick=startRest;
 rest.querySelector("#sl55-skip").onclick=()=>{restEnds=0;refreshTimer()};
 updateMetrics();if(restEnds>Date.now()){rest.classList.add("active");refreshTimer();if(timer)clearInterval(timer);timer=setInterval(refreshTimer,250)}
}
const priorTrain=trainView;
trainView=function(){priorTrain();addTracker()};
const priorProgress=progressView;
progressView=function(){
 priorProgress();
 const app=document.getElementById("app");if(!app)return;
 const sessions=state.sessions||[];
 const completed=sessions.flatMap(s=>s.exercises||[]).flatMap(x=>x.sets||[]).filter(x=>x.done);
 const volume=Math.round(completed.reduce((n,s)=>n+(Number(s.weight)||0)*(Number(s.reps)||0),0));
 const best=new Map();
 sessions.forEach(s=>(s.exercises||[]).forEach(x=>(x.sets||[]).filter(z=>z.done).forEach(z=>{const w=Number(z.weight)||0;if(w>(best.get(x.name)||0))best.set(x.name,w)})));
 const summary=document.createElement("section");summary.className="sl55-progress-summary";
 summary.innerHTML='<div class="sl55-eyebrow">YOUR TRAINING AT A GLANCE</div><h2>Performance overview</h2><div class="sl55-metrics"><div><small>TOTAL VOLUME</small><strong>'+volume.toLocaleString()+' lb</strong></div><div><small>PERSONAL BESTS</small><strong>'+best.size+'</strong></div><div><small>SESSIONS</small><strong>'+sessions.length+'</strong></div></div><p>Volume is the sum of logged weight × reps. Personal bests count exercises with a recorded maximum load, not verified strength records.</p>';
 app.prepend(summary);
};
render();
})();