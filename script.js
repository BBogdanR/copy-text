/* --- LZString (только decompressFromEncodedURIComponent) --- */
/*! LZ-String v1.4.4 (c) Pieroxy - MIT */
var LZString=(function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var t={};var r=String.fromCharCode;function n(o){return r(o+32)}function e(t){var e="",i=0,a,s,u,f,c,l,h,p,d,v,g;for(u=0,f=t.length;u<f;u+=2){c=o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t.charAt(u))<<6|o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t.charAt(u+1));e+=r(c)}var m=32768,y=4,w=1,b=0,x=0,k=0;function S(o){var t=0;for(var r=0;r<o;r++){k<<=1;if(x==0){x=15;b=e.charCodeAt(i++);}t|=(b&k?1:0)<<r; if(--x<0){x=15;b=e.charCodeAt(i++);} }return t}var L,A,C=0;var E=3,_=0,T=S(2);switch(T){case 0:A=r(S(8));break;case 1:A=r(S(16));break;case 2:return""}L=[A];C=3;var O=A;for(;;){if(i>e.length)return"";var U=S(Math.ceil(Math.log(m)/Math.log(2)));if(U===0){A=r(S(8));t[A]=C++;O=A;L.push(O);continue}else if(U===1){A=r(S(16));t[A]=C++;O=A;L.push(O);continue}else if(U===2){return L.join("")}A=t[A];O=A;L.push(O);t[O+L[0]]=C++;L[0]=O.charAt(0)}}
function i(t){if(t==null)return"";t=t.replace(/ /g,"+");try{return decodeURIComponent(t)}catch{return t}}return{decompressFromEncodedURIComponent:function(t){if(t==null)return"";if(t==="")return null;return e(i(t))}}})();

/* --- Base64URL fallback (если где-то остались старые ссылки) --- */
function fromBase64Url(b64url){
  if(!b64url) return "";
  const b64 = b64url.replace(/-/g,'+').replace(/_/g,'/') + '==='.slice((b64url.length + 3) % 4);
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
}

/* --- Парсинг из URL --- */
function getTextFromHash(){
  const h = location.hash.startsWith('#') ? location.hash.slice(1) : '';
  if(!h) return '';
  if(h.startsWith('lz:')){
    // правильная пара к compressToEncodedURIComponent
    const payload = h.slice(3);
    const out = LZString.decompressFromEncodedURIComponent(payload);
    return out || "";
  }
  // старый формат: base64url в hash
  return fromBase64Url(h);
}

function getTitleFromQuery(){
  const p = new URLSearchParams(location.search);
  const raw = p.get('title') || 'Сообщение';
  try { return decodeURIComponent(raw); } catch { return raw; }
}

/* --- UI helpers --- */
async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    setStatus('Скопировано ✔', 'ok');
    return true;
  }catch(e){
    console.error(e);
    setStatus('Не удалось скопировать автоматически', 'warn');
    return false;
  }
}
function setStatus(text, kind){
  const el = document.getElementById('status');
  el.textContent = text;
  el.className = 'status ' + (kind ? `status--${kind}` : 'status--neutral');
}

/* --- main --- */
document.addEventListener('DOMContentLoaded', async () => {
  const title = getTitleFromQuery();     // не копируется
  const text  = getTextFromHash();       // копируется

  document.getElementById('title').textContent = title;
  document.getElementById('preview').textContent = text || '(пусто)';
  document.getElementById('openInNew').href = location.href;

  document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(text));

  setStatus('Копируем в буфер обмена…');
  await copyToClipboard(text);
});
