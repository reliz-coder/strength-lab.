/* Strength Lab 5.1 — exercise detail refinement and consistent navigation */
(()=>{
"use strict";
const icons={
train:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
progress:'<path d="M4 20V11m5 9V5m5 15v-8m5 8V3"/><path d="M2 21h20"/>',
body:'<circle cx="12" cy="4.5" r="2"/><path d="M9 9h6l2 5-2 1-1-3v9h-4v-9l-1 3-2-1z"/>',
guide:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h6"/>',
backup:'<circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
};
function applyNav(){
 document.querySelectorAll("#nav .tab").forEach(tab=>{
  const el=tab.querySelector(".tab-icon"),body=icons[tab.dataset.page];if(!el||!body)return;
  el.innerHTML='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
 });
}
function upgradeDetail(){
 const root=document.querySelector("#exerciseDetail .detail");if(!root)return;
 root.classList.add("sl-detail-v5");
 const header=root.querySelector(".detail-head");
 if(header&&!header.querySelector(".sl-detail-back")){
  const back=document.createElement("button");back.type="button";back.className="sl-detail-back";back.textContent="‹  Exercise library";
  back.onclick=()=>{document.querySelector("#libraryList")?.scrollIntoView({behavior:"smooth",block:"start"})};
  header.prepend(back);
 }
 const media=root.querySelector(".media-card");if(!media)return;
 const imgs=[...media.querySelectorAll(".photo-grid .photo-frame img")];
 if(imgs.length){
  let hero=media.querySelector(".sl-main-exercise-photo");
  if(!hero){
   const block=document.createElement("div");block.className="sl-main-exercise-photo";
   const image=document.createElement("img");image.src=imgs[1]?.src||imgs[0].src;image.alt="Main exercise demonstration for "+selectedExercise;image.loading="eager";image.decoding="async";
   image.onerror=()=>{block.classList.add("sl-photo-error")};
   block.append(image);
   const caption=document.createElement("span");caption.textContent="EXERCISE DEMONSTRATION";block.append(caption);
   const photoGrid=media.querySelector(".photo-grid");photoGrid.before(block);
  }
 }
 const muscleCard=[...root.children].find(el=>el.querySelector("h3")?.textContent?.trim()==="Muscles activated");
 if(muscleCard){
  muscleCard.classList.add("sl-muscle-card");
  const key=muscleCard.querySelector(".anatomy-key");
  if(key)key.setAttribute("aria-label","Primary muscles highlighted red; secondary muscles highlighted blue");
  if(media.nextElementSibling!==muscleCard)media.after(muscleCard);
 }
 const technique=[...root.children].find(el=>el.querySelector("h3")?.textContent?.trim()==="Technique cues");
 if(technique)technique.classList.add("sl-technique-card");
 const mistakes=[...root.children].find(el=>el.querySelector("h3")?.textContent?.trim()==="Common mistakes");
 if(mistakes)mistakes.classList.add("sl-mistakes-card");
 const video=media.querySelector(".video-guide");
 if(video){
  video.classList.add("sl-video-compact");
  const title=video.querySelector("h3");if(title)title.textContent="Full-motion technique video";
  const link=video.querySelector("a");if(link)link.textContent="▶ Find demonstration";
 }
 const motion=media.querySelector(".motion-tools");
 if(motion)motion.classList.add("sl-motion-compact");
 const credits=media.querySelectorAll(".photo-credit");credits.forEach(x=>x.classList.add("sl-compact-credit"));
}
const oldNav=nav;
nav=function(){oldNav();applyNav()};
const oldShow=showDetail;
showDetail=function(){oldShow();upgradeDetail()};
render();
})();