/* Strength Lab 7.4 — clear visual boundaries between setup and active training. */
(()=>{
"use strict";
function decorate(){
 if(page!=="train")return;
 const app=document.querySelector("#app");
 const first=app?.querySelector(".sl55-exercise");
 if(!first)return;
 const header=document.createElement("div");
 header.className="sl74-training-heading";
 header.innerHTML='<div class="sl74-training-title"><span class="sl74-training-mark" aria-hidden="true"></span><div><small>02 / ACTIVE TRAINING</small><h2>Your workout</h2></div></div><span class="sl74-training-badge">LOG YOUR SETS</span>';
 first.before(header);
 app.querySelectorAll(".sl55-exercise").forEach((card,i)=>{
  card.classList.add("sl74-training-card");
  card.style.setProperty("--sl74-order",String(i+1));
 });
 const launch=app.querySelector(".sl72-launch");
 if(launch)launch.setAttribute("aria-label","Workout preparation and selection");
}
const previous=trainView;trainView=function(){previous();decorate()};
render();
})();