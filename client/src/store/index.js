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
    locations: [{
      text: 'Select Country',
      value: null
    }],
    userCompany: null,
    regions: [{
      text: 'Select Regions',
      value: null
    }],
    cities: [{
      text: 'Select City',
      value: null
    }],
    searchingRegion: false,
    searchingCity: false
  },
  mutations: {
    SET_SEARCHING_CITY(state, payload) {
      state.searchingCity = payload
    },
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
    },
    SET_CITIES(state, cities) {
      state.cities = cities
    }
  },
  actions: {
    async createCompany({
      commit
    }, form) {
      try {
        commit('SET_ISLOADING', true)
        let {
          name,
          description,
          location,
          url,
          category
        } = form
        let {
          data
        } = await server.post('/companies', {
          name,
          description,
          location,
          url,
          category
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        console.log(data.company)
        commit('SET_USER_COMPANY', data.company)
        this._vm.$alertify.success(data.message)
      } catch (err) {
        console.log(err)
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async getCities({
      commit
    }, payload) {
      let {
        country,
        region
      } = payload
      try {
        commit('SET_CITIES', [{
          text: "Loading ....",
          value: null
        }])
        commit('SET_SEARCHING_CITY', true)
        let {
          data
        } = await server.get('/jobs/cities', {
          params: {
            country,
            region
          }
        })
        commit('SET_CITIES', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
        commit('SET_CITIES', [{
          text: "No data found ..",
          value: null
        }])
      } finally {
        commit('SET_SEARCHING_CITY', false)
      }
    },

    async getRegions({
      commit
    }, country) {
      try {
        commit('SET_SEARCHING_REGION', true)
        commit('SET_REGIONS', [{
          text: "Loading ....",
          value: null
        }])
        let {
          data
        } = await server.get('/jobs/regions', {
          params: {
            country
          }
        })
        commit('SET_REGIONS', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
        commit('SET_REGIONS', [{
          text: "No data found ..",
          value: null
        }])
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
        this._vm.$alertify.error(err.response.data.message)
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
        this._vm.$alertify.error(err.response.data.message)
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
        this._vm.$alertify.error(err.response.data.message)
        commit('SET_ISLOADING', false)
      }
    }
  },
  modules: {}
})
