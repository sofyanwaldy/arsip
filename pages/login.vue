<template>
  <v-container>
    <v-row justify="center" align="center" class="mb-6">
      <v-col md="6">
        <v-form ref="form" lazy-validation>
          <v-alert v-if="loginErr" type="warning">
            {{ loginErr }}
          </v-alert>
          <v-text-field
            v-model="username"
            :counter="10"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            type="password"
            label="password"
            required
          ></v-text-field>

          <v-btn color="danger" class="mr-4" @click="login">
            login
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      loginErr: false,
      username: '',
      password: ''
    }
  },
  layout: 'none',
  methods: {
    async login() {
      const res = await this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      })
      if (res.success === 1) {
        this.$router.push('/')
      } else {
        this.loginErr = res.message
      }
      this.username = ''
      this.password = ''
    }
  }
}
</script>
