/* Strength Lab 6.1 — crash-safe active drafts and exercise-specific rest */
(()=>{
"use strict";
const DRAFT_KEY="strength-lab-active-draft-v1";
const SNAP_KEY="strength-lab-recovery-snapshot-v1";
const SNAP_INTERVAL=300000;
let savedAt=0,restEnd=0,restDuration=90,restPaused=null,clock=null,lastRestSet="";
const safe=s=>escapeHTML(String(s??""));
function restFor(name){
 if(/hack squat|romanian deadlift|deadlift|flat dumbbell bench|incline dumbbell press|hip thrust|leg press/i.test(name))return 180;
 if(/lunge|pulldown|row|dumbbell shoulder press/i.test(name))return 120;
 if(/cable crunch|pallof press|calf raise/i.test(name))return 75;
 return 90;
}
function clockText(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function draftPayload(){return {version:1,day,program:PROGRAMS[day]?.name,cardio,exercises:structuredClone(draft),savedAt:Date.now()}}
function validPayload(x){return x&&Number.isInteger(x.day)&&x.day>=0&&x.day<PROGRAMS.length&&Array.isArray(x.exercises)&&x.exercises.length>0&&x.exercises.every(e=>e&&typeof e.name==="string"&&Array.isArray(e.sets))}
function persist(snapshot=false){try{const x=draftPayload();localStorage.setItem(DRAFT_KEY,JSON.stringify(x));savedAt=x.savedAt;if(snapshot)localStorage.setItem(SNAP_KEY,JSON.stringify(x));status();return true}catch(e){status(true);return false}}
function restore(){
 let x=null;try{x=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!validPayload(x))x=JSON.parse(localStorage.getItem(SNAP_KEY)||"null")}catch{x=null}
 if(!validPayload(x))return;
 day=x.day;draft=x.exercises;cardio=!!x.cardio;savedAt=x.savedAt||0;
}
function status(error=false){const el=document.querySelector("#sl61-status");if(el)el.textContent=error?"Could not save — check device storage":savedAt?"Saved locally · "+new Date(savedAt).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"Ready to save";}
function widget(){
 if(page!=="train")return;
 const app=document.querySelector("#app");if(!app)return;
 // Replace the old fixed 90-second timer to avoid two conflicting timers.
 app.querySelectorAll(".sl55-rest").forEach(el=>el.remove());
 const panel=document.createElement("section");panel.className="sl61-panel";
 panel.innerHTML='<div class="sl61-top"><div><small>WORKOUT RECOVERY</small><strong id="sl61-status">Ready to save</strong></div><span class="sl61-check">✓ Local autosave</span></div><div class="sl61-timer"><div><small id="sl61-rest-label">REST TIMER</small><strong id="sl61-time">0:00</strong></div><div class="sl61-timer-actions"><button type="button" id="sl61-toggle">Start</button><button type="button" id="sl61-plus">+30 sec</button><button type="button" id="sl61-skip">Skip</button></div></div><p>Rest begins automatically when you complete a set. Your unfinished workout is saved after every edit and backed up every five minutes.</p>';
 const first=app.querySelector(".sl55-overview")||app.querySelector(".workout-picker");if(first)first.after(panel);else app.prepend(panel);
 const labels=app.querySelectorAll(".lift-card");labels.forEach((card,i)=>{const name=draft[i]?.name||"";const seconds=restFor(name);const badge=document.createElement("div");badge.className="sl61-rest-hint";badge.textContent="Recommended rest: "+clockText(seconds)+" between sets";const heading=card.querySelector(".lift-heading")||card.querySelector("h3");if(heading)heading.after(badge);else card.prepend(badge)});
 panel.querySelector("#sl61-toggle").onclick=()=>{if(restEnd){restPaused=Math.max(0,restEnd-Date.now());restEnd=0}else{restEnd=Date.now()+(restPaused??restDuration*1000);restPaused=null}tick()};
 panel.querySelector("#sl61-plus").onclick=()=>{if(restEnd)restEnd+=30000;else if(restPaused!==null)restPaused+=30000;else restDuration+=30;tick()};
 panel.querySelector("#sl61-skip").onclick=()=>{restEnd=0;restPaused=null;tick()};
 tick();status();
}
function tick(){if(page!=="train")return;const display=document.querySelector("#sl61-time");if(!display)return;const remaining=restEnd?Math.max(0,restEnd-Date.now()):restPaused!==null?restPaused:0;display.textContent=clockText(remaining/1000);const button=document.querySelector("#sl61-toggle");if(button)button.textContent=restEnd?"Pause":restPaused!==null?"Resume":"Start";if(restEnd&&remaining===0){restEnd=0;restPaused=null;display.textContent="0:00"}}
function startRest(i,j){const name=draft[i]?.name||"";restDuration=restFor(name);restEnd=Date.now()+restDuration*1000;restPaused=null;lastRestSet=i+":"+j;const label=document.querySelector("#sl61-rest-label");if(label)label.textContent="REST · "+name;tick()}
function updateFromInput(el){const i=Number(el.dataset.i),j=Number(el.dataset.j),field=el.dataset.field;if(!draft[i]?.sets[j])return;const set=draft[i].sets[j];const before=!!set.done;set[field]=field==="done"?!!el.checked:el.value===""?"":Number(el.value)||0;persist();if(field==="done"&&set.done&&!before)startRest(i,j)}
// Capture input before existing change handlers. This includes edits not yet blurred.
document.addEventListener("input",e=>{const el=e.target;if(page!=="train"||!el.matches?.('[data-field]'))return;updateFromInput(el)},true);
document.addEventListener("change",e=>{const el=e.target;if(page!=="train")return;if(el.matches?.('[data-field]'))updateFromInput(el);else if(el.id==="cardio"){cardio=el.checked;persist()}},true);
document.addEventListener("change",e=>{const el=e.target;if(page!=="train"||el.id!=="day")return;const next=Number(el.value);if(next===day)return;const hasEdits=draft.some(x=>x.sets.some(s=>s.done||s.reps!==""));if(hasEdits&&!confirm("Start a different workout? Your current unfinished workout will be replaced. Export a backup first if needed.")){el.value=String(day);e.stopImmediatePropagation();return}day=next;newDraft();persist(true)},true);
document.addEventListener("click",e=>{const el=e.target.closest?.("#finish");if(!el||page!=="train")return;const done=draft.some(x=>x.sets.some(s=>s.done));if(!done)return; // Existing handler saves the completed workout.
 // Only clear the active draft after the original save handler has run.
 setTimeout(()=>{if(page==="progress"){localStorage.removeItem(DRAFT_KEY);localStorage.removeItem(SNAP_KEY);savedAt=0;restEnd=0;restPaused=null}},0);
},true);
const priorTrain=trainView;trainView=function(){priorTrain();widget()};
restore(); // Restore unfinished work before showing the enhanced tracker.
persist(false);
setInterval(()=>{if(draft.length)persist(true)},SNAP_INTERVAL);
setInterval(tick,500);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&draft.length)persist(true);else tick()});
window.addEventListener("pagehide",()=>{if(draft.length)persist(true)});
render();
})();