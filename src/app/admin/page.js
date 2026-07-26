'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const getBadgeClass = (riskLevel) => {
    if (riskLevel === 'High Risk') return 'badge badge-high';
    if (riskLevel === 'Moderate Risk') return 'badge badge-moderate';
    return 'badge badge-low';
  };

  return (
    <main className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Recent patient screenings</p>
        </div>
        <Link href="/" className="btn btn-outline" style={{ minHeight: '40px', padding: '0.5rem 1rem', width: 'auto' }}>
          Home
        </Link>
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
