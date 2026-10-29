const PROGRAMS=[{"name":"Day 1 · Push","short":"Push","items":[["Flat dumbbell bench press",3,"6–10",60],["Incline dumbbell press",3,"8–12",55],["Cable fly",3,"12–15",20],["Cable lateral raise",3,"12–20",15],["Rope triceps pressdown",3,"10–15",40],["Cable overhead triceps extension",2,"10–15",30]]},{"name":"Day 2 · Pull","short":"Pull","items":[["Lat pulldown",3,"8–12",140],["Seated cable row",3,"8–12",115],["Chest-supported row",3,"8–12",90],["Straight-arm cable pulldown",2,"12–15",35],["Cable reverse fly",3,"12–20",20],["Cable biceps curl",3,"10–15",25],["Hammer curl",2,"10–15",25]]},{"name":"Day 3 · Lower A","short":"Lower A","items":[["Hack squat",4,"6–10",215],["Barbell walking lunges",3,"10–12/leg",65],["Leg extension machine",3,"12–15",90],["Hip abduction machine",2,"12–20",80],["Standing calf raise",4,"10–15",100],["Cable crunch",3,"12–15",50]]},{"name":"Day 4 · Upper B","short":"Upper B","items":[["Incline dumbbell press",3,"8–12",55],["Neutral-grip lat pulldown",3,"8–12",120],["Single-arm cable row",2,"10–12/side",45],["Dumbbell shoulder press",2,"8–12",25],["Cable lateral raise",3,"12–20",15],["Bayesian cable curl",2,"10–15",20],["Cable overhead triceps extension",2,"10–15",30]]},{"name":"Day 5 · Lower B","short":"Lower B","items":[["Dumbbell Romanian deadlift",3,"8–10",40],["Lying leg curl machine",4,"10–15",75],["Hip thrust",3,"8–12",135],["Leg press",2,"10–15",180],["Seated calf raise",3,"12–20",70],["Pallof press",3,"10–12/side",20]]},{"name":"Travel · Hotel A","short":"Hotel A","items":[["Dumbbell bench press",4,"8–12",40],["One-arm dumbbell row",4,"8–12",45],["Goblet squat",4,"10–15",50],["Dumbbell Romanian deadlift",3,"10–12",40],["Dumbbell lateral raise",3,"12–20",15],["Plank",3,"30–60 sec",0]]},{"name":"Travel · Hotel B","short":"Hotel B","items":[["Dumbbell incline press",4,"8–12",40],["Dumbbell split squat",3,"10–12/leg",30],["Chest-supported dumbbell row",4,"8–12",40],["Dumbbell shoulder press",3,"8–12",25],["Dumbbell hip thrust",3,"12–15",45],["Dead bug",3,"10–15",0]]}];
const KEY="strength-lab-data-v1", today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const $=s=>document.querySelector(s),escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state;try{state=JSON.parse(localStorage.getItem(KEY))||{sessions:[],measurements:[]}}catch{state={sessions:[],measurements:[]}};if(!Array.isArray(state.sessions))state.sessions=[];if(!Array.isArray(state.measurements))state.measurements=[];
let page="train",day=0,draft=[],cardio=false;
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
function previous(ex){for(const s of [...state.sessions].reverse()){const x=s.exercises?.find(v=>v.name===ex);if(x)return x.sets?.[0]}return null}
function newDraft(){draft=PROGRAMS[day].items.map(([name,count,range,weight])=>({name,range,sets:Array.from({length:count},()=>{const p=previous(name);return {weight:p?.weight??weight,reps:p?.reps??"",rir:2,done:false}})}));cardio=false}
function nav(){const pages=[["train","Train"],["progress","Progress"],["body","Body"],["guide","Guide"],["backup","Backup"]];$("#nav").innerHTML=pages.map(([id,label])=>'<button class="'+(page===id?"active":"")+'" data-page="'+id+'">'+label+"</button>").join("");document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{page=b.dataset.page;render()})}
function render(){nav();({train:trainView,progress:progressView,body:bodyView,guide:guideView,backup:backupView})[page]()}
function trainView(){const p=PROGRAMS[day];$("#app").innerHTML='<div class="card"><label>Choose your workout</label><select id="day" style="width:100%">'+PROGRAMS.map((x,i)=>'<option value="'+i+'" '+(i===day?"selected":"")+'>'+x.name+"</option>").join("")+'</select><p class="note">75-minute lifting session, plus a separate 30-minute incline walk. Log your working sets and reps in reserve (RIR).</p></div>'+draft.map((x,i)=>'<div class="card"><div class="row"><h2>'+escapeHTML(x.name)+'</h2><span class="pill">'+x.range+' reps</span></div><p class="muted" style="font-size:12px">Enter weight in lb; for dumbbells, enter weight per hand.</p>'+x.sets.map((s,j)=>'<div class="set"><div class="row"><b>Set '+(j+1)+'</b><label style="margin:0"><input type="checkbox" data-field="done" data-i="'+i+'" data-j="'+j+'" '+(s.done?"checked":"")+' style="width:auto"> Done</label></div><div class="grid"><div><label>Weight (lb)</label><input type="number" min="0" step="2.5" data-field="weight" data-i="'+i+'" data-j="'+j+'" value="'+s.weight+'"></div><div><label>Reps</label><input type="number" min="0" data-field="reps" data-i="'+i+'" data-j="'+j+'" value="'+s.reps+'"></div><div><label>RIR</label><input type="number" min="0" max="8" data-field="rir" data-i="'+i+'" data-j="'+j+'" value="'+s.rir+'"></div></div></div>').join("")+'</div>').join("")+'<div class="card"><label><input type="checkbox" id="cardio" style="width:auto" '+(cardio?"checked":"")+'> Completed separate 30-minute treadmill walk (12% incline, 2.4 mph)</label><p class="note">Progression: when you reach the top of the rep range across all sets with about 1–2 RIR, consider increasing load. Your flat DB bench baseline is 60 lb per hand × 4 × 8–9 at 2–3 RIR.</p><button class="primary" id="finish" style="width:100%">Save workout</button></div>';
$("#day").onchange=e=>{day=Number(e.target.value);newDraft();render()};document.querySelectorAll("[data-field]").forEach(el=>el.onchange=e=>{const {i,j,field}=e.target.dataset;draft[+i].sets[+j][field]=field==="done"?e.target.checked:Number(e.target.value)||0});$("#cardio").onchange=e=>cardio=e.target.checked;$("#finish").onclick=()=>{const done=draft.flatMap(x=>x.sets).filter(x=>x.done);if(!done.length&&!confirm("Save without any completed sets?"))return;state.sessions.push({id:Date.now(),date:today(),program:p.name,cardio,exercises:structuredClone(draft)});save();newDraft();page="progress";render();alert("Workout saved on this device.")}}
function progressView(){const sessions=[...state.sessions].reverse();const total=sessions.length;$("#app").innerHTML='<div class="card"><h2>Training progress</h2><div class="grid two"><div><div class="tag">Workouts</div><h1>'+total+'</h1></div><div><div class="tag">Completed sets</div><h1>'+state.sessions.reduce((n,s)=>n+s.exercises.reduce((a,x)=>a+x.sets.filter(t=>t.done).length,0),0)+'</h1></div></div></div><div class="card"><h2>Exercise trends</h2><label>Exercise</label><select id="exercise" style="width:100%">'+[...new Set(state.sessions.flatMap(s=>s.exercises.map(x=>x.name)))].map(x=>'<option>'+escapeHTML(x)+'</option>').join("")+'</select><div id="chart"></div></div><h2>Workout history</h2>'+(sessions.length?sessions.map(s=>'<div class="card"><div class="row"><div><b>'+escapeHTML(s.program)+'</b><p class="muted">'+s.date+' · '+s.exercises.reduce((n,x)=>n+x.sets.filter(t=>t.done).length,0)+' sets · Walk '+(s.cardio?"yes":"no")+'</p></div><button data-delete="'+s.id+'">Delete</button></div></div>').join(""):'<p class="note">Your saved workouts will appear here.</p>');const sel=$("#exercise");if(sel){sel.onchange=chart;chart()}document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{if(confirm("Delete this workout?")){state.sessions=state.sessions.filter(x=>String(x.id)!==b.dataset.delete);save();render()}})}
function chart(){const name=$("#exercise")?.value,pts=state.sessions.flatMap(s=>s.exercises.filter(x=>x.name===name).map(x=>({date:s.date,max:Math.max(0,...x.sets.filter(t=>t.done).map(t=>Number(t.weight)||0))}))).filter(x=>x.max>0);$("#chart").innerHTML=pts.length?lineChart(pts.map(x=>x.max))+'<small>Max completed-set weight (lb) · '+pts.length+' logged sessions</small>':'<p class="note">Log completed sets to see your strength trend.</p>'}
function lineChart(a){const max=Math.max(...a,1),min=Math.min(...a,0),range=max-min||1;const points=a.map((v,i)=>[(i/(Math.max(1,a.length-1)))*310+15,115-((v-min)/range)*95]);return '<svg viewBox="0 0 340 140" role="img" aria-label="Progress trend"><path d="M15 120H325" stroke="#52708e" fill="none"/><polyline points="'+points.map(p=>p.join(",")).join(" ")+'" fill="none" stroke="#75c3ff" stroke-width="3"/>'+points.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#75c3ff"/>').join("")+'</svg>'}
function bodyView(){$("#app").innerHTML='<div class="card"><h2>Body measurements</h2><p class="note">Track trends without counting calories. Measurements stay on this device.</p><label>Date</label><input id="date" type="date" value="'+today()+'"><div class="grid two"><div><label>Weight (lb)</label><input id="weight" type="number" step=".1" placeholder="164"></div><div><label>Waist (in)</label><input id="waist" type="number" step=".1" placeholder="optional"></div></div><label>Sleep (hours)</label><input id="sleep" type="number" step=".25" placeholder="optional"><button id="add" class="primary" style="margin-top:12px;width:100%">Save measurement</button></div><div class="card"><h2>Bodyweight trend</h2>'+ (state.measurements.filter(x=>x.weight).length?lineChart([...state.measurements].sort((a,b)=>a.date.localeCompare(b.date)).filter(x=>x.weight).map(x=>x.weight)):'<p class="note">Add measurements to see a trend.</p>')+'</div>'+[...state.measurements].reverse().map(x=>'<div class="card">'+x.date+' · '+(x.weight||"—")+' lb · waist '+(x.waist||"—")+' in · sleep '+(x.sleep||"—")+' h</div>').join("");$("#add").onclick=()=>{const x={date:$("#date").value,weight:Number($("#weight").value)||null,waist:Number($("#waist").value)||null,sleep:Number($("#sleep").value)||null};if(!x.weight&&!x.waist&&!x.sleep){alert("Enter at least one measurement.");return}state.measurements.push(x);save();render()}}
function guideView(){$("#app").innerHTML='<div class="card"><h2>Training principles</h2><p class="note">Start most working sets around 2–3 reps in reserve. Use controlled eccentrics, full comfortable range of motion, and stable positioning. Rest 2–3 minutes on compounds and 60–90 seconds on accessories.</p><p class="note">For flat dumbbell bench, aim for 4 × 10 at 60 lb per hand with 1–2 RIR before considering 65 lb. Increase load only while technique stays consistent.</p><p class="note">Travel sessions replace—not add to—a scheduled strength session. Adjust load to hotel equipment.</p></div>'+PROGRAMS.map(p=>'<div class="card"><h2>'+p.name+'</h2>'+p.items.map(x=>'<div class="set"><b>'+x[0]+'</b><div class="muted">'+x[1]+' sets × '+x[2]+' reps</div></div>').join("")+'</div>').join("")}
function download(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function backupView(){$("#app").innerHTML='<div class="card"><h2>Your data stays yours</h2><p class="note">Your workouts are stored locally in this browser/app. They are not synced across devices. Clearing website data or removing the app can erase them, so export a backup regularly.</p><button class="primary" id="json" style="width:100%">Download JSON backup</button><p><button id="csv" style="width:100%">Export workouts CSV</button></p><label>Restore a previous JSON backup</label><input type="file" id="restore" accept=".json,application/json"></div>';$("#json").onclick=()=>download("strength-lab-backup-"+today()+".json",JSON.stringify(state,null,2),"application/json");$("#csv").onclick=()=>{const rows=[["date","program","exercise","set","weight_lb","reps","rir","done"]];state.sessions.forEach(s=>s.exercises.forEach(x=>x.sets.forEach((t,i)=>rows.push([s.date,s.program,x.name,i+1,t.weight,t.reps,t.rir,t.done]))));download("strength-lab-workouts.csv",rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n"),"text/csv")};$("#restore").onchange=async e=>{try{const obj=JSON.parse(await e.target.files[0].text());if(!Array.isArray(obj.sessions)||!Array.isArray(obj.measurements))throw Error("Invalid backup");if(!confirm("Replace current local data with this backup?"))return;state=obj;save();render();alert("Backup restored.")}catch(err){alert("Could not restore: "+err.message)}}}
newDraft();render();if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});



const GLOSSARY=[
["RIR","Reps in reserve: how many more good-form repetitions you estimate you could complete before failure."],
["Hypertrophy","An increase in muscle size resulting from training and recovery."],
["Progressive overload","Gradually increasing the challenge over time, for example through more repetitions, heavier weights, or better control."],
["Working set","A challenging set that counts toward your training volume; unlike lighter warm-up sets."],
["Rep range","The target number of repetitions for a set, such as 8–12."],
["Compound exercise","A movement using multiple joints and muscle groups, such as a squat or press."],
["Isolation exercise","A movement focused primarily on one joint or muscle group, such as a biceps curl."],
["Tempo","The speed and control used during each phase of a repetition."],
["Eccentric","The phase when the working muscle lengthens under load, such as lowering a dumbbell."],
["Concentric","The phase when the working muscle shortens, such as pressing a dumbbell upward."],
["Deload","A planned period of easier training, often using fewer sets or lighter loads, to support recovery."],
["Training volume","The amount of work performed, commonly counted as challenging sets per muscle group."],
["Range of motion","The distance and joint movement covered during an exercise."],
["Failure","The point where you cannot complete another repetition with acceptable technique."],
["Personal record (PR)","Your best recorded performance for an exercise, such as your heaviest completed set."],
["Double progression","First increase reps within a target range; once you reach the upper end with good form, increase weight."],
["Recomposition","Gaining or maintaining muscle while reducing body fat over time."]
];

const MUSCLES={
"Flat dumbbell bench press":[["Chest (pectorals)"],["Triceps","Front deltoids"]],
"Lat pulldown":[["Latissimus dorsi (lats)"],["Biceps","Mid-back","Rear deltoids"]],
"Incline dumbbell press":[["Upper chest (clavicular pecs)"],["Front deltoids","Triceps"]],
"Seated cable row":[["Mid-back (rhomboids, trapezius)","Lats"],["Biceps","Rear deltoids"]],
"Dumbbell lateral raise":[["Side deltoids"],["Upper trapezius"]],
"Triceps pressdown":[["Triceps"],[]],
"Dumbbell biceps curl":[["Biceps"],["Brachialis","Forearms"]],
"Hack squat":[["Quadriceps"],["Glutes","Adductors"]],
"Romanian deadlift":[["Hamstrings","Glutes"],["Spinal erectors","Adductors"]],
"Seated leg curl":[["Hamstrings"],["Calves"]],
"Leg extension":[["Quadriceps"],[]],
"Standing calf raise":[["Calves (gastrocnemius)"],["Soleus"]],
"Cable crunch":[["Abdominals (rectus abdominis)"],["Obliques"]],
"Chest-supported row":[["Mid-back","Lats"],["Biceps","Rear deltoids"]],
"Machine shoulder press":[["Front deltoids","Side deltoids"],["Triceps"]],
"Cable fly":[["Chest (pectorals)"],["Front deltoids"]],
"Reverse pec deck":[["Rear deltoids"],["Rhomboids","Mid trapezius"]],
"Incline dumbbell curl":[["Biceps"],["Brachialis"]],
"Overhead triceps extension":[["Triceps (long head)"],[]],
"Leg press":[["Quadriceps","Glutes"],["Adductors"]],
"Hip thrust":[["Glutes"],["Hamstrings"]],
"Bulgarian split squat":[["Quadriceps","Glutes"],["Adductors","Core"]],
"Lying leg curl":[["Hamstrings"],["Calves"]],
"Seated calf raise":[["Calves (soleus)"],["Gastrocnemius"]],
"Hanging knee raise":[["Abdominals"],["Hip flexors"]],
"Dumbbell bench press":[["Chest (pectorals)"],["Triceps","Front deltoids"]],
"One-arm dumbbell row":[["Lats","Mid-back"],["Biceps","Rear deltoids"]],
"Goblet squat":[["Quadriceps","Glutes"],["Core"]],
"Dumbbell Romanian deadlift":[["Hamstrings","Glutes"],["Spinal erectors"]],
"Plank":[["Abdominals","Deep core"],["Glutes","Shoulders"]],
"Dumbbell incline press":[["Upper chest"],["Front deltoids","Triceps"]],
"Dumbbell split squat":[["Quadriceps","Glutes"],["Core"]],
"Chest-supported dumbbell row":[["Mid-back","Lats"],["Biceps","Rear deltoids"]],
"Dumbbell shoulder press":[["Deltoids"],["Triceps"]],
"Dumbbell hip thrust":[["Glutes"],["Hamstrings"]],
"Dead bug":[["Deep core","Abdominals"],["Hip flexors"]]
};
const GROUPS=[["Chest",/chest|pectoral/i],["Back",/lat|mid-back|rhomboid|trapezius/i],["Shoulders",/deltoid/i],["Biceps",/biceps|brachialis/i],["Triceps",/triceps/i],["Quads",/quadriceps/i],["Hamstrings",/hamstrings/i],["Glutes",/glutes/i],["Calves",/calves|soleus|gastrocnemius/i],["Core",/abdominals|core|obliques/i]];
function muscleData(name){return MUSCLES[name]||[["Muscle information pending"],[]]}

const EXERCISE_DETAILS={
"Flat dumbbell bench press":{desc:"Flat-bench chest press with a dumbbell in each hand.",steps:["Lie on a flat bench with feet planted and shoulder blades gently set.","Lower both dumbbells with wrists stacked over forearms.","Press upward with control; avoid bouncing or losing shoulder position."],mistakes:["Flaring elbows excessively","Bouncing at the bottom","Lifting hips off the bench"]},
"Lat pulldown":{desc:"Vertical cable pull toward the upper chest.",steps:["Set thigh pads snugly and grasp the bar.","Pull elbows toward your sides while bringing the bar toward upper chest.","Return slowly without shrugging or swinging."],mistakes:["Pulling behind the neck","Leaning back excessively","Using momentum"]},
"Incline dumbbell press":{desc:"Incline-bench dumbbell chest press.",steps:["Set a moderate incline and plant both feet.","Lower dumbbells with elbows slightly tucked.","Press up without crashing the dumbbells together."],mistakes:["Using a nearly vertical bench","Overarching the lower back","Bouncing at the bottom"]},
"Hack squat":{desc:"Machine-supported squat using a hack-squat sled.",steps:["Set shoulders beneath pads and position feet securely.","Lower the sled with knees tracking over toes.","Push through the feet without locking knees abruptly."],mistakes:["Lifting heels","Letting knees collapse inward","Descending beyond controllable range"]},
"Romanian deadlift":{desc:"Hip-hinge movement emphasizing hamstrings and glutes.",steps:["Stand tall with barbell close to thighs.","Push hips backward with soft knees and a braced trunk.","Stand by driving hips forward while keeping the bar close."],mistakes:["Rounding the back","Turning the movement into a squat","Lowering past controlled hip range"]},
"Bulgarian split squat":{desc:"Rear-foot-elevated single-leg squat.",steps:["Place rear foot on a bench and establish a stable front stance.","Lower under control by bending the front knee and hip.","Press through the front foot to stand."],mistakes:["Front stance too narrow","Bouncing at the bottom","Pushing mostly from rear foot"]}
};

/* Strength Lab 3.0 — redesigned experience, preserving localStorage format */
const EXERCISES=[...new Set(PROGRAMS.flatMap(p=>p.items.map(x=>x[0])))];
let selectedExercise=EXERCISES[0],libraryQuery="",libraryFilter="All";
const CATEGORIES=["All","Chest","Back","Legs","Shoulders","Arms","Core"];
function category(name){const a=muscleData(name)[0].join(" ").toLowerCase();if(/chest|pec/.test(a))return "Chest";if(/lat|back|rhomboid|trap/.test(a))return "Back";if(/deltoid/.test(a))return "Shoulders";if(/bicep|tricep/.test(a))return "Arms";if(/abdominal|oblique|core/.test(a))return "Core";return "Legs"}
function muscleTags(name){const [p,s]=muscleData(name);return '<div class="chips">'+p.map(m=>'<span class="chip primary-chip">'+escapeHTML(m)+'</span>').join("")+s.slice(0,2).map(m=>'<span class="chip">'+escapeHTML(m)+'</span>').join("")+'</div>'}
function visual(name,compact=false){return '<div class="visual '+(compact?'compact':'')+'"><div class="visual-icon" aria-hidden="true">✦</div><div><b>Verified '+(compact?'visual':'demonstration')+' pending</b>'+(compact?'':'<p>We will only display an image or video showing this exact exercise and equipment. The concept mockups are not instructional photographs.</p>')+'</div></div>'}
function header(kicker,title,desc){return '<div class="section-header"><span class="eyebrow">'+kicker+'</span><h2>'+title+'</h2>'+(desc?'<p class="subtle">'+desc+'</p>':'')+'</div>'}
function goGuide(name){selectedExercise=name;page="guide";render();window.scrollTo(0,0)}
function nav(){const tabs=[["train","Train","◉"],["progress","Progress","▥"],["body","Body","♙"],["guide","Guide","▤"],["backup","Settings","⚙"]];$("#nav").innerHTML=tabs.map(([id,label,icon])=>'<button class="tab '+(page===id?'active':'')+'" data-page="'+id+'" aria-label="'+label+'"><span class="tab-icon">'+icon+'</span><span>'+label+'</span></button>').join("");document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{page=b.dataset.page;render();window.scrollTo(0,0)})}
function render(){nav();({train:trainView,progress:progressView,body:bodyView,guide:guideView,backup:backupView})[page]()}
function trainView(){
 const p=PROGRAMS[day],sessions=state.sessions.length,sets=state.sessions.reduce((n,s)=>n+s.exercises.reduce((a,x)=>a+x.sets.filter(t=>t.done).length,0),0);
 $("#app").innerHTML=header("YOUR TRAINING / FLEXIBLE 5-SESSION ROTATION","Train on your schedule.","Follow Days 1–5 in sequence whenever you train. Hotel workouts are flexible alternatives.")+
 '<div class="stats"><div class="stat"><span>Workouts logged</span><strong>'+sessions+'</strong></div><div class="stat"><span>Sets completed</span><strong>'+sets+'</strong></div><div class="stat"><span>Plan</span><strong>5 sessions</strong></div></div>'+
 '<div class="card workout-picker"><label for="day">TODAY’S WORKOUT</label><select id="day">'+PROGRAMS.map((x,i)=>'<option value="'+i+'" '+(day===i?'selected':'')+'>'+x.name+'</option>').join("")+'</select><div class="workout-summary"><div><strong>'+p.short+'</strong><p class="subtle">'+p.items.length+' exercises · 75 min lifting</p></div><span class="chip primary-chip">'+(day<5?'Gym':'Travel')+'</span></div><p class="subtle">Separate optional 30-minute incline walk: 12% grade at 2.4 mph.</p></div>'+
 '<div class="section-title"><h2>Working sets</h2><span class="subtle">Weight in lb · DB per hand</span></div>'+
 draft.map((x,i)=>'<div class="card lift-card"><div class="lift-heading"><div><span class="eyebrow">EXERCISE '+String(i+1).padStart(2,"0")+'</span><h3>'+escapeHTML(x.name)+'</h3><span class="chip">'+x.range+' reps</span></div><button class="guide-action" data-guide="'+i+'">Form & muscles ↗</button></div>'+
 x.sets.map((s,j)=>'<div class="set-line"><div class="set-label"><strong>Set '+(j+1)+'</strong><label class="done-label"><input type="checkbox" data-field="done" data-i="'+i+'" data-j="'+j+'" '+(s.done?'checked':'')+'> Done</label></div><div class="set-fields"><label>LB<input type="number" min="0" step="2.5" data-field="weight" data-i="'+i+'" data-j="'+j+'" value="'+s.weight+'"></label><label>REPS<input type="number" min="0" data-field="reps" data-i="'+i+'" data-j="'+j+'" value="'+s.reps+'"></label><label>RIR<input type="number" min="0" max="8" data-field="rir" data-i="'+i+'" data-j="'+j+'" value="'+s.rir+'"></label></div></div>').join("")+'</div>').join("")+
 '<div class="card"><label class="cardio"><input type="checkbox" id="cardio" '+(cardio?'checked':'')+'> Completed separate 30-minute incline walk</label><p class="subtle">Progress by adding reps first. Increase weight once you consistently reach the top of your rep range with 1–2 RIR and controlled form.</p><button class="primary full" id="finish">Save completed workout</button></div>';
 $("#day").onchange=e=>{day=Number(e.target.value);newDraft();render()};
 document.querySelectorAll("[data-field]").forEach(el=>el.onchange=e=>{const {i,j,field}=e.target.dataset;draft[+i].sets[+j][field]=field==="done"?e.target.checked:Number(e.target.value)||0});
 document.querySelectorAll("[data-guide]").forEach(b=>b.onclick=()=>goGuide(draft[Number(b.dataset.guide)].name));
 $("#cardio").onchange=e=>cardio=e.target.checked;
 $("#finish").onclick=()=>{const done=draft.flatMap(x=>x.sets).filter(s=>s.done);if(!done.length&&!confirm("Save without completed sets?"))return;state.sessions.push({id:Date.now(),date:today(),program:p.name,cardio,exercises:structuredClone(draft)});save();newDraft();page="progress";render();window.scrollTo(0,0)};
}
function guideView(){
 $("#app").innerHTML=header("THE MOVEMENT LIBRARY","Know every rep.","Every guide matches an exercise in your exact program.")+
 '<div class="card"><label for="search">SEARCH EXERCISES</label><input id="search" type="search" placeholder="Search exercises…" value="'+escapeHTML(libraryQuery)+'"><div class="filters">'+CATEGORIES.map(c=>'<button class="filter '+(libraryFilter===c?'selected':'')+'" data-filter="'+c+'">'+c+'</button>').join("")+'</div></div><div id="libraryList"></div><div id="exerciseDetail"></div>';
 const search=$("#search");search.oninput=()=>{libraryQuery=search.value;showLibrary()};
 document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{libraryFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("selected",x.dataset.filter===libraryFilter));showLibrary()});
 showLibrary();
}
function showLibrary(){
 const found=EXERCISES.filter(n=>n.toLowerCase().includes(libraryQuery.toLowerCase())&&(libraryFilter==="All"||category(n)===libraryFilter));
 $("#libraryList").innerHTML='<div class="section-title"><h2>Exercises</h2><span class="subtle">'+found.length+' movements</span></div>'+(found.length?found.map(n=>'<button class="exercise-row '+(selectedExercise===n?'chosen':'')+'" data-ex="'+escapeHTML(n)+'"><span class="exercise-glyph">'+({Chest:"◉",Back:"↗",Legs:"▱",Shoulders:"◇",Arms:"↟",Core:"⊕"}[category(n)])+'</span><span class="exercise-name"><b>'+escapeHTML(n)+'</b><small>'+category(n)+' · View form guide</small></span><span class="chevron">›</span></button>').join(""):'<div class="card subtle">No matching exercises.</div>');
 document.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>{selectedExercise=b.dataset.ex;showLibrary();$("#exerciseDetail").scrollIntoView({behavior:"smooth",block:"start"})});
 showDetail();
}
function showDetail(){
 const name=selectedExercise,detail=EXERCISE_DETAILS[name]||{},[primary,secondary]=muscleData(name),steps=detail.steps||["Set your starting position and brace your trunk.","Move through a comfortable range of motion with control.","Finish the repetition without swinging or using momentum."],errors=detail.mistakes||["Using momentum or excessive load","Losing a stable starting position"];
 const rx=PROGRAMS.flatMap(p=>p.items).find(x=>x[0]===name),used=PROGRAMS.filter(p=>p.items.some(x=>x[0]===name)).map(p=>p.short);
 $("#exerciseDetail").innerHTML='<div class="detail"><div class="detail-head"><span class="eyebrow">EXERCISE GUIDE / '+escapeHTML(used.join(" · "))+'</span><h2>'+escapeHTML(name)+'</h2><p class="subtle">'+escapeHTML(detail.desc||"Controlled resistance training movement.")+'</p>'+muscleTags(name)+'</div>'+
 '<div class="card media-card"><div class="eyebrow">EXERCISE FORM</div>'+visual(name)+'</div>'+
 '<div class="card"><h3>Muscles activated</h3><div class="legend"><span class="dot red"></span><div><strong>Primary</strong><p>'+escapeHTML(primary.join(" · "))+'</p></div></div><div class="legend"><span class="dot blue"></span><div><strong>Secondary</strong><p>'+escapeHTML(secondary.join(" · ")||"None specifically listed")+'</p></div></div><p class="subtle">Muscle recruitment varies with form, equipment and individual anatomy.</p></div>'+
 '<div class="card"><h3>Technique cues</h3>'+steps.map((v,i)=>'<div class="instruction"><span>'+(i+1)+'</span><p>'+escapeHTML(v)+'</p></div>').join("")+'</div>'+
 '<div class="card warning"><h3>Common mistakes</h3>'+errors.map(v=>'<div class="error"><span>×</span>'+escapeHTML(v)+'</div>').join("")+'</div>'+
 '<div class="card"><h3>Your prescription</h3><p class="subtle">'+(rx?rx[1]+' working sets · '+escapeHTML(rx[2])+' reps':'Included in your plan')+'</p><p class="subtle">Keep 1–3 reps in reserve on most sets and prioritize stable technique.</p></div></div>';
}
function progressView3(){progressViewLegacy();$("#app").insertAdjacentHTML("afterbegin",header("TRAINING ANALYTICS","Your progress.","Strength, consistency and training history in one place."))}
function bodyView3(){bodyViewLegacy();$("#app").insertAdjacentHTML("afterbegin",header("BODY COMPOSITION","Measure what matters.","Weight, waist and recovery trends. No calorie tracking required."))}
function backupView3(){backupViewLegacy();$("#app").insertAdjacentHTML("afterbegin",header("YOUR DATA","Settings & backup.","Your history stays on this device unless you export it.")+'<div class="card"><h3>About Strength Lab 3.0</h3><p class="subtle">Built around four lifting days and hotel alternatives. Media is only displayed when the exact exercise and rights are verified.</p></div>')}
const progressViewLegacy=progressView,bodyViewLegacy=bodyView,backupViewLegacy=backupView;
progressView=progressView3;bodyView=bodyView3;backupView=backupView3;
render();


/* Strength Lab 3.1 — original exercise-specific vector assets and balanced coverage */
const PROGRAM_ADDITIONS=[
{day:0,item:["Hammer curl",2,"10–15",25]},
{day:2,item:["Straight-arm cable pulldown",2,"12–15",35]},
{day:2,item:["Preacher curl",2,"10–15",20]},
{day:1,item:["Hip abduction machine",2,"12–20",65]},
{day:3,item:["Hip adduction machine",2,"12–20",65]}
];
for(const add of PROGRAM_ADDITIONS){if(!PROGRAMS[add.day].items.some(x=>x[0]===add.item[0]))PROGRAMS[add.day].items.push(add.item)}
Object.assign(MUSCLES,{
"Hammer curl":[["Brachialis","Brachioradialis"],["Biceps"]],
"Preacher curl":[["Biceps"],["Brachialis","Forearms"]],
"Straight-arm cable pulldown":[["Latissimus dorsi (lats)"],["Teres major","Triceps (long head)"]],
"Hip abduction machine":[["Gluteus medius","Gluteus minimus"],["Gluteus maximus"]],
"Hip adduction machine":[["Hip adductors"],["Gracilis"]]
});
EXERCISES.splice(0,EXERCISES.length,...new Set(PROGRAMS.flatMap(p=>p.items.map(x=>x[0]))));
const ART_VARIANTS={
"Flat dumbbell bench press":["bench","dumbbells","horizontal press"],
"Dumbbell bench press":["bench","dumbbells","horizontal press"],
"Incline dumbbell press":["incline bench","dumbbells","incline press"],
"Dumbbell incline press":["incline bench","dumbbells","incline press"],
"Lat pulldown":["pulldown machine","cable bar","vertical pull"],
"Seated cable row":["seated cable machine","cable handle","horizontal pull"],
"Chest-supported row":["chest-supported bench","row handles","horizontal pull"],
"Chest-supported dumbbell row":["incline bench","dumbbells","horizontal pull"],
"One-arm dumbbell row":["flat bench","one dumbbell","single-arm row"],
"Dumbbell lateral raise":["standing","dumbbells","lateral raise"],
"Triceps pressdown":["cable tower","cable bar","elbow extension"],
"Overhead triceps extension":["standing","dumbbell","overhead extension"],
"Dumbbell biceps curl":["standing","dumbbells","supinated curl"],
"Incline dumbbell curl":["incline bench","dumbbells","incline curl"],
"Hammer curl":["standing","dumbbells","neutral-grip curl"],
"Preacher curl":["preacher bench","dumbbell","supported curl"],
"Hack squat":["hack squat sled","sled","squat"],
"Romanian deadlift":["standing","barbell","hip hinge"],
"Dumbbell Romanian deadlift":["standing","dumbbells","hip hinge"],
"Seated leg curl":["seated leg curl machine","roller pad","knee flexion"],
"Lying leg curl":["lying leg curl machine","roller pad","knee flexion"],
"Leg extension":["leg extension machine","roller pad","knee extension"],
"Standing calf raise":["standing calf machine","shoulder pads","plantar flexion"],
"Seated calf raise":["seated calf machine","knee pads","plantar flexion"],
"Cable crunch":["cable tower","rope","trunk flexion"],
"Machine shoulder press":["shoulder press machine","handles","vertical press"],
"Dumbbell shoulder press":["seated bench","dumbbells","vertical press"],
"Cable fly":["cable crossover","cable handles","chest fly"],
"Reverse pec deck":["reverse pec deck machine","handles","rear delt fly"],
"Leg press":["leg press sled","foot platform","leg press"],
"Hip thrust":["bench","barbell","hip extension"],
"Dumbbell hip thrust":["bench","dumbbell","hip extension"],
"Bulgarian split squat":["rear-foot bench","dumbbells","split squat"],
"Dumbbell split squat":["standing","dumbbells","split squat"],
"Goblet squat":["standing","single dumbbell","squat"],
"Hanging knee raise":["pull-up station","bodyweight","knee raise"],
"Plank":["floor","bodyweight","isometric core"],
"Dead bug":["floor","bodyweight","alternating core"],
"Straight-arm cable pulldown":["cable tower","straight bar","shoulder extension"],
"Hip abduction machine":["seated hip machine","outer thigh pads","hip abduction"],
"Hip adduction machine":["seated hip machine","inner thigh pads","hip adduction"]
};
function exerciseArtwork(name){
 const [station,equipment,motion]=ART_VARIANTS[name]||["gym station","resistance","controlled movement"];
 const isBench=/bench|seated|lying|floor|sled|leg press|machine/.test(station);
 const isHinge=/hinge|row|pulldown/.test(motion);
 const isSquat=/squat|leg press|knee flexion|knee extension/.test(motion);
 const isArms=/curl|extension|raise|fly|press/.test(motion);
 const body=(phase)=>{
   const top=phase?16:0,lean=isHinge?22:0,knee=isSquat?(phase?27:11):0;
   return '<g transform="translate('+(phase?242:68)+' 18) rotate('+(lean?12:0)+' 85 130)">'+
   '<ellipse cx="86" cy="41" rx="18" ry="23" fill="#d5a58b" stroke="#f1c4a5" stroke-width="2"/>'+
   '<path d="M66 69 Q86 60 107 69 L121 145 Q86 163 52 145 Z" fill="#2c78ad" stroke="#82c4ed" stroke-width="3"/>'+
   '<path d="M59 78 Q44 91 '+(phase?'35 126':'48 122')+' L'+(phase?'37':'53')+' 154" fill="none" stroke="#d5a58b" stroke-width="15" stroke-linecap="round"/>'+
   '<path d="M111 78 Q129 91 '+(phase?'139 120':'125 122')+' L'+(phase?'141':'121')+' 153" fill="none" stroke="#d5a58b" stroke-width="15" stroke-linecap="round"/>'+
   '<path d="M60 149 L'+(72+knee)+' 200 L'+(58+knee)+' 257" fill="none" stroke="#252e42" stroke-width="22" stroke-linecap="round"/>'+
   '<path d="M109 149 L'+(110-knee)+' 200 L'+(125-knee)+' 257" fill="none" stroke="#252e42" stroke-width="22" stroke-linecap="round"/>'+
   '<path d="M'+(44+knee)+' 259h34 M'+(110-knee)+' 259h34" stroke="#9bb5c9" stroke-width="13" stroke-linecap="round"/>'+
   (equipment.includes("dumbbell")?'<g fill="#b7c4d0"><rect x="29" y="'+(phase?139:151)+'" width="22" height="16" rx="3"/><rect x="131" y="'+(phase?139:151)+'" width="22" height="16" rx="3"/></g>':equipment.includes("bar")?'<path d="M25 '+(phase?127:151)+'h131" stroke="#a7b6c7" stroke-width="8"/>':'')+'</g>';
 };
 return '<svg class="art-svg" viewBox="0 0 420 310" role="img" aria-label="Original conceptual illustration for '+escapeHTML(name)+', start and finish positions. Not a verified form demonstration"><defs><linearGradient id="artbg" x2="1" y2="1"><stop stop-color="#172b3d"/><stop offset="1" stop-color="#0b121c"/></linearGradient></defs><rect width="420" height="310" rx="17" fill="url(#artbg)"/><path d="M210 12v284" stroke="#36465a" stroke-dasharray="5 7"/><path d="M15 283h390" stroke="#536b80" stroke-width="2"/>'+
 (isBench?'<g stroke="#74889a" stroke-width="7"><path d="M60 171h125 M263 171h125"/><path d="M77 171v104 M167 171v104 M281 171v104 M370 171v104"/></g>':'')+
 body(false)+body(true)+
 '<g fill="#dce8f6" font-size="12" font-family="Arial,sans-serif" font-weight="bold"><text x="18" y="24">START</text><text x="228" y="24">FINISH</text></g><g fill="#91b6d3" font-size="11" font-family="Arial,sans-serif"><text x="18" y="301">'+escapeHTML(equipment)+'</text><text x="228" y="301">'+escapeHTML(motion)+'</text></g></svg>';
}
function anatomyArtwork(name){
 const all=muscleData(name)[0].join(" ").toLowerCase();
 const region=/chest|pec/.test(all)?"chest":/lat|back|rhomboid|trap/.test(all)?"back":/bicep|brachialis|brachioradialis/.test(all)?"arms":/tricep/.test(all)?"arms":/deltoid/.test(all)?"shoulders":/hamstring|glute|hip/.test(all)?"posterior":/quadricep/.test(all)?"legs":/calf|soleus/.test(all)?"calves":"core";
 const patches={chest:'<path d="M54 83Q76 65 90 84V112Q68 122 51 108Z M94 84Q111 65 134 83L137 108Q117 122 94 112Z"/>',back:'<path d="M53 85Q74 75 91 99L91 168Q54 156 47 105Z M95 99Q112 75 135 85L141 105Q133 156 95 168Z"/>',arms:'<ellipse cx="38" cy="116" rx="12" ry="30"/><ellipse cx="148" cy="116" rx="12" ry="30"/>',shoulders:'<ellipse cx="48" cy="85" rx="17" ry="19"/><ellipse cx="138" cy="85" rx="17" ry="19"/>',posterior:'<ellipse cx="73" cy="179" rx="20" ry="20"/><ellipse cx="113" cy="179" rx="20" ry="20"/><path d="M59 202h27v65H57Z M101 202h27v65h-27Z"/>',legs:'<path d="M55 199h33v70H55Z M100 199h33v70h-33Z"/>',calves:'<path d="M58 267h27v34H58Z M103 267h27v34h-27Z"/>',core:'<rect x="67" y="113" width="52" height="58" rx="12"/>'};
 return '<svg class="anatomy-svg" viewBox="0 0 190 320" role="img" aria-label="Simplified muscle-region map highlighting '+escapeHTML(muscleData(name)[0].join(", "))+'"><g fill="#748191" stroke="#c1ccd6" stroke-width="2"><ellipse cx="93" cy="35" rx="24" ry="30"/><path d="M67 68Q45 69 33 93L48 164L56 199L52 288L73 311L90 212L96 212L114 311L135 288L130 199L140 164L154 93Q141 69 119 68Z"/><path d="M37 95L21 167L36 179L55 123 M149 95L169 167L153 179L131 123" stroke-width="17" stroke-linecap="round"/></g><g fill="#ff6b61" stroke="#ff9d8b" stroke-width="1.5">'+patches[region]+'</g><path d="M93 69v141" stroke="#c7d0da" opacity=".4" stroke-width="2"/></svg>';
}
function visual(name,compact=false){return '<div class="artwork">'+exerciseArtwork(name)+'</div><p class="art-disclaimer">Original conceptual illustration · '+escapeHTML(name)+' · Positions are illustrative, not verified coaching frames.</p>'}
function showDetail(){
 const name=selectedExercise,detail=EXERCISE_DETAILS[name]||{},[primary,secondary]=muscleData(name),steps=detail.steps||["Set your starting position and brace your trunk.","Move through a comfortable range of motion with control.","Finish the repetition without swinging or using momentum."],errors=detail.mistakes||["Using momentum or excessive load","Losing a stable starting position"];
 const rx=PROGRAMS.flatMap(p=>p.items).find(x=>x[0]===name),used=PROGRAMS.filter(p=>p.items.some(x=>x[0]===name)).map(p=>p.short);
 $("#exerciseDetail").innerHTML='<div class="detail"><div class="detail-head"><span class="eyebrow">EXERCISE GUIDE / '+escapeHTML(used.join(" · "))+'</span><h2>'+escapeHTML(name)+'</h2><p class="subtle">'+escapeHTML(detail.desc||"Controlled resistance training movement.")+'</p>'+muscleTags(name)+'</div>'+
 '<div class="card media-card"><div class="eyebrow">ORIGINAL EXERCISE VISUAL</div>'+visual(name)+'</div>'+
 '<div class="card"><h3>Muscles activated</h3><div class="muscle-visual"><div class="anatomy-wrap">'+anatomyArtwork(name)+'</div><div class="muscle-legend"><div class="legend"><span class="dot red"></span><div><strong>Primary</strong><p>'+escapeHTML(primary.join(" · "))+'</p></div></div><div class="legend"><span class="dot blue"></span><div><strong>Secondary</strong><p>'+escapeHTML(secondary.join(" · ")||"None specifically listed")+'</p></div></div></div></div><p class="subtle">Simplified regional highlighting; muscle recruitment varies with technique and anatomy.</p></div>'+
 '<div class="card"><h3>Technique cues</h3>'+steps.map((v,i)=>'<div class="instruction"><span>'+(i+1)+'</span><p>'+escapeHTML(v)+'</p></div>').join("")+'</div>'+
 '<div class="card warning"><h3>Common mistakes</h3>'+errors.map(v=>'<div class="error"><span>×</span>'+escapeHTML(v)+'</div>').join("")+'</div>'+
 '<div class="card"><h3>Your prescription</h3><p class="subtle">'+(rx?rx[1]+' working sets · '+escapeHTML(rx[2])+' reps':'Included in your plan')+'</p><p class="subtle">Keep 1–3 reps in reserve on most sets and prioritize stable technique.</p></div></div>';
}
function coverageSummary(){
 const groups=["Chest","Back","Shoulders","Arms","Legs","Core"];
 return '<div class="card"><h3>Weekly muscle coverage</h3><p class="subtle">Your program trains all major regions. Three exercise variations are not a scientific requirement for complete muscle development.</p><div class="coverage-grid">'+groups.map(group=>{const lifts=PROGRAMS.slice(0,4).flatMap(p=>p.items).filter(x=>category(x[0])===group);return '<div class="coverage-cell"><b>'+group+'</b><span>'+lifts.reduce((n,x)=>n+x[1],0)+' sets/wk</span></div>'}).join("")+'</div><p class="subtle">Back: vertical pull, horizontal row, shoulder extension. Biceps and elbow flexors: supinated, incline, neutral-grip and supported curls. Review recovery and progress before adding more sets.</p></div>';
}
const trainBeforeCoverage=trainView;
trainView=function(){trainBeforeCoverage();const first=$("#app .section-title");if(first)first.insertAdjacentHTML("beforebegin",coverageSummary())};
newDraft();render();

/* Strength Lab 3.2 — photographic exercise guide library */
const PHOTO_DB_URL="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const PHOTO_ROOT="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const PHOTO_ALIASES={
"Flat dumbbell bench press":"Dumbbell Bench Press",
"Dumbbell bench press":"Dumbbell Bench Press",
"Incline dumbbell press":"Incline Dumbbell Press",
"Dumbbell incline press":"Incline Dumbbell Press",
"Lat pulldown":"Wide-Grip Lat Pulldown",
"Seated cable row":"Seated Cable Rows",
"Chest-supported row":"Dumbbell Incline Row",
"Chest-supported dumbbell row":"Dumbbell Incline Row",
"One-arm dumbbell row":"One-Arm Dumbbell Row",
"Dumbbell lateral raise":"Side Lateral Raise",
"Triceps pressdown":"Triceps Pushdown",
"Overhead triceps extension":"Standing Dumbbell Triceps Extension",
"Dumbbell biceps curl":"Dumbbell Bicep Curl",
"Incline dumbbell curl":"Incline Dumbbell Curl",
"Hammer curl":"Hammer Curls",
"Preacher curl":"Preacher Curl",
"Hack squat":"Hack Squat",
"Romanian deadlift":"Romanian Deadlift",
"Dumbbell Romanian deadlift":"Dumbbell Romanian Deadlift",
"Seated leg curl":"Seated Leg Curl",
"Lying leg curl":"Lying Leg Curls",
"Leg extension":"Leg Extensions",
"Standing calf raise":"Standing Calf Raises",
"Seated calf raise":"Seated Calf Raise",
"Cable crunch":"Cable Crunch",
"Machine shoulder press":"Machine Shoulder (Military) Press",
"Dumbbell shoulder press":"Dumbbell Shoulder Press",
"Cable fly":"Cable Crossover",
"Reverse pec deck":"Reverse Machine Flyes",
"Leg press":"Leg Press",


"Goblet squat":"Goblet Squat",

"Plank":"Plank",
"Straight-arm cable pulldown":"Straight-Arm Pulldown",
"Hip abduction machine":"Thigh Abductor",
"Hip adduction machine":"Thigh Adductor"
};
const PHOTO_EQUIPMENT={
"Flat dumbbell bench press":"dumbbell","Dumbbell bench press":"dumbbell","Incline dumbbell press":"dumbbell","Dumbbell incline press":"dumbbell",
"Seated cable row":"cable","One-arm dumbbell row":"dumbbell","Chest-supported dumbbell row":"dumbbell",
"Romanian deadlift":"barbell","Dumbbell Romanian deadlift":"dumbbell","Lat pulldown":"cable",
"Hammer curl":"dumbbell","Incline dumbbell curl":"dumbbell","Dumbbell biceps curl":"dumbbell",
"Triceps pressdown":"cable","Cable fly":"cable","Straight-arm cable pulldown":"cable"
};
let PHOTO_RECORDS=null,PHOTO_STATUS="loading";
function photoFor(name){
 if(!PHOTO_RECORDS)return null;
 const wanted=PHOTO_ALIASES[name]||name;
 const normalize=x=>String(x||"").toLowerCase().replace(/[^a-z0-9]/g,"");
 const record=PHOTO_RECORDS.find(x=>normalize(x.name)===normalize(wanted));
 if(!record||!Array.isArray(record.images)||record.images.length===0)return null;
 const eq=PHOTO_EQUIPMENT[name];
 if(eq&&normalize(record.equipment)!==normalize(eq))return null;
 return record;
}
function visual(name){
 const record=photoFor(name);
 if(!record){
  return '<div class="photo-unavailable"><span class="photo-mark">◎</span><strong>'+(PHOTO_STATUS==="loading"?"Loading exercise photographs…":"Exact exercise photograph unavailable")+'</strong><p>'+(PHOTO_STATUS==="error"?"Check your internet connection to load exercise photography.":"We only show photographs for a matched exercise and equipment variation.")+'</p></div>';
 }
 const frames=record.images.slice(0,2);
 return '<div class="photo-grid">'+frames.map((path,i)=>'<figure class="photo-frame"><img loading="lazy" decoding="async" src="'+PHOTO_ROOT+encodeURI(path)+'" alt="'+escapeHTML(name)+' — '+(i===0?"starting":"finishing")+' position" onerror="this.closest(\'figure\').classList.add(\'failed-photo\')"><figcaption>'+(i===0?"01 · START":"02 · FINISH")+'</figcaption></figure>').join("")+'</div><p class="photo-credit">Exercise photographs: <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener noreferrer">Free Exercise DB / Everkinetic</a>. Display cropped to fit; no other alterations. Source exercise: '+escapeHTML(record.name)+'.</p>';
}
async function loadPhotoDB(){
 try{
  const response=await fetch(PHOTO_DB_URL,{cache:"force-cache"});
  if(!response.ok)throw new Error("Photo library unavailable");
  const data=await response.json();
  if(!Array.isArray(data))throw new Error("Invalid photo library");
  PHOTO_RECORDS=data;PHOTO_STATUS="ready";
 }catch(error){PHOTO_STATUS="error"}
 if(page==="guide"&&document.querySelector("#exerciseDetail"))showDetail();
}
loadPhotoDB();
const oldGuidePhotos=guideView;
guideView=function(){oldGuidePhotos();if(PHOTO_RECORDS||PHOTO_STATUS==="error")showDetail()};
const oldBackupPhotos=backupView;
backupView=function(){oldBackupPhotos();$("#app").insertAdjacentHTML("beforeend",'<div class="card"><h3>Exercise photography credits</h3><p class="subtle">Photographs supplied by Free Exercise DB / Everkinetic from the open Free Exercise DB dataset, where matched to the exercise. Images are displayed as supplied, cropped for layout. <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener">Source</a>.</p></div>')};
render();

/* Strength Lab 3.3 — remove schematic anatomy artwork everywhere */
function realisticMusclePanel(name){
 const record=photoFor(name),[primary,secondary]=muscleData(name);
 const image=record&&record.images&&record.images.length?'<img class="muscle-photo" loading="lazy" src="'+PHOTO_ROOT+encodeURI(record.images[0])+'" alt="Real photographic reference of '+escapeHTML(name)+'" onerror="this.style.display=\'none\'">':'<div class="muscle-photo-missing">Photo reference not available for this exact exercise.</div>';
 return '<div class="muscle-photo-layout"><div class="muscle-photo-container">'+image+'</div><div class="muscle-legend"><div class="legend"><span class="dot red"></span><div><strong>Primary muscles</strong><p>'+escapeHTML(primary.join(" · "))+'</p></div></div><div class="legend"><span class="dot blue"></span><div><strong>Secondary muscles</strong><p>'+escapeHTML(secondary.join(" · ")||"None specifically listed")+'</p></div></div></div></div><p class="subtle">Photographic movement reference with anatomically named muscle targets. No simulated anatomy highlights.</p>';
}
function showDetail(){
 const name=selectedExercise,detail=EXERCISE_DETAILS[name]||{},[primary,secondary]=muscleData(name),steps=detail.steps||["Set your starting position and brace your trunk.","Move through a comfortable range of motion with control.","Finish the repetition without swinging or using momentum."],errors=detail.mistakes||["Using momentum or excessive load","Losing a stable starting position"];
 const rx=PROGRAMS.flatMap(p=>p.items).find(x=>x[0]===name),used=PROGRAMS.filter(p=>p.items.some(x=>x[0]===name)).map(p=>p.short);
 $("#exerciseDetail").innerHTML='<div class="detail"><div class="detail-head"><span class="eyebrow">EXERCISE GUIDE / '+escapeHTML(used.join(" · "))+'</span><h2>'+escapeHTML(name)+'</h2><p class="subtle">'+escapeHTML(detail.desc||"Controlled resistance training movement.")+'</p>'+muscleTags(name)+'</div>'+
 '<div class="card media-card"><div class="eyebrow">REAL EXERCISE PHOTOGRAPHY</div>'+visual(name)+'</div>'+
 '<div class="card"><h3>Muscles activated</h3>'+realisticMusclePanel(name)+'</div>'+
 '<div class="card"><h3>Technique cues</h3>'+steps.map((v,i)=>'<div class="instruction"><span>'+(i+1)+'</span><p>'+escapeHTML(v)+'</p></div>').join("")+'</div>'+
 '<div class="card warning"><h3>Common mistakes</h3>'+errors.map(v=>'<div class="error"><span>×</span>'+escapeHTML(v)+'</div>').join("")+'</div>'+
 '<div class="card"><h3>Your prescription</h3><p class="subtle">'+(rx?rx[1]+' working sets · '+escapeHTML(rx[2])+' reps':'Included in your plan')+'</p><p class="subtle">Keep 1–3 reps in reserve on most sets and prioritize stable technique.</p></div></div>';
}
render();

/* Strength Lab 3.4 — detailed anatomical muscle atlas with primary/secondary highlighting */
const ANATOMY_MUSCLE_MAP=[
[/chest|pectoral|pecs/i,"chest"],[/latissimus|\blats\b/i,"lats"],[/rhomboid|mid.back|upper.back/i,"upper_back"],[/trapezius|\btraps\b/i,"traps"],[/rear deltoid|posterior deltoid/i,"deltoids"],[/front deltoid|side deltoid|deltoid|shoulder/i,"deltoids"],[/biceps|brachialis/i,"biceps"],[/brachioradialis|forearm/i,"forearms"],[/triceps/i,"triceps"],[/quadriceps|\bquads\b/i,"quadriceps"],[/hamstring/i,"hamstrings"],[/glute/i,"gluteal"],[/calf|gastrocnemius|soleus/i,"calves"],[/adductor|gracilis/i,"adductors"],[/abductor/i,"abductors"],[/abdominal|oblique|\babs\b|core/i,"abs"],[/erector|lower back/i,"lower_back"]
];
function anatomySlug(label){for(const [pattern,slug] of ANATOMY_MUSCLE_MAP){if(pattern.test(label))return slug}return null}
function anatomicalImage(name){
 const [primary,secondary]=muscleData(name);
 const p=[...new Set(primary.map(anatomySlug).filter(Boolean))];
 const q=[...new Set(secondary.map(anatomySlug).filter(Boolean))].filter(x=>!p.includes(x));
 const layers=[...p.map(x=>"F45B59:"+x),...q.map(x=>"428FFF:"+x)].join("|");
 const url="https://api.anatome.dev/generateImage?gender=male&view=dual&layers="+encodeURIComponent(layers)+"&output=raw";
 return '<div class="anatomical-image-wrap"><img loading="lazy" class="anatomical-image" src="'+url+'" alt="Detailed anterior and posterior anatomical illustration highlighting primary and secondary muscles for '+escapeHTML(name)+'" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div hidden class="anatomy-fallback">Anatomical image temporarily unavailable. Muscle labels remain below.</div></div><div class="anatomy-key"><span><i class="dot red"></i> Primary</span><span><i class="dot blue"></i> Secondary</span></div>';
}
function realisticMusclePanel(name){
 const [primary,secondary]=muscleData(name);
 return anatomicalImage(name)+'<div class="anatomy-list"><div class="legend"><span class="dot red"></span><div><strong>Primary muscles</strong><p>'+escapeHTML(primary.join(" · "))+'</p></div></div><div class="legend"><span class="dot blue"></span><div><strong>Secondary muscles</strong><p>'+escapeHTML(secondary.join(" · ")||"None specifically listed")+'</p></div></div></div><p class="anatomy-source">Anatomical diagrams by <a href="https://wiki.anatome.dev/about" target="_blank" rel="noopener">Anatome</a> (open-source). Colored regions are approximate muscle-group activation, not a measure of intensity.</p>';
}
render();


/* Strength Lab 3.6 — progressive overload coaching */
if(!state.progression||typeof state.progression!=="object")state.progression={};
function repBounds(range){
 const match=String(range).match(/(\d+)\s*[–-]\s*(\d+)/);
 return match?{low:Number(match[1]),high:Number(match[2])}:null;
}
function liftStep(name,weight){
 const small=/curl|lateral raise|fly|reverse pec|extension|pressdown|triceps|calf/i.test(name);
 const machine=/machine|pulldown|leg press|hack squat|cable|pec deck|leg extension|leg curl/i.test(name);
 const base=small?2.5:machine?5:5;
 return weight>=150?Math.max(base,10):base;
}
function progressionFor(exercise,priorSessions){
 const {name,range,sets}=exercise,bounds=repBounds(range);
 const completed=sets.filter(x=>x.done&&Number(x.reps)>0&&Number(x.weight)>=0);
 if(!completed.length)return null;
 const weighted=completed.filter(x=>Number(x.weight)>0);
 const weight=weighted.length?Math.max(...weighted.map(x=>Number(x.weight))):0;
 const comparable=completed.filter(x=>Math.abs(Number(x.weight)-weight)<0.01);
 const avgReps=comparable.reduce((a,x)=>a+Number(x.reps),0)/comparable.length;
 const minReps=Math.min(...comparable.map(x=>Number(x.reps)));
 const maxRir=Math.max(...comparable.map(x=>Number.isFinite(Number(x.rir))?Number(x.rir):2));
 const minRir=Math.min(...comparable.map(x=>Number.isFinite(Number(x.rir))?Number(x.rir):2));
 const previous=priorSessions.slice().reverse().flatMap(sess=>sess.exercises||[]).find(x=>x.name===name&&x.sets?.some(y=>y.done));
 const prevCompleted=previous?.sets?.filter(x=>x.done&&Number(x.reps)>0)||[];
 const prevAvg=prevCompleted.length?prevCompleted.reduce((a,x)=>a+Number(x.reps),0)/prevCompleted.length:null;
 const low=bounds?.low??8,high=bounds?.high??12;
 let targetWeight=weight,targetReps=Math.min(high,Math.max(low,Math.round(avgReps)+1)),reason="",kind="reps";
 if(weight===0){
  kind="bodyweight";targetWeight=0;targetReps=Math.min(high,Math.max(low,Math.round(avgReps)+1));
  reason="Keep bodyweight resistance and add one controlled rep when ready.";
 }else if(minReps<low-1||minRir===0&&avgReps<low){
  kind="reduce";targetWeight=Math.max(0,weight-liftStep(name,weight));targetReps=low;
  reason="At least one working set fell below the target range. A small reduction may restore quality reps.";
 }else if(comparable.length>=2&&comparable.every(x=>Number(x.reps)>=high&&Number(x.rir)>=1&&Number(x.rir)<=3)){
  kind="increase";targetWeight=weight+liftStep(name,weight);targetReps=low;
  reason="All comparable completed sets reached the top of the range with 1–3 reps in reserve.";
 }else if(minRir===0){
  kind="hold";targetReps=Math.max(low,Math.round(avgReps));
  reason="You reached your limit on a set. Keep the load and prioritize control and recovery.";
 }else if(avgReps>=high){
  kind="hold";targetReps=high;
  reason="Rep targets were high, but effort or completed-set evidence was insufficient for a load increase.";
 }else{
  kind="reps";
  reason="Build toward the top of your rep range before adding weight.";
 }
 if(prevAvg!==null&&avgReps<prevAvg-2&&kind==="reps"){kind="hold";targetReps=Math.max(low,Math.round(avgReps));reason="Repetitions dropped versus your previous session. Hold the load while you recover."}
 return {name,kind,weight,targetWeight,targetReps,range,completed:completed.length,reason,avgReps:Math.round(avgReps*10)/10};
}
let reviewSession=null,reviewItems=[];
function progressionReview(session){
 reviewSession=session;
 const previous=state.sessions.filter(x=>x.id!==session.id);
 reviewItems=session.exercises.map(x=>progressionFor(x,previous)).filter(Boolean);
 page="review";render();window.scrollTo(0,0);
}
function reviewView(){
 const items=reviewItems;
 $("#app").innerHTML=header("WORKOUT SAVED / NEXT SESSION","Your progression plan.","Recommendations are based on the sets you just completed. Review each suggestion before applying it.")+
 '<div class="card"><div class="eyebrow">SESSION COMPLETE</div><h3>'+escapeHTML(reviewSession?.program||"Workout")+'</h3><p class="subtle">'+items.length+' exercises reviewed · '+escapeHTML(reviewSession?.date||today())+'</p><p class="subtle">Increase reps before weight. Your form, pain, and recovery take priority over the algorithm.</p></div>'+
 (items.length?items.map((x,i)=>'<div class="card coaching-card"><div class="coach-top"><h3>'+escapeHTML(x.name)+'</h3><span class="coach-tag '+x.kind+'">'+({increase:"Increase load",reduce:"Reduce load",reps:"Add reps",hold:"Hold steady",bodyweight:"Build reps"}[x.kind])+'</span></div><p class="subtle">'+escapeHTML(x.reason)+'</p><div class="coach-comparison"><div><small>THIS SESSION</small><strong>'+x.weight+' lb</strong><span>'+x.avgReps+' avg reps</span></div><div class="coach-arrow">→</div><div><small>NEXT SESSION</small><strong>'+x.targetWeight+' lb</strong><span>'+x.targetReps+' target reps</span></div></div><div class="coach-inputs"><label>Suggested lb<input type="number" min="0" step="2.5" data-rec="'+i+'" data-rec-field="targetWeight" value="'+x.targetWeight+'"></label><label>Target reps<input type="number" min="1" max="100" data-rec="'+i+'" data-rec-field="targetReps" value="'+x.targetReps+'"></label></div><label class="coach-accept"><input type="checkbox" data-rec-accept="'+i+'" checked> Apply next time</label></div>').join(""):'<div class="card"><p>No completed sets with reps were available for progression recommendations.</p></div>')+
 '<div class="card"><button class="primary full" id="save-coaching">Save next-session targets</button><button class="coach-skip" id="skip-coaching">Keep current targets</button><p class="subtle">Suggestions are optional. Changes affect future starting targets, not your workout history.</p></div>';
 document.querySelectorAll("[data-rec-field]").forEach(input=>input.onchange=e=>{const x=reviewItems[Number(e.target.dataset.rec)],field=e.target.dataset.recField;x[field]=Math.max(0,Number(e.target.value)||0)});
 $("#save-coaching").onclick=()=>{document.querySelectorAll("[data-rec-accept]").forEach(box=>{if(!box.checked)return;const x=reviewItems[Number(box.dataset.recAccept)];state.progression[x.name]={weight:x.targetWeight,reps:x.targetReps,updated:today()}});save();newDraft();page="train";render();window.scrollTo(0,0)};
 $("#skip-coaching").onclick=()=>{page="train";render();window.scrollTo(0,0)};
}
const previousRender36=render;
render=function(){if(page==="review"){nav();reviewView()}else previousRender36()};
const previousTrain36=trainView;
trainView=function(){
 previousTrain36();
 const button=$("#finish");
 if(button)button.onclick=()=>{
  const done=draft.flatMap(x=>x.sets).filter(x=>x.done);
  if(!done.length&&!confirm("Save without completed sets?"))return;
  const session={id:Date.now(),date:today(),program:PROGRAMS[day].name,cardio,exercises:structuredClone(draft)};
  state.sessions.push(session);save();newDraft();progressionReview(session);
 };
};
const previousNewDraft36=newDraft;
newDraft=function(){
 previousNewDraft36();
 for(const exercise of draft){
  const rec=state.progression[exercise.name];
  if(!rec)continue;
  for(const set of exercise.sets){set.weight=rec.weight;set.reps=rec.reps}
 }
};
render();
