/* Strength Lab 7.2 — Select → Start → Train. No changes to workout history. */
(()=>{
"use strict";
let started=false,advanced=false,activeDay=null;
const captions=["Chest · Shoulders · Triceps","Back · Biceps","Quads · Glutes · Core","Chest · Back · Arms","Hamstrings · Glutes · Core"];
const esc=v=>escapeHTML(String(v??""));
const doneCount=()=>draft.reduce((a,e)=>a+(e.sets||[]).filter(s=>s.done).length,0);
function setup(){
 if(page!=="train")return;
 const app=document.querySelector("#app");if(!app)return;
 const exercise=[...app.querySelectorAll(".sl55-exercise")];
 if(!exercise.length)return;
 const first=exercise[0];
 const selector=app.querySelector("#day");
 if(!selector)return;
 const hasWork=doneCount()>0;
 if(activeDay!==day){started=hasWork;activeDay=day}
 const launch=document.createElement("section");launch.className="sl72-launch";
 launch.innerHTML='<div class="sl72-launch-head"><div><small>STRENGTH LAB · TODAY</small><h2 id="sl72-title">'+esc(PROGRAMS[day].name)+'</h2></div><span class="sl72-status" id="sl72-state">'+(started?"In progress":"Ready")+'</span></div><div class="sl72-picker"><label for="day">SELECT WORKOUT</label><div id="sl72-select-slot"></div><p id="sl72-caption">'+esc(captions[day]||"Strength training")+' · '+draft.length+' exercises</p></div><button type="button" class="sl72-start" id="sl72-start">'+(hasWork?"Resume Workout":"Start Workout")+' →</button><button type="button" class="sl72-options" id="sl72-options" aria-expanded="false">Coach targets & session options ⌄</button><div class="sl72-extra" id="sl72-extra" hidden></div><div class="sl72-active" id="sl72-active" hidden><span>Workout in progress · '+esc(PROGRAMS[day].short)+'</span><button type="button" id="sl72-change">Change workout</button></div>';
 app.insertBefore(launch,app.firstChild);
 launch.querySelector("#sl72-select-slot").append(selector);
 const extras=launch.querySelector("#sl72-extra");
 const coach=app.querySelector(".sl-coach-targets");
 if(coach){extras.append(coach);coach.classList.add("sl72-coach")}
 // Preserve original handlers and all feature cards; only collapse introductory UI.
 const hidden=[];
 for(const el of [...app.children]){
  if(el===launch||el===first)break;
  hidden.push(el);el.classList.add("sl72-suppressed");
 }
 // Hide the legacy workout picker if it is nested inside another wrapper.
 for(const el of [...app.querySelectorAll(".sl-program-grid,.sl-plan-bar,.sl-focus-button,.sl56-home,.sl55-overview,.sl61-panel,.sl-hero")]){
  if(!launch.contains(el))el.classList.add("sl72-suppressed");
 }
 // Provide contextual coach guidance inside the matching exercise card.
 if(coach){
  const sections=[...coach.querySelectorAll("div")].filter(el=>el.style.borderBottom&&el.querySelector("strong"));
  for(const section of sections){
   const name=section.querySelector("strong")?.textContent?.trim();
   const idx=draft.findIndex(x=>x.name===name);
   if(idx<0||!exercise[idx])continue;
   const hint=document.createElement("details");hint.className="sl72-target";
   hint.innerHTML='<summary>Coach target · '+esc(name)+'</summary><div>'+section.innerHTML+'</div>';
   const header=exercise[idx].querySelector(".sl55-ex-head")||exercise[idx].firstElementChild;
   if(header)header.after(hint);else exercise[idx].prepend(hint);
  }
 }
 function paint(){
  launch.classList.toggle("sl72-started",started);
  launch.querySelector("#sl72-state").textContent=started?"In progress":"Ready";
  launch.querySelector("#sl72-active").hidden=!started;
  launch.querySelector("#sl72-start").textContent=hasWork?"Resume Workout →":"Start Workout →";
  launch.querySelector("#sl72-options").setAttribute("aria-expanded",String(advanced));
  extras.hidden=!advanced||started;
  // Keep the workout content available in the DOM for autosave and existing listeners.
  for(const el of exercise)el.classList.toggle("sl72-waiting",!started);
  const heading=app.querySelector(".sl55-list-heading");
  if(heading)heading.classList.toggle("sl72-waiting",!started);
  const footer=app.querySelector("#finish")?.closest(".card");
  if(footer)footer.classList.toggle("sl72-waiting",!started);
  // Suppress non-exercise introductory cards, but do not suppress the workout cards.
  for(const el of hidden)el.classList.add("sl72-suppressed");
 }
 launch.querySelector("#sl72-start").onclick=()=>{started=true;advanced=false;paint();requestAnimationFrame(()=>first.scrollIntoView({behavior:"smooth",block:"start"}))};
 launch.querySelector("#sl72-change").onclick=()=>{if(doneCount()>0&&!confirm("Change the workout view? Your logged sets will remain saved in this draft."))return;started=false;paint();launch.scrollIntoView({behavior:"smooth",block:"start"})};
 launch.querySelector("#sl72-options").onclick=()=>{advanced=!advanced;paint()};
 // The original select onchange handler remains attached after moving the element.
 selector.addEventListener("change",()=>{started=false;advanced=false},false);
 paint();
}
const previous=trainView;trainView=function(){previous();setup()};
render();
})();