<template>
  <q-page>
    <!-- content -->
    <q-card inline flat class="col-xs-12">
      <q-card-media>
      </q-card-media>
      <q-card-title>
        {{ infoDetail.title }}
      </q-card-title>
      <q-card-main v-html="infoDetail.content"></q-card-main>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    infoDetail: { title: '', content: '' }
  }),
  mounted() {
    // this.$http.get('/getContent', { params: { type: "aboutUs" } })
    this.$http.get(process.env.API + '/module/info/detail?type=行业资讯&id=' + this.$route.params.id)
    .then(res => {
      this.infoDetail = res.data.data.moduleInfo;
    })
    .catch(err => {
      console.log(err);
    });
  }
}
</script>

<style>
</style>
