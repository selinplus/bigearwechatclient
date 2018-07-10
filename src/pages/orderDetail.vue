<template>
  <q-page>
    <!-- content -->
    <div class="row">
      <q-card no-border flat class="col-xs-12">
        <q-card-media style="height: 180px" overlay-position="bottom">
          <img src="statics/mountains.jpg">
          <q-card-title slot="overlay" class="text-center">
            ¥&nbsp;&nbsp;{{ orderDetail.totalFee }}
          </q-card-title> 
        </q-card-media>
        <q-item class="q-pt-lg">
          <q-item-main class="gutter-xs">
            <q-item-tile sublabel class="row justify-between q-ml-md">车牌号<div class="q-mr-md" style="color: #444">{{ orderDetail.platenum }}</div></q-item-tile>
            <q-item-tile sublabel class="row justify-between q-ml-md">姓名<div class="q-mr-md" style="color: #444">{{ orderDetail.name }}</div></q-item-tile>
            <q-item-tile sublabel class="row justify-between q-ml-md">手机号<div class="q-mr-md" style="color: #444">{{ orderDetail.phone }}</div></q-item-tile>
            <q-item-tile sublabel class="row justify-between q-ml-md">预约时间<div class="q-mr-md" style="color: #444">{{ dateFmt(orderDetail.orderDate) }}</div></q-item-tile>
            <q-item-tile v-if="orderDetail.vehicleType" sublabel class="row justify-between q-ml-md">安检:{{ orderDetail.vehicleType }}<div class="q-mr-md" style="color: #444">¥-{{ orderDetail.vehicleTypeFee }}</div></q-item-tile>
            <q-item-tile v-if="orderDetail.secuAddition" sublabel class="row justify-between q-ml-md">{{ orderDetail.secuAddition }}<div class="q-mr-md" style="color: #444">¥-{{ orderDetail.secuAdditionFee }}</div></q-item-tile>
            <q-item-tile v-if="orderDetail.fuelType" sublabel class="row justify-between q-ml-md">燃油类型<div class="q-mr-md" style="color: #444">{{ orderDetail.fuelType }}</div></q-item-tile>
            <q-item-tile v-if="orderDetail.envCheckType" sublabel class="row justify-between q-ml-md">环检:{{ orderDetail.envCheckType }}<div class="q-mr-md" style="color: #444">¥-{{ orderDetail.envCheckTypeFee }}</div></q-item-tile>
            <q-item-tile sublabel class="row justify-between q-ml-md">缴费方式<div class="q-mr-md" style="color: #444">{{ orderDetail.paymentMethod }}</div></q-item-tile>
            <q-item-tile sublabel class="row justify-between q-ml-md">缴费状态<div class="q-mr-md" style="color: #444">{{ orderDetail.payStatus }}</div></q-item-tile>
          </q-item-main>
        </q-item>
        <q-item-separator></q-item-separator>
        <q-item>
          <q-item-main class="gutter-xs">
            <q-item-tile sublabel class="row justify-between q-ml-md">创建时间<div class="q-mr-md" style="color: #444">{{ dateFmt(orderDetail.createTime) }}</div></q-item-tile>
            <q-item-tile sublabel class="row justify-between q-ml-md">订单号<div class="q-mr-md" style="color: #444">{{ orderDetail.orderNum }}</div></q-item-tile>
          </q-item-main>
        </q-item>
        <q-card-actions v-if="orderDetail.payStatus == '未支付'" class="col row">
          <div class="col text-center q-mb-md">
            <q-btn outline label="取消订单" color="negative" size="sm" class="q-mr-md" @click="cancelOrder(orderDetail.orderNum)" />
            <q-btn outline label="继续支付" color="positive" size="sm" @click="continuePay(orderDetail.orderNum)" />  
          </div>
        </q-card-actions>
      </q-card>
    </div>
    
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
import * as wechatUtil from '../utils/wechat'
import { mapActions, mapGetters } from 'vuex'
export default {
  // name: 'PageName',
  data: () => ({
    orderDetail: {}
  }),
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    // console.log(this.$route.params.id);
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$http.post(process.env.API + '/check/order/detail?orderNum=' + this.$route.params.orderNum)
      .then(res => {
        // console.log(res.data);
        // alert(JSON.stringify(res));
        if (res.data.code == '200') {
          this.orderDetail = res.data.data;
        } else {
          this.$q.notify({
            message: '订单详情获取失败，请刷新后重试！',
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            position: 'center'
          });
        }
      })
    },
    dateFmt(timeStamp) {
      return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    cancelOrder(orderNum) {
      this.$http.post(process.env.API + '/check/order/delete?orderNum=' + orderNum)
      .then(res => {
        if (res.data.code == '200') {
          this.$router.push('/annualCheckOrder');
        } else {
          this.$q.notify({
            message: '订单取消失败，请重试！',
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            position: 'center'
          });
        }
      })
      .catch(err => {

      })
    }, 
    continuePay(orderNum) {
      this.$http.post(process.env.API + '/pay/createOrder',
      {
        body: 'JSAPITEST',
        outTradeNo: this.orderDetail.orderNum,
        totalFee: this.orderDetail.totalFee,
        spbillCreateIp: '218.56.36.83',
        notifyUrl: 'http://selinplus.natappvip.cc/pay/parseOrderNotifyResult',
        tradeType: 'JSAPI',
        openid: this.userInfo.openId,
        signType: 'MD5'
      })
      .then(
        res => {
          const _this = this;
          wechatUtil.wechatPay(res.data, function(res) {
            // alert(JSON.stringify(res));
            // _this.$router.push({ name: '预约详情', params: { orderNum: _this.order.orderNum } });
            _this.fetchData();
          }, function(cancel) {
            // alert(JSON.stringify(cancel));
            // alert(JSON.stringify(_this));
            _this.$router.push({ name: '预约详情', params: { orderNum: _this.order.orderNum } })
          });
        }
      ) 
      .catch(
        err => {
          console.log(err);
        }
      )
    }
  }
}
</script>

<style>
</style>
