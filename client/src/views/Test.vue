<template>
  <div class="overflow-auto">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>

    <p class="mt-3">Current Page: {{ currentPage }}</p>

    <div v-if="!isLoading" class="row" small>
      <div
        id="my-table"
        :per-page="perPage"
        :current-page="currentPage"
        class="col-md-4 col-xs-12 col-sm-12"
        v-for="job in jobs"
        :key="job._id"
      >
        <div
          class="border rounded px-3 py-1 mb-3 d-flex flex-column justify-content-between"
          style="min-height:180px"
        >
          <div class="row text-left">
            <div class="col-md-11 col-xs-11 col-sm-11 d-flex flex-column justify-content-between">
              <h5>
                <a class="text-dark" :href="job.company_url" target="_blank">{{job.title}}</a>
              </h5>
              <p>
                <i class="fa fa-building-o"></i>
                {{job.company}}
              </p>
              <p>
                <i class="fa fa-map-marker"></i>
                {{job.location}}
              </p>
            </div>
            <div class="col-md-1 col-xs-1 col-sm-1">
              <div class>
                <i class="fa fa-bookmark"></i>
              </div>
            </div>
          </div>
          <div class="text-center border-top pt-1">
            <i class="fa fa-clock-o"></i>
            {{moment(job.created_at ).format("dddd, MMMM Do YYYY, h:mm:ss a")}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      items: []
      //   items: [
      //     { id: 1, first_name: "Fred", last_name: "Flintstone" },
      //     { id: 2, first_name: "Wilma", last_name: "Flintstone" },
      //     { id: 3, first_name: "Barney", last_name: "Rubble" },
      //     { id: 4, first_name: "Betty", last_name: "Rubble" },
      //     { id: 5, first_name: "Pebbles", last_name: "Flintstone" },
      //     { id: 6, first_name: "Bamm Bamm", last_name: "Rubble" },
      //     { id: 7, first_name: "The Great", last_name: "Gazzoo" },
      //     { id: 8, first_name: "Rockhead", last_name: "Slate" },
      //     { id: 9, first_name: "Pearl", last_name: "Slaghoople" }
      //   ]
    };
  },
  computed: {
    ...mapState(["github", "isLoading"]),
    rows() {
      return this.github.length;
    },
    jobs() {
      return this.github.slice(
        this.currentPage,
        this.currentPage + this.perPage
      );
    }
  },
  created() {}
};
</script>