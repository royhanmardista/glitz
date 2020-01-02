<template>
  <div>
    <b-modal
      id="modal-login"
      ref="login-modal"
      @show="resetModal"
      @hidden="resetModal"
      hide-footer
      header-text-variant="primary"
      footer-border-variant="warning"
      content-class="shadow"
    >
      <template v-slot:modal-title>
        <h4>Sign in to your account</h4>
      </template>
      <div v-if="errorMessage" class="text-center">
        <h2 class="text-danger">
          <i class="fa fa-times-circle-o"></i> Opps !!!
        </h2>
        <p class="text-danger border rounded p-2 mx-2 border-danger">{{errorMessage}}</p>
      </div>
      <form ref="form" class="p-2">
        <!-- email -->
        <div class="form-group input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-envelope"></i>
            </span>
          </div>
          <input
            name
            id="email"
            class="form-control"
            placeholder="Email address"
            v-model="email"
            type="email"
          />
        </div>
        <!-- email end  -->

        <!-- password start -->
        <div class="form-group input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-lock mr-1 pl-1"></i>
            </span>
          </div>
          <input
            id="password"
            class="form-control"
            placeholder="Create password"
            type="password"
            v-model="password"
          />
        </div>
        <!-- form-group// -->
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block" @click.prevent="login">
            <b-spinner small v-if="loginLoading" variant="light" label="Spinning"></b-spinner>
            <span v-if="!loginLoading">Signin</span>
          </button>
        </div>
        <!-- password end -->
      </form>
      <!-- <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button> -->
    </b-modal>
  </div>
</template>

<script>
import server from '@/api/server'

export default {
  name: 'LoginModal',
  components: {},
  created () {},
  data () {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loginMessage: '',
      loginLoading: false
    }
  },
  methods: {
    success: function (message) {
      this.$alertify.success(message)
    },
    resetModal () {
      this.email = ''
      this.password = ''
      this.errorMessage = ''
    },
    async login () {
      this.errorMessage = ''
      this.loginLoading = true
      try {
        let { data } = await server.post('/login', {
          email: this.email,
          password: this.password
        })
        localStorage.setItem('token', data.token)
        this.success(data.message)
        this.$refs['login-modal'].hide()
        this.$store.commit('SET_LOGGED_USER', data.user)
        this.$store.commit('CHECK_LOGIN')
        this.$router.push('/home')
      } catch (err) {
        if (Array.isArray(err.response.data.message)) {
          this.errorMessage = err.response.data.message.join(', ')
        } else {
          this.errorMessage = err.response.data.message
        }
        this.$alertify.error(this.errorMessage)
      } finally {
        this.loginLoading = false
      }
    }
  }
}
</script>

<style scoped>
h4 {
  color: cornflowerblue
}
</style>
