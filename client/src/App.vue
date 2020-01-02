<template>
  <div id="app">
    <div id="nav" class="sticky-top">
      <div class="frontpage">
        <div class>
          <nav
            class="navbar navbar-expand-md d-flex justify-content-between pt-1"
            :class="{'navbarcolor' : !isLogin, 'bg-light border-bottom' : isLogin}"
          >
            <div class="nav navbar d-flex justify-content-start m-0 p-0">
              <a class="navbar-brand nav-bar-title">
                <router-link to="/" v-if="!isLogin">
                  <i class="fa fa-star"></i> Glintzzz
                </router-link>
                <router-link to="/home" v-if="isLogin">
                  <i class="fa fa-star"></i> Glintzzz
                </router-link>
              </a>
            </div>
            <b-navbar-toggle class target="nav-collapse">
              <i class="fa fa-align-justify"></i>
            </b-navbar-toggle>
            <!-- <b-collapse id="nav-collapse" is-nav></b-collapse> -->
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav class>
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

                <b-nav-item v-if="isLogin && loggedUser.username" class="nav-item mx-auto ">
                  <b-dropdown
                    id="profile"
                    variant="light"
                    :text="`Hello, ${loggedUser.username}`"
                    class="m-md-2 "
                  >
                    <b-dropdown-item>
                      <div class="d-flex justify-content-between">
                        <router-link :to="`/profile/${loggedUser._id}`">My Profile</router-link>
                        <div>
                          <i class="fa fa-user-o"></i>
                        </div>
                      </div>
                    </b-dropdown-item>

                    <b-dropdown-item>
                      <div class="d-flex justify-content-between">
                        <router-link :to="`/applications/${loggedUser._id}`">Applied Job</router-link>
                        <div>
                          <i class="fa fa-files-o"></i>
                        </div>
                      </div>
                    </b-dropdown-item>
                    <b-dropdown-item>
                      <div class="d-flex justify-content-between">
                        <router-link :to="`/mycompany`">My Company</router-link>
                        <div>
                          <i class="fa fa-building-o ml-2"></i>
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
import LoginModal from "@/components/LoginModal.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["isLogin", "loggedUser"])
  },
  components: {
    LoginModal: LoginModal
  },
  methods: {
    toRegister() {
      this.$router.push("/register");
    },
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("CHECK_LOGIN");
      this.$store.commit("RESET");
      this.$router.push("/");
    },
    async checkLogin() {
      await this.$store.commit("CHECK_LOGIN");
      if (localStorage.getItem("token")) {
        await this.$store.dispatch("findUser");
      }
    }
  },
  created() {
    this.checkLogin();
  }
};
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

body.home {
  background: white;
}
body.intro {
  background: rgb(22, 88, 223);
  background: linear-gradient(
    90deg,
    rgba(22, 88, 223, 1) 0%,
    rgba(234, 234, 226, 1) 0%,
    rgba(211, 201, 194, 1) 0%,
    rgba(215, 215, 215, 1) 0%,
    rgba(170, 98, 57, 1) 0%,
    rgba(197, 197, 42, 1) 0%,
    rgba(226, 114, 46, 1) 0%,
    rgba(35, 210, 225, 1) 0%,
    rgba(29, 213, 229, 1) 18%,
    rgba(7, 198, 201, 1) 49%,
    rgba(14, 115, 138, 1) 100%,
    rgba(99, 135, 215, 1) 100%
  );
}
body.welcome {
  background: rgb(22, 88, 223);
  background: linear-gradient(
    90deg,
    rgba(22, 88, 223, 1) 0%,
    rgba(234, 234, 226, 1) 0%,
    rgba(211, 201, 194, 1) 0%,
    rgba(215, 215, 215, 1) 0%,
    rgba(170, 98, 57, 1) 0%,
    rgba(151, 200, 227, 1) 0%,
    rgba(123, 160, 227, 1) 26%,
    rgba(81, 141, 208, 1) 51%,
    rgba(39, 121, 216, 1) 78%,
    rgba(7, 118, 199, 1) 96%
  );
}
</style>
