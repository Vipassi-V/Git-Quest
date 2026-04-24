const app = document.getElementById("app");

let state = {
    xp: Number(localStorage.getItem("gitquestXP")) || 0,

    repo: {
        commits: [],
        branches: {
            main: null
        },
        currentBranch: "main",
        head: null,
        nextId: 1
    }
};

updateXP();

function updateXP() {
    document.getElementById("xp").textContent = state.xp;
    localStorage.setItem("gitquestXP", state.xp);
}

function gainXP(points) {
    state.xp += points;
    updateXP();
}

function createCommit(message = "Commit") {
    const id = "c" + state.repo.nextId++;

    const commit = {
        id,
        message,
        parent: state.repo.head,
        branch: state.repo.currentBranch
    };

    state.repo.commits.push(commit);

    state.repo.head = id;
    state.repo.branches[state.repo.currentBranch] = id;

    gainXP(10);
}

function createBranch(name) {
    if (!name) return;

    if (state.repo.branches[name]) {
        alert("Branch already exists.");
        return;
    }

    state.repo.branches[name] = state.repo.head;
    gainXP(8);
}

function switchBranch(name) {
    if (!state.repo.branches[name]) {
        alert("Branch does not exist.");
        return;
    }

    state.repo.currentBranch = name;
    state.repo.head = state.repo.branches[name];

    gainXP(5);
}

function mergeBranch(sourceBranch) {
    if (!state.repo.branches[sourceBranch]) {
        alert("Branch does not exist.");
        return;
    }

    const id = "c" + state.repo.nextId++;

    const commit = {
        id,
        message: "Merge " + sourceBranch,
        parent: state.repo.head,
        mergeParent: state.repo.branches[sourceBranch],
        branch: state.repo.currentBranch
    };

    state.repo.commits.push(commit);

    state.repo.head = id;
    state.repo.branches[state.repo.currentBranch] = id;

    gainXP(15);
}

function resetRepo() {
    state.repo = {
        commits: [],
        branches: {
            main: null
        },
        currentBranch: "main",
        head: null,
        nextId: 1
    };
}


function renderHome() {
    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <h1 class="hero-title">GitQuest</h1>

        <p class="hero-sub">
          Learn Git visually. Build branches, create commits,
          merge features, and understand history.
        </p>

        <div class="btn-group">
          <button class="primary" onclick="renderSandbox()">Launch Sandbox</button>
          <button class="secondary" onclick="renderBeginner()">Beginner Mode</button>
          <button class="ghost" onclick="renderAdvanced()">Advanced Mode</button>
        </div>
      </div>

      <div class="right-panel">
        <div class="card-title">Git Tree Engine Ready</div>
        <div class="card-text">
          Phase 2 now includes real commit / branch / merge logic.
        </div>

        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}

function renderBeginner() {
    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <button class="ghost back-btn" onclick="renderHome()">← Back</button>

        <h2 class="mode-title">Beginner Mode</h2>

        <p class="mode-desc">
          Learn through buttons and visual actions.
        </p>

        ${controlPanel()}
      </div>

      <div class="right-panel">
        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}

function renderAdvanced() {
    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <button class="ghost back-btn" onclick="renderHome()">← Back</button>

        <h2 class="mode-title">Advanced Mode</h2>

        <p class="mode-desc">
          Terminal parser comes in Phase 3.
        </p>

        ${controlPanel()}
      </div>

      <div class="right-panel">
        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}

function renderSandbox() {
    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <button class="ghost back-btn" onclick="renderHome()">← Back</button>

        <h2 class="mode-title">Sandbox</h2>

        <p class="mode-desc">
          Free practice with real visual Git engine.
        </p>

        ${controlPanel()}
      </div>

      <div class="right-panel">
        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}


function controlPanel() {
    return `
    <div class="btn-group">

      <button class="primary" onclick="doCommit()">Commit</button>

      <button class="secondary" onclick="doBranch()">Create Branch</button>

      <button class="ghost" onclick="doSwitch()">Switch Branch</button>

      <button class="ghost" onclick="doMerge()">Merge Branch</button>

      <button class="ghost" onclick="doReset()">Reset Repo</button>

    </div>

    <br>

    <div class="card-text">
      Current Branch: <b>${state.repo.currentBranch}</b><br>
      HEAD: <b>${state.repo.head || "None"}</b>
    </div>
  `;
}

function doCommit() {
    const msg = prompt("Commit message:", "New Commit");
    createCommit(msg || "Commit");
    rerender();
}

function doBranch() {
    const name = prompt("Branch name:", "feature");
    createBranch(name);
    rerender();
}

function doSwitch() {
    const name = prompt("Switch to branch:", "main");
    switchBranch(name);
    rerender();
}

function doMerge() {
    const name = prompt("Merge branch into current:", "feature");
    mergeBranch(name);
    rerender();
}

function doReset() {
    resetRepo();
    rerender();
}

function renderGraph() {
    const commits = state.repo.commits;

    let circles = "";
    let lines = "";
    let labels = "";

    const positions = {};

    commits.forEach((commit, index) => {
        const branchOffset = getBranchX(commit.branch);
        const x = branchOffset;
        const y = 60 + index * 90;

        positions[commit.id] = { x, y };

        if (commit.parent && positions[commit.parent]) {
            lines += `
        <line class="line"
          x1="${positions[commit.parent].x}"
          y1="${positions[commit.parent].y}"
          x2="${x}"
          y2="${y}" />
      `;
        }

        if (commit.mergeParent && positions[commit.mergeParent]) {
            lines += `
        <line class="merge-line"
          x1="${positions[commit.mergeParent].x}"
          y1="${positions[commit.mergeParent].y}"
          x2="${x}"
          y2="${y}" />
      `;
        }

        circles += `
      <circle class="node" cx="${x}" cy="${y}" r="12"></circle>
    `;

        labels += `
      <text x="${x + 20}" y="${y + 5}" fill="white">
        ${commit.id} - ${commit.message}
      </text>
    `;
    });

    return `
    <svg viewBox="0 0 700 700">
      ${lines}
      ${circles}
      ${labels}
    </svg>
  `;
}

function getBranchX(branch) {
    const names = Object.keys(state.repo.branches);
    const index = names.indexOf(branch);
    return 140 + index * 180;
}

function rerender() {
    const title = document.querySelector(".mode-title");

    if (!title) return renderHome();

    const current = title.textContent;

    if (current.includes("Beginner")) renderBeginner();
    else if (current.includes("Advanced")) renderAdvanced();
    else if (current.includes("Sandbox")) renderSandbox();
    else renderHome();
}


renderHome();
