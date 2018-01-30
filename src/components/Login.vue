<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
          <img src="/legal/static/img/legal-driver-banner.png" class="center-block logo">
          <div class="text-center col-md-4 col-sm-offset-4">
            <!-- login form -->
            <form class="ui form loginForm"  @submit.prevent="checkCredits">

              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
                <input class="form-control" name="userName" placeholder="Username" type="text" v-model="userName"
                autocomplete="off">
              </div>

              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                <input class="form-control" name="userPass" placeholder="Password" type="password" v-model="userPass">
              </div>

              <div class="row">
                <div v-if=response class="text-red text-left
                  col-xs-8" style="margin-top: 3%;"><p>{{response}}</p></div>
                <div class="col-xs-4 pull-right">
                  <button class='' type="submit"
                          v-bind:class="'btn btn-block btn-primary' + loading">Submit</button>
                </div>
              </div>
            </form>
            <!-- errors -->
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'Login',
  data () {
    return {
      section: 'Login',
      loading: '',
      userName: '',
      userPass: '',
      response: ''
    }
  },
  methods: {
    checkCredits: async function () {
      const {userName, userPass} = this
      const res = await api.post('/entry/login', {userName, userPass})
      if (res.status) {
        this.response = res.msg
        api.setCookie('_ld_user_role_cookie_', res.result['roleNameDisplay'])
        api.setCookie('_ld_user_name_cookie_', res.result['userName'])
        this.$router.replace({ path: '/user' })
        this.$router.go(0)
      } else if (!res.status) {
        this.response = res.msg
      }
    }
  }
}
</script>

<style>
html, body, .container-table {
  height: 100%;
  background-color: #5e6063 !important;
}
.container-table {
    display: table;
    color: white;
}
.vertical-10p {
  padding-top: 10%;
}
.logo {
  width: 45em;
}
.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}
.input-group input {
  height: 3em;
}
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset;
}
</style>
