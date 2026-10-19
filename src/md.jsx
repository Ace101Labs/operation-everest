// Tiny markdown: ```code blocks```, `inline code`, **bold**, *italic*, line breaks. Content is ours, not user input.
function inline(text, key) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g)
  return parts.map((t, i) => {
    if (t.startsWith('`') && t.endsWith('`') && t.length > 1) return <code key={key + i}>{t.slice(1, -1)}</code>
    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) return <strong key={key + i}>{t.slice(2, -2)}</strong>
    if (t.startsWith('*') && t.endsWith('*') && t.length > 2) return <em key={key + i}>{t.slice(1, -1)}</em>
    return t
  })
}

export function Md({ text }) {
  const blocks = text.split(/```(?:js|sh)?\n?/)
  return (
    <div className="md">
      {blocks.map((b, i) => i % 2
        ? <pre key={i}><code>{b.replace(/\n$/, '')}</code></pre>
        : b.split('\n').filter((l, j, a) => l.trim() || (j > 0 && j < a.length - 1)).map((l, j) =>
            l.trim() ? <p key={`${i}-${j}`}>{inline(l, `${i}-${j}-`)}</p> : <div key={`${i}-${j}`} className="gap" />))}
    </div>
  )
}
