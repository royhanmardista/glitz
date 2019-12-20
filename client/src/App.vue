<template>
  <div id="app">
    <div id="nav">
      <div class="frontpage">
        <div class="sticky-top">
          <nav class="navbarcolor navbar navbar-expand-md d-flex justify-content-between pt-1">
            <div class="nav navbar d-flex justify-content-start ml-1">
              <router-link to="/">
                <a class="navbar-brand nav-bar-title">
                  <i class="fa fa-star"></i> Glintz
                </a>
              </router-link>
            </div>
            <b-navbar-toggle class target="nav-collapse">
              <i class="fa fa-align-justify"></i>
            </b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav class="ml-auto">
                <b-nav-item class="nav-item" v-b-modal.modal-login>Login</b-nav-item>
                <b-nav-item class="nav-item" @click.prevent="toTest">Register</b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </nav>
        </div>
      </div>
    </div>
    <LoginModal></LoginModal>
    <router-view />
  </div>
</template>

<script>
import LoginModal from "@/components/LoginModal.vue";
export default {
  name: "App",
  components: {
    LoginModal: LoginModal
  },
  methods: {
    toTest() {
      this.$router.push("/test");
    }
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
  font-weight: bold;
  color: #010713;
}

#nav a.router-link-exact-active {
  color: #e0d3c9;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: "Oswald", sans-serif;
}
body {
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
</style>
