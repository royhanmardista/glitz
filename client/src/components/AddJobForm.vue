<template>
  <div class="container-fluid" v-if="!isLoading">
    <div class="row mx-1">
      <div class="col-md-8 offset-md-2 border rounded p-5 bg-light" v-if="!isLoading">
        <h3 class="text-center mb-5">Please Fill This Form to Post a Job</h3>
        <b-form @submit.prevent="createJob">
          <b-form-group id="input-group-1" label="Position Name" label-for="input-1">
            <b-form-input id="input-1" v-model="name" type="text" required placeholder="Enter name"></b-form-input>
          </b-form-group>

          <b-form-group label="Skills" label-for="input-2">
            <b-form-input
              v-model="skills"
              required
              placeholder="Please Separate Skills using Comma"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Minimum Experience" label-for="inputCategory">
            <b-form-select id="inputCategory" v-model="minExp" :options="categories" required></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <b-form-textarea
              id="input-2"
              v-model="description"
              required
              placeholder="Fill Description"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group label="Select Location" label-for="input-1">
            <b-form-select v-model="country" :options="locations" required></b-form-select>
            <b-form-select class="mt-2" v-model="region" :options="regions"></b-form-select>
            <b-form-select v-model="city" :options="cities" class="mt-2"></b-form-select>
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
  name: "addJobForm",
  computed: {
    ...mapState([
      "locations",
      "isLoading",
      "regions",
      "searchingRegion",
      "cities",
      "searchingCity",
      "userCompany"
    ])
  },
  mounted() {},
  data() {
    return {
      minExp: null,
      name: "",
      description: "",
      country: null,
      region: null,
      city: null,
      skills: null,
      categories: [
        { text: "Choose Experience", value: null },
        "1 year",
        "2 years",
        "3 years",
        "4 years",
        "5 years",
        "6 years or more"
      ]
    };
  },
  watch: {
    country: function() {
      this.region = null;
      this.$store.dispatch("getRegions", this.country.split(",")[1]);
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
    async createJob() {
      let location = []
      if (this.city) {
        location.push(this.city)
      }
      if (this.region) {
        location.push(this.region)
      }
      location.push(this.country.split(",")[0])
      let skills = []
      this.skills.split(',').forEach(skill => {
        skills.push(skill.trim())
      });
      let form = {
        name: this.name,
        description: this.description,
        skills,
        minExp: Number(this.minExp[0]),
        companyId: this.userCompany._id,
        location: location.join(', ')
      };
      await this.$store.dispatch("createJob", form);
    }
  }
};
</script>
