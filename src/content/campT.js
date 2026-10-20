// The approach trek (before Camp 1): Lukla airport (2,860 m) up the Khumbu valley to Base
// Camp (5,364 m). Short and playful: the player's first code moves the climber, a first bug
// gets fixed, and a radio check covers how code runs and how a bug gets fixed. It teaches no Field Guide
// concepts, so nothing later depends on it, and players who already started are treated as
// having walked it (see trekWalked in progress.js).
export const campT = [
  {
    id: 'T-1', type: 'route', mode: 'phone', xp: 15, mins: 4,
    title: 'Lukla airstrip: your first instructions',
    prompt: 'Welcome to Lukla! Before the climb, a secret: **code is just a list of instructions, and the computer follows them exactly, top to bottom.**\n\nEach `up()` moves your climber one step up the trail. The code below already has two. Press **Run the route** and watch. The flag is **3 steps** up, so the climber stops short. Add one more `up()` line and run it again.',
    map: ['F', '.', '.', 'S'],
    starter: '// The climber follows these, top to bottom\nup()\nup()\n',
    hints: [
      'The computer doesn\'t guess what you meant: two `up()` lines means exactly two steps. Add a third `up()` on a new line.',
      '```\nup()\nup()\nup()\n```',
    ],
  },
  {
    id: 'T-2', type: 'route', mode: 'phone', xp: 15, mins: 5,
    title: 'Phakding: around the rocks',
    prompt: 'The trail bends around boulders 🪨. Walking into one stops your climber, so **the order of your steps matters**.\n\nYou have four moves: `up()`, `down()`, `left()` and `right()`. Each is one square. Follow the snow from the start to the flag, one line per step.',
    map: ['##.F', '##..', '##.#', '...#', 'S###'],
    starter: '// Lead the climber around the rocks to the flag.\n// One line per step, for example: up()\n\n',
    hints: [
      'From the start, the only snow is straight up. After that, the snow runs right for two squares.',
      'The whole route: up, right, right, up, up, right, up.\n```\nup()\nright()\nright()\nup()\nup()\nright()\nup()\n```',
    ],
  },
  {
    id: 'T-3', type: 'route', mode: 'phone', xp: 15, mins: 5,
    title: 'Namche Bazaar: a bug on the trail',
    prompt: 'Someone wrote this route and it has a **bug**: two lines are in the wrong order. Press **Run the route** and see where the climber bumps into a rock.\n\nThat\'s normal! Every developer\'s code goes wrong, many times a day. The skill is what you do next: **read what happened, change one thing, run it again.** Swap the lines that are out of order.',
    map: ['F.#', '#.#', '#..', '##S'],
    starter: 'up()\nup()\nleft()\nup()\nleft()\n',
    hints: [
      'The message says the climber walked into a rock going up on its second move. Look at the map: after the first `up()`, which way is the snow?',
      'After the first step up, go left before climbing again:\n```\nup()\nleft()\nup()\nup()\nleft()\n```',
    ],
  },
  {
    id: 'T-4', type: 'radio', mode: 'phone', xp: 20, mins: 5,
    title: 'Tengboche: radio check to Base Camp',
    prompt: 'You\'re nearly at Base Camp. Radio in how you fixed the buggy route at Namche, then finish the explanation of how code runs.',
    sequence: [
      'Write the instructions, one per line',
      'Press Run: the computer follows them from top to bottom',
      'The climber walks into a rock and stops',
      'Read the message to see which move hit the rock',
      'Find the line in your code that made that move',
      'Change one thing: swap the lines that are out of order',
      'Run it again and check the climber reaches the flag',
    ],
    blanks: {
      text: 'Code is a list of ___ that the computer follows exactly, from ___ to bottom. If two lines are in the wrong ___, the climber walks into a rock. A mistake like that in code is called a ___. To fix it, read what happened, change ___ thing, then run it again.',
      answers: ['instructions', 'top', 'order', 'bug', 'one'],
      extra: ['wishes', 'middle', 'colour', 'yeti', 'every'],
    },
  },
]
