<template>
  <q-page padding>
    <!-- content -->
    <q-list no-border>
      <q-infinite-scroll :handler="loadMore" ref="infiniteScroll">
        <q-item separator link v-for="(item, index) in items" 
          :key="index" :to="{ name: '预约详情', params: { orderNum: item.orderNum } }"
        >
          <q-item-main>
            <q-item-tile label>{{ item.platenum }}</q-item-tile>
            <q-item-tile sublabel>预约时间：{{ dateFmt(item.orderDate) }}</q-item-tile>
          </q-item-main>
        </q-item>
        <div class="row justify-center" style="margin-bottom: 50px;">
          <q-spinner-dots slot="message" :size="40" />
        </div>
      </q-infinite-scroll>
    </q-list>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  // name: 'PageName',
  data: () => ({
    items: []
  }),
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$http.post(process.env.API + '/check/order/list?page=1&size=8')
      .then(res => {
        this.items = res.data.data.list;
      })
      .catch(err => {
        console.log(err);
      }) 
    },
    loadMore(index, done) {
      console.log('index: ', index);
      // setTimeout(() => {
      //   let items = [];
      //   for (let i=0; i<9; i++) {
      //     items.push({ id: '1'})
      //   }
      //   this.items = this.items.concat(items);
      //   done();
      // }, 1000);
      
      this.$http.post(process.env.API + '/check/order/list?page=' + index + '&size=8')
      .then(res => {
        console.log("orderRecord: ", res.data);
        this.items = this.items.concat(res.data.data.list);
        done();
      })
      .catch(err => {
        console.log(err);
      })
    },
    dateFmt(timeStamp) {
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    }
  }

}
</script>

<style>
</style>
