import { useState } from 'react'
import { SherpaSays } from './Sherpa.jsx'
import { LIMITS, emptyPlan, checkPlan, planMarkdown } from './plancheck.js'

// Capstone 1: plan your own app. One scroll, six sections, each with a hint and a Summit Log
// example. The plan saves as you type (progress.plan); "Check my plan" passes at zero problems.
const grow = (list, min, make) => { const l = [...(list || [])]; while (l.length < min) l.push(make()); return l }

function seed(saved) {
  const base = emptyPlan(), p = { ...base, ...(saved || {}) }
  p.features = grow(p.features, LIMITS.features[0], () => '')
  p.risks = grow(p.risks, LIMITS.risks[0], () => ({ risk: '', so: '' }))
  p.scope = grow(p.scope, 1, () => '')
  return p
}

function Section({ title, hint, eg, children }) {
  return (
    <section>
      <h3>{title}</h3>
      <p className="hint">{hint}</p>
      {eg && <p className="eg">Summit Log: {eg}</p>}
      {children}
    </section>
  )
}

export function PlanStage({ p, savePlan, onPass, alreadyPassed }) {
  const [plan, setPlan] = useState(() => seed(p.plan))
  const [problems, setProblems] = useState(null)
  const [msg, setMsg] = useState('')
  const set = patch => { const n = { ...plan, ...patch }; setPlan(n); setProblems(null); savePlan(n) }
  const setAt = (key, i, v) => set({ [key]: plan[key].map((x, k) => (k === i ? v : x)) })
  const add = (key, make) => set({ [key]: [...plan[key], make()] })
  const drop = (key, i) => set({ [key]: plan[key].filter((_, k) => k !== i) })
  const check = () => { const found = checkPlan(plan); setProblems(found); if (!found.length) setMsg('') }
  const copyReadme = async () => {
    try { await navigator.clipboard.writeText(planMarkdown(plan)); setMsg('README copied. Paste it into a notes app or a file called README.md.') }
    catch { setMsg('Copy failed. Your plan is still saved here.') }
  }
  const inp = (value, onChange, ph, label) => <input className="typed" value={value} placeholder={ph} aria-label={label} onChange={e => onChange(e.target.value)} />

  return (
    <div className="plan">
      <SherpaSays ok>This time the app is yours. Pick something small that a real person would use, and write its plan before any code. Your plan saves as you type, and later steps will read it.</SherpaSays>
      {alreadyPassed && <p className="note">You already cleared this pitch. Edits here are still saved.</p>}

      <Section title="1. Name and pitch" hint="A short name, then one sentence saying what the app does." eg="“Summit Log: a phone app that remembers every peak you climbed and whether you reached the top.”">
        {inp(plan.name, v => set({ name: v }), 'App name', 'App name')}
        <textarea className="typed" rows={2} value={plan.pitch} placeholder="One-sentence pitch" aria-label="Pitch" onChange={e => set({ pitch: e.target.value })} />
      </Section>

      <Section title="2. Who it is for" hint="A real kind of person, and the problem they have today." eg="for climbers logging trips on a phone, who forget which peaks they climbed and whether they summited.">
        {inp(plan.who, v => set({ who: v }), 'Who is it for?', 'Who it is for')}
        <textarea className="typed" rows={2} value={plan.problem} placeholder="The problem it solves" aria-label="Problem" onChange={e => set({ problem: e.target.value })} />
      </Section>

      <Section title="3. Must-have features" hint={`${LIMITS.features[0]} to ${LIMITS.features[1]} lines. Each one starts "A <user> can" and says one thing they do. Only what the first version needs.`} eg="“A climber can log a climb with its peak, height and date.”  “A climber can see how many climbs they summited.”">
        {plan.features.map((f, i) => (
          <div key={i} className="row" style={{ margin: 0 }}>
            {inp(f, v => setAt('features', i, v), 'A climber can …', `Feature ${i + 1}`)}
            {plan.features.length > LIMITS.features[0] && <button className="btn subtle" style={{ flex: '0 0 44px' }} aria-label={`Remove feature ${i + 1}`} onClick={() => drop('features', i)}>✕</button>}
          </div>
        ))}
        {plan.features.length < LIMITS.features[1] && <button className="btn subtle wide" onClick={() => add('features', () => '')}>＋ Add a feature</button>}
      </Section>

      <Section title="4. What it saves" hint="One kind of record with at least 2 fields, separated by commas." eg="record: climb. fields: date, peak, height, summited, notes.">
        {inp(plan.recordName, v => set({ recordName: v }), 'Record name (like climb)', 'Record name')}
        {inp(plan.recordFields, v => set({ recordFields: v }), 'Fields: date, peak, notes', 'Record fields')}
      </Section>

      <Section title="5. What could go wrong" hint={`At least ${LIMITS.risks[0]} risks. One must be about data or privacy. Finish each with what you will do about it.`} eg="“Someone could read another climber's notes. So I will require a key on every request.”">
        {plan.risks.map((r, i) => (
          <div key={i} className="pair">
            {inp(r.risk, v => set({ risks: plan.risks.map((x, k) => (k === i ? { ...x, risk: v } : x)) }), 'Something could go wrong …', `Risk ${i + 1}`)}
            {inp(r.so, v => set({ risks: plan.risks.map((x, k) => (k === i ? { ...x, so: v } : x)) }), 'So I will …', `Risk ${i + 1}: so I will`)}
            {plan.risks.length > LIMITS.risks[0] && <button className="btn subtle" aria-label={`Remove risk ${i + 1}`} onClick={() => drop('risks', i)}>Remove this risk</button>}
          </div>
        ))}
        {plan.risks.length < LIMITS.risks[1] && <button className="btn subtle wide" onClick={() => set({ risks: [...plan.risks, { risk: '', so: '' }] })}>＋ Add a risk</button>}
      </Section>

      <Section title="6. Out of scope" hint="At least 1 thing your app will NOT do. Saying no keeps the first version small." eg="“No photo uploads and no sharing with other climbers.”">
        {plan.scope.map((s, i) => (
          <div key={i} className="row" style={{ margin: 0 }}>
            {inp(s, v => setAt('scope', i, v), 'It will not …', `Out of scope ${i + 1}`)}
            {plan.scope.length > LIMITS.scope[0] && <button className="btn subtle" style={{ flex: '0 0 44px' }} aria-label={`Remove item ${i + 1}`} onClick={() => drop('scope', i)}>✕</button>}
          </div>
        ))}
        {plan.scope.length < LIMITS.scope[1] && <button className="btn subtle wide" onClick={() => add('scope', () => '')}>＋ Add another</button>}
      </Section>

      {problems && problems.length > 0 && (
        <div className="problems" role="alert">
          <strong>{problems.length === 1 ? 'One thing to fix:' : `${problems.length} things to fix:`}</strong>
          <ul>{problems.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      )}
      {problems && problems.length === 0 && <div className="good" role="status">✅ Your plan is complete. The route is set.</div>}

      {problems && problems.length === 0
        ? <button className="btn primary wide" onClick={onPass}>✅ Finish this pitch</button>
        : <button className="btn primary wide" onClick={check}>Check my plan</button>}
      <button className="btn wide" onClick={copyReadme}>📋 Copy as README</button>
      {msg && <p className="note">{msg}</p>}
    </div>
  )
}
