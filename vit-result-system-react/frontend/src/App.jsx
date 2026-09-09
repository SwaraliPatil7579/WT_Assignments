import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import LookupPanel from './components/LookupPanel';
import ResultCard from './components/ResultCard';
import AdminPanel from './components/AdminPanel';
import StudentRoster from './components/StudentRoster';
import SubjectCatalog from './components/SubjectCatalog';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { getResult, getStudents, getSubjects } from './api/api';
import './App.css';

export default function App() {
  /* ── Theme ── */
  const [theme, setTheme] = useState(() => localStorage.getItem('vit-theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vit-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  /* ── Backend status ── */
  const [backendOnline, setBackendOnline] = useState(false);
  useEffect(() => {
    getSubjects()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  /* ── Active tab ── */
  const [activeTab, setActiveTab] = useState('lookup');

  /* ── Result lookup ── */
  const [result, setResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const handleSearch = useCallback(async (regNo) => {
    setLookupLoading(true);
    setLookupError('');
    setResult(null);
    try {
      const data = await getResult(regNo);
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration number not found in register.';
      setLookupError(msg);
    } finally {
      setLookupLoading(false);
    }
  }, []);

  /* ── Admin data ── */
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const refreshData = useCallback(() => {
    getStudents().then(setStudents).catch(() => {});
    getSubjects().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  /* ── View result from roster ── */
  const handleViewResult = (regNo) => {
    setActiveTab('lookup');
    handleSearch(regNo);
  };

  /* ── Toast notifications ── */
  const [toasts, setToasts] = useState([]);
  let toastId = 0;
  const addToast = (type, message) => {
    const id = Date.now() + (++toastId);
    setToasts(prev => [...prev, { id, type, message }]);
  };
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <>
      <div className="ambient-glow" aria-hidden="true"></div>
      <div className="grain" aria-hidden="true"></div>

      <Header theme={theme} onToggleTheme={toggleTheme} backendOnline={backendOnline} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        {/* ── Lookup Panel ── */}
        {activeTab === 'lookup' && (
          <section>
            <LookupPanel onSearch={handleSearch} loading={lookupLoading} error={lookupError} />

            {lookupLoading && (
              <div className="loading-box">
                <div className="spinner"></div>
                <span>Retrieving grade records from university registry…</span>
              </div>
            )}

            {result && <ResultCard result={result} />}
          </section>
        )}

        {/* ── Admin Panel ── */}
        {activeTab === 'admin' && (
          <section>
            <AdminPanel
              onStudentCreated={refreshData}
              onMarksUpdated={refreshData}
              addToast={addToast}
            />
            <StudentRoster students={students} onViewResult={handleViewResult} />
            <SubjectCatalog subjects={subjects} />
          </section>
        )}
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />
      <Footer />
    </>
  );
}
