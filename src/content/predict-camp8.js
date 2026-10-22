// Predict-first stops for camp 8's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP8 = {
  '8-1': [
    { line: 6, q: 'What is the `href` attribute for?', options: ['Telling the link where to go', 'Setting the text people tap', 'Choosing the link colour'], answer: 0 },
    { line: 7, q: 'What is the `alt` attribute on the image for?', options: ['Words used in place of the picture when it cannot be seen', 'Making the picture smaller', 'Naming the picture file'], answer: 0 },
  ],
  '8-2': [
    { line: 5, q: 'What would go wrong on a phone if line 5 were deleted?', options: ['The page would show as a shrunken desktop layout', 'The page would not load at all', 'The text would turn red'], answer: 0 },
    { line: 11, q: 'Why is the menu in a `<nav>` and not a plain `<div>`?', options: ['It tells browsers and screen readers this is the main menu', 'It makes the links bold', 'Links do not work outside a nav'], answer: 0 },
  ],
  '8-3': [
    { line: 5, q: 'What does `box-sizing: border-box` change about the card?', options: ['The width includes the padding and border', 'It removes the border', 'It rounds the corners'], answer: 0 },
    { line: 11, q: 'Which element does the selector `.card .note` style?', options: ['The `<p class="note">` inside the card', 'The card itself', 'Every paragraph on the page'], answer: 0 },
  ],
  '8-4': [
    { line: 4, q: 'Why does `display: flex` go on `.camps` and not on the `li` items?', options: ['Flex goes on the parent; its children become the flex items', 'The li items cannot be styled', 'It must go on the last rule only'], answer: 0 },
    { line: 8, q: 'What is the `@media (min-width: 700px)` block for?', options: ['Changing the layout only on wide screens', 'Loading a wider picture', 'Hiding the list on phones'], answer: 0 },
  ],
  '8-5': [
    { line: 6, q: 'Why does the `<script>` sit after the elements it uses?', options: ['The page builds from the top, so the elements must exist when the script runs', 'Scripts run faster at the bottom', 'Scripts are not allowed before HTML'], answer: 0 },
    { line: 11, q: 'What is line 11 for?', options: ['Giving every tent the class `pitched` so CSS can style it', 'Removing the tents from the page', 'Counting the tents'], answer: 0 },
  ],
  '8-6': [
    { line: 11, q: 'What would happen without `event.preventDefault()` on line 11?', options: ['The page would reload when the form is sent', 'The form could never be sent', 'The name would be lost before it is read'], answer: 0 },
    { line: 13, q: 'Where does the `climber` on line 13 come from?', options: ['Line 12, read from the input when the form is sent', 'Line 3, where the input is made', 'Line 9, where the form is found'], answer: 0 },
  ],
}
