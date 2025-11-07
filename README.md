# SQL Injection Demo

A demonstration project showcasing SQL injection vulnerabilities in a web application.

## Setup

Start all services with Docker Compose:

```bash
docker compose up -d --build
```

## Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306

## Features

- Vulnerable endpoints demonstrating SQL injection
- Safe endpoints using parameterized queries
- Multiple SQL injection techniques:
  - Authentication bypass
  - Data extraction (UNION SELECT)
  - Data modification (UPDATE)
  - Data deletion (DELETE)
  - Stacked queries

## Warning

⚠️ **FOR EDUCATIONAL PURPOSES ONLY** - This application is intentionally vulnerable to demonstrate SQL injection attacks. Do not use in production.
