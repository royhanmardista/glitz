<template>
  <div class>
    <div class="container-fluid">
      <div class="row mt-5 mx-1">
        <!-- job container start -->
        <div class="col-md-10 offset-md-1">
          <h1 class="text-center">My Applications</h1>
          <!-- spinner -->
          <div v-if="isSearchingUser" class="text-center">
            <BeatLoader :size="10" color="#0A81D1"></BeatLoader>
          </div>
          <!-- loggedUser.appliedJob container start -->
          <div v-if="loggedUser.appliedJob">
            <h5
              class
              style="cursor: pointer"
              v-b-toggle.application-collapse
            >You Have Applied {{loggedUser.appliedJob.length}} Jobs</h5>
            <b-collapse class="" id="application-collapse" :visible="true">
              <div class="table-responsive" v-if="loggedUser.appliedJob.length">
                <table class="table table-hover">
                  <thead class="thead-light">
                    <tr>
                      <th>No</th>
                      <th>Job Name</th>
                      <th>Company Name</th>
                      <th>Applicants</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(job, index) in loggedUser.appliedJob"
                      :key="job.jobId._id"
                      class="border-bottom"
                    >
                      <td>{{index + 1}}</td>
                      <td style="cursor:pointer">
                        <a @click.prevent="showJobDetail(job.jobId)">{{job.jobId.name}}</a>
                      </td>
                      <td style="cursor:pointer">
                        <a
                          @click.prevent="showCompanyDetail(job.jobId.companyId)"
                        >{{job.jobId.companyId.name}}</a>
                      </td>
                      <td>{{job.jobId.applicants.length}}</td>
                      <td>{{job.status}}</td>
                      <td>
                        <i
                          v-b-tooltip.hover
                          title="Cancel application"
                          @click="cancelApplication(job.jobId._id)"
                          class="fa fa-ban"
                          style="cursor:pointer;"
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
    <!-- modal start -->
    <b-modal v-model="isLoading" centered hide-header content-class="shadow" hide-footer size="sm">
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-info">Canceling Application ...</h5>
        </div>
        <div class="mx-auto my-5">
          <RotateLoader color="#5BC0EB"></RotateLoader>
        </div>
      </div>
    </b-modal>
  </div>
</template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { BeatLoader } from '@saeris/vue-spinners'

export default {
  name: 'UserApplication',
  components: {
    BeatLoader
  },
  computed: {
    ...mapState(['loggedUser', 'isSearchingUser', 'isLoading'])
  },
  data () {
    return {}
  },
  methods: {
    showJobDetail (job) {
      this.$router.push(`/jobs/${job._id}`)
      this.$store.commit('SET_JOBDETAIL', job)
    },
    showCompanyDetail (company) {
      this.$router.push(`/company/${company._id}`)
      this.$store.dispatch('getCompanyDetail', company._id)
    },
    cancelApplication (jobId) {
      this.$store.dispatch('cancelApplication', jobId)
    }
  },
  created () {
    this.$store.dispatch('findUser')
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Lateef&display=swap");
#cancelApplication:hover {
  color: red;
}
a:hover {
  color: rgb(37, 82, 189) !important;
  text-decoration: none;
}
a {
  color: blue !important;
}

td {
  font-family: "Lateef", cursive;
  font-size: 1.4rem;
}

th {
  font-family: "Oswald", sans-serif;
}

.fa-ban:hover {
  color: red;
}
</style>
