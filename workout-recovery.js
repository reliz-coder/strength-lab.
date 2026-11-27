/* Strength Lab 6.1 — crash-safe active drafts and exercise-specific rest */
(()=>{
"use strict";
const DRAFT_KEY="strength-lab-active-draft-v1";
const SNAP_KEY="strength-lab-recovery-snapshot-v1";
const SNAP_INTERVAL=300000;
let savedAt=0,restEnd=0,restDuration=90,restPaused=null,clock=null,lastRestSet="",restName="",restExpanded=false,restVisible=false;
const safe=s=>escapeHTML(String(s??""));
function restFor(name){
 if(/hack squat|romanian deadlift|deadlift|flat dumbbell bench|incline dumbbell press|hip thrust|leg press/i.test(name))return 180;
 if(/lunge|pulldown|row|dumbbell shoulder press/i.test(name))return 120;
 if(/cable crunch|pallof press|calf raise/i.test(name))return 75;
 return 90;
}
function clockText(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function draftPayload(){return {version:1,day,program:PROGRAMS[day]?.name,cardio,cardioEntry:cardio?window.deltaCardioDraft?.()??null:null,exercises:structuredClone(draft),savedAt:Date.now()}}
function validPayload(x){return x&&Number.isInteger(x.day)&&x.day>=0&&x.day<PROGRAMS.length&&Array.isArray(x.exercises)&&x.exercises.length>0&&x.exercises.every(e=>e&&typeof e.name==="string"&&Array.isArray(e.sets))}
function persist(snapshot=false){try{const x=draftPayload();localStorage.setItem(DRAFT_KEY,JSON.stringify(x));savedAt=x.savedAt;if(snapshot)localStorage.setItem(SNAP_KEY,JSON.stringify(x));status();return true}catch(e){status(true);return false}}
function restore(){
 let x=null;try{x=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!validPayload(x))x=JSON.parse(localStorage.getItem(SNAP_KEY)||"null")}catch{x=null}
 if(!validPayload(x))return;
 day=x.day;draft=x.exercises;cardio=!!x.cardio;savedAt=x.savedAt||0;
}
function status(error=false){const el=document.querySelector("#sl61-status");if(el)el.textContent=error?"Could not save — check device storage":savedAt?"Saved locally · "+new Date(savedAt).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"Ready to save";}
function ensureFloat(){
 let dock=document.getElementById("sl62-float");
 if(dock)return dock;
 dock=document.createElement("aside");dock.id="sl62-float";dock.className="sl62-float";dock.setAttribute("aria-label","Bottom-pinned workout rest timer");
 dock.innerHTML='<div class="sl62-summary"><button type="button" id="sl62-expand" aria-expanded="false"><span class="sl62-timer-icon dl14-ring"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="#414955" stroke-width="3"/><circle id="dl14-rest-ring" cx="20" cy="20" r="16" fill="none" stroke="#ff8a32" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="100" transform="rotate(-90 20 20)"/></svg></span><span class="sl62-summary-label"><small id="sl62-name">REST TIMER</small><strong id="sl62-time">0:00</strong></span><span class="sl62-expand-label">Controls ⌃</span></button><button type="button" id="sl62-quickskip" aria-label="Skip rest">Skip</button></div><div class="sl62-controls" id="sl62-controls"><button type="button" id="sl62-toggle">Pause</button><button type="button" id="sl62-plus">+30 sec</button><button type="button" id="sl62-skip">Skip rest</button></div><div class="sl62-progress"><span id="sl62-progress"></span></div>';
 document.body.append(dock);
 dock.querySelector("#sl62-expand").onclick=()=>{restExpanded=!restExpanded;tick()};
 dock.querySelector("#sl62-toggle").onclick=()=>{if(restEnd){restPaused=Math.max(0,restEnd-Date.now());restEnd=0}else{restEnd=Date.now()+(restPaused??restDuration*1000);restPaused=null;restVisible=true}tick()};
 dock.querySelector("#sl62-plus").onclick=()=>{if(restEnd)restEnd+=30000;else if(restPaused!==null)restPaused+=30000;else{restDuration+=30;restPaused=restDuration*1000}restVisible=true;tick()};
 const skip=()=>{restEnd=0;restPaused=null;restVisible=false;restExpanded=false;tick()};
 dock.querySelector("#sl62-skip").onclick=skip;dock.querySelector("#sl62-quickskip").onclick=skip;
 return dock;
}
function widget(){
 if(page!=="train")return;
 const app=document.querySelector("#app");if(!app)return;
 app.querySelectorAll(".sl55-rest").forEach(el=>el.remove());
 const panel=document.createElement("section");panel.className="sl61-panel sl62-save";
 panel.innerHTML='<div class="sl61-top"><div><small>WORKOUT RECOVERY</small><strong id="sl61-status">Ready to save</strong></div><span class="sl61-check">✓ Local autosave</span></div><p>Each edit is saved locally, with a recovery snapshot every five minutes. The rest timer stays pinned above the bottom navigation while you train.</p>';
 const first=app.querySelector(".sl55-overview")||app.querySelector(".workout-picker");if(first)first.after(panel);else app.prepend(panel);
 app.querySelectorAll(".lift-card").forEach((card,i)=>{const name=draft[i]?.name||"";const badge=document.createElement("div");badge.className="sl61-rest-hint";badge.textContent="Recommended rest: "+clockText(restFor(name))+" between sets";const heading=card.querySelector(".lift-heading")||card.querySelector("h3");if(heading)heading.after(badge);else card.prepend(badge)});
 ensureFloat();tick();status();
}
function tick(){
 const dock=ensureFloat(),remaining=restEnd?Math.max(0,restEnd-Date.now()):restPaused!==null?restPaused:0;
 if(restEnd&&remaining===0){restEnd=0;restPaused=null;restVisible=false;restExpanded=false}
 dock.classList.toggle("sl62-active",restVisible);
 dock.classList.toggle("sl62-expanded",restExpanded&&restVisible);
 dock.querySelector("#sl62-time").textContent=clockText(remaining/1000);dock.querySelector("#dl14-rest-ring")?.setAttribute("stroke-dashoffset",String(100-(restDuration?Math.max(0,Math.min(100,remaining/(restDuration*1000)*100)):0)));
 dock.querySelector("#sl62-name").textContent=restName?"REST · "+restName:"REST TIMER";
 dock.querySelector("#sl62-expand").setAttribute("aria-expanded",String(restExpanded));
 dock.querySelector("#sl62-toggle").textContent=restEnd?"Pause":restPaused!==null?"Resume":"Start";
 dock.querySelector("#sl62-progress").style.width=(restDuration?Math.max(0,Math.min(100,remaining/(restDuration*1000)*100)):0)+"%";
}
function startRest(i,j){
 restName=draft[i]?.name||"";
 restDuration=restFor(restName);restEnd=Date.now()+restDuration*1000;restPaused=null;restVisible=true;restExpanded=false;lastRestSet=i+":"+j;tick();
}
window.deltaStartRest=startRest;
function updateFromInput(el){const i=Number(el.dataset.i),j=Number(el.dataset.j),field=el.dataset.field;if(!draft[i]?.sets[j])return;const set=draft[i].sets[j];const before=!!set.done;set[field]=field==="done"?!!el.checked:el.value===""?"":Number(el.value)||0;persist();if(field==="done"&&set.done&&!before)startRest(i,j)}
// Capture input before existing change handlers. This includes edits not yet blurred.
document.addEventListener("input",e=>{const el=e.target;if(page!=="train"||!el.matches?.('[data-field]'))return;updateFromInput(el)},true);
document.addEventListener("change",e=>{const el=e.target;if(page!=="train")return;if(el.matches?.('[data-field]'))updateFromInput(el);else if(el.id==="cardio"){cardio=el.checked;persist()}},true);
document.addEventListener("change",e=>{const el=e.target;if(page!=="train"||el.id!=="day")return;const next=Number(el.value);if(next===day)return;const hasEdits=draft.some(x=>x.sets.some(s=>s.done||s.reps!==""));if(hasEdits&&!confirm("Start a different workout? Your current unfinished workout will be replaced. Export a backup first if needed.")){el.value=String(day);e.stopImmediatePropagation();return}day=next;newDraft();persist(true)},true);
document.addEventListener("click",e=>{const el=e.target.closest?.("#finish");if(!el||page!=="train")return;const done=draft.some(x=>x.sets.some(s=>s.done));if(!done)return; // Existing handler saves the completed workout.
 // Only clear the active draft after the original save handler has run.
 setTimeout(()=>{if(page==="progress"){localStorage.removeItem(DRAFT_KEY);localStorage.removeItem(SNAP_KEY);savedAt=0;restEnd=0;restPaused=null;restVisible=false;restExpanded=false;tick()}},0);
},true);
const priorTrain=trainView;trainView=function(){priorTrain();widget()};
restore(); // Restore unfinished work before showing the enhanced tracker.
persist(false);
setInterval(()=>{if(draft.length)persist(true)},SNAP_INTERVAL);
setInterval(tick,500);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&draft.length)persist(true);else tick()});
window.addEventListener("pagehide",()=>{if(draft.length)persist(true)});
render();ensureFloat();tick();
})();