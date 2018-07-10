<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-layout-header reveal>
      <q-toolbar inverted color="dark">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          钉钉测试 
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-layout-footer class="row content-stretch my-footer">
      <q-btn-dropdown no-ripple no-wrap size="16px" text-color="dark" class="col-xs-4" color="white" align="center" label="八角年审">
        <q-list dense>
          <q-item to="/aboutUs">关于我们</q-item>
          <q-item-separator />
          <q-item to="/serviceFeature">服务特色</q-item>
          <q-item-separator />
          <q-item to="/customerVoice">客户之声</q-item>
          <q-item-separator />
          <q-item to="/positionNav">位置导航</q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown no-ripple no-wrap size="16px" text-color="dark" class="col-xs-4" color="white" align="center" label="业务办理">
        <q-list dense>
          <q-item to="/register">登记注册</q-item>
          <q-item-separator/>
          <q-item to="/annualCheckOrder">年审预约</q-item>
          <q-item-separator />
          <q-item to="/illegalQuery">违章查询</q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown no-ripple no-wrap size="16px" text-color="dark" class="col-xs-4" color="white" align="center" label="便民服务">
        <q-list dense>
          <q-item to="/industryInfo">行业资讯</q-item>
          <q-item-separator/>
          <q-item to="/checkProcess">检车流程</q-item>
        </q-list>
      </q-btn-dropdown>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
  .my-footer {
    height: 49px;
  }
</style>
