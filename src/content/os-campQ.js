// Camp Q: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
// Facts used here are taught in the local-model and hardware-requirements cards' `os` notes:
// Apple Silicon unified memory and Intel Macs on the CPU; WSL 2 seeing only part of the RAM
// (raised with `memory=` in .wslconfig); ChromeOS Linux with no GPU and small models; phones 1B–3B.
export const OS_CAMPQ = {
  // A sensible first model for the memory you have.
  'Q-6#5': {
    mac: [
      { q: 'A MacBook with an M-series chip has 16 GB of unified memory. Which model is the sensible first try?', options: ['A 70B model at 4-bit (about 42 GB)', 'An 8B model at 4-bit (about 4.8 GB)', 'An 8B model at 16-bit (about 19 GB)', 'A 32B model at 4-bit (about 19 GB)'], answer: 1, why: 'The GPU can use most of the unified memory, but macOS and your apps still need their share. Only the 4.8 GB one fits.' },
      { q: 'An M-series Mac has 8 GB of unified memory. Using estimate ≈ params × bits ÷ 8 × 1.2, with 4 GB kept for macOS and your apps, which model fits?', options: ['A 3B model at 4-bit (about 1.8 GB)', 'An 8B model at 4-bit (about 4.8 GB)', 'A 3B model at 16-bit (about 7.2 GB)', 'A 14B model at 4-bit (about 8.4 GB)'], answer: 0, why: 'Unified memory is still the same 8 GB. 8 − 4 leaves 4 GB for the model, and only the 1.8 GB one fits.' },
    ],
    windows: [
      { q: 'Your Windows laptop has 16 GB of RAM, but `free -h` inside WSL Ubuntu shows about 8 GB in total. Running the model in WSL, which is the sensible first try?', options: ['An 8B model at 4-bit (about 4.8 GB)', 'A 14B model at 4-bit (about 8.4 GB)', 'An 8B model at 16-bit (about 19 GB)', 'A 32B model at 4-bit (about 19 GB)'], answer: 0, why: 'WSL 2 gets only part of your RAM by default, so plan with what Linux sees. Only the 4.8 GB one fits with room to spare.' },
      { q: 'Inside WSL Ubuntu, `free -h` shows 4 GB available. Using estimate ≈ params × bits ÷ 8 × 1.2, which model fits?', options: ['A 3B model at 4-bit (about 1.8 GB)', 'An 8B model at 4-bit (about 4.8 GB)', 'A 3B model at 16-bit (about 7.2 GB)', 'A 14B model at 4-bit (about 8.4 GB)'], answer: 0, why: 'Only what WSL can see counts, not the laptop\'s total. Only the 1.8 GB one fits in 4 GB.' },
    ],
    chromeos: [
      { q: 'On your Chromebook, `free -h` in the Linux terminal shows about 6 GB available, and Linux has no GPU access. Which model is the sensible first try?', options: ['A 3B model at 4-bit (about 1.8 GB)', 'A 14B model at 4-bit (about 8.4 GB)', 'An 8B model at 16-bit (about 19 GB)', 'A 32B model at 4-bit (about 19 GB)'], answer: 0, why: 'The Linux environment gets only a share of the RAM and runs on the CPU, so start small. Only the 1.8 GB one fits.' },
      { q: 'Your Chromebook\'s Linux terminal shows 4 GB available in `free -h`. Using estimate ≈ params × bits ÷ 8 × 1.2, which model fits?', options: ['A 3B model at 4-bit (about 1.8 GB)', 'An 8B model at 4-bit (about 4.8 GB)', 'A 3B model at 16-bit (about 7.2 GB)', 'A 14B model at 4-bit (about 8.4 GB)'], answer: 0, why: 'Plan with what Linux sees, not the Chromebook\'s total. Only the 1.8 GB one fits in 4 GB.' },
    ],
    phone: [
      { q: 'Your phone has 8 GB of RAM, shared with every app. Which model is realistic in an offline model app?', options: ['A 3B model at 4-bit (about 1.8 GB)', 'A 14B model at 4-bit (about 8.4 GB)', 'An 8B model at 16-bit (about 19 GB)', 'A 70B model at 4-bit (about 42 GB)'], answer: 0, why: 'Phones share limited RAM with everything else, so only small quantized models (roughly 1B–3B) are practical.' },
      { q: 'Your phone has 8 GB of RAM. Using estimate ≈ params × bits ÷ 8 × 1.2, with 4 GB kept for the system and other apps, which model fits?', options: ['A 3B model at 4-bit (about 1.8 GB)', 'An 8B model at 4-bit (about 4.8 GB)', 'A 3B model at 16-bit (about 7.2 GB)', 'A 14B model at 4-bit (about 8.4 GB)'], answer: 0, why: '8 − 4 leaves 4 GB for the model. Only the 1.8 GB one fits.' },
    ],
  },

  // Reading the PROCESSOR column of `ollama ps`.
  'Q-6#7': {
    mac: [
      { q: 'On your M-series Mac, `ollama ps` shows `100% GPU`. What does that mean?', options: ['The whole model runs on the built-in GPU, which uses the unified memory: the fast path', 'The model runs on a separate graphics card that Ollama found plugged into the Mac', 'The GPU is fully loaded, so answers will be slow until the Mac frees some memory', 'The model runs on a cloud GPU, because Macs send heavy models to a server'], answer: 0, why: 'Apple Silicon GPUs run models through Metal and share the Mac\'s memory. 100% GPU is the fast path.' },
      { q: 'On an Intel Mac, `ollama ps` shows `100% CPU`. What does that mean?', options: ['The model runs on the processor rather than a GPU: it works, much more slowly', 'The model failed to load, and Ollama is waiting for a GPU to become free', 'The processor is overloaded, so Ollama will stop answering when it reaches its limit', 'The model runs on a cloud server, because the Mac has no GPU Ollama can use'], answer: 0, why: 'Intel Macs mostly run models on the CPU. It works; only M-series Macs get the fast GPU path.' },
    ],
    chromeos: [
      { q: 'In your Chromebook\'s Linux terminal, `ollama ps` shows `100% CPU`. What does that mean?', options: ['Linux can\'t use the GPU, so the whole model runs on the CPU: it works, more slowly', 'The model failed to load on the GPU, so its answers will be missing some knowledge', 'The CPU is overloaded, so Ollama will stop answering when it reaches its limit', 'The model runs on a cloud server, because the Chromebook has no GPU for it'], answer: 0, why: 'The Linux environment usually has no GPU access, so CPU-only is normal there. Small models keep it usable.' },
      { q: 'A model is slow on your Chromebook, and `ollama ps` shows `100% CPU`. Which change helps most?', options: ['A smaller model, like 1B–3B at 4 bits, so fewer bytes are read per token', 'The same model at 16-bit, so each token needs fewer rounds of maths', 'A bigger context window, so the model reads more of the text at once', 'A faster internet connection, so the tokens arrive from the model sooner'], answer: 0, why: 'With no GPU in the Linux environment, speed comes from reading fewer bytes per token: a smaller or more quantized model.' },
    ],
  },

  // Memory and speed, short form.
  'Q-yeti#3': {
    mac: [
      { q: 'Mostly limits tokens per second', options: ['the temperature setting', 'memory bandwidth', 'internet speed', 'the prompt wording'], answer: 1 },
      { q: 'On an M-series Mac, the GPU keeps the model\'s weights in…', options: ['unified memory, shared with the system', 'its own separate VRAM', 'the SSD, read for each token', 'a cloud server\'s memory'], answer: 0 },
    ],
  },

  // The biggest model that fits, with the memory your Linux actually sees.
  'Q-boss#10': {
    windows: [
      { q: 'On your 16 GB Windows laptop, `free -h` inside WSL Ubuntu shows 8 GB in total. Using estimate = params × bits ÷ 8 × 1.2, with 2 GB kept for Linux and your tools: what\'s the biggest of these that fits at 4-bit?', options: ['70B (42 GB)', '14B (8.4 GB)', '8B (4.8 GB)', 'None of them'], answer: 2 },
      { q: 'You added `memory=24GB` to `.wslconfig` on a 32 GB Windows laptop, and `free -h` in WSL now shows 24 GB. Using estimate = params × bits ÷ 8 × 1.2, with 4 GB kept for Linux and your tools: what\'s the biggest of these that fits at 4-bit?', options: ['70B (42 GB)', '32B (19.2 GB)', '14B (8.4 GB)', 'None of them'], answer: 1 },
    ],
    chromeos: [
      { q: 'Your Chromebook\'s Linux terminal shows 8 GB in total in `free -h`. Using estimate = params × bits ÷ 8 × 1.2, with 2 GB kept for Linux and your tools: what\'s the biggest of these that fits at 4-bit?', options: ['32B (19.2 GB)', '14B (8.4 GB)', '3B (1.8 GB)', 'None of them'], answer: 2 },
      { q: 'Your Chromebook\'s Linux terminal shows 4 GB in total in `free -h`. Using estimate = params × bits ÷ 8 × 1.2, with 2 GB kept for Linux and your tools: what\'s the biggest of these that fits at 4-bit?', options: ['14B (8.4 GB)', '8B (4.8 GB)', '1B (0.6 GB)', 'None of them'], answer: 2 },
    ],
  },
}
