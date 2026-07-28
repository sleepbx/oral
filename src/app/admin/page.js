'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('oral_submissions');
      if (stored) {
        let parsed = JSON.parse(stored);
        // Sort by date descending
        parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSubmissions(parsed);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error(err);
      setSubmissions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to delete all patient records? This cannot be undone.')) {
      setLoading(true);
      localStorage.removeItem('oral_submissions');
      fetchSubmissions();
    }
  };

  const handleDownload = () => {
    if (submissions.length === 0) return alert('No data to download.');
    
    // Create CSV header
    const headers = [
      'ID', 'Date', 'Patient Name', 'State', 'Language', 
      'Exact Age', 'Exact Gender',
      'S1 Ulcer', 'S2 Patch', 'S3 Lump', 'S4 Difficulty', 'S5 Burning',
      'Q1 Age', 'Q2 Gender',
      'Q3 Smoke', 'Q4 Smoke Start', 'Q5 Smoke Duration', 'Q6 Smoke Qty',
      'Q7 Chew', 'Q8 Chew Start', 'Q9 Chew Duration', 'Q10 Chew Freq',
      'Q11 Alcohol',
      'Has Symptoms', 'Risk Score', 'Final Assessment'
    ];
    
    // Map rows
    const rows = submissions.map(sub => {
      const f = sub.formData || {};
      
      const safeLabel = (obj) => {
        if (!obj) return 'N/A';
        if (typeof obj === 'string') return obj;
        return obj.label || 'N/A';
      };

      return [
        `"ID-${sub.id || ''}"`,
        `"${new Date(sub.date).toLocaleDateString()}"`,
        `"${sub.name || ''}"`,
        `"${sub.state || ''}"`,
        `"${typeof sub.language === 'object' ? (sub.language?.label || sub.language?.value) : (sub.language || 'English')}"`,
        `"${f.profileAge || 'N/A'}"`,
        `"${f.profileGender || 'N/A'}"`,
        `"${safeLabel(f.ulcer)}"`,
        `"${safeLabel(f.patch)}"`,
        `"${safeLabel(f.lump)}"`,
        `"${safeLabel(f.difficulty)}"`,
        `"${safeLabel(f.burning)}"`,
        `"${safeLabel(f.age)}"`,
        `"${safeLabel(f.gender)}"`,
        `"${safeLabel(f.smoke)}"`,
        `"${safeLabel(f.smokeStart)}"`,
        `"${safeLabel(f.smokeDuration)}"`,
        `"${safeLabel(f.smokeQty)}"`,
        `"${safeLabel(f.chew)}"`,
        `"${safeLabel(f.chewStart)}"`,
        `"${safeLabel(f.chewDuration)}"`,
        `"${safeLabel(f.chewFreq)}"`,
        `"${safeLabel(f.alcohol)}"`,
        sub.hasSymptoms ? 'Yes' : 'No',
        sub.hasSymptoms ? 'Skipped (Symptoms)' : (sub.score !== null ? sub.score : 'N/A'),
        `"${sub.result || ''}"`
      ];
    });
    
    // Combine
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Download with BOM for Excel UTF-8 support
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeClass = (riskLevel) => {
    if (riskLevel === 'High Risk') return 'badge badge-high';
    if (riskLevel === 'Moderate Risk') return 'badge badge-moderate';
    return 'badge badge-low';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'riya grag' && password === 'oral@1234567890') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'var(--card-bg)', padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Login</h1>
            <p style={{ color: 'var(--text-muted)' }}>Secure access required</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            <div className="input-group">
              <label className="label">Username</label>
              <input 
                type="text" 
                className="input-field" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Login
            </button>
            <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              Return Home
            </Link>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Recent patient screenings (Offline Storage)</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleDownload} className="btn btn-outline" style={{ minHeight: '40px', padding: '0.5rem 1rem', width: 'auto', display: 'flex', gap: '0.5rem' }}>
            <span>📥</span> Export CSV
          </button>
          
          <button onClick={handleReset} className="btn" style={{ minHeight: '40px', padding: '0.5rem 1rem', width: 'auto', background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid #fecaca', display: 'flex', gap: '0.5rem' }}>
            <span>🗑️</span> Reset All
          </button>
          
          <Link href="/" className="btn btn-primary" style={{ minHeight: '40px', padding: '0.5rem 1rem', width: 'auto' }}>
            Home
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No submissions found yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>State</th>
                  <th>Lang</th>
                  <th>Stage 1 Symptoms</th>
                  <th>Risk Score</th>
                  <th>Final Assessment</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(sub.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>{sub.name}</td>
                    <td>{sub.state}</td>
                    <td>{typeof sub.language === 'object' ? (sub.language?.label || sub.language?.value) : (sub.language || 'en')}</td>
                    <td>
                      {sub.hasSymptoms ? (
                        <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Reported</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>
                    <td>
                      {sub.hasSymptoms ? <span style={{ color: 'var(--text-muted)' }}>Skipped</span> : <span style={{ fontWeight: 600 }}>{sub.score !== null ? sub.score : '-'}</span>}
                    </td>
                    <td>
                      <span className={getBadgeClass(sub.result)}>
                        {sub.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
