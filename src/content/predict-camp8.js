// Predict-first stops for camp 8's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP8 = {
  '8-1': [
    { line: 5, q: 'How will the text inside `<strong>` look on the page?', options: ['Hidden', 'Bold', 'A tappable link'], answer: 1 },
    { line: 6, q: 'What text does the visitor see for this link?', options: ['https://example.com/weather', 'Nothing, links are invisible', 'Weather report'], answer: 2 },
  ],
  '8-2': [
    { line: 6, q: 'Where does the `<title>` text show up?', options: ['As the big heading on the page', 'In the browser tab', 'In the footer'], answer: 1 },
  ],
  '8-3': [
    { line: 5, q: 'With `border-box`, how wide is the whole card on screen, padding and border included?', options: ['336px', '332px', '300px'], answer: 2 },
    { line: 11, q: 'Which element does the selector `.card .note` style?', options: ['The `<div class="card">`', 'The `<p class="note">` inside the card', 'The `<h1>`'], answer: 1 },
  ],
  '8-4': [
    { line: 8, q: 'A phone screen is 400px wide. Do the rules inside this media query apply?', options: ['Yes, always', 'No, the screen is under 700px'], answer: 1 },
    { line: 11, q: 'On a wide screen with `space-between`, where do the three items end up?', options: ['Bunched together at the left', 'Spread out: one at each edge, one in the middle', 'Bunched together in the middle'], answer: 1 },
  ],
  '8-5': [
    { line: 8, q: 'After `textContent` is set, what does the paragraph read?', options: ['Waiting at Camp II', 'status', 'Camp III reached'], answer: 2 },
    { line: 14, q: 'The new `<li>` now has text, but it was never attached. Is "Tent 3" on the page yet?', options: ['No, it is only in memory', 'Yes, at the bottom of the list'], answer: 0 },
  ],
  '8-6': [
    { line: 13, q: 'The visitor types Ana and submits. What does the welcome paragraph show?', options: ['Welcome, climber!', 'Welcome, ${climber}!', 'Welcome, Ana!'], answer: 2 },
    { line: 15, q: 'Someone taps the Wave button. Where does the message appear?', options: ['In the welcome paragraph', 'On the page, under the button', 'In the browser console'], answer: 2 },
  ],
}
