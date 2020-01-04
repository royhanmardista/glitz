<template>
  <div class="bg-light border-top" style="min-height:700px">
    <div class="container">
      <div class="row">
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <HashLoader color="#182825" :size="50"></HashLoader>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && companyDetail" class="mt-3">
      <div class="container-fluid">
        <div class="row">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow d-flex flex-column justify-content-between bg-light"
          >
            <div>
              <h1 class="mb-0">{{companyDetail.name}}</h1>
            </div>
            <div
              class="text-secondary container-fluid m-0 p-1"
            >
              <div class="row d-flex justify-content-between pb-2 mt-2" id="company_detail">
                <div class="d-flex justify-content-between flex-column col-md-6">
                  <div>
                    <i class="fa fa-location-arrow mr-1"></i>
                    {{companyDetail.location}}
                  </div>
                  <div>
                    <i class="fa fa-truck"></i>
                    {{companyDetail.category}}
                  </div>
                </div>
                <div class="d-flex justify-content-between flex-column col-md-6">
                  <div>
                    <b-link :href="companyDetail.url" target="blank">{{companyDetail.url}}</b-link>
                  </div>
                  <div>
                    <i class="fa fa-clock-o"></i>
                    last update {{moment(companyDetail.updatedAt).fromNow()}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow  d-flex flex-column justify-content-between bg-white"
          >
            <h3>Description</h3>
            <p class="text-justify" v-html="companyDetail.description"></p>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow  d-flex flex-column justify-content-between bg-white"
          >
            <h3>Jobs</h3>
            <p v-if="!companyDetail.jobs.length">This Company hasn't post any jobs</p>
            <p
              class="border-bottom"
              v-if="companyDetail.jobs.length"
            >This Company has posted {{companyDetail.jobs.length}} jobs</p>
            <div v-for="job in companyDetail.jobs" :key="job._id" class="mt-3">
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
              <div class="d-flex justify-content-end pb-2 border-bottom">
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
    return {};
  },
  methods: {
    showJobDetail(job) {
      this.$router.push(`/jobs/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    }
  },
  created() {
    this.$store.dispatch(
      "getCompanyDetail",
      this.$router.currentRoute.params.id
    );
  }
};
</script>

<style scoped>
p {
  margin: 0.5rem 1rem;
  font-family: "Gothic A1", sans-serif;
}

#company_detail {
  font-family: "Gothic A1", sans-serif;
  font-size: 0.9rem
}
</style>
