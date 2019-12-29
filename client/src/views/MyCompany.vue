<template>
  <div class="bg-light border-top" style="min-height:700px">
    <div class="container">
      <div class="row">
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <HashLoader color="#182825" :size="100"></HashLoader>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && userCompany" class="mt-5 mx-1">
      <div class="container-fluid" v-if="!showPostJob">
        <div class="row">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border border-light d-flex flex-column justify-content-between bg-light"
          >
            <div>
              <h1>{{userCompany.name}}</h1>
            </div>
            <div class="d-flex justify-content-between text-secondary border-bottom">
              <div class="d-flex justify-content-between flex-column">
                <p>
                  <i class="fa fa-location-arrow"></i>
                  {{userCompany.location}}
                </p>
                <p>
                  <i class="fa fa-industry"></i>
                  {{userCompany.category}}
                </p>
              </div>
              <div>
                <b-link :href="userCompany.url" target="blank">
                  <i class="fa fa-link"></i>
                  {{userCompany.url}}
                </b-link>
                <p>
                  <i class="fa fa-clock-o"></i>
                  last update {{moment(userCompany.updatedAt).fromNow()}}
                </p>
              </div>
            </div>
            <div class="ml-auto mt-2">
              <b-button class="mr-2" variant="info" size="lg" @click.prevent="updateCompany()">
                <h4>Update Company</h4>
              </b-button>
              <b-button
                class="mr-2"
                variant="warning"
                size="lg"
                @click.prevent="postJob(userCompany._id)"
              >
                <h4>Post Job</h4>
              </b-button>
              <b-button variant="danger" size="lg" @click.prevent="deleteCompany()">
                <h4>Delete Company</h4>
              </b-button>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border border-light d-flex flex-column justify-content-between bg-white"
          >
            <h3>Description</h3>
            <p>{{userCompany.description}}</p>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border border-light d-flex flex-column justify-content-between bg-white"
          >
            <h3>Jobs</h3>
            <p
              v-if="!userCompany.jobs.length"
            >You haven't post any job, post a job to attract people to your company</p>
            <p
              class="border-bottom"
              v-if="userCompany.jobs.length"
            >You have posted {{userCompany.jobs.length}} jobs</p>
            <div v-for="job in userCompany.jobs" :key="job._id" class="border-bottom mt-3">
              <h5 class="mb-3 ml-3">{{job.name}}</h5>
              <p>
                <i class="fa fa-map-signs"></i>
                {{job.location}}
              </p>
              <p>
                <i class="fa fa-users"></i>
                {{job.applicants.length}} has applied to this job
              </p>
              <p class="mb-3">
                <i class="fa fa-clock-o"></i>
                last update {{moment(job.updatedAt).fromNow()}}
              </p>
              <div class="d-flex justify-content-end py-3 border-top">
                <b-button
                  class="mr-2"
                  variant="primary"
                  size="sm"
                  @click.prevent="showJobDetail(job)"
                >
                  <i class="fa fa-search-plus"></i> Details
                </b-button>
                <b-button class="mr-2" variant="info" size="sm" @click.prevent="showJobUpdate(job)">
                  <i class="fa fa-repeat"></i> Update Job
                </b-button>
                <b-button
                  class="mr-2"
                  variant="danger"
                  size="sm"
                  @click.prevent="deleteJob(job._id)"
                >
                  <i class="fa fa-trash-o"></i> Delete Job
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view />
    </div>
    <AddCompanyForm v-if="!userCompany"></AddCompanyForm>
  </div>
</template>

<script>
import AddCompanyForm from '@/components/AddCompanyForm.vue'
import { mapState } from 'vuex'
import { HashLoader } from '@saeris/vue-spinners'

export default {
  computed: {
    ...mapState(['userCompany', 'isLoading'])
  },
  components: {
    AddCompanyForm,
    HashLoader
  },
  data () {
    return {
      showPostJob: false
    }
  },
  methods: {
    showJobUpdate (job) {
      this.$router.push(`jobs/update/${job._id}`)
      this.$store.commit('SET_JOBDETAIL', job)
    },
    showJobDetail (job) {
      this.$router.push(`jobs/${job._id}`)
      this.$store.commit('SET_JOBDETAIL', job)
    },
    async deleteJob (id) {
      this.$alertify
        .confirm(
          () => this.$alertify.success('ok'),
          () => this.$store.dispatch('deleteJob', id)
        )
        .setHeader(
          '<h1 class=" text-warning"> <i class="fa fa-question-circle"></i> Warning !!!</h1> '
        )
        .setContent(
          '<h5 class="text-justify" style="min-height:100px"> Are you sure, you want to delete this job ? you cannot revert this !!! </h5>'
        )
        .show()
    },
    async updateCompany () {
      this.$router.push('/company/update')
    },
    async reload () {
      if (this.$router.currentRoute.fullPath !== '/mycompany') {
        this.showPostJob = true
      } else {
        this.showPostJob = false
      }
    },
    async postJob (companyId) {
      this.showPostJob = true
      this.$router.push(`/mycompany/${companyId}`)
    },
    async searchCompany () {
      await this.$store.dispatch('searchUserCompany')
      await this.$store.dispatch('getLocation')
    }
  },
  created () {
    this.searchCompany()
    this.reload()
  },
  beforeRouteUpdate (to, from, next) {
    this.searchCompany()
    if (to.fullPath !== '/mycompany') {
      this.showPostJob = true
    } else {
      this.showPostJob = false
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.showPostJob = true
    next()
  }
}
</script>

<style scoped>
p {
  margin: 0.5rem 1rem;
  font-family: "Gothic A1", sans-serif;
}
</style>
