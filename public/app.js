const app = document.getElementById("app");


let state = {
    xp: Number(localStorage.getItem("gitquestXP")) || 0,

    level: Number(localStorage.getItem("gitquestLevel")) || 1,

    unlockedAdvanced: localStorage.getItem("gitquestAdvanced") === "true",

    repo: {
        commits: [],
        branches: { main: null },
        currentBranch: "main",
        head: null,
        nextId: 1
    }
};

updateXP();


function updateXP() {
    document.getElementById("xp").textContent = state.xp;
    localStorage.setItem("gitquestXP", state.xp);
    localStorage.setItem("gitquestLevel", state.level);
}

function gainXP(amount) {
    state.xp += amount;

    // level up system
    if (state.xp > state.level * 50) {
        state.level++;
        alert("🎉 Level Up! You are now Level " + state.level);
    }

    updateXP();
}


function createCommit(message = "Commit") {
    const id = "c" + state.repo.nextId++;

    state.repo.commits.push({
        id,
        message,
        parent: state.repo.head,
        branch: state.repo.currentBranch
    });

    state.repo.head = id;
    state.repo.branches[state.repo.currentBranch] = id;

    gainXP(10);
}

function createBranch(name) {
    if (!name) return;

    state.repo.branches[name] = state.repo.head;
    gainXP(8);
}

function switchBranch(name) {
    if (!state.repo.branches[name]) {
        alert("Branch not found");
        return;
    }

    state.repo.currentBranch = name;
    state.repo.head = state.repo.branches[name];

    gainXP(5);
}

function mergeBranch(name) {
    const id = "c" + state.repo.nextId++;

    state.repo.commits.push({
        id,
        message: "Merge " + name,
        parent: state.repo.head,
        mergeParent: state.repo.branches[name],
        branch: state.repo.currentBranch
    });

    state.repo.head = id;
    state.repo.branches[state.repo.currentBranch] = id;

    gainXP(15);
}


function runCommand(input) {
    const cmd = input.trim();

    if (cmd.startsWith("git commit")) {
        const msg = cmd.match(/-m\s+"(.+?)"/);
        createCommit(msg ? msg[1] : "commit");
        return "Commit created";
    }

    if (cmd.startsWith("git branch")) {
        const name = cmd.split(" ")[2];
        createBranch(name);
        return "Branch created: " + name;
    }

    if (cmd.startsWith("git checkout")) {
        const name = cmd.split(" ")[2];
        switchBranch(name);
        return "Switched to " + name;
    }

    if (cmd.startsWith("git merge")) {
        const name = cmd.split(" ")[2];
        mergeBranch(name);
        return "Merged " + name;
    }

    return "Unknown command";
}


const lessons = [
    {
        title: "What is Git?",
        text: "Git saves versions of your project like checkpoints in a game.",
        action: "commit"
    },
    {
        title: "Your First Commit",
        text: "A commit saves your current work.",
        action: "commit"
    },
    {
        title: "Branches",
        text: "Branches let you try new ideas safely.",
        action: "branch"
    },
    {
        title: "Merging",
        text: "Merge combines two branches into one.",
        action: "merge"
    }
];

let currentLesson = 0;


function renderHome() {
    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <h1 class="hero-title">GitQuest</h1>

        <p class="hero-sub">
          Learn Git visually through interactive lessons and real commands.
        </p>

        <div class="btn-group">
          <button class="primary" onclick="startLesson()">Start Learning</button>
          <button class="secondary" onclick="renderSandbox()">Sandbox</button>
          <button class="ghost" onclick="renderAdvanced()">Advanced</button>
        </div>
      </div>

      <div class="right-panel">
        <div class="card-title">Progress System Active</div>
        <div class="card-text">
          Level: ${state.level} | XP: ${state.xp}
        </div>

        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}


function startLesson() {
    const lesson = lessons[currentLesson];

    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <h2 class="mode-title">${lesson.title}</h2>

        <p class="mode-desc">${lesson.text}</p>

        <button class="primary" onclick="doLessonAction()">
          Try Action
        </button>

        <button class="ghost" onclick="renderHome()">Exit</button>
      </div>

      <div class="right-panel">
        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}

function doLessonAction() {
    const lesson = lessons[currentLesson];

    if (lesson.action === "commit") createCommit("lesson commit");
    if (lesson.action === "branch") createBranch("feature");
    if (lesson.action === "merge") mergeBranch("feature");

    gainXP(20);

    currentLesson++;

    if (currentLesson >= lessons.length) {
        state.unlockedAdvanced = true;
        localStorage.setItem("gitquestAdvanced", "true");

        alert("🎉 Beginner Completed! Advanced Mode Unlocked!");
        renderHome();
        return;
    }

    startLesson();
}


function renderSandbox() {
    app.innerHTML = `
    <section class="screen">
      <div class="left-panel">
        <h2 class="mode-title">Sandbox Terminal</h2>

        <input id="cmd" placeholder="git commit -m \"test\"" />

        <button class="primary" onclick="executeCmd()">Run</button>

        <button class="ghost" onclick="renderHome()">Back</button>

        <div id="output" class="card-text"></div>
      </div>

      <div class="right-panel">
        <div class="graph-box">
          ${renderGraph()}
        </div>
      </div>
    </section>
  `;
}

function executeCmd() {
    const input = document.getElementById("cmd").value;
    const result = runCommand(input);

    document.getElementById("output").innerText = result;

    rerender();
}

function renderGraph() {
    let nodes = "";
    let lines = "";

    state.repo.commits.forEach((c, i) => {
        const x = 150 + i * 120;
        const y = 100;

        nodes += `<circle cx="${x}" cy="${y}" r="10" fill="#2ea043" />`;

        if (i > 0) {
            lines += `<line x1="${150 + (i - 1) * 120}" y1="100" x2="${x}" y2="100" stroke="#58a6ff"/>`;
        }
    });

    return `
    <svg viewBox="0 0 800 300">
      ${lines}
      ${nodes}
    </svg>
  `;
}


function rerender() {
    renderHome();
}


renderHome();