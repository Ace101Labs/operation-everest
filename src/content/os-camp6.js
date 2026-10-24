// Camp 6: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMP6 = {
  "6-1#7": {
    mac: [
      { q: "On your Mac you're in your home folder, `/Users/deniz`, and run `node shop/report.js`. The code reads `'prices.json'`. Where does Node look?", options: ["/Users/deniz/prices.json","/Users/deniz/shop/prices.json","The folder where Node is installed","shop/ first, then /Users/deniz"], answer: 0, why: "Relative paths start from where you ran node, not where the script lives." },
      { q: "On your Mac you're in `/Users/deniz/shop` and run `node tools/save.js`. The code writes `'out.txt'`. Where does out.txt appear?", options: ["/home/deniz/shop/out.txt","/Users/deniz/shop/out.txt","/Users/deniz/shop/tools/out.txt","/Users/deniz/out.txt"], answer: 1, why: "Relative paths start from where you ran node. Mac home folders live in /Users, not /home." },
    ],
    windows: [
      { q: "In your Ubuntu (WSL) tab you're in your Linux home, `/home/deniz`, and run `node shop/report.js`. The code reads `'prices.json'`. Where does Node look?", options: ["/home/deniz/prices.json","/home/deniz/shop/prices.json","C:\\Users\\deniz\\prices.json","The folder where Node is installed"], answer: 0, why: "Relative paths start from where you ran node. WSL has its own Linux home, separate from your Windows one." },
      { q: "In WSL you're in `/mnt/c/Users/deniz/shop` and run `node tools/save.js`. The code writes `'out.txt'`. Where does out.txt appear?", options: ["/mnt/c/Users/deniz/out.txt","/mnt/c/Users/deniz/shop/out.txt","/mnt/c/Users/deniz/shop/tools/out.txt","/home/deniz/shop/out.txt"], answer: 1, why: "Relative paths start from where you ran node: here, a folder on your Windows C: drive, which WSL shows under /mnt/c." },
    ],
  },
  "6-3#11": {
    fedora: [
      { q: "Your Fedora computer doesn't have Git yet. Which command installs it?", options: ["brew install git","sudo dnf install git","sudo apt install git","sudo pacman -S git"], answer: 1, why: "Fedora installs programs with dnf. Check it worked with `git --version`." },
      { q: "On Fedora you ran `sudo dnf install git`. Which command checks that Git is installed?", options: ["git init","git status","git --version","dnf git"], answer: 2, why: "`git --version` prints the installed version. \"command not found\" means it isn't there yet." },
    ],
    arch: [
      { q: "Your Arch computer doesn't have Git yet. Which command installs it?", options: ["sudo pacman -S git","sudo apt install git","sudo dnf install git","brew install git"], answer: 0, why: "Arch installs programs with pacman, and `-S` means install. Check it worked with `git --version`." },
      { q: "On Arch you ran `sudo pacman -S git`. Which command checks that Git is installed?", options: ["git status","git --version","pacman git","git init"], answer: 1, why: "`git --version` prints the installed version. \"command not found\" means it isn't there yet." },
    ],
    mac: [
      { q: "Git isn't installed on your Mac yet, and you type `git --version` in Terminal. What happens?", options: ["Terminal quietly installs Git from the App Store for you","Terminal prints a version number for Git anyway","Terminal says Macs can't run Git and stops there","macOS offers to install its developer tools, Git included"], answer: 3, why: "macOS offers Apple's Command Line Developer Tools, which include Git. Accept, wait, then run `git --version` again." },
      { q: "Which command installs Apple's Command Line Developer Tools, which include Git, on your Mac?", options: ["xcode-select --install","sudo apt install git","git --install","brew install xcode"], answer: 0, why: "`xcode-select --install` installs Apple's developer tools, Git included. With Homebrew, `brew install git` also works." },
    ],
    windows: [
      { q: "How does this course have you install Git on Windows?", options: ["In PowerShell: run sudo apt install git there","From the Microsoft Store: search it for Git","Nothing to install: Windows already has Git","In WSL: open Ubuntu, run sudo apt install git"], answer: 3, why: "This course works inside WSL, so you install the Linux Git there with apt. (A separate Git for Windows installer exists, but you won't need it here.)" },
      { q: "You've run `wsl --install` and restarted. Where do you type `sudo apt install git`?", options: ["In the Ubuntu app (WSL)","In PowerShell as administrator","In Command Prompt","In the Run box (Win+R)"], answer: 0, why: "apt is Ubuntu's package manager, so it runs in Ubuntu. Open Ubuntu from the Start menu." },
    ],
    chromeos: [
      { q: "How do you install Git on your Chromebook?", options: ["Turn on Linux, then sudo apt install git in its terminal","Install a Git app from the Chrome Web Store instead","Type sudo apt install git into Chrome's address bar","You can't: a Chromebook has no way to run Git at all"], answer: 0, why: "Git runs in the Linux development environment, which uses apt like Debian. Turn it on in Settings, then install from its terminal." },
      { q: "Your Chromebook's Linux terminal is open. Which command installs Git?", options: ["sudo pacman -S git","sudo apt install git","sudo dnf install git","git install"], answer: 1, why: "The Linux environment is Debian, so it installs with apt." },
    ],
    phone: [
      { q: "You're learning on a phone. Where do you install real Git?", options: ["On a computer; the practice terminal here covers the basics","In the phone browser, by typing sudo apt install git","From the app store, since the GitHub app is Git itself","Nowhere: Git comes already installed on every phone"], answer: 0, why: "Real Git installs go on a computer. On a phone, the practice terminal here understands the everyday Git commands." },
      { q: "What can you do from the GitHub app or website on your phone?", options: ["Compile and run a project's code on the phone","Browse repos, read code and history, open issues","Install Git on the phone from the GitHub app","Push code from a terminal built into the phone"], answer: 1, why: "GitHub on a phone is for reading and discussing. Installing Git and pushing code happen on a computer." },
    ],
  },
}
