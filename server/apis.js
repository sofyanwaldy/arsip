const express = require('express')
const apis = express.Router();
const db = require('./config.js')

apis.get('/recipients', (req, res) => {
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let sortBy = req.query.sortBy || 'asc'
  let offset = (page-1) * limit
  db.serialize(async () => {
    let qcount = 'select count(user_id) as length from users'
    let sql = 'select * from users order by user_id ' + sortBy + ' LIMIT ' + offset + ', ' + limit

    db.all(qcount, (err, rows) => {
      if (err) throw err
      if (rows) {
        let length = rows[0].length
        db.all(sql, (err, rows) => {
          if (err) throw err
          if (rows) {
            const rowMap = rows.map((item) => {
              return {
                no: item.user_id,
                nama: item.user_name,
                angkatan: item.angkatan_id,
                nip: item.user_nip,
                unit: item.user_unit
              }
            })
            result = {
              total: length,
              data: rowMap
            }
            res.send(result)
          }
        })
      } 
    })
  })
})

apis.post('/recipients', (req, res) => {
  body = req.body
  const nama = body.nama
  const nip = body.nip
  const unit = body.unit
  const angkatan = body.angkatan
  const query = `insert into users(user_name, user_nip, angkatan_id, user_unit) values (?, ?, ?, ?)`
  db.run(query, [nama, nip, unit, angkatan], (err) => {
    if (err) {
      res.json({
        message: 'data gagal disimpan'
      })
    }
    res.json({
      message: 'data berhasil disimpan'
    })
  })
})

module.exports = apis