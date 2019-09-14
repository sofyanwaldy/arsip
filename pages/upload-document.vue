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
                      :items="items"
                      label="Angkatan"
                      :rules="angkatanRules"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="nip"
                      label="Nip"
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
            <v-btn color="blue darken-1" text @click="save">Simpan</v-btn>
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
              <v-row>
                <v-col cols="12" sm="10" md="10">
                  <v-text-field label="Nama Angkatan"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="blue darken-1" text @click="close">Batal</v-btn>
            <v-btn color="blue darken-1" text @click="save">Simpan</v-btn>
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
          <v-icon small class="mr-2" @click="show(item)"
            >mdi-folder-open</v-icon
          >
          Lihat dokumen
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
  data() {
    return {
      page: 1,
      limit: 5,
      totalPage: 0,
      valid: true,
      dialog: false,
      dialogAngkatan: false,
      success: false,
      message: '',
      nama: '',
      nip: '',
      unit: '',
      angkatan: '',
      items: ['angkatan1', 'angkatan2'],
      nameRules: [(v) => !!v || 'Nama wajib diisi'],
      angkatanRules: [(v) => !!v || 'Angkatan wajib diisi'],
      nipRules: [
        (v) => !!v || 'Nip wajib diisi',
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
      listRecipient: []
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
  created() {
    const query = { page: this.page, limit: this.limit, sortBy: 'desc' }
    this.initialData(query)
  },
  mounted() {
    console.log(this.page)
    console.log('recipient total', this.recipientTotal)
  },
  methods: {
    async initialData(query) {
      const { page, limit, sortBy } = query
      const apiUrl =
        process.env.API_URL +
        '/recipients' +
        '?page=' +
        page +
        '&limit=' +
        limit +
        '&sortBy=' +
        sortBy
      const recipients = await axios
        .get(apiUrl)
        .then((response) => response.data)
      const data = recipients.data
      this.recipientTotal = recipients.total
      this.totalPage = this.recipientTotal / this.limit
      this.listRecipient = data
    },
    show(id) {
      console.log(id)
    },
    close() {
      this.dialog = false
      this.dialogAngkatan = false
    },
    next(page) {
      const query = { page, limit: this.limit, sortBy: 'asc' }
      this.initialData(query)
    },
    save() {
      if (this.$refs.form.validate()) {
        const apiUrl = process.env.API_URL + '/recipients'
        axios
          .post(apiUrl, {
            nama: this.nama,
            angkatan: this.angkatan,
            nip: this.nip,
            unit: this.unit
          })
          .then((response) => response.data)
          .then((response) => {
            this.success = true
            this.message = response.message
          })
        this.listRecipient.push({
          name: this.nama,
          no: this.listRecipient.length,
          angkatan: this.angkatan,
          nip: this.nip,
          unit: this.unit
        })
        this.close()
      }
    }
  }
}
</script>
