<template>
  <div class="container-fluid">
    <div class="row mt-3">
      <div v-if="isLoading" style="position:fixed;top:50%;left:45%">
        <PacmanLoader color="#5BC0EB" :size="50"></PacmanLoader>
      </div>
    </div>
    <div class="row mt-3" v-if="!isLoading">
      <div class="col-md-8 offset-md-2 shadow rounded p-3 bg-light">
        <h3 class="text-center">Update Your Profile</h3>
        <b-form @submit.prevent="updateProfile()">
          <!-- full name -->
          <b-form-group label="Full Name">
            <b-form-input
              v-model="userProfile.fullname"
              type="text"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <!-- birth date -->
          <b-form-group label="Select your birth date">
            <b-form-input v-model="birthDate" required type="date"></b-form-input>
          </b-form-group>
          <!-- phone -->
          <b-form-group label="Phone">
            <b-form-input
              v-model="userProfile.phone"
              required
              placeholder="Insert your phone number"
              type="text"
            ></b-form-input>
          </b-form-group>
          <!-- skills -->
          <b-form-group label="Skills">
            <b-form-input
              v-model="skills"
              type="text"
              required
              placeholder="Please Separate Skills using Comma"
            ></b-form-input>
          </b-form-group>
          <!-- experience -->
          <b-form-group label="Please choose experience">
            <b-form-select v-model="userProfile.experience" :options="experiences" required></b-form-select>
          </b-form-group>
          <!-- Education -->
          <b-form-group label="Education">
            <b-form-select v-model="univLocation" :options="locations" required></b-form-select>
            <b-form-select class="mt-2" v-model="university" :options="universities" required></b-form-select>
            <b-form-select class="mt-2" v-model="degree" :options="degrees" required></b-form-select>
          </b-form-group>

          <!-- description -->
          <b-form-group label="Description">
            <vue-editor v-model="userProfile.description" />
          </b-form-group>
          <!-- location -->
          <b-form-group label="Location">
            <b-form-select v-model="userProfile.location" :options="locations" required></b-form-select>
          </b-form-group>
          <!-- submit -->
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
import moment from 'moment'
import { PacmanLoader } from '@saeris/vue-spinners'

export default {
  name: 'UpdateUserDetail',
  component: {
    VueEditor,
    PacmanLoader
  },
  computed: {
    ...mapState(['locations', 'isLoading', 'universities', 'userProfile']),
    birthDate: {
      get () {
        if (this.userProfile) {
          return moment(this.userProfile.birthDate).format('YYYY-M-D')
        }
      },
      set (newVal) {
        return (this.birthDateInput = newVal)
      }
    },
    skills: {
      get () {
        if (this.userProfile) {
          return this.userProfile.skills.join(', ')
        }
      },
      set (newVal) {
        if (newVal) {
          return (this.skillInput = newVal)
        }
      }
    },
    univLocation: {
      get () {
        if (this.userProfile) {
          return `${this.userProfile.education
            .split(',')[2]
            .trim()}, ${this.userProfile.education.split(',')[3].trim()}`
        }
      },
      set (newVal) {
        if (newVal) {
          return (this.univLocationInput = newVal)
        }
      }
    }
  },
  created () {
    this.findUserProfile()
  },
  data () {
    return {
      education: null,
      skillInput: null,
      birthDateInput: null,
      univLocationInput: null,
      university: null,
      degree: null,
      degrees: [
        { text: 'Select Degree', value: null },
        'High School',
        'Undergraduate',
        'Bachelor Degree',
        'Master Degree',
        'Doctoral Degree',
        'Post Doctoral'
      ],
      experiences: [
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
    univLocationInput: function () {
      console.log('ketrigger')
      if (this.univLocation) {
        this.$store.dispatch(
          'getUniversities',
          this.univLocationInput.split(',')[0].trim()
        )
      }
    }
  },
  methods: {
    async findUserProfile () {
      await this.$store.dispatch(
        'findUseProfile',
        this.$router.currentRoute.params.id
      )
      await this.$store.dispatch('getLocation')
      await this.$store.dispatch(
        'getUniversities',
        `${this.userProfile.education.split(',')[2].trim()}`
      )
    },
    updateProfile () {
      let education = `${this.degree}, ${this.university}, ${this.univLocation}`
      let data = {
        education,
        birthDate: this.birthDateInput || this.birthDate,
        skills: this.skillInput || this.skills
      }
      this.$store.dispatch('updateProfile', data)
    }
  }
}
</script>
