import { escapeHtml } from './html-escape'

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('&')).toBe('&amp;')
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('>')).toBe('&gt;')
    expect(escapeHtml('"')).toBe('&quot;')
    expect(escapeHtml("'")).toBe('&#039;')
  })

  it('should escape multiple occurrences', () => {
    expect(escapeHtml('<div>&</div>')).toBe('&lt;div&gt;&amp;&lt;/div&gt;')
  })

  it('should escape all special characters in a string', () => {
    const input = '<script>alert("XSS")</script>'
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    expect(escapeHtml(input)).toBe(expected)
  })

  it('should handle strings with no special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('should escape single quotes', () => {
    expect(escapeHtml("It's a test")).toBe('It&#039;s a test')
  })
})
