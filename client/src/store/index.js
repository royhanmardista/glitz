import Vue from 'vue'
import Vuex from 'vuex'
import server from '@/api/server.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    github: null,
    themuse: null,
    jobs: [],
    isLoading: false,
    isLogin : false,
    loggedUser : {},
  },
  mutations: {
    CHECK_LOGIN(state) {
      if (localStorage.getItem('token')) {
        state.isLogin = true
      } else {
        state.isLogin = false
      }
    },
    SET_ISLOGIN(state, payload) {
      state.isLogin = payload
    },
    SET_LOGGED_USER (state, user) {
      state.loggedUser = user
      state.isLoading = false
    },
    SET_ISLOADING (state, payload) {
      state.isLoading = payload
    },
    SET_EXTERNAL_JOBS (state, jobs) {
      let { github, themuse } = jobs
      state.github = github
      state.themuse = themuse || []
      state.isLoading = false
    }
  },
  actions: {
    async searchJob ({ commit }, form) {
      commit('SET_EXTERNAL_JOBS', { github: [], themuse: [] })
      let { description, location, category } = form
      try {
        commit('SET_ISLOADING', true)
        let { data } = await server.get('/jobs/search', {
          params: {
            location,
            description,
            category
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        commit('SET_EXTERNAL_JOBS', data)
      } catch (err) {
        console.log(err)
        commit('SET_ISLOADING', false)
      }
    }
  },
  modules: {
  }
})
