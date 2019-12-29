<template>
  <div class="">
    <div v-if="!isLoading && loggedUser.appliedJob" class="container-fluid">
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
          <b-collapse class id="application-collapse" :visible="true">
            <p>Page: {{ currentPage }}</p>
            <b-pagination
              v-model="currentPage"
              :total-rows="pageRows"
              :per-page="perPage"
              aria-controls="loggedUser.appliedJob"
            ></b-pagination>
            <!-- spinner start -->
            <div v-if="isLoading">
              <div class="text-center d-flex justify-content-center">
                <b-spinner type="grow" label="Loading..."></b-spinner>
              </div>
            </div>
            <!-- spinner end -->
            <div class="row" v-if="!isLoading">
              <div
                id="loggedUser.appliedJob"
                :per-page="perPage"
                :current-page="currentPage"
                class="col-md-4 col-xs-12 col-sm-12"
                v-for="job in loggedUser.appliedJob"
                :key="job._id"
              >
                <div
                  class="border rounded px-3 py-1 mb-3 d-flex flex-column justify-content-between"
                  style="min-height:200px"
                >
                  <div class="text-left d-flex justify-content-between">
                    <div class="d-flex flex-column justify-content-between mr-0">
                      <h5 class>
                        <a class="text-dark" href @click.prevent="showJobDetail(job)">{{job.name}}</a>
                      </h5>
                      <a href @click.prevent="showCompanyDetail(job.companyId)">
                        <i class="fa fa-building-o"></i>
                        {{job.companyId.name}}
                      </a>
                      <div class="d-flex mt-1">
                        <i class="fa fa-users mr-2"></i>
                        <p
                          class="text-secondary"
                          style="font-size:0.8rem"
                        >{{job.applicants.length}} applicants</p>
                      </div>
                      <div class="d-flex">
                        <i class="fa fa-map-marker mr-2" style></i>
                        <p class="text-secondary" style="font-size:0.8rem">{{job.location}}</p>
                      </div>
                      
                    </div>
                    <div class="p-0 m-0">
                      <div
                        id="cancelApplication"
                        v-b-tooltip.hover
                        title="cancel application"
                        style="cursor: pointer;"
                        @click.prevent="cancelApplication(job._id)"
                      >
                        <i class="fa fa-ban"></i>
                      </div>
                    </div>
                  </div>
                  <div class="text-center border-top pt-1" style="font-size:0.8rem">
                    <i class="fa fa-clock-o"></i>
                    last update {{moment(job.createdAt).fromNow()}}
                  </div>
                </div>
              </div>
              <!-- the muse container end -->
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserApplication",
  computed: {
    ...mapState(["loggedUser", "isLoading"]),
    pageRows() {
      return this.loggedUser.appliedJob.length;
    }
  },
  data() {
    return {
      perPage: 9,
      currentPage: 1
    };
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
</style>