<template>
  <div v-if="!isLoading">
    <h1>this is my company page</h1>
    <CompanyForm v-if="!userCompany"></CompanyForm>
  </div>
</template>

<script>
import CompanyForm from "@/components/CompanyForm.vue";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["userCompany", "isLoading"])
  },
  components: {
    CompanyForm
  },
  methods: {
    async searchCompany() {
      await this.$store.dispatch("searchUserCompany");
      await this.$store.dispatch("getLocation");
    }
  },
  created() {
    this.searchCompany();
  }
};
</script>

<style>
</style>
