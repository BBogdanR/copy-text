/*! LZ-String v1.4.4 - only decompressFromEncodedURIComponent + deps (MIT) */
var LZString=function(){var f=String.fromCharCode;var keyStrUriSafe="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";var baseReverseDic={};function getBaseValue(alphabet, character){if(!baseReverseDic[alphabet]){baseReverseDic[alphabet]={};for(var i=0;i<alphabet.length;i++)baseReverseDic[alphabet][alphabet.charAt(i)]=i}return baseReverseDic[alphabet][character]}function _decompress(length, resetValue, getNextValue){var dictionary=[],next,entry,result=[],i,w,bits,resb,maxpower,power,c,Data={val:getNextValue(0),position:resetValue,index:1};for(i=0;i<3;i+=1){dictionary[i]=i}bits=0;maxpower=Math.pow(2,2);power=1;while(power!=maxpower){resb=Data.val&Data.position;Data.position>>=1;if(Data.position==0){Data.position=resetValue;Data.val=getNextValue(Data.index++)}bits|=(resb>0?1:0)*power;power<<=1}switch(next=bits){case 0:bits=0;maxpower=Math.pow(2,8);power=1;while(power!=maxpower){resb=Data.val&Data.position;Data.position>>=1;if(Data.position==0){Data.position=resetValue;Data.val=getNextValue(Data.index++)}bits|=(resb>0?1:0)*power;power<<=1}c=f(bits);break;case 1:bits=0;maxpower=Math.pow(2,16);power=1;while(power!=maxpower){resb=Data.val&Data.position;Data.position>>=1;if(Data.position==0){Data.position=resetValue;Data.val=getNextValue(Data.index++)}bits|=(resb>0?1:0)*power;power<<=1}c=f(bits);break;case 2:return""}dictionary[3]=c;w=c;result.push(c);while(true){if(Data.index>length){return""}bits=0;maxpower=Math.pow(2,Math.ceil(Math.log(dictionary.length)/Math.log(2)));power=1;while(power!=maxpower){resb=Data.val&Data.position;Data.position>>=1;if(Data.position==0){Data.position=resetValue;Data.val=getNextValue(Data.index++)}bits|=(resb>0?1:0)*power;power<<=1}switch(c=bits){case 0:bits=0;maxpower=Math.pow(2,8);power=1;while(power!=maxpower){resb=Data.val&Data.position;Data.position>>=1;if(Data.position==0){Data.position=resetValue;Data.val=getNextValue(Data.index++)}bits|=(resb>0?1:0)*power;power<<=1}dictionary[dictionary.length]=f(bits);c=dictionary.length-1;break;case 1:bits=0;maxpower=Math.pow(2,16);power=1;while(power!=maxpower){resb=Data.val&Data.position;Data.position>>=1;if(Data.position==0){Data.position=resetValue;Data.val=getNextValue(Data.index++)}bits|=(resb>0?1:0)*power;power<<=1}dictionary[dictionary.length]=f(bits);c=dictionary.length-1;break;case 2:return result.join("")}if(dictionary[c]){entry=dictionary[c]}else{if(c===dictionary.length){entry=w+w.charAt(0)}else{return null}}result.push(entry);dictionary[dictionary.length]=w+entry.charAt(0);w=entry}}return{decompressFromEncodedURIComponent:function(input){if(input==null)return"";if(input==="")return null;input=input.replace(/ /g,"+");return _decompress(input.length,32,function(index){return getBaseValue(keyStrUriSafe,input.charAt(index))})}}}();

/* ---- Base64URL fallback (на случай старых ссылок) ---- */
function fromBase64Url(b64url){
  if(!b64url) return "";
  const b64 = b64url.replace(/-/g,'+').replace(/_/g,'/') + '==='.slice((b64url.length + 3) % 4);
  try { return decodeURIComponent(escape(atob(b64))); }
  catch {
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
}

/* ---- Парсинг из URL ---- */
function getTextFromHash(){
  const h = location.hash.startsWith('#') ? location.hash.slice(1) : '';
  if(!h) return '';
  if(h.startsWith('lz:')){
    const payload = h.slice(3);
    const out = LZString.decompressFromEncodedURIComponent(payload);
    return out || "";
  }
  return fromBase64Url(h);
}

function getTitleFromQuery(){
  const p = new URLSearchParams(location.search);
  const raw = p.get('title') || 'Сообщение';
  try { return decodeURIComponent(raw); } catch { return raw; }
}

/* ---- UI helpers ---- */
async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    setStatus('Скопировано ✔','ok');
  }catch(e){
    console.error(e);
    setStatus('Не удалось скопировать автоматически','warn');
  }
}
function setStatus(text, kind){
  const el = document.getElementById('status');
  el.textContent = text;
  el.className = 'status ' + (kind ? `status--${kind}` : 'status--neutral');
}

/* ---- main ---- */
document.addEventListener('DOMContentLoaded', async () => {
  const title = getTitleFromQuery();   // не копируется
  const text  = getTextFromHash();     // копируется

  document.getElementById('title').textContent = title;
  document.getElementById('preview').textContent = text || '(пусто)';
  document.getElementById('openInNew').href = location.href;

  document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(text));

  setStatus('Копируем в буфер обмена…');
  await copyToClipboard(text);
})  ;
