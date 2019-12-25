<template>
  <div v-if="!isLoading" class="border-top">
    <div class="container mt-5 p-3">
      <div class="row border shadow p-3">
        <div class="col-md-3">
          <img :src="userProfile.image" class="border rounded-circle w-50" alt srcset />
        </div>
        <div class="col-md-9 d-flex flex-column justify-content-between">
          <div>
            <h4>{{userProfile.fullName}}</h4>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <div class="mt-2">
                <div><i class="fa fa-phone"></i> Phone</div>
                {{userProfile.phone}}
              </div>
              <div class="mt-2">
                <div><i class="fa fa-map-marker"></i> Location</div>
                {{userProfile.location}}
              </div>
            </div>
            <div>
              <div class="mt-2">
                <div><i class="fa fa-envelope"></i> Email</div>
                {{userProfile.email}}
              </div>
              <div class="mt-2">
                <div><i class="fa fa-clock-o"></i> Age</div>
                {{userProfile.birthDate}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3 border shadow p-3">
        <h4>Education</h4>
        <div class="container mt-3">
          <div>{{userProfile.education}}</div>
        </div>
      </div>
      <div class="row mt-3 border shadow p-3">
        <h4>Skills</h4>
        <div class="container mt-3">
          <div class="row d-flex justify-content-start">
            <div
              v-for="skill in userProfile.skills"
              :key="skill"
              class="border rounded px-4 py-2 mr-2 bg-dark text-white"
            >
              <div class>{{skill}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3 border shadow p-3">
        <h4>Experience</h4>
        <div class="container mt-3">
          <div>{{userProfile.experience}} years</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["userProfile", "isLoading"])
  },
  created() {
    this.findUserProfile();
  },
  methods: {
    async findUserProfile() {
      await this.$store.dispatch(
        "findUseProfile",
        this.$router.currentRoute.params.id
      );
    }
  }
};
</script>

<style>
</style>