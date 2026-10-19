// Tiny event bus so any screen can report something reward-worthy without plumbing props.
export const emit = (name, data = {}) => window.dispatchEvent(new CustomEvent('everest', { detail: { name, ...data } }))
