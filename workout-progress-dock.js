/* Strength Lab 7.1 — persistent workout completion dock */
(()=>{
"use strict";
let expanded=false;
const esc=v=>escapeHTML(String(v??""));
function ensure(){
 let dock=document.getElementById("sl71-dock");
 if(dock)return dock;
 dock=document.createElement("aside");dock.id="sl71-dock";dock.className="sl71-dock";dock.setAttribute("aria-label","Current workout progress");
 dock.innerHTML='<button type="button" class="sl71-toggle" id="sl71-toggle" aria-expanded="false"><div class="sl71-top"><span><small>WORKOUT PROGRESS</small><strong id="sl71-count">0 of 0 sets</strong></span><span class="sl71-right"><b id="sl71-percent">0%</b><span id="sl71-arrow">⌃</span></span></div><div class="sl71-track"><span id="sl71-fill"></span></div><div class="sl71-caption" id="sl71-caption">Tap to see exercises</div></button><div id="sl71-details" class="sl71-details" hidden></div>';
 document.body.append(dock);
 dock.querySelector("#sl71-toggle").onclick=()=>{expanded=!expanded;update()};
 dock.querySelector("#sl71-details").addEventListener("click",e=>{const b=e.target.closest("[data-sl71-jump]");if(!b)return;const index=Number(b.dataset.sl71Jump);expanded=false;update();const card=document.querySelector('.sl55-exercise[data-exercise="'+index+'"]');card?.scrollIntoView({behavior:"smooth",block:"center"})});
 return dock;
}
function update(){
 const dock=ensure(),visible=page==="train"&&Array.isArray(draft)&&draft.length>0;
 dock.classList.toggle("sl71-visible",visible);
 document.body.classList.toggle("sl71-workout-visible",visible);
 if(!visible)return;
 let total=0,done=0,finished=0;
 const rows=draft.map((ex,i)=>{const count=ex.sets?.length||0,complete=ex.sets?.filter(s=>s.done).length||0;total+=count;done+=complete;if(count&&complete===count)finished++;return {name:ex.name||"Exercise "+(i+1),i,count,complete}});
 const pct=total?Math.round(done/total*100):0;
 dock.querySelector("#sl71-count").textContent=done+" of "+total+" sets";
 dock.querySelector("#sl71-percent").textContent=pct+"%";
 dock.querySelector("#sl71-fill").style.width=pct+"%";
 dock.querySelector("#sl71-caption").textContent=finished+" of "+rows.length+" exercises finished · Tap for details";
 dock.querySelector("#sl71-toggle").setAttribute("aria-expanded",String(expanded));
 dock.querySelector("#sl71-arrow").textContent=expanded?"⌄":"⌃";
 const details=dock.querySelector("#sl71-details");details.hidden=!expanded;
 if(expanded)details.innerHTML=rows.map(x=>'<button type="button" data-sl71-jump="'+x.i+'"><span class="sl71-state '+(x.complete===x.count&&x.count?"done":"")+'">'+(x.complete===x.count&&x.count?"✓":x.complete? "◐":"○")+'</span><span class="sl71-ex-name">'+esc(x.name)+'</span><span class="sl71-ex-sets">'+x.complete+'/'+x.count+' sets</span></button>').join("");
}
const previous=trainView;trainView=function(){previous();update()};
document.addEventListener("change",e=>{if(page!=="train"||!e.target.matches?.('[data-field="done"],#day'))return;queueMicrotask(update)},true);
document.addEventListener("click",e=>{if(e.target.closest?.("#finish"))setTimeout(update,50)},true);
ensure();update();render();
})();