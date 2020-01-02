<template>
  <div>
    <b-modal
      id="modal-update"
      ref="login-modal"
      @hidden="resetModal"
      hide-footer
      header-text-variant="info"
      content-class="shadow"
      size="sm"
    >
      <template v-slot:modal-title>
        <h4>User Detail</h4>
      </template>
      <form ref="form" class="p-2" v-if="applicant">
        <!-- status start -->
        <div>
          <div>Name</div>
          <div>{{applicant.applicantId.username}}</div>
        </div>
        <div>
          <p>email</p>
          <p>{{applicant.applicantId.email}}</p>
        </div>
        <b-form-group label="Status">
          <b-form-select v-model="applicant.status" :options="statusOption" required></b-form-select>
        </b-form-group>
        <!-- form-group// -->
        <div class="form-group">
          <button type="submit" class="btn btn-info btn-block" @click.prevent="login">
            <b-spinner small v-if="isLoading" variant="light" label="Spinning"></b-spinner>
            <span v-if="!isLoading">Confirm</span>
          </button>
        </div>
        <!-- password end -->
      </form>
    </b-modal>
  </div>
</template>

<script>
import server from '@/api/server'
import { mapState } from 'vuex'

export default {
  name: 'UpdateApplicantStatusModal',
  computed: {
    ...mapState(['isLoading', 'applicant'])
  },
  data () {
    return {
      statusOption: [
        'waiting evaluation',
        'accepted',
        'not suitable'
      ]
    }
  },
  methods: {
    resetModal () {
      console.log('ketrigger -------------')
      this.$store.dispatch(
        'findJobDetail',
        this.applicant.jobId
      )
    }
  }
}
</script>

<style scoped>
p {
  padding: 0px;
}
</style>
