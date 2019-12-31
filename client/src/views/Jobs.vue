<template>
  <div class>
    <div class="container mt-5">
      <div class="row">
        <!-- spinner -->
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <FadeLoader color="#5BC0EB"></FadeLoader>
        </div>
        <!-- job page -->
        <div class="col-md-10 offset-md-1 border pb-2 bg-info rounded">
          <b-form @submit.prevent="searchJob">
            <b-input-group size="lg" class="mt-2 ml-1 pt-1" placeholder="search">
              <b-form-input v-model="description" placeholder="Search Jobs..."></b-form-input>
              <b-input-group-append class="mr-1">
                <b-button size="lg" text="Button" variant="primary" type="submit">
                  <i class="fa fa-search"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>

            <div class="mt-1 container-fluid pt-1">
              <b-form inline class="row d-flex justify-content-start">
                <b-input-group class="mt-1 col-md-4 p-1">
                  <b-form-select v-model="country" :options="locations"></b-form-select>
                </b-input-group>
                <b-input-group class="mt-1 col-md-4 p-1">
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
      <div class="col-md-10 offset-md-1" v-if="jobs">
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
          <div class="row">
            <div
              id="internalJob"
              :per-page="perPage"
              :current-page="currentPage"
              class="col-md-4 col-xs-12 col-sm-12"
              v-for="job in jobs"
              :key="job._id"
            >
              <div
                class="border rounded px-3 py-2 mb-3 d-flex flex-column justify-content-between"
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
    <!-- modal start -->
    <b-modal
      v-model="addToFavoriteLoading"
      centered
      hide-header
      content-class="shadow"
      hide-footer
      size="sm"
    >
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-info">Adding job to favorite ...</h5>
        </div>
        <div class="mx-auto my-5">
          <RotateLoader color="#5BC0EB"></RotateLoader>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { FadeLoader, RotateLoader } from "@saeris/vue-spinners";

export default {
  name: "Jobs",
  components: {
    FadeLoader,
    RotateLoader
  },
  computed: {
    ...mapState([
      "locations",
      "isLoading",
      "internalJob",
      "addToFavoriteLoading"
    ]),
    pageRows() {
      return this.internalJob.length;
    },
    jobs() {
      if (this.internalJob) {
        return this.internalJob.slice(
          (this.currentPage - 1) * this.perPage,
          this.currentPage * this.perPage
        );
      }
    }
  },
  watch: {
    currentPage: function() {
      this.$router
        .push({
          query: {
            description: this.description,
            minExp: this.minExp,
            country: this.country,
            skills: this.skills,
            page: this.currentPage
          }
        })
        .catch(err => {});
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
        await this.$store.dispatch(
          "searchInternalJob",
          this.$router.currentRoute.query
        );
        this.currentPage = this.$router.currentRoute.query.page;
      }
      await this.$store.dispatch("getLocation");
    },
    async searchJob() {
      this.$router
        .push({
          query: {
            description: this.description,
            minExp: this.minExp,
            country: this.country,
            skills: this.skills,
            page: this.currentPage
          }
        })
        .catch(err => {});
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
    this.reload();
  }
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
