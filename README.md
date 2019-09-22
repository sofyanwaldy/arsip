# arsip

> mini webapp untuk arsip beasiswa

## cara instalasi

aplikasi bisa berjalan dengan nodejs versi 10.16.3 https://nodejs.org/en/ pastikan di komputer terinstall nodejs tersebut 
``` bash

# download atau clone repository
download melalui link yang ada di atas

jika menggunakan clone pastikan git sudah di install download disini https://git-scm.com/
git clone https://github.com/sofyanwaldy/arsip.git

1. pastikan folder dimana tempat file di download / clone
2. Buka terminal(Linux/Macbook) atau CMD (windows)
3. ['kalau hasil clone secara default nama file arsip/, 
kalau hasil download extract file dan secara default namafile arsip-master/']
(windows) jika lokasi ada di D maka ketik d: [enter] 
kemudian ketik: cd namaFile/ [ex: cd arsip/]
(Linux) cd /lokasiFile kalau download biasanya di cd /user/username/Downloads/namaFolder ['enter']
(Macbook) cd /User/user/Downloads/namaFolder [enter]
4. jika belum ada folder media silahkan ditambahkan folder media di dalam folder project arsip
5. ketik: npm install
6. ketik: npm run build
7. ketik: npm start

lewati step 1-5 jika file sudah didownload/clone dan step 4 - 6 sudah dilakukan 
silahkan masuk ke folder dengan ketik cd namaFolder lakukan hanya step terakhir yaitu npm start

kemudian buka di browser localhost:3000
```
## build setup untuk menggunakan npm
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev #untuk development

# build for production and launch server
$ npm run build
$ npm  start

# generate static project
$ npm generate
``` 

## Build Setup untuk menggunakan yarn 

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

```

## git command yang sering digunakan
``` bash
selengkapnya ada di https://git-scm.com/docs
git status --> untuk melihat status file yang masuk ke git selengkapnya https://git-scm.com/book/id/v1/Dasar-dasar-Git-Merekam-Perubahan-ke-dalam-Repositori
git add namaFile --> untuk menambahkan nama file kita kedalam git status file akan berubah staged
git commit -m "pesan commit" --> untuk commit perubahan setelah kita add
git push origin master --> untuk push file hasil commit kedalam repository git
git pull origin master --> untuk menarik file dari repository kedalam project lokal 
```
