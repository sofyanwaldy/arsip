<template>
  <v-layout>
    <v-row justify="center" align="center" class="mb-6">
      <v-col md="6">
        <v-alert v-if="message" :color="messageColor">
          {{ message }}
        </v-alert>
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="password"
            type="password"
            label="password"
            required
          ></v-text-field>

          <v-text-field
            v-model="passwordConfirm"
            type="password"
            label="konfirmasi password"
            required
          ></v-text-field>

          <v-btn color="danger" block class="mr-4" @click="change">
            Ubah Password
          </v-btn>
        </v-form>
        <br />
        <v-btn color="warning" block class="text-right" @click="logout">
          logout
        </v-btn>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import axios from 'axios'

export default {
  // middleware: 'auth',
  data() {
    return {
      password: '',
      passwordConfirm: '',
      message: false,
      messageColor: 'success'
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/')
      } catch (e) {
        this.formError = e.message
      }
    },
    async change() {
      if (this.password !== this.passwordConfirm) {
        this.messageColor = 'error'
        this.message = 'konfirmasi pasword tidak sesuai'
      } else {
        const apiUrl = process.env.API_URL + '/editpass'
        const { data } = await axios.post(apiUrl, { password: this.password })
        if (data) {
          this.messageColor = 'success'
          this.message = data.message
        }
      }
    }
  }
}
</script>
