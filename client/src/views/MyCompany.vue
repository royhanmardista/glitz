<template>
  <div v-if="!isLoading">
      <h1>this is my company page</h1>
      <CompanyForm v-if="!userCompany"></CompanyForm>
  </div>
</template>

<script>
import CompanyForm from '@/components/CompanyForm.vue'
import { mapState } from 'vuex'

export default {
    computed : {
        ...mapState(["userCompany", "isLoading"])
    },
    components : {
        CompanyForm
    },
    methods : {
        searchCompany() {
            this.$store.dispatch('searchUserCompany')
        }
    },
    created() {
        this.searchCompany()
        this.$store.dispatch("getLocation");
    }

}
</script>

<style>

</style>