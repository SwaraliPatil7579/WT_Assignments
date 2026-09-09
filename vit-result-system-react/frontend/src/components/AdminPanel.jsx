import { useState, useEffect } from 'react';
import { createStudent, saveMarks, getSubjects } from '../api/api';
import { weightedMse, weightedEse, totalMarks, gradeFor, isPass } from '../utils/gradeCalculator';

export default function AdminPanel({ onStudentCreated, onMarksUpdated, addToast }) {
  /* ── Student Registration Form ── */
  const [stuForm, setStuForm] = useState({
    regNo: '',
    name: '',
    branch: 'Computer Science and Engineering',
    semester: 3,
  });
  const [stuMsg, setStuMsg] = useState(null);
  const [stuSubmitting, setStuSubmitting] = useState(false);

  /* ── Marks Entry Form ── */
  const [subjects, setSubjects] = useState([]);
  const [marksForm, setMarksForm] = useState({
    regNo: '',
    subjectCode: '',
    mseMarks: '',
    eseMarks: '',
  });
  const [marksMsg, setMarksMsg] = useState(null);
  const [marksSubmitting, setMarksSubmitting] = useState(false);

  /* ── Live calculation preview ── */
  const mse = parseFloat(marksForm.mseMarks) || 0;
  const ese = parseFloat(marksForm.eseMarks) || 0;
  const liveTotal = totalMarks(mse, ese);
  const liveGrade = gradeFor(liveTotal);
  const livePass = isPass(liveTotal);
  const liveMseW = weightedMse(mse);
  const liveEseW = weightedEse(ese);

  useEffect(() => {
    getSubjects().then(setSubjects).catch(() => {});
  }, []);

  /* ── Register Student ── */
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setStuMsg(null);
    setStuSubmitting(true);
    try {
      const stu = await createStudent({
        regNo: stuForm.regNo.trim().toUpperCase(),
        name: stuForm.name.trim(),
        branch: stuForm.branch,
        semester: parseInt(stuForm.semester),
      });
      setStuMsg({ type: 'success', text: `Student ${stu.regNo} (${stu.name}) registered successfully!` });
      setStuForm({ regNo: '', name: '', branch: 'Computer Science and Engineering', semester: 3 });
      addToast('success', `Registered candidate ${stu.regNo}`);
      onStudentCreated?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setStuMsg({ type: 'error', text: msg });
      addToast('error', msg);
    } finally {
      setStuSubmitting(false);
    }
  };

  /* ── Save Marks ── */
  const handleMarksSubmit = async (e) => {
    e.preventDefault();
    setMarksMsg(null);
    setMarksSubmitting(true);
    try {
      await saveMarks({
        regNo: marksForm.regNo.trim().toUpperCase(),
        subjectCode: marksForm.subjectCode,
        mseMarks: parseFloat(marksForm.mseMarks),
        eseMarks: parseFloat(marksForm.eseMarks),
      });
      setMarksMsg({ type: 'success', text: `Marks saved for ${marksForm.regNo} in ${marksForm.subjectCode} (${liveTotal.toFixed(1)} / 100, Grade ${liveGrade})` });
      addToast('success', `Saved marks for ${marksForm.regNo}`);
      onMarksUpdated?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save marks.';
      setMarksMsg({ type: 'error', text: msg });
      addToast('error', msg);
    } finally {
      setMarksSubmitting(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-grid">
        {/* ── Form 1: Register Candidate ── */}
        <div className="card">
          <div className="card-header-bar">
            <div className="card-title-group">
              <h3>Register New Student</h3>
              <p>Add a student to the university registry database</p>
            </div>
            <div className="badge-pill" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--badge-bg)', color: 'var(--primary-accent)', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
              Step 1
            </div>
          </div>

          <form className="form-stack" onSubmit={handleStudentSubmit}>
            <div className="form-group">
              <label htmlFor="regNoInput">
                <span>Registration Number</span>
                <span className="sub">Unique Identifier</span>
              </label>
              <input
                id="regNoInput"
                className="input-styled"
                type="text"
                placeholder="e.g. 22BCE1055"
                value={stuForm.regNo}
                onChange={e => setStuForm({ ...stuForm, regNo: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentNameInput">
                <span>Full Name</span>
                <span className="sub">Official Record Name</span>
              </label>
              <input
                id="studentNameInput"
                className="input-styled"
                type="text"
                placeholder="e.g. Ananya Deshmukh"
                value={stuForm.name}
                onChange={e => setStuForm({ ...stuForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="branchInput">
                <span>Department / Branch</span>
              </label>
              <select
                id="branchInput"
                className="input-styled"
                value={stuForm.branch}
                onChange={e => setStuForm({ ...stuForm, branch: e.target.value })}
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="semesterInput">
                <span>Semester</span>
                <span className="sub">1 to 8</span>
              </label>
              <input
                id="semesterInput"
                className="input-styled"
                type="number"
                min="1"
                max="8"
                value={stuForm.semester}
                onChange={e => setStuForm({ ...stuForm, semester: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn--primary" disabled={stuSubmitting} id="btn-register-student">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              <span>{stuSubmitting ? 'Registering…' : 'Register Candidate'}</span>
            </button>
          </form>

          {stuMsg && (
            <div className={`form-alert ${stuMsg.type}`} style={{ marginTop: '1rem' }}>
              {stuMsg.text}
            </div>
          )}
        </div>

        {/* ── Form 2: Record / Update Marks ── */}
        <div className="card">
          <div className="card-header-bar">
            <div className="card-title-group">
              <h3>Record Examination Marks</h3>
              <p>Enter Mid-Semester and End-Semester exam evaluations</p>
            </div>
            <div className="badge-pill" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--badge-bg)', color: 'var(--primary-accent)', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
              Step 2
            </div>
          </div>

          <form className="form-stack" onSubmit={handleMarksSubmit}>
            <div className="form-group">
              <label htmlFor="marksRegNoInput">
                <span>Student Registration No.</span>
              </label>
              <input
                id="marksRegNoInput"
                className="input-styled"
                type="text"
                placeholder="e.g. 21BCE1234"
                value={marksForm.regNo}
                onChange={e => setMarksForm({ ...marksForm, regNo: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subjectSelectInput">
                <span>Select Course / Subject</span>
              </label>
              <select
                id="subjectSelectInput"
                className="input-styled"
                value={marksForm.subjectCode}
                onChange={e => setMarksForm({ ...marksForm, subjectCode: e.target.value })}
                required
              >
                <option value="">— Choose a Course —</option>
                {subjects.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code} — {s.name} ({s.credits} Credits)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="mseInput">
                  <span>MSE Marks</span>
                  <span className="sub">Max 50 (30%)</span>
                </label>
                <input
                  id="mseInput"
                  className="input-styled"
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  placeholder="0 - 50"
                  value={marksForm.mseMarks}
                  onChange={e => setMarksForm({ ...marksForm, mseMarks: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eseInput">
                  <span>ESE Marks</span>
                  <span className="sub">Max 100 (70%)</span>
                </label>
                <input
                  id="eseInput"
                  className="input-styled"
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={marksForm.eseMarks}
                  onChange={e => setMarksForm({ ...marksForm, eseMarks: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Live Evaluation Preview */}
            <div className="calc-preview-card">
              <div className="calc-preview-left">
                <span className="calc-preview-label">Live Weighted Evaluation</span>
                <span className="calc-formula-desc">
                  Scaled: {liveMseW} (MSE) + {liveEseW} (ESE)
                </span>
              </div>
              <div className="calc-preview-right">
                <span className="calc-score-big">{liveTotal.toFixed(1)} <small style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>/100</small></span>
                <span className={`grade-pill grade-${liveGrade.toLowerCase()}`} title={livePass ? 'Pass' : 'Fail'}>
                  {liveGrade}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: livePass ? 'var(--emerald-500)' : 'var(--rose-500)' }}>
                  {livePass ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn--primary" disabled={marksSubmitting} id="btn-submit-marks">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>{marksSubmitting ? 'Saving…' : 'Save & Commit Marks'}</span>
            </button>
          </form>

          {marksMsg && (
            <div className={`form-alert ${marksMsg.type}`} style={{ marginTop: '1rem' }}>
              {marksMsg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
