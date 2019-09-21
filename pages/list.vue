<template>
  <v-layout>
    <v-flex class="text-center">
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-flex class="text-right">
            <v-btn
              color="success"
              class="mb-2"
              justify-end
              @click="dialogAngkatan = true"
              ><v-icon small>mdi-plus</v-icon> Angkatan Baru</v-btn
            >
            <v-btn color="primary" class="mb-2" justify-end v-on="on"
              ><v-icon small>mdi-plus</v-icon> Daftar Baru</v-btn
            >
          </v-flex>
          <v-flex class="text-left">
            <v-col cols="12" sm="12" md="12">
              <v-select
                v-model="angkatanCombo"
                :items="listAngkatan"
                label="Pilih Angkatan"
                item-text="angkatan_name"
                return-object
                @input="angkatanNext"
              ></v-select>
            </v-col>
          </v-flex>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Penerima beasiswa baru</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="nama"
                      label="Nama Peserta"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="angkatan"
                      :items="listAngkatan"
                      label="Pilih Angkatan"
                      item-text="angkatan_name"
                      return-object
                      :rules="angkatanRules"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="nip"
                      label="NIP"
                      :rules="nipRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="unit"
                      label="Unit"
                      :rules="unitRules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="blue darken-1" text @click="close">Batal</v-btn>
            <v-btn v-if="editable" color="blue darken-1" text @click="update"
              >Ubah</v-btn
            >
            <v-btn v-else color="blue darken-1" text @click="save"
              >Simpan</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogAngkatan" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Angkatan Baru</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="formAngkatan" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="10" md="10">
                    <v-text-field
                      v-model="angkatanNew"
                      label="Nama Angkatan"
                      :rules="angkatanRules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="blue darken-1" text @click="close">Batal</v-btn>
            <v-btn color="blue darken-1" text @click="saveAngkatan"
              >Simpan</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- alert -->
      <v-alert v-if="success" type="success">
        {{ message }}
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="listRecipient"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:item.action="{ item }">
          <nuxt-link :to="'documents/?uid=' + item.no">
            <!-- <v-icon small class="mr-2">mdi-folder-open</v-icon> -->
            Lihat dokumen
          </nuxt-link>
          &nbsp;&nbsp;
          <v-btn color="primary" small @click="edit(item)">edit</v-btn>
          &nbsp;
          <v-btn color="error" small @click="hapus(item.no)">hapus</v-btn>
        </template>
      </v-data-table>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              class="my-4"
              :length="totalPage"
              total-visible="10"
              @input="next"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from 'axios'

export default {
  middleware: 'auth',
  data() {
    return {
      page: 1,
      limit: 10,
      totalPage: 0,
      valid: true,
      dialog: false,
      dialogAngkatan: false,
      success: false,
      message: '',
      uid: null,
      nama: '',
      nip: '',
      unit: '',
      angkatan: '',
      angkatanNew: '',
      angkatanCombo: '',
      angkatanId: 0,
      editable: false,
      nameRules: [(v) => !!v || 'Nama wajib diisi'],
      angkatanRules: [(v) => !!v || 'Angkatan wajib diisi'],
      nipRules: [
        (v) => !!v || 'NIP wajib diisi',
        (v) => /\d+/.test(v) || 'isi hanya angka'
      ],
      unitRules: [(v) => !!v || 'unit wajib diisi'],
      headers: [
        {
          text: 'NO',
          align: 'left',
          value: 'no'
        },
        {
          text: 'Daftar penerima beasiswa',
          align: 'left',
          sortable: false,
          value: 'nama'
        },
        { text: 'NIP', value: 'nip', align: 'left' },
        { text: 'Unit', value: 'unit', align: 'left' },
        { text: 'Upload Dokumen', value: 'action', align: 'left' }
      ],
      recipientTotal: 0,
      listRecipient: [],
      listAngkatan: []
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogAngkatan(val) {
      val || this.close()
    }
  },
  asyncData({ store }) {
    console.log(store.state)
  },
  created() {
    const query = { page: this.page, limit: this.limit, sortBy: 'desc' }
    this.initialData(query)
    this.initialAngkatan()
  },
  methods: {
    async initialData(query) {
      const { page, limit, sortBy, angkatan } = query
      let apiUrl =
        process.env.API_URL +
        '/recipients' +
        '?page=' +
        page +
        '&limit=' +
        limit +
        '&sortBy=' +
        sortBy
      if (angkatan) apiUrl += '&angkatan=' + angkatan
      const recipients = await axios
        .get(apiUrl)
        .then((response) => response.data)
      const data = recipients.data
      this.recipientTotal = recipients.total
      this.totalPage = Math.ceil(recipients.total / this.limit)
      this.listRecipient = data
    },
    async initialAngkatan() {
      const apiUrl = process.env.API_URL + '/angkatan'
      const angkatan = await axios.get(apiUrl).then((response) => response.data)
      this.listAngkatan = angkatan
    },
    show(id) {
      console.log(id)
    },
    close() {
      this.dialog = false
      this.dialogAngkatan = false
    },
    angkatanNext(val) {
      const angkatanId = val.angkatan_id
      this.angkatanId = angkatanId
      this.page = 1
      const query = {
        page: this.page,
        limit: this.limit,
        sortBy: 'desc',
        angkatan: angkatanId
      }
      this.initialData(query)
    },
    next(page) {
      const query = { page, limit: this.limit, sortBy: 'desc' }
      if (this.angkatanId > 0) query.angkatan = this.angkatanId
      this.initialData(query)
    },
    saveAngkatan() {
      if (this.$refs.formAngkatan.validate()) {
        const apiUrl = process.env.API_URL + '/angkatan'
        axios
          .post(apiUrl, {
            angkatan: this.angkatanNew
          })
          .then((response) => {
            this.success = true
            this.message = response.data.message
            this.listAngkatan = response.data.data
            this.close()
          })
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        const apiUrl = process.env.API_URL + '/recipients'
        axios
          .post(apiUrl, {
            nama: this.nama,
            angkatan: this.angkatan.angkatan_id,
            nip: this.nip,
            unit: this.unit
          })
          .then((response) => response.data)
          .then((response) => {
            this.success = true
            this.message = response.message
          })
        const query = {
          page: this.page,
          limit: this.limit,
          sortBy: 'desc',
          angkatan: this.angkatan.angkatan_id
        }
        this.nama = ''
        this.angkatan = ''
        this.nip = ''
        this.unit = ''
        this.initialData(query)
        this.close()
      }
    },
    async hapus(id) {
      const ask = confirm('yakin mau hapus ? ')
      if (ask) {
        const apiUrl = process.env.API_URL + '/recipients/' + id
        const { data } = await axios.delete(apiUrl)
        if (data) {
          this.success = true
          this.message = data.message
          const query = { page: 1, limit: this.limit, sortBy: 'desc' }
          this.initialData(query)
        }
      }
    },
    edit(item) {
      const findAngkatan = this.listAngkatan.find((obj) => {
        return obj.angkatan_id === item.angkatan
      })
      console.info(findAngkatan)
      this.uid = item.no
      this.dialog = true
      this.nama = item.nama
      this.unit = item.unit
      this.angkatan = findAngkatan
      this.nip = item.nip
      this.editable = true
    },
    async update() {
      if (this.$refs.form.validate()) {
        const apiUrl = process.env.API_URL + '/recipients/' + this.uid
        const { data } = await axios.put(apiUrl, {
          nama: this.nama,
          unit: this.unit,
          nip: this.nip,
          angkatan: this.angkatan.angkatan_id
        })
        if (data) {
          this.success = true
          this.message = data.message
          this.uid = ''
          this.nama = ''
          this.unit = ''
          this.angkatan = ''
          this.nip = ''
          this.editable = false
          this.page = 1
          const query = { page: this.page, limit: this.limit, sortBy: 'desc' }
          this.initialData(query)
          this.initialAngkatan()
          this.close()
        }
      }
    }
  }
}
</script>
