export default function SubjectCatalog({ subjects }) {
  return (
    <div className="card" style={{ marginTop: '1.75rem' }}>
      <div className="card-header-bar">
        <div className="card-title-group">
          <h3>Course Curriculum Catalog</h3>
          <p>Approved semester subjects and credit distribution</p>
        </div>
        <div className="badge-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: 'var(--text-muted)' }}>
          {subjects.length} Courses
        </div>
      </div>

      <div className="table-wrap" style={{ padding: 0 }}>
        <table className="clean-table" aria-label="Course Curriculum Catalog">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Course Code</th>
              <th style={{ width: '60%' }}>Course Title</th>
              <th className="num" style={{ width: '20%' }}>Credits</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Loading course catalog…
                </td>
              </tr>
            ) : (
              subjects.map(s => (
                <tr key={s.code}>
                  <td className="course-code">{s.code}</td>
                  <td className="course-name">{s.name}</td>
                  <td className="num">
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-pill)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {s.credits} Credits
                    </span>
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
