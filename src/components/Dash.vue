<template>
  <div :class="['wrapper', classes]">
    <header class="main-header">
      <a href="#" class="logo">
        <!-- mini logo for sidebar mini 50x50 pixels -->

        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg"><b>Legal</b>DRIVE</span>
      </a>
      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu" @click='callToggleUserProfile()'>
          <ul class="nav navbar-nav">

            <li class="dropdown user user-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <!-- The user image in the navbar-->
                <img src="/legal/static/img/stock/user.png" class="user-image" alt="User Image">
                <!-- hidden-xs hides the username on small devices so only the image appears. -->
                <span class="hidden-xs">{{ demo.displayName }}</span>
              </a>
              <ul class="dropdown-menu" :style="isUserProfileShow ? 'display:block; width:10%;' : 'width:10%'">
                <li class="user-footer">
                  <div class="pull-left">
                    <a href="#" class="btn btn-default btn-flat" @click='callBackToHome()'>Home</a>
                  </div>
                  <div class="pull-right">
                    <a href="#" class="btn btn-default btn-flat" @click='callSignOut()'>Sign out</a>
                  </div>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <sidebar :display-name="demo.displayName" />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper" @click='unShowUserProfile()'>
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name.toUpperCase() }}
          <small>{{ $route.meta.description }}</small>
        </h1>
        <ol class="breadcrumb">
          <li>
            <a href="javascript:;">
              <i class="fa fa-home"></i>Home</a>
          </li>
          <li class="active">{{$route.name.toUpperCase()}}</li>
        </ol>
      </section>

      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->

    <!-- Main Footer -->
    <footer class="main-footer">
      <strong>Copyright &copy; {{year}}
        <a href="javascript:;">Words Talk</a>.</strong> All rights reserved.
    </footer>
  </div>
  <!-- ./wrapper -->
</template>

<script>
import {serverConfig} from '../api/server_config'
import Sidebar from './Sidebar'
import 'hideseek'
import api from '../api'

export default {
  name: 'Dash',
  components: {
    Sidebar
  },
  data: function () {
    return {
      // section: 'Dash',
      year: new Date().getFullYear(),
      classes: {
        fixed_layout: serverConfig.fixedLayout,
        hide_logo: serverConfig.hideLogoOnMobile
      },
      error: '',
      isUserProfileShow: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    demo () {
      return {
        displayName: api.getCookie('_ld_user_name_cookie_'),
        email: 'faker.internet.email()',
        randomCard: 'faker.helpers.createCard()'
      }
    }
  },
  methods: {
    init () {
      if (!api.checkLoginStatus()) {
        this.$router.push({ path: '/login' })
      }
    },
    callBackToHome: function () {
      this.$router.replace({ path: '/user' })
      this.$router.go(0)
    },
    callSignOut: function () {
      api.setCookie('_ld_user_role_cookie_', '', 0)
      api.setCookie('_ld_user_name_cookie_', '', 0)
      this.$router.replace({ path: '/login' })
      this.$router.go(0)
    },
    callToggleUserProfile: function () {
      if (this.isUserProfileShow === true) {
        this.isUserProfileShow = false
      } else {
        this.isUserProfileShow = true
      }
    },
    unShowUserProfile: function () {
      this.isUserProfileShow = false
    }
  }
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}

.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}
</style>
