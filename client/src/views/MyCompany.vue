<template>
  <div class>
    <div class="container">
      <div class="row">
        <div v-if="searchingUserCompany" style="position:fixed;top:50%;left:48%">
          <HashLoader color="#182825" :size="50"></HashLoader>
        </div>
      </div>
    </div>

    <div v-if="userCompany" class="mt-5 mx-1">
      <div class="container-fluid" v-if="!showPostJob">
        <div class="row">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border rounded border-light d-flex flex-column justify-content-between bg-light"
          >
            <div>
              <h1>{{userCompany.name}}</h1>
            </div>
            <div class="d-flex justify-content-between text-secondary border-bottom">
              <div class="d-flex justify-content-between flex-column">
                <p>
                  <i class="fa fa-location-arrow"></i>
                  {{userCompany.location}}
                </p>
                <p>
                  <i class="fa fa-industry"></i>
                  {{userCompany.category}}
                </p>
              </div>
              <div class="d-flex justify-content-between flex-column">
                <p>
                  <b-link :href="userCompany.url" target="blank">
                    <i class="fa fa-link"></i>
                    {{userCompany.url}}
                  </b-link>
                </p>
                <p>
                  <i class="fa fa-clock-o"></i>
                  last update {{moment(userCompany.updatedAt).fromNow()}}
                </p>
              </div>
            </div>
            <div class="ml-auto mt-3">
              <b-button class="mr-2 mt-2" variant="info" size="lg" @click.prevent="updateCompany()">
                <h4 class="mb-0">Update Company</h4>
              </b-button>
              <b-button
                class="mr-2 mt-2"
                variant="warning"
                size="lg"
                @click.prevent="postJob(userCompany._id)"
              >
                <h4 class="mb-0">Post Job</h4>
              </b-button>
              <b-button
                variant="danger"
                class="mt-2"
                size="lg"
                @click.prevent="deleteCompany(userCompany._id)"
              >
                <h4 class="mb-0">Delete Company</h4>
              </b-button>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border rounded border-light d-flex flex-column justify-content-between bg-white"
          >
            <h3>Description</h3>
            <p v-html="userCompany.description"></p>
          </div>
        </div>
        <div class="row mt-4">
          <div
            class="col-md-10 offset-md-1 p-3 col-sm-12 col-xs-12 shadow border rounded border-light d-flex flex-column justify-content-between bg-white"
          >
            <div class="d-flex">
              <h3>Jobs</h3>
            </div>

            <p
              v-if="!userCompany.jobs.length"
            >You haven't post any job, post a job to attract people to your company</p>
            <p
              class="border-bottom"
              v-if="userCompany.jobs.length"
            >You have posted {{userCompany.jobs.length}} jobs</p>
            <div v-for="job in userCompany.jobs" :key="job._id" class="mt-3">
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
                <b-button class="mr-2" variant="info" size="sm" @click.prevent="showJobUpdate(job)">
                  <i class="fa fa-repeat"></i> Update Job
                </b-button>
                <b-button
                  class="mr-2"
                  variant="danger"
                  size="sm"
                  @click.prevent="deleteJob(job._id)"
                >
                  <i class="fa fa-trash-o"></i> Delete Job
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view />
    </div>
    <AddCompanyForm v-if="!userCompany && !searchingUserCompany"></AddCompanyForm>
    <!-- modal spinner for deleting job -->
    <b-modal
      v-model="deletingJob"
      centered
      hide-header
      content-class="shadow"
      hide-footer
      size="sm"
    >
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-info">Deleting Job ...</h5>
        </div>
        <div class="mx-auto my-3">
          <PulseLoader color="#5BC0EB" :size="15"></PulseLoader>
        </div>
      </div>
    </b-modal>
    <!-- modal deleting company -->
    <b-modal
      v-model="deletingCompany"
      centered
      hide-header
      content-class="shadow"
      hide-footer
      size="sm"
    >
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-info">Deleting Company ...</h5>
        </div>
        <div class="mx-auto my-3">
          <PulseLoader color="#5BC0EB" :size="15"></PulseLoader>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import AddCompanyForm from "@/components/AddCompanyForm.vue";
import { mapState } from "vuex";
import { HashLoader, PulseLoader } from "@saeris/vue-spinners";

export default {
  computed: {
    ...mapState([
      "userCompany",
      "searchingUserCompany",
      "deletingJob",
      "deletingCompany"
    ])
  },
  components: {
    AddCompanyForm,
    HashLoader,
    PulseLoader
  },
  data() {
    return {
      showPostJob: false
    };
  },
  methods: {
    deleteCompany(companyId) {
      this.$alertify
        .confirm(
          () => this.$alertify.success("ok"),
          () => this.$store.dispatch("deleteCompany", companyId)
        )
        .setHeader(
          '<h1 class=" text-danger"><i class="fa fa-exclamation-circle"></i> Danger !!!</h1> '
        )
        .setContent(
          '<h5 class="text-justify" style="min-height:100px"> Are you sure, you want to delete your company ? it will also <span class="text-danger"> delete </span> all jobs you have posted and you cannot revert this !!! </h5>'
        )
        .show();
    },
    showJobUpdate(job) {
      this.$router.push(`jobs/update/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    },
    showJobDetail(job) {
      this.$router.push(`jobs/${job._id}`);
      this.$store.commit("SET_JOBDETAIL", job);
    },
    async deleteJob(id) {
      this.$alertify
        .confirm(
          () => this.$alertify.success("ok"),
          () => this.$store.dispatch("deleteJob", id)
        )
        .setHeader(
          '<h1 class=" text-warning"> <i class="fa fa-question-circle"></i> Warning !!!</h1> '
        )
        .setContent(
          '<h5 class="text-justify" style="min-height:100px"> Are you sure, you want to delete this job ? you cannot revert this !!! </h5>'
        )
        .show();
    },
    async updateCompany() {
      this.$router.push("/company/update");
    },
    async reload() {
      if (this.$router.currentRoute.fullPath !== "/mycompany") {
        this.showPostJob = true;
      } else {
        this.showPostJob = false;
      }
    },
    async postJob(companyId) {
      this.showPostJob = true;
      this.$router.push(`/mycompany/${companyId}`);
    },
    async searchCompany() {
      if (!this.userCompany) {
        await this.$store.dispatch("searchUserCompany");
      }
      await this.$store.dispatch("getLocation");
    }
  },
  created() {
    this.searchCompany();
    this.reload();
  },
  beforeRouteUpdate(to, from, next) {
    console.log("ketrigger");
    this.searchCompany();
    if (to.fullPath !== "/mycompany") {
      this.showPostJob = true;
    } else {
      this.showPostJob = false;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.showPostJob = true;
    next();
  }
};
</script>

<style scoped>
p {
  margin: 0.5rem 1rem;
  font-family: "Gothic A1", sans-serif;
}
</style>
