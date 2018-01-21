<template>
  <section class="content">
    <div class="row center-block">
      <div class="col-md-4 col-sm8 col-xs-10">
        <button type="button" class="btn btn-primary btn-tumblr" data-toggle="modal"
          data-target="#modal-add-user" @click='callRoleList()'>创建用户</button>
        <button type="button" class="btn btn-primary btn-tumblr">管理团队</button>
      </div>
    </div>
    <div class="modal fade" id="modal-add-user">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建用户</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="box-body">
                <div class="form-group">
                  <label for="inputUserName" class="col-sm-2 control-label">账号</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputUserName" placeholder="user name"
                      v-model="userName">
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword" class="col-sm-2 control-label">密码</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputPassword" placeholder="Password" v-model="userPass">
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputUserRole" class="col-sm-2 control-label">角色</label>
                  <div class="col-sm-10">
                    <select class="form-control select2" style="width: 100%;" id="inputUserRole"
                            v-model="roleId">
                        <option v-if="roleList" v-for="roleItem in roleList" v-bind:value="roleItem.roleId">
                          {{roleItem.roleName}}
                        </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputUserTeam" class="col-sm-2 control-label">所属团队</label>
                  <div class="col-sm-10">
                    <select class="form-control select2" multiple="multiple" data-placeholder="Select a Team"
                            style="width: 100%;" id="inputUserTeam" v-model="teamIds">
                        <option v-if="teamList" v-for="teamItem in teamList" v-bind:value="teamItem.id">
                          {{teamItem.teamName}}
                        </option>
                    </select>
                  </div>
                </div>
                <div style="color: red;">{{error}}</div>
              </div>
              <!-- /.box-body -->
              <!-- /.box-footer -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary btn-tumblr" data-dismiss="modal" @click='callAddNewUser()'>
              Save And Close</button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>

    <div class="row center-block" style="margin-top: 0.5%;">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">All User Table</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding table-responsive">
            <table class="table table-striped">
              <tbody>
              <tr>
                <th style="width: 12%;">用户名</th>
                <th>角色</th>
                <th>所属团队</th>
                <th>操作</th>
              </tr>

                <tr v-if="response" v-for="userItem in response" >
                  <td>{{userItem.userName }}</td>
                  <td>{{userItem.roleName }}</td>
                  <td>{{userItem.teamNames }}</td>
                  <td><button type="button" class="btn btn-primary btn-xs btn-github"
                              @click='changePass(userItem.userId)'>修改密码</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../../api'

export default {
  name: 'Login',
  data () {
    return {
      response: '',
      roleList: '',
      teamList: '',
      userName: '',
      userPass: '',
      roleId: '',
      teamIds: [],
      isShow: false,
      isShowClass: false,
      error: ''
    }
  },
  methods: {
    showModal: function () {
      this.isShow = true
    },
    closeModal: function () {
      this.isShow = false
      this.isShowClass = false
    },
    callUserList: async function () {
      const res = await api.get('/user/list')
      if (res.status) {
        this.response = res.result
      } else if (!res.status) {
        this.error = res.msg
      }
    },
    callRoleList: async function () {
      this.showModal()
      const res = await api.get('/role/list')
      if (res.status) {
        this.roleList = res.result
      }
      const teamRes = await api.get('/team/list')
      if (teamRes.status) {
        this.teamList = teamRes.result.teams
      }
    },
    callAddNewUser: async function () {
      console.log('123123')
      // $('#modal-add-user').cropper('destroy')
      // const {userName, userPass, roleId, teamIds} = this
      // const res = await api.post('/user/add', {userName, userPass, roleId, teamIds})
      // console.log(res)
      // if (res.status) {
      //   this.response = res.msg
      // $('#modal-add-user').modal('hide')
      // } else {
      //   this.error = res.msg
      // }
    },
    changePass: function (userId) {
      alert(userId)
    }
  },
  mounted () {
    this.callUserList()
  },
  watch: {
    isShow (value) {
      setTimeout(() => {
        this.nextShow = value
      }, 50)
    }
  }
}
</script>
