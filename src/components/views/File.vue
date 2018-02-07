<template>
  <section class="content">
    <div class="box-header">
      <h3 class="box-title">当前所在路径：<code>{{feCurrentUploadPath}}</code></h3>
    </div>
    <div class="row center-block">
      <div class="col-md-4 col-sm8 col-xs-10">
        <button type="button" class="btn btn-primary btn-tumblr" data-toggle="modal"
                data-target="#modal-add-tag" @click='addNewFileModal()'> 上传文件
        </button>
        <button type="button" class="btn btn-primary btn-tumblr" data-toggle="modal"
                data-target="#modal-add-tag" @click='backTeamHomeView()'> 返回
        </button>
      </div>
    </div>

    <div class="modal" id="modal-add-tag" :style="isAddFileShow ? 'display:block;' : ''">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click='closeAddFileModal()'>X</span></button>
            <h4 class="modal-title">上传文件</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="box-body">
                <div class="form-group">
                  <div class="col-sm-10">
                    <p class="margin" style="color: #dd4b39 !important;">
                      请确认，该文件上传路径： <code>{{feCurrentUploadPath}}</code>
                    </p>
                  </div>
                </div>
                <div class="form-group">
                  <label for="exampleInputFile" class="col-sm-2 control-label">选择文件</label>
                  <div class="col-sm-10">
                    <input type="file" id="exampleInputFile" @change='changeInputFile'>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputTagName" class="col-sm-2 control-label">标签</label>
                  <div class="col-sm-10">
                    <select class="form-control select2" style="width: 100%;" id="inputTagName" v-model="tagListSelect">
                      <option v-if="tagList" v-for="tagItem in tagList" v-bind:value="tagItem.id">
                        {{tagItem.tagName}}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputUserTeam" class="col-sm-2 control-label">团队</label>
                  <div class="col-sm-10">
                    <select class="form-control select2" data-placeholder="Select a Team"
                            style="width: 100%;" id="inputUserTeam" v-model="teamIdSelect">
                      <option v-if="teamList" v-for="teamItem in teamList" v-bind:value="teamItem.id">
                        {{teamItem.teamName}}
                      </option>
                    </select>
                  </div>
                </div>
                <div style="color: red;">{{saveFileMsg}}</div>
              </div>
              <!-- /.box-body -->
              <!-- /.box-footer -->
            </form>
          </div>
          <div class="modal-footer">`
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" @click='closeAddFileModal()'>
              Close
            </button>
            <button type="button" class="btn btn-primary btn-tumblr" data-dismiss="modal" @click='uploadFile'>
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
          <!-- /.box-header -->
          <div class="box-body no-padding table-responsive">
            <table class="table table-striped">
              <tbody>
              <tr>
                <th>名称</th>
                <th>上传时间</th>
                <th>修改时间</th>
                <th>所属人</th>
                <th>所属团队</th>
                <th>标签</th>
                <th>操作</th>
              </tr>

              <tr v-if="fileResultList" v-for="(fileListResultItem, index) in fileResultList">
                <td v-if="fileListResultItem.fileType==2" @click='changeCurrentPath(index)'>
                  <i class="fa fa-folder"></i> <a href="#">{{ fileListResultItem.filePath }}</a></td>
                <td v-else="fileListResultItem.fileType==1">
                  <i class="fa fa-file"></i>  <span>{{ fileListResultItem.fileName }}</span></td>
                <td>{{fileListResultItem.createTime}}</td>
                <td>{{fileListResultItem.modifyTime}}</td>
                <td>{{fileListResultItem.ownerId}}</td>
                <td>{{fileListResultItem.teamId}}</td>
                <td>{{fileListResultItem.tagList}}</td>

                <td v-if="fileListResultItem.fileType==1">
                  <button type="button" class="btn btn-primary btn-xs btn-github"
                          @click='downloadCurrentFile(index)'>下载文件
                  </button>
                  <button type="button" class="btn btn-primary btn-xs btn-github"
                          @click=''>发起任务
                  </button>
                </td>
                <td v-else="fileListResultItem.fileType==2"></td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix">
            <ul class="pagination pagination-sm no-margin pull-left">
              <li>共有 {{totalFileItem}}  个文件，共{{totalFilePageNum}}页</li>
            </ul>
            <ul class="pagination pagination-sm no-margin pull-right">
              <li><a href="#" @click='callTeamList(1)'>«</a></li>
              <li><a href="#" @click='callTeamList(fileCurrentPageNum-1)'><</a></li>
              <li><a href="#" @click='callTeamList(fileCurrentPageNum)'>{{fileCurrentPageNum}}</a></li>
              <li><a href="#" @click='callTeamList(fileCurrentPageNum+1)'>></a></li>
              <li><a href="#" @click='callTeamList(totalFilePageNum)'>»</a></li>
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
    name: 'File',
    data () {
      return {
        isContainsCollapse: 'sidebar-collapse',
        isAddFileShow: false,
        feCurrentUploadPath: '/root',
        feCurrentParentId: 1,
        inputFile: '',
        saveFileMsg: '',
        tagList: [],
        teamList: [],
        fileResultList: [],
        fileCurrentPageNum: 1,
        totalFileItem: 0,
        totalFilePageNum: 1,
        tagListSelect: '',
        teamIdSelect: 0
      }
    },
    methods: {
      changeInputFile: function (e) {
        this.inputFile = e.target.files[0]
      },
      uploadFile: async function () {
        let param = new FormData()
        if (!this.inputFile || !this.tagListSelect || !this.teamIdSelect) {
          this.saveFileMsg = '请选择文件属性.'
          return
        }
        param.append('file', this.inputFile)
        param.append('fePath', this.feCurrentUploadPath)
        param.append('modifyDate', api.formatDate(this.inputFile.lastModifiedDate))
        param.append('tagList', this.tagListSelect)
        param.append('teamId', this.teamIdSelect)
        param.append('parentId', this.feCurrentParentId)
        let res = await api.upload('/file/upload', param)
        if (res.status) {
          this.saveFileMsg = '上传成功'
          this.closeAddFileModal()
          this.callFileListByUser(1)
        } else {
          this.saveFileMsg = res.msg
        }
      },
      callTagListAndShow: async function () {
        const res = await api.get('/tag/list?pageSize=100')
        if (res.status) {
          this.tagList = res.result.tags
        }
        const teamRes = await api.get('/team/list')
        if (teamRes.status) {
          this.teamList = teamRes.result.teams
        }
      },
      addNewFileModal: function () {
        this.isAddFileShow = true
        this.callTagListAndShow()
      },
      closeAddFileModal: function () {
        this.isAddFileShow = false
      },
      callFileListByUser: async function (toPageNum) {
        if (toPageNum === undefined || toPageNum <= 0) {
          toPageNum = 1
        }
        if (toPageNum > this.totalFilePageNum) {
          toPageNum = this.totalFilePageNum
        }
        this.fileCurrentPageNum = toPageNum
        const res = await api.get('/file/list?pageNum=' + toPageNum + '&parentId=' + this.feCurrentParentId)
        if (res.status) {
          this.fileResultList = res.result.files
          this.feCurrentUploadPath = res.result.currentPath
          this.totalFilePageNum = res.result.totalPage
          this.totalFileItem = res.result.totalItem
        }
      },
      backTeamHomeView: function () {
        this.feCurrentParentId = 1
        this.callFileListByUser(1)
      },
      changeCurrentPath: function (pIndex) {
        this.feCurrentUploadPath = this.fileResultList[pIndex].filePath
        this.feCurrentParentId = this.fileResultList[pIndex].id
        this.callFileListByUser(1)
      },
      downloadCurrentFile: function (index) {
        console.log(this.fileResultList[index].filePath)
        api.download('/file/download?fileId=' + this.fileResultList[index].id)
      }
    },
    mounted () {
      this.callFileListByUser()
    }
  }
</script>
