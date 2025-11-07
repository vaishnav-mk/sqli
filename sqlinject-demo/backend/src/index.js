const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

let db;

function initDatabase() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 30;
    
    const tryConnect = () => {
      db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'sqlinject_demo',
        multipleStatements: true
      });
      
      db.connect((err) => {
        if (err) {
          attempts++;
          if (attempts >= maxAttempts) {
            console.error('Error connecting to MySQL after', maxAttempts, 'attempts:', err);
            reject(err);
            return;
          }
          setTimeout(tryConnect, 1000);
          return;
        }
        console.log('Connected to MySQL database');
        
        db.on('error', (err) => {
          if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
            console.log('Database connection lost, reconnecting...');
            initDatabase();
          }
        });
        
        resolve();
      });
    };
    
    tryConnect();
  });
}

app.get("/", (req, res) => {
  res.send("SQL Injection Demo API");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/users", (req, res) => {
  db.query("SELECT id, username, created_at FROM users ORDER BY created_at DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results);
  });
});

app.get("/search/unsafe", (req, res) => {
  const { username } = req.query;
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  db.query(query, (err, results) => {
    if (err) {
      res.json({ error: err.message, results: [] });
    } else {
      res.json(results);
    }
  });
});

app.get("/search/safe", (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Username parameter is required" });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Search failed" });
    } else {
      res.json({
        message: "Search completed (safe)",
        searchTerm: username,
        results: results
      });
    }
  });
});

app.post("/signup/unsafe", (req, res) => {
  const { username, password } = req.body;
  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
  db.query(query, (err, results) => {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json({ affectedRows: results.affectedRows });
    }
  });
});

app.post("/signup/safe", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to create user" });
    } else {
      res.json({ message: "User created (safe)", username });
    }
  });
});

app.post("/login/unsafe", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  db.query(query, (err, results) => {
    if (err) {
      res.json({ error: err.message });
    } else if (results && results.length > 0) {
      res.json(results[0]);
    } else {
      res.json({ error: "Invalid credentials" });
    }
  });
});

app.post("/login/safe", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to login" });
    } else if (results && results.length > 0) {
      res.json({ message: "Login successful (safe)", user: results[0] });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

app.get("/payloads", (req, res) => {
  const payloads = {
    "Authentication Bypass": [
      "admin' OR '1'='1' --",
      "' OR 1=1 --"
    ],
    "Data Extraction": [
      "admin' UNION SELECT username, password FROM users --"
    ],
    "Data Modification": [
      "admin'; UPDATE users SET password='hacked' WHERE username='admin'; --"
    ]
  };

  res.json({
    message: "SQL Injection Payload Library",
    note: "FOR EDUCATIONAL PURPOSES ONLY",
    payloads: payloads
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`SQL Injection Demo API running on port ${port}`);
});

initDatabase()
  .then(() => {
    console.log("Database initialized successfully");
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
