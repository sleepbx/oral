'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = () => {
    setLoading(true);
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleReset = async () => {
    if (confirm('Are you sure you want to delete all patient records? This cannot be undone.')) {
      setLoading(true);
      await fetch('/api/submissions/reset', { method: 'DELETE' });
      fetchSubmissions();
    }
  };

  const handleDownload = () => {
    if (submissions.length === 0) return alert('No data to download.');
    
    // Create CSV header
    const headers = ['Date', 'Patient Name', 'State', 'Has Symptoms', 'Risk Score', 'Final Assessment'];
    
    // Map rows
    const rows = submissions.map(sub => [
      new Date(sub.date).toLocaleDateString(),
      `"${sub.name}"`, // Quote to handle commas in names
      `"${sub.state}"`,
      sub.hasSymptoms ? 'Yes' : 'No',
      sub.hasSymptoms ? 'Skipped (Symptoms)' : sub.score,
      sub.result
    ]);
    
    // Combine
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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

  return (
    <main className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Recent patient screenings</p>
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
                    <td>
                      {sub.hasSymptoms ? (
                        <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Reported</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>
                    <td>
                      {sub.hasSymptoms ? <span style={{ color: 'var(--text-muted)' }}>Skipped</span> : <span style={{ fontWeight: 600 }}>{sub.score} / 12</span>}
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
