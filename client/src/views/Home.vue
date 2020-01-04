<template>
  <div>
    <b-jumbotron :fluid="true" class="jumbotronColor mb-0">
      <template v-slot:header>Glintzzz</template>

      <template
        v-slot:lead
      >Explore jobs & internships from top companies & discover a career you’ll love! or Post job for free. Find the best candidates to join your mission!</template>

      <hr class />

      <p>
        It uses utility classes for typography and spacing to space content out within the larger
        container.
      </p>

      <b-button variant="primary" href class="mr-2 mb-2" @click.prevent="toJobs">Explore Job Now</b-button>
      <b-button
        variant="success"
        href
        @click.prevent="myCompany"
        class="mb-2"
      >Go Make Your First Company</b-button>
    </b-jumbotron>
    <!-- promotion  -->
    <section class="promotion p-5">
      <div class="container border p-2">
        <div class="row border p-2">
          <div class="col-md-6">
            <img src="@/assets/home.svg" alt srcset class="w-100" />
          </div>
          <div class="d-flex flex-column justify-content-between col-md-6 pt-4 pb-3">
            <div>
              <h2>DISCOVER</h2>
              <h5>Discover different career paths and the latest job opportunities</h5>
            </div>
            <div class="mt-2">
              <h2>DEVELOP</h2>
              <h5>Develop the right skill sets to build your dream career</h5>
            </div>
            <div class="mt-2">
              <h2>GET CONNECTED</h2>
              <h5>Get Connected directly with companies who reach out to you for the hottest opportunities</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- promotion setion -->
    <section class="aboutMe p-5" style="min-height:250px">
      <div class="container">
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-3 d-flex justify-content-center">
                  <img
                    src="@/assets/me.jpg"
                    alt="Media Aside"
                    style="width:150px"
                    class="border rounded-circle"
                  />
                </div>
                <div class="col-md-9 mt-2">
                  <div class="d-flex justify-content-center flex-column">
                    <h5 class="text-center text-dark">About the Author</h5>
                    <p
                      style="font-size:0.8rem"
                      class="text-justify text-secondary"
                    >Hey it's me, Royhan mardista, I am a newbie web developer, in these couple of months, I have been learning web development mostly from online courses, documentation, and youtube. I am passionate in learning web development especially backend and aiming to be a full-fledge backend developer in the future.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer -->
    <footer class="page-footer font-small text-light pt-4 bg-dark sticky-bottom">
      <!-- Footer Links -->
      <div class="container-fluid text-center text-md-left">
        <!-- Grid row -->
        <div class="row">
          <!-- Grid column -->
          <div class="col-md-6 mt-md-0 mt-3">
            <!-- Content -->
            <h5 class="text-uppercase">
              <i class="fa fa-star"></i> Glintzzz
            </h5>
            <p style="font-size:.8rem" class="text-justify">Glintzzz is job portal website I perposely disign to work similar with glints, hence the name, but of course not all the features are implemented here hehe. This website use vuejs(vuex) and bootstrap for client side and nodejs with express for server side.</p>
          </div>
          <!-- Grid column -->

          <hr class="clearfix w-100 d-md-none pb-3" />

          <!-- Grid column -->
          <div class="col-md-3 mb-md-0 mb-3 text-left">
            <!-- Links -->
            <h5 class="text-uppercase">Medias</h5>

            <ul class="list-unstyled">
              <li>
                <a href="https://github.com/royhanmardista">
                  <i class="fa fa-github-square fa-2x text-white pr-2"></i>Github
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/royhan.mardista">
                  <i class="fa fa-facebook-square fa-2x text-white pr-2"></i>Facebook
                </a>
              </li>
            </ul>
          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-3 mb-md-0 mb-3 text-left">
            <!-- Links -->
            <h5 class="text-uppercase">Medias</h5>

            <ul class="list-unstyled">
              <li>
                <a href="
                    https://www.instagram.com/royhan_mardista">
                  <i class="fa fa-instagram fa-2x text-white pr-2"></i>Instagram
                </a>
              </li>
              <li>
                <a href="
                    https://www.linkedin.com/in/royhan-m-43182011b/">
                  <i class="fa fa-linkedin-square fa-2x text-white pr-2"></i>Linkdin
                </a>
              </li>
            </ul>
          </div>
          <!-- Grid column -->
        </div>
        <!-- Grid row -->
      </div>
      <!-- Footer Links -->

      <!-- Copyright -->
      <div class="footer-copyright text-center py-3">
        © 2020 Copyright:
        <a
          href="http://profile.royhan-mardista.online/"
          target="blank"
        >Royhan Mardista</a>
      </div>
      <!-- Copyright -->
    </footer>
    <!-- Footer -->
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
  },
  created() {
    this.$store.dispatch("findUser");
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Amiri:700&display=swap");

.jumbotronColor {
  background: rgb(22, 88, 223);
  background: linear-gradient(
    90deg,
    rgba(22, 88, 223, 1) 0%,
    rgba(234, 234, 226, 1) 0%,
    rgba(211, 201, 194, 1) 0%,
    rgba(215, 215, 215, 1) 0%,
    rgba(170, 98, 57, 1) 0%,
    rgba(55, 214, 250, 1) 0%,
    rgba(76, 223, 239, 1) 26%,
    rgba(23, 191, 224, 1) 51%,
    rgba(8, 170, 229, 1) 78%,
    rgba(67, 156, 234, 1) 96%
  );
}

.aboutMe {
  background-color: #e1efe6;
}

.promotion {
  background-color: #efcb68;
}

.promotion h2,
h5 {
  /* font-family: "Amiri", serif; */
  color: rgb(245, 245, 234);
}

.promotion h5 {
  color: #474350;
}
</style>
