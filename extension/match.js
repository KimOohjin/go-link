// go/<name> 입력을 검색 URL 또는 http://go/<name> 에서 추출한다.
const SEARCH_HOST = /(^|\.)(google\.[a-z.]+|bing\.com|naver\.com|duckduckgo\.com|yahoo\.com|daum\.net)$/;

function parseGoName(urlString) {
  let u;
  try { u = new URL(urlString); } catch { return null; }
  let text = null;
  if (u.hostname.toLowerCase() === 'go') text = 'go' + u.pathname;
  else if (SEARCH_HOST.test(u.hostname.toLowerCase()))
    text = u.searchParams.get('q') || u.searchParams.get('query') || u.searchParams.get('p');
  const m = text && /^\s*go\/(.+?)\/?\s*$/i.exec(decodeURIComponent(text));
  return m ? m[1].toLowerCase() : null;
}

if (typeof module !== 'undefined') module.exports = { parseGoName };
