<template lang="html">
  <b-navbar id="template-header" class="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style="box-shadow:none;" toggleable="md">
    <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
      <router-link class="navbar-brand brand-logo" to="/">
        <img src="../../assets/images/tori-logo.png" alt="logo" />
      </router-link>
      <router-link class="navbar-brand brand-logo-mini" to="/">
        <img src="../../assets/images/tori-logo.png" alt="logo" />
      </router-link>
    </div>
    <div class="navbar-menu-wrapper d-flex align-items-center ml-auto ml-lg-0">
      <button class="navbar-toggler navbar-toggler align-self-center" type="button" @click="collapedSidebar()">
        <span class="mdi mdi-menu"></span>
      </button>
      <b-navbar-nav class="navbar-nav navbar-nav-left header-links d-none d-md-flex">
        <b-nav-item class="font-weight-semibold d-none d-lg-block" href="#">Online Lecture Note & Summary Service</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="navbar-nav-right ml-auto">
        <div style='position:absolute; right:35px;'><b-nav-item-dropdown right class="preview-list user-dropdown">
          <template slot="button-content">
            <div class="d-flex align-items-center">
              <img class="img-xs rounded-circle" src="https://avatars.githubusercontent.com/u/5829095?v=4" alt="Profile image">
            </div>
          </template>
          <b-dropdown-item>
            <div class="dropdown-header text-center w-100">
              <img class="img-md rounded-circle" src="https://avatars.githubusercontent.com/u/5829095?v=4" alt="Profile image">
              <p class="mb-1 mt-3 font-weight-semibold">Kim-kwan-woo</p>
              <p class="font-weight-light text-muted mb-0">kw2577@gmail.com</p>
            </div>
          </b-dropdown-item>
          <b-dropdown-item>Sign Out<i class="dropdown-item-icon ti-power-off"></i></b-dropdown-item>
        </b-nav-item-dropdown></div>
      </b-navbar-nav>
      <button class="navbar-toggler navbar-toggler-right align-self-center" type="button" @click="collapedMobileSidebar()">
        <span class="mdi mdi-menu"></span>
      </button>
    </div>
  </b-navbar>
</template>

<script lang="js">
// eslint-disable-next-line
import JQuery from 'jquery'
let $ = JQuery
export default {
  name: 'app-header',
  methods: {
    collapedSidebar: function () {
      $('body').toggleClass('sidebar-icon-only')
    },
    collapedMobileSidebar: function () {
      $('#sidebar').toggleClass('active')
    }
  }
}
</script>

<style scoped lang="scss">
.app-header {
}
</style>
