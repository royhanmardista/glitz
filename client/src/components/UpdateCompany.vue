<template>
  <div class="container-fluid mt-5">
    <div class="row mx-1">
      <div
        class="col-md-8 offset-md-2 border rounded p-5 bg-light"
        v-if="!isLoading && userCompany"
      >
        <h3 class="text-center">Update Your Company</h3>
        <b-form @submit.prevent="updateCompany">
          <b-form-group id="input-group-1" label="Company Name" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="userCompany.name"
              type="text"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Url" label-for="input-2">
            <b-form-input v-model="userCompany.url" required placeholder="Fill The Url"></b-form-input>
          </b-form-group>

          <b-form-group label="Category" label-for="inputCategory">
            <b-form-select
              id="inputCategory"
              v-model="userCompany.category"
              :options="categories"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <b-form-textarea
              id="input-2"
              v-model="userCompany.description"
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
  name: "updateCompany",
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
  mounted() {
    this.searchCompany();
    this.setCountry();
  },
  data() {
    return {
      country: "",
      region : null,
      city : null,
      categories: [
        { text: "Select Category", value: null },
        "Sales",
        "Engineering",
        "Data Science",
        "Retail",
        "Education",
        "Marketing & PR",
        "Manufacturing",
        "Creative & Design",
        "userCompany"
      ]
    };
  },

  watch: {
    country: function() {
      this.region = null;
      this.$store.dispatch("getRegions", this.country.split(",")[1]);
    },
    region: function () {
      this.city = null
      let payload = {
        country: this.country.split(',')[1],
        region: this.region
      }
      if (this.region) {
        this.$store.dispatch('getCities', payload)
      }
    }
  },
  methods: {
    async setCountry() {
      if (this.userCompany) {
        this.country = this.userCompany.country;
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
      location.push(this.country.split(",")[0]);      
      await this.$store.dispatch("updateCompany", location.join(', '));
    }
  }
};
</script>
