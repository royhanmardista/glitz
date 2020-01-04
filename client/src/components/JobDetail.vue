<template>
  <div>
    <div class="container-fluid mt-3">
      <div class="row">
        <!-- spinner -->
        <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
          <DotLoader color="#5BC0EB"></DotLoader>
        </div>
        <div class="col-md-10 offset-md-1" v-if="!isLoading">
          <h3 class="mb-3">{{jobDetail.name}}</h3>
          <div class="ml-3">
            <p>
              <i class="fa fa-plane"></i>
              {{jobDetail.minExp}} years experience or more
            </p>
            <p class="border-bottom pb-2">
              <i class="fa fa-map-o"></i>
              {{jobDetail.location}}
            </p>
            <p class="text-secondary pb-1">
              <i class="fa fa-clock-o"></i>
              Last update {{moment(jobDetail.updatedAt).fromNow()}}
            </p>
            <div class="d-flex justify-content-end my-4" v-if="loggedUser._id != jobDetail.userId">
              <b-button size="lg" variant="warning" @click.prevent="applyJob(jobDetail._id)">
                <h4>Apply</h4>
              </b-button>
            </div>
          </div>
          <div class="border p-3 rounded">
            <div class="d-flex justify-content-between">
              <h5
                @click="descShow = !descShow"
                :class="descShow ? null : 'collapsed'"
                :aria-expanded="descShow ? 'true' : 'false'"
                style="cursor:pointer"
              >Job Description</h5>
              <i
                :class="{'fa fa-caret-down fa-2x' : !descShow, 'fa fa-caret-up fa-2x' : descShow }"
              ></i>
            </div>
            <b-collapse id="description" v-model="descShow">
              <div class="ml-3 mt-4" v-html="jobDetail.description"></div>
            </b-collapse>
          </div>
          <div class="border p-3 rounded mt-4">
            <h5>Job Requirment</h5>
            <div class="container mt-3">
              <div class="row d-flex justify-content-start">
                <div
                  v-for="skill in jobDetail.skills"
                  :key="skill"
                  class="border rounded px-4 py-2 mr-1 mt-1 bg-dark text-white"
                >
                  <div class>{{skill}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="border p-3 rounded mt-3" v-if="loggedUser._id == jobDetail.userId">
            <div class="d-flex justify-content-between">
              <h5
                @click="applicantsShow = !applicantsShow"
                :class="applicantsShow ? null : 'collapsed'"
                :aria-expanded="applicantsShow ? 'true' : 'false'"
                style="cursor:pointer"
              >Applicants</h5>
              <i
                :class="{'fa fa-caret-down fa-2x' : !applicantsShow, 'fa fa-caret-up fa-2x' : applicantsShow }"
              ></i>
            </div>
            <div>
              <p>{{jobDetail.applicants.length}} users has applied this job</p>
            </div>
            <b-collapse id="applicants" v-model="applicantsShow">
              <div class="mt-4">
                <div class="table-responsive">
                  <table class="table table-hover mr-3" v-if="jobDetail.applicants.length">
                    <thead class="thead-light">
                      <tr>
                        <th>No</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(applicant, index) in jobDetail.applicants"
                        :key="applicant._id"
                        class="border-bottom"
                      >
                        <td>{{index + 1}}</td>
                        <td>{{applicant.applicantId.username}}</td>
                        <td>{{applicant.applicantId.email}}</td>
                        <td style="min-width:250px">
                          <div class="d-flex">
                            <form action>
                              <b-form-select
                                v-model="applicant.status"
                                :options="statusOption"
                                required
                              ></b-form-select>
                            </form>
                            <a
                              href
                              class="ml-2 mt-1 text-info"
                              size="sm"
                              variant="outline-info"
                              v-b-tooltip.hover
                              title="Change Status"
                              @click.prevent="updateApplicantStatus({applicant, jobId : jobDetail} )"
                            >
                              <i class="fa fa-gavel"></i>
                            </a>
                          </div>
                        </td>

                        <td class style="cursor:pointer">
                          <b-button
                            class=""
                            size="sm"
                            variant="outline-info"
                            v-b-tooltip.hover
                            title="See applicants profile"
                            @click.prevent="seeApplicantDetail(applicant.applicantId._id)"
                          >
                            <i class="fa fa-archive"></i>
                          </b-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
    <UpdateApplicantStatusModal></UpdateApplicantStatusModal>
    <!-- modal start -->
    <b-modal
      v-model="applyingJob"
      centered
      hide-header
      content-class="shadow"
      hide-footer
      size="sm"
    >
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-info">Applying Job ...</h5>
        </div>
        <div class="mx-auto my-5">
          <RotateLoader color="#5BC0EB"></RotateLoader>
        </div>
      </div>
    </b-modal>
    <!-- modal updating applicant status -->
    <b-modal
      v-model="updatingApplicantStatus"
      centered
      hide-header
      content-class="shadow"
      hide-footer
      size="sm"
    >
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-secondary">{{message}}</h5>
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
import UpdateApplicantStatusModal from "@/components/UpdateApplicantStatusModal";
import { DotLoader, RotateLoader } from "@saeris/vue-spinners";

export default {
  name: "JobDetail",
  components: {
    DotLoader,
    RotateLoader
  },
  computed: {
    ...mapState([
      "jobDetail",
      "isLoading",
      "userProfile",
      "loggedUser",
      "applyingJob",
      "updatingApplicantStatus"
    ])
  },
  data() {
    return {
      descShow: true,
      applicantsShow: true,
      applicant: null,
      statusOption: ["waiting evaluation", "accepted", "not suitable"],
      message: ""
    };
  },
  components: {
    UpdateApplicantStatusModal
  },
  methods: {
    updateApplicantStatus(data) {
      let { applicant, jobId } = data;
      let applicatUpdate = {};
      applicant.jobId = jobId._id;
      this.message = `updating ${applicant.applicantId.username}s status ...`;
      this.$store.dispatch("updateApplicantStatus", applicant);
    },
    seeApplicantDetail(applicantId) {
      this.$router.push(`/profile/${applicantId}`);
    },
    applyJob(jobId) {
      this.$store.dispatch("applyJob", jobId);
    },
    findJobDetail() {
      this.$store.dispatch(
        "findJobDetail",
        this.$router.currentRoute.params.id
      );
    }
  },
  created() {
    this.findJobDetail();
  }
};
</script>

<style scoped>
p {
  margin: 0.5rem 1rem;
  font-family: "Gothic A1", sans-serif;
}

td {
  font-family: "Lateef", cursive;
  font-size: 1.2rem;
}

th {
  font-family: "Oswald", sans-serif;
}
</style>
