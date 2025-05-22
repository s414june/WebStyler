/**
 * 將 HTML 中的相對路徑轉為絕對路徑
 * @param html - 原始 HTML 字串
 * @param baseUrl - 來源網站的 URL（如 https://udn.com/news/story/7315/8757512）
 * @returns 處理後的 HTML 字串
 */
export function rewriteRelativeUrlsToAbsolute(html: string, baseUrl: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const baseOrigin = new URL(baseUrl).origin

  const convert = (el: Element, attr: string) => {
    const raw = el.getAttribute(attr)
    if (raw && raw.startsWith('/')) {
      el.setAttribute(attr, baseOrigin + raw)
    }
  }

  // 處理 src、href、action、poster
  doc.querySelectorAll('[src], [href], [action], [poster]').forEach((el) => {
    ;['src', 'href', 'action', 'poster'].forEach((attr) => {
      if (el.hasAttribute(attr)) convert(el, attr)
    })
  })

  // 處理 srcset（每個網址獨立處理）
  doc.querySelectorAll('[srcset]').forEach((el) => {
    const raw = el.getAttribute('srcset')
    if (!raw) return

    const updated = raw
      .split(',')
      .map((entry) => {
        const [url, descriptor] = entry.trim().split(/\s+/)
        if (url.startsWith('/')) {
          return `${baseOrigin}${url} ${descriptor || ''}`.trim()
        }
        return entry.trim()
      })
      .join(', ')

    el.setAttribute('srcset', updated)
  })

  // 插入 <base href="..."> 讓瀏覽器自動補相對路徑（保險）
  const baseEl = doc.createElement('base')
  baseEl.setAttribute('href', baseOrigin + '/')
  doc.head.prepend(baseEl)

  return doc.documentElement.outerHTML
}
