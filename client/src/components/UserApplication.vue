<template>
  <div class>
    <div v-if="!isLoading  && loggedUser.appliedJob" class="container-fluid">
      <!-- job container -->
      <div class="row mt-5 mx-1">
        <!-- job container start -->
        <div class="col-md-10 offset-md-1">
          <h1 class="text-center">My Applications</h1>
          <!-- loggedUser.appliedJob container start -->
          <h4
            class
            style="cursor: pointer"
            v-b-toggle.application-collapse
          >You Have Applied {{loggedUser.appliedJob.length}} Jobs</h4>
          <b-collapse class="container-fluid" id="application-collapse" :visible="true">
            <!-- spinner start -->
            <div v-if="isLoading">
              <div class="text-center d-flex justify-content-center">
                <b-spinner type="grow" label="Loading..."></b-spinner>
              </div>
            </div>
            <!-- spinner end -->
            <div class="row table-responsive-xs mt-4">
              <table class="table table-hover">
                <thead class="thead-light">
                  <tr>
                    <th>Job Name</th>
                    <th>Company Name</th>
                    <th>Applicants</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="job in loggedUser.appliedJob"
                    :key="job.jobId._id"
                    class="border-bottom"
                  >
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
                  </tr>
                </tbody>
              </table>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserApplication",
  computed: {
    ...mapState(["loggedUser", "isLoading"])
  },
  data() {
    return {};
  },
  methods: {
    showJobDetail(job) {
      this.$router.push(`/jobs/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    },
    showCompanyDetail(company) {
      this.$router.push(`/company/${company._id}`);
      this.$store.dispatch("getCompanyDetail", company._id);
    },
    cancelApplication(jobId) {
      this.$store.dispatch("cancelApplication", jobId);
    }
  },
  created() {
    this.$store.dispatch("findUser");
  }
};
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
  font-size: 1.2rem
}

th {
  font-family: "Oswald", sans-serif;
}
</style>