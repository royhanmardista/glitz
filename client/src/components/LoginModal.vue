<template>
  <div>
    <b-modal
      id="modal-login"
      ref="modal"
      hide-footer
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <template v-slot:modal-title>Sign in to your account</template>
      <form ref="form" @submit.stop.prevent="handleSubmit" class>
        <!-- title -->
        <b-form-group label="Title" label-for="title-input" invalid-feedback="title is required">
          <b-form-input id="title-input" v-model="email" type="text" required></b-form-input>
        </b-form-group>
        <!-- title end  -->

        <!-- description start -->
        <b-form-group
          label="Description"
          label-for="description-input"
          invalid-feedback="description is required"
        >
          <b-form-textarea id="description-input" v-model="password" type="area" required></b-form-textarea>
        </b-form-group>
        <!-- description end -->
      </form>
      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "LoginModal",
  components: {},
  created() {},
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid ? "valid" : "invalid";
      return valid;
    },
    resetModal() {
      this.email = "";
      this.password = "";
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
    }
  }
};
</script>

<style scoped>
</style>
