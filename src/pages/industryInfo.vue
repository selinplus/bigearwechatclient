<template>
  <q-pull-to-refresh :handler="refresher">
  <q-page padding>
    <!-- content -->
    <q-list no-border>
      <q-infinite-scroll :handler="loadMore" ref="infiniteScroll">
        <q-item separator link v-for="(item, index) in items" 
          :key="index" :to="{ name: '行业资讯详情', params: { id: item.id } }"
        >
          <q-item-main>
            <q-item-tile label>{{ item.title }}</q-item-tile>
            <q-item-tile sublabel v-html="removeHTMLTag(item.content).substr(0, 50)"></q-item-tile>
          </q-item-main>
        </q-item>
        <div class="row justify-center" style="margin-bottom: 50px;">
          <q-spinner-dots v-if="showSpinnerDots" slot="message" :size="40" />
        </div>
      </q-infinite-scroll>
    </q-list>
  </q-page>
  </q-pull-to-refresh>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    items: [],
    totalCount: 0,
    showSpinnerDots: true
}),
  methods: {
    loadMore(index, done) {
      console.log("pageIndex: ", index);
      this.$http.post(process.env.API + '/module/info/list?page=' + index + '&size=7')
      .then(res => {
        // console.log(res.data.data);
        this.items = this.items.concat(res.data.data.list);
        done();
      })
      .catch(err => {
        console.log(err);
      });
    },
    refresher (done) {
      setTimeout(() => {
        done()
        // this.items.push({ id: this.items.length })
        // this.$q.notify('Item #' + this.items.length + ' is new.')
      }, 1000)
    },
    removeHTMLTag(str) {
      str = str.replace(/<\/?[^>]*>/g,''); // 去除HTML tag
      str = str.replace(/[ | ]*\n/g,'\n'); // 去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g,'\n'); // 去除多余空行
      str=str.replace(/&nbsp;/ig,'');// 去掉&nbsp;
      str=str.replace(/\s/g,''); // 将空格去掉
      return str;
    }
  },
  mounted() {
    // this.$http.get('/getContent', { params: { type: "industryInfo" } })
    this.$http.get(process.env.API + '/module/info/totalCount')
    .then(res => {
      this.totalCount = res.data.data;
    })
    .catch(err => {
      console.log(err);
    });
    // this.$http.post(process.env.API + '/module/info/list?page=1&size=7')
    //   .then(res => {
    //     // console.log(res.data.data);
    //     this.items = res.data.data.list;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  },
  updated() {
    console.log("updated", this.items.length);
    if (this.items.length >= this.totalCount) {
      this.$refs.infiniteScroll.stop();
      this.showSpinnerDots = false;
    }
  }
}
</script>

<style>
</style>
