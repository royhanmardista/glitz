<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 offset-md-4 col-sm-10 offset-sm-1 col-xs-10 offset-xs-1">
          <h5 class="text-center text-light">
            First, create your
            <span class="text-dark">Glintzzz.com</span> account.
          </h5>
          <form
            id="register"
            @submit.prevent="register"
            class="border rounded p-3 bg-white shadow mt-4"
          >
            <div v-if="errorMessage" class="text-center">
              <h2 class="text-danger">
                <i class="fa fa-times-circle-o"></i> Opps !!!
              </h2>
              <p class="text-danger border rounded p-2 mx-2 border-danger">{{errorMessage}}</p>
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                v-model="email_register"
                id="email"
                type="email"
                class="form-control"
                required
                placeholder="Email"
              />
            </div>
            <div class="form-group">
              <label for="username">Username</label>
              <input
                v-model="username_register"
                id="username"
                type="text"
                class="form-control"
                placeholder="Username"
                required
              />
            </div>
            <div class="form-group">
              <label for="password_register">Password</label>
              <input
                v-model="password_register"
                placeholder="Password"
                id="password"
                type="password"
                class="form-control"
                required
              />
            </div>
            <div class="form-inline" style="margin: 5px auto;">
              <button type="submit" class="btn btn-outline-primary btn-sm btn-block mt-2">
                <b-spinner small v-if="loginLoading" variant="light" label="Spinning"></b-spinner>
                <span v-if="!loginLoading">Register</span>
              </button>
            </div>
          </form>
          <p class="text-center text-white mt-2 mb-2">or you can register using:</p>
          <!-- google button -->
          <div class="row">
            <template>
              <g-signin-button
                class="btn btn-block btn-primary mx-3"
                :params="googleSignInParams"
                @success="onSignInSuccess"
                @error="onSignInError"
              >
                <i class="fa fa-google pr-2"></i>
                Sign in with Google
              </g-signin-button>
            </template>
          </div>
          <!-- google button end -->
          <p class="text-center mt-2 text-white" style="font-size:0.7rem">
            If you continue with Google and don't already have a Glintzzz account, you are creating an account and you agree to our
            <span
              class="text-danger"
            >Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GSignInButton from 'vue-google-signin-button'
import server from '@/api/server.js'

export default {
  components: {
    GSignInButton
  },
  data () {
    return {
      errorMessage: '',
      loginMessage: '',
      loginLoading: false,
      googleSignInParams: {
        client_id:
          '628697528399-tm5hqkb025uttnahfoj889flu2jg3hvm.apps.googleusercontent.com'
      },
      email_register: '',
      password_register: '',
      username_register: ''
    }
  },
  methods: {
    success: function (message) {
      this.$alertify.success(message)
    },
    async onSignInSuccess (googleUser) {
      let idToken = googleUser.getAuthResponse().id_token
      try {
        let { data } = await server.post('/login-google', {
          google_token: idToken
        })
        localStorage.setItem('token', data.token)
        this.success(data.message)
        this.$store.commit('SET_LOGGED_USER', data.user)
        this.$store.commit('CHECK_LOGIN')
        this.$router.push('/home')
      } catch (err) {
        this.$alertify.error(this.err.response.data.message)
      }
    },
    onSignInError (error) {
      console.log('OH NOES', error)
    },
    async register () {
      this.loginLoading = true
      try {
        let { data } = await server.post('/register', {
          username: this.username_register,
          email: this.email_register,
          password: this.password_register
        })
        this.success(data.message)

        this.$bvModal.show('modal-login')
      } catch (err) {
        console.log(err)
        this.errorMessage = err.response.data.message.join(', ')
        this.$alertify.error(this.errorMessage)
      } finally {
        this.loginLoading = false
      }
    },
    clearForm () {
      this.email_register = ''
      this.username_register = ''
      this.password_register = ''
    }
  },
  beforeCreate: function () {
    document.body.className = 'intro'
  }
}
</script>

<style>
</style>
