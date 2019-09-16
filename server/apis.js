const express = require('express')
const path = require('path')
const multer = require('multer')
const apis = express.Router();
const db = require('./config.js')
const uploadPath = path.resolve(__dirname, '../media/')
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log('body', req.body.user)
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null , file.originalname);
  }
});
const upload = multer({ storage: storage }).single('dokumen')

apis.get('/recipients', (req, res) => {
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let sortBy = req.query.sortBy || 'asc'
  let offset = (page-1) * limit
  let angkatan = req.query.angkatan
  db.serialize(async () => {
    let qcount = 'select count(user_id) as length from users'
    let sql = 'select * from users'
    if (angkatan) {
      qcount += ' WHERE angkatan_id=' + angkatan
      sql += ' WHERE angkatan_id=' + angkatan
    }
    sql += ' order by user_id ' + sortBy + ' LIMIT ' + offset + ', ' + limit

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

apis.get('/angkatan', (req, res) => {
  db.serialize(() => {
    let query = 'select * from angkatan order by angkatan_id desc'

    db.all(query, (err, rows) => {
      if (err) throw err
      if (rows) {
        res.json(rows)
      } 
    })
  })
})

apis.post('/angkatan', (req, res) => {
  const body = req.body
  const angkatan = body.angkatan
  if (!angkatan) res.json({ message: 'angkatan is required' })
  db.serialize(async () => {
    let query = `insert into angkatan(angkatan_name) values (?)`

    db.run(query, [angkatan], (err) => {
      if (err) res.json({ message: 'data gagal disimpan' })
      let querySelect = 'select * from angkatan order by angkatan_id desc'

      db.all(querySelect, (err, rows) => {
        if (err) throw err
        if (rows) {
          result = {
            message: 'data berhasil disimpan',
            data: rows
          }
          res.json(result)
        } 
      })
    })
  })
})

apis.post('/recipients', (req, res) => {
  const body = req.body
  const nama = body.nama
  const nip = body.nip
  const unit = body.unit
  const angkatan = body.angkatan
  const query = `insert into users(user_name, user_nip, angkatan_id, user_unit) values (?, ?, ?, ?)`
  db.run(query, [nama, nip, angkatan, unit], (err) => {
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

apis.get('/documents', (req, res) => {
  try {
    const userId = req.query.user_id
    if (!userId) throw new Error('user id is required')
    const query = 'select * from documents where user_id=' + userId
    db.all(query, (err, rows) => {
      if (err) res.json({ message: 'error when get documents' })
      if (rows && rows.length > 0) {
        const rowMap = rows.map((item) => {
          return {
            "Foto Terbaru": item.foto || '',
            "Fotocopy KTP": item.indentity_card || '',
            "Fotocopy kartu pegawai": item.employee_card || '',
            "Fotocopy NPWP": item.tax_card || '',
            "Fotocopy halaman muka buku tabungan": item.bank_account_book || '',
            "Formulir data diri": item.form || '',
            "Surat pernyataan pemilihan program studi": item.statement_study_program || '',
            "TOEFL": item.toefl || '',
            "Surat tugas belajar": item.study_assignment || '',
            "Perjanjian tugas belajar": item.study_statement || '',
            "Data pembiayaan beasiswa": item.scholarship_data || '',
            "Transkrip nilai": item.transcript || '',
            "Ijazah": item.certificate || '',
            "tesis": item.thesis || '',
            "Ringkasan penelitian": item.research_summary || '',
            "From penempatan": item.placement_form || '',
            "Financial guarantee": item.financial_guarantee || ''
          }
        })
        res.json(rowMap)
      } else {
        res.json([
          {
            "Foto Terbaru": '',
            "Fotocopy KTP": '',
            "Fotocopy kartu pegawai": '',
            "Fotocopy NPWP": '',
            "Fotocopy halaman muka buku tabungan": '',
            "Formulir data diri": '',
            "Surat pernyataan pemilihan program studi": '',
            "TOEFL": '',
            "Surat tugas belajar": '',
            "Perjanjian tugas belajar": '',
            "Data pembiayaan beasiswa": '',
            "Transkrip nilai": '',
            "Ijazah": '',
            "tesis": '',
            "Ringkasan penelitian": '',
            "From penempatan": '',
            "Financial guarantee": ''
          }
        ])
      }
    })
  } catch (err) {
    res.json({ message: err })
  }
})

apis.post('/documents', (req, res) => {
  // console.log(req)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // res.statusCode = 500
      console.log(err)
    } else if (err) {
      // res.statusCode = 500
      console.log(err)
    }
    // res.send('berhasil upload')
  })
})
module.exports = apis