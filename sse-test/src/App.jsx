import { useState, useRef, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

function App() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const controllerRef = useRef(null);

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

      const meResponse = await fetch('http://localhost:3000/auth/me', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      const meData = await meResponse.json();

      setCurrentUser(meData);

      connectSSE(data.accessToken);

    } catch (err) {
      console.error('LOGIN ERROR:', err);
    }
  }

  async function connectSSE(jwt) {
    const controller = new AbortController();

    controllerRef.current = controller;

    setConnected(true);

    await fetchEventSource('http://localhost:3000/cv/events', {
      signal: controller.signal,

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

      onclose() {
        console.log('SSE CLOSED');
        setConnected(false);
      },

      onerror(err) {
        console.error('SSE error:', err);
      },
    });
  }

  function disconnect() {
    controllerRef.current?.abort();

    setConnected(false);

    setEvents([]);
  }

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial',
        minHeight: '100vh',
      }}
    >
      {!connected && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '300px',
              gap: '10px',
            }}
          >
            <h1 style={{ textAlign: 'center' }}>CV SSE
            </h1>

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
        </div>
      )}

      {connected && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1>CV SSE</h1>

            <button onClick={disconnect}>
              DISCONNECT
            </button>
          </div>

          <h2>Connected</h2>

          <div
            style={{
              marginTop: '20px',
            }}
          >
            {events.map((e, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid gray',
                  padding: '10px',
                  marginBottom: '10px',
                }}
              >
                <strong>{e.type.toUpperCase()}</strong>

                <div>Cv ID: {e.cvId}</div>
                

                {(e.type === 'created' || e.type === 'updated') && (
                  <div>
                    First Name: {e.payload?.firstName}
                  </div>
                )}

                {currentUser?.role === 'admin' &&
                  e.type !== 'deleted' && (
                    <div>
                      <div>Owner ID: {e.ownerId}</div>
                    </div>
                  )}

                
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;