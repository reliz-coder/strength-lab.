/* Strength Lab 4.1 — continuous demonstration discovery and visual form checkpoints */
(()=>{
"use strict";
const cues=[
[/bench press|incline press|chest press|push.up/i,{setup:"Feet planted; shoulder blades stable; wrists stacked.",path:"Lower toward mid-chest, then press up and slightly inward.",tempo:"2–3 sec down · controlled press up",check:["Wrists above elbows","Shoulders stable on bench","No bouncing or excessive elbow flare"]}],
[/fly|pec deck/i,{setup:"Soft elbows; chest tall; shoulders comfortably set.",path:"Bring arms together in a wide arc; return without overstretching.",tempo:"2–3 sec return · 1 sec squeeze",check:["Elbow angle stays nearly constant","Shoulders stay down","Stop before painful stretch"]}],
[/pulldown|pull.up|pullover/i,{setup:"Ribs stacked; shoulders down; stable seat or stance.",path:"Pull elbows toward your sides; return upward smoothly.",tempo:"1–2 sec pull · 2–3 sec return",check:["Avoid excessive backward lean","Elbows track toward ribs","No neck jutting"]}],
[/row/i,{setup:"Neutral spine; braced torso; shoulders relaxed.",path:"Pull elbows backward toward hips; reach forward slowly.",tempo:"1–2 sec pull · 2–3 sec return",check:["Torso remains steady","No shoulder shrug","No jerking the weight"]}],
[/shoulder press/i,{setup:"Ribs down; forearms vertical; wrists neutral.",path:"Press overhead along a comfortable arc.",tempo:"2 sec down · controlled press",check:["Avoid lower-back arch","Elbows below wrists","No bouncing"]}],
[/lateral raise|reverse fly|reverse pec|face pull/i,{setup:"Light weight; soft elbows; steady torso.",path:"Raise arms with control and lower slowly.",tempo:"1–2 sec up · 3 sec down",check:["No swinging","Shoulders not shrugged","Comfortable range"]}],
[/curl/i,{setup:"Upper arms quiet; wrists straight; steady posture.",path:"Bend elbows without swinging; lower fully.",tempo:"1–2 sec up · 3 sec down",check:["Upper arms remain stable","No torso momentum","Wrists stay neutral"]}],
[/triceps|pressdown|extension/i,{setup:"Upper arms stable; shoulders relaxed.",path:"Extend elbows and return under control.",tempo:"1 sec extend · 3 sec return",check:["Elbows stay near position","No torso swing","Pain-free extension"]}],
[/hack squat|leg press|goblet squat|smith machine squat/i,{setup:"Full foot supported; brace trunk; knees track over toes.",path:"Lower hips and knees together; push through feet.",tempo:"3 sec down · controlled drive",check:["Knees follow toes","Heels stay planted","No pelvis rolling off pad"]}],
[/lunge|split squat|step.up/i,{setup:"Stable stride; torso braced; front foot flat.",path:"Lower straight down; push through front foot.",tempo:"2–3 sec down · controlled rise",check:["Front knee tracks over foot","Pelvis stays level","Avoid bouncing"]}],
[/leg curl/i,{setup:"Machine pivot aligned to knee; hips anchored.",path:"Curl lower legs toward glutes; lower slowly.",tempo:"1 sec curl · 3 sec return",check:["Hips stay on pad","Knee aligns to pivot","No weight-stack slam"]}],
[/leg extension/i,{setup:"Knee at machine pivot; back against pad.",path:"Straighten knees comfortably; lower slowly.",tempo:"1 sec extend · 3 sec return",check:["Hips stay down","No kicking","Avoid painful lockout"]}],
[/romanian deadlift|pull.through/i,{setup:"Soft knees; neutral spine; weight close to legs.",path:"Push hips back, then drive hips forward.",tempo:"3 sec hinge · 1–2 sec rise",check:["Hips travel backward","Spine remains neutral","No leaning back at top"]}],
[/hip thrust|glute bridge|kickback/i,{setup:"Ribs down; feet secure; pelvis controlled.",path:"Extend hips by squeezing glutes; return slowly.",tempo:"2 sec lift · 2 sec lower",check:["Avoid lumbar overextension","Hips remain level","Feet stay grounded"]}],
[/calf/i,{setup:"Forefoot secure; ankle aligned.",path:"Rise onto toes, pause, then lower heels.",tempo:"1 sec up · 1 sec hold · 3 sec down",check:["No bouncing","Full controlled range","Ankles remain aligned"]}],
[/abduct|adduct/i,{setup:"Hips level; pelvis stable; cable or machine aligned.",path:"Move leg outward or inward without trunk rotation.",tempo:"2 sec out · 3 sec return",check:["No torso sway","Hips stay square","Comfortable range"]}],
[/crunch|plank|dead bug|knee raise|pallof/i,{setup:"Ribs aligned over pelvis; steady breathing.",path:"Maintain trunk control throughout movement.",tempo:"Slow and controlled",check:["Avoid excessive back arch","Breathe steadily","Control every rep"]}]
];
function cuesFor(name){return cues.find(x=>x[0].test(name))?.[1]||{setup:"Stable starting position and manageable load.",path:"Move through a comfortable range without momentum.",tempo:"Controlled lifting and lowering",check:["Stable posture","Smooth range of motion","Stop if painful"]}}
function renderCheckpoints(name){
 const c=cuesFor(name);
 return '<section class="card form-checkpoints"><div class="eyebrow">FORM LAB · VISUAL CHECKPOINTS</div><h3>What good reps look like</h3><div class="form-diagram" role="img" aria-label="Three checkpoints: stable setup, controlled movement path, and controlled return"><div class="form-step"><span class="form-node">1</span><strong>SETUP</strong><p>'+escapeHTML(c.setup)+'</p></div><div class="form-line">→</div><div class="form-step"><span class="form-node">2</span><strong>MOVE</strong><p>'+escapeHTML(c.path)+'</p></div><div class="form-line">→</div><div class="form-step"><span class="form-node">3</span><strong>RETURN</strong><p>'+escapeHTML(c.tempo)+'</p></div></div><div class="form-checklist">'+c.check.map(x=>'<div><span class="form-check-icon">✓</span>'+escapeHTML(x)+'</div>').join("")+'</div><p class="subtle">These are instructional checkpoints, not real-time camera-based form measurements.</p></section>';
}
function videoSearch(name){return "https://www.youtube.com/results?search_query="+encodeURIComponent(name+" exercise form demonstration full repetition")}
const old=showDetail;
showDetail=function(){
 old();
 const name=selectedExercise;
 const media=document.querySelector("#exerciseDetail .media-card");
 if(media){
  const block=document.createElement("div");block.className="video-guide";
  block.innerHTML='<div class="eyebrow">CONTINUOUS MOVEMENT</div><h3>Full-repetition video</h3><p class="subtle">Find a complete exercise demonstration with the lifting and lowering phases. Select a video that matches your equipment and exercise variation.</p><a class="video-open" href="'+videoSearch(name)+'" target="_blank" rel="noopener noreferrer">▶ Find full-motion demonstration ↗</a><p class="subtle">External videos are not individually verified. Use the form checkpoints below to evaluate the demonstration.</p>';
  media.append(block);
  const panel=document.createElement("div");panel.innerHTML=renderCheckpoints(name);
  media.after(panel.firstElementChild);
 }
};
render();
})();