import { Md } from './md.jsx'
import { GUIDE } from './content/guide.js'
import { osNote, phoneNote, platformOf } from './platforms.js'
import { useDeviceMode } from './device.js'

// A full concept card: what it stands for, what it does, how it works, how to use it,
// real uses, when / when not, mistakes, tips, related. Used in lessons and the Field Guide.
export function DeepCard({ id, onRelated, platform }) {
  const c = GUIDE[id]
  const note = osNote(c, platform)
  const onPhone = useDeviceMode() === 'phone'
  const pnote = onPhone ? phoneNote(c, platform) : null
  return (
    <div className="deep">
      <div className="deep-head">
        <h2>{c.term}</h2>
        {c.stands && <div className="stands">stands for <b>{c.stands}</b></div>}
        <p className="deep-short">{c.short}</p>
      </div>
      <Section icon="🧭" title="What it does"><Md text={c.what} /></Section>
      <Section icon="⚙️" title="How it works"><Md text={c.how} /></Section>
      <Section icon="⌨️" title="How to use it">
        {c.usage.map((u, i) => (
          <div key={i} className="usage">
            <pre><code>{u.code}{u.out ? '\n' + u.out : ''}</code></pre>
            {u.note && <Md text={u.note} />}
          </div>))}
      </Section>
      <Section icon="🏔️" title="Real-world uses"><List items={c.uses} /></Section>
      <div className="when-grid">
        <Section icon="✅" title="Use it when" tone="ok"><List items={c.when} /></Section>
        <Section icon="⛔" title="Don't use it when" tone="no"><List items={c.whenNot} /></Section>
      </div>
      <Section icon="⚠️" title="Watch out">
        {c.mistakes.map((m, i) => (
          <div key={i} className="mistake">
            {m.prose
              ? <><small className="part-label">❌ The mistake</small><div className="prose"><Md text={m.prose} /></div></>
              : <><small className="part-label">❌ If you type</small><pre className="bad"><code>{m.wrong}</code></pre>
                <small className="part-label">You get</small><pre className="err"><code>{m.result}</code></pre></>}
            <Md text={'⛑️ ' + m.why} />
          </div>))}
      </Section>
      {note && <Section icon={platform === 'phone' ? '📱' : '💻'} title={platform === 'phone' ? 'On your phone' : `On your ${platformOf(platform).label}`} tone="os"><Md text={note} /></Section>}
      {pnote && pnote !== note && <Section icon="📱" title="On your phone" tone="os"><Md text={pnote} /></Section>}
      <Section icon="💡" title="Pro tips"><List items={c.tips} /></Section>
      {c.related?.length > 0 && <Section icon="🔗" title="Related">
        <div className="related">{c.related.filter(r => GUIDE[r]).map(r => (
          <button key={r} className="chip" onClick={() => onRelated?.(r)} disabled={!onRelated}>{GUIDE[r].term}</button>))}</div>
      </Section>}
    </div>
  )
}

function Section({ icon, title, children, tone = '' }) {
  return <div className={`deep-sec ${tone}`}><h4>{icon} {title}</h4>{children}</div>
}
function List({ items }) {
  return <ul>{items.map((t, i) => <li key={i}><Md text={t} /></li>)}</ul>
}
