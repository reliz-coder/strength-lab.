/* Strength Lab 3.9 — exercise substitutions by movement and equipment */
(()=>{
const STORAGE="strength-lab-exercise-swaps-v1";
let swaps={};try{swaps=JSON.parse(localStorage.getItem(STORAGE))||{}}catch{}
const groups={
 chestPress:["Flat dumbbell bench press","Incline dumbbell press","Dumbbell bench press","Dumbbell incline press","Cable chest press","Standing cable chest press","Machine chest press","Barbell bench press","Push-up"],
 chestFly:["Cable fly","Low-to-high cable fly","High-to-low cable fly","Pec deck","Dumbbell fly"],
 verticalPull:["Lat pulldown","Neutral-grip lat pulldown","Single-arm cable lat pulldown","Assisted pull-up","Pull-up"],
 horizontalPull:["Seated cable row","Chest-supported row","Single-arm cable row","One-arm dumbbell row","Chest-supported dumbbell row","Machine row","Bent-over dumbbell row"],
 straightPull:["Straight-arm cable pulldown","Cable pullover","Dumbbell pullover"],
 shoulderPress:["Machine shoulder press","Dumbbell shoulder press","Seated dumbbell shoulder press","Cable shoulder press"],
 sideDelt:["Dumbbell lateral raise","Single-arm cable lateral raise","Cable lateral raise","Machine lateral raise"],
 rearDelt:["Reverse pec deck","Cable reverse fly","Face pull","Bent-over dumbbell reverse fly"],
 biceps:["Dumbbell biceps curl","Incline dumbbell curl","Cable biceps curl","Bayesian cable curl","Preacher curl","Hammer curl","Rope cable hammer curl","EZ-bar curl"],
 triceps:["Triceps pressdown","Rope triceps pressdown","Overhead triceps extension","Cable overhead triceps extension","Single-arm cable triceps extension","Dumbbell overhead triceps extension","Close-grip push-up"],
 squat:["Hack squat","Leg press","Goblet squat","Smith machine squat","Dumbbell squat","Bulgarian split squat"],
 lunge:["Walking lunges","Dumbbell walking lunges","Bulgarian split squat","Reverse lunges","Dumbbell split squat","Smith machine split squat","Step-up"],
 hinge:["Romanian deadlift","Dumbbell Romanian deadlift","Cable Romanian deadlift","Dumbbell hip thrust","Hip thrust","Cable pull-through"],
 hamCurl:["Lying leg curl","Lying leg curl machine","Seated leg curl","Standing single-leg curl","Cable leg curl","Swiss-ball leg curl"],
 quadExt:["Leg extension","Leg extension machine","Single-leg leg extension","Spanish squat"],
 glutes:["Hip thrust","Dumbbell hip thrust","Cable glute kickback","Glute bridge","Cable pull-through"],
 calves:["Standing calf raise","Seated calf raise","Leg press calf raise","Single-leg dumbbell calf raise"],
 abs:["Cable crunch","Hanging knee raise","Dead bug","Plank","Pallof press","Reverse crunch","Ab wheel rollout"],
 hip:["Hip abduction machine","Cable hip abduction","Hip adduction machine","Cable hip adduction"]
};
const label={chestPress:"Chest press",chestFly:"Chest isolation",verticalPull:"Vertical back pull",horizontalPull:"Horizontal back row",straightPull:"Lat isolation",shoulderPress:"Shoulder press",sideDelt:"Side deltoids",rearDelt:"Rear deltoids",biceps:"Biceps",triceps:"Triceps",squat:"Quad-dominant squat",lunge:"Single-leg / lunge",hinge:"Hip hinge",hamCurl:"Hamstring curl",quadExt:"Quadriceps extension",glutes:"Glutes",calves:"Calves",abs:"Core",hip:"Hip isolation"};
function groupFor(name){
 const n=name.toLowerCase();
 if(/straight.arm|pullover/.test(n))return "straightPull";
 if(/abduct|adduct/.test(n))return "hip";
 if(/lateral raise/.test(n))return "sideDelt";
 if(/reverse pec|reverse fly|face pull|rear delt/.test(n))return "rearDelt";
 if(/shoulder press/.test(n))return "shoulderPress";
 if(/curl/.test(n)&&!/leg curl/.test(n))return "biceps";
 if(/triceps|pressdown|skull crusher/.test(n))return "triceps";
 if(/lat pulldown|pull.up/.test(n))return "verticalPull";
 if(/row/.test(n))return "horizontalPull";
 if(/fly|pec deck/.test(n))return "chestFly";
 if(/bench press|incline press|chest press|push.up/.test(n))return "chestPress";
 if(/leg curl/.test(n))return "hamCurl";
 if(/leg extension/.test(n))return "quadExt";
 if(/lunge|split squat|step.up/.test(n))return "lunge";
 if(/calf/.test(n))return "calves";
 if(/hack squat|leg press|goblet squat|smith machine squat|dumbbell squat/.test(n))return "squat";
 if(/calf/.test(n))return "calves";
 if(/hip thrust|glute bridge|kickback/.test(n))return "glutes";
 if(/romanian deadlift|pull.through/.test(n))return "hinge";
 if(/crunch|knee raise|dead bug|plank|pallof|ab wheel/.test(n))return "abs";
 return null;
}
function optionsFor(name){const key=groupFor(name);return key?{key,names:[name,...groups[key].filter(x=>x!==name)]}:null}
const oldNewDraft=newDraft;
newDraft=function(){oldNewDraft();draft.forEach((ex,i)=>{const chosen=swaps[day+":"+i];if(!chosen||chosen===ex.name)return;const original=ex.name;const a=groupFor(original),b=groupFor(chosen);if(a!==b)return;ex.name=chosen;const last=previous(chosen);ex.sets.forEach(set=>{set.weight=last?.weight??0;set.reps=last?.reps??""})})};
const oldTrain=trainView;
trainView=function(){oldTrain();document.querySelectorAll(".lift-card").forEach((card,i)=>{const ex=draft[i];if(!ex)return;const opts=optionsFor(ex.name);if(!opts)return;const row=document.createElement("div");row.className="swap-row";const id="swap-"+i;const current=ex.name;row.innerHTML='<label for="'+id+'" class="swap-label">SWAP EXERCISE <span>· '+escapeHTML(label[opts.key])+'</span></label><select id="'+id+'" class="swap-select" aria-label="Alternative for '+escapeHTML(ex.name)+'">'+opts.names.map(n=>'<option value="'+escapeHTML(n)+'" '+(n===current?"selected":"")+'>'+escapeHTML(n)+'</option>').join("")+'</select><p class="swap-hint">Choose a cable, machine, or free-weight variation targeting the same primary movement. Weights are not transferable across equipment.</p>';const heading=card.querySelector(".lift-heading");if(heading)heading.after(row);row.querySelector("select").onchange=e=>{const replacement=e.target.value;if(replacement===ex.name)return;swaps[day+":"+i]=replacement;localStorage.setItem(STORAGE,JSON.stringify(swaps));const last=previous(replacement);ex.name=replacement;ex.sets.forEach(set=>{set.weight=last?.weight??0;set.reps=last?.reps??"";set.done=false});render();}};
 });
};
newDraft();render();
})();