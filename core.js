export const METRICS = {solar_generation:'kWh', electricity_consumption:'kWh', rainfall:'mm'};
export const GENESIS = '0'.repeat(64);
const hex = /^[a-f0-9]{64}$/;
export function normalize(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Reading must be an object.');
  const text = (key, max) => {
    if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > max) throw Error(`Invalid ${key}.`);
    return input[key].trim();
  };
  const id=text('id',80), timestamp=text('timestamp',32), site=text('site',80), metric=text('metric',40), source=text('source',256);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(timestamp) || !Number.isFinite(Date.parse(timestamp)) || new Date(timestamp).toISOString()!==timestamp) throw Error('Timestamp must be a real UTC ISO date with milliseconds.');
  if (!Object.hasOwn(METRICS,metric) || input.unit!==METRICS[metric]) throw Error('Metric and unit do not match.');
  if (typeof input.value!=='number' || !Number.isFinite(input.value) || input.value<0 || input.value>1e9) throw Error('Value must be a finite number from 0 to 1 billion.');
  return {id,timestamp,site,metric,value:input.value,unit:METRICS[metric],source};
}
export async function digest(text) {
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
const payload=(seq,data,previous)=>JSON.stringify({seq,data,previous});
export async function seal(readings) {
  if (!Array.isArray(readings) || !readings.length || readings.length>1000) throw Error('Seal between 1 and 1,000 readings.');
  const records=[], ids=new Set(); let previous=GENESIS;
  for (let i=0;i<readings.length;i++) {
    const data=normalize(readings[i]);
    if(ids.has(data.id)) throw Error(`Duplicate reading ID: ${data.id}`);
    ids.add(data.id);
    const hash=await digest(payload(i+1,data,previous));
    records.push({seq:i+1,data,previous,hash}); previous=hash;
  }
  return {format:'climatetrace-v1',algorithm:'SHA-256',records,root:previous};
}
export async function verify(bundle, expectedRoot='') {
  if (!bundle || bundle.format!=='climatetrace-v1' || bundle.algorithm!=='SHA-256') throw Error('Unsupported evidence format.');
  if (!Array.isArray(bundle.records) || !bundle.records.length || bundle.records.length>1000) throw Error('Evidence must contain 1–1,000 readings.');
  if (!hex.test(bundle.root)) throw Error('Invalid bundle root.');
  if (expectedRoot && !hex.test(expectedRoot)) throw Error('Independent root must be 64 lowercase hexadecimal characters.');
  let previous=GENESIS; const ids=new Set();
  for (let i=0;i<bundle.records.length;i++) {
    const r=bundle.records[i]; if(!r || r.seq!==i+1) throw Error(`Sequence mismatch at reading ${i+1}.`);
    const data=normalize(r.data);
    if (JSON.stringify(data)!==JSON.stringify(r.data)) throw Error(`Noncanonical reading ${i+1}.`);
    if(ids.has(data.id)) throw Error(`Duplicate reading ID: ${data.id}`); ids.add(data.id);
    if(r.previous!==previous || r.hash!==await digest(payload(r.seq,data,previous))) throw Error(`Integrity mismatch at reading ${i+1}.`);
    previous=r.hash;
  }
  if(bundle.root!==previous) throw Error('Bundle root does not match its final record.');
  if(expectedRoot && expectedRoot!==previous) throw Error('Independent root mismatch: this is a different or rewritten bundle.');
  return {count:bundle.records.length,root:previous,anchored:!!expectedRoot};
}
export const example = () => [
  {id:'SOL-001',timestamp:'2026-10-23T06:00:00.000Z',site:'Demo campus roof',metric:'solar_generation',value:12.4,unit:'kWh',source:'Invented example; no sensor measurement'},
  {id:'SOL-002',timestamp:'2026-10-23T07:00:00.000Z',site:'Demo campus roof',metric:'solar_generation',value:15.1,unit:'kWh',source:'Invented example; no sensor measurement'},
  {id:'RAIN-001',timestamp:'2026-10-23T07:00:00.000Z',site:'Demo rain gauge',metric:'rainfall',value:3.2,unit:'mm',source:'Invented example; no sensor measurement'}
];
