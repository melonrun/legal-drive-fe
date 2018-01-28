<template>
  <section class="content">
    <div class="row center-block">
      <div class="col-md-4 col-sm8 col-xs-10">
        <button type="button" class="btn btn-primary btn-tumblr" data-toggle="modal"
                data-target="#modal-add-user" @click='addNewUser()'>创建用户
        </button>
        <button type="button" class="btn btn-primary btn-tumblr" @click='jumpToTeamManagerView()'>管理团队</button>
      </div>
    </div>
    <div class="modal" id="modal-add-user" :style="isAddUserShow ? 'display:block;' : ''">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click='closeAddUserModal()'>X</span></button>
            <h4 class="modal-title">{{modalTitle}}</h4>
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
                    <input type="text" class="form-control" id="inputPassword" placeholder="Password"
                           v-model="userPass">
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
                <div style="color: red;">{{addNewUserError}}</div>
              </div>
              <!-- /.box-body -->
              <!-- /.box-footer -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" @click='closeAddUserModal()'>
              Close
            </button>
            <button type="button" class="btn btn-primary btn-tumblr" data-dismiss="modal" @click='callAddNewUser(-1)'>
              Save And Close
            </button>
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

              <tr v-if="response" v-for="(userItem, index) in response">
                <td>{{userItem.userName }}</td>
                <td>{{userItem.roleName }}</td>
                <td>{{userItem.teamNames }}</td>
                <td>
                  <button type="button" class="btn btn-primary btn-xs btn-github" v-if="userItem.roleId!=1"
                          @click='editUser(index)'>修改密码
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix">
            <ul class="pagination pagination-sm no-margin pull-left">
              <li>共有 {{totalUserItem}}  个用户，共{{totalUserPageNum}}页</li>
            </ul>
            <ul class="pagination pagination-sm no-margin pull-right">
              <li><a href="#" @click='callUserList(1)'>«</a></li>
              <li><a href="#" @click='callUserList(userCurrentPageNum-1)'><</a></li>
              <li><a href="#" @click='callUserList(userCurrentPageNum)'>{{userCurrentPageNum}}</a></li>
              <li><a href="#" @click='callUserList(userCurrentPageNum+1)'>></a></li>
              <li><a href="#" @click='callUserList(totalUserPageNum)'>»</a></li>
            </ul>
          </div>
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
      editUserId: -1,
      response: '',
      roleList: '',
      teamList: '',
      userName: '',
      userPass: '',
      modalTitle: '',
      roleId: '',
      teamIds: [],
      isAddUserShow: false,
      addNewUserError: '',
      userCurrentPageNum: 1,
      totalUserItem: 0,
      totalUserPageNum: 1
    }
  },
  methods: {
    callUserList: async function (toPageNum) {
      if (toPageNum === undefined || toPageNum <= 0) {
        toPageNum = 1
      }
      if (toPageNum > this.totalUserPageNum) {
        toPageNum = this.totalUserPageNum
      }
      this.userCurrentPageNum = toPageNum
      const res = await api.get('/user/list?pageNum=' + toPageNum)
      if (res.status) {
        this.response = res.result.users
        this.totalUserItem = res.result.totalItem
        this.totalUserPageNum = res.result.totalPage
      } else if (!res.status) {
        this.error = res.msg
      }
    },
    callRoleList: async function (roleId, teamIds) {
      const res = await api.get('/role/list')
      if (res.status) {
        this.roleList = res.result
        if (roleId !== -1) {
          this.roleId = roleId
        }
      }
      const teamRes = await api.get('/team/list')
      if (teamRes.status) {
        this.teamList = teamRes.result.teams
        if (teamIds !== -1) {
          this.teamIds = teamIds
        }
      }
    },
    callAddNewUser: async function () {
      const {editUserId, userName, userPass, roleId, teamIds} = this
      let userId = editUserId
      if (!userName || !userPass || !roleId || !teamIds) {
        this.addNewUserError = '请填写完整用户信息.'
        return
      }
      const res = await api.post('/user/addOrUpdate', {userId, userName, userPass, roleId, teamIds})
      console.log(res)
      if (res.status) {
        this.response = res.msg
        this.callUserList()
        this.isAddUserShow = false
      } else {
        this.error = res.msg
      }
    },
    addNewUser: function () {
      this.modalTitle = '新增用户'
      this.isAddUserShow = true
      this.callRoleList(-1, -1)
      this.editUserId = -1
    },
    editUser: function (index) {
      let userItem = this.response[index]
      this.modalTitle = '编辑用户'
      this.isAddUserShow = true
      this.callRoleList(userItem.roleId, userItem.teamIds)
      this.editUserId = userItem.userId
      this.userName = userItem.userName
    },
    closeAddUserModal: function () {
      this.isAddUserShow = false
    },
    jumpToTeamManagerView: function () {
      this.$router.replace({ path: '/team' })
    }
  },
  mounted () {
    this.callUserList()
  }
}
</script>
