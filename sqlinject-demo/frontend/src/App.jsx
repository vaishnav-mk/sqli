import { useState, useEffect } from 'react'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('signup')

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const suggestions = [
    {
      username: 'testuser',
      password: '123',
      type: 'normal',
      description: 'Normal user signup'
    },
    {
      username: 'alice',
      password: '123',
      type: 'normal',
      description: 'Normal user signup'
    },
    {
      username: "test', 'dummy'); UPDATE users SET password = 'hacked' WHERE username = 'admin'; #",
      password: 'x',
      type: 'injection',
      description: 'UPDATE injection: Changes admin password'
    },
    {
      username: "user1', 'pass1'), ('user2', 'pass2'); #",
      password: 'x',
      type: 'injection',
      description: 'Multiple inserts: Creates multiple users at once'
    },
    {
      username: "test', 'dummy'); DELETE FROM users WHERE username LIKE 'user%'; #",
      password: 'x',
      type: 'injection',
      description: 'DELETE injection: Removes all users starting with "user"'
    },
    {
      username: "admin', 'admin'); INSERT INTO users (username, password) VALUES ('hacker', 'pwned'); #",
      password: 'x',
      type: 'injection',
      description: 'Stacked queries: Executes multiple INSERT statements'
    }
  ]

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`)
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError('Failed to fetch users')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAuth = async (endpoint, isUnsafe = false) => {
    if (!username.trim() || !password.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode} via ${endpoint}`)
      }
      
      setUsername('')
      setPassword('')
      await fetchUsers()
    } catch (err) {
      setError(err.message + (isUnsafe ? ' - This endpoint is vulnerable!' : ''))
    } finally {
      setLoading(false)
    }
  }

  const fillSuggestion = (suggestion) => {
    setUsername(suggestion.username)
    setPassword(suggestion.password)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">SQL Injection Demo</h1>
            <p className="text-gray-600 text-lg">User Authentication - Safe vs Unsafe SQL Operations</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Fill Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => fillSuggestion(suggestion)}
                  className={`p-3 text-sm font-medium transition-all text-left ${
                    suggestion.type === 'normal'
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {suggestion.type === 'injection' && '⚠️ '}
                  <div className="font-semibold mb-1">{suggestion.description || 'Normal operation'}</div>
                  <div className="text-xs">👤 {suggestion.username}</div>
                  <div className="text-xs opacity-75">🔑 {suggestion.password}</div>
                </button>
              ))}
            </div>
            
            <div className="bg-gray-100 p-6 mb-6">
              <div className="mb-4">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setMode('signup')}
                    className={`px-4 py-2 font-medium ${
                      mode === 'signup' ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    Signup
                  </button>
                  <button
                    onClick={() => setMode('login')}
                    className={`px-4 py-2 font-medium ${
                      mode === 'login' ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    Login
                  </button>
                </div>
              </div>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or use suggestions above..."
                className="w-full p-3 border focus:ring-2 focus:ring-gray-400 focus:border-transparent mb-4"
                disabled={loading}
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-3 border focus:ring-2 focus:ring-gray-400 focus:border-transparent mb-4"
                disabled={loading}
              />
              
              <div className="flex gap-4 mt-4 justify-center">
                <button
                  onClick={() => handleAuth(`${mode}/unsafe`, true)}
                  disabled={loading || !username.trim() || !password.trim()}
                  className="px-6 py-3 bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? `${mode.charAt(0).toUpperCase() + mode.slice(1)}ing...` : `⚠️ Unsafe ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
                </button>
                <button
                  onClick={() => handleAuth(`${mode}/safe`)}
                  disabled={loading || !username.trim() || !password.trim()}
                  className="px-6 py-3 bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? `${mode.charAt(0).toUpperCase() + mode.slice(1)}ing...` : `✅ Safe ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-6 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Registered Users ({users.length} total)
            </h2>
            <p className="text-center text-gray-600 mb-4">
              This shows all users in the database. Try SQL injection to see what happens!
            </p>
            
            <div className="bg-gray-50 max-h-96 overflow-y-auto border rounded">
              {users.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {loading ? 'Loading users...' : 'No users found. Sign up to create the first user!'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-blue-500">#{user.id}</span>
                          <span className="text-gray-800 font-medium">{user.username}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(user.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
