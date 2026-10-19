// Pre-bundles React + ReactDOM into one inline-able script for the React preview sandbox.
import { build } from 'esbuild'
await build({ entryPoints: ['src/react-runtime-entry.js'], bundle: true, minify: true, format: 'iife',
  outfile: 'src/generated/react-runtime.js', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'warning' })
console.log('✓ React preview runtime bundled')
