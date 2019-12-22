<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-10 offset-md-1 border rounded p-5 bg-light">
        <h3 class="text-center">Let's Start by Filling this Form</h3>
        <b-form>
          <b-form-group id="input-group-1" label="Company Name" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="name"
              type="email"
              required
              placeholder="Enter name"
            ></b-form-input>
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
          <b-form-group  label="Select Location" label-for="input-1">
            <b-form-select v-model="country" :options="locations" required></b-form-select>
            <b-form-select
                class="mt-2"
              v-model="region"
              :options="regions"
              required
            ></b-form-select>
            <b-form-select v-if="!isLoading" v-model="city" required class="mt-2"></b-form-select>
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
  computed: {
    ...mapState(["locations", "isLoading", "regions", "searchingRegion"])
  },
  mounted() {},
  data() {
    return {
      cities: [],
      name: "",
      description: "",
      country: null,
      region: null,
      city: null
    };
  },
  watch: {
    country: function() {
        this.region = null
      this.$store.dispatch("getRegions", this.country.split(",")[1]);
    }
  },
  methods: {}
};
</script>