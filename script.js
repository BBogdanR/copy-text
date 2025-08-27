// ── utils ──────────────────────────────────────────────────────────────
function fromBase64Url(b64url){
  const b64 = (b64url || "").replace(/-/g, '+').replace(/_/g, '/') + '==='.slice(((b64url || "").length + 3) % 4);
  try {
    return decodeURIComponent(escape(atob(b64))); // ok для ASCII/UTF-8
  } catch {
    // fallback для unicode
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
}

function getTextFromHash(){
  const h = location.hash.startsWith('#') ? location.hash.slice(1) : '';
  return h ? fromBase64Url(h) : '';
}

function getTitleFromQuery(){
  const p = new URLSearchParams(location.search);
  const raw = p.get('title') || 'Сообщение';
  try { return decodeURIComponent(raw); } catch { return raw; }
}

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

// ── main ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const title = getTitleFromQuery();       // не копируется
  const text  = getTextFromHash();         // копируется

  const titleEl = document.getElementById('title');
  const preview = document.getElementById('preview');
  const copyBtn = document.getElementById('copyBtn');
  const openInNew = document.getElementById('openInNew');

  titleEl.textContent = title;
  preview.textContent = text || '(пусто)';

  openInNew.href = location.href;

  copyBtn.addEventListener('click', () => copyToClipboard(text));

  setStatus('Копируем в буфер обмена…');
  await copyToClipboard(text);
});
