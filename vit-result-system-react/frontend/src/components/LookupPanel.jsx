import { useState } from 'react';

const DEMO_CANDIDATES = [
  { regNo: '21BCE1234', name: 'Aarav Sharma', tag: 'Distinction (8.80 SGPA)' },
  { regNo: '21BCE5678', name: 'Diya Patel', tag: 'Backlog in 1 Subject' },
  { regNo: '21BEC9012', name: 'Rohan Mehta', tag: 'First Class (7.50 SGPA)' },
];

export default function LookupPanel({ onSearch, loading, error }) {
  const [regNo, setRegNo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = regNo.trim();
    if (clean) onSearch(clean);
  };

  const handleChipClick = (reg) => {
    setRegNo(reg);
    onSearch(reg);
  };

  const handleClear = () => {
    setRegNo('');
  };

  return (
    <div className="card">
      <div className="lookup-hero">
        <h1 className="hero-headline">Check Semester Results</h1>
        <p className="hero-sub">
          Enter your university registration number below to view your official semester grade sheet and SGPA calculation.
        </p>
      </div>

      <div className="search-container">
        <form className="search-bar-row" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <svg className="search-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              id="student-reg-input"
              className="input-styled"
              type="text"
              placeholder="Enter Registration No. (e.g. 21BCE1234)"
              value={regNo}
              onChange={e => setRegNo(e.target.value.toUpperCase())}
              autoComplete="off"
              required
              aria-label="Student Registration Number"
            />
            {regNo && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear registration number input"
                title="Clear"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading} id="search-submit-btn">
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                <span>Searching…</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>View Result</span>
              </>
            )}
          </button>
        </form>

        <div className="demo-strip">
          <span className="demo-strip-label">Quick Demo Students:</span>
          {DEMO_CANDIDATES.map(c => (
            <button
              key={c.regNo}
              type="button"
              className="demo-chip"
              onClick={() => handleChipClick(c.regNo)}
              title={`View ${c.name}'s result`}
            >
              <span className="chip-reg">{c.regNo}</span>
              <span>—</span>
              <span>{c.name}</span>
              <span className="chip-tag">({c.tag})</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <div>
              <strong>Lookup Notice: </strong> {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
