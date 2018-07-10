<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <q-input class="col-xs-12 q-mb-md" v-model="order.name" float-label="联系人" placeholder="请输入联系人" :before="[{icon: 'person'}]" />
      <q-input class="col-xs-12 q-mb-md" v-model="order.phone" float-label="手机号" placeholder="请输入手机号" :before="[{icon: 'phone'}]" />
      <q-select 
        class="col-xs-12 q-mb-lg"
        v-model="order.platenum"
        float-label="车牌号"
        :options="plateNumOptions"
        :before="[{icon: 'drive_eta'}]"
        clearable
      />
      <div class="row col-xs-12"><p class="caption">安检:</p></div>
      <q-select 
        class="col-xs-12 q-mb-lg"
        v-model="vehicleType"
        float-label="车辆类型"
        :options="vehicleOptions"
        :before="[{icon: 'format_list_bulleted'}]"
        clearable
      />
      <div class="row q-mb-lg gutter-xl">
        <q-checkbox class="col q-mr-md" v-model="secuAddition" val="路试(100)" color="amber" left-label label="路试(100)" />
        <q-checkbox class="col" v-model="secuAddition" val="称重(100)" color="amber" left-label label="称重(100)" />
      </div>
      
      <div class="row col-xs-12"><p class="caption">环检:</p></div>
      <q-select 
        class="col-xs-12 q-mb-lg"
        v-model="order.fuelType"
        float-label="燃油类型"
        :options="fuelOptions"
        :before="[{icon: 'format_list_bulleted'}]"
        clearable
      />
      <div class="col-xs-12 row q-mb-lg gutter-y-sm" v-if="order.fuelType == '汽油、天然气、电'">
        <div class="col"><q-radio v-model="envCheckType" val="初检(90)" color="amber" label="初检(90)" /></div>
        <div class="col"><q-radio v-model="envCheckType" val="一次复检(0)" color="amber" label="一次复检(0)" /></div>
        <div class="col"><q-radio v-model="envCheckType" val="二次复检(45)" color="amber" label="二次复检(45)" /></div>
        <div class="col"><q-radio v-model="envCheckType" val="三次复检(90)" color="amber" label="三次复检(90)" /></div>
      </div>
      <div class="row q-mb-lg gutter-y-sm" v-if="order.fuelType == '柴油'">
        <q-radio class="col" v-model="envCheckType" val="初检(60)" color="amber" label="初检(60)" />
        <q-radio class="col" v-model="envCheckType" val="一次复检(0)" color="amber" label="一次复检(0)" />
        <q-radio class="col" v-model="envCheckType" val="二次复检(30)" color="amber" label="二次复检(30)" />
        <q-radio class="col" v-model="envCheckType" val="三次复检(60)" color="amber" label="三次复检(60)" />
      </div>
      <q-datetime 
        class="col-xs-12 q-mb-lg" clearable 
        float-label="预约时间" v-model="order.orderDate" 
        type="datetime" :before="[{icon: 'date_range'}]" 
        :first-day-of-week="1" color="light-blue"
        format-model="number" :min="settings.startDate" :max="settings.endDate"
      />
      <div class="row q-mb-lg gutter-xl">
        <q-radio class="col" v-model="order.paymentMethod" val="网上缴费" color="amber" left-label label="网上缴费" />
        <q-radio class="col" v-model="order.paymentMethod" val="现场缴费" color="amber" left-label label="现场缴费" />
      </div>
      <q-btn :loading="btnLoading" color="positive" class="full-width" @click="addOrder" label="预约" />
      <!-- <q-btn label="test" @click="test" /> -->
    </div>
  </q-page>
</template>

<script>
import * as wechatUtil from '../utils/wechat'
import { getRandomArbitrary } from '../utils/common'
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
const today = new Date()
export default {
  // name: 'PageName',
  data: () => ({
    today,
    vehicleType: '',
    envCheckType: '',
    order: {
      name: '',
      phone: '',
      customerId: '',
      platenum: '',
      vehicleType: '',
      secuAddition: '',
      fuelType: '',
      envCheckType: '',
      orderDate: null,
      paymentMethod: '',
      payStatus: '未支付',
      orderNum: '',
      vehicleTypeFee: 0,
      secuAdditionFee: 0,
      envCheckTypeFee: 0,
      totalFee: 0
    },
    settings: {
      startDate: today,
      endDate: null,
      hourAmount: 25
    },
    plateNumOptions: [],
    vehicleOptions: [
      { label: '小、微型汽车(1)', value: '小、微型汽车(1)' },
      { label: '轻型汽车(210)', value: '轻型汽车(210)' },
      { label: '中型汽车(290)', value: '中型汽车(290)' },
      { label: '重型半挂车、中型半挂车、轻型半挂车(300)', value: '重型半挂车、中型半挂车、轻型半挂车(300)' },
      { label: '危险品挂车(390)', value: '危险品挂车(390)' },
      { label: '大型、重型汽车(390)', value: '大型、重型汽车(390)' }
    ],
    secuAddition: [],
    fuelOptions: [
      { label: '汽油、天然气、电', value: '汽油、天然气、电' },
      { label: '柴油', value: '柴油' }
    ],

    btnLoading: false
   
  }),
  computed: {
    ...mapGetters([
      'userInfo',
      'registerInfo'
    ])
  },

  validations: {
    order: {
      name: { required },
      phone: { required },
      platenum: { required },
      orderDate: { required },
      paymentMethod: { required }
    }
  },
  // created() {
  //   // wechatUtil.wechatConfig();
  //   // alert('created');
  // },
  created() {
    if (this.registerInfo) {
      // this.$http.get(process.env.API + '/check/order/unpaid?customerId=' + this.registerInfo.customer.id)
      // .then(res => {
      //   if (res.data.code == '200' && res.data.data) {
      //     this.$router.push({ name: '预约详情', params: { orderNum: res.data.data.orderNum } });
      //     return;
      //   }
      // });
      // for (var i=0; i<this.registerInfo.cars.length; i++) {
      //   var plateNum = { label: this.registerInfo.cars[i].plateNum, value: this.registerInfo.cars[i].plateNum };
      //   this.plateNumOptions.push(plateNum);
      // }
      this.disposeUnpaid();
      this.getSettings();
      return;
    } 
    this.$http.post(process.env.API + "/customer/list?openid=" + this.userInfo.openId,
    ).then(res => {
      if (res.data.code == '200') {
        if (!res.data.data) {
          this.$q.notify({
            message: '请先登记',
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            position: 'top'
          });
          setTimeout(() => {
            this.$router.push('/register');
          }, 1500);
        } else {
          this.$store.commit('saveRegisterInfo', res.data.data);
          // this.$http.get(process.env.API + '/check/order/unpaid?customerId=' + this.registerInfo.customer.id)
          // .then(res => {
          //   if (res.data.code == '200' && res.data.data) {
          //     this.$router.push({ name: '预约详情', params: { orderNum: res.data.data.orderNum } });
          //     return;
          //   }
          // });
          // for (var i=0; i<this.registerInfo.cars.length; i++) {
          //   var plateNum = { label: this.registerInfo.cars[i].plateNum, value: this.registerInfo.cars[i].plateNum };
          //   this.plateNumOptions.push(plateNum);
          // }
          this.disposeUnpaid();
          this.getSettings();
        }
        // console.log('registerInfo: ', this.registerInfo);
        // console.log('userInfo: ', this.userInfo);
      }
    });
  },
  methods: {
    disposeUnpaid() {
      this.$http.get(process.env.API + '/check/order/unpaid?customerId=' + this.registerInfo.customer.id)
      .then(res => {
        if (res.data.code == '200' && res.data.data) {
          this.$router.push({ name: '预约详情', params: { orderNum: res.data.data.orderNum } });
          return;
        }
      });
    },
    getSettings() {
      this.order.name = this.registerInfo.customer.name;
      this.order.phone = this.registerInfo.customer.phone;
      for (var i=0; i<this.registerInfo.cars.length; i++) {
        var plateNum = { label: this.registerInfo.cars[i].plateNum, value: this.registerInfo.cars[i].plateNum };
        this.plateNumOptions.push(plateNum);
      }
      this.$http.post(process.env.API + '/order/setting/getSettings')
      .then(res => {
        if (res.data.data) {
          this.settings = res.data.data;
        }
      })
    },
    checkOrderDate(cb) {
      this.$http.post(process.env.API + '/check/order/checkOrderDate?orderDate=' + this.order.orderDate + '&hourAmount=' + this.settings.hourAmount)
      .then(res => {
        // console.log(res.data.data);
        cb(res.data.data)
      })
    },
    // test() {
    //   this.checkOrderDate(msg => {
    //     if (msg) {
    //       this.$q.notify(msg);
    //       return;
    //     }
    //   })
    // },
    keyValueSplit(str) {
      var key = str.split('(')[0];
      var value =  parseFloat(str.split('(')[1].split(')')[0]);
      return { key, value };
    },
    prepareOrder() {
      // console.log(this.order);
      this.order.name = this.registerInfo.customer.name;
      this.order.phone = this.registerInfo.customer.phone;
      this.order.customerId = this.registerInfo.customer.id;
      this.order.orderNum = Date.now() + getRandomArbitrary(100000, 999999);
      if (this.vehicleType != '') {
        this.order.vehicleType = this.keyValueSplit(this.vehicleType).key;
        this.order.vehicleTypeFee = this.keyValueSplit(this.vehicleType).value;
      }
      if (this.secuAddition != '') {
        var tmpSecuAddition = [];
        for (var i=0; i<this.secuAddition.length; i++) {
          var tmpObj = this.keyValueSplit(this.secuAddition[i]);
          this.order.secuAdditionFee += tmpObj.value;
          tmpSecuAddition.push(tmpObj.key);
        }
        this.order.secuAddition = tmpSecuAddition.join(',');
      }
      if (this.envCheckType != '') {
        this.order.envCheckType = this.keyValueSplit(this.envCheckType).key;
        this.order.envCheckTypeFee = this.keyValueSplit(this.envCheckType).value;
      }
      this.order.totalFee = this.order.vehicleTypeFee + this.order.secuAdditionFee + this.order.envCheckTypeFee;
      // console.log('order: ', this.order);
    },
    addOrder() {
      this.prepareOrder();
      // if (this.order.totalFee == 0) {
      //   this.$q.notify('预约信息填写有误！');
      //   return;
      // }
      if (!this.$v.order.name.required) {
        this.$q.notify('联系人不能为空！');
      } else if (!this.$v.order.phone.required) {
        this.$q.notify('手机号不能为空！');
      } else if (!this.$v.order.platenum.required) {
        this.$q.notify('车牌号不能为空！');
      } else if (!this.$v.order.orderDate.required) {
        this.$q.notify('预约时间不能为空！');
      } else if (!this.$v.order.paymentMethod.required) {
        this.$q.notify('缴费方式不能为空！');
      } else if (this.order.totalFee == 0) {
        this.$q.notify('预约信息填写有误！');
        return;
      } else {
        this.checkOrderDate(msg => {
          if (msg) {
            this.$q.notify(msg);
            return;
          }
          this.btnLoading = true;
          this.$http.post(process.env.API + '/check/order/add', this.order)
          .then(res => {
            // console.log(res.data);
            if (res.data.code == 200) {
              this.btnLoading = false;
              if (this.order.paymentMethod == '现场缴费') {
                // this.$router.push('orderRecord');
                this.$router.push({ name: '预约详情', params: { orderNum: this.order.orderNum } });
              } else if (this.order.paymentMethod == '网上缴费') {
                this.$http.post(process.env.API + '/pay/createOrder',
                {
                  body: 'JSAPITEST',
                  outTradeNo: this.order.orderNum,
                  totalFee: this.order.totalFee,
                  spbillCreateIp: '218.56.36.83',
                  notifyUrl: 'http://selinplus.natappvip.cc/pay/parseOrderNotifyResult',
                  tradeType: 'JSAPI',
                  openid: this.userInfo.openId,
                  signType: 'MD5'
                })
                .then(
                  res => {
                    console.log(res.data);
                    const _this = this;
                    wechatUtil.wechatPay(res.data, function(res) {
                      // alert(JSON.stringify(res));
                      _this.$router.push({ name: '预约详情', params: { orderNum: _this.order.orderNum } });
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
            } else {
              this.$q.notify({
                color: 'negative',
                icon: 'mood_bad',
                message: res.data.message,
                position: 'top',
                timeout: 1000,
              })
            }
          })
          .catch(err => {
            this.btnLoading = false;
            console.log(err);
          }) 
        })
        
      }
    }
  }
}
</script>

<style>
</style>
