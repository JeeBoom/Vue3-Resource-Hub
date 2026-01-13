import { codeToHtml } from 'shiki'

// 缓存已高亮的代码
const highlightCache = new Map<string, string>()

export async function highlightCode(code: string, language: string = 'typescript'): Promise<string> {
  // 使用缓存避免重复高亮
  const cacheKey = `${language}:${code}`
  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const html = await codeToHtml(code, {
      lang: language,
      theme: 'github-light'  // 浅色主题，适配黑白设计
    })
    highlightCache.set(cacheKey, html)
    return html
  } catch (error) {
    console.error('Code highlighting error:', error)
    // 高亮失败则返回原始代码
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }
}

// 转义 HTML 特殊字符
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}
