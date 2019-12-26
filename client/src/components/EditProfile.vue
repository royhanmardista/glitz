<template>
  <div class="container-fluid mt-5">
    <div class="row mx-1">
      <div
        class="col-md-8 offset-md-2 border rounded p-5 bg-light"
        v-if="!isLoading && userProfile"
      >
        <h3 class="text-center">Edit Your Profile</h3>
        <b-form @submit.prevent="updateProfile">
          <!-- full name -->
          <b-form-group label="Full Name">
            <b-form-input
              v-model="userProfile.fullName"
              type="text"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <!-- phone -->
          <b-form-group label="Phone" label-for="input-2">
            <b-form-input
              v-model="userProfile.phone"
              required
              placeholder="Insert your phone number"
            ></b-form-input>
          </b-form-group>
          <!-- skills -->
          <b-form-group label="Skills" label-for="input-2">
            <b-form-input
              v-model="skills"
              required
              placeholder="Please Separate Skills using Comma"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Education">
            <b-form-select v-model="userProfile.location" :options="locations" required></b-form-select>
            <b-form-select v-model="userProfile.education" :options="universities" required></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <b-form-textarea
              id="input-2"
              v-model="userProfile.description"
              required
              placeholder="Fill Description"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group label="Select Location" label-for="input-1">
            <b-form-select v-model="userProfile.location" :options="locations" required></b-form-select>
          </b-form-group>
          <b-button type="submit" variant="primary mr-2">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UpdateProfile",
  computed: {
    ...mapState([
      "locations",
      "isLoading",
      "regions",
      "searchingRegion",
      "cities",
      "searchingCity",
      "userProfile"
    ])
  },
  mounted() {
    this.searchCompany();
    this.setCountry();
  },
  data() {
    return {
      country: "",
      region: null,
      city: null
    };
  },

  watch: {
    country: function() {
      this.region = null;
      if (this.country) {
        this.$store.dispatch("getRegions", this.country.split(",")[1]);
      }
    },
    region: function() {
      this.city = null;
      let payload = {
        country: this.country.split(",")[1],
        region: this.region
      };
      if (this.region) {
        this.$store.dispatch("getCities", payload);
      }
    }
  },
  methods: {
    async setCountry() {
      if (this.userProfile) {
        this.country = this.userProfile.country.trim();
      }
    },
    async searchCompany() {
      await this.$store.dispatch("searchUserCompany");
      await this.$store.dispatch("getLocation");
    },
    async updateCompany() {
      let location = [];
      if (this.city) {
        location.push(this.city);
      }
      if (this.region) {
        location.push(this.region);
      }
      location.push(this.country);
      await this.$store.dispatch("updateCompany", location.join(", "));
    }
  }
};
</script>
