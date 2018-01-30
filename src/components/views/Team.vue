<template>
  <section class="content">
    <div class="row center-block">
      <div class="col-md-4 col-sm8 col-xs-10">
        <button type="button" class="btn btn-primary btn-tumblr" data-toggle="modal"
                data-target="#modal-add-team" @click='addNewTeam()'> 创建团队
        </button>
      </div>
    </div>

    <div class="modal" id="modal-add-team" :style="isAddTeamShow ? 'display:block;' : ''">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click='closeAddTeamModal()'>X</span></button>
            <h4 class="modal-title">{{addTeamModalTitle}}</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="box-body">
                <div class="form-group">
                  <label for="inputTeamName" class="col-sm-2 control-label">团队名称</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputTeamName" placeholder="team name"
                           v-model="teamName">
                  </div>
                </div>
                <div style="color: red;">{{addTeamError}}</div>
              </div>
              <!-- /.box-body -->
              <!-- /.box-footer -->
            </form>
          </div>
          <div class="modal-footer">`
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" @click='closeAddTeamModal()'>
              Close
            </button>
            <button type="button" class="btn btn-primary btn-tumblr" data-dismiss="modal" @click='callAddNewTeam(-1)'>
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
            <h3 class="box-title">Full Team Info Table</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding table-responsive">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <th style="width: 70%;">团队名称</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>

                <tr v-if="teamListResult" v-for="(teamListResultItem, index) in teamListResult">
                  <td>{{teamListResultItem.teamName }}</td>
                  <td>{{teamListResultItem.createTime}}</td>
                  <td>
                    <button type="button" class="btn btn-primary btn-xs btn-github"
                            @click='editTeam(index)'>修改团队
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix">
            <ul class="pagination pagination-sm no-margin pull-left">
              <li>共有 {{totalTeamItem}}  个团队，共{{totalTeamPageNum}}页</li>
            </ul>
            <ul class="pagination pagination-sm no-margin pull-right">
              <li><a href="#" @click='callTeamList(1)'>«</a></li>
              <li><a href="#" @click='callTeamList(teamCurrentPageNum-1)'><</a></li>
              <li><a href="#" @click='callTeamList(teamCurrentPageNum)'>{{teamCurrentPageNum}}</a></li>
              <li><a href="#" @click='callTeamList(teamCurrentPageNum+1)'>></a></li>
              <li><a href="#" @click='callTeamList(totalTeamPageNum)'>»</a></li>
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
  name: 'Team',
  data () {
    return {
      teamListResult: '',
      teamListResultError: '',
      isAddTeamShow: false,
      addTeamModalTitle: '',
      editTeamId: -1,
      teamName: '',
      addTeamError: '',
      teamCurrentPageNum: 1,
      totalTeamItem: 0,
      totalTeamPageNum: 1
    }
  },
  methods: {
    callTeamList: async function (toPageNum) {
      if (toPageNum === undefined || toPageNum <= 0) {
        toPageNum = 1
      }
      if (toPageNum > this.totalTeamPageNum) {
        toPageNum = this.totalTeamPageNum
      }
      this.teamCurrentPageNum = toPageNum
      const res = await api.get('/team/list?pageNum=' + toPageNum)
      if (res.status) {
        this.teamListResult = res.result.teams
        this.totalTeamItem = res.result.totalItem
        this.totalTeamPageNum = res.result.totalPage
      } else if (!res.status) {
        this.teamListResultError = res.msg
      }
    },
    callAddNewTeam: async function () {
      const {editTeamId, teamName} = this
      let id = editTeamId
      if (!teamName) {
        this.addTeamError = '请填写团队名称.'
        return
      }
      const res = await api.post('/team/addOrUpdate', {id, teamName})
      console.log(res)
      if (res.status) {
        this.isAddTeamShow = false
        this.callTeamList()
      } else {
        this.addTeamError = res.msg
      }
    },
    addNewTeam: function () {
      this.addTeamModalTitle = '新增团队'
      this.isAddTeamShow = true
      // this.callRoleList(-1, -1)
      this.editTeamId = -1
      this.teamName = ''
    },
    editTeam: function (index) {
      this.editTeamId = this.teamListResult[index].id
      this.addTeamModalTitle = '编辑团队'
      this.isAddTeamShow = true
      this.teamName = this.teamListResult[index].teamName
    },
    closeAddTeamModal: function () {
      this.isAddTeamShow = false
    }
  },
  mounted () {
    this.callTeamList()
  }
}
</script>
