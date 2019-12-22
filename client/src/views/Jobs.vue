<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1" v-if="!isLoading">
          <div>
            <b-input-group size="lg" class="mt-5" placeholder="search">
              <b-form-input v-model="searchedJob" placeholder="Search ..."></b-form-input>
              <b-input-group-append>
                <b-button size="sm" text="Button" variant="primary">
                  <i class="fa fa-search"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="col-md-10 offset-md-1 mt-1">
            <div>
              <b-form inline>
                <b-input-group class="mb-2 mr-sm-2 mb-sm-0 ">
                  <b-form-select id="input-3" v-model="country" :options="locations" required></b-form-select>
                </b-input-group>
                <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
                  <b-form-select id="input-3" v-model="category" :options="categories" required></b-form-select>
                </b-input-group>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["locations", "isLoading"])
  },
  data() {
    return {
      searchedJob: "",
      country: "null",
      category: null,
      categories: [
        { text: "Select Category", value: null },
        "Sales",
        "Engineering",
        "Data Science",
        "Retail",
        "Education",
        "Marketing & PR",
        "Manufacturing",
        "Creative & Design"
      ]
    };
  },
  created() {
    this.$store.dispatch("getLocation");
  }
};
</script>

<style>
</style>