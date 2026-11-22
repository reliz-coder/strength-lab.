/* Strength Lab 7.3 — restore active exercise and set after visiting guidance. */
(()=>{
"use strict";
let position=null,restorePending=false;
const key="strength-lab-train-position-v1";
function load(){try{const x=JSON.parse(sessionStorage.getItem(key)||"null");if(x&&Number.isInteger(x.day)&&Number.isInteger(x.i)&&Number.isInteger(x.j))return x}catch{}return null}
function remember(i,j){
 if(page!=="train"||!Number.isInteger(i)||!Number.isInteger(j))return;
 position={day,i,j};try{sessionStorage.setItem(key,JSON.stringify(position))}catch{}
}
function captureFrom(el){
 if(page!=="train")return;
 const field=el?.closest?.("[data-i][data-j]");
 if(field){remember(Number(field.dataset.i),Number(field.dataset.j));return}
 const card=el?.closest?.(".sl55-exercise[data-exercise]");
 if(card){const i=Number(card.dataset.exercise);remember(i,position?.day===day&&position.i===i?position.j:0)}
}
document.addEventListener("focusin",e=>captureFrom(e.target),true);
document.addEventListener("change",e=>captureFrom(e.target),true);
document.addEventListener("click",e=>{
 captureFrom(e.target);
 const tab=e.target.closest?.("#nav [data-page]");
 if(tab){
  if(page==="train"&&tab.dataset.page!=="train"){
   if(!position||position.day!==day){const first=draft.findIndex(x=>x.sets?.some(s=>!s.done));remember(Math.max(0,first),0)}
   restorePending=true;
  }else if(page!=="train"&&tab.dataset.page==="train")restorePending=true;
 }
},true);
function restore(){
 if(page!=="train"||!restorePending)return;
 restorePending=false;
 const p=position&&position.day===day?position:load();
 if(!p||p.day!==day||!draft[p.i])return;
 const start=document.querySelector("#sl72-start");
 if(start&&start.offsetParent!==null)start.click();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(page!=="train")return;
  const card=document.querySelector('.sl55-exercise[data-exercise="'+p.i+'"]');
  if(!card)return;
  const inputs=[...card.querySelectorAll('[data-field="reps"][data-j="'+p.j+'"]')];
  const target=inputs[0]?.closest(".set,.set-row,.sl55-setrow")||card;
  target.scrollIntoView({behavior:"instant",block:"center"});
  card.classList.add("sl73-returned");
  setTimeout(()=>card.classList.remove("sl73-returned"),1400);
 }));
}
const previous=trainView;trainView=function(){previous();restore()};
render();
})();