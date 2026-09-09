import { useState } from 'react';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isFail = result.overallResult === 'FAIL';
  const avatarLetter = result.name ? result.name.charAt(0).toUpperCase() : 'S';
  const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const lines = [
      `=============================================`,
      `VIT PUNE - OFFICIAL SEMESTER RESULT`,
      `=============================================`,
      `Student Name:   ${result.name}`,
      `Registration:   ${result.regNo}`,
      `Branch:         ${result.branch}`,
      `Semester:       ${result.semester}`,
      `Overall SGPA:   ${result.sgpa} / 10.0`,
      `Percentage:     ${result.overallPercentage}%`,
      `Result Status:  ${result.overallResult}`,
      `---------------------------------------------`,
      `SUBJECT BREAKDOWN:`,
      ...result.subjects.map(s =>
        `• [${s.subjectCode}] ${s.subjectName} (${s.credits} cr): MSE ${s.mseMarks}/50 | ESE ${s.eseMarks}/100 | Total ${s.totalMarks}/100 | Grade: ${s.grade} (${s.gradePoint} pts)`
      ),
      `=============================================`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="grade-card" id="official-marksheet">
      {/* Official Banner Header */}
      <div className="grade-card-banner">
        <div className="grade-inst-info">
          <div className="grade-inst-logo" aria-hidden="true">VIT</div>
          <div className="grade-inst-text">
            <h3>Vishwakarma Institute of Technology, Pune</h3>
            <p>Autonomous Institute Affiliated to Savitribai Phule Pune University (SPPU)</p>
          </div>
        </div>

        <div className="grade-report-badge">
          <span className="report-type-pill">Official Semester Grade Report</span>
          <p className="report-date">Issued on: {issueDate}</p>
        </div>
      </div>

      {/* Candidate Profile Row */}
      <div className="candidate-hero-row">
        <div className="candidate-left">
          <div className="candidate-avatar-circle">{avatarLetter}</div>
          <div className="candidate-meta">
            <h2>{result.name}</h2>
            <div className="candidate-badges">
              <span className="meta-chip meta-chip--highlight">{result.regNo}</span>
              <span className="meta-chip">{result.branch}</span>
              <span className="meta-chip">Semester {result.semester}</span>
              <span className="meta-chip">Academic Year 2023-24</span>
            </div>
          </div>
        </div>

        <div className={`standing-badge${isFail ? ' fail' : ''}`}>
          <div className="standing-icon">
            <span>{isFail ? '✕' : '✓'}</span>
          </div>
          <div className="standing-text-group">
            <span className="standing-title">{result.overallResult}</span>
            <span className="standing-sub">{isFail ? 'Requirements Not Met' : 'Qualified For Advancement'}</span>
          </div>
        </div>
      </div>

      {/* KPI Scores Grid */}
      <div className="kpi-score-grid">
        <div className="kpi-item">
          <span className="kpi-item-label">Semester SGPA</span>
          <span className="kpi-item-val highlight">{result.sgpa}</span>
          <span className="kpi-item-sub">Scale of 10.0</span>
        </div>

        <div className="kpi-item">
          <span className="kpi-item-label">Percentage</span>
          <span className="kpi-item-val">{result.overallPercentage}%</span>
          <span className="kpi-item-sub">Aggregate Score</span>
        </div>

        <div className="kpi-item">
          <span className="kpi-item-label">Marks Obtained</span>
          <span className="kpi-item-val">{result.totalMarksObtained} <small style={{ fontSize: '0.9rem', color: 'var(--text-faint)' }}>/ {result.totalMaxMarks}</small></span>
          <span className="kpi-item-sub">Scaled Evaluation Total</span>
        </div>

        <div className="kpi-item">
          <span className="kpi-item-label">Courses Evaluated</span>
          <span className="kpi-item-val">{result.subjects.length}</span>
          <span className="kpi-item-sub">Registered Subjects</span>
        </div>
      </div>

      {/* Subject Evaluation Table */}
      <div className="table-wrap">
        <table className="clean-table" aria-label="Course Evaluation Table">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>Course Code</th>
              <th style={{ width: '34%' }}>Course Title</th>
              <th className="num" style={{ width: '8%' }}>Credits</th>
              <th className="num" style={{ width: '13%' }}>MSE <small>(30% scale)</small></th>
              <th className="num" style={{ width: '13%' }}>ESE <small>(70% scale)</small></th>
              <th className="num" style={{ width: '10%' }}>Total (/100)</th>
              <th className="num" style={{ width: '10%' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {result.subjects.map(s => (
              <tr key={s.subjectCode}>
                <td className="course-code">{s.subjectCode}</td>
                <td className="course-name">{s.subjectName}</td>
                <td className="num" style={{ fontWeight: 600 }}>{s.credits}</td>
                <td className="num">
                  <div className="marks-breakdown-cell">
                    <span className="marks-raw">{s.mseMarks}</span>
                    <span className="marks-scaled">({s.mseWeighted})</span>
                  </div>
                </td>
                <td className="num">
                  <div className="marks-breakdown-cell">
                    <span className="marks-raw">{s.eseMarks}</span>
                    <span className="marks-scaled">({s.eseWeighted})</span>
                  </div>
                </td>
                <td className="num" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {s.totalMarks}
                </td>
                <td className="num">
                  <span className={`grade-pill grade-${s.grade.toLowerCase()}`} title={`Grade Point: ${s.gradePoint}`}>
                    {s.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grading Scale Legend */}
      <div className="grading-legend-row">
        <span style={{ fontWeight: 600 }}>VIT Grading Scale:</span>
        <div className="legend-chips">
          <div className="legend-item"><span className="grade-pill grade-s" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>S</span> ≥90 (10 pts)</div>
          <div className="legend-item"><span className="grade-pill grade-a" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>A</span> 80–89 (9 pts)</div>
          <div className="legend-item"><span className="grade-pill grade-b" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>B</span> 70–79 (8 pts)</div>
          <div className="legend-item"><span className="grade-pill grade-c" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>C</span> 60–69 (7 pts)</div>
          <div className="legend-item"><span className="grade-pill grade-d" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>D</span> 55–59 (6 pts)</div>
          <div className="legend-item"><span className="grade-pill grade-e" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>E</span> 50–54 (5 pts)</div>
          <div className="legend-item"><span className="grade-pill grade-f" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>F</span> &lt;50 Fail (0 pts)</div>
        </div>
      </div>

      {/* Marksheet Actions Bottom Bar */}
      <div className="grade-card-actions">
        <div className="actions-left">
          <button type="button" className="btn btn--primary" onClick={handlePrint} id="print-result-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
            </svg>
            <span>Print Marksheet</span>
          </button>

          <button type="button" className="btn btn--secondary" onClick={handleCopy} id="copy-summary-btn">
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
