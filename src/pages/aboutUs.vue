<template>
  <q-page class="row">
    <q-card inline flat class="col-xs-12">
      <q-card-media>
        <q-carousel v-if="carousels.length > 0"
          color="white"
          quick-nav
          quick-nav-icon="favorite"
          infinite
          autoplay
          height="170px"
        >
          <q-carousel-slide v-for="(carousel, index) in carousels" :key="index" :img-src="'upload/' + carousel.realname" />
        </q-carousel>
      </q-card-media>
      <q-card-title>
        关于我们:
      </q-card-title>
      <q-card-main v-html="aboutUs"></q-card-main>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data: () => ({
    aboutUs: '',
    carousels: []
  }),
  mounted() {
    // this.$http.get('/getContent', { params: { type: "aboutUs" } })
    this.$http.get(process.env.API + '/module/info/detail?type=' + '关于我们')
    .then(res => {
      console.log(res);
      this.aboutUs = res.data.data.moduleInfo.content;
      this.carousels = res.data.data.carousels;
    })
    .catch(err => {
      console.log(err);
    });
  }
}
</script>
