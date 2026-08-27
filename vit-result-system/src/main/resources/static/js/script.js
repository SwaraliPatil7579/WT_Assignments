/**
 * Vishwakarma Institute of Technology Result Portal
 * Frontend Controller & API Integration
 */

const API_BASE = "/api";

// Seeded local database for seamless offline/standalone presentation
const DEMO_SUBJECTS = [
  { code: "BCSE101", name: "Data Structures and Algorithms", credits: 4 },
  { code: "BCSE102", name: "Object Oriented Programming with Java", credits: 4 },
  { code: "BMAT101", name: "Discrete Mathematics and Graph Theory", credits: 3 },
  { code: "BCSE103", name: "Database Management Systems", credits: 4 }
];

const DEMO_STUDENTS = [
  { regNo: "21BCE1234", name: "Aarav Sharma", branch: "Computer Science and Engineering", semester: 3 },
  { regNo: "21BCE5678", name: "Diya Patel", branch: "Computer Science and Engineering", semester: 3 },
  { regNo: "21BEC9012", name: "Rohan Mehta", branch: "Electronics and Communication Engineering", semester: 3 }
];

const DEMO_MARKS = {
  "21BCE1234": [
    { subjectCode: "BCSE101", mseMarks: 45, eseMarks: 88 },
    { subjectCode: "BCSE102", mseMarks: 42, eseMarks: 91 },
    { subjectCode: "BMAT101", mseMarks: 38, eseMarks: 79 },
    { subjectCode: "BCSE103", mseMarks: 40, eseMarks: 85 }
  ],
  "21BCE5678": [
    { subjectCode: "BCSE101", mseMarks: 28, eseMarks: 55 },
    { subjectCode: "BCSE102", mseMarks: 33, eseMarks: 62 },
    { subjectCode: "BMAT101", mseMarks: 18, eseMarks: 30 },
    { subjectCode: "BCSE103", mseMarks: 30, eseMarks: 58 }
  ],
  "21BEC9012": [
    { subjectCode: "BCSE101", mseMarks: 35, eseMarks: 70 },
    { subjectCode: "BCSE102", mseMarks: 37, eseMarks: 74 },
    { subjectCode: "BMAT101", mseMarks: 32, eseMarks: 68 },
    { subjectCode: "BCSE103", mseMarks: 36, eseMarks: 72 }
  ]
};

/* ---------------- Grade Calculation Engine ---------------- */

function calculateGradeAndPoints(total) {
  if (total >= 90.0) return { grade: "S", points: 10, pass: true };
  if (total >= 80.0) return { grade: "A", points: 9, pass: true };
  if (total >= 70.0) return { grade: "B", points: 8, pass: true };
  if (total >= 60.0) return { grade: "C", points: 7, pass: true };
  if (total >= 55.0) return { grade: "D", points: 6, pass: true };
  if (total >= 50.0) return { grade: "E", points: 5, pass: true };
  return { grade: "F", points: 0, pass: false };
}

function computeLocalResult(regNo) {
  const student = DEMO_STUDENTS.find(s => s.regNo.toUpperCase() === regNo.toUpperCase());
  if (!student) return null;

  const marksList = DEMO_MARKS[student.regNo] || [];
  let totalCredits = 0;
  let totalWeightedPoints = 0;
  let totalMarksObtained = 0;
  let totalMaxMarks = 0;
  let anyFail = false;

  const subjects = DEMO_SUBJECTS.map(sub => {
    const m = marksList.find(item => item.subjectCode === sub.code) || { mseMarks: 0, eseMarks: 0 };
    const mseWeighted = (m.mseMarks / 50.0) * 30.0;
    const eseWeighted = (m.eseMarks / 100.0) * 70.0;
    const totalMarks = mseWeighted + eseWeighted;
    const { grade, points, pass } = calculateGradeAndPoints(totalMarks);

    if (!pass) anyFail = true;
    totalCredits += sub.credits;
    totalWeightedPoints += points * sub.credits;
    totalMarksObtained += totalMarks;
    totalMaxMarks += 100.0;

    return {
      subjectCode: sub.code,
      subjectName: sub.name,
      credits: sub.credits,
      mseMarks: m.mseMarks,
      eseMarks: m.eseMarks,
      mseWeighted: mseWeighted,
      eseWeighted: eseWeighted,
      totalMarks: totalMarks,
      grade: grade,
      gradePoints: points,
      pass: pass
    };
  });

  const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100.0 : 0;
  const sgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const overallResult = anyFail ? "FAIL" : "PASS";

  return {
    regNo: student.regNo,
    name: student.name,
    branch: student.branch,
    semester: student.semester,
    subjects: subjects,
    totalCredits: totalCredits,
    totalMarksObtained: totalMarksObtained,
    totalMaxMarks: totalMaxMarks,
    overallPercentage: overallPercentage,
    sgpa: sgpa,
    overallResult: overallResult
  };
}

/* ---------------- Theme Toggle & Persistence ---------------- */

const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
const themeText = document.getElementById("theme-text");

function applyTheme(theme) {
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("vit_theme", theme);
  if (theme === "light") {
    themeText.textContent = "Light";
    themeToggleBtn.title = "Switch to Dark Royal Navy theme";
  } else {
    themeText.textContent = "Dark";
    themeToggleBtn.title = "Switch to Crisp Light theme";
  }
}

const savedTheme = localStorage.getItem("vit_theme") || "dark";
applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme.toUpperCase()} theme`, "info");
});

/* ---------------- Tab Navigation ---------------- */

const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    panels.forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    const targetPanel = document.getElementById("panel-" + btn.dataset.tab);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  });
});

/* ---------------- Toast Notification ---------------- */

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  const iconSvg = type === "success" 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>`;

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(15px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ---------------- API Helpers ---------------- */

let isBackendAvailable = true;

async function apiGet(path) {
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Request failed with status ${res.status}`);
    }
    isBackendAvailable = true;
    return await res.json();
  } catch (err) {
    // If backend endpoint is unavailable (e.g. running standalone or network offline), fallback smoothly
    if (path.startsWith("/result/")) {
      const reg = decodeURIComponent(path.replace("/result/", ""));
      const local = computeLocalResult(reg);
      if (local) return local;
    } else if (path === "/subjects") {
      return DEMO_SUBJECTS;
    } else if (path === "/students") {
      return DEMO_STUDENTS;
    }
    throw err;
  }
}

async function apiPost(path, payload) {
  try {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Local simulation fallback
    if (path === "/students") {
      const existing = DEMO_STUDENTS.find(s => s.regNo.toUpperCase() === payload.regNo.toUpperCase());
      if (existing) {
        existing.name = payload.name;
        existing.branch = payload.branch;
        existing.semester = payload.semester;
      } else {
        DEMO_STUDENTS.push({
          regNo: payload.regNo,
          name: payload.name,
          branch: payload.branch,
          semester: payload.semester
        });
      }
      return payload;
    } else if (path === "/marks") {
      if (!DEMO_MARKS[payload.regNo]) DEMO_MARKS[payload.regNo] = [];
      const idx = DEMO_MARKS[payload.regNo].findIndex(m => m.subjectCode === payload.subjectCode);
      if (idx >= 0) {
        DEMO_MARKS[payload.regNo][idx] = payload;
      } else {
        DEMO_MARKS[payload.regNo].push(payload);
      }
      return payload;
    }
    throw err;
  }
}

function fmt(n) {
  return (n === null || n === undefined || isNaN(n)) ? "—" : Number(n).toFixed(2);
}

/* ---------------- Lookup & Marksheet Rendering ---------------- */

const lookupForm = document.getElementById("lookup-form");
const regNoInput = document.getElementById("regNoInput");
const lookupError = document.getElementById("lookup-error");
const lookupErrorText = document.getElementById("lookup-error-text");
const resultWrap = document.getElementById("result-wrap");
const printMarksheetBtn = document.getElementById("print-marksheet-btn");
const copySummaryBtn = document.getElementById("copy-summary-btn");

let currentResultData = null;

// Demo Chips Click Event
document.querySelectorAll(".chip-btn").forEach(chip => {
  chip.addEventListener("click", () => {
    regNoInput.value = chip.dataset.fill;
    lookupForm.requestSubmit();
  });
});

lookupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const regNo = regNoInput.value.trim().toUpperCase();
  if (!regNo) return;

  lookupError.hidden = true;
  resultWrap.hidden = true;

  const fetchBtn = document.getElementById("fetch-btn");
  const originalBtnText = fetchBtn.innerHTML;
  fetchBtn.disabled = true;
  fetchBtn.innerHTML = `<span>Searching...</span>`;

  try {
    const data = await apiGet(`/result/${encodeURIComponent(regNo)}`);
    currentResultData = data;
    renderResult(data);
    showToast(`Marksheet retrieved for ${data.name}`);
  } catch (err) {
    lookupErrorText.textContent = err.message || "Candidate record not found. Try one of the demo registration numbers.";
    lookupError.hidden = false;
    showToast("Student record not found", "error");
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.innerHTML = originalBtnText;
  }
});

function renderResult(data) {
  // Candidate Profile
  document.getElementById("stuAvatar").textContent = (data.name || "A").charAt(0).toUpperCase();
  document.getElementById("stuName").textContent = data.name;
  document.getElementById("stuReg").textContent = data.regNo;
  document.getElementById("stuBranch").textContent = data.branch || "General Engineering";
  document.getElementById("stuSem").textContent = data.semester ?? "3";
  
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const issueDateEl = document.getElementById("issueDate");
  if (issueDateEl) issueDateEl.textContent = `Issued: ${today}`;

  document.querySelectorAll(".print-date").forEach(el => el.textContent = today);

  // Subject Table
  const tbody = document.getElementById("marksBody");
  tbody.innerHTML = "";
  
  data.subjects.forEach(s => {
    const tr = document.createElement("tr");
    const gradeClass = `grade-${(s.grade || "F").toLowerCase()}`;
    
    tr.innerHTML = `
      <td><span class="subject-code-tag">${s.subjectCode}</span></td>
      <td><span class="subject-title">${s.subjectName}</span></td>
      <td class="num"><span class="credit-badge">${s.credits} Cr</span></td>
      <td class="num-cell">
        <div class="raw-and-scaled">
          <span>${fmt(s.mseMarks)} <small>/50</small></span>
          <span class="scaled-subtext">&rarr; ${fmt(s.mseWeighted)}</span>
        </div>
      </td>
      <td class="num-cell">
        <div class="raw-and-scaled">
          <span>${fmt(s.eseMarks)} <small>/100</small></span>
          <span class="scaled-subtext">&rarr; ${fmt(s.eseWeighted)}</span>
        </div>
      </td>
      <td class="num-cell" style="font-weight:700; color:var(--text-primary);">
        ${fmt(s.totalMarks)}
      </td>
      <td class="num"><span class="grade-badge ${gradeClass}">${s.grade}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // KPI Summary
  document.getElementById("sumObtained").textContent = `${fmt(data.totalMarksObtained)} / ${fmt(data.totalMaxMarks)}`;
  document.getElementById("sumPct").textContent = `${fmt(data.overallPercentage)}%`;
  document.getElementById("sumSgpa").textContent = fmt(data.sgpa);
  
  const sumResultEl = document.getElementById("sumResult");
  sumResultEl.textContent = data.overallResult;
  sumResultEl.className = `kpi-value ${data.overallResult === "PASS" ? "status-pass" : "status-fail"}`;

  const classTitleEl = document.getElementById("sumClassTitle");
  if (data.overallResult === "PASS") {
    if (data.overallPercentage >= 75) {
      classTitleEl.textContent = "First Class with Distinction";
    } else if (data.overallPercentage >= 60) {
      classTitleEl.textContent = "First Class";
    } else {
      classTitleEl.textContent = "Pass Class";
    }
  } else {
    classTitleEl.textContent = "Backlog in Course(s)";
  }

  // Official Seal
  const seal = document.getElementById("seal");
  seal.classList.remove("pass", "fail");
  seal.classList.add(data.overallResult === "PASS" ? "pass" : "fail");
  
  document.getElementById("sealIcon").textContent = data.overallResult === "PASS" ? "✓" : "✗";
  document.getElementById("sealPct").textContent = `${fmt(data.overallPercentage)}%`;
  document.getElementById("sealStatus").textContent = data.overallResult;

  resultWrap.hidden = false;
  resultWrap.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Print Marksheet Action
if (printMarksheetBtn) {
  printMarksheetBtn.addEventListener("click", () => {
    window.print();
  });
}

// Copy Summary Action
if (copySummaryBtn) {
  copySummaryBtn.addEventListener("click", () => {
    if (!currentResultData) return;
    const summary = `VIT Pune Semester Result:
Candidate: ${currentResultData.name} (${currentResultData.regNo})
Branch: ${currentResultData.branch} | Semester: ${currentResultData.semester}
Marks: ${fmt(currentResultData.totalMarksObtained)} / ${fmt(currentResultData.totalMaxMarks)} (${fmt(currentResultData.overallPercentage)}%)
SGPA: ${fmt(currentResultData.sgpa)} | Verdict: ${currentResultData.overallResult}`;

    navigator.clipboard.writeText(summary).then(() => {
      showToast("Result summary copied to clipboard!");
    }).catch(() => {
      showToast("Unable to copy to clipboard", "error");
    });
  });
}

/* ---------------- Faculty Live Calculation Preview ---------------- */

const inputMse = document.getElementById("inputMse");
const inputEse = document.getElementById("inputEse");
const calcTotalPreview = document.getElementById("calcTotalPreview");
const calcGradePreview = document.getElementById("calcGradePreview");
const calcFormulaBreakdown = document.getElementById("calcFormulaBreakdown");

function updateLivePreview() {
  const mse = parseFloat(inputMse.value) || 0;
  const ese = parseFloat(inputEse.value) || 0;

  const mseWeighted = Math.min(30, (mse / 50.0) * 30.0);
  const eseWeighted = Math.min(70, (ese / 100.0) * 70.0);
  const total = mseWeighted + eseWeighted;

  const { grade } = calculateGradeAndPoints(total);

  calcFormulaBreakdown.textContent = `MSE: ${fmt(mseWeighted)} + ESE: ${fmt(eseWeighted)}`;
  calcTotalPreview.textContent = fmt(total);

  calcGradePreview.textContent = grade;
  calcGradePreview.className = `grade-badge grade-${grade.toLowerCase()}`;
}

if (inputMse && inputEse) {
  inputMse.addEventListener("input", updateLivePreview);
  inputEse.addEventListener("input", updateLivePreview);
}

/* ---------------- Faculty Panel Data Loading & Forms ---------------- */

async function loadSubjects() {
  try {
    const subjects = await apiGet("/subjects");

    // Populate dropdown
    const select = document.getElementById("subjectSelect");
    select.innerHTML = `<option value="">-- Choose Course --</option>` + 
      subjects.map(s => `<option value="${s.code}">${s.code} &mdash; ${s.name} (${s.credits} Credits)</option>`).join("");

    // Populate curriculum table
    const body = document.getElementById("subjectsBody");
    body.innerHTML = subjects.map(s => `
      <tr>
        <td><span class="subject-code-tag">${s.code}</span></td>
        <td><span class="subject-title">${s.name}</span></td>
        <td class="num"><span class="credit-badge">${s.credits} Credits</span></td>
      </tr>
    `).join("");
  } catch (err) {
    console.error("Failed to load subjects", err);
  }
}

async function loadStudents() {
  try {
    const students = await apiGet("/students");
    const body = document.getElementById("studentsBody");
    if (!body) return;

    body.innerHTML = students.map(s => `
      <tr>
        <td><strong style="font-family:var(--font-mono); color:var(--brass-soft);">${s.regNo}</strong></td>
        <td><span class="subject-title">${s.name}</span></td>
        <td><span style="font-size:0.85rem; color:var(--text-secondary);">${s.branch || "General"}</span></td>
        <td class="num">${s.semester || 3}</td>
        <td class="num">
          <button type="button" class="btn btn--outline btn--sm" onclick="quickLookup('${s.regNo}')">View Marksheet</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error("Failed to load students", err);
  }
}

window.quickLookup = function(regNo) {
  document.getElementById("tab-lookup-btn").click();
  regNoInput.value = regNo;
  lookupForm.requestSubmit();
};

// Register Student Form
document.getElementById("student-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("student-msg");
  const payload = {
    regNo: form.regNo.value.trim().toUpperCase(),
    name: form.name.value.trim(),
    branch: form.branch.value.trim(),
    semester: Number(form.semester.value)
  };

  try {
    await apiPost("/students", payload);
    msg.textContent = `Candidate ${payload.name} (${payload.regNo}) successfully registered.`;
    msg.className = "form-alert ok";
    msg.hidden = false;
    showToast(`Candidate ${payload.regNo} registered!`);
    form.reset();
    form.branch.value = "Computer Science and Engineering";
    form.semester.value = 3;
    loadStudents();
  } catch (err) {
    msg.textContent = err.message || "Failed to register candidate";
    msg.className = "form-alert err";
    msg.hidden = false;
    showToast("Registration error", "error");
  }
});

// Record Marks Form
document.getElementById("marks-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("marks-msg");
  const payload = {
    regNo: form.regNo.value.trim().toUpperCase(),
    subjectCode: form.subjectCode.value,
    mseMarks: Number(form.mseMarks.value),
    eseMarks: Number(form.eseMarks.value)
  };

  try {
    await apiPost("/marks", payload);
    msg.textContent = `Marks updated for ${payload.regNo} in ${payload.subjectCode}.`;
    msg.className = "form-alert ok";
    msg.hidden = false;
    showToast(`Marks recorded for ${payload.regNo}!`);
    form.reset();
    updateLivePreview();
  } catch (err) {
    msg.textContent = err.message || "Failed to save marks";
    msg.className = "form-alert err";
    msg.hidden = false;
    showToast("Failed to save marks", "error");
  }
});

// Initial Load
loadSubjects();
loadStudents();
