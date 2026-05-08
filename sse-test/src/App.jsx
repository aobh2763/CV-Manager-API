import { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

function App() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);

  async function login() {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log('LOGIN RESPONSE:', data); 
      if (!data.accessToken) {
        alert('Login failed');
        return;
      }

      setToken(data.accessToken);
      connectSSE(data.accessToken);

    } catch (err) {
      console.error('LOGIN ERROR:', err);
    }
  }

  async function connectSSE(jwt) {
    setConnected(true);

    await fetchEventSource('http://localhost:3000/cv/events', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },

      onmessage(event) {
        try {
          const parsed = JSON.parse(event.data);
          setEvents((prev) => [parsed, ...prev]);
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      },

      onerror(err) {
        console.error('SSE error:', err);
      },
    });
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>CV SSE MONITOR</h1>

      {!connected && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>LOGIN</button>
        </div>
      )}

      {connected && (
        <>
          <h2>Connected</h2>

          <div style={{ marginTop: '20px' }}>
            {events.map((e, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid gray',
                  padding: '10px',
                  marginBottom: '10px',
                }}
              >
                <strong>{e.action}</strong>
                <div>CV ID: {e.cvId}</div>
                <div>OWNER: {e.ownerId}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;