<template>
  <div  class="text-center" id="frontPage">
    <div class="d-flex justify-content-center container-fluid">
      <div class="row mx-1">
        <div id="search" class="d-flex flex-column justify-content-center">
          <div class="text-white">
            <h1>
              <i class="fa fa-star"></i> Glintz
            </h1>
            <p>Helps you search job</p>
            <div>
              <b-form inline>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" placeholder="Job" v-model="form.description"></b-input>
                <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
                  <b-input placeholder="Location" v-model="form.location"></b-input>
                </b-input-group>
                <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
                  <b-form-select
                    id="input-3"
                    v-model="form.category"
                    :options="categories"
                    required
                  ></b-form-select>
                </b-input-group>
                <b-button @click.prevent="searchJob" variant="light" class>Search</b-button>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- job container start -->
    <div class="container-fluid" v-if="github && themuse">
      <!-- github container start -->
      <h2 class="mt-5" v-b-toggle.github-collapse>Github</h2>

      <h4>{{github.length}} jobs found in github</h4>
      <b-collapse id="github-collapse" :visible="true">
        <p>Page: {{ currentPage }}</p>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="github"
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
            id="github"
            :per-page="perPage"
            :current-page="currentPage"
            class="col-md-4 col-xs-12 col-sm-12"
            v-for="job in jobs"
            :key="job._id"
          >
            <div
              class="border rounded px-3 py-1 mb-3 d-flex flex-column justify-content-between"
              style="min-height:180px"
            >
              <div class="row text-left">
                <div
                  class="col-md-11 col-xs-11 col-sm-11 d-flex flex-column justify-content-between"
                >
                  <h5>
                    <a class="text-dark" :href="job.company_url" target="_blank">{{job.title}}</a>
                  </h5>
                  <p>
                    <i class="fa fa-building-o"></i>
                    {{job.company}}
                  </p>
                  <p>
                    <i class="fa fa-map-marker"></i>
                    {{job.location}}
                  </p>
                </div>
                <div class="col-md-1 col-xs-1 col-sm-1 p-0">
                  <div class>
                    <i class="fa fa-bookmark"></i>
                  </div>
                </div>
              </div>
              <div class="text-center border-top pt-1">
                <i class="fa fa-clock-o"></i>
                last update {{moment(job.created_at).fromNow()}}
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
      <!-- themuse container start -->
      <h2 class="mt-3" v-b-toggle.themuse-collapse>TheMuse</h2>
      <h4>{{themuse.length}} jobs found in themuse</h4>
      <b-collapse class id="themuse-collapse" :visible="true">
        <p>Page: {{ themuseCurrentPage }}</p>
        <b-pagination
          v-model="themuseCurrentPage"
          :total-rows="themuseRows"
          :per-page="perPage"
          aria-controls="themuse"
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
            id="themuse"
            :per-page="perPage"
            :current-page="themuseCurrentPage"
            class="col-md-4 col-xs-12 col-sm-12"
            v-for="job in themuseJobs"
            :key="job.id"
          >
            <div
              class="border rounded px-3 py-1 mb-3 d-flex flex-column justify-content-between"
              style="min-height:180px"
            >
              <div class="row text-left">
                <div
                  class="col-md-11 col-xs-11 col-sm-11 d-flex flex-column justify-content-between"
                >
                  <h5>
                    <a class="text-dark" :href="job.refs.landing_page" target="_blank">{{job.name}}</a>
                  </h5>
                  <p>
                    <i class="fa fa-building-o"></i>
                    {{job.company.name}}
                  </p>
                  <p>
                    <i class="fa fa-map-marker"></i>
                    {{job.locations[0].name}}
                  </p>
                </div>
                <div class="col-md-1 col-xs-1 col-sm-1 p-0">
                  <div class>
                    <i class="fa fa-bookmark"></i>
                  </div>
                </div>
              </div>
              <div class="text-center border-top pt-1">
                <i class="fa fa-clock-o"></i>
                last update {{moment(job.publication_date).fromNow()}}
              </div>
            </div>
          </div>
          <!-- the muse container end -->
        </div>
      </b-collapse>
    </div>
    <!-- job container end -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  created () {
    this.reload()
  },
  computed: {
    ...mapState(['jobs', 'isLoading', 'github', 'themuse', 'locations']),
    rows () {
      return this.github.length
    },
    themuseRows () {
      return this.themuse.length
    },
    themuseJobs () {
      return this.themuse.slice(
        (this.themuseCurrentPage - 1) * this.perPage,
        this.themuseCurrentPage * this.perPage
      )
    },
    jobs () {
      return this.github.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      )
    }
  },
  data () {
    return {
      themuseCurrentPage: 1,
      perPage: 9,
      currentPage: 1,
      form: {
        description: '',
        category: null,
        location: null
      },
      categories: [
        { text: 'Select One', value: null },
        'Sales',
        'Engineering',
        'Data Science',
        'Retail',
        'Education',
        'Marketing & PR',
        'Manufacturing',
        'Creative & Design'
      ]
    }
  },
  methods: {
    async reload () {
      if (this.$router.currentRoute.fullPath !== '/') {
        this.$store.dispatch('searchJob', this.$router.currentRoute.query)
      }
    },
    async searchJob () {
      this.$router.push({
        path: '/',
        query: {
          description: this.form.description,
          location: this.form.location
        }
      })
      this.isSearch = true
      await this.$store.dispatch('searchJob', this.form)
    }
  }
}
</script>

<style >
body {
  background: rgb(22, 88, 223);
  background: linear-gradient(
    90deg,
    rgba(22, 88, 223, 1) 0%,
    rgba(234, 234, 226, 1) 0%,
    rgba(211, 201, 194, 1) 0%,
    rgba(215, 215, 215, 1) 0%,
    rgba(170, 98, 57, 1) 0%,
    rgba(197, 197, 42, 1) 0%,
    rgba(226, 114, 46, 1) 0%,
    rgba(35, 210, 225, 1) 0%,
    rgba(29, 213, 229, 1) 18%,
    rgba(7, 198, 201, 1) 49%,
    rgba(14, 115, 138, 1) 100%,
    rgba(99, 135, 215, 1) 100%
  );
}

/* body {

} */
</style>
