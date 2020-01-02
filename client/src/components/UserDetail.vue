<template>
  <div>
    <div v-if="isLoading">
      <div class="container">
        <div class="row">
          <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
            <PacmanLoader color="#5BC0EB" :size="50"></PacmanLoader>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLoading">
      <AddUserDetail v-if="!userProfile"></AddUserDetail>
      <CollapseTransition v-if="userProfile">
        <div class="container mt-2 p-3" v-show="!isLoading">
          <div class="row shadow p-3 ">
            <div class="col-md-2 p-0 mx-2">
              <b-img
                :src="userProfile.image"
                alt
                srcset
                style=" width: 100%;
                min-height: 12vw;
                object-fit: cover;"
                class="rounded"
              />
            </div>
            <div class="col-md-9 d-flex flex-column p-0 m-0 container-fluid">
              <div class="d-flex">
                <h3 class="">{{userProfile.fullname.toUpperCase()}}</h3>
                <div
                  v-if="userProfile.userId == loggedUser._id"
                  class="editProfile h3"
                  v-b-tooltip.hover
                  title="Edit your profile"
                  @click.prevent="toEditPage(userProfile)"
                >
                  <i class="ml-2 fa fa-pencil"></i>
                </div>
              </div>
              <div class="d-flex justify-content-between row">
                <div class="col-md-4">
                  <div class="mt-2">
                    <div class="text-secondary font-weight-bold">
                      <i class="fa fa-phone"></i> Phone
                    </div>
                    {{userProfile.phone}}
                  </div>
                  <div class="mt-2">
                    <div class="text-secondary font-weight-bold">
                      <i class="fa fa-map-marker"></i> Location
                    </div>
                    {{userProfile.location}}
                  </div>
                </div>
                <div class="col-md-4 mb-2">
                  <div class="mt-2">
                    <div class="text-secondary font-weight-bold">
                      <i class="fa fa-envelope"></i> Email
                    </div>
                    {{userProfile.email}}
                  </div>
                  <div class="mt-2">
                    <div class="text-secondary font-weight-bold">
                      <i class="fa fa-clock-o"></i> Age
                    </div>
                    {{moment().diff(userProfile.birthDate, 'years')}} years old
                  </div>
                </div>
                <div class="col-md-4">
                  <h4 class="text-secondary">Statistic</h4>
                  <h1>{{userProfile.appliedJob.length}}</h1>
                  <p>Applications Sent</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3 shadow p-3">
            <h4>Description</h4>
            <div class="container mt-3">
              <div class="row">
                <span class="container text-justify" v-html="userProfile.description"></span>
              </div>
            </div>
          </div>
          <div class="row mt-3 shadow p-3">
            <h4>Education</h4>
            <div class="container mt-3">
              <div>{{userProfile.education}}</div>
            </div>
          </div>
          <div class="row mt-3 shadow p-3">
            <h4>Skills</h4>
            <div class="container mt-3">
              <div class="row d-flex justify-content-start">
                <div
                  v-for="skill in userProfile.skills"
                  :key="skill"
                  class="border rounded px-4 py-2 mr-1 mt-1 bg-dark text-white"
                >
                  <div class>{{skill}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3 shadow p-3">
            <h4>Experience</h4>
            <div class="container mt-3">
              <div>{{userProfile.experience}} years</div>
            </div>
          </div>
        </div>
      </CollapseTransition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CollapseTransition } from 'vue2-transitions'
import AddUserDetail from '@/components/AddUserDetail.vue'
import { PacmanLoader } from '@saeris/vue-spinners'

export default {
  name: 'UserProfile',
  data () {
    return {}
  },
  components: {
    CollapseTransition,
    AddUserDetail,
    PacmanLoader
  },
  computed: {
    ...mapState(['userProfile', 'isLoading', 'loggedUser'])
  },
  created () {
    this.findUserProfile()
  },
  methods: {
    toEditPage (userProfile) {
      this.$router.push(`/profile/update/${userProfile.userId}`)
    },
    async findUserProfile () {
      await this.$store.dispatch(
        'findUseProfile',
        this.$router.currentRoute.params.id
      )
      await this.$store.dispatch('getLocation')
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('findUseProfile', to.params.id)
    next()
  }
}
</script>

<style scoped>
.editProfile {
  cursor: pointer;
  color: rgb(104, 104, 110);
}

.editProfile:hover {
  color: rgb(45, 55, 197);
}
</style>
