// Bundled into one inline script (scripts/build-react-runtime.mjs) so React previews can run
// inside a sandboxed srcdoc iframe with no network access.
import * as React from 'react'
import { createRoot } from 'react-dom/client'
window.__everestRender = (compiled) => {
  const exportsObj = {}
  const req = (n) => { if (n === 'react') return React; if (n === 'react-dom/client') return { createRoot }; throw new Error("Cannot find module '" + n + "'") }
  const App = new Function('React', 'useState', 'useEffect', 'useRef', 'useMemo', 'require', 'exports', 'module',
    compiled + '\n;return typeof App !== "undefined" ? App : (exports.default || module.exports.default)')(
    React, React.useState, React.useEffect, React.useRef, React.useMemo, req, exportsObj, { exports: exportsObj })
  if (typeof App !== 'function') throw new Error('Define a component called App (function App() { … })')
  class Boundary extends React.Component {
    constructor(p) { super(p); this.state = { err: null } }
    static getDerivedStateFromError(err) { return { err } }
    componentDidCatch(err) { parent.postMessage({ __everest: 'error', msg: err.name + ': ' + err.message }, '*') }
    render() { return this.state.err ? null : this.props.children }
  }
  createRoot(document.getElementById('root')).render(React.createElement(Boundary, null, React.createElement(App)))
}
