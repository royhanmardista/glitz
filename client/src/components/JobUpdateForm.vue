<template>
  <div class="container-fluid" v-if="!isLoading && jobDetail">
    <div class="row mx-1">
      <div class="col-md-8 offset-md-2 border rounded p-5 bg-light" v-if="!isLoading">
        <h3 class="text-center mb-5">Please Fill This Form to Update Job</h3>
        <b-form @submit.prevent="updateJob">
          <b-form-group id="input-group-1" label="Position Name" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="jobDetail.name"
              type="text"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Skills" label-for="input-2">
            <b-form-input
              v-model="skills"
              required
              placeholder="Please Separate Skills using Comma"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Minimum Experience" label-for="inputCategory">
            <b-form-select
              id="inputCategory"
              v-model="jobDetail.minExp"
              :options="categories"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <vue-editor v-if="jobDetail.description" v-model="jobDetail.description" />
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
import { mapState } from 'vuex'
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  name: 'JobUpdateForm',
  computed: {
    ...mapState(['locations', 'isLoading', 'regions', 'cities', 'jobDetail']),
    skills: {
      get () {
        if (this.jobDetail) {
          return this.jobDetail.skills.join(', ')
        }
      },
      set (newVal) {
        return (this.inputSkills = newVal)
      }
    },
    country: {
      get () {
        if (this.jobDetail) {
          return this.jobDetail.country
        }
      },
      set (newVal) {
        return (this.inputCountry = newVal)
      }
    }
  },
  created () {
    this.findJobDetail()
    this.setCountry()
  },
  data () {
    return {
      inputSkills: null,
      inputCountry: null,
      region: null,
      city: null,
      categories: [
        { text: 'Choose Experience', value: null },
        { text: 'no experience', value: 0 },
        { text: '1 year', value: 1 },
        { text: '2 years', value: 2 },
        { text: '3 years', value: 3 },
        { text: '4 years', value: 4 },
        { text: '5 years', value: 5 },
        { text: '6 years or more', value: 6 }
      ]
    }
  },
  watch: {
    inputCountry: function () {
      this.region = null
      this.$store.dispatch('getRegions', this.country.split(',')[1])
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
      if (this.jobDetail) {
        this.inputCountry = this.jobDetail.country
      }
      await this.$store.dispatch('getLocation')
    },
    findJobDetail () {
      this.$store.dispatch(
        'findJobDetail',
        this.$router.currentRoute.params.id
      )
    },
    async updateJob () {
      let location = []
      if (this.city) {
        location.push(this.city)
      }
      if (this.region) {
        location.push(this.region)
      }
      location.push(this.inputCountry)
      let skills = []
      this.skills.split(',').forEach(skill => {
        skills.push(skill.trim())
      })
      location = location.join(', ')
      await this.$store.dispatch('updateJob', location)
    }
  }
}
</script>
