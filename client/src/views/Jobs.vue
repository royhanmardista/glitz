<template>
  <div class="">
    <div class="container mt-5">
      <div class="row">
        <!-- spinner -->
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <FadeLoader color="#5BC0EB"></FadeLoader>
        </div>
        <!-- job page -->
        <div class="col-md-10 offset-md-1 border pb-2 bg-info rounded" v-if="!isLoading">
          <b-form @submit.prevent="searchJob">
            <b-input-group size="lg" class="mt-2" placeholder="search">
              <b-form-input v-model="description" placeholder="Search Jobs..."></b-form-input>
              <b-input-group-append>
                <b-button size="lg" text="Button" variant="primary" type="submit">
                  <i class="fa fa-search"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>

            <div class="mt-1 container-fluid pt-1">
              <b-form inline class="row d-flex justify-content-start">
                <b-input-group class=" mt-1 col-md-4 p-1">
                  <b-form-select v-model="country" :options="locations"></b-form-select>
                </b-input-group>
                <b-input-group class=" mt-1 col-md-4 p-1">
                  <b-form-select v-model="minExp" :options="minExperiences"></b-form-select>
                </b-input-group>
                <b-input-group class="mt-1 col-md-4 p-1">
                  <b-form-input v-model="skills" placeholder="Choose Skills"></b-form-input>
                </b-input-group>
              </b-form>
            </div>
          </b-form>
        </div>
      </div>
    </div>
    <!-- job container -->
    <div class="row mt-5 mx-1" v-if="!isLoading">
      <!-- job container start -->
      <div class="col-md-10 offset-md-1" v-if="internalJob">
        <!-- internalJob container start -->
        <h4 class style="cursor: pointer" v-b-toggle.job-collapse>{{internalJob.length}} jobs found</h4>
        <b-collapse class id="job-collapse" :visible="true">
          <p>Page: {{ currentPage }}</p>
          <b-pagination
            v-model="currentPage"
            :total-rows="pageRows"
            :per-page="perPage"
            aria-controls="internalJob"
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
              id="internalJob"
              :per-page="perPage"
              :current-page="currentPage"
              class="col-md-4 col-xs-12 col-sm-12"
              v-for="job in internalJob"
              :key="job._id"
            >
              <div
                class="border rounded px-3 py-1 mb-3 d-flex flex-column justify-content-between"
                style="min-height:230px"
              >
                <div class="text-left d-flex justify-content-between">
                  <div class="d-flex flex-column justify-content-between">
                    <h5 class="mb-0">
                      <a class="text-dark" href @click.prevent="showJobDetail(job)">{{job.name}}</a>
                    </h5>
                    <div style="font-size:0.7rem">
                      <i class="fa fa-eye"></i>
                      {{job.minExp}} years experience or more
                    </div>
                    <a class="mt-2" href @click.prevent="showCompanyDetail(job.companyId)">
                      <i class="fa fa-building-o"></i>
                      {{job.companyId.name}}
                    </a>
                    <div class="d-flex mt-1">
                      <i class="fa fa-map-marker mr-2" style></i>
                      <p class="text-secondary" style="font-size:0.8rem">{{job.location}}</p>
                    </div>
                    <div class="container mb-1">
                      <div class="row">
                        <div
                          class="border ml-1 mb-1 p-1 bg-warning rounded"
                          v-for="skill in job.skills"
                          :key="skill"
                        >
                          <div style="font-size:0.8rem">{{skill}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pl-2">
                    <div
                      class
                      style="cursor: pointer"
                      v-b-tooltip.hover
                      title="Add to favorite"
                      @click.prevent="addFavorite(job._id)"
                    >
                      <i class="fa fa-bookmark"></i>
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
    <!-- job container end -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { FadeLoader } from "@saeris/vue-spinners";

export default {
  name: "Jobs",
  components: {
    FadeLoader
  },
  computed: {
    ...mapState(["locations", "isLoading", "internalJob"]),
    pageRows() {
      return this.internalJob.length;
    }
  },
  data() {
    return {
      perPage: 9,
      currentPage: 1,
      description: null,
      minExp: null,
      country: null,
      skills: null,
      minExperiences: [
        { text: "Choose Experience", value: null },
        { text: "no experience", value: 0 },
        { text: "1 year", value: 1 },
        { text: "2 years", value: 2 },
        { text: "3 years", value: 3 },
        { text: "4 years", value: 4 },
        { text: "5 years", value: 5 },
        { text: "6 years or more", value: 6 }
      ]
    };
  },
  methods: {
    addFavorite(jobId) {
      this.$store.dispatch("addToFavorite", jobId);
    },
    showJobDetail(job) {
      this.$router.push(`jobs/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    },
    showCompanyDetail(company) {
      this.$router.push(`company/${company._id}`);
      this.$store.dispatch("getCompanyDetail", company._id);
    },
    async reload() {
      if (this.$router.currentRoute.fullPath !== "/jobs") {
        this.$store.dispatch(
          "searchInternalJob",
          this.$router.currentRoute.query
        );
        this.currentPage = this.$router.currentRoute.query.page;
      }
    },
    async searchJob() {      
      this.$router.push({
        query: {
          description: this.description,
          minExp: this.minExp,
          country: this.country,
          skills: this.skills,
          page: this.currentPage
        }
      }).catch(err => {});
      let form = {
        description: this.description,
        minExp: this.minExp,
        country: this.country,
        skills: this.skills
      };
      await this.$store.dispatch("searchInternalJob", form);
    }
  },
  created() {
    this.$store.dispatch("getLocation");
    this.reload();
  },  
};
</script>

<style scoped>
a:hover {
  color: rgb(37, 82, 189) !important;
  text-decoration: none;
}
a {
  color: blue !important;
}
</style>
