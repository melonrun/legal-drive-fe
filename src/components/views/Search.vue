<template>
  <section class="content">
    <div class="box-header">
      <h3 class="box-title"><code></code></h3>
    </div>
    <div class="row center-block">
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <div class="row">
              <div class="col-sm-4 col-md-3">
                <div class="color-palette-set" v-bind:class="{ 'has-error': isInputError }">
                  <div class="disabled color-palette"><span>文本关键字:</span></div>
                  <input type="text" class="form-control" v-model="searchKeyWordInput">
                </div>
              </div>
              <div class="col-sm-4 col-md-2">
                <div class="color-palette-set">
                  <div class="disabled color-palette"><span>标签:</span></div>
                  <select class="form-control" v-model="searchTagInput">
                    <option value="">全部</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-4 col-md-2">
                <div class="color-palette-set">
                  <div class="disabled color-palette"><span>上传时间:</span></div>
                  <datepicker v-model="createTimeInput" format="yyyy-MM-dd" input-class="form-control"></datepicker>
                </div>
              </div>
              <div class="col-sm-4 col-md-2">
                <div class="color-palette-set">
                  <div class="disabled color-palette"><span>修改时间:</span></div>
                  <datepicker v-model="modifyTimeInput" format="yyyy-MM-dd" input-class="form-control"></datepicker>
                </div>
              </div>
              <div class="col-sm-4 col-md-1" style="margin-left: 2%;">
                <div class="color-palette-set">
                  <div class="disabled color-palette"><span>&nbsp;</span></div>
                  <button type="button" class="pull-right btn btn-tumblr" id="sendEmail"
                          @click="clickSearchButtion">Search<i class="fa fa-search"></i></button>
                </div>
              </div>
            </div>
          </div>
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

              <tr v-if="searchFileListResult" v-for="(fileListResultItem, index) in searchFileListResult">
                <td v-if="fileListResultItem.fileType==2" @click='changeCurrentPath(index)'>
                  <i class="fa fa-folder"></i> <a href="#">{{ fileListResultItem.filePath }}</a></td>
                <td v-else="fileListResultItem.fileType==1">
                  <i class="fa fa-file"></i>  <span>{{ fileListResultItem.fileName }}</span></td>
                <td>{{fileListResultItem.createTime}}</td>
                <td>{{fileListResultItem.modifyTime}}</td>
                <td>{{fileListResultItem.ownerId}}</td>
                <td>{{fileListResultItem.teamId}}</td>
                <td>{{fileListResultItem.tagList}}</td>

                <td>
                  <button type="button" class="btn btn-primary btn-xs btn-github"
                          @click='downloadCurrentFile(index)'>下载文件
                  </button>
                </td>
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
  import Datepicker from 'vuejs-datepicker'

  export default {
    name: 'Search',
    components: {
      Datepicker
    },
    data () {
      return {
        searchKeyWordInput: '',
        searchTagInput: '',
        createTimeInput: new Date(),
        modifyTimeInput: new Date(),
        searchFileListResult: [],
        isInputError: false
      }
    },
    methods: {
      clickSearchButtion: function () {
        if (!this.searchKeyWordInput) {
          this.isInputError = true
          return
        }
        this.callSearchFileList()
      },
      callSearchFileList: async function () {
        const res = await api.get('/file/search?start=1&searchKeyWords=' + this.searchKeyWordInput)
        this.searchFileListResult = res.result.files
      },
      downloadCurrentFile: function (index) {
        console.log(this.searchFileListResult[index].filePath)
        api.download('/file/download?filePath=' + this.searchFileListResult[index].filePath)
      }
    },
    mounted () {
      // this.callSearchFileList()
    }
  }

</script>
