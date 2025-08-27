// LZ-String decode (EncodedURIComponent) для #lz
const LZ = (() => {
  function decompressURIComponent(e){
    if(e==null) return "";
    let t="",n=0,r,o,s,i,u,a,c,f=0,l=0,h=0;
    e=decodeURIComponent(e);
    i=32768;u=1;a=0;c=[];for(r=0;r<3;r++)c[r]=r;
    let d=0;
    for(s=0;s<e.length;s++){
      h=e.charCodeAt(s);
      for(n=0;n<16;n+=8){
        o=(h>>n)&255;
        t+=String.fromCharCode(o);
      }
    }
    let p=0,g=4,v=1,m=0,y=0;
    function w(b){
      let k=0;
      for(let x=0;x<b;x++){
        if(v===1){v=0;m=t.charCodeAt(d++);}
        let z=m&g; g<<=1;
        if(g===65536){g=1;v=1}
        k|=(z?1:0)<<x
      }
      return k
    }
    let C=w(Math.ceil(Math.log(i)/Math.log(2)));
    switch(C){
      case 0:o=String.fromCharCode(w(8));break;
      case 1:o=String.fromCharCode(w(16));break;
      case 2:return ""
    }
    c[3]=o;
    let A=o;
    let E=[A];
    for(;;){
      if(d>t.length) return "";
      C=w(Math.ceil(Math.log(i)/Math.log(2)));
      if(C===0){
        o=String.fromCharCode(w(8));
        c[++i]=o; C=i-1
      }else if(C===1){
        o=String.fromCharCode(w(16));
        c[++i]=o; C=i-1
      }else if(C===2){ break }
      o=c[C]; if(o==null) return "";
      A=o; E.push(A);
      c[++i]=t=""; t=E[E.length-2]+A.charAt(0)
    }
    return E.join("")
  }
  return { decompressURIComponent };
})();

// Base64URL fallback (на случай старых ссылок)
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

function getTextFromHash(){
  const h = location.hash.startsWith('#') ? location.hash.slice(1) : '';
  if(!h) return '';
  if(h.startsWith('lz:')){
    try { return LZ.decompressURIComponent(h.slice(3)); } catch { return ''; }
  }
  return fromBase64Url(h);
}

function getTitleFromQuery(){
  const p = new URLSearchParams(location.search);
  const raw = p.get('title') || 'Сообщение';
  try { return decodeURIComponent(raw); } catch { return raw; }
}

// UI helpers
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

// main 
document.addEventListener('DOMContentLoaded', async () => {
  const title = getTitleFromQuery();     
  const text  = getTextFromHash();     

  document.getElementById('title').textContent = title;
  document.getElementById('preview').textContent = text || '(пусто)';
  document.getElementById('openInNew').href = location.href;

  document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(text));

  setStatus('Копируем в буфер обмена…');
  await copyToClipboard(text);
});
