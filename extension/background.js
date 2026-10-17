importScripts('match.js');

const DEFAULTS = {
  google: 'https://www.google.com',
  naver: 'https://www.naver.com',
  github: 'https://github.com',
  youtube: 'https://www.youtube.com',
};
const SEARCH_DOMAINS = ['google.com', 'google.co.kr', 'bing.com', 'naver.com', 'duckduckgo.com', 'yahoo.com', 'daum.net'];
const esc =(s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 주 경로: 네트워크 수준 리디렉트. 프리렌더/프리페치된 검색 페이지도 막는다.
async function syncRules() {
  const { links = {} } = await chrome.storage.sync.get('links');
  const old = await chrome.declarativeNetRequest.getDynamicRules();
  const add = [];
  Object.entries(links).forEach(([name, url], i) => {
    const n = esc(encodeURIComponent(name));
    const base = { priority: 1, action: { type: 'redirect', redirect: { url } } };
    // 정규식은 2KB(컴파일 후) 한도가 있어 호스트 조건은 requestDomains로 뺀다.
    add.push({ ...base, id: 2 * i + 1, condition: { resourceTypes: ['main_frame'], isUrlFilterCaseSensitive: false,
      requestDomains: SEARCH_DOMAINS, regexFilter: `[?&](q|query|p)=go(%2F|/)${n}(%2F|/)?(&|#|$)` } });
    add.push({ ...base, id: 2 * i + 2, condition: { resourceTypes: ['main_frame'], isUrlFilterCaseSensitive: false,
      regexFilter: `^https?://go/${n}/?([?#].*)?$` } });
  });
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: old.map((r) => r.id), addRules: add });
}

chrome.runtime.onInstalled.addListener(async () => {
  const { links } = await chrome.storage.sync.get('links');
  if (!links) await chrome.storage.sync.set({ links: DEFAULTS });
  syncRules();
});
chrome.runtime.onStartup.addListener(syncRules);
chrome.storage.onChanged.addListener((c, area) => { if (area === 'sync' && c.links) syncRules(); });

// 보조 경로: 위 규칙이 못 잡는 경우(다른 검색엔진 TLD, 공백 포함 입력 등)
async function go(d) {
  if (d.frameId !== 0) return;
  const name = parseGoName(d.url);
  if (!name) return;
  const { links = {} } = await chrome.storage.sync.get('links');
  if (links[name]) chrome.tabs.update(d.tabId, { url: links[name] });
}
chrome.webNavigation.onBeforeNavigate.addListener(go);
chrome.webNavigation.onCommitted.addListener(go);
