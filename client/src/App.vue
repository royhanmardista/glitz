<template>
  <div id="app">
    <div id="nav">
      <div class="frontpage">
        <div class="sticky-top">
          <nav
            class="navbar navbar-expand-md d-flex justify-content-between pt-1"
            :class="{'navbarcolor' : !isLogin, 'bg-light' : isLogin}"
          >
            <div class="nav navbar d-flex justify-content-start ml-1">
                <a class="navbar-brand nav-bar-title">
                  <router-link to='/' v-if="!isLogin">
                    <i class="fa fa-star"></i> Glintzzz
                  </router-link>
                  <router-link to='/home' v-if="isLogin">
                    <i class="fa fa-star"></i> Glintzzz
                  </router-link>
                </a>
            </div>
            <b-navbar-toggle class target="nav-collapse">
              <i class="fa fa-align-justify"></i>
            </b-navbar-toggle>
            <!-- <b-collapse id="nav-collapse" is-nav></b-collapse> -->
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item v-if="isLogin" class="nav-item">
                  <router-link to="/jobs">Jobs</router-link>
                </b-nav-item>
                <b-nav-item v-if="isLogin" class="nav-item">
                  <router-link to="/company">Company</router-link>
                </b-nav-item>
                <b-nav-item v-if="isLogin" class="nav-item">
                  <router-link to="/favorites">Favorites</router-link>
                </b-nav-item>
              </b-navbar-nav>
              <b-navbar-nav class="ml-auto">
                <b-nav-item v-if="!isLogin" class="nav-item" v-b-modal.modal-login>Login</b-nav-item>
                <b-nav-item v-if="!isLogin" class="nav-item">
                  <router-link to="/register">Register</router-link>
                </b-nav-item>

                <b-nav-item v-if="isLogin && loggedUser.username" class="nav-item">
                  <b-dropdown
                    variant="light"
                    :text="`Hello, ${loggedUser.username}`"
                    class="m-md-2"
                  >
                    <b-dropdown-item >
                      <div class="d-flex justify-content-between">
                        <router-link :to="`/profile/${loggedUser._id}`">My Profile</router-link>
                        <div>
                          <i class="fa fa-user"></i>
                        </div>
                      </div>
                    </b-dropdown-item>
                    <b-dropdown-item @click.prevent="logout">
                      <div class="d-flex justify-content-between">
                        <div>Signout</div>
                        <div>
                          <i class="fa fa-power-off"></i>
                        </div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown>
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </nav>
        </div>
      </div>
    </div>
    <LoginModal></LoginModal>
    <router-view></router-view>
  </div>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['isLogin', 'loggedUser'])
  },
  components: {
    LoginModal: LoginModal
  },
  methods: {
    toRegister () {
      this.$router.push('/register')
    },
    logout () {
      localStorage.removeItem('token')
      this.$store.commit('CHECK_LOGIN')
      this.$store.commit('RESET')
      this.$router.push('/')
    },
    async checkLogin () {
      await this.$store.commit('CHECK_LOGIN')
      if (localStorage.getItem('token')) {
        await this.$store.dispatch('findUser')
      }
    }
  },
  created () {
    this.checkLogin()
  }
}
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 0px;
  margin: 0px;
}

#nav a {
  font-weight: 600;
  color: #131101;
}

#nav a:hover {
  color: #11172b;
  text-decoration: none;
  transition-delay: 1s;
}

#nav a.router-link-exact-active {
  color: #38128a;
  font-weight: 900;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: "Oswald", sans-serif;
}


</style>
