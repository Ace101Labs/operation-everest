// A row of the symbols a phone keyboard hides (/ . - | quotes, brackets…), for typed answers.
// Tapping one inserts it at the cursor of `field` (a ref to an input) without closing the keyboard.
const SYMS = ['/', '.', '-', '|', '"', "'", '(', ')', '{', '}', '[', ']', ';', '=', '<', '>', '*', '~', '$', '_']

export function SymKeys({ field, value, onChange }) {
  const insert = s => {
    const el = field.current
    const a = el?.selectionStart ?? value.length, b = el?.selectionEnd ?? value.length
    onChange(value.slice(0, a) + s + value.slice(b))
    requestAnimationFrame(() => { if (el) { el.focus(); el.selectionStart = el.selectionEnd = a + s.length } })
  }
  return <div className="keys sym-keys">{SYMS.map(k => (
    // pointerdown + preventDefault keeps focus in the field, so the phone keyboard stays open
    <button key={k} type="button" onPointerDown={e => e.preventDefault()} onClick={() => insert(k)} aria-label={k}>{k}</button>))}</div>
}
