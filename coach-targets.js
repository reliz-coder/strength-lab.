/* Coach-approved next-session targets, separate from historical workout logs. */
(()=>{
"use strict";
const targets=[
{name:"Hack squat",weight:215,reps:"4 × 8–9",range:"6–10",reason:"Hold load after final set reached 0 RIR."},
{name:"Barbell walking lunges",weight:65,reps:"3 × 10/leg (20 total)",range:"10–12/leg",reason:"All three prior sets: 60 lb × 10/leg, ~5 RIR. 69 lb entry was a typo. Barbell total load."},
{name:"Leg extension machine",weight:65,reps:"3 × 10–12",range:"12–15",reason:"Rebuild toward 12–15 reps after 70 lb × 8."},
{name:"Seated calf raise",weight:160,reps:"4 × 11",range:"10–15",reason:"Add a rep per set before increasing weight."},
{name:"Cable crunch",weight:65,reps:"3 × 10–12",range:"12–15",reason:"Small load reduction after 70 lb × 8."},
{name:"Straight-arm cable pulldown",weight:65,reps:"2 × 10–12",range:"12–15",reason:"Small load reduction after 70 lb × 8."},
{name:"Preacher curl",weight:37.5,reps:"2 × 9–10",range:"10–15",reason:"Rebuild reps after 40 lb × 8."}
];
const aliases={"Walking lunges":"Barbell walking lunges","Dumbbell walking lunges":"Barbell walking lunges","Leg extension":"Leg extension machine","Rope triceps pressdown":"Rope triceps pressdown"};
const find=n=>targets.find(t=>t.name===(aliases[n]||n));
const oldTrain=trainView;
trainView=function(){
 oldTrain();
 if(page!=="train")return;
 const app=document.querySelector("#app");if(!app)return;
 const card=document.createElement("section");card.className="card sl-coach-targets";
 card.innerHTML='<h2>Coach targets · next exposure</h2><p class="note">Recommendations from Oct 29 workout. Historical logs are unchanged. Review and approve before applying.</p>'+targets.map(t=>'<div style="padding:9px 0;border-bottom:1px solid rgba(120,140,170,.18)"><strong>'+escapeHTML(t.name)+'</strong><div>'+t.weight+' lb · '+escapeHTML(t.reps)+'</div><small>'+escapeHTML(t.reason)+'</small></div>').join("")+'<button type="button" id="sl-apply-coach-targets" style="margin-top:12px">Apply matching targets to current unsaved workout</button>';
 const anchor=app.querySelector(".sl-hero")||app.firstElementChild;
 if(anchor)anchor.after(card);else app.prepend(card);
 card.querySelector("#sl-apply-coach-targets").onclick=()=>{
  let updated=0;
  draft.forEach(ex=>{
   const t=find(ex.name);if(!t)return;
   if(ex.sets.some(s=>s.done))return;
   ex.sets.forEach(set=>{set.weight=t.weight;set.reps="";set.rir=2});
   if(t.name==="Barbell walking lunges"){ex.name=t.name;ex.range=t.range;}
   updated++;
  });
  render();
  const notice=document.querySelector(".sl-coach-targets .note");
  if(notice)notice.textContent=updated?updated+" exercises updated in your unsaved session. Review all sets before logging.":"No matching uncompleted exercises in this workout. Historical logs were not changed.";
 };
};
render();
})();