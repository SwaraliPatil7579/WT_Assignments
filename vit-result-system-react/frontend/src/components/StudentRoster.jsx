import { useState } from 'react';

export default function StudentRoster({ students, onViewResult }) {
  const [filter, setFilter] = useState('');

  const filteredStudents = students.filter(s =>
    s.regNo.toLowerCase().includes(filter.toLowerCase()) ||
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    (s.branch && s.branch.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="card" style={{ marginTop: '1.75rem' }}>
      <div className="card-header-bar">
        <div className="card-title-group">
          <h3>Registered Candidates Roster</h3>
          <p>Total {students.length} students enrolled in the system</p>
        </div>

        <div style={{ maxWidth: '240px', width: '100%' }}>
          <input
            type="text"
            className="input-styled"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            placeholder="Search candidates…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label="Filter registered candidates"
          />
        </div>
      </div>

      <div className="table-wrap" style={{ padding: 0 }}>
        <table className="clean-table" aria-label="Student Roster">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Registration No.</th>
              <th style={{ width: '28%' }}>Student Name</th>
              <th style={{ width: '30%' }}>Department</th>
              <th className="num" style={{ width: '10%' }}>Semester</th>
              <th className="num" style={{ width: '14%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {filter ? 'No students match your filter.' : 'No students registered in the system yet.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map(s => (
                <tr key={s.regNo}>
                  <td className="course-code">{s.regNo}</td>
                  <td className="course-name">{s.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.branch}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{s.semester}</td>
                  <td className="num">
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => onViewResult(s.regNo)}
                      title={`View grade card for ${s.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '14px', height: '14px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span>View Result</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
