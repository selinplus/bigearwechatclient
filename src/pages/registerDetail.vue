<template>
  <q-page padding>
    <!-- content -->
    <q-list no-border separator>
      <q-list-header class="text-center">我的登记信息
        <q-btn icon="delete" color="negative" round dense flat  @click="remove"></q-btn>
      </q-list-header>
      <q-item>
        <q-item-main class="gutter-xs">
          <q-item-tile label>{{ registerInfo.customer.name }}</q-item-tile>
          <q-item-tile sublabel>{{ registerInfo.customer.phone }}</q-item-tile>
        </q-item-main>
      </q-item>
      <q-collapsible v-for="(car, index) in registerInfo.cars" :key="index" :label="car.plateNum">
        <!-- <q-item-tile sublabel class="row justify-between q-ml-md">车牌号<div class="q-mr-md" style="color: #444">鲁Y8888</div></q-item-tile> -->
        <q-card-media>
          <q-carousel
            color="white"
            arrows
            infinite
            height="150px"
          >
            <q-carousel-slide v-for="(photo, index) in car.photos" :key="index" :img-src="'upload/' + photo" />
          </q-carousel>
        </q-card-media>
      </q-collapsible>
    </q-list>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  // name: 'PageName',
  data: () => ({
    
  }),
  computed: {
    ...mapGetters([
      'userInfo',
      'registerInfo'
    ])
  },
  methods: {
    remove() {
      // debugger;
      this.$http.post(process.env.API + "/customer/delete?id=" + this.registerInfo.customer.id)
      .then(res => {
        if (res.data.code == '200') {
          this.$router.push('/register');
        }
      })
    }
  }
  
}
</script>

<style>
</style>
