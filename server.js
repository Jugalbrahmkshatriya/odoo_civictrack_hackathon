/**
 * CivicTrack Backend
 * Express server with SQLite for managing users, civic issues, and admin analytics
 * @module server
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
});

/**
 * Initialize database schema with users and issues tables
 */
db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);
  db.run(`
    CREATE TABLE issues (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      userId TEXT NOT NULL,
      flags INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);
  // Insert a default admin user for testing
  db.run('INSERT OR IGNORE INTO users (id, username, role) VALUES (?, ?, ?)', [uuidv4(), 'admin', 'admin']);
});

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * POST /api/login - Authenticate user and create session
 */
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (user) {
      return res.json({ id: user.id, username: user.username, role: user.role });
    }
    const userId = uuidv4();
    db.run(
      'INSERT INTO users (id, username, role) VALUES (?, ?, ?)',
      [userId, username, 'user'],
      (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }
        res.json({ id: userId, username, role: 'user' });
      }
    );
  });
});

/**
 * POST /api/issues - Create a new civic issue
 */
app.post('/api/issues', (req, res) => {
  const { title, description, category, lat, lng, userId } = req.body;
  const validCategories = ['Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
  if (!title || !description || !category || !lat || !lng || !userId) {
    return res.status(400).json

System: It looks like your message was cut off, possibly due to a character limit or an incomplete paste. The last part of the `server.js` code and the remaining steps for setting up the **CivicTrack** project in the `odoo_civictrack_hackathon` folder are missing. I’ll complete the `server.js` code, address the `sqlite3` installation issue from your error log, and provide the remaining steps to ensure you can fully set up and run the project for the Odoo x CGC Mohali Hackathon 2025. The solution will remain optimized for the 5-hour time constraint, align with the problem statement, and meet the evaluation criteria (coding standards, logic correctness, modularity, database design, frontend design, performance, scalability, security, and usability).

### Addressing the `sqlite3` Installation Error
The error during `npm install express sqlite3 cors uuid` indicates that `sqlite3` failed to build because `node-gyp` couldn’t find Visual Studio with the "Desktop development with C++" workload. The deprecation warnings (e.g., `npmlog`, `rimraf`) are not critical and can be ignored for this project. Your setup includes:
- Node.js v22.17.1
- Python 3.13.5
- Windows 10 (build 22631)

The primary issue is the missing Visual Studio C++ build tools, which are required to compile `sqlite3`. Let’s resolve this and proceed with the setup.

### Step 1: Fix the `sqlite3` Installation (15 minutes)
1. **Install Visual Studio Build Tools**:
   - Download Visual Studio Community 2022 (free) from [visualstudio.microsoft.com](https://visualstudio.microsoft.com/downloads/).
   - During installation, select the **Desktop development with C++** workload and ensure these components are included:
     - MSVC v143 - VS 2022 C++ x64/x86 build tools (or latest)
     - Windows 10/11 SDK
     - C++ core desktop features
   - Install (takes ~10-15 minutes). If Visual Studio is already installed, use the Visual Studio Installer to modify and add this workload.

2. **Verify Python**:
   - Your system has Python 3.13.5 (as shown: `C:\Users\creat\AppData\Local\Programs\Python\Python313\python.exe`).
   - Confirm it’s in your PATH:
     ```powershell
     python --version
     ```
     Expected output: `Python 3.13.5`.
   - If not found, reinstall Python from [python.org](https://www.python.org/downloads/) and check “Add Python to PATH” during installation.

3. **Retry Dependency Installation**:
   - Navigate to your project folder:
     ```powershell
     cd C:\Users\creat\OneDrive\Desktop\odoo_civic_hackathon\odoo_civictrack_hackathon
     ```
   - Install dependencies:
     ```powershell
     npm install express sqlite3 cors uuid
     ```
   - If `sqlite3` still fails, try:
     ```powershell
     npm install sqlite3 --build-from-source --electron-version=22.17.1
     ```
   - Alternatively, downgrade Node.js to a more compatible LTS version (e.g., v18):
     - Uninstall Node.js v22.17.1 via Control Panel > Programs > Uninstall a program.
     - Download and install Node.js v18 from [nodejs.org](https://nodejs.org/en/download/releases).
     - Verify:
       ```powershell
       node -v
       npm -v
       ```
     - Retry:
       ```powershell
       npm install express sqlite3 cors uuid
       ```

4. **Verify Installation**:
   - Confirm `node_modules`, `package.json`, and `package-lock.json` exist in `C:\Users\creat\OneDrive\Desktop\odoo_civic_hackathon\odoo_civictrack_hackathon`.
   - Check `package.json` for:
     ```json
     "dependencies": {
       "cors": "^2.8.5",
       "express": "^4.21.0",
       "sqlite3": "^5.1.7",
       "uuid": "^10.0.0"
     }
     ```

#### Step 2: Create and Run the Backend (40 minutes)
1. **Complete the Backend File**:
   - Create (or overwrite) `server.js` in `C:\Users\creat\OneDrive\Desktop\odoo_civic_hackathon\odoo_civictrack_hackathon`.
   - Use the complete `server.js` code below, which includes the missing portion:

<xaiArtifact artifact_id="b8efe019-afa9-432b-a762-c8745b41445f" artifact_version_id="b91d4535-b57e-466e-b869-49c54d84595a" title="server.js" contentType="text/javascript">
/**
 * CivicTrack Backend
 * Express server with SQLite for managing users, civic issues, and admin analytics
 * @module server
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
});

/**
 * Initialize database schema with users and issues tables
 */
db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);
  db.run(`
    CREATE TABLE issues (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      userId TEXT NOT NULL,
      flags INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);
  // Insert a default admin user for testing
  db.run('INSERT OR IGNORE INTO users (id, username, role) VALUES (?, ?, ?)', [uuidv4(), 'admin', 'admin']);
});

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * POST /api/login - Authenticate user and create session
 */
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string' || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (user) {
      return res.json({ id: user.id, username: user.username, role: user.role });
    }
    const userId = uuidv4();
    db.run(
      'INSERT INTO users (id, username, role) VALUES (?, ?, ?)',
      [userId, username, 'user'],
      (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }
        res.json({ id: userId, username, role: 'user' });
      }
    );
  });
});

/**
 * POST /api/issues - Create a new civic issue
 */
app.post('/api/issues', (req, res) => {
  const { title, description, category, lat, lng, userId } = req.body;
  const validCategories = ['Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
  if (!title || !description || !category || !lat || !lng || !userId) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
  }
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  db.run(
    'INSERT INTO issues (id, title, description, category, status, lat, lng, userId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, category, 'Reported', lat, lng, userId, createdAt],
    (err) => {
      if (err) {
        console.error('Issue creation error:', err);
        return res.status(500).json({ error: 'Failed to create issue' });
      }
      res.json({ success: true, id });
    }
  );
});

/**
 * GET /api/issues - Fetch issues with optional filters
 */
app.get('/api/issues', (req, res) => {
  const { status, category, distance, lat, lng } = req.query;
  let query = 'SELECT * FROM issues WHERE flags < 3';
  const params = [];
  
  if (status && status !== 'all') {
    if (!['Reported', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    query += ' AND status = ?';
    params.push(status);
  }
  if (category && category !== 'all') {
    const validCategories = ['Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    query += ' AND category = ?';
    params.push(category);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Fetch issues error:', err);
      return res.status(500).json({ error: 'Failed to fetch issues' });
    }
    const filtered = rows.filter(issue => {
      if (!lat || !lng) return true;
      const dist = getDistance(parseFloat(lat), parseFloat(lng), issue.lat, issue.lng);
      return dist <= parseFloat(distance || 5);
    });
    res.json(filtered);
  });
});

/**
 * POST /api/issues/:id/flag - Flag an issue for moderation
 */
app.post('/api/issues/:id/flag', (req, res) => {
  db.run('UPDATE issues SET flags = flags + 1 WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Flag issue error:', err);
      return res.status(500).json({ error: 'Failed to flag issue' });
    }
    res.json({ success: true });
  });
});

/**
 * GET /api/admin/issues - Fetch flagged issues for admin
 */
app.get('/api/admin/issues', (req, res) => {
  db.all('SELECT * FROM issues WHERE flags >= 3', (err, rows) => {
    if (err) {
      console.error('Fetch admin issues error:', err);
      return res.status(500).json({ error: 'Failed to fetch flagged issues' });
    }
    res.json(rows);
  });
});

/**
 * GET /api/admin/analytics - Get issue counts by category
 */
app.get('/api/admin/analytics', (req, res) => {
  db.all('SELECT category, COUNT(*) as count FROM issues GROUP BY category', (err, rows) => {
    if (err) {
      console.error('Analytics error:', err);
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }
    res.json(rows);
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));