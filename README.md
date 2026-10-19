# Operation Everest

A free, phone-first learning game: 13 camps up Mount Everest, each one a playing card (from the 2 up to the Ace), taking a complete beginner to a developer who can build things, run their own AI models, explain what they built, and audit other people's projects.

- **Stack:** React 19 + Vite 7 (plain JavaScript), with a hand-written service worker so it works offline and installs as an app.
- **No accounts, no tracking.**
  - Progress and settings live in the browser's localStorage (key `everest.progress.v1`).
  - Settings → backup code is a full backup that never leaves the device.
  - **Device sync (optional):** `api/sync.js` stores an AES-GCM-encrypted copy of progress in a private [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store. The key and the save name both come from a link code that never leaves the player's devices, so the server only ever holds ciphertext. Saves are capped at 128 KB, and `api/cleanup.js` (a daily cron) deletes saves nobody has written for 180 days; every linked device keeps its own copy and re-uploads it. Put a rate limit in front of `/api/*` if you host it.
- **Everything is graded in the browser,** with no AI and no network: a practice Linux terminal (with git and npm), a Node-style code sandbox in a throwaway Web Worker, web and React previews, real SQLite (sql.js) and a practice Express server.
- **Quizzes can't be passed from memory:** each attempt is dealt fresh (`src/deal.js`) with a new order, shuffled options, and a different version of each question (`src/content/alts-camp<N>.js`).

## Run it
```
npm install
npm run dev        # localhost only
npm run check      # content check: everything tested is taught first
npm run build      # production build into dist/
```
`dist/` is a static site; any static host works. Device sync needs the `api/` function and a Blob store (`BLOB_READ_WRITE_TOKEN`), for example on Vercel. Without it, everything except sync still works. Optional: `CRON_SECRET` turns on the daily cleanup (see `vercel.json`).

## Content
- `src/content/camps.js` lists the 13 camps; each camp has its own file (`camp2.js` = Base Camp) and Field Guide cards (`guide*.js`).
- Writing and quality rules for lessons and questions: [CONTENT-GUIDE.md](CONTENT-GUIDE.md).

## License
[MIT](LICENSE)
