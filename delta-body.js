/* Delta Lab 10.1 — editable, dated body measurement history.
   Uses the existing state.measurements array and save() persistence. */
(()=>{
"use strict";
const esc=v=>escapeHTML(String(v??""));
const numeric=(v,min,max)=>{if(String(v).trim()==="")return null;const x=Number(v);if(!Number.isFinite(x)||x<min||x>max)throw Error("Enter a value between "+min+" and "+max+".");return x};
const dateLabel=d=>{if(!d)return "No readings";const t=new Date(d+"T12:00:00");return Number.isNaN(+t)?d:t.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})};
const fmt=(v,suffix)=>v===null||v===undefined||v===""?"—":Number(v).toLocaleString(undefined,{maximumFractionDigits:2})+" "+suffix;
let editing=null,formOpen=false;
function renderBody(){
 if(page!=="body")return;
 const app=document.querySelector("#app");if(!app)return;
 const rows=state.measurements.map((x,i)=>({...x,_index:i})).sort((a,b)=>String(b.date||"").localeCompare(String(a.date||""))||b._index-a._index);
 const latest=(field)=>rows.find(x=>x[field]!==null&&x[field]!==undefined&&x[field]!=="");
 const weight=latest("weight"),waist=latest("waist");
 const current=editing===null?null:state.measurements[editing];
 if(editing!==null&&!current)editing=null;
 const values=editing===null?null:state.measurements[editing];
 const history=(field)=>[...state.measurements].filter(x=>x[field]!==null&&x[field]!==undefined&&x[field]!==""&&Number.isFinite(Number(x[field]))&&x.date).sort((a,b)=>a.date.localeCompare(b.date)).map(x=>({date:x.date,value:Number(x[field])}));
 function plot(data){
  if(!data.length)return '<p class="dl101-empty">No readings yet.</p>';
  if(data.length===1)return '<p class="dl101-empty">One reading · add another to see a trend.</p>';
  const vals=data.map(x=>x.value),lo=Math.min(...vals),hi=Math.max(...vals),pad=Math.max((hi-lo)*.2,.5),bottom=lo-pad,top=hi+pad;
  const coords=data.map((x,i)=>[24+i*320/(data.length-1),140-(x.value-bottom)/(top-bottom)*114]);
  return '<svg viewBox="0 0 368 170" class="dl101-chart" role="img" aria-label="Measurements over time"><path d="M24 20H344M24 80H344M24 140H344" fill="none" stroke="#363941" stroke-dasharray="4 5"/><polyline class="dl14-chart-line" pathLength="100" fill="none" stroke="#ff9a0c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="'+coords.map(p=>p.join(",")).join(" ")+'"/>'+coords.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="#ffb453"/>').join("")+'<text x="24" y="163" fill="#a7afbc" font-size="11">'+esc(dateLabel(data[0].date))+'</text><text x="344" y="163" fill="#a7afbc" font-size="11" text-anchor="end">'+esc(dateLabel(data.at(-1).date))+'</text></svg>';
 }
 app.innerHTML='<section class="dl101-body"><div class="dl101-kicker">DELTA LAB · BODY METRICS</div><h2>Body</h2><p>Track your physical development.</p><div class="dl101-stats"><div><small>LATEST WEIGHT</small><strong>'+fmt(weight?.weight,"lb")+'</strong><span>'+esc(dateLabel(weight?.date))+'</span></div><div><small>LATEST WAIST</small><strong>'+fmt(waist?.waist,"in")+'</strong><span>'+esc(dateLabel(waist?.date))+'</span></div></div><form id="dl101-form" class="dl101-panel"><div class="dl101-panel-head"><h3>'+(values?"Edit measurement":"Log measurements")+'</h3>'+(values?'<button type="button" id="dl101-cancel">Cancel edit</button>':'')+'</div><label for="dl101-date">Date</label><input id="dl101-date" type="date" required value="'+esc(values?.date||today())+'"><div class="dl101-grid"><div><label for="dl101-weight">Weight (lb)</label><input id="dl101-weight" inputmode="decimal" type="number" min="50" max="1000" step="0.1" placeholder="Optional" value="'+esc(values?.weight??"")+'"></div><div><label for="dl101-waist">Waist (in)</label><input id="dl101-waist" inputmode="decimal" type="number" min="10" max="100" step="0.1" placeholder="Optional" value="'+esc(values?.waist??"")+'"></div></div><details><summary>Additional measurements (optional)</summary>'+["chest","hips","arm","thigh"].map(k=>'<label for="dl14-'+k+'">'+k[0].toUpperCase()+k.slice(1)+' (in)</label><input id="dl14-'+k+'" type="number" min="1" max="150" step="0.1" inputmode="decimal" value="'+esc(values?.[k]??"")+'">').join("")+'</details><label for="dl101-sleep">Sleep (hours) · optional</label><input id="dl101-sleep" type="number" inputmode="decimal" min="0" max="24" step="0.25" placeholder="Optional" value="'+esc(values?.sleep??"")+'"><p id="dl101-error" class="dl101-error" role="alert" hidden></p><button type="submit" class="dl101-save">'+(values?"Save changes":"Save measurement")+'</button></form><div class="dl101-panel"><h3>Weight trend</h3>'+plot(history("weight"))+'</div><div class="dl101-panel"><h3>Waist trend</h3>'+plot(history("waist"))+'</div><div class="dl101-panel"><div class="dl101-panel-head"><h3>Measurement history</h3><span>'+rows.length+' entries</span></div>'+(rows.length?rows.map(x=>'<div class="dl101-record"><div class="dl101-record-main"><strong>'+esc(x.date?dateLabel(x.date):"Undated")+'</strong><small>'+fmt(x.weight,"lb")+' · Waist '+fmt(x.waist,"in")+' · Sleep '+fmt(x.sleep,"h")+'</small></div><button type="button" data-edit="'+x._index+'">Edit</button><button type="button" class="dl101-delete" data-delete="'+x._index+'">Delete</button></div>').join(""):'<p class="dl101-empty">No measurements recorded yet.</p>')+'</div></section>';
 if(window.deltaFitnessHTML){app.querySelector(".dl101-body").insertAdjacentHTML("beforeend",window.deltaFitnessHTML());window.deltaFitnessBind(app)}
 const form=app.querySelector("#dl101-form");const extras=document.createElement("details");extras.className="dl101-panel";extras.innerHTML="<summary>Additional measurement trends</summary>"+["chest","hips","arm","thigh"].map(k=>"<h3>"+k[0].toUpperCase()+k.slice(1)+"</h3>"+plot(history(k))).join("");app.querySelector(".dl101-body").append(extras); const root=app.querySelector('.dl101-body');const add=document.createElement('button');add.type='button';add.className='dl11-body-add';add.textContent='＋ Log';add.setAttribute('aria-label','Log measurement');const title=root.querySelector('h2');const head=document.createElement('div');head.className='dl11-body-head';title.before(head);head.append(title,add);root.querySelector('.dl101-stats').after(form);root.querySelectorAll('.dl101-panel').forEach(p=>{if(p.querySelector('.dl101-empty'))p.classList.add('dl11-empty-panel')});form.hidden=!formOpen&&editing===null;add.onclick=()=>{formOpen=true;form.hidden=false;form.scrollIntoView({block:'start',behavior:'smooth'})};
 form.onsubmit=e=>{e.preventDefault();const err=app.querySelector("#dl101-error");try{
  const date=app.querySelector("#dl101-date").value;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+"T12:00:00")))throw Error("Choose a valid date.");
  const weight=numeric(app.querySelector("#dl101-weight").value,50,1000),waist=numeric(app.querySelector("#dl101-waist").value,10,100),sleep=numeric(app.querySelector("#dl101-sleep").value,0,24);
  const extra=Object.fromEntries(["chest","hips","arm","thigh"].map(k=>[k,numeric(app.querySelector("#dl14-"+k).value,1,150)]));if(weight===null&&waist===null&&sleep===null&&Object.values(extra).every(v=>v===null))throw Error("Enter at least one measurement.");
  const record={date,weight,waist,sleep,...extra};
  const previous=state.measurements.slice();
  if(editing===null)state.measurements.push(record);else state.measurements[editing]={...state.measurements[editing],...record};
  try{save()}catch(ex){state.measurements=previous;throw Error("Could not save to this device. Your previous measurements were kept.");}
  editing=null;formOpen=false;renderBody();
 }catch(ex){err.hidden=false;err.textContent=ex.message}};
 app.querySelector("#dl101-cancel")?.addEventListener("click",()=>{editing=null;formOpen=false;renderBody()});
 app.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{editing=Number(b.dataset.edit);renderBody();app.querySelector("#dl101-form")?.scrollIntoView({behavior:"smooth",block:"start"})});
 app.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.delete),record=state.measurements[i];if(!record)return;if(!confirm("Delete the measurement dated "+record.date+"? This cannot be undone without a backup."))return;const previous=state.measurements.slice();state.measurements.splice(i,1);try{save();editing=null;renderBody()}catch(ex){state.measurements=previous;alert("Could not delete the entry. Your data was kept.")}});
}
bodyView=renderBody;
})();
