// Camp 3: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMP3 = {
  '3-6#5': {
    mac: [
      { q: "Your program is stuck in an infinite loop in the Mac Terminal. What do you press?", options: ["Cmd+C", "Ctrl+C", "Ctrl+S", "Esc"], answer: 1, why: "Ctrl+C (the Control key) interrupts the running program and gives you the prompt back. Cmd+C only copies selected text." },
      { q: "A program is stuck in a loop in the Mac Terminal. You select some of its output and press Cmd+C. What happens?", options: ["The program stops and you get the prompt back", "The text is copied, and the loop keeps on running", "The loop pauses until you press Enter again", "Terminal saves the program and closes the window"], answer: 1, why: "On a Mac, Cmd+C is copy. To stop the program, press Ctrl+C: the Control key, not Cmd." },
    ],
  },
  '3-av#7': {
    mac: [
      { q: "Stop a program stuck in a loop in Mac Terminal", options: ["Ctrl+C", "Cmd+C", "Ctrl+S", "Esc"], answer: 0 },
      { q: "What Cmd+C does in Mac Terminal", options: ["Copies selected text", "Stops the program", "Saves the program", "Pauses it until Enter"], answer: 0 },
    ],
  },
}
