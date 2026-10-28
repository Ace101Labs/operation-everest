// Break test for the capstone plan checker: an empty plan and a thin plan must be rejected,
// a good plan must pass, and the README export must carry every section.
import { emptyPlan, checkPlan, planMarkdown, cleanPlan } from '../src/plancheck.js'

const good = {
  name: 'Trail Tally', pitch: 'A phone app that counts the hikes a family finishes each season.',
  who: 'families who hike on weekends', problem: 'They forget which trails they finished and how long each took.',
  features: ['A hiker can log a trail with its date and length', 'A hiker can see all finished trails in a list', 'A hiker can delete a trail they logged by mistake'],
  recordName: 'hike', recordFields: 'date, trail, minutes, notes',
  risks: [
    { risk: 'Someone could read another family\'s private notes', so: 'require a key on every request' },
    { risk: 'The phone could be lost with every hike on it', so: 'add a backup code in settings' },
    { risk: 'A bad date could break the list page', so: 'check dates before saving' },
  ],
  scope: ['No photo uploads or maps'],
}
const thin = { ...emptyPlan(), name: 'App', pitch: 'An app', who: 'people', problem: 'stuff', features: ['do things', 'more things', ''], recordName: 'x', recordFields: 'one', risks: [{ risk: 'bugs', so: 'fix' }, { risk: '', so: '' }, { risk: '', so: '' }], scope: [''] }

let fail = 0
const expect = (label, ok, detail = '') => { if (!ok) { fail++; console.error(`FAIL: ${label} ${detail}`) } }
const e = checkPlan(emptyPlan()), t = checkPlan(thin), g = checkPlan(good)
expect('empty plan is rejected', e.length >= 8, `(got ${e.length})`)
expect('thin plan is rejected', t.length >= 6, `(got ${t.length})`)
expect('good plan passes', g.length === 0, g.join(' | '))
expect('thin plan names the "A <user> can" rule', t.some(x => /A <user> can/.test(x)))
expect('privacy rule fires without a data risk', checkPlan({ ...good, risks: good.risks.map(r => ({ ...r, risk: 'The page could look odd on small screens' })) }).some(x => /data or privacy/.test(x)))
expect('two features is too few', checkPlan({ ...good, features: good.features.slice(0, 2) }).some(x => /one more feature/.test(x)))
expect('seven features is too many', checkPlan({ ...good, features: [...good.features, ...good.features.map(f => f + ' again'), 'A hiker can share a trail'] }).some(x => /features or fewer/.test(x)))
expect('one record field is too few', checkPlan({ ...good, recordFields: 'date' }).some(x => /2 different fields/.test(x)))
expect('no out-of-scope item is rejected', checkPlan({ ...good, scope: [''] }).some(x => /NOT do/.test(x)))
const md = planMarkdown(good)
for (const h of ['# Trail Tally', '## Who it is for', '## Must-have features', '## What it saves', '## What could go wrong', '## Out of scope', '- **hike**: date, trail, minutes, notes']) expect(`README has ${h}`, md.includes(h))
expect('README has no em dash', !md.includes('—'))
expect('cleanPlan keeps a good plan passing', checkPlan(cleanPlan(good)).length === 0)
expect('cleanPlan survives junk', cleanPlan('x') === undefined && cleanPlan({ features: 5, risks: 'no' }).features.length === 0)
if (fail) { console.error(`${fail} plan-check failure(s)`); process.exit(1) }
console.log(`plan checker OK: empty=${e.length} problems, thin=${t.length} problems, good=0`)
