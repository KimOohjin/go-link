const $ = (id) => document.getElementById(id);
const load = async () => (await chrome.storage.sync.get('links')).links || {};

async function render() {
  const links = await load();
  $('list').replaceChildren(...Object.entries(links).sort().map(([k, v]) => {
    const li = document.createElement('li'), a = document.createElement('a'), b = document.createElement('button');
    a.textContent = `go/${k} → ${v}`; a.href = v; a.target = '_blank';
    b.textContent = '삭제';
    b.onclick = async () => { delete links[k]; await chrome.storage.sync.set({ links }); render(); };
    li.append(a, b); return li;
  }));
}

$('f').onsubmit = async (e) => {
  e.preventDefault();
  const links = await load();
  links[$('name').value.trim().toLowerCase().replace(/^go\//, '')] = $('url').value.trim();
  await chrome.storage.sync.set({ links });
  e.target.reset(); render();
};

$('exp').onclick = async () => { $('box').style.display = 'block'; $('box').value = JSON.stringify(await load(), null, 2); };
$('imp').onclick = async () => {
  if ($('box').style.display !== 'block') { $('box').style.display = 'block'; $('box').value = ''; return; }
  try {
    const add = JSON.parse($('box').value), links = await load();
    for (const [k, v] of Object.entries(add)) links[k.toLowerCase()] = v;
    await chrome.storage.sync.set({ links }); render();
  } catch { alert('올바른 JSON이 아닙니다.'); }
};
render();
