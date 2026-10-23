import {METRICS,normalize,seal,verify,example} from './core.js';
const $=id=>document.getElementById(id);
let readings=[],bundle=null,busy=false,revision=0;
function invalidate(){revision++;bundle=null;$('sealed').hidden=true;$('seal').disabled=!readings.length||busy;}
function render(){
  $('rows').replaceChildren();
  for(const r of readings){const row=document.createElement('tr');
    for(const value of [r.id+'\n'+r.timestamp,r.site,r.value+' '+r.unit+'\n'+r.metric,r.source]){const td=document.createElement('td');td.textContent=value;row.append(td);} $('rows').append(row);}
  $('count').textContent=readings.length+' readings';
}
function message(text,error=false){$('log-status').textContent=text;$('log-status').style.color=error?'#a33e29':'';}
$('sample').onclick=()=>{readings=example();invalidate();render();message('Three invented readings loaded. Seal to create a new evidence bundle.');};
$('reading-form').onsubmit=e=>{e.preventDefault();try{const f=new FormData(e.target);const metric=f.get('metric');
  if(readings.length>=1000)throw Error('Maximum 1,000 readings.');
  const date=new Date(f.get('timestamp')+'Z'); if(!Number.isFinite(date.getTime()))throw Error('Enter a real UTC timestamp.');
  const r=normalize({id:f.get('id'),timestamp:date.toISOString(),site:f.get('site'),metric,value:Number(f.get('value')),unit:METRICS[metric],source:f.get('source')});
  if(readings.some(x=>x.id===r.id))throw Error('That reading ID already exists.');
  readings.push(r);invalidate();render();message('Reading added. Any previous seal is invalidated.');
 }catch(err){message(err.message,true);}};
$('seal').onclick=async()=>{const rev=revision;busy=true;$('seal').disabled=true;
 try{const sealed=await seal(readings);if(rev!==revision){message('Log changed while sealing. Seal the new log again.');return;}
  bundle=sealed;$('root').textContent=bundle.root;$('sealed').hidden=false;$('evidence').value=JSON.stringify(bundle,null,2);$('anchor').value=bundle.root;$('tamper').disabled=false;
  $('result').className='result';$('result').textContent='New evidence is ready to verify. Root prefilled from this log; save it separately for later checks.';message('Log sealed. Download the evidence and save the root separately.');
 }catch(err){message(err.message,true);}finally{busy=false;$('seal').disabled=!readings.length;}};
$('download').onclick=()=>{if(!bundle)return;const u=URL.createObjectURL(new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='climatetrace-evidence.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
$('verify').onclick=async()=>{const text=$('evidence').value,anchor=$('anchor').value.trim();$('verify').disabled=true;
 try{if(text.length>3000000)throw Error('Evidence is too large (3 MB maximum).');const result=await verify(JSON.parse(text),anchor);
  if(text!==$('evidence').value||anchor!==$('anchor').value.trim())return;
  $('result').className='result ok';$('result').textContent=`${result.count} readings: chain intact. ${result.anchored?'Matches the supplied independent root.':'No independent root supplied: a rebuilt chain could pass.'} This does not establish observation accuracy.`;
 }catch(err){$('result').className='result error';$('result').textContent=err.message;}finally{$('verify').disabled=false;}};
$('tamper').onclick=()=>{try{const changed=JSON.parse($('evidence').value);changed.records[0].data.value+=1;$('evidence').value=JSON.stringify(changed,null,2);$('result').className='result';$('result').textContent='First reading changed without updating hashes. Verify to detect the mismatch.';}catch{ $('result').textContent='Seal a log first, or paste a valid bundle.';}};
for(const id of ['evidence','anchor'])$(id).addEventListener('input',()=>{$('result').className='result';$('result').textContent='Evidence or root changed. Verify again.';});
