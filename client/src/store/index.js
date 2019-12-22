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
    isLogin: false,
    loggedUser: {},
    locations: [{ text: "Select Country", value: null }],
    userCompany: null,
    regions : [{ text: "Select Regions", value: null }],
    searchingRegion : false,
  },
  mutations: {
    SET_SEARCHING_REGION(state, payload) {
      state.searchingRegion = payload
    },
    SET_LOCATION(state, locations) {
      state.locations = locations
    },
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
    SET_LOGGED_USER(state, user) {
      state.loggedUser = user
      state.isLoading = false
    },
    SET_ISLOADING(state, payload) {
      state.isLoading = payload
    },
    SET_EXTERNAL_JOBS(state, jobs) {
      let {
        github,
        themuse
      } = jobs
      state.github = github
      state.themuse = themuse || []
      state.isLoading = false
    },
    SET_USER_COMPANY(state, company) {
      state.userCompany = company
    },
    SET_REGIONS(state, regions) {
      state.regions = regions
    }
  },
  actions: {
    async getRegions({
      commit
    }, region) {
      try {
        commit('SET_SEARCHING_REGION', true)

        let {
          data
        } = await server.get('/jobs/regions', {
          params : {
            region,
          }
        })
        commit('SET_REGIONS', data)

      } catch (err) {
        console.log(err)
      } finally {
        commit('SET_SEARCHING_REGION', false)

      }

    },
    async searchUserCompany({
      commit
    }) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get('/companies/user', {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_USER_COMPANY', data)
      } catch (err) {
        console.log(err)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async getLocation({
      commit
    }) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get('/jobs/country')
        commit('SET_LOCATION', data)
      } catch (err) {
        console.log(err)
        this.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async searchJob({
      commit
    }, form) {
      commit('SET_EXTERNAL_JOBS', {
        github: [],
        themuse: []
      })
      let {
        description,
        location,
        category
      } = form
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get('/jobs/search', {
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
  modules: {}
})
