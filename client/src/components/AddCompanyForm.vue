<template>
  <div class="container-fluid mt-5">
    <div class="row mx-1">
      <div class="col-md-8 offset-md-2 shadow p-5 bg-light" v-if="!isLoading">
        <h3 class="text-center">Let's Start by Filling this Form</h3>
        <b-form @submit.prevent="createCompany">
          <b-form-group id="input-group-1" label="Company Name" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="name"
              type="text"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Url" label-for="input-2">
            <b-form-input v-model="url" required placeholder="Fill The Url"></b-form-input>
          </b-form-group>

          <b-form-group label="Category" label-for="inputCategory">
            <b-form-select id="inputCategory" v-model="category" :options="categories" required></b-form-select>
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
            <b-form-select class="mt-2" v-model="region" :options="regions" required></b-form-select>
            <b-form-select v-model="city" :options="cities" required class="mt-2"></b-form-select>
          </b-form-group>
          <b-button type="submit" variant="primary mr-2" >Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name : "AddCompanyForm",
  computed: {
    ...mapState([
      'locations',
      'isLoading',
      'regions',
      'searchingRegion',
      'cities',
      'searchingCity'
    ])
  },
  mounted () {},
  data () {
    return {
      category: null,
      name: '',
      description: '',
      country: null,
      region: null,
      city: null,
      url: null,
      categories: [
        { text: 'Select Category', value: null },
        'Sales',
        'Engineering',
        'Data Science',
        'Retail',
        'Education',
        'Marketing & PR',
        'Manufacturing',
        'Creative & Design'
      ]
    }
  },
  watch: {
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
    async createCompany () {
      let form = {
        name: this.name,
        description: this.description,
        url: this.url,
        category: this.category,
        location: `${this.city},${this.region},${this.country}`
      }
      await this.$store.dispatch('createCompany', form)
    }
  }
}
</script>
