/* Strength Lab 4.0 — full movement guides and motion player */
(()=>{
"use strict";
const categories=[
[/bench press|incline press|chest press|push.up/i,["Chest press","Position shoulders down and back, wrists stacked above elbows, and feet stable.","Lower until elbows reach a comfortable depth, then press upward without bouncing.","Keep elbows roughly 30–60° from your torso and control the lowering phase.","Flaring elbows excessively|Bouncing at the bottom|Lifting hips off the bench"]],
[/cable fly|pec deck|dumbbell fly/i,["Chest fly","Set handles around chest height for a mid-chest fly; keep a soft elbow bend.","Sweep arms toward the midline while keeping the same elbow angle.","Return slowly until you feel a comfortable chest stretch.","Turning the fly into a press|Overstretching shoulders|Swinging the weight"]],
[/pulldown|pull.up|pullover/i,["Lat-focused pull","Brace your torso and set shoulders down before pulling.","Drive elbows toward your ribs while avoiding excessive torso lean.","Let arms reach overhead under control between reps.","Pulling behind the neck|Rocking backward|Shrugging throughout"]],
[/row/i,["Horizontal row","Set a neutral spine and brace your trunk before pulling.","Pull elbows backward toward your hips or lower ribs.","Pause briefly, then reach forward under control without rounding excessively.","Jerking the torso|Shrugging shoulders|Using momentum"]],
[/lateral raise|reverse fly|reverse pec|face pull/i,["Shoulder isolation","Use a manageable load and maintain a soft elbow bend.","Raise arms in the intended path without swinging.","Lower slowly and stop if the movement causes shoulder discomfort.","Shrugging aggressively|Swinging the torso|Using too much weight"]],
[/shoulder press/i,["Overhead press","Brace your abdomen and align forearms under the load.","Press upward in a comfortable arc without excessively arching your back.","Lower with control to a pain-free shoulder range.","Excessive lower-back arch|Flaring elbows|Bouncing at the bottom"]],
[/biceps|hammer curl|preacher curl|bayesian cable curl|ez.bar curl/i,["Elbow flexion","Keep upper arms steady and wrists neutral.","Curl the handle without moving your shoulders forward.","Lower fully under control without swinging.","Swinging the torso|Moving elbows excessively|Shortening every rep"]],
[/triceps|pressdown|overhead extension|skull crusher/i,["Elbow extension","Stabilize upper arms and set the cable or dumbbell comfortably.","Extend elbows through a controlled, pain-free range.","Return slowly without letting the shoulders dominate.","Moving upper arms excessively|Using momentum|Forcing elbow lockout"]],
[/hack squat|leg press|goblet squat|smith machine squat|dumbbell squat/i,["Squat pattern","Place feet where knees can track comfortably over toes.","Bend hips and knees together and descend to a controlled depth.","Push through your full foot while maintaining stable knees.","Heels lifting|Knees collapsing inward|Losing back contact on machine"]],
[/lunge|split squat|step.up/i,["Single-leg squat","Take a stable stance and keep your torso controlled.","Lower until the front knee and hip reach a comfortable depth.","Push through the lead foot and keep hips level.","Unstable foot placement|Bouncing off the back knee|Rushing the descent"]],
[/leg curl/i,["Hamstring curl","Align the machine pivot with your knee and adjust the pad.","Curl the pad toward you while keeping hips stable.","Return slowly without letting the weight stack slam.","Lifting hips off the pad|Swinging the weight|Rushing the negative"]],
[/leg extension/i,["Quadriceps extension","Align knees with the machine pivot and position the ankle pad comfortably.","Extend knees through a comfortable range without kicking.","Lower slowly while keeping hips seated.","Jerking the weight|Lifting hips|Forcing painful lockout"]],
[/romanian deadlift|pull.through/i,["Hip hinge","Keep knees softly bent and hold weights close to your legs.","Push hips backward while keeping your spine neutral.","Stand tall by driving hips forward without leaning backward.","Rounding the lower back|Squatting instead of hinging|Hyperextending at the top"]],
[/hip thrust|glute bridge|kickback/i,["Glute extension","Set your torso and feet securely; brace the abdomen.","Drive hips into extension by squeezing glutes.","Lower under control without over-arching the lower back.","Hyperextending lumbar spine|Pushing only through toes|Rushing reps"]],
[/calf raise/i,["Calf raise","Position the balls of your feet securely on the platform.","Rise onto toes without bouncing and pause at the top.","Lower heels slowly through a comfortable stretch.","Bouncing|Short partial reps|Rolling ankles outward"]],
[/abduction|adduction/i,["Hip isolation","Adjust machine or cable height and stabilize your torso.","Move the leg outward for abduction or inward for adduction with control.","Return slowly without twisting your pelvis.","Swinging the torso|Excessive range|Using momentum"]],
[/crunch|plank|dead bug|knee raise|pallof|ab wheel/i,["Core stability","Brace your abdomen and keep ribs aligned over pelvis.","Move slowly without letting the lower back arch excessively.","Breathe steadily while maintaining control.","Holding breath unnecessarily|Moving too fast|Losing trunk position"]]
];
function coaching(name){
 const n=String(name||"");
 const match=categories.find(x=>x[0].test(n));
 if(match)return match[1];
 return ["Controlled resistance exercise","Set up equipment to fit your body and choose a manageable resistance.","Move through a comfortable range of motion without using momentum.","Return to the starting position under control and stop if painful.","Using excessive load|Losing balance|Rushing repetitions"];
}
function relatedPhoto(name){
 const exact=photoFor(name);if(exact)return {record:exact,related:false};
 if(!PHOTO_RECORDS)return null;
 const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,"");
 const alias=PHOTO_ALIASES[name]||name;
 const names=[alias,name];
 const aliases={
 "Lying leg curl machine":["Lying Leg Curls"],"Leg extension machine":["Leg Extensions"],"Single-leg leg extension":["Leg Extensions"],
 "Dumbbell walking lunges":["Dumbbell Lunges","Walking Lunges"],"Walking lunges":["Dumbbell Lunges","Walking Lunges"],
 "Cable biceps curl":["Standing Biceps Cable Curl"],"Rope cable hammer curl":["Cable Hammer Curls - Rope Attachment"],
 "Rope triceps pressdown":["Triceps Pushdown - Rope Attachment"],"Cable overhead triceps extension":["Cable Rope Overhead Triceps Extension"],
 "Single-arm cable row":["One-Arm Dumbbell Row"],"Cable lateral raise":["Cable Seated Lateral Raise"],"Single-arm cable lateral raise":["Cable Seated Lateral Raise"],
 "Cable glute kickback":["Glute Kickback"],"Hip abduction machine":["Thigh Abductor"],"Hip adduction machine":["Thigh Adductor"],
 "Low-to-high cable fly":["Cable Crossover"],"High-to-low cable fly":["Cable Crossover"],
 "Cable chest press":["Cable Crossover"],"Standing cable chest press":["Cable Crossover"],
 "Bayesian cable curl":["Incline Dumbbell Curl"],"Cable hip abduction":["Thigh Abductor"],"Cable hip adduction":["Thigh Adductor"],
 "Cable Romanian deadlift":["Romanian Deadlift"],"Cable pull-through":["Pull Through"],"Cable leg curl":["Lying Leg Curls"],
 "Standing single-leg curl":["Standing Leg Curl"],"Single-leg dumbbell calf raise":["Standing Calf Raises"]
 };
 names.push(...(aliases[name]||[]));
 for(const candidate of names){const r=PHOTO_RECORDS.find(x=>norm(x.name)===norm(candidate)&&x.images?.length);if(r)return {record:r,related:norm(r.name)!==norm(alias)}}
 const family=coaching(name)[0];
 const familyName={ "Chest press":"Dumbbell Bench Press","Chest fly":"Cable Crossover","Lat-focused pull":"Wide-Grip Lat Pulldown","Horizontal row":"Seated Cable Rows","Shoulder isolation":"Side Lateral Raise","Overhead press":"Dumbbell Shoulder Press","Elbow flexion":"Dumbbell Bicep Curl","Elbow extension":"Triceps Pushdown","Squat pattern":"Hack Squat","Single-leg squat":"Dumbbell Lunges","Hamstring curl":"Lying Leg Curls","Quadriceps extension":"Leg Extensions","Hip hinge":"Romanian Deadlift","Glute extension":"Barbell Glute Bridge","Calf raise":"Standing Calf Raises","Hip isolation":"Thigh Abductor","Core stability":"Cable Crunch"}[family];
 const record=PHOTO_RECORDS.find(x=>norm(x.name)===norm(familyName)&&x.images?.length);
 return record?{record,related:true}:null;
}
const previousVisual=visual;
visual=function(name){
 const found=relatedPhoto(name);
 if(!found)return '<div class="photo-unavailable"><strong>Movement example loading</strong><p>Use the setup and step-by-step technique instructions below. Exercise photos require an internet connection.</p></div>';
 const record=found.record;
 const images=record.images.slice(0,2);
 const src=path=>PHOTO_ROOT+encodeURI(path);
 const frames=images.map((path,i)=>'<figure class="photo-frame"><img loading="lazy" decoding="async" src="'+src(path)+'" alt="'+escapeHTML(record.name)+' '+(i===0?"start":"finish")+' position" onerror="this.closest(\'figure\').classList.add(\'failed-photo\')"><figcaption>'+(i===0?"01 · START":"02 · FINISH")+'</figcaption></figure>').join("");
 return '<div class="photo-grid">'+frames+'</div>'+(images.length>1?'<div class="motion-tools"><button class="motion-play" type="button" aria-pressed="false">▶ Play movement loop</button><label>Speed <select class="motion-speed"><option value="1400">Slow</option><option value="850" selected>Normal</option><option value="450">Fast</option></select></label></div><div class="motion-stage" hidden><img class="motion-frame" src="'+src(images[0])+'" alt="Alternating example frames for '+escapeHTML(record.name)+'"></div>':'')+(found.related?'<p class="photo-related"><strong>Related movement example:</strong> '+escapeHTML(record.name)+'. Equipment or technique may differ from '+escapeHTML(name)+'. Follow the written cues for your selected exercise.</p>':'<p class="photo-credit">Example: '+escapeHTML(record.name)+'</p>')+'<p class="photo-credit">Images: Free Exercise DB / Everkinetic.</p>';
};
const oldDetail=showDetail;
showDetail=function(){
 oldDetail();
 const name=selectedExercise;
 const c=coaching(name);
 const detail=EXERCISE_DETAILS[name];
 const steps=detail?.steps?.length?detail.steps:[c[1],c[2],c[3]];
 const mistakes=detail?.mistakes?.length?detail.mistakes:c[4].split("|");
 const head=document.querySelector("#exerciseDetail .detail-head .subtle");
 if(head&&(!detail?.desc||detail.desc==="Controlled resistance training movement."))head.textContent=c[0]+": "+c[1];
 const cards=document.querySelectorAll("#exerciseDetail .detail > .card");
 const tech=[...cards].find(x=>x.querySelector("h3")?.textContent==="Technique cues");
 if(tech&&!detail?.steps?.length)tech.innerHTML='<h3>Technique cues</h3>'+steps.map((v,i)=>'<div class="instruction"><span>'+(i+1)+'</span><p>'+escapeHTML(v)+'</p></div>').join("");
 const errors=[...cards].find(x=>x.querySelector("h3")?.textContent==="Common mistakes");
 if(errors&&!detail?.mistakes?.length)errors.innerHTML='<h3>Common mistakes</h3>'+mistakes.map(v=>'<div class="error"><span>×</span>'+escapeHTML(v)+'</div>').join("");
 const media=document.querySelector("#exerciseDetail .media-card");
 if(media){const btn=media.querySelector(".motion-play"),speed=media.querySelector(".motion-speed"),stage=media.querySelector(".motion-stage"),frame=media.querySelector(".motion-frame");if(btn&&frame&&stage){let timer=null,index=0;const images=relatedPhoto(name)?.record?.images?.slice(0,2)||[];const stop=()=>{clearInterval(timer);timer=null;btn.textContent="▶ Play movement loop";btn.setAttribute("aria-pressed","false");stage.hidden=true};btn.onclick=()=>{if(timer){stop();return}stage.hidden=false;btn.textContent="■ Stop movement loop";btn.setAttribute("aria-pressed","true");const tick=()=>{index=(index+1)%images.length;frame.src=PHOTO_ROOT+encodeURI(images[index])};timer=setInterval(tick,Number(speed.value));};speed.onchange=()=>{if(timer){clearInterval(timer);timer=setInterval(()=>{index=(index+1)%images.length;frame.src=PHOTO_ROOT+encodeURI(images[index])},Number(speed.value))}};}}
};
render();
})();