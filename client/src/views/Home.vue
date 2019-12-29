<template>
  <div>
    <b-jumbotron :fluid="true" class="jumbotronColor">
      <template v-slot:header>Glintzzz</template>

      <template
        v-slot:lead
      >Explore jobs & internships from top companies & discover a career you’ll love! or Post job for free. Find the best candidates to join your mission!</template>

      <hr class="my-4" />

      <p>
        It uses utility classes for typography and spacing to space content out within the larger
        container.
      </p>

      <b-button variant="primary" href class="mr-2 mb-1" @click.prevent="toJobs">Explore Job Now</b-button>
      <b-button variant="success" href @click.prevent="myCompany" class="mb-1">Go Make Your First Company</b-button>
    </b-jumbotron>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src="@/assets/home.svg" alt srcset class="w-100" />
        </div>
        <div class="d-flex flex-column justify-content-between col-md-6">
          <div>
            <h2 class="">DISCOVER</h2>
            <h5>Discover different career paths and the latest job opportunities</h5>
          </div>
          <div>
            <h2>DEVELOP</h2>
            <h5>Develop the right skill sets to build your dream career</h5>
          </div>
          <div>
            <h2>GET CONNECTED</h2>
            <h5>Get Connected directly with companies who reach out to you for the hottest opportunities</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    toJobs() {
      this.$router.push("/jobs");
    },
    myCompany() {
      this.$router.push("/mycompany");
    }
  },
  beforeCreate: function() {
    document.body.className = "home";
  }
};
</script>

<style>
.jumbotronColor {
  background: rgb(22, 88, 223);
  background: linear-gradient(
    90deg,
    rgba(22, 88, 223, 1) 0%,
    rgba(234, 234, 226, 1) 0%,
    rgba(211, 201, 194, 1) 0%,
    rgba(215, 215, 215, 1) 0%,
    rgba(170, 98, 57, 1) 0%,
    rgba(151, 200, 227, 1) 0%,
    rgba(123, 160, 227, 1) 26%,
    rgba(81, 141, 208, 1) 51%,
    rgba(39, 121, 216, 1) 78%,
    rgba(7, 118, 199, 1) 96%
  );
}
</style>
