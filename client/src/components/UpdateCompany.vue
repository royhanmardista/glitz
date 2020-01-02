<template>
  <div class="container-fluid mt-3">
    <div class="row">
      <div v-if="searchingUserCompany" style="position:fixed;top:50%;left:45%">
          <HashLoader color="#182825" :size="50"></HashLoader>
        </div>
      <div
        class="col-md-8 offset-md-2 shadow p-3 bg-light"
        v-if="userCompany"
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

          <b-form-group id="input-group-2" label="Description" >
            <vue-editor v-model="userCompany.description" />
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
    <!-- modal start -->
    <b-modal
      v-model="updatingCompany"
      centered
      hide-header
      content-class="shadow"
      hide-footer
      size="sm"
    >
      <div class="d-flex flex-column justify-content-between">
        <div class="text-center">
          <h5 class="text-center text-info">Updating Company ...</h5>
        </div>
        <div class="mx-auto my-5">
          <RotateLoader color="#5BC0EB"></RotateLoader>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'updateCompany',
  computed: {
    ...mapState(['locations', 'searchingUserCompany', 'regions', 'cities', 'userCompany', 'updatingCompany']),
    country: {
      get () {
        if (this.userCompany) {
          return this.userCompany.country.trim()
        }
      },
      set (newVal) {
        return (this.inputCountry = newVal)
      }
    }
  },
  mounted () {
    this.searchCompany()
    this.setCountry()
  },
  data () {
    return {
      inputCountry: null,
      region: null,
      city: null,
      categories: [
        { text: 'Select Category', value: null },
        'Sales',
        'Engineering',
        'Data Science',
        'Retail',
        'Education',
        'Marketing & PR',
        'Manufacturing',
        'Creative & Design',
        'userCompany'
      ]
    }
  },

  watch: {
    inputCountry: function () {
      this.region = null
      if (this.inputCountry) {
        this.$store.dispatch('getRegions', this.inputCountry.split(',')[1])
      }
    },
    country: function () {
      this.region = null
      this.$store.dispatch('getRegions', this.country.split(',')[1])
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
    async setCountry () {
      if (this.userCompany) {
        this.country = this.userCompany.country.trim()
      }
      await this.$store.dispatch('getLocation')
    },
    async searchCompany () {
      await this.$store.dispatch('searchUserCompany')
      await this.$store.dispatch('getLocation')
    },
    async updateCompany () {
      let location = []
      if (this.city) {
        location.push(this.city)
      }
      if (this.region) {
        location.push(this.region)
      }
      location.push(this.inputCountry || this.country)
      await this.$store.dispatch('updateCompany', location.join(', '))
    }
  }
}
</script>
