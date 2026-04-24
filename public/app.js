const app = document.getElementById("app");
let state = {
  xp: Number(localStorage.getItem("gitquestXP")) || 0
};
updateXP();

function updateXP() {
  const xpEl = document.getElementById("xp");
  if (xpEl) {
    xpEl.textContent = state.xp;
  }
  localStorage.setItem("gitquestXP", state.xp);
}

function gainXP(points) {
  state.xp += points;
  updateXP();
}

function renderHome() {
  app.innerHTML = `
    <section class="screen">
        <div class="left-panel">
            <h1 class="hero-title">GitQuest</h1>
            <p class="hero-sub">
                Learn Git and GitHub visually through interactive levels, commands, branches, merges, and challenges.
            </p>
            <div class="btn-group">
                <button class="primary" onclick="renderBeginner()">Start Learning</button>
                <button class="secondary" onclick="renderAdvanced()">Advanced Mode</button>
                <button class="ghost" onclick="renderSandbox()">Sandbox</button>
            </div>
        </div>
        <div class="right-panel">
            <div class="card-title">Live Git Tree Preview</div>
            <div class="card-text">This graph area will power your future commit visualization.</div>
            <div class="graph-box">
                ${sampleGraph()}
            </div>
        </div>
    </section>
    `;
}

function renderBeginner() {
  gainXP(5);
  app.innerHTML = `
    <section class="screen">
        <div class="left-panel">
            <button class="ghost back-btn" onclick="renderHome()">← Back</button>
            <h2 class="mode-title">Beginner Mode</h2>
            <p class="mode-desc">
                Duolingo-style guided learning with buttons and visual lessons.
            </p>
            <div class="btn-group">
                <button class="primary">Lesson 1: First Commit</button>
                <button class="ghost">Lesson 2: Branching</button>
                <button class="ghost">Lesson 3: Merge Basics</button>
            </div>
        </div>
        <div class="right-panel">
            <div class="graph-box">
                ${sampleGraph()}
            </div>
        </div>
    </section>
    `;
}

function renderAdvanced() {
  gainXP(5);
  app.innerHTML = `
    <section class="screen">
        <div class="left-panel">
            <button class="ghost back-btn" onclick="renderHome()">← Back</button>
            <h2 class="mode-title">Advanced Mode</h2>
            <p class="mode-desc">
                Use terminal-style commands to control the repository.
            </p>
            <div class="graph-box" style="height:220px;">
                <div style="font-family:monospace; color:#58a6ff;">
                    $ git commit -m "start"<br>
                    $ git branch feature<br>
                    $ git checkout feature
                </div>
            </div>
        </div>
        <div class="right-panel">
            <div class="graph-box">
                ${sampleGraph()}
            </div>
        </div>
    </section>
    `;
}

function renderSandbox() {
  gainXP(5);
  app.innerHTML = `
    <section class="screen">
        <div class="left-panel">
            <button class="ghost back-btn" onclick="renderHome()">← Back</button>
            <h2 class="mode-title">Sandbox Mode</h2>
            <p class="mode-desc">
                Free practice area. No missions. Just experiment.
            </p>
            <div class="btn-group">
                <button class="primary">Commit</button>
                <button class="secondary">Branch</button>
                <button class="ghost">Merge</button>
            </div>
        </div>
        <div class="right-panel">
            <div class="graph-box">
                ${sampleGraph()}
            </div>
        </div>
    </section>
    `;
}

function sampleGraph() {
  return `
    <svg viewBox="0 0 600 500">
        <line class="line" x1="150" y1="60" x2="150" y2="150"></line>
        <line class="line" x1="150" y1="150" x2="150" y2="240"></line>
        <line class="line" x1="150" y1="150" x2="320" y2="240"></line>
        <line class="line" x1="320" y1="240" x2="320" y2="340"></line>
        <circle class="node" cx="150" cy="60" r="12"></circle>
        <circle class="node" cx="150" cy="150" r="12"></circle>
        <circle class="node" cx="150" cy="240" r="12"></circle>
        <circle class="node" cx="320" cy="240" r="12"></circle>
        <circle class="node" cx="320" cy="340" r="12"></circle>
        <text x="175" y="65" fill="white">Initial Commit</text>
        <text x="175" y="155" fill="white">Main Update</text>
        <text x="175" y="245" fill="white">Main Progress</text>
        <text x="345" y="245" fill="white">Feature Branch</text>
        <text x="345" y="345" fill="white">Feature Commit</text>
    </svg>
    `;
}

renderHome();
