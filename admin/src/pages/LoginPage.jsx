import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/health`);
        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }
        const data = await response.json();
        setHealthData(data);
      } catch (err) {
        setError(err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, [apiUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      'Placeholder Login Shell: Authentication logic is scheduled for a future phase.'
    );
  };

  return (
    <div className="login-page">
      <h1>Admin Portal</h1>
      <p style={{ color: '#64748b' }}>
        Store management & administration shell (Phase 0 Scaffolding)
      </p>

      <div className="login-card">
        <h2 style={{ marginTop: 0 }}>Administrator Sign In</h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#64748b',
            marginBottom: '1.5rem',
          }}
        >
          Placeholder login form (no credentials checked yet).
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              id="username"
              type="text"
              placeholder="enterprisesdheeraj2@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Sign In (Placeholder)
          </button>
        </form>

        <hr style={{ margin: '1.5rem 0', borderColor: '#f1f5f9' }} />

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
            Server Health Check
          </h4>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#64748b',
              margin: '0 0 0.5rem 0',
            }}
          >
            Target: <code>{apiUrl}/health</code>
          </p>

          {loading && (
            <div className="status-badge loading">
              Pinging backend health...
            </div>
          )}

          {error && (
            <div>
              <div className="status-badge error">Server Offline</div>
              <p
                style={{
                  color: '#b91c1c',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem',
                }}
              >
                {error}
              </p>
            </div>
          )}

          {healthData && (
            <div>
              <div className="status-badge success">
                Server Online (Status: {healthData.status})
              </div>
              <pre style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
