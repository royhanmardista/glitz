import Vue from 'vue'
import Vuex from 'vuex'
import server from '@/api/server.js'
import router from '@/router'

Vue.use(Vuex)

function initialState () {
  return {
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
    searchingCity: false,
    jobDetail: null,
    internalJob: null,
    companyDetail: null,
    isSearchingUser: false,
    universities: [{
      text: 'Select University',
      value: null
    }],
    userProfile: null,
    companies: null,
    addToFavoriteLoading: false,
    applyingJob: false,
    searchingUserCompany: false,
    deletingJob: false,
    updatingApplicantStatus: false,
    updatingJob: false,
    creatingJob: false,
    updatingCompany: false,
    deletingCompany: false,
    creatingCompany: false
  }
}

export default new Vuex.Store({
  state: initialState(),
  mutations: {
    RESET (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    SET_CREATING_COMPANY (state, payload) {
      state.creatingCompany = payload
    },
    SET_UPDATING_COMPANY (state, payload) {
      state.updatingCompany = payload
    },
    SET_CREATING_JOB (state, payload) {
      state.creatingJob = payload
    },
    SET_UPDATING_JOB (state, payload) {
      state.updatingJob = payload
    },
    SET_DELETING_JOB (state, payload) {
      state.deletingJob = payload
    },
    SET_SEARCHING_USER_COMPANY (state, payload) {
      state.searchingUserCompany = payload
    },
    SET_APPLYING_JOB (state, payload) {
      state.applyingJob = payload
    },
    SET_JOBDETAIL (state, job) {
      state.jobDetail = job
      if (state.jobDetail) {
        let locationArray = job.location.trim().split(',')
        state.jobDetail.country = `${locationArray[locationArray.length - 2].trim()},${locationArray[locationArray.length - 1]}`
        state.jobDetail.region = locationArray[1]
        state.jobDetail.city = locationArray[0]
      }
    },
    SET_SEARCHING_CITY (state, payload) {
      state.searchingCity = payload
    },
    SET_SEARCHING_REGION (state, payload) {
      state.searchingRegion = payload
    },
    SET_LOCATION (state, locations) {
      state.locations = locations
    },
    CHECK_LOGIN (state) {
      if (localStorage.getItem('token')) {
        state.isLogin = true
      } else {
        state.isLogin = false
      }
    },
    SET_ISLOGIN (state, payload) {
      state.isLogin = payload
    },
    SET_LOGGED_USER (state, user) {
      state.loggedUser = user
    },
    SET_ISLOADING (state, payload) {
      state.isLoading = payload
    },
    SET_EXTERNAL_JOBS (state, jobs) {
      let {
        github,
        themuse
      } = jobs
      state.github = github
      state.themuse = themuse || []
      state.isLoading = false
    },
    SET_USER_COMPANY (state, data) {
      state.userCompany = data.company
      if (state.userCompany) {
        let locationArray = data.company.location.trim().split(',')
        state.userCompany.country = `${locationArray[locationArray.length - 2].trim()},${locationArray[locationArray.length - 1]}`
        state.userCompany.region = locationArray[1]
        state.userCompany.city = locationArray[0]
        state.userCompany.jobs = data.jobs
      }
    },
    SET_REGIONS (state, regions) {
      state.regions = regions
    },
    SET_CITIES (state, cities) {
      state.cities = cities
    },
    SET_INTERNALJOB (state, jobs) {
      state.internalJob = jobs
    },
    SET_COMPANY_DETAIL (state, data) {
      let {
        company,
        jobs
      } = data
      state.companyDetail = company
      state.companyDetail.jobs = jobs
    },
    SET_USER_PROFILE (state, data) {
      state.userProfile = data
    },
    SET_SEARCHING_USER (state, payload) {
      state.isSearchingUser = payload
    },
    SET_UNIVERSITIES (state, payload) {
      state.universities = payload
    },
    SET_COMPANIES (state, data) {
      state.companies = data
    },
    SET_ADD_TO_FAVORITE_LOADING (state, payload) {
      state.addToFavoriteLoading = payload
    },
    SET_UPDATING_APPLICANT_STATUS (state, payload) {
      state.updatingApplicantStatus = payload
    },
    SET_DELETING_COMPANY (state, payload) {
      state.deletingCompany = payload
    },
    SET_EMPTY_USER_COMPANY (state) {
      state.userCompany = null
    }
  },
  actions: {
    async updateApplicantStatus ({
      commit
    }, applicant) {
      try {
        let {
          jobId,
          applicantId,
          status
        } = applicant
        commit('SET_UPDATING_APPLICANT_STATUS', true)
        let {
          data
        } = await server.patch(`/jobs/${jobId}/applicant`, {
          applicant: applicantId._id,
          status
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_JOBDETAIL', data.job)
        this._vm.$alertify.success(data.message)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_UPDATING_APPLICANT_STATUS', false)
      }
    },
    async searchCompany ({
      commit
    }, form) {
      let {
        description,
        country
      } = form
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get('/companies/search', {
          params: {
            description,
            country
          },
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_COMPANIES', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async removeFromFavorite ({
      commit
    }, jobId) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.patch('/remove/favorite', {
          jobId
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        this._vm.$alertify.success(data.message)
        commit('SET_LOGGED_USER', data.user)
      } catch (err) {
        console.log(err.response)
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async addToFavorite ({
      commit
    }, jobId) {
      try {
        commit('SET_ADD_TO_FAVORITE_LOADING', true)
        let {
          data
        } = await server.patch('/favorite', {
          jobId
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        this._vm.$alertify.success(data.message)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ADD_TO_FAVORITE_LOADING', false)
      }
    },
    async cancelApplication ({
      commit
    }, jobId) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.patch(`/jobs/${jobId}/misapply`, {}, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        this._vm.$alertify.success(data.message)
        commit('SET_LOGGED_USER', data.user)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
        if (err.response.status === 405) {
          router.push(`/profile/${state.loggedUser._id}`)
        }
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async applyJob ({
      commit,
      state
    }, jobId) {
      try {
        commit('SET_APPLYING_JOB', true)
        let {
          data
        } = await server.patch(`/jobs/${jobId}/apply`, {}, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        this._vm.$alertify.success(data.message)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
        if (err.response.status === 405) {
          router.push(`/profile/${state.loggedUser._id}`)
        }
      } finally {
        commit('SET_APPLYING_JOB', false)
      }
    },
    async updateProfile ({
      commit,
      state
    }, payload) {
      let {
        education,
        skills,
        birthDate
      } = payload
      let {
        fullname,
        description,
        phone,
        location,
        experience
      } = state.userProfile
      try {
        commit('SET_ISLOADING', true)
        console.log(location)
        let {
          data
        } = await server.put(`/profile`, {
          education,
          skills,
          birthDate,
          fullname,
          description,
          phone,
          location,
          experience
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        let {
          user,
          userDetail,
          message
        } = data
        userDetail.email = user.email
        userDetail.username = user.username
        userDetail.appliedJob = user.appliedJob
        commit('SET_USER_PROFILE', userDetail)
        this._vm.$alertify.success(message)
        router.push(`/profile/${userDetail.userId}`)
      } catch (err) {
        if (Array.isArray(err.response.data.message)) {
          this._vm.$alertify.error(err.response.data.message.join(', '))
        } else {
          this._vm.$alertify.error(err.response.data.message)
        }
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async createProfile ({
      commit,
      dispatch
    }, data) {
      try {
        commit('SET_ISLOADING', true)
        let response = await server.post('/profile', data, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        let {
          user,
          userDetail,
          message
        } = response.data
        userDetail.email = user.email
        userDetail.username = user.username
        userDetail.appliedJob = user.appliedJob
        commit('SET_USER_PROFILE', userDetail)
        this._vm.$alertify.success(message)
      } catch (err) {
        if (Array.isArray(err.response.data.message)) {
          this._vm.$alertify.error(err.response.data.message.join(', '))
        } else {
          this._vm.$alertify.error(err.response.data.message)
        }
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async getUniversities ({
      commit
    }, country) {
      try {
        commit('SET_UNIVERSITIES', [{
          text: 'Loading ....',
          value: null
        }])
        let {
          data
        } = await server.get('/profile/universities', {
          headers: {
            token: localStorage.getItem('token')
          },
          params: {
            country
          }
        })
        commit('SET_UNIVERSITIES', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
        commit('SET_UNIVERSITIES', [{
          text: 'No data found ..',
          value: null
        }])
      } finally {}
    },
    async findUseProfile ({
      commit
    }, userId) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get(`/profile/${userId}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        let {
          user,
          userDetail
        } = data
        userDetail.email = user.email
        userDetail.username = user.username
        userDetail.appliedJob = user.appliedJob
        commit('SET_USER_PROFILE', userDetail)
      } catch (err) {
        commit('SET_USER_PROFILE', null)
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async findUser ({
      commit
    }) {
      commit('SET_SEARCHING_USER', true)
      try {
        const {
          data
        } = await
        server.get('user', {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        if (data) {
          commit('SET_LOGGED_USER', data)
        }
      } catch (err) {
        localStorage.removeItem('token')
        commit('CHECK_LOGIN')
        commit('RESET')
        router.push('/')
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_SEARCHING_USER', false)
      }
    },
    async getCompanyDetail ({
      commit
    }, companyId) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get(`companies/${companyId}`)
        commit('SET_COMPANY_DETAIL', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async searchInternalJob ({
      commit
    }, form) {
      let {
        description,
        minExp,
        country,
        skills
      } = form
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get('/jobs/search/glintzzz', {
          params: {
            description,
            minExp,
            country,
            skills
          },
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_INTERNALJOB', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async updateJob ({
      commit,
      state
    }, payload) {
      try {
        commit('SET_UPDATING_JOB', true)
        let {
          location,
          skills
        } = payload
        let {
          data
        } = await server.put(`/jobs/${state.jobDetail._id}`, {
          name: state.jobDetail.name,
          location,
          description: state.jobDetail.description,
          skills,
          minExp: state.jobDetail.minExp
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_USER_COMPANY', data)
        this._vm.$alertify.success(data.message)
        router.push('/mycompany')
      } catch (err) {
        if (Array.isArray(err.response.data.message)) {
          this._vm.$alertify.error(err.response.data.message.join(', '))
        } else {
          this._vm.$alertify.error(err.response.data.message)
        }
      } finally {
        commit('SET_UPDATING_JOB', false)
      }
    },
    async findJobDetail ({
      commit
    }, jobId) {
      try {
        commit('SET_ISLOADING', true)
        let {
          data
        } = await server.get(`/jobs/${jobId}`)
        commit('SET_JOBDETAIL', data)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_ISLOADING', false)
      }
    },
    async updateCompany ({
      commit,
      dispatch,
      state
    }, location) {
      try {
        commit('SET_UPDATING_COMPANY', true)
        let {
          data
        } = await server.put(`/companies/${state.userCompany._id}`, {
          name: state.userCompany.name,
          location,
          description: state.userCompany.description,
          url: state.userCompany.url,
          category: state.userCompany.category
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_USER_COMPANY', data)
        this._vm.$alertify.success(data.message)
        router.push('/mycompany')
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
        commit('SET_UPDATING_COMPANY', false)
      }
    },

    async deleteJob ({
      commit,
      dispatch
    }, jobId) {
      try {
        commit('SET_DELETING_JOB', true)
        let {
          data
        } = await server.delete(`/jobs/${jobId}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_USER_COMPANY', data)
        this._vm.$alertify.success(data.message)
      } catch (err) {
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_DELETING_JOB', false)
      }
    },
    async createJob ({
      commit,
      dispatch
    }, form) {
      let {
        name,
        skills,
        minExp,
        description,
        companyId,
        location
      } = form
      try {
        commit('SET_CREATING_JOB', true)
        let {
          data
        } = await server.post(`/jobs/${companyId}`, {
          name,
          skills,
          minExp,
          description,
          location
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        commit('SET_USER_COMPANY', data)
        this._vm.$alertify.success(data.message)
        router.push('/mycompany')
      } catch (err) {
        if (Array.isArray(err.response.data.message)) {
          this._vm.$alertify.error(err.response.data.message.join(', '))
        } else {
          this._vm.$alertify.error(err.response.data.message)
        }
      } finally {
        commit('SET_CREATING_JOB', false)
      }
    },
    async deleteCompany ({
      commit
    }, companyId) {
      try {
        commit('SET_DELETING_COMPANY', true)
        let {
          data
        } = await server.delete(`/companies/${companyId}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        this._vm.$alertify.success(data.message)
        commit('SET_EMPTY_USER_COMPANY')
        router.push('/home')
      } catch (err) {
        console.log(err)
        this._vm.$alertify.error(err.response.data.message)
      } finally {
        commit('SET_DELETING_COMPANY', false)
      }
    },
    async createCompany ({
      commit
    }, form) {
      try {
        commit('SET_CREATING_COMPANY', true)
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
        commit('SET_USER_COMPANY', data)
        this._vm.$alertify.success(data.message)
      } catch (err) {
        if (Array.isArray(err.response.data.message)) {
          this._vm.$alertify.error(err.response.data.message.join(', '))
        } else {
          this._vm.$alertify.error(err.response.data.message)
        }
      } finally {
        commit('SET_CREATING_COMPANY', false)
      }
    },
    async getCities ({
      commit
    }, payload) {
      let {
        country,
        region
      } = payload
      try {
        commit('SET_CITIES', [{
          text: 'Loading ....',
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
          text: 'No data found ..',
          value: null
        }])
      } finally {
        commit('SET_SEARCHING_CITY', false)
      }
    },

    async getRegions ({
      commit
    }, country) {
      try {
        commit('SET_SEARCHING_REGION', true)
        commit('SET_REGIONS', [{
          text: 'Loading ....',
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
          text: 'No data found ..',
          value: null
        }])
      } finally {
        commit('SET_SEARCHING_REGION', false)
      }
    },
    async searchUserCompany ({
      commit
    }) {
      try {
        commit('SET_SEARCHING_USER_COMPANY', true)
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
        commit('SET_SEARCHING_USER_COMPANY', false)
      }
    },
    async getLocation ({
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
    async searchJob ({
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
