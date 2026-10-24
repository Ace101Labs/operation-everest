// Camp 7 of 13 (the 8 card): Camp III. The web: HTML, CSS, browser JavaScript.
// Engine: `web` (live preview in a sandboxed iframe; the Sherpa's DOM checks run in order,
// in ONE page, so a `click` in an earlier check is still in effect for later checks).
// Style checks read getComputedStyle(...).getPropertyValue(prop): use dashed property
// names and computed values (rgb(...) colours, px lengths).

const PAGE_HEAD = (title, extra = '') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>${extra}
</head>`

export const camp8 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '8-1', type: 'learn', mode: 'phone', xp: 30, mins: 48,
    title: 'What a web page is made of',
    teaches: ['html', 'html-element', 'html-attribute', 'devtools', 'dns'],
    idea: [
      { h: 'Three languages, one page', b: 'So far your programs have printed their results in the terminal. Now you will build for the **browser**, where most people use software.\n\nEvery web page is three languages working as one team:\n• **HTML** is the skeleton: what is on the page\n• **CSS** is the clothing: how it looks\n• **JavaScript** is the muscles: what happens when you tap\n\nThis trail starts with HTML. You\'ll learn the tags, the attributes that configure them, and the browser\'s **devtools**, which let you inspect any page.' },
      { h: 'HTML never shows errors', b: 'In JavaScript, one missing quote stops everything with a SyntaxError. HTML is different: the browser **never** refuses a page. It guesses what you meant and carries on.\n\nThat means mistakes hide. The page can *look* nearly right while the structure underneath is wrong. So you\'ll learn to inspect the real structure instead of judging by eye.' },
      { h: "Under the hood: what happens when you type an address", b: "Computers find each other by number, an **IP address** like `104.20.23.154`. People use names. So step one is **DNS**, the internet's address book: your device asks a resolver, which asks the root servers, then the servers for `.com`, then the site's own, and gets back the number. Answers are remembered (cached) for a while, which is why a DNS change can take minutes or hours to reach everyone.\n\nThen the browser connects to that address, sets up an encrypted **HTTPS** connection, sends an HTTP request for the page, and gets HTML back. Every page you have ever opened went through those steps in a fraction of a second." },
    ],
    example: {
      intro: 'A tiny but real web page. Tap through it line by line.',
      lang: 'html',
      code: '<!doctype html>\n<html>\n  <body>\n    <h1>Camp III</h1>\n    <p>Altitude: <strong>7,200 m</strong></p>\n    <a href="https://example.com/weather">Weather report</a>\n    <img src="tent.png" alt="Orange tent on the snow">\n  </body>\n</html>',
      steps: [
        { line: 1, note: '`<!doctype html>` tells the browser "this is modern HTML." Without it, browsers fall back to an old compatibility mode.' },
        { line: 2, note: '`<html>` is the root element: everything else lives inside it. It\'s closed on the last line with `</html>`.' },
        { line: 3, note: '`<body>` holds everything you can see. (A real page also has a `<head>`; you\'ll meet it next trail.)' },
        { line: 4, note: 'An **element**: opening tag `<h1>`, content `Camp III`, closing tag `</h1>`. h1 means "the main heading."' },
        { line: 5, note: 'Elements nest: a `<strong>` (important, shown bold) sits inside the `<p>` (paragraph). Inner tags close first.' },
        { line: 6, note: 'An **attribute**: `href="…"` inside the opening tag tells the link where to go. The text between the tags is what you tap.' },
        { line: 7, note: '`<img>` is a **void** element: no content, no closing tag. `src` says which file; `alt` gives the words that replace the picture if it can\'t be seen.' },
        { line: 8, note: 'Close the body, then the html: last opened, first closed.' },
      ],
    },
    tryit: {
      kind: 'web',
      prompt: 'Build your first page. Inside the `<body>`, replace the comment line (`<!-- … -->` is an HTML comment: a note the browser ignores) with:\n1. An `<h1>` that says exactly `Camp III`\n2. A `<p>` paragraph with any text you like\n3. A link: an `<a>` with `href="https://example.com/weather"` and the text `Weather report`\n4. An image: `<img src="tent.png" alt="Orange tent on the snow">`\n\nThere\'s no tent.png file here, so the picture can\'t load. Watch what the browser shows instead: your alt text. That\'s exactly what alt is for.\n\nTap **Preview** to see it, then **Check it**.',
      starter: `${PAGE_HEAD('Camp III')}
<body>
  <!-- Your elements go here -->

</body>
</html>`,
      hints: [
        'Each element is an opening tag, the content, then a closing tag with a slash: `<h1>Camp III</h1>`.',
        'The link: `<a href="https://example.com/weather">Weather report</a>`. The image has no closing tag: `<img src="tent.png" alt="Orange tent on the snow">`.',
      ],
      checks: [
        { label: 'An `<h1>` that says `Camp III`', selector: 'h1', text: 'Camp III' },
        { label: 'A `<p>` paragraph', selector: 'body p', exists: true },
        { label: 'A link whose `href` is `https://example.com/weather`', selector: 'a', attr: { name: 'href', value: 'https://example.com/weather' } },
        { label: 'The link text is `Weather report`', selector: 'a', text: 'Weather report' },
        { label: 'An `<img>` with `src="tent.png"`', selector: 'img', attr: { name: 'src', value: 'tent.png' } },
        { label: 'The image\'s `alt` is `Orange tent on the snow`', selector: 'img', attr: { name: 'alt', value: 'Orange tent on the snow' } },
      ],
    },
    mistakes: [
      { wrong: '<h1>Camp III<h1>', result: '(no error; a second heading starts, and everything after it shows as a giant heading)', why: 'The closing tag needs a slash: `</h1>`. Without it the browser reads a brand new `<h1>`.' },
      { wrong: '<img src="tent.png" alt=Orange tent on the snow>', result: '(the alt text is only "Orange")', why: 'Without quotes, the value stops at the first space; "tent", "on", "the" and "snow" become separate, meaningless attributes. Always quote values.' },
      { wrong: '<p>Pack the <strong>rope</p></strong>', result: '(the browser untangles it its own way; the structure no longer matches what you wrote)', why: 'Tags must close in reverse order: `</strong>` first, then `</p>`.' },
      { wrong: '(fix a typo in the devtools Elements panel, then reload)', result: '(the typo is back)', why: 'Devtools edits live only in the open tab\'s memory. Make the change in your file too.' },
    ],
    recap: [
      '**HTML** describes what is on a page. The browser never crashes on bad HTML; it guesses, so mistakes hide.',
      'An **element** is opening tag + content + closing tag. **Void** elements like `<img>` have no closing tag.',
      'Elements nest like boxes and close in reverse order.',
      '**Attributes** like `href`, `src`, `alt`, `id` and `class` go in the opening tag as `name="value"`.',
      'The **devtools** (right-click → Inspect) show the real, live structure of any page. Edits there are temporary.',
      "**DNS** turns a name like example.com into an IP address. Then: connect, set up HTTPS, request the page, get HTML back.",
    ],
    questions: [
      { concept: 'html', kind: 'mc', q: 'What is HTML\'s job on a web page?', options: ['Making the page interactive, so buttons and menus respond to clicks', 'Describing what is on it: headings, paragraphs, links, images', 'Choosing the colours, fonts and spacing that make the page look good', 'Adding animations and hover effects when the visitor moves the mouse'], answer: 1, why: 'HTML is the structure. CSS does looks, JavaScript does behaviour.' },
      { concept: 'html', kind: 'mc', q: 'You forget a closing tag in your HTML. What happens?', options: ['A SyntaxError, and the page won\'t load', 'The browser guesses and shows the page anyway, possibly wrong', 'A warning banner appears, then the page loads', 'The browser fixes the file and saves the corrected version'], answer: 1, why: 'Browsers never refuse a page. They guess, so mistakes can hide.' },
      { concept: 'html-element', kind: 'mc', q: 'Which of these is a void element (no closing tag)?', options: ['<p>', '<h1>', '<img>', '<a>'], answer: 2, why: '`<img>` has no content, so it has no closing tag. So do `<br>`, `<input>` and `<meta>`.' },
      { concept: 'html-element', kind: 'mc', q: 'Which is correctly nested?', options: ['<p><strong>Rope</p></strong>', '<p><strong>Rope</strong></p>', '<strong><p>Rope</strong></p>', '<p>Rope<strong></p>'], answer: 1, why: 'Last opened, first closed: `</strong>` before `</p>`.' },
      { concept: 'html-attribute', kind: 'mc', q: 'Where does an attribute like `href="gear.html"` go?', options: ['Inside the opening tag', 'Inside the closing tag', 'Between the tags, with the text', 'Just before the opening tag'], answer: 0, why: 'Attributes always live in the opening tag: `<a href="gear.html">`.' },
      { concept: 'html-attribute', kind: 'mc', q: 'What does `<button disabled="false">Go</button>` do?', options: ['A normal, clickable button', 'A disabled button: the attribute is present, so it\'s on', 'A syntax error', 'A button that works but is styled as greyed out'], answer: 1, why: 'For boolean attributes, presence is what counts. Remove `disabled` to enable it.' },
      { concept: 'html-attribute', kind: 'mc', q: 'Which attribute may only be used by ONE element on a page?', options: ['class', 'id', 'href', 'alt'], answer: 1, why: 'Each `id` must be unique. Use `class` for groups.' },
      { concept: 'devtools', kind: 'type', q: 'On a computer, you right-click any part of a web page. Which menu item opens the devtools on that element? (one word)', accept: ['Inspect', 'inspect', 'Inspect Element', 'inspect element'], why: '**Inspect** jumps straight to that element in the Elements panel.' },
      { concept: 'devtools', kind: 'mc', q: 'You change a heading\'s text in the devtools, then reload the page. What do you see?', options: ['Your change, saved', 'The original text: devtools edits are temporary', 'Your change, kept until you close the tab', 'The file\'s text with your change merged in'], answer: 1, why: 'The devtools edit the live page in memory, not your file.' },
      { concept: 'devtools', kind: 'mc', q: "The page loads with no styling. In DevTools, the Network tab lists these requests. What does it tell you?", code: "Name         Status   Type\nindex.html   200      document\nstyle.css    404      stylesheet\napp.js       200      script", options: ["The browser blocked style.css because it has a CSS typo", "app.js changed the page and removed the styles", "The browser asked for style.css, but the server has no file at that path", "index.html loaded, so the stylesheet loaded too"], answer: 2, why: "Status 404 means not found. Check the `href` in the `<link>` tag and that the file is really where it says." },
      { concept: "dns", kind: "mc", q: "You type `example.com` and press Enter. What has to happen before the browser can even ask for the page?", options: ["The page is downloaded from your history", "DNS turns the name into an IP address so the browser knows which computer to connect to", "The CSS loads", "The server sends a 200 status"], answer: 1, why: "Names are for people. Computers connect by IP address, so the name is looked up first." },
      { concept: "dns", kind: "mc", q: "You point your domain at a new server. Some people still reach the old one for an hour. Why?", options: ["The new server is broken", "DNS answers are cached for a while, so some resolvers still hold the old address", "Their browsers are out of date", "HTTPS takes an hour to start"], answer: 1, why: "Each DNS answer comes with a time to live (TTL). Until it runs out, cached copies keep giving the old address." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '8-2', type: 'learn', mode: 'phone', xp: 30, mins: 50,
    title: 'Page structure and accessibility',
    teaches: ['page-structure', 'accessibility'],
    idea: [
      { h: 'Semantic elements', b: 'You could build a whole page out of `<div>` boxes and make it look fine. Plenty of sites do. But to a screen reader, a search engine or the next developer, every div looks the same.\n\n**Semantic** elements (`<header>`, `<nav>`, `<main>`, `<footer>`, headings in order) say what each region *is*. They take no extra effort to write.' },
      { h: 'What accessibility means', b: 'About 1 in 6 people lives with a significant disability. Some are blind and hear pages through a **screen reader**. Some can\'t use a mouse and move with the **Tab** key. Some can\'t read pale grey text. Everyone has days like that: a broken wrist, glare on a phone, a noisy train.\n\n**Accessibility** (a11y) means building your page so all of them can use it. You don\'t add it at the end. It comes almost free when you choose the right elements from the start, and this trail shows how.' },
    ],
    example: {
      intro: 'A well-structured page. Tap through it.',
      lang: 'html',
      code: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Trail report · Camp III</title>\n</head>\n<body>\n  <header>\n    <h1>Trail report</h1>\n    <nav><a href="/">Home</a> <a href="/route">Route</a></nav>\n  </header>\n  <main>\n    <h2>Lhotse Face</h2>\n    <img src="ropes.jpg" alt="Fixed ropes running up a steep blue ice wall">\n    <p>Ropes fixed to 7,400 m.</p>\n  </main>\n  <footer>Updated at Camp III</footer>\n</body>\n</html>',
      steps: [
        { line: 2, note: '`lang="en"` tells screen readers which language to speak, so words are pronounced correctly.' },
        { line: 3, note: 'The `<head>` holds information *about* the page. Nothing in it shows on the page itself.' },
        { line: 4, note: '`charset="utf-8"` makes letters like é, ñ and — display correctly instead of junk.' },
        { line: 5, note: 'The viewport tag makes phones show the page at their real width instead of a shrunken desktop view.' },
        { line: 6, note: 'The `<title>` is the text in the browser tab, bookmarks and search results.' },
        { line: 9, note: '`<header>`: the top of the page, with the site name.' },
        { line: 10, note: 'Exactly one `<h1>`: the page\'s title. Sections below use `<h2>`, sub-sections `<h3>`.' },
        { line: 11, note: '`<nav>` marks the main menu. Screen reader users can jump straight to it.' },
        { line: 13, note: '`<main>`: the main content. One per page, so "skip to main content" always lands in the right place.' },
        { line: 15, note: 'The alt text describes what matters in the picture. No "image of": screen readers already announce "image."' },
        { line: 18, note: '`<footer>`: the bottom of the page. It looks just like a div, but it means something.' },
      ],
    },
    tryit: {
      kind: 'web',
      prompt: 'This expedition log is a pile of `<div>`s with an image nobody can "see." Give it a proper structure:\n1. Add `lang="en"` to the `<html>` tag\n2. Turn `div.top` into a `<header>`, and `div.title` inside it into an `<h1>`\n3. Turn `div.menu` into a `<nav>`\n4. Turn `div.content` into a `<main>`, and `div.subtitle` into an `<h2>`\n5. Give the `<img>` a meaningful `alt` describing a tent camp on a snowy ridge (your own words)\n6. Turn `div.bottom` into a `<footer>`\n\nChange both the opening AND the closing tag each time. When you\'re done, no `<div>` should be left.',
      starter: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Expedition log</title>
</head>
<body>
  <div class="top">
    <div class="title">Expedition log</div>
    <div class="menu"><a href="#day11">Day 11</a> <a href="#day12">Day 12</a></div>
  </div>
  <div class="content">
    <div class="subtitle">Day 12</div>
    <img src="camp3.jpg">
    <p>Reached Camp III after six hours on the fixed ropes.</p>
  </div>
  <div class="bottom">Written at 7,200 m</div>
</body>
</html>`,
      hints: [
        'Swap the tag name in both places: `<div class="top">` … `</div>` becomes `<header>` … `</header>`. You can delete the class attributes.',
        'The image: `<img src="camp3.jpg" alt="Three tents pitched on a narrow snowy ridge">`. Any real description works; an empty alt doesn\'t.',
      ],
      checks: [
        { label: '`<html>` has `lang="en"`', selector: 'html', attr: { name: 'lang', value: 'en' } },
        { label: 'A `<header>` with the `<h1>` "Expedition log" inside', selector: 'header h1', text: 'Expedition log' },
        { label: 'A `<nav>` holding the day links', selector: 'nav a', count: 2 },
        { label: 'A `<main>` with the `<h2>` "Day 12" inside', selector: 'main h2', text: 'Day 12' },
        { label: 'The image has a real (non-empty) `alt`', selector: 'img[alt]:not([alt=""])', exists: true },
        { label: 'A `<footer>`', selector: 'footer', text: 'Written at 7,200 m' },
        { label: 'No `<div>` boxes left', selector: 'div', count: 0 },
      ],
    },
    mistakes: [
      { wrong: '<img src="camp3.jpg">', result: 'Many screen readers read the file name aloud: "camp3 dot jpg, image"', why: 'No alt text. Describe what matters, or use `alt=""` if the image is pure decoration.' },
      { wrong: '<div class="btn" onclick="save()">Save</div>', result: '(Tab skips right past it, and Enter does nothing; screen readers don\'t call it a button)', why: 'Only real interactive elements get keyboard support for free. Use `<button type="button">Save</button>`.' },
      { wrong: '.hint { color: #999999; }  (on a white background)', result: '(a contrast ratio of about 2.8:1, too faint for many readers)', why: 'Normal text needs at least 4.5:1. `#767676` on white is about the lightest grey that passes.' },
      { wrong: '<h1>Gear</h1> … <h4>Ropes</h4>', result: '(looks fine; a screen reader user hears the outline jump from level 1 to level 4)', why: 'Pick heading levels by outline, not size. Use `<h2>` and make it smaller with CSS if you need to.' },
    ],
    recap: [
      'Every page: `<!doctype html>`, `<html lang="…">`, a `<head>` (charset, viewport, title) and a `<body>`.',
      '**Landmarks**: `<header>`, `<nav>`, exactly one `<main>`, `<footer>`. Headings form an outline: one `<h1>`, then `<h2>`, `<h3>`, no skipping.',
      '**Accessibility** starts with semantic HTML: real buttons, links, headings and labels.',
      'Every image needs `alt`: describe what matters, or `alt=""` for decoration.',
      'Keyboard users need focus they can see. Text needs contrast of at least 4.5:1. Never rely on colour alone.',
    ],
    questions: [
      { concept: 'page-structure', kind: 'mc', q: 'What goes in the `<head>`?', options: ['The main heading of the page, which the visitor sees first', 'Information about the page: charset, viewport, title, CSS links', 'The navigation menu and the links that lead to other pages', 'Everything visible at the top of the page, like the logo and banner'], answer: 1, why: 'The head is about the page and isn\'t shown. The visible top of the page is a `<header>` inside the body.' },
      { concept: 'page-structure', kind: 'mc', q: 'How many `<main>` elements should a page have?', options: ['None', 'Exactly one', 'One per section', 'As many as you like'], answer: 1, why: 'One `<main>`, so "skip to main content" has one clear target.' },
      { concept: 'page-structure', kind: 'mc', q: 'A page looks tiny and zoomed-out on phones. What\'s most likely missing?', options: ['`<meta name="description" content="Trail report for Camp II">`', '`<meta name="viewport" content="width=device-width, initial-scale=1">`', '`<link rel="stylesheet" href="style.css" media="screen">`', '`<meta name="mobile-friendly" content="true">`'], answer: 1, why: 'Without the viewport tag, phones pretend to be a ~980px desktop.' },
      { concept: 'accessibility', kind: 'mc', q: 'Which alt text is best for a photo of climbers on a ridge, in a trail report?', options: ['alt="Image: climbers on a ridge, trail report photo number 1"', 'alt="IMG_2041.jpg, taken on the ridge trip last July"', 'alt="Four climbers roped together on a narrow snow ridge"', 'alt="Picture of a photo showing some climbers on a ridge"'], answer: 2, why: 'Describe what matters. Screen readers already say "image," so skip "picture of."' },
      { concept: 'accessibility', kind: 'mc', q: 'A purely decorative divider image should have…', options: ['no alt attribute at all', 'alt="" (empty)', 'alt="decorative divider image"', 'alt="spacer.png"'], answer: 1, why: 'An empty alt tells screen readers to skip it. A missing alt may make them read the file name.' },
      { concept: 'accessibility', kind: 'mc', q: 'Why is `<button>` better than a `<div>` with a click handler?', options: ['It\'s shorter to type, and shorter code means fewer bugs in the page', 'It can be reached with Tab, pressed with Enter or Space, and is announced as a button', 'Click handlers only run on buttons, so a div with one never responds at all', 'Buttons run JavaScript noticeably faster than divs do in the browser'], answer: 1, why: 'Real buttons come with keyboard support and the right announcement, free.' },
      { concept: 'accessibility', kind: 'mc', q: 'WCAG level AA asks normal-size text to have a contrast ratio of at least…', options: ['3:1', '7:1', '4.5:1', '21:1'], answer: 2, why: '4.5:1 for normal text, 3:1 for large text. 21:1 is the maximum (black on white).' },
      { concept: 'accessibility', kind: 'mc', q: 'A form says "Fields in red are required." What\'s the accessibility problem?', options: ['The message sits above the form instead of below it, where people look', 'Colour-blind users and screen reader users can\'t tell which fields are required', 'Screen readers can\'t pronounce the word red, so the sentence makes no sense', 'Nothing: red is the standard colour for required fields, so everyone understands'], answer: 1, why: 'Never rely on colour alone. Add text like "(required)" and the `required` attribute.' },
      { concept: 'html-element', kind: 'mc', q: "An HTML validator prints this. What does it mean?", code: "Error: Unclosed element ul.\nFrom line 12, column 5; to line 12, column 8\n    <ul>", options: ["The ul opened on line 12 never got its closing tag", "The ul on line 12 is closed twice", "The ul tag is not allowed in HTML", "Line 12 is missing an li element"], answer: 0, why: "'Unclosed' means a start tag with no matching end tag. The location is where the start tag begins." },
      { concept: 'accessibility', kind: 'mc', q: "An HTML validator prints this. What do you add?", code: "Error: An img element must have an alt attribute, except under certain conditions.\nFrom line 8, column 5; to line 8, column 32\n    <img src=\"tent.png\">", options: ["A title tag in the head", "A width attribute on the image", "An alt attribute that describes the image", "A closing </img> tag"], answer: 2, why: "Alt text is what a screen reader says, and what shows if the image fails to load." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '8-3', type: 'learn', mode: 'phone', xp: 30, mins: 53,
    title: 'CSS: rules, selectors and the box model',
    teaches: ['css', 'css-selector', 'box-model', 'rendering'],
    idea: [
      { h: 'What CSS does', b: 'HTML says what\'s on the page. **CSS** says how it looks: colours, fonts, sizes, spacing. Because they\'re separate, you can redesign a whole site without touching a word of its content.\n\nThis trail covers the three things you need for almost every style: **rules** (how CSS is written), **selectors** (which elements a rule hits) and the **box model** (how every element takes up space).' },
      { h: 'CSS fails silently', b: 'Like HTML, CSS has no error messages. If you misspell a property or forget a semicolon, the browser skips that line. The only sign is that nothing changed.\n\nWhen a style "doesn\'t work," inspect the element in the devtools. Skipped and losing declarations show up crossed out.' },
      { h: "Under the hood: how the browser draws the page", b: "Turning text into pixels takes several steps, many times a second. The browser **parses** the HTML into the DOM tree and the CSS into rules, works out which rules apply to each element, does **layout** (where everything goes and how big it is), then **paints** the pixels.\n\nThe order matters for speed. Change something's size or position and the browser has to redo layout for everything it might push around. Change only colour, or move things with `transform`, and it can skip that work. That's why smooth animations use `transform`, and why a `<script>` in the `<head>` without `defer` makes the page appear later: the browser stops reading the HTML until that script has downloaded and run." },
    ],
    example: {
      intro: 'CSS in a `<style>` element, styling some HTML. Tap through it.',
      lang: 'html',
      code: '<style>\n  body { font-family: sans-serif; color: #222222; }\n  h1 { color: #b71c1c; }\n  .card {\n    box-sizing: border-box;\n    width: 300px;\n    padding: 16px;\n    border: 2px solid #2e7d32;\n    margin-top: 24px;\n  }\n  .card .note { font-size: 14px; }\n</style>\n<h1>Camp III</h1>\n<div class="card">\n  <p class="note">Oxygen: 3 bottles</p>\n</div>',
      steps: [
        { line: 1, note: 'A `<style>` element holds CSS rules. (On a real site it sits in the head, or in a separate .css file.)' },
        { line: 2, note: 'A **rule**: selector `body`, then declarations in `{ }`. Each is `property: value;`. Font and colour **inherit**, so all text inside body gets them.' },
        { line: 3, note: 'A **type selector**: every `<h1>` turns dark red. `#b71c1c` is a hex colour (red, green, blue).' },
        { line: 4, note: 'A **class selector** (with a dot): anything with `class="card"`.' },
        { line: 5, note: '`border-box` makes the width include padding and border, so 300px really means 300px on screen.' },
        { line: 7, note: '**Padding**: space *inside* the border, filled by the background.' },
        { line: 8, note: '**Border**: width, style and colour. Without the style (`solid`) there\'s no border at all.' },
        { line: 9, note: '**Margin**: space *outside*, pushing the card away from the heading.' },
        { line: 11, note: 'A **descendant selector**: elements with class "note" that are *inside* a .card. The space means "inside."' },
        { line: 15, note: 'The HTML side: `class="note"` has no dot. The dot only appears in the CSS selector.' },
      ],
    },
    tryit: {
      kind: 'web',
      prompt: 'Dress this page. Write your rules inside the `<style>` element:\n1. Make every `h1` the colour `#b71c1c`\n2. Give `.note` a `font-size` of `18px`\n3. Give `.card` `16px` of padding, a `2px solid #2e7d32` border, and a `margin-top` of `24px`\n4. Make the `h2` inside the card (selector `.card h2`) the colour `#1565c0`\n\nEnd every declaration with a semicolon.',
      starter: `${PAGE_HEAD('Gear card', `
  <style>
    /* Write your CSS rules below this comment */

  </style>`)}
<body>
  <h1>Camp III</h1>
  <p class="note">Wind: 40 km/h from the west</p>
  <div class="card">
    <h2>Oxygen</h2>
    <p>3 bottles, 4 litres each</p>
  </div>
</body>
</html>`,
      hints: [
        'One rule per selector: `h1 { color: #b71c1c; }` and `.note { font-size: 18px; }`. Classes need the dot.',
        'The card: `.card { padding: 16px; border: 2px solid #2e7d32; margin-top: 24px; }`, then `.card h2 { color: #1565c0; }`.',
      ],
      checks: [
        { label: '`h1` is `#b71c1c`', selector: 'h1', style: { prop: 'color', value: 'rgb(183, 28, 28)' } },
        { label: '`.note` is `18px`', selector: '.note', style: { prop: 'font-size', value: '18px' } },
        { label: '`.card` has `16px` padding', selector: '.card', style: { prop: 'padding-top', value: '16px' } },
        { label: '`.card` border is `2px` wide', selector: '.card', style: { prop: 'border-top-width', value: '2px' } },
        { label: '`.card` border is `solid`', selector: '.card', style: { prop: 'border-top-style', value: 'solid' } },
        { label: '`.card` border colour is `#2e7d32`', selector: '.card', style: { prop: 'border-top-color', value: 'rgb(46, 125, 50)' } },
        { label: '`.card` has a `24px` top margin', selector: '.card', style: { prop: 'margin-top', value: '24px' } },
        { label: 'The card\'s `h2` is `#1565c0`', selector: '.card h2', style: { prop: 'color', value: 'rgb(21, 101, 192)' } },
      ],
    },
    mistakes: [
      { wrong: 'h1 { color: #b71c1c font-size: 32px; }', result: '(neither the colour nor the size applies; no error anywhere)', why: 'The missing semicolon glues two declarations into one invalid value, so the browser drops it. End every declaration with `;`.' },
      { wrong: 'note { font-size: 18px; }', result: '(nothing changes)', why: 'Without the dot, `note` looks for a `<note>` element. A class selector is `.note`.' },
      { wrong: '.card { border-width: 2px; border-color: green; }', result: '(no border at all)', why: 'The border style defaults to `none`. Add `border-style: solid`, or use the shorthand `border: 2px solid green;`.' },
      { wrong: '.card { width: 300px; padding: 16px; border: 2px solid; }', result: '(the card is 336px wide, not 300px)', why: 'By default width is the content only: 300 + 16 + 16 + 2 + 2 = 336. Add `box-sizing: border-box`.' },
    ],
    recap: [
      'A **CSS rule** = selector + `{ property: value; }`. Missing semicolons and typos fail silently.',
      '**Selectors**: `p` (type), `.item` (class), `#count` (id), `.card h2` (inside), `.item.packed` (both classes).',
      'When rules clash, the more **specific** selector wins (id > class > type); if they tie, the **later** one wins.',
      'The **box model**: content, padding (inside), border (needs a style), margin (outside).',
      'Use `box-sizing: border-box` so `width` includes padding and border.',
      "The browser **renders** in steps: parse HTML and CSS, style, layout, paint. Size and position changes redo layout; `transform` and colour are cheaper.",
    ],
    questions: [
      { concept: 'css', kind: 'mc', q: 'In `h1 { color: red; }`, what is `color`?', options: ['The selector', 'The property', 'The value', 'A class'], answer: 1, why: '`h1` is the selector, `color` the property, `red` the value.' },
      { concept: 'css', kind: 'mc', q: 'Both rules apply to the same paragraph. What colour is it?', code: 'p { color: blue; }\np { color: green; }', options: ['Blue', 'Green', 'An error: you can\'t repeat a selector', 'The default black'], answer: 1, why: 'Same specificity, so the later rule wins.' },
      { concept: 'css', kind: 'mc', q: 'You wrote `p { padding: 16; }` and nothing happens. Why?', options: ['Padding must be set on the parent instead', 'The value needs a unit, like `16px`', 'Padding only works on elements with a set width', 'You need `!important`'], answer: 1, why: 'Lengths need units. Only `0` may go without one. CSS skips invalid values silently.' },
      { concept: 'css-selector', kind: 'mc', q: 'Which selector matches `<li class="item packed">`?', options: ['.item .packed', '.item.packed', 'item.packed', '#item.packed'], answer: 1, why: '`.item.packed` (no space) = one element with both classes. With a space it means "a .packed inside an .item."' },
      { concept: 'css-selector', kind: 'mc', q: 'An element matches both rules. Which colour wins?', code: '#count { color: red; }\np { color: blue; }', options: ['Blue, because it comes last', 'Red, because an id is more specific than a type', 'Blue, because type selectors beat ids', 'Whichever rule the browser loaded first'], answer: 1, why: 'Specificity beats order: id > class > type.' },
      { concept: 'css-selector', kind: 'mc', q: 'What does `nav a` select?', options: ['Every `<nav>` and every `<a>`', 'Links (`<a>`) that are inside a `<nav>`', 'Only the first link', 'A nav with class "a"'], answer: 1, why: 'The space means "inside." Read right to left: links… inside a nav.' },
      { concept: 'box-model', kind: 'mc', q: 'Which part of the box is the space between the content and the border, filled by the background colour?', options: ['Margin', 'Padding', 'Content', 'Outline'], answer: 1, why: 'Padding is inside the border; margin is outside and transparent.' },
      { concept: 'box-model', kind: 'mc', q: 'With default sizing, how wide is this box on screen?', code: '.box { width: 200px; padding: 20px; border: 2px solid black; }', options: ['200px', '220px', '242px', '244px'], answer: 3, why: '200 + 20 + 20 + 2 + 2 = 244. `box-sizing: border-box` would make it exactly 200.' },
      { concept: 'box-model', kind: 'mc', q: '`.card { border-width: 4px; }` shows no border. What\'s missing?', options: ['A colour value, like `red`', 'A border style, like `solid`', 'A border-radius, like `8px`', 'Padding, like `padding: 4px`'], answer: 1, why: 'The style defaults to none, which means no border. Colour is optional (it defaults to the text colour).' },
      { concept: 'css', kind: 'mc', q: "In DevTools the Styles panel shows this. The card has no colour. What does the warning tell you?", code: ".card {                    style.css:14\n  display: flex;\n  colour: red;   <- crossed out, with a warning: Unknown property name\n}", options: ["The property is spelled wrong: CSS says color", "The value red isn't a valid colour in CSS", "display: flex has to come after the colour line", "The rule needs a semicolon after the last line"], answer: 0, why: "A crossed-out line means the browser ignored it. 'Unknown property name' means the property isn't one it knows." },
      { concept: "rendering", kind: "mc", q: "An animation moves a box with `left: 10px`, `11px`, `12px`… and stutters on phones. What's the usual fix?", options: ["Use bigger steps", "Move it with `transform: translateX(…)`, which skips the layout step", "Add more CSS rules", "Use a table instead of a div"], answer: 1, why: "Changing left forces layout every frame. transform is applied after layout, so the browser does far less work." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '8-4', type: 'learn', mode: 'phone', xp: 30, mins: 45,
    title: 'Flexbox and responsive layout',
    teaches: ['flexbox', 'responsive-design'],
    idea: [
      { h: 'Flexbox: rows and columns', b: 'By default, block elements stack top to bottom. To put things side by side (a nav bar, a row of buttons, a set of gear chips) you need a **layout** tool. **Flexbox** is the everyday one: switch it on for a parent and its children line up in a row or column, with spacing you control.' },
      { h: 'Responsive design: phone first', b: 'Most people will open your page on a phone. **Responsive design** means one page that fits both a 360px phone and a wide monitor. It uses a viewport tag, flexible widths, images that shrink, and **media queries**, which change the layout on wider screens.\n\nBuild the phone layout first, then add changes for big screens. That direction is easier.' },
    ],
    example: {
      intro: 'A list that stacks on phones and becomes a row on wide screens. Tap through it.',
      lang: 'html',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1">\n<style>\n  .camps {\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n  }\n  @media (min-width: 700px) {\n    .camps {\n      flex-direction: row;\n      justify-content: space-between;\n    }\n  }\n  img { max-width: 100%; height: auto; }\n</style>\n<ul class="camps">\n  <li>Camp I</li>\n  <li>Camp II</li>\n  <li>Camp III</li>\n</ul>',
      steps: [
        { line: 1, note: 'The viewport tag (normally in the head): "use the phone\'s real width." Responsive design starts here.' },
        { line: 4, note: '`display: flex` goes on the **parent**. Its direct children (the `<li>`s) become flex items.' },
        { line: 5, note: '`flex-direction: column` stacks them: the phone layout, written first (mobile-first).' },
        { line: 6, note: '`gap` puts 8px between items, with none at the edges.' },
        { line: 8, note: 'A **media query**: the rules inside only apply when the screen is at least 700px wide.' },
        { line: 10, note: 'On wide screens, switch to a row…' },
        { line: 11, note: '…and spread the items out: first at the left edge, last at the right, equal gaps between.' },
        { line: 14, note: 'Images never grow wider than their container, so they can\'t break the phone layout.' },
      ],
    },
    tryit: {
      kind: 'web',
      prompt: 'Make this camp list phone-friendly:\n1. In the `<head>`, add the viewport tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`\n2. Make `.camps` a flex container with `display: flex`\n3. Let its items wrap onto new lines: `flex-wrap: wrap`\n4. Put `12px` between items with `gap`\n5. Spread them out with `justify-content: space-between`\n6. Stop the big route image overflowing: give `img` a `max-width` of `100%` and `height: auto`',
      starter: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>The route</title>
  <style>
    /* Your CSS here */

  </style>
</head>
<body>
  <h1>The route</h1>
  <ul class="camps">
    <li>Base Camp</li>
    <li>Camp I</li>
    <li>Camp II</li>
    <li>Camp III</li>
  </ul>
  <img src="route.png" alt="Route map from Base Camp to Camp III" width="900" height="300">
</body>
</html>`,
      hints: [
        'Everything for the list goes in one rule: `.camps { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }`.',
        'The image rule: `img { max-width: 100%; height: auto; }`. The viewport `<meta>` goes inside `<head>`, next to the charset one.',
      ],
      checks: [
        { label: 'A viewport `<meta>` tag', selector: 'meta[name="viewport"]', exists: true },
        { label: '`.camps` is a flex container', selector: '.camps', style: { prop: 'display', value: 'flex' } },
        { label: 'Items wrap', selector: '.camps', style: { prop: 'flex-wrap', value: 'wrap' } },
        { label: '`12px` gap', selector: '.camps', style: { prop: 'column-gap', value: '12px' } },
        { label: 'Spread out with `space-between`', selector: '.camps', style: { prop: 'justify-content', value: 'space-between' } },
        { label: 'Images can\'t grow wider than their container', selector: 'img', style: { prop: 'max-width', value: '100%' } },
      ],
    },
    mistakes: [
      { wrong: '.camps li { display: flex; }', result: '(the camps are still stacked vertically)', why: 'Flex goes on the **parent**: `.camps { display: flex; }`. The children are what get laid out.' },
      { wrong: '@media (min-width: 700) { … }', result: '(the whole block is ignored, silently)', why: 'The width needs a unit: `700px`.' },
      { wrong: '.page { width: 1200px; }', result: '(on a phone the page scrolls sideways and content is cut off)', why: 'Use `max-width: 1200px; width: 100%;` so it can shrink.' },
      { wrong: '.list { display: flex; flex-direction: column; justify-content: center; }  (wanted it centred left-to-right)', result: '(nothing centres horizontally)', why: 'In a column the axes swap. `align-items: center` centres across, which is horizontally now.' },
    ],
    recap: [
      '`display: flex` on a **parent** lines up its children in a row (or a column with `flex-direction: column`).',
      '`justify-content` spaces items **along** the main axis; `align-items` aligns them **across** it.',
      '`gap` spaces items; `flex-wrap: wrap` lets them flow onto new lines.',
      '**Responsive**: the viewport tag, flexible widths (`max-width`, `%`), `img { max-width: 100% }`, and `@media (min-width: …)` queries.',
      'Mobile-first: write the phone layout, then add media queries for wider screens.',
    ],
    questions: [
      { concept: 'flexbox', kind: 'mc', q: 'You want three buttons side by side. Where does `display: flex` go?', options: ['On each of the three buttons', 'On the element that contains the buttons', 'On the `<body>` so its contents line up', 'On the `<html>` element at the very top'], answer: 1, why: 'Flex goes on the parent; its direct children become flex items.' },
      { concept: 'flexbox', kind: 'mc', q: 'In a normal flex row, which property spaces items out from left to right?', options: ['align-items', 'justify-content', 'flex-wrap', 'text-align'], answer: 1, why: '`justify-content` works along the main axis (left to right in a row).' },
      { concept: 'flexbox', kind: 'mc', q: 'Ten chips in a flex row get squashed thin on a phone. Which property lets them keep their size and flow onto new lines?', options: ['flex-wrap: wrap', 'flex-direction: row', 'justify-content: center', 'display: block'], answer: 0, why: 'The default is `nowrap`. `wrap` lets items flow onto new lines.' },
      { concept: 'flexbox', kind: 'mc', q: 'What does `justify-content: space-between` do?', options: ['Centres every item in the container, with the gaps shared equally', 'Puts the first item at the start, the last at the end, and equal gaps between', 'Adds a fixed 8px gap between each pair of items, whatever the container width', 'Stacks the items vertically, one under another, with the gaps shared equally'], answer: 1, why: 'Edges touch the ends; the leftover space is shared between items.' },
      { concept: 'responsive-design', kind: 'mc', q: 'What does `@media (min-width: 700px) { … }` mean?', options: ['Apply these rules only when the screen is at least 700px wide', 'Make the page exactly 700px wide on every screen', 'Apply these rules only on phones, since 700px is a phone width', 'Hide the whole page whenever the screen is below 700px wide'], answer: 0, why: 'A media query applies its rules only when its condition is true.' },
      { concept: 'responsive-design', kind: 'mc', q: 'A large photo makes your phone page scroll sideways. Best fix?', options: ['img { overflow: hidden; }', 'img { max-width: 100%; height: auto; }', 'img { min-width: 100%; }', 'img { width: 100%; height: 600px; }'], answer: 1, why: 'Images then shrink to fit their container and keep their shape.' },
      { concept: 'responsive-design', kind: 'mc', q: 'What does "mobile-first" mean?', options: ['Only build the site for phones and ignore desktop screens completely', 'Write the phone layout as the base CSS, then add media queries for bigger screens', 'Test the site on a real phone after the launch, then fix whatever breaks', 'Build a separate site for phones, with its own address and its own code'], answer: 1, why: 'Small screens get the simplest CSS; bigger screens get extras.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '8-5', type: 'learn', mode: 'phone', xp: 30, mins: 48,
    title: 'The DOM: changing the page with JavaScript',
    teaches: ['dom', 'query-selector'],
    idea: [
      { h: 'What the DOM is', b: 'When the browser reads your HTML, it builds a tree of objects in memory, one per element. That tree is the **DOM**, and the screen is drawn from it. Change the tree with JavaScript and the page updates instantly, with no reload.\n\nIt\'s the same JavaScript you\'ve been writing in Node, plus one new global object: `document`, the whole page.' },
      { h: 'Select, then change', b: 'Almost every browser script follows two steps:\n1. **Select** the element you want with `document.querySelector`, using the same selectors you learned in CSS\n2. **Change** it: its text, its classes, its attributes, or add new elements next to it' },
      { h: "Under the hood: the page is a tree", b: "The DOM is a **tree**, the same shape as the folders under `/` at Base Camp: `html` at the root, `head` and `body` as its children, and every element inside its parent. `querySelector` searches that tree from the top, visiting element after element until it finds a match.\n\nTrees are one of the most important structures in computer science. Once you can picture this one, you can picture the others: folders, Git history, JSON data, even the way a program's code is read by the computer." },
    ],
    example: {
      intro: 'A script that grabs elements and changes them. Tap through it.',
      lang: 'html',
      code: '<p id="status">Waiting at Camp II</p>\n<ul id="tents">\n  <li>Tent 1</li>\n  <li>Tent 2</li>\n</ul>\n<script>\n  const report = document.querySelector("#status")\n  report.textContent = "Camp III reached"\n\n  const tents = document.querySelectorAll("#tents li")\n  tents.forEach(tent => tent.classList.add("pitched"))\n\n  const extra = document.createElement("li")\n  extra.textContent = "Tent 3"\n  document.querySelector("#tents").append(extra)\n</script>',
      steps: [
        { line: 1, note: 'An element with an id, so JavaScript can find it easily.' },
        { line: 6, note: 'The `<script>` sits at the end, AFTER the elements. The browser builds the page top to bottom, so by now they exist.' },
        { line: 7, note: '`querySelector("#status")` returns the first element matching that CSS selector. We keep it in a `const`.' },
        { line: 8, note: 'Setting `textContent` replaces the text. The page now reads "Camp III reached."' },
        { line: 10, note: '`querySelectorAll` returns ALL matches as a NodeList: here, both `<li>`s.' },
        { line: 11, note: 'A NodeList has `forEach`. Each tent gets the class "pitched", ready for a CSS rule to style it.' },
        { line: 13, note: '`createElement` makes a brand new `<li>`. It exists in memory but isn\'t on the page yet.' },
        { line: 14, note: 'Fill it with text.' },
        { line: 15, note: '`append` attaches it to the end of the list. Now it appears.' },
      ],
    },
    tryit: {
      kind: 'web',
      prompt: 'Write JavaScript inside the `<script>` element (it\'s already at the end of the body):\n1. Grab `#status` and set its `textContent` to `Camp III reached`\n2. Use `querySelectorAll("#tents li")` and `forEach` to add the class `pitched` to every tent (watch them turn green)\n3. Last of all, create a new `<li>` with the text `Tent 4` and `append` it to `#tents`',
      starter: `${PAGE_HEAD('Camp board', `
  <style>
    .pitched { color: #2e7d32; font-weight: bold; }
  </style>`)}
<body>
  <h1>Camp board</h1>
  <p id="status">Waiting at Camp II</p>
  <ul id="tents">
    <li>Tent 1</li>
    <li>Tent 2</li>
    <li>Tent 3</li>
  </ul>
  <script>
    // Your JavaScript goes here

  </script>
</body>
</html>`,
      hints: [
        'Step 1: `document.querySelector("#status").textContent = "Camp III reached"`',
        'Step 2: `document.querySelectorAll("#tents li").forEach(tent => tent.classList.add("pitched"))`. Step 3: `const li = document.createElement("li")`, set `li.textContent = "Tent 4"`, then `document.querySelector("#tents").append(li)`.',
      ],
      checks: [
        { label: '`#status` says `Camp III reached`', selector: '#status', text: 'Camp III reached' },
        { label: 'Tents 1 to 3 all have the class `pitched`', selector: '#tents li:nth-child(-n+3).pitched', count: 3 },
        { label: 'The list now has 4 tents', selector: '#tents li', count: 4 },
        { label: 'The last one says `Tent 4`', selector: '#tents li:last-child', text: 'Tent 4' },
      ],
    },
    mistakes: [
      { wrong: 'document.querySelector("status").textContent = "Hi"', result: 'TypeError: Cannot set properties of null (setting \'textContent\')', why: 'Without the `#`, it looks for a `<status>` element, finds none and returns `null`. Use `"#status"`.' },
      { wrong: '<head><script>document.querySelector("#status").textContent = "Hi"</script></head>', result: 'TypeError: Cannot set properties of null (setting \'textContent\')', why: 'This script runs before the body has been built, so there\'s nothing to find yet. Put scripts at the end of the body.' },
      { wrong: 'document.querySelectorAll("li").textContent = "Packed"', result: '(nothing changes, and there\'s no error)', why: 'That\'s a list, not an element. Loop over it: `.forEach(li => li.textContent = "Packed")`.' },
      { wrong: 'document.querySelectorAll("li").map(li => li.textContent)', result: 'TypeError: document.querySelectorAll(...).map is not a function', why: 'NodeLists have `forEach` but not `map`. Spread it into an array first: `[...document.querySelectorAll("li")].map(…)`.' },
    ],
    recap: [
      'The **DOM** is the live tree the browser builds from your HTML. Change it and the screen updates.',
      '`document.querySelector(sel)` returns the first match or `null`; `querySelectorAll(sel)` returns a NodeList of all matches.',
      'Change things with `textContent`, `classList.add/remove/toggle`, `setAttribute`; add with `createElement` + `append`.',
      'Scripts go at the **end of the body** (or use `defer`), so the elements exist when the script runs.',
      'Use `textContent`, never `innerHTML`, for anything a user typed.',
    ],
    questions: [
      { concept: 'dom', kind: 'mc', q: 'What is the DOM?', options: ['A saved copy of your HTML file kept by the browser', 'The live tree of objects the browser builds from your HTML', 'The list of tags exactly as you typed them in the file', 'A JavaScript library for styling pages'], answer: 1, why: 'Document Object Model: the page as objects JavaScript can change.' },
      { concept: 'dom', kind: 'mc', q: 'Your script is in the `<head>` and `querySelector("#status")` returns `null`. Why?', options: ['The id is wrong', 'The script ran before the browser had built the body', 'The id needs a dot in front, not a hash', 'The element is hidden by CSS'], answer: 1, why: 'The page is built top to bottom. Move the script to the end of the body, or use `defer`.' },
      { concept: 'dom', kind: 'mc', q: 'A user types a comment, and you show it on the page. Which is safe?', options: ['el.innerHTML = comment', 'el.textContent = comment', 'document.write(comment)', 'All are equally safe'], answer: 1, why: '`textContent` shows it as plain text. `innerHTML` would treat it as real HTML, so a trick like `<img src=x onerror="…">` runs code (XSS).' },
      { concept: 'dom', kind: 'mc', q: 'What does `el.classList.toggle("packed")` do?', options: ['Always adds "packed", whether or not it\'s there', 'Always removes "packed", even if it was missing', 'Adds it if missing, removes it if present', 'Deletes the element from the page entirely'], answer: 2, why: 'Toggle flips it, which is perfect for checklists.' },
      { concept: 'query-selector', kind: 'mc', q: 'What does `document.querySelector(".item")` return when there are four `.item` elements?', options: ['All four, in a list', 'The first one only', 'The last one only', 'An error'], answer: 1, why: 'querySelector returns the first match. Use querySelectorAll for all of them.' },
      { concept: 'query-selector', kind: 'mc', q: 'What does `document.querySelector("#missing")` return if no element has that id?', options: ['undefined', 'null', 'An empty string', 'It throws an error'], answer: 1, why: '`null`. The error only comes when you then try to use it.' },
      { concept: 'query-selector', kind: 'mc', q: 'How do you count how many items have both classes `item` and `packed`?', options: ['document.querySelector(".item.packed").length', 'document.querySelectorAll(".item.packed").length', 'document.querySelectorAll(".item .packed").count', 'document.count(".packed")'], answer: 1, why: 'querySelectorAll returns a NodeList, which has `.length`. No space between the two classes.' },
      { concept: 'query-selector', kind: 'mc', q: "The console shows this when the page loads. The line it points at is `btn.addEventListener('click', go)`. What is null?", code: "Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')\n    at app.js:3:5\n\n// app.js\n// 1  const btn = document.querySelector('#start')\n// 2\n// 3  btn.addEventListener('click', go)", options: ["go: the function was never defined", "addEventListener: the browser removed it", "btn: querySelector found nothing that matches #start", "click: the event name is misspelled"], answer: 2, why: "'Cannot read properties of null' means the thing before the dot is null. querySelector returns null when nothing matches: check the id, and that the script runs after the element exists." },
      { concept: 'reference-error', kind: 'mc', q: "The console shows this. What does it mean?", code: "Uncaught ReferenceError: score is not defined\n    at app.js:7:13", options: ["Line 7 uses a name, score, that no code has created in that scope", "Line 7 divides by zero", "The variable score is null", "The page has not finished loading"], answer: 0, why: "ReferenceError means the name doesn't exist where it was used: a typo, a missing let/const, or a variable declared in another scope." },
      { concept: "dom", kind: "mc", q: "In `<body><ul><li>Rope</li></ul></body>`, what is the `<ul>` to the `<li>`?", options: ["Its child", "Its parent", "Its sibling", "Unrelated"], answer: 1, why: "The DOM is a tree. The li sits inside the ul, so the ul is its parent and the li is its child." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '8-6', type: 'learn', mode: 'phone', xp: 35, mins: 53,
    title: 'Events and forms',
    teaches: ['events', 'forms', 'event-bubbling'],
    idea: [
      { h: 'Events', b: 'So far your scripts run once, as the page loads. Real pages wait for people: a tap, a key press, a form being sent. An **event** is the browser reporting that something just happened. `addEventListener` tells the browser which function to run when an event happens on an element.' },
      { h: 'Forms', b: 'A **form** is how a page collects input: a name, an email, a new item for a list. With the right HTML (a `<label>` for every input, the right `type`), a form already works for everyone, on every keyboard, before you write any JavaScript.' },
      { h: "Under the hood: clicks travel up the tree", b: "When you click an element, the click doesn't stay there. It fires on that element, then on its parent, then its parent's parent, all the way up to the document. That's **event bubbling**.\n\nIt lets one listener handle a whole list: put a single click listener on the `<ul>` and check `e.target` to see which item was clicked. It keeps working for items you add later, too. `e.stopPropagation()` stops the event climbing any further." },
    ],
    example: {
      intro: 'The real-world pattern: a labelled form, a submit listener, and a click listener. Tap through it.',
      lang: 'html',
      code: '<form id="signup">\n  <label for="climber">Climber name</label>\n  <input id="climber" required>\n  <button type="submit">Join the team</button>\n</form>\n<p id="welcome"></p>\n<button type="button" id="wave">Wave</button>\n<script>\n  const form = document.querySelector("#signup")\n  form.addEventListener("submit", event => {\n    event.preventDefault()\n    const climber = document.querySelector("#climber").value\n    document.querySelector("#welcome").textContent = `Welcome, ${climber}!`\n  })\n  document.querySelector("#wave").addEventListener("click", () => {\n    console.log("Waving from Camp III")\n  })\n</script>',
      steps: [
        { line: 1, note: 'A `<form>` wraps the fields. Pressing Enter in a field, or tapping the submit button, fires its `submit` event.' },
        { line: 2, note: 'The `<label>`\'s `for` matches the input\'s `id`. Tapping the label focuses the box, and screen readers read "Climber name."' },
        { line: 3, note: '`required`: the browser refuses to submit an empty box and shows a message, before your code even runs.' },
        { line: 4, note: 'A submit button. (Inside a form, a `<button>` with no type is a submit button too.)' },
        { line: 7, note: '`type="button"` means "just a button": it does nothing until JavaScript says so.' },
        { line: 10, note: 'Listen for `submit` on the FORM. You pass a function; the browser calls it later, every time the form is sent.' },
        { line: 11, note: 'By default, submitting reloads the page. `preventDefault()` stops that so your code can handle it.' },
        { line: 12, note: 'Read `.value` INSIDE the handler, at the moment of submitting. It\'s always a string.' },
        { line: 13, note: 'Show the result with `textContent` (safe for user-typed text) and a template literal.' },
        { line: 15, note: 'A click listener on the plain button. Clicks, taps, and Enter/Space on the focused button all fire `click`.' },
      ],
    },
    tryit: {
      kind: 'web',
      prompt: 'Make the radio room page work:\n1. Wrap the name box and the Join button in `<form id="signup">` … `</form>`\n2. Inside the form, add a label right before the `<input>`: `<label for="climber">Climber name</label>`\n3. When `#call` is clicked, set the text of `#log` to `Base Camp, this is Camp III. Over.`\n4. Listen for `submit` on the FORM. Call `event.preventDefault()` first, then read the value of `#climber` (inside the handler!) and set `#welcome` to `Welcome to Camp III, ` + the name + `!`\n\nThe box starts with the value `Climber`, so the Sherpa expects `Welcome to Camp III, Climber!`. Try typing your own name and pressing Enter in the box too: a form submits on Enter as well as on the button.',
      starter: `${PAGE_HEAD('Radio room')}
<body>
  <h1>Radio room</h1>
  <button type="button" id="call">Call Base Camp</button>
  <p id="log">No calls yet.</p>

  <input id="climber" value="Climber">
  <button type="submit" id="join">Join</button>
  <p id="welcome"></p>

  <script>
    // Your JavaScript goes here

  </script>
</body>
</html>`,
      hints: [
        'The call button: `document.querySelector("#call").addEventListener("click", () => { … })`. Inside, set `document.querySelector("#log").textContent = "Base Camp, this is Camp III. Over."`',
        'The form:\n```\ndocument.querySelector("#signup").addEventListener("submit", event => {\n  event.preventDefault()\n  const who = document.querySelector("#climber").value\n  document.querySelector("#welcome").textContent = `Welcome to Camp III, ${who}!`\n})\n```\nWithout `preventDefault()` the page reloads and your message vanishes.',
      ],
      checks: [
        { label: 'The name box sits inside `<form id="signup">`', selector: 'form#signup #climber', exists: true },
        { label: 'The Join button is inside the form too', selector: 'form#signup #join', exists: true },
        { label: 'The name box has a `<label for="climber">`', selector: 'label[for="climber"]', exists: true },
        { label: 'Before any click, the log still says `No calls yet.`', selector: '#log', text: 'No calls yet.' },
        { label: 'Clicking `#call` updates the log', click: '#call', selector: '#log', text: 'Base Camp, this is Camp III. Over.' },
        { label: 'Submitting the form shows `Welcome to Camp III, Climber!` (and the page didn\'t reload)', click: '#join', selector: '#welcome', text: 'Welcome to Camp III, Climber!' },
      ],
    },
    mistakes: [
      { wrong: 'btn.addEventListener("click", call())', result: '(call runs once as the page loads, then clicks do nothing)', why: 'The brackets run the function right away. Pass the function itself: `addEventListener("click", call)`.' },
      { wrong: 'btn.addEventListener("onclick", call)', result: '(nothing ever happens, and there\'s no error)', why: 'The event is named `"click"`. A misspelled event name is accepted silently and simply never fires.' },
      { wrong: 'const who = input.value   (at the top of the script, outside the handler)', result: '(the welcome always shows the starting value, never what was typed)', why: 'That line ran once at load. Read `.value` inside the handler.' },
      { wrong: 'form.addEventListener("submit", e => { welcome.textContent = "Hi" })', result: '(the text flashes for a moment, then the page reloads and it\'s gone)', why: 'The form really submitted. Call `e.preventDefault()` first.' },
      { wrong: '<input id="email" placeholder="Email">  (no label)', result: '(screen readers may announce just "edit text"; the hint vanishes once you type)', why: 'A placeholder is not a label. Add `<label for="email">Email</label>`.' },
    ],
    recap: [
      '`el.addEventListener("click", fn)` runs `fn` every time the event happens. Pass the function, don\'t call it.',
      'Common events: `click`, `input` (each keystroke), `change`, `submit` (on the form), `keydown`.',
      'The handler receives an event object: `e.target` is the element, `e.preventDefault()` cancels the default action.',
      'Forms: `<form>`, a `<label for>` for every `<input id>`, the right `type`, a submit button. Placeholders are not labels.',
      'Read `input.value` inside the handler. It\'s always a string. Browser validation is a convenience; servers must check again.',
      "**Event bubbling:** a click fires on the element, then on each parent up the tree, so one listener on a list can handle every item.",
    ],
    questions: [
      { concept: 'events', kind: 'mc', q: 'Which line makes `pack` run every time the button is clicked?', options: ['btn.addEventListener("click", pack())', 'btn.addEventListener("click", pack)', 'btn.addEventListener(click, pack)', 'btn.click = pack()'], answer: 1, why: 'Pass the function itself. `pack()` would run it once, immediately.' },
      { concept: 'events', kind: 'mc', q: 'A focused `<button>` and the user presses Enter. What fires?', options: ['Nothing; buttons only respond to mice', 'A click event, just like a mouse click', 'A keypress event only, never a click', 'A keydown on the body only'], answer: 1, why: 'Real buttons turn Enter and Space into clicks, which is free keyboard support.' },
      { concept: 'events', kind: 'mc', q: 'Which event fires on every keystroke in a text box?', options: ['click', 'submit', 'input', 'change'], answer: 2, why: '`input` fires each time the value changes. `change` waits until you leave the box.' },
      { concept: 'events', kind: 'mc', q: 'In a handler, what is `e.target`?', options: ['The function itself', 'The element the event happened on', 'The name of the event, like "click"', 'The parent of the element'], answer: 1, why: 'The event object tells you where it happened.' },
      { concept: 'forms', kind: 'mc', q: 'Your submit handler shows a message, then the page reloads and it vanishes. What\'s missing?', options: ['event.stopPropagation()', 'event.preventDefault()', 'A second listener', 'A `required` attribute'], answer: 1, why: 'Submitting reloads the page by default. preventDefault stops it.' },
      { concept: 'forms', kind: 'mc', q: 'How do you connect a label to `<input id="email">`?', options: ['<label name="email">', '<label for="email">', '<label id="email">', '<label href="email">'], answer: 1, why: 'The label\'s `for` matches the input\'s `id`.' },
      { concept: 'forms', kind: 'mc', q: 'An input with `type="number"` holds 5. What does `input.value + 1` give?', options: ['6', '"51"', 'NaN', 'An error'], answer: 1, why: '`.value` is always a string, so + glues text. Use `Number(input.value) + 1`.' },
      { concept: 'forms', kind: 'mc', q: 'Why isn\'t a `placeholder` enough on its own?', options: ['It can\'t be styled with CSS, so you can\'t match it to the design', 'It disappears once you type, is often faint, and isn\'t a reliable label for screen readers', 'It only works on `type="text"` inputs, so other field types ignore it', 'It stops the field being reached with Tab, so keyboard users skip past it'], answer: 1, why: 'Use a real `<label>`; keep placeholders for small hints.' },
      { concept: 'events', kind: 'mc', q: "You click the button and the console shows this. The HTML is `<button onclick=\"go()\">`. What do you check?", code: "Uncaught ReferenceError: go is not defined\n    at HTMLButtonElement.onclick (index.html:14:1)", options: ["That the button has an id attribute", "That click is spelled in lowercase", "That a function named go exists, and its script file loaded", "That the button is inside a form"], answer: 2, why: "The click worked and the browser tried to run go(), but found no such name. Look for a typo, or a script tag with a wrong path." },
      { concept: "event-bubbling", kind: "mc", q: "A list has 500 items, and new ones are added all the time. What's the simplest way to react to clicks on any item?", options: ["Add a listener to each item, and again for each new one", "Add one listener to the list and use `e.target` to see which item was clicked", "Use setInterval to check for clicks", "It can't be done"], answer: 1, why: "Clicks bubble up to the list, so one listener catches them all, including for items added later." },
    ],
  },

  // ───── Code reading ─────
  {
    id: '8-read', type: 'read', mode: 'phone', xp: 30, mins: 18,
    title: 'Read the route: the gear search page',
    uses: ['html-element', 'html-attribute', 'css-selector', 'dom', 'query-selector', 'events', 'accessibility'],
    intro: 'A teammate wrote one web page, `gear.html`, with a list of gear and a search box that narrows the list as you type. The styling and the script sit in the same file as the page, so read all three parts: the HTML, the `<style>` and the `<script>`. Read for what each part **does** and **why it is there**.',
    file: { name: 'gear.html', lang: 'html', code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Gear list</title>
  <style>
    body { font-family: sans-serif; max-width: 20rem; margin: 2rem auto; }
    li { padding: 0.25rem 0; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <h1>Gear list</h1>
  <label for="search">Search gear</label>
  <input id="search" type="search" placeholder="Type to filter">
  <ul id="gear">
    <li>Ice axe</li>
    <li>Crampons</li>
    <li>Rope</li>
    <li>Tent</li>
    <li>Headlamp</li>
  </ul>
  <p id="empty" class="hidden">No matches</p>

  <script>
    const search = document.querySelector("#search")
    const items = document.querySelectorAll("#gear li")
    const empty = document.querySelector("#empty")

    search.addEventListener("input", () => {
      const text = search.value.trim().toLowerCase()
      let anyShown = false

      for (const item of items) {
        const matches = item.textContent.toLowerCase().includes(text)
        item.classList.toggle("hidden", !matches)
        if (matches) {
          anyShown = true
        }
      }

      empty.classList.toggle("hidden", anyShown)
    })
  </script>
</body>
</html>` },
    questions: [
      { concept: 'dom', kind: 'mc', q: 'In one sentence, what does this page do?', options: ['Shows a list of gear and sorts it alphabetically as the visitor types', 'Shows a list of gear and a search box; as the visitor types, items that do not contain the text are hidden, and No matches appears if none are left', 'Sends the search text to a server and shows the results that come back', 'Lets the visitor add new gear to the list by typing it'], answer: 1, why: 'The label, the input, the list and the hidden message in the HTML, plus the script, all serve one job: filtering the list as the visitor types.' },
      { concept: 'events', kind: 'mc', q: 'Explain lines 30 to 43 in plain English.', options: ['When the page loads, it hides every item and shows No matches', 'When the visitor presses Enter, it adds the typed text to the list', 'Each time the visitor types, it sorts the list so matches come first', 'Each time the visitor types, it hides the gear items that do not contain the text and shows No matches only if every item ended up hidden'], answer: 3, why: 'The listener runs on every keystroke. The loop shows or hides each item, and the last line shows or hides the message.' },
      { concept: 'html-attribute', kind: 'mc', q: 'The paragraph on line 23 is on the page from the start, yet nobody sees it at first. Why?', options: ['Its `hidden` class has `display: none` (line 9), and the script only removes that class when nothing matches', 'It is empty until the script fills it in', 'Paragraphs stay invisible until a script runs', 'It comes after the list, so it is off the screen'], answer: 0, why: 'The text is already written in the HTML. The `class="hidden"` attribute is what hides it, and the script adds or removes that class.' },
      { concept: 'events', kind: 'mc', q: 'Why does line 30 listen for `"input"` rather than waiting for a button press?', options: ['Because `"input"` is the only event an input box can have', 'So the page reloads after each letter', 'So the list updates on every keystroke as the visitor types; there is no button or form to submit', 'So the search runs only once, when the page opens'], answer: 2, why: 'The `input` event fires every time the box\'s value changes. This page has no button, so nothing else would trigger the filter.' },
      { concept: 'dom', kind: 'mc', q: 'What is the loop on lines 34 to 40 there for, from the visitor\'s point of view?', options: ['It adds a new item to the list for each letter typed', 'It shows the items one after another, like an animation', 'It sorts the items so the matches come first', 'It checks every gear item against what was typed and hides the ones that do not match'], answer: 3, why: 'For each item, `matches` says whether its text contains what was typed, and `classList.toggle` hides or shows the item.' },
      { concept: 'html-element', kind: 'mc', q: 'The No matches message should say Nothing found instead. Which line do you change?', options: ['Line 42', 'Line 23', 'Line 9', 'Line 28'], answer: 1, why: 'The words are written in the paragraph on line 23. Line 28 only finds that paragraph, and line 42 shows or hides it.' },
      { concept: 'query-selector', kind: 'mc', q: 'The page needs a new searchable item, Stove. Where does that change belong?', options: ['Add an `<li>Stove</li>` inside the `<ul>`; the script collects every `li` in it, so the script needs no change', 'Add the word Stove to the `includes` call on line 35', 'Add a new `querySelector` for Stove in the script', 'Add a new `.hidden` rule in the style block for Stove'], answer: 0, why: 'Line 27 picks up every `li` inside `#gear` whenever the page loads, so a new item in the HTML is searched automatically.' },
      { concept: 'css-selector', kind: 'mc', q: 'A teammate deletes the `.hidden` rule on line 9. What goes wrong for visitors?', options: ['The page shows an error and stays blank', 'The search box stops accepting letters', 'Nothing ever disappears: items that do not match stay in view and No matches is visible from the start', 'Matching items are hidden instead of the others'], answer: 2, why: 'The script only adds and removes the class name `hidden`. The hiding itself is that CSS rule, so without it the class does nothing.' },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '8-7', type: 'web', mode: 'phone', xp: 45, mins: 25,
    title: 'Ice-axe drill: fix an inaccessible page',
    uses: ['accessibility', 'page-structure', 'html-attribute', 'forms'],
    prompt: 'This trail report looks fine, but screen reader and keyboard users can barely use it. Fix it:\n1. Add `lang="en"` to `<html>`\n2. The page title is a `div.big`. Make it a real `<h1>` (keep the text exactly)\n3. Wrap the report content (the image, the paragraph and the sign-up bits) in a `<main>`\n4. Give the image a meaningful `alt`\n5. The email box has no label. Add `<label for="email">`…`</label>` with text that includes `Email`\n6. The "Subscribe" fake button is a `div.btn`. Replace it with a real `<button type="button">` (keep the `onclick`)',
    starter: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Trail report</title>
  <style>
    .big { font-size: 2em; font-weight: bold; }
    .btn { display: inline-block; padding: 8px 16px; background: #1565c0; color: white; }
  </style>
</head>
<body>
  <div class="big">Camp III trail report</div>
  <img src="ridge.jpg">
  <p>Fixed ropes are in place up the Lhotse Face.</p>
  Email for updates: <input type="email" id="email">
  <div class="btn" onclick="alert('Subscribed')">Subscribe</div>
</body>
</html>`,
    hints: [
      'Start at the top: `<html lang="en">`, then `<h1>Camp III trail report</h1>`. Put `<main>` before the image and `</main>` after the subscribe button.',
      'Replace `Email for updates:` with `<label for="email">Email for updates</label>`. The button: `<button type="button" onclick="alert(\'Subscribed\')">Subscribe</button>`.',
    ],
    checks: [
      { label: '`<html lang="en">`', selector: 'html', attr: { name: 'lang', value: 'en' } },
      { label: 'A real `<h1>` with the title', selector: 'h1', text: 'Camp III trail report' },
      { label: 'A `<main>` holds the image', selector: 'main img', exists: true },
      { label: 'The image has a meaningful (non-empty) `alt`', selector: 'img[alt]:not([alt=""])', exists: true },
      { label: 'The email box has a `<label for="email">`', selector: 'label[for="email"]', contains: 'Email' },
      { label: 'A real `<button>` that says `Subscribe`', selector: 'main button', text: 'Subscribe' },
      { label: 'The fake `div.btn` is gone', selector: 'div.btn', exists: false },
    ],
  },
  {
    id: '8-8', type: 'web', mode: 'phone', xp: 45, mins: 25,
    title: 'Ice-axe drill: style the gear card',
    uses: ['css', 'css-selector', 'box-model', 'flexbox'],
    prompt: 'Style the summit pack card. Follow the numbered comments in the `<style>` element:\n1. `.card`: `box-sizing: border-box`, `width: 300px`, `16px` padding, and a `2px solid #2e7d32` border\n2. `.card h2`: colour `#1565c0`\n3. `.gear`: a flex row that wraps, with an `8px` gap\n4. `.gear li`: `8px` of padding',
    starter: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gear card</title>
  <style>
    .gear { list-style: none; padding: 0; }
    .gear li { background: #e8f5e9; }

    /* 1. .card: border-box sizing, 300px wide, 16px padding,
          a 2px solid #2e7d32 border */
    /* 2. .card h2: colour #1565c0 */
    /* 3. .gear: a flex row that wraps, with an 8px gap */
    /* 4. .gear li: 8px of padding */

  </style>
</head>
<body>
  <div class="card">
    <h2>Summit pack</h2>
    <ul class="gear">
      <li>Rope</li>
      <li>Ice axe</li>
      <li>Crampons</li>
      <li>Headlamp</li>
    </ul>
  </div>
</body>
</html>`,
    hints: [
      'You can add declarations to the existing `.gear` and `.gear li` rules, or write new rules below. Both work: later rules add to earlier ones.',
      '`.card { box-sizing: border-box; width: 300px; padding: 16px; border: 2px solid #2e7d32; }` · `.gear { display: flex; flex-wrap: wrap; gap: 8px; }`',
    ],
    checks: [
      { label: '`.card` uses `border-box`', selector: '.card', style: { prop: 'box-sizing', value: 'border-box' } },
      { label: '`.card` is `300px` wide', selector: '.card', style: { prop: 'width', value: '300px' } },
      { label: '`.card` has `16px` padding', selector: '.card', style: { prop: 'padding-left', value: '16px' } },
      { label: '`.card` border is `2px solid #2e7d32`', selector: '.card', style: { prop: 'border-top-color', value: 'rgb(46, 125, 50)' } },
      { label: '`.card` border is `2px` wide', selector: '.card', style: { prop: 'border-left-width', value: '2px' } },
      { label: '`.card h2` is `#1565c0`', selector: '.card h2', style: { prop: 'color', value: 'rgb(21, 101, 192)' } },
      { label: '`.gear` is a flex container', selector: '.gear', style: { prop: 'display', value: 'flex' } },
      { label: '`.gear` wraps', selector: '.gear', style: { prop: 'flex-wrap', value: 'wrap' } },
      { label: '`.gear` has an `8px` gap', selector: '.gear', style: { prop: 'column-gap', value: '8px' } },
      { label: '`.gear li` has `8px` padding', selector: '.gear li', style: { prop: 'padding-top', value: '8px' } },
    ],
  },
  {
    id: '8-9', type: 'web', mode: 'phone', xp: 45, mins: 25,
    title: 'Ice-axe drill: respond to button clicks',
    uses: ['dom', 'query-selector', 'events'],
    prompt: 'Make the Camp III radio buttons work. A `calls` counter already exists.\n1. When `#call` is clicked: add 1 to `calls`, then set `#log`\'s text to `Call 1: Base Camp, this is Camp III. Over.` (with the real number: Call 2, Call 3…)\n2. When `#reset` is clicked: set `calls` back to 0, and `#log`\'s text to `Channel clear.`\n\nThe Sherpa will press the buttons in order: call, call, reset, call.',
    starter: `${PAGE_HEAD('Camp III radio')}
<body>
  <h1>Camp III radio</h1>
  <button type="button" id="call">Call Base Camp</button>
  <button type="button" id="reset">Clear channel</button>
  <p id="log">No calls yet.</p>

  <script>
    let calls = 0
    // 1. Grab #call, #reset and #log with document.querySelector
    // 2. On a #call click: calls++ then update #log's textContent
    // 3. On a #reset click: calls = 0 and update #log's textContent

  </script>
</body>
</html>`,
    hints: [
      'Grab them once at the top: `const log = document.querySelector("#log")`, and the same for the two buttons.',
      'In the call handler (a template literal, with backticks):\n```\ncalls++\nlog.textContent = `Call ${calls}: Base Camp, this is Camp III. Over.`\n```',
    ],
    checks: [
      { label: 'Before any click, the log says `No calls yet.`', selector: '#log', text: 'No calls yet.' },
      { label: 'First call: `Call 1: Base Camp, this is Camp III. Over.`', click: '#call', selector: '#log', text: 'Call 1: Base Camp, this is Camp III. Over.' },
      { label: 'Second call counts up to `Call 2`', click: '#call', selector: '#log', text: 'Call 2: Base Camp, this is Camp III. Over.' },
      { label: 'Reset shows `Channel clear.`', click: '#reset', selector: '#log', text: 'Channel clear.' },
      { label: 'After a reset, the next call is `Call 1` again', click: '#call', selector: '#log', text: 'Call 1: Base Camp, this is Camp III. Over.' },
    ],
  },
  {
    id: '8-10', type: 'keyboard', mode: 'keyboard', engine: 'web', xp: 80, mins: 90,
    title: 'Camp build: the expedition packing checklist',
    uses: ['html', 'page-structure', 'accessibility', 'css', 'flexbox', 'dom', 'query-selector', 'events', 'forms'],
    prompt: 'Build a real, working packing checklist from scratch, using everything from this camp. Ids, classes and texts must match exactly so the Sherpa can test it.\n\n**HTML**\n1. `<html lang="en">`, and the viewport `<meta>` in the head\n2. A `<header>` containing `<h1>Packing Checklist</h1>`\n3. A `<main>` containing:\n• `<p id="count">Packed: 0 of 4</p>`\n• `<ul id="gear">` with four `<li>`s. Each holds a `<button type="button" class="item" aria-pressed="false">`. Their ids and texts: `item-rope` "Rope", `item-axe` "Ice axe", `item-tent` "Tent", `item-stove` "Stove"\n• `<label for="new-item">New item</label>`, `<input id="new-item" value="Headlamp">` and `<button type="button" id="add-btn">Add</button>`\n\n**CSS**\n4. `#gear`: a flex row that wraps, with an `8px` gap (and `list-style: none; padding: 0;` to hide the bullets)\n5. `.item`: some padding and a border, so it looks like a tappable chip\n6. Packed items (`.item.packed`): background `#2e7d32`, white text, and `text-decoration: line-through` (so it isn\'t shown by colour alone). Skip CSS transitions for now: the Sherpa checks colours instantly.\n\n**JavaScript** (in a `<script>` at the end of the body)\n7. Clicking an item toggles the class `packed`, sets its `aria-pressed` to `"true"` or `"false"` to match, and updates `#count` to `Packed: X of Y` (Y = how many items there are now)\n8. Clicking `#add-btn` reads `#new-item`\'s value and adds a new `<li>` with a matching `.item` button to the list (ignore empty values), then updates the count. **New items must be clickable too.**\n\nThe Sherpa clicks: Rope, Rope again, Add, then the new item.',
    hint: 'Use one click listener on `#gear` (event delegation): `if (e.target.matches(".item"))`. Then new items work automatically. Write one `updateCount()` function and call it after every change.',
    starter: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Packing Checklist</title>
  <style>
    /* CSS goes here */

  </style>
</head>
<body>
  <!-- HTML goes here: header, main, count, list, label, input, add button -->

  <script>
    // JavaScript goes here

  </script>
</body>
</html>`,
    hints: [
      'Build it in layers and press **Preview** often: HTML first, then CSS, then JavaScript. The first dozen checks need no JavaScript at all.',
      'Count with selectors: `const packed = document.querySelectorAll(".item.packed").length` and `const total = document.querySelectorAll(".item").length`.',
      'Delegation: `document.querySelector("#gear").addEventListener("click", e => { if (!e.target.matches(".item")) return; const on = e.target.classList.toggle("packed"); e.target.setAttribute("aria-pressed", String(on)); updateCount() })`. `toggle` returns true when it added the class.',
      'Adding: `const li = document.createElement("li")`, `const btn = document.createElement("button")`, set `btn.type = "button"`, `btn.className = "item"`, `btn.setAttribute("aria-pressed", "false")`, `btn.textContent = value`, then `li.append(btn)` and append the li to `#gear`.',
    ],
    steps: [],
    checks: [
      { label: '`<html lang="en">`', selector: 'html', attr: { name: 'lang', value: 'en' } },
      { label: 'A viewport `<meta>` tag', selector: 'meta[name="viewport"]', exists: true },
      { label: 'A `<header>` with `<h1>Packing Checklist</h1>`', selector: 'header h1', text: 'Packing Checklist' },
      { label: 'A `<main>` holding the list', selector: 'main #gear', exists: true },
      { label: 'Four `.item` buttons in `#gear`', selector: '#gear li button.item', count: 4 },
      { label: '`#item-rope` says `Rope`', selector: '#item-rope', text: 'Rope' },
      { label: 'Items start with `aria-pressed="false"`', selector: '#item-tent', attr: { name: 'aria-pressed', value: 'false' } },
      { label: 'The new-item box has a `<label for="new-item">`', selector: 'label[for="new-item"]', exists: true },
      { label: '`#gear` is a flex container', selector: '#gear', style: { prop: 'display', value: 'flex' } },
      { label: '`#gear` wraps', selector: '#gear', style: { prop: 'flex-wrap', value: 'wrap' } },
      { label: '`#gear` has an `8px` gap', selector: '#gear', style: { prop: 'column-gap', value: '8px' } },
      { label: '`#count` starts at `Packed: 0 of 4`', selector: '#count', text: 'Packed: 0 of 4' },
      { label: 'Click Rope: the count says `Packed: 1 of 4`', click: '#item-rope', selector: '#count', text: 'Packed: 1 of 4' },
      { label: 'Rope now has `aria-pressed="true"`', selector: '#item-rope', attr: { name: 'aria-pressed', value: 'true' } },
      { label: 'Packed Rope has the `#2e7d32` background', selector: '#item-rope', style: { prop: 'background-color', value: 'rgb(46, 125, 50)' } },
      { label: 'Packed Rope is crossed out (not colour alone)', selector: '#item-rope', style: { prop: 'text-decoration-line', value: 'line-through' } },
      { label: 'Click Rope again: it unpacks (`aria-pressed="false"`)', click: '#item-rope', selector: '#item-rope', attr: { name: 'aria-pressed', value: 'false' } },
      { label: '…and the count is back to `Packed: 0 of 4`', selector: '#count', text: 'Packed: 0 of 4' },
      { label: 'Click Add: a fifth item appears', click: '#add-btn', selector: '#gear li button.item', count: 5 },
      { label: 'The new item says `Headlamp`', selector: '#gear li:last-child .item', text: 'Headlamp' },
      { label: 'The count now says `Packed: 0 of 5`', selector: '#count', text: 'Packed: 0 of 5' },
      { label: 'The new item is clickable: `Packed: 1 of 5`', click: '#gear li:last-child .item', selector: '#count', text: 'Packed: 1 of 5' },
    ],
  },
  {
    id: '8-11', type: 'radio', mode: 'phone', xp: 40, mins: 10,
    title: 'Radio check: how a page loads and responds',
    uses: ['html', 'dom', 'css', 'events'],
    prompt: 'You open a web page and tap a button that changes some text. What actually happens, in order?',
    journal: true,
    sequence: [
      'The browser downloads the HTML file',
      'It reads the HTML top to bottom and builds the DOM tree',
      'It loads the CSS and works out each element\'s styles',
      'The script at the end of the body runs and adds a click listener',
      'The finished page is on screen, waiting for you',
      'You tap the button and the browser fires a click event',
      'Your listener changes the DOM and the screen updates',
    ],
    blanks: {
      text: 'HTML gives a page its ___, CSS gives it its ___, and JavaScript gives it ___. The browser turns HTML into a live tree called the ___. You find an element with ___ and react to taps with ___.',
      answers: ['structure', 'looks', 'behaviour', 'DOM', 'querySelector', 'addEventListener'],
      extra: ['speed', 'database', 'JSON', 'getElement', 'onTap', 'server'],
    },
  },
  {
    id: '8-12', type: 'audit', mode: 'phone', xp: 35, mins: 20,
    title: 'Weather check: judging a website-builder ad',
    primer: [
      { h: 'Judge the output, not the ad', b: 'Website builders promise a lot: "professional," "accessible," "perfect on every phone." You now have the skills to **check**. Every page a builder makes is ordinary HTML and CSS, and the devtools let you read it like any other page.\n\nA claim like "100% accessible" is testable. So test it.' },
      { h: 'The five-minute accessibility audit', b: '1. **Keyboard:** put the mouse away. Can you Tab to every link and button, see where the focus is, and press them with Enter?\n2. **Images:** inspect them. Do they have meaningful `alt` text?\n3. **Forms:** does every input have a real `<label>`?\n4. **Structure:** is there one `<h1>`, a `<main>`, sensible headings? Or a pile of `<div>`s?\n5. **Contrast and size:** is the text dark enough (at least 4.5:1)? Does the page fit a phone in device mode without scrolling sideways?' },
      { h: 'Check how you can leave', b: 'Ask what happens if you stop paying. Can you export your pages as real HTML files and host them elsewhere? A product that makes leaving hard is a **red flag**, however good its first 60 seconds feel.' },
    ],
    scenario: 'An ad: **"SiteSnap: a professional website in 60 seconds. No code. 100% accessible. Perfect on every phone. Export? Why would you ever want to leave!"**\n\nYou make a test page and open the devtools. Its HTML and CSS look like this:\n```\n<div class="header"><div class="h">Summit Tours</div></div>\n<div class="hero"><img src="IMG_2041.jpg"></div>\n<input placeholder="Email">\n<div class="btn" onclick="book()">Book now</div>\n<style>\n  .hint { color: #aaaaaa; }   /* on a white background */\n  .page { width: 1200px; }\n</style>\n```',
    questions: [
      { concept: 'devtools', kind: 'mc', q: 'How did you find out what SiteSnap really produces, without trusting the ad?', options: ['Asked the company', 'Inspected the page with the browser devtools', 'Counted the five-star reviews', 'Read the ad\'s feature list closely'], answer: 1, why: 'Any page\'s real HTML and CSS are one right-click → Inspect away.' },
      { concept: 'accessibility', kind: 'mc', q: '"Book now" is a `<div>` with an onclick. What happens for a keyboard-only user?', options: ['It works the same as a button', 'They can\'t Tab to it, and Enter does nothing, so they can\'t book', 'It only fails on phones', 'The browser converts it to a button automatically'], answer: 1, why: 'Only real interactive elements get focus and keyboard activation. It should be a `<button>`.' },
      { concept: 'accessibility', kind: 'mc', q: 'The hero image has no alt. What will many screen readers announce?', options: ['A description generated by the browser', 'Nothing at all', 'Something like "IMG underscore 2041 dot jpg, image"', 'The text of the nearest heading'], answer: 2, why: 'Without alt they often fall back to the file name. It needs a real description.' },
      { concept: 'forms', kind: 'mc', q: 'The email box only has a placeholder. What\'s the right fix?', options: ['Make the placeholder text longer', 'Add `<label for="email">Email</label>` and give the input `id="email"`', 'Move the placeholder above the box with CSS', 'Replace the placeholder with a `value` attribute'], answer: 1, why: 'Placeholders vanish when you type and aren\'t reliable labels.' },
      { concept: 'accessibility', kind: 'mc', q: '`#aaaaaa` text on white has a contrast ratio of about 2.3:1. Verdict?', options: ['Passes: any grey is fine', 'Fails: normal text needs at least 4.5:1', 'Passes for body text, fails for headings', 'Contrast doesn\'t matter on phones'], answer: 1, why: '2.3:1 is far below the 4.5:1 WCAG AA minimum. "100% accessible" is already false.' },
      { concept: 'responsive-design', kind: 'mc', q: '`.page { width: 1200px; }` and the ad says "perfect on every phone." Is that true?', options: ['Yes, phones zoom the page out automatically, so everything fits fine', 'No: on a 360px-wide phone the page scrolls sideways and content is cut off', 'Yes, as long as the phone is rotated sideways into landscape mode', 'Only on tablets; phones shrink the page to fit, so they\'re fine'], answer: 1, why: 'A fixed 1200px width can\'t fit a phone. It should be `max-width: 1200px; width: 100%;`.' },
      { concept: 'page-structure', kind: 'mc', q: 'The page is all `<div>`s: no `<h1>`, `<main>` or `<header>`. Why does that matter?', options: ['It doesn\'t matter: divs look identical to headings once you style them with CSS', 'Screen reader users can\'t jump to the main content or navigate by headings, and search engines understand less', 'Divs can\'t be styled with CSS, so the page would look plain and unstyled', 'CSS selectors stop matching div elements once a page has too many of them nested'], answer: 1, why: 'Semantic landmarks and headings are how assistive tech navigates.' },
      { concept: 'red-flags', kind: 'mc', q: '"Export? Why would you ever want to leave!" What should you conclude?', options: ['It\'s so good that no one needs to leave, which shows how happy users are', 'A lock-in red flag: if you can\'t export real HTML, your site is hostage to their pricing', 'Nothing: every builder blocks exports, so it\'s normal and not worth worrying about', 'It means the site is more secure, since your pages can\'t be copied out'], answer: 1, why: 'Ask how you leave before you join. No export = lock-in.' },
    ],
  },
  {
    id: '8-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Each wrong answer cracks the snowpack. **Three cracks and the avalanche comes down.** The Whiteout is waiting for you to slip.',
    questions: [
      { concept: 'html-element', kind: 'mc', q: 'The main heading of a page', options: ['<head>', '<h1>', '<header>', '<title>'], answer: 1 },
      { concept: 'html-attribute', kind: 'mc', q: 'Where a link goes', options: ['src', 'href', 'alt', 'link'], answer: 1 },
      { concept: 'accessibility', kind: 'mc', q: 'Words that replace an image for people who can\'t see it', options: ['title', 'src', 'alt', 'caption'], answer: 2 },
      { concept: 'css-selector', kind: 'mc', q: 'Select every element with class "card"', options: ['card', '#card', '.card', '<card>'], answer: 2 },
      { concept: 'box-model', kind: 'mc', q: 'Space inside the border', options: ['margin', 'padding', 'gap', 'outline'], answer: 1 },
      { concept: 'flexbox', kind: 'mc', q: 'Put children side by side', options: ['display: block', 'display: flex on the parent', 'float: side', 'display: flex on each child'], answer: 1 },
      { concept: 'query-selector', kind: 'mc', q: 'Find the element with id "count"', options: ['document.querySelector("count")', 'document.querySelector("#count")', 'document.querySelector(".count")', 'document.getElementById("#count")'], answer: 1 },
      { concept: 'events', kind: 'mc', q: 'Run `pack` on every click', options: ['btn.addEventListener("click", pack())', 'btn.addEventListener("click", pack)', 'btn.addEventListener("onclick", pack)', 'btn.addEventListener(pack, "click")'], answer: 1 },
    ],
  },
  {
    id: '8-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'page-structure', kind: 'mc', q: 'How many `<main>` per page?', options: ['0', '1', '2', 'one per section'], answer: 1 },
      { concept: 'css', kind: 'mc', q: 'What colour?', code: 'p { color: blue; }\np { color: green; }', options: ['blue', 'green', 'black', 'both'], answer: 1 },
      { concept: 'dom', kind: 'mc', q: 'Safe way to show text a user typed', options: ['innerHTML', 'textContent', 'document.write', 'outerHTML'], answer: 1 },
      { concept: 'forms', kind: 'mc', q: 'Stop a form reloading the page', options: ['e.stopPropagation()', 'e.preventDefault()', 'return true', 'e.stopDefault()'], answer: 1 },
      { concept: 'responsive-design', kind: 'mc', q: 'Rules only for screens 700px and wider', options: ['@media (min-width: 700px)', '@media (max-width: 700px)', '@media (width: 700px)', '@media (min-height: 700px)'], answer: 0 },
      { concept: 'devtools', kind: 'mc', q: 'Devtools edits after a reload', options: ['saved', 'gone', 'kept until cookies clear', 'saved in history'], answer: 1 },
    ],
  },
  {
    id: '8-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Camp III Ledge Warden',
    questions: [
      { concept: 'html', kind: 'mc', q: 'Which statement about HTML is true?', options: ['A missing closing tag stops the page with a SyntaxError', 'Browsers guess around mistakes, so broken HTML can look almost right', 'HTML has if/else and loops', 'HTML sets colours and fonts'], answer: 1 },
      { concept: 'html-element', kind: 'mc', q: 'What does the browser do with this?', code: '<p>Notes: <div>rope</div></p>', options: ['Keeps the div inside the paragraph and shows it as one block of text', 'Ends the paragraph before the div, and the stray </p> becomes an extra empty paragraph', 'Stops rendering at the div and shows an error message in the page', 'Drops the div and shows only the text Notes: in a paragraph'], answer: 1 },
      { concept: 'html-attribute', kind: 'mc', q: 'Two elements have `id="count"`. What does `querySelector("#count")` return?', options: ['Both', 'The first one', 'The last one', 'null'], answer: 1 },
      { concept: 'page-structure', kind: 'mc', q: 'Without `<meta charset="utf-8">`, what can go wrong?', options: ['The page refuses to load until a charset is added', 'Characters like é or — can show as junk', 'The CSS stops being applied to the page', 'Links stop working and lead nowhere'], answer: 1 },
      { concept: 'accessibility', kind: 'mc', q: 'Which removes keyboard users\' ability to see where they are?', options: ['button:focus-visible { outline: 3px solid blue; }', 'button:focus { outline: none; }', 'button { padding: 12px; }', '<html lang="en">'], answer: 1 },
      { concept: 'css-selector', kind: 'mc', q: 'Which selector wins for `<p id="x" class="note">`?', code: '.note { color: green; }\n#x { color: red; }\np { color: blue; }', options: ['green (class)', 'red (id)', 'blue (comes last)', 'black (default)'], answer: 1 },
      { concept: 'box-model', kind: 'mc', q: 'With `box-sizing: border-box`, how wide is this on screen?', code: '.card { box-sizing: border-box; width: 300px; padding: 16px; border: 2px solid; }', options: ['300px', '332px', '336px', '268px'], answer: 0 },
      { concept: 'flexbox', kind: 'mc', q: 'In a flex container with `flex-direction: column`, which property centres items horizontally?', options: ['justify-content: center', 'align-items: center', 'align-content: center', 'justify-items: center'], answer: 1 },
      { concept: 'responsive-design', kind: 'mc', q: 'A phone page scrolls sideways. The most likely cause?', options: ['Using `rem` units instead of `px` for font sizes', 'An element with a fixed width wider than the screen', 'Text set in a very large font size on a heading', 'A missing `<meta charset>` tag in the head'], answer: 1 },
      { concept: 'dom', kind: 'mc', q: 'What does this print in the console when the script is in the `<head>`?', code: '<head><script>\n  document.querySelector("#status").textContent = "Hi"\n</script></head>', options: ['Nothing; it works', 'TypeError: Cannot set properties of null (setting \'textContent\')', 'TypeError: Cannot read properties of null (reading \'textContent\')', 'ReferenceError: status is not defined'], answer: 1 },
      { concept: 'events', kind: 'mc', q: 'Why does this button do nothing when clicked?', code: 'btn.addEventListener("click", save())', options: ['The event name should be "onclick" inside addEventListener, not "click"', 'save() runs once immediately; its result (undefined) is what was attached', 'Buttons can\'t have listeners added to them from JavaScript this way', 'It needs event.preventDefault() first or the click is swallowed'], answer: 1 },
      { concept: 'forms', kind: 'mc', q: 'Your form has `required` on every field. Do you still need checks on the server?', options: ['No, the browser blocks bad input, so the server never receives any', 'Yes: browser validation can be bypassed in seconds, so the server must check too', 'Only for passwords, because every other field is already protected by required', 'Only on phones, because mobile browsers skip the required checks'], answer: 1 },
      { concept: "dns", kind: "mc", q: "Your site's server is fine, but nobody can reach `summitgear.example` by name. Opening its IP address directly works. What's the likely problem?", options: ["The HTML is broken", "DNS: the name isn't turning into the right IP address", "The CSS failed", "The browser cache is full"], answer: 1, why: "If the number works and the name doesn't, the name-to-number step is what's broken." },
      { concept: "event-bubbling", kind: "mc", q: "A click on an item inside a list runs both the item's listener and the list's. Why?", options: ["A bug in the browser", "The click bubbles up from the item to its parents", "Listeners run twice by default", "The list was clicked separately"], answer: 1, why: "Events travel up the DOM tree after firing on the element itself." },
    ],
  },
]
