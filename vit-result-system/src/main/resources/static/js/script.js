const API_BASE = "/api";

/* ---------------- Tabs ---------------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});

/* ---------------- Helpers ---------------- */
async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed");
  return body;
}

async function apiPost(path, payload) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed");
  return body;
}

function fmt(n) {
  return (n === null || n === undefined) ? "—" : Number(n).toFixed(2);
}

/* ---------------- Lookup panel ---------------- */
const lookupForm = document.getElementById("lookup-form");
const regNoInput = document.getElementById("regNoInput");
const lookupError = document.getElementById("lookup-error");
const resultWrap = document.getElementById("result-wrap");

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    regNoInput.value = chip.dataset.fill;
    lookupForm.requestSubmit();
  });
});

lookupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const regNo = regNoInput.value.trim();
  if (!regNo) return;

  lookupError.hidden = true;
  resultWrap.hidden = true;

  try {
    const data = await apiGet(`/result/${encodeURIComponent(regNo)}`);
    renderResult(data);
  } catch (err) {
    lookupError.textContent = err.message;
    lookupError.hidden = false;
  }
});

function renderResult(data) {
  document.getElementById("stuName").textContent = data.name;
  document.getElementById("stuReg").textContent = data.regNo;
  document.getElementById("stuBranch").textContent = data.branch || "—";
  document.getElementById("stuSem").textContent = data.semester ?? "—";

  const tbody = document.getElementById("marksBody");
  tbody.innerHTML = "";
  data.subjects.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-code">${s.subjectCode}</td>
      <td class="col-name">${s.subjectName}</td>
      <td class="num">${s.credits}</td>
      <td class="num">${fmt(s.mseMarks)} <small style="color:var(--muted)">(${fmt(s.mseWeighted)})</small></td>
      <td class="num">${fmt(s.eseMarks)} <small style="color:var(--muted)">(${fmt(s.eseWeighted)})</small></td>
      <td class="num">${fmt(s.totalMarks)}</td>
      <td class="num"><span class="grade-pill ${s.pass ? "pass" : "fail"}">${s.grade}</span></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("sumObtained").textContent = `${fmt(data.totalMarksObtained)} / ${fmt(data.totalMaxMarks)}`;
  document.getElementById("sumPct").textContent = `${fmt(data.overallPercentage)}%`;
  document.getElementById("sumSgpa").textContent = fmt(data.sgpa);
  document.getElementById("sumResult").textContent = data.overallResult;

  const seal = document.getElementById("seal");
  seal.classList.remove("pass", "fail");
  seal.classList.add(data.overallResult === "PASS" ? "pass" : "fail");
  document.getElementById("sealGrade").textContent = data.overallResult === "PASS" ? "✓" : "✗";
  document.getElementById("sealPct").textContent = `${fmt(data.overallPercentage)}%`;
  document.getElementById("sealStatus").textContent = data.overallResult;

  resultWrap.hidden = false;
}

/* ---------------- Admin panel ---------------- */
async function loadSubjects() {
  const subjects = await apiGet("/subjects");

  const select = document.getElementById("subjectSelect");
  select.innerHTML = subjects.map(s => `<option value="${s.code}">${s.code} — ${s.name}</option>`).join("");

  const body = document.getElementById("subjectsBody");
  body.innerHTML = subjects.map(s => `
    <tr>
      <td class="col-code">${s.code}</td>
      <td class="col-name">${s.name}</td>
      <td class="num">${s.credits}</td>
    </tr>
  `).join("");
}
loadSubjects().catch(() => {});

document.getElementById("student-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("student-msg");
  const payload = {
    regNo: form.regNo.value.trim(),
    name: form.name.value.trim(),
    branch: form.branch.value.trim(),
    semester: Number(form.semester.value)
  };
  try {
    await apiPost("/students", payload);
    msg.textContent = `Student ${payload.regNo} registered.`;
    msg.className = "form-msg ok";
    msg.hidden = false;
    form.reset();
    form.semester.value = 3;
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg err";
    msg.hidden = false;
  }
});

document.getElementById("marks-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("marks-msg");
  const payload = {
    regNo: form.regNo.value.trim(),
    subjectCode: form.subjectCode.value,
    mseMarks: Number(form.mseMarks.value),
    eseMarks: Number(form.eseMarks.value)
  };
  try {
    await apiPost("/marks", payload);
    msg.textContent = `Marks saved for ${payload.regNo} in ${payload.subjectCode}.`;
    msg.className = "form-msg ok";
    msg.hidden = false;
    form.reset();
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg err";
    msg.hidden = false;
  }
});
