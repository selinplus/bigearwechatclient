<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <q-input class="col-xs-12 q-mb-md" v-model="name" float-label="姓名" placeholder="请输入姓名" :before="[{icon: 'person'}]" />
      <q-input class="col-xs-12 q-mb-md" v-model="phone" float-label="手机号" placeholder="请输入手机号" :before="[{icon: 'phone'}]" />
      <div v-for="(car, index) in cars" :key="index" class="col-xs-12">
        <q-input class="q-mb-lg col-xs-12" v-model="car.plateNum" float-label="车牌号" placeholder="请输入车牌号" :before="[{icon: 'drive_eta'}]" /> 
        <q-uploader class="q-mb-lg" multiple stack-label="图片上传" auto-expand 
          :url="uploadUrl" 
          @add="filesAdd" @uploaded="fileUploaded" 
          @start="uploadStart(car)"
          @fail="fileUploadFail" @finish="finishUpload"
        />  
      </div>
      <q-btn flat round icon="add" class="q-mb-lg" @click="addCar"></q-btn>
      <q-btn :loading="btnLoading" color="positive" class="full-width" @click="register" label="登记" />
    </div>
    
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  // name: 'PageName',
  data: () => ({
    name: '',
    phone: '',
    currentCar: {},
    cars: [ { plateNum: '', photos: [] } ],
    btnLoading: false,
    uploadUrl: process.env.API + '/upload',
    registerInfo: {}
  }),
  validations: {
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([

    ]),
    addCar() {
      this.cars.push({ plateNum: '', photos: [] });
    },
    filesAdd(files) {
      console.log('files: ', files);
      // console.log('car: ', car);
    },
    uploadStart(car) {
      console.log("uploadStart: ", car);
      this.currentCar = car;
      // this.cars[index] = car;
    },
    fileUploaded(file, xhr) {
      console.log('file: ', file);
      console.log('response: ', JSON.parse(xhr.response).path);
      this.currentCar.photos.push(JSON.parse(xhr.response).path);
    },
    fileUploadFail(file, xhr) {
      console.log('file: ', file);
      console.log('failResponse: ', xhr.response);
    },
    finishUpload() {
      console.log('finishUpload!');
    },
    register() {
      // console.log(this.userInfo);
      this.btnLoading = true;
      this.$http.post(
        process.env.API + '/customer/add', 
        { 
          customer: {
            name: this.name, 
            phone: this.phone,
            openid: this.userInfo.openId,
            nickname: this.userInfo.nickname
          },
          // cars: [{ plateNum: { plateNum: "af23rr" }, photos: [ { photo: "fafa" } ]}]
          cars: this.cars
        } 
      )
      .then(res => {
        this.btnLoading = false;
        if (res.data.message == "SUCCESS") {
          this.$router.push('/registerDetail');
          this.registerInfo = {
            customer: {
              name: this.name, 
              phone: this.phone,
              openid: this.userInfo.openId,
              nickname: this.userInfo.nickname
            },
            cars: this.cars
          };
          this.$store.commit('saveRegisterInfo', this.registerInfo);
        }
      })
      .catch(err => {
        this.btnLoading = false;
        console.log(err);
      });   
    },

    fetchData() {
      this.$http.post(process.env.API + "/customer/list?openid=" + this.userInfo.openId,
        // { openid: this.userInfo.openId } 
      ).then(res => {
        if (res.data.code == '200') {
          this.registerInfo = res.data.data;
          console.log(this.registerInfo);
          if (this.registerInfo.customer) {
            this.$router.push('/registerDetail');
            this.$store.commit('saveRegisterInfo', this.registerInfo);
          }
        }
      });
    }
  },
  created() {
    this.fetchData();
  }
}
</script>

<style>
</style>
