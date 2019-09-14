const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbFile = '../database/arsip.db'
const db = new sqlite3.Database(path.resolve(__dirname, dbFile), sqlite3.OPEN_READWRITE, (err) => {
  if(err) throw err
  console.log("Koneksi ke database berhasil!");
})
module.exports = db;