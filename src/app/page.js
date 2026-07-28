import Link from 'next/link';

export default function Home() {
  return (
    <main className="app-container">
      <div className="content-area" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
        
        <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)', transform: 'rotate(-10deg)' }}>
          🦷
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          OraRisk
        </h1>
        
        <p style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
          Professional screening and early detection.
        </p>
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/patient" className="btn btn-primary" style={{ display: 'flex', gap: '0.75rem' }}>
            <span>👤</span>
            <span>I am a Patient</span>
          </Link>
          
          <Link href="/admin" className="btn btn-outline" style={{ display: 'flex', gap: '0.75rem' }}>
            <span>🩺</span>
            <span>Admin Portal</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
