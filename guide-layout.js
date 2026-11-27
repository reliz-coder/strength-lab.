/* Strength Lab 5.9 — one guide search, exercise demonstration first */
(()=>{
"use strict";
const priorGuide=guideView;
function arrange(){
 if(page!=="guide")return;
 const app=document.querySelector("#app");if(!app)return;
 app.querySelectorAll(".sl56-library-head").forEach(el=>el.remove());
 const detail=app.querySelector("#exerciseDetail");
 const list=app.querySelector("#libraryList");
 const search=app.querySelector("#search")?.closest(".card");
 const intro=app.querySelector(".section-header");
 if(!detail||!list||!search)return;
 const lead=document.createElement("div");lead.className="sl59-guide-lead";
 lead.innerHTML='<div class="sl59-kicker">EXERCISE GUIDE</div><h2>Movement demonstration</h2><p>See the selected exercise, muscles worked, and form instructions. Choose another movement using the single search below.</p>';
 if(intro)intro.replaceWith(lead);else app.prepend(lead);
 lead.after(detail);const learn=document.createElement("details");learn.className="card dl14-learn";learn.innerHTML="<summary>Training fundamentals</summary><h3>Reps left (RIR)</h3><p>Estimate how many more controlled repetitions you could perform.</p><h3>Progressive overload</h3><p>Build repetitions within your target range before increasing weight. Keep technique consistent.</p><h3>Rest between sets</h3><p>Rest long enough to repeat a controlled effort; demanding lifts often need longer rests.</p><h3>Cardio intensity</h3><p>Moderate effort usually allows conversation. Adjust for comfort and recovery.</p>";app.append(learn);
 const picker=document.createElement("div");picker.className="sl59-picker-title";
 picker.innerHTML='<h3>Find another exercise</h3><p>Search or filter movements from your five-workout program.</p>';
 detail.after(picker);picker.after(search);search.after(list);
 const input=search.querySelector("#search");if(input)input.placeholder="Search all exercises…";
 const heading=list.querySelector(".section-title h2");if(heading)heading.textContent="Matching exercises";
 const select=()=>{if(page!=="guide")return;detail.scrollIntoView({behavior:"smooth",block:"start"})};
 list.addEventListener("click",e=>{if(e.target.closest("[data-ex]"))requestAnimationFrame(select)});
}
guideView=function(){priorGuide();arrange()};
render();
})();