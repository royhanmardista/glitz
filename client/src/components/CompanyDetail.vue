<template>
  <div class="bg-light border-top" style="min-height:700px">
    <div class="container">
      <div class="row">
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <HashLoader color="#182825" :size="100"></HashLoader>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && companyDetail" class="mt-5 mx-1">
      <div class="container-fluid">
        <div class="row">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border border-light d-flex flex-column justify-content-between bg-light"
          >
            <div>
              <h1>{{companyDetail.name}}</h1>
            </div>
            <div class="d-flex justify-content-between text-secondary border-bottom">
              <div class="d-flex justify-content-between flex-column">
                <p>
                  <i class="fa fa-location-arrow"></i>
                  {{companyDetail.location}}
                </p>
                <p>
                  <i class="fa fa-industry"></i>
                  {{companyDetail.category}}
                </p>
              </div>
              <div>
                <b-link :href="companyDetail.url" target="blank">
                  <i class="fa fa-link"></i>
                  {{companyDetail.url}}
                </b-link>
                <p>
                  <i class="fa fa-clock-o"></i>
                  last update {{moment(companyDetail.updatedAt).fromNow()}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border border-light d-flex flex-column justify-content-between bg-white"
          >
            <h3>Description</h3>
            <p>{{companyDetail.description}}</p>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border border-light d-flex flex-column justify-content-between bg-white"
          >
            <h3>Jobs</h3>
            <p
              v-if="!companyDetail.jobs.length"
            >This Company hasn't post any jobs</p>
            <p
              class="border-bottom"
              v-if="companyDetail.jobs.length"
            >This Company has posted {{companyDetail.jobs.length}} jobs</p>
            <div v-for="job in companyDetail.jobs" :key="job._id" class="border-bottom mt-3">
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
              </div>
            </div>
          </div>
        </div>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { HashLoader } from "@saeris/vue-spinners";

export default {
  name: "CompanyDetail",
  computed: {
    ...mapState(["companyDetail", "isLoading"])
  },
  components: {
    HashLoader
  },
  data() {
    return {
    };
  },
  methods: {    
    showJobDetail(job) {
      this.$router.push(`/jobs/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    },        
  },
  created() {
      this.$store.dispatch('getCompanyDetail', this.$router.currentRoute.params.id)
  }
};
</script>

<style scoped>
p {
  margin: 0.5rem 1rem;
  font-family: "Gothic A1", sans-serif;
}
</style>
