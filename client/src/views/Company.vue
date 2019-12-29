<template>
  <div class>
    <div class="container mt-5">
      <div class="row">
        <!-- spinner -->
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <FadeLoader color="#5BC0EB"></FadeLoader>
        </div>
        <!-- company page -->
        <div class="col-md-10 offset-md-1 border pb-2 bg-info rounded" v-if="!isLoading">
          <b-form @submit.prevent="searchCompany">
            <b-input-group size="lg" class="mt-2" placeholder="search">
              <b-form-input v-model="description" placeholder="Search Company ..."></b-form-input>
              <b-input-group-append>
                <b-button size="lg" text="Button" variant="primary" type="submit">
                  <i class="fa fa-search"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>
            <div class="col-md-5 p-0">
              <b-input-group class="mb-1 mt-2">
                <b-form-select v-model="country" :options="locations"></b-form-select>
              </b-input-group>
            </div>
          </b-form>
        </div>
      </div>
    </div>
    <!-- company container -->
    <div class="row mt-5 mx-1" v-if="!isLoading">
      <!-- company container start -->
      <div class="col-md-10 offset-md-1" v-if="companies">
        <!-- company container start -->
        <h4
          class
          style="cursor: pointer"
          v-b-toggle.company-collapse
        >{{companies.length}} Companies found</h4>
        <b-collapse class id="company-collapse" :visible="true">
          <p>Page: {{ currentPage }}</p>
          <b-pagination
            v-model="currentPage"
            :total-rows="pageRows"
            :per-page="perPage"
            aria-controls="companies"
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
              id="companies"
              :per-page="perPage"
              :current-page="currentPage"
              class="col-md-4 col-xs-12 col-sm-12"
              v-for="company in companies"
              :key="company._id"
            >
              <div
                class="border rounded px-3 py-1 mb-3 d-flex flex-column justify-content-between"
                style="min-height:170px"
              >
                <div class="text-left d-flex justify-content-between">
                  <div class="d-flex flex-column justify-content-between">
                    <div class="">
                      <h5 class="mb-1">
                        <a
                          class="text-dark"
                          href
                          @click.prevent="showCompanyDetail(company)"
                        >{{company.name}}</a>
                      </h5>
                    </div>
                    <div class="d-flex mt-2">
                      <i class="fa fa-industry mr-2"></i>
                      <p class="text-secondary" style="font-size:0.8rem">{{company.category}}</p>
                    </div>
                    <div class="d-flex">
                      <i class="fa fa-map-marker mr-2" style></i>
                      <p class="text-secondary" style="font-size:0.8rem">{{company.location}}</p>
                    </div>
                  </div>
                </div>
                <div class="text-center border-top pt-1" style="font-size:0.8rem">
                  <i class="fa fa-clock-o"></i>
                  last update {{moment(company.createdAt).fromNow()}}
                </div>
              </div>
            </div>
            <!-- the company container end -->
          </div>
        </b-collapse>
      </div>
    </div>
    <!-- company container end -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { FadeLoader } from "@saeris/vue-spinners";

export default {
  name: "Company",
  components: {
    FadeLoader
  },
  computed: {
    ...mapState(["locations", "isLoading", "companies"]),
    pageRows() {
      return this.companies.length;
    }
  },
  data() {
    return {
      perPage: 9,
      currentPage: 1,
      description: null,
      country: null
    };
  },
  methods: {
    showCompanyDetail(company) {
      this.$router.push(`company/${company._id}`);
      this.$store.dispatch("getCompanyDetail", company._id);
    },
    async reload() {
      if (this.$router.currentRoute.fullPath !== "/jobs") {
        this.$store.dispatch("searchCompany", this.$router.currentRoute.query);
        this.currentPage = this.$router.currentRoute.query.page;
      }
    },
    async searchCompany() {
      this.$router
        .push({
          query: {
            description: this.description,
            country: this.country,
            page: this.currentPage
          }
        })
        .catch(err => {});
      let form = {
        description: this.description,
        country: this.country
      };
      await this.$store.dispatch("searchCompany", form);
    }
  },
  created() {
    this.$store.dispatch("getLocation");
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
