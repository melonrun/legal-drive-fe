<template>
  <section class="content">
    <div class="box-header">
      <h3 class="box-title"><code></code></h3>
    </div>

    <div class="modal" id="modal-add-tag" :style="isShowContentModal ? 'display:block;' : ''">
      <div class="modal-dialog">
        <div class="modal-content box">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click='closeContentModal()'>X</span></button>
            <h4 class="modal-title">上传文件</h4>
          </div>
          <div class="modal-body box" style="overflow-y: scroll;">
            <p v-html="showingContent">One fine body…</p>
          </div>
          <div class="modal-footer">`
            <button type="button" class="btn btn-default pull-right" data-dismiss="modal" @click='closeContentModal()'>
              Close
            </button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
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
                    <option v-if="tagListSearch" v-for="tagItem in tagListSearch" v-bind:value="tagItem.id">
                      {{tagItem.tagName}}
                    </option>
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
                          @click="clickSearchButton">Search<i class="fa fa-search"></i></button>
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
                <th>Owner</th>
                <th>团队</th>
                <th>标签</th>
                <th>操作</th>
              </tr>

              <tr v-if="searchFileListResult" v-for="(fileListResultItem, index) in searchFileListResult">
                <td @click='showDocContent(index)' > <!-- @click='showDocContent(index)' -->
                  <i class="fa fa-file-pdf-o" style="color:#DF5959;"
                     v-if="getFileTypeByFileName(fileListResultItem.fileName) == '.pdf' "></i>
                  <i class="fa fa-file-word-o" style="color:#007bb6;"
                     v-else-if="getFileTypeByFileName(fileListResultItem.fileName) == '.doc' "></i>
                  <i class="fa fa-file"
                     v-else="fileListResultItem.fileType==1"></i>&nbsp;
                  <span v-html="fileListResultItem.fileName"></span>
                </td>

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
        createTimeInput: '',
        modifyTimeInput: '',
        searchFileListResult: [],
        isInputError: false,
        tagListSearch: [],
        showingContent: '',
        isShowContentModal: false
      }
    },
    methods: {
      getFileTypeByFileName: function (fileType) {
        fileType = fileType.toLowerCase()
        if (fileType.indexOf('.pdf') > 0) {
          return '.pdf'
        } else if (fileType.indexOf('.doc') > 0) {
          return '.doc'
        }
        return ''
      },
      closeContentModal: function () {
        this.isShowContentModal = false
      },
      showDocContent: function (index) {
        this.isShowContentModal = true
        let content = this.searchFileListResult[index].content
        this.showingContent = content
      },
      clickSearchButton: function () {
        this.callSearchFileList()
      },
      callSearchFileList: async function () {
        if (!this.searchKeyWordInput) {
          this.searchKeyWordInput = ''
        }
        let searchFieldParam = {start: 1, searchKeyWords: this.searchKeyWordInput}
        if (this.createTimeInput) {
          searchFieldParam['createTime'] = api.formatDate(this.createTimeInput)
        }
        if (this.modifyTimeInput) {
          searchFieldParam['modifyTime'] = api.formatDate(this.modifyTimeInput)
        }
        if (this.searchTagInput) {
          searchFieldParam['tag'] = this.searchTagInput
        }
        const res = await api.post('/file/search', searchFieldParam)
        this.searchFileListResult = res.result.files
      },
      downloadCurrentFile: function (index) {
        console.log(this.searchFileListResult[index].filePath)
        api.download('/file/download?filePath=' + this.searchFileListResult[index].filePath + '&fileName=' +
          this.searchFileListResult[index].fileName)
      },
      callSearchTagList: async function () {
        const res = await api.get('/tag/list?pageSize=100')
        if (res.status) {
          this.tagListSearch = res.result.tags
        }
      }
    },
    mounted () {
      this.callSearchTagList()
      this.callSearchFileList()
    }
  }

</script>

<style>
  .modal-dialog {
    position: absolute;
    width: 70%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .modal-content {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .modal-body {
    overflow-y: scroll;
    position: absolute;
    top: 55px;
    bottom: 65px;
    width: 100%;
  }

  .modal-header .close {margin-right: 15px;}

  .modal-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
  }
</style>
