import Vue from 'vue'
import Vuex from 'vuex'
import server from '@/api/server.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    github : [],
    themuse : [],
    jobs : [],
    isLoading : false
  },
  mutations: {
    SET_ISLOADING(state, payload) {
      state.isLoading = payload
    }, 
    SET_EXTERNAL_JOBS(state, jobs) {
      let { github, themuse } = jobs
      state.github = github
      state.themuse = themuse || []      
      state.isLoading = false
    }
  },
  actions: {
    async searchJob({commit}, form) {
      commit('SET_EXTERNAL_JOBS', {github : [], themuse : []} )
      let { description, location, category } = form
      try {
        commit('SET_ISLOADING', true)
        let { data } = await server.get('/jobs/search', {
          params : {
            location,
            description,
            category,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        commit('SET_EXTERNAL_JOBS', data)        
      } catch(err) {
        console.log(err)
        commit('SET_ISLOADING', false)
      }      
    }
  },
  modules: {
  }
})
