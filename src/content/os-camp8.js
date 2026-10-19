// Camp 8: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
// HTML, CSS and the DOM are the same everywhere; only the browser shortcuts differ.
export const OS_CAMP8 = {
  // Opening the devtools. On a Mac the keys use Cmd+Option, and Safari names the menu item differently.
  '8-1#7': {
    mac: [
      {
        q: 'In Chrome on your Mac, which keys open the devtools? (for example Cmd+Shift+A)',
        accept: ['Cmd+Option+I', 'Command+Option+I', 'Cmd+Opt+I', 'Command+Opt+I', 'Option+Cmd+I', 'Option+Command+I', 'Opt+Cmd+I', 'Cmd+Alt+I', 'Alt+Cmd+I', 'Cmd Option I', 'Cmd + Option + I', 'Command + Option + I', 'Option + Cmd + I', 'Command+Alt+I', 'Alt+Command+I', 'Cmd + Opt + I', 'Command + Opt + I', 'Cmd + Alt + I', 'Opt + Cmd + I', '⌘⌥I', '⌥⌘I', '⌘+⌥+I', '⌥+⌘+I'],
        why: 'On a Mac it\'s **Cmd+Option+I** in Chrome and Firefox. Ctrl+Shift+I and F12 are the keys on Windows and Linux.',
      },
      {
        q: 'In Safari on your Mac, the web developer features are turned on. You right-click a heading. Which menu item opens the Web Inspector on it? (two words)',
        accept: ['Inspect Element', 'inspect element'],
        why: 'Safari calls it **Inspect Element**. It only appears after you tick "Show features for web developers" in Safari\'s Settings → Advanced.',
      },
    ],
  },

  // A Mac reloads with Cmd+R and a Chromebook with Ctrl+R; F5 isn't how either player reloads.
  '8-yeti#5': {
    mac: [
      { q: 'Devtools edits after a reload', options: ['saved', 'gone', 'kept until cookies clear', 'saved in history'], answer: 1 },
      { q: 'Make a devtools colour change last on your Mac', options: ['copy it into your CSS file', 'press Cmd+R to reload', 'close the devtools', 'click Save in the Elements panel'], answer: 0 },
    ],
    chromeos: [
      { q: 'Devtools edits after a reload', options: ['saved', 'gone', 'kept until cookies clear', 'saved in history'], answer: 1 },
      { q: 'Make a devtools colour change last on your Chromebook', options: ['copy it into your CSS file', 'press Ctrl+R to reload', 'close the devtools', 'click Save in the Elements panel'], answer: 0 },
    ],
  },
}
