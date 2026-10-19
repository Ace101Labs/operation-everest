import { useRef, useState } from 'react'

// The suggestion box: report a problem or share an idea. Anonymous on purpose: there is no
// name or email field, and the server blanks out any email or phone number in the text.
// Suggestions are read each night; fixes that check out go live (see api/suggest.js).
const KINDS = [['bug', '🐛 Something is broken'], ['content', '📖 A lesson or question is wrong or unclear'], ['idea', '💡 An idea'], ['other', '💬 Something else']]

export function SuggestBox() {
  const [kind, setKind] = useState('bug')
  const [text, setText] = useState('')
  const [hp, setHp] = useState('')
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [err, setErr] = useState('')
  const opened = useRef(Date.now())
  const where = (() => { try { return sessionStorage.getItem('everest.lastStage') || '' } catch { return '' } })()
  const send = async () => {
    setState('sending'); setErr('')
    try {
      const r = await fetch('/api/suggest', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, text, where: where ? `last pitch ${where}` : '', hp, ms: Date.now() - opened.current }) })
      if (r.ok) { setState('sent'); setText(''); return }
      const d = await r.json().catch(() => ({}))
      setErr(d.error || 'Could not send it. Please try again later.'); setState('error')
    } catch { setErr("You're offline. Your message is still here: send it when you're back online."); setState('error') }
  }
  if (state === 'sent') return <div className="suggest-thanks">
    <div className="big">🙏</div>
    <p><strong>Thank you for finding this!</strong> Every message is read. Fixes that check out go live in the next nightly update, often by tomorrow.</p>
    <button className="btn wide" onClick={() => { setState('idle'); opened.current = Date.now() }}>Send another</button>
  </div>
  return <div className="suggest">
    <p className="note">Found a bug, a wrong answer, a confusing lesson, or have an idea? Tell us. No name or email needed{where ? `, and the last pitch you opened (${where}) is sent along so we can find it` : ''}.</p>
    <div className="suggest-kinds">{KINDS.map(([k, label]) => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{label}</button>)}</div>
    <textarea rows={5} maxLength={1000} value={text} onChange={e => setText(e.target.value)} placeholder="What happened, and where? (Please don't include personal details.)" />
    {/* never shown to people: only bots fill this in */}
    <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={e => setHp(e.target.value)} name="website" />
    <small className="note">{text.trim().length}/1000</small>
    {err && <p className="note warn">{err}</p>}
    <button className="btn primary wide" disabled={text.trim().length < 10 || state === 'sending'} onClick={send}>{state === 'sending' ? 'Sending…' : '📮 Send'}</button>
  </div>
}
