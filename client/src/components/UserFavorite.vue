<template>
  <div class>
    <div class="container-fluid">
      <div class="row mt-5 mx-1">
        <!-- spinner -->
        <div v-if="isSearchingUser" style="position:fixed;top:50%;left:45%">
          <FadeLoader color="#5BC0EB"></FadeLoader>
        </div>
        <!-- job page -->
        <!-- job container start -->
        <div class="col-md-10 offset-md-1" v-if="!isSearchingUser && loggedUser.favoriteJob">
          <h1 class="text-center">My Favorite Jobs</h1>
          <!-- loggedUser.favoriteJob container start -->
          <h4
            class
            style="cursor: pointer"
            v-b-toggle.fav-collapse
          >You Have Bookmarks {{loggedUser.favoriteJob.length}} Jobs</h4>
          <b-collapse class id="fav-collapse" :visible="true" v-if="loggedUser.favoriteJob.length">
            <p>Page: {{ currentPage }}</p>
            <b-pagination
              v-model="currentPage"
              :total-rows="pageRows"
              :per-page="perPage"
              aria-controls="loggedUser.favoriteJob"
            ></b-pagination>
            <div class="row">
              <div
                id="loggedUser.favoriteJob"
                :per-page="perPage"
                :current-page="currentPage"
                class="col-md-4 col-xs-12 col-sm-12"
                v-for="job in favoriteJobs"
                :key="job._id"
              >
                <div
                  class="border rounded px-3 py-2 mb-3 d-flex flex-column justify-content-between"
                  style="min-height:230px"
                >
                  <div class="text-left d-flex justify-content-between">
                    <div class="d-flex flex-column justify-content-between mr-0">
                      <h5 class="mb-0">
                        <a class="text-dark" href @click.prevent="showJobDetail(job)">{{job.name}}</a>
                      </h5>
                      <div style="font-size:0.7rem">
                        <i class="fa fa-eye"></i>
                        {{job.minExp}} years experience or more
                      </div>
                      <a href @click.prevent="showCompanyDetail(job.companyId)" class="mt-2">
                        <i class="fa fa-building-o"></i>
                        {{job.companyId.name}}
                      </a>
                      <div class="d-flex">
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
                        id="cancelApplication"
                        v-b-tooltip.hover
                        title="remove from favorite"
                        style="cursor: pointer;"
                        @click.prevent="removeFromFavorite(job._id)"
                      >
                        <i class="fa fa-trash-o"></i>
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
import { FadeLoader } from "@saeris/vue-spinners";

export default {
  name: "UserFavorite",
  components: {
    FadeLoader
  },
  computed: {
    ...mapState(["loggedUser", "isSearchingUser"]),
    pageRows() {
      return this.loggedUser.favoriteJob.length;
    },
    favoriteJobs() {
      if (this.loggedUser) {
        return this.loggedUser.favoriteJob.slice(
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
            page: this.currentPage
          }
        })
        .catch(err => {});
    }
  },
  data() {
    return {
      perPage: 9,
      currentPage: 1
    };
  },
  created() {
    this.$store.dispatch("findUser");
    if (this.$router.currentRoute.fullPath !== "/favorites") {
      this.currentPage = this.$router.currentRoute.query.page;
    }
  },
  methods: {
    showJobDetail(job) {
      this.$router.push(`jobs/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    },
    showCompanyDetail(company) {
      this.$router.push(`company/${company._id}`);
      this.$store.dispatch("getCompanyDetail", company._id);
    },
    removeFromFavorite(jobId) {
      this.$store.dispatch("removeFromFavorite", jobId);
    }
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