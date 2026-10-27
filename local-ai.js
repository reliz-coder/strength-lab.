/* Strength Lab 3.8 — ChatGPT handoff, no API key or subscription required */
(()=>{"use strict";
function promptForReview(){
 const session=reviewSession;
 const prior=state.sessions.filter(x=>x.id!==session?.id).slice(-12);
 const exercises=reviewItems.map(item=>{
  const logged=(session?.exercises||[]).find(x=>x.name===item.name);
  const history=prior.map(s=>{const ex=(s.exercises||[]).find(x=>x.name===item.name);return ex?{date:s.date,sets:(ex.sets||[]).filter(t=>t.done).map(t=>({lb:Number(t.weight),reps:Number(t.reps),rir:Number(t.rir)}))}:null}).filter(Boolean).slice(-4);
  return {exercise:item.name,repRange:item.range,completedSets:(logged?.sets||[]).filter(t=>t.done).map(t=>({lb:Number(t.weight),reps:Number(t.reps),rir:Number(t.rir)})),recentHistory:history,currentAppRecommendation:{weightLb:item.targetWeight,targetReps:item.targetReps,reason:item.reason}};
 });
 return "Act as my evidence-based strength-training coach. Review the workout data below and recommend the next session's weight (lb) and target reps for each exercise. Use double progression, RIR and recent trends. Explain your reasoning concisely; flag plateaus, fatigue signals and missing information. Avoid jumps greater than about 5% for major lifts or the smallest available dumbbell increment unless justified. Do not assume you can assess my technique, pain or recovery from logs. Present a compact table with exercise, next weight, target reps, and rationale. These are recommendations for me to approve, not automatic changes to my workout log.\\n\\n"+JSON.stringify({workout:session?.program,date:session?.date,exercises},null,2);
}
async function handoff(){
 const prompt=promptForReview();
 const status=document.getElementById("ai-progress");
 const button=document.getElementById("ai-chatgpt");
 try{
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(prompt)}
  else{const el=document.createElement("textarea");el.value=prompt;el.style.position="fixed";el.style.opacity="0";document.body.append(el);el.select();if(!document.execCommand("copy"))throw Error("Clipboard unavailable");el.remove()}
  if(status)status.textContent="Workout summary copied. Open ChatGPT, paste it into a new message, and send. Your app's existing progression suggestions remain available below.";
  if(button)button.textContent="Copied — open ChatGPT";
  window.open("https://chatgpt.com/","_blank","noopener,noreferrer");
 }catch(e){
  if(status)status.textContent="Clipboard access was blocked. Select and copy the workout summary below, then paste it into ChatGPT.";
  const area=document.getElementById("ai-manual-prompt");if(area){area.value=prompt;area.hidden=false;area.focus();area.select()}
 }
}
const original=reviewView;
reviewView=function(){
 original();
 const first=document.querySelector("#app .card");if(!first)return;
 const box=document.createElement("section");box.className="card";
 box.innerHTML='<div class="eyebrow">CHATGPT · WORKOUT COACH</div><h3>Review with ChatGPT</h3><p class="subtle">Send your completed sets and recent workout trends to ChatGPT for personalized progression recommendations. Nothing is sent until you paste and submit the summary in ChatGPT. Your built-in recommendations remain available below.</p><button type="button" class="primary full" id="ai-chatgpt">Copy workout & open ChatGPT</button><p class="subtle" id="ai-progress" role="status" aria-live="polite">No local AI download or API key needed. ChatGPT may require you to sign in.</p><textarea id="ai-manual-prompt" hidden rows="7" aria-label="Workout summary for ChatGPT"></textarea>';
 first.after(box);
 box.querySelector("#ai-chatgpt").onclick=handoff;
};
render();
})();