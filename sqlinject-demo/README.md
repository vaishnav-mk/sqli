# SQL Injection Demo

A full-stack demonstration of SQL injection vulnerabilities and prevention techniques using a simple Todo List application.

## Features

- **Frontend**: React app with modern, centered design
- **Backend**: Hono server with SQLite database  
- **Quick Fill Suggestions**: One-click examples including SQL injection attacks
- **Docker Support**: Complete containerized setup
- **Database Viewer**: Adminer for database management

## Architecture

### Frontend (React)
- Input field for todo tasks
- Quick-fill suggestion buttons for normal and malicious inputs
- Two buttons demonstrating safe vs unsafe SQL operations  
- Real-time todo list display
- Modern, responsive design with visual feedback

### Backend (Hono + SQLite)
- `/todos` - GET all todos
- `/unsafe` - POST vulnerable to SQL injection
- `/safe` - POST using prepared statements

### SQL Injection Demo
Click on the suggestion buttons to auto-fill common attack patterns:
```
'); DROP TABLE todos; --
```

## Quick Start

### Using Docker (Recommended)

1. **Start all services:**
   ```bash
   docker compose up --build
   ```

2. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Adminer (Database Viewer): http://localhost:8080

### Local Development

#### Backend
```bash
cd backend
bun install
cd src && bun index.ts
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Usage

### Testing SQL Injection

1. **Use Suggestion Buttons**: Click any suggestion button to auto-fill the input
2. **Safe Operation**: Use "Safe Add Todo" button - uses parameterized queries
3. **Unsafe Operation**: Use "Unsafe Add Todo" button - vulnerable to injection
4. **Compare Results**: Try the same malicious input with both buttons to see the difference

### Database Management

Access Adminer at http://localhost:8080:
- System: SQLite 3
- Server: Leave empty or use `/app/data/todos.db`
- Username: Leave empty
- Password: Leave empty
- Database: Click "Select database" to browse

For Docker setup, you can also connect to the database file through the shared volume.

## Security Demonstration

### Vulnerable Code (Unsafe Endpoint)
```javascript
const query = `INSERT INTO todos (task) VALUES ('${task}')`
await dbRun(query)
```

### Secure Code (Safe Endpoint)
```javascript
await dbRun('INSERT INTO todos (task) VALUES (?)', [task])
```

### Attack Scenarios

1. **Data Extraction**: `' UNION SELECT id, task, created_at FROM todos --`
2. **Table Deletion**: `'); DROP TABLE todos; --`
3. **Data Modification**: `'; UPDATE todos SET task = 'HACKED' --`

## Docker Services

- **frontend**: React development server (port 3000)
- **backend**: Node.js API server (port 5000)
- **adminer**: Database administration tool (port 8080)

## File Structure

```
.
├── backend/
│   ├── src/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Learning Objectives

1. **Understand SQL Injection**: See how user input can manipulate SQL queries
2. **Prevention Techniques**: Learn about parameterized queries and input validation
3. **Impact Assessment**: Observe the destructive potential of SQL injection
4. **Database Security**: Explore proper database interaction patterns

## Cleanup

To stop and remove all containers:
```bash
docker compose down -v
```

To rebuild after changes:
```bash
docker compose up --build
```
