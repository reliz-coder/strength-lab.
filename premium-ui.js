/* Strength Lab 5.0: premium home + program navigation */
(()=>{
"use strict";
const ICONS={train:"⌂",progress:"▥",body:"♙",guide:"▤",backup:"⚙"};
const names=["Push","Pull","Lower A","Upper B","Lower B","Hotel A","Hotel B"];
const captions=["Chest · Shoulders · Triceps","Back · Rear delts · Biceps","Quads · Glutes · Calves","Chest · Back · Arms","Hamstrings · Glutes · Core","Travel · Full body","Travel · Full body"];
const photoExamples=["Flat dumbbell bench press","Seated cable row","Hack squat","Incline dumbbell press","Lying leg curl","Dumbbell bench press","Dumbbell incline press"];
function photoSrc(name){try{const r=photoFor(name);return r?.images?.[0]?PHOTO_ROOT+encodeURI(r.images[0]):""}catch{return ""}}
function injectDashboard(){
 if(page!=="train")return;
 const app=document.querySelector("#app");if(!app)return;
 const originalHeader=app.querySelector(".section-header");
 const p=PROGRAMS[day];
 const banner=document.createElement("section");banner.className="sl-hero";
 const heroPhoto=photoSrc(photoExamples[day]);
 banner.innerHTML='<div class="sl-hero-copy"><div class="sl-hero-kicker">YOUR PERSONAL TRAINING LAB</div><h2 class="sl-hero-title">Train with intent.<br>Stronger every day.</h2><p class="sl-hero-sub">Your program. Your pace. No fixed weekdays.</p></div>'+(heroPhoto?'<img class="sl-hero-image" src="'+heroPhoto+'" alt="Workout exercise photograph" loading="lazy">':'');
 if(originalHeader)originalHeader.replaceWith(banner);else app.prepend(banner);
 const grid=document.createElement("section");
 grid.innerHTML='<div class="sl-section"><h2>Workout programs</h2><small>Flexible 5-session rotation · 75 min</small></div><div class="sl-program-grid">'+PROGRAMS.map((program,i)=>{const src=photoSrc(photoExamples[i]);return '<button type="button" class="sl-program-card '+(i===day?'is-active':'')+'" data-sl-day="'+i+'" aria-label="Choose '+program.name+'">'+(src?'<img src="'+src+'" loading="lazy" alt="">':'')+'<span class="sl-day-pill">'+(i<5?'DAY '+(i+1):'TRAVEL')+'</span><span class="sl-program-content"><strong>'+names[i]+'</strong><small>'+captions[i]+'</small><small>'+program.items.length+' exercises</small></span></button>'}).join("")+'</div><div class="sl-plan-bar"><span>Current selection</span><strong>'+p.name+'</strong></div><button type="button" class="sl-focus-button" id="sl-start-workout">Start '+names[day]+' workout →</button>';
 const picker=app.querySelector(".workout-picker");
 if(picker)picker.before(grid);else banner.after(grid);
 grid.querySelectorAll("[data-sl-day]").forEach(b=>b.onclick=()=>{const index=Number(b.dataset.slDay);if(index===day){document.querySelector(".sl-workout-anchor")?.scrollIntoView({behavior:"smooth",block:"start"});return}day=index;newDraft();render();window.scrollTo(0,0)});
 grid.querySelector("#sl-start-workout").onclick=()=>document.querySelector(".sl-workout-anchor")?.scrollIntoView({behavior:"smooth",block:"start"});
 const section=app.querySelector(".section-title");if(section)section.classList.add("sl-workout-anchor");
 const stats=app.querySelector(".stats");if(stats)stats.style.marginBottom="13px";
}
const previousTrain=trainView;
trainView=function(){previousTrain();injectDashboard()};
const previousNav=nav;
nav=function(){previousNav();document.querySelectorAll("#nav .tab").forEach(tab=>{const icon=tab.querySelector(".tab-icon");if(icon&&ICONS[tab.dataset.page])icon.textContent=ICONS[tab.dataset.page]})};
render();
})();