<template>
  <v-layout>
    <v-flex class="text-center">
      <v-alert v-if="notFound" type="warning">
        Dokumen tidak ditemukan
      </v-alert>
      <v-card v-else class="mx-auto text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-if="user.length > 0">
              <v-chip class="ma-2" color="primary" label>
                Nama : {{ user[0].user_name }}
              </v-chip>
              <v-chip class="ma-2" color="primary" label>
                NIP : {{ user[0].user_nip }}
              </v-chip>
              <v-chip class="ma-2" color="primary" label>
                Unit : {{ user[0].user_unit }}
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <br />
      <v-alert v-if="success" type="warning">
        {{ message }}
      </v-alert>
      <v-simple-table v-if="!notFound">
        <thead>
          <tr>
            <th>No</th>
            <th class="text-left">Label</th>
            <th class="text-left">Dokumen</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in documents" :key="i">
            <td class="text-left">{{ i + 1 }}</td>
            <td class="text-left">{{ item.label }}</td>
            <td v-if="!item.name" class="text-left">
              <v-file-input v-model="file[i]" label="pilih file"></v-file-input>
            </td>
            <td v-if="item.name" class="text-left">
              <v-btn
                :href="'/media/' + item.name"
                text
                color="primary"
                target="_blank"
                >{{ item.name }}</v-btn
              >
              <v-btn
                color="error"
                depressed
                @click="hapus(item.field, item.name)"
                >Hapus</v-btn
              >
            </td>
            <td v-if="!item.name && file[i] !== undefined" class="text-left">
              <v-btn
                :id="i"
                color="primary"
                class="mb-2"
                justify-end
                @click="upload(i)"
                >Upload</v-btn
              >
            </td>
            <td v-else></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from 'axios'

export default {
  middleware: 'auth',
  data() {
    return {
      notFound: false,
      success: false,
      message: '',
      userID: '',
      file: [],
      documents: [],
      user: []
    }
  },
  asyncData({ query }) {
    return {
      query,
      userID: query.uid
    }
  },
  async created() {
    const userID = this.query.uid
    if (!userID) {
      this.notFound = true
    }
    const data = await this.fetchDocument(userID)
    if (data) {
      this.notFound = false
      this.documents = data
    }
  },
  mounted() {
    this.fetchUser(this.userID)
    console.info(this.user)
  },
  methods: {
    // fileChange(e) {
    //   if (e) {
    //     console.info('name', e.name)
    //     console.info('key', Object.keys(this.file))
    //   }
    // },
    async upload(i) {
      const apiUrl = process.env.API_URL + '/documents'
      const uploadData = new FormData()
      uploadData.append('user_id', this.userID)
      uploadData.append('field', i)
      uploadData.append('dokumen', this.file[i])
      const upload = await axios
        .post(apiUrl, uploadData)
        .then((response) => response.data)
      if (upload) {
        const userID = this.query.uid
        if (!userID) {
          this.notFound = true
        }
        const data = await this.fetchDocument(userID)
        if (data) {
          this.notFound = false
          this.documents = data
        }
      }
    },
    async fetchDocument(userID) {
      const apiUrl = process.env.API_URL + '/documents?user_id=' + userID
      const documents = await axios
        .get(apiUrl)
        .then((response) => response.data)
      if (!userID) {
        return false
      }
      const docs = documents[0]
      const data = Object.keys(docs).map((item, i) => {
        const res = {
          field: i,
          key: 'file' + i,
          label: item
        }
        if (docs[item] !== null) {
          res.name = docs[item]
        }
        return res
      })
      return data
    },
    async hapus(field, doc) {
      const ask = confirm('yakin mau hapus dokumen ?')
      if (ask) {
        const apiUrl =
          process.env.API_URL +
          '/documents/' +
          doc +
          '/' +
          this.userID +
          '/' +
          field
        console.log(apiUrl)
        const delDocument = await axios.delete(apiUrl)
        if (delDocument) {
          const data = await this.fetchDocument(this.query.uid)
          if (data) {
            console.log(delDocument)
            this.notFound = false
            this.success = true
            this.message = delDocument.data.message
            this.documents = data
          }
        }
      }
    },
    async fetchUser(userID) {
      const apiUrl = process.env.API_URL + '/recipients/' + userID
      const { data } = await axios.get(apiUrl)
      if (data.length > 0) {
        this.user = data
      } else {
        this.notFound = true
      }
    }
  }
}
</script>
