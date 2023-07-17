const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs')

const app = express();
const port = 3000;
var dbFile = 'database.db'; // Replace with the path to your SQLite database file
dbFile = path.resolve(__dirname, dbFile)

app.use('', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(express.json());

// Function to query the database and retrieve data from a table
function queryTable(tableName, callback) {
  const db = new sqlite3.Database(dbFile);
  db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
    db.close();
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Function to query the database and retrieve a specific row from a table
function queryRow(tableName, id, callback) {
  const db = new sqlite3.Database(dbFile);
  db.all(`SELECT * FROM ${tableName} WHERE TRADE_ID = ?`, id, (err, row) => {
    db.close();
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

// Function to insert data into a table
function insertIntoTable(tableName, data, callback) {
  const db = new sqlite3.Database(dbFile);
  const columns = Object.keys(data).join(','); // column names
  const placeholders = Object.keys(data).map(()=>'?').join(','); // column names
  var values = Object.values(data);
  
  console.log(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`)
  db.run(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, values, function (err) {
    db.close();
    if (err) {
        console.log(err.message)
      callback(err);
    } else {
      callback(null, { id: this.lastID });
    }
  });
}

// Function to update data in a table
function updateTable(tableName, id, data, callback) {
  const db = new sqlite3.Database(dbFile);
  const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
  const values = Object.values(data);
  values.push(id);
  db.run(`UPDATE ${tableName} SET ${updates} WHERE TRADE_ID = ?`, values, function (err) {
    db.close();
    if (err) {
      callback(err);
    } else {
      callback(null, { rowsAffected: this.changes });
    }
  });
}

// Function to delete data from a table
function deleteFromTable(tableName, id, callback) {
  const db = new sqlite3.Database(dbFile);
  db.run(`DELETE FROM ${tableName} WHERE id = ?`, id, function (err) {
    db.close();
    if (err) {
      callback(err);
    } else {
      callback(null, { rowsAffected: this.changes });
    }
  });
}

// Define API endpoints for each table
app.get('/api/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  queryTable(tableName, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
//   console.log(req.body)
  queryRow(tableName, id, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.status(404).send(`Row with ID ${id} not found.`);
    } else {
      res.json(row);
    }
  });
});

app.post('/api/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;
//   console.log(data)
  insertIntoTable(tableName, data, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(result);
    }
  });
});

app.put('/api/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  const data = req.body;

  updateTable(tableName, id, data, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(result);
    }
  });
});

// app.delete('/api/:tableName/:id', (req, res) => {
//   const tableName = req.params.tableName;
//   const id = req.params.id;
//   deleteFromTable(tableName, id, (err, result) => {
//     if (err) {
//       res.status(500).send(err.message);
//     } else {
//       res.json(result);
//     }
//   });
// });
// end of api 

/* UI code */

// report
app.get('/report/:trade_id',(req,res)=>{
    res.sendFile(__dirname + '/html/report.html')
});

// home
app.get('',(req,res)=>{
    res.sendFile(__dirname + '/html/dashboard.html')
})

// download database
app.get('/download', (req, res) => {
    const filePath = path.resolve(__dirname, 'database.db');
  
    // Set the response headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${dbFile}`);
  
    // Read the file and stream it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });

module.exports = app;

// Start the server
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
