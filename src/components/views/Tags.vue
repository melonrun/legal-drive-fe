<template>
  <section class="content">
    <div class="row center-block">
      <div class="col-md-4 col-sm8 col-xs-10">
        <button type="button" class="btn btn-primary btn-tumblr" data-toggle="modal"
                data-target="#modal-add-tag" @click='addNewTag()'> 创建标签
        </button>
      </div>
    </div>

    <div class="modal" id="modal-add-tag" :style="isAddTagShow ? 'display:block;' : ''">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click='closeAddTagModal()'>X</span></button>
            <h4 class="modal-title">{{addTagModalTitle}}</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="box-body">
                <div class="form-group">
                  <label for="inputTagName" class="col-sm-2 control-label">团队名称</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputTagName" placeholder="tag name"
                           v-model="tagName">
                  </div>
                </div>
                <div style="color: red;">{{addTagError}}</div>
              </div>
              <!-- /.box-body -->
              <!-- /.box-footer -->
            </form>
          </div>
          <div class="modal-footer">`
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" @click='closeAddTagModal()'>
              Close
            </button>
            <button type="button" class="btn btn-primary btn-tumblr" data-dismiss="modal" @click='callAddNewTag(-1)'>
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
            <h3 class="box-title">Full Tag Info Table</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-padding table-responsive">
            <table class="table table-striped">
              <tbody>
              <tr>
                <th style="width: 70%;">标签名称</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>

              <tr v-if="tagListResult" v-for="(tagListResultItem, index) in tagListResult">
                <td>{{tagListResultItem.tagName }}</td>
                <td>{{tagListResultItem.createTime}}</td>
                <td>
                  <button type="button" class="btn btn-primary btn-xs btn-github"
                          @click='editTag(index)'>修改标签
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix">
            <ul class="pagination pagination-sm no-margin pull-left">
              <li>共有 {{totalTagItem}}  个标签，共{{totalTagPageNum}}页</li>
            </ul>
            <ul class="pagination pagination-sm no-margin pull-right">
              <li><a href="#" @click='callTagList(1)'>«</a></li>
              <li><a href="#" @click='callTagList(tagCurrentPageNum-1)'><</a></li>
              <li><a href="#" @click='callTagList(tagCurrentPageNum)'>{{tagCurrentPageNum}}</a></li>
              <li><a href="#" @click='callTagList(tagCurrentPageNum+1)'>></a></li>
              <li><a href="#" @click='callTagList(totalTagPageNum)'>»</a></li>
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
    name: 'Tag',
    data () {
      return {
        tagListResult: '',
        tagListResultError: '',
        isAddTagShow: false,
        addTagModalTitle: '',
        editTagId: -1,
        tagName: '',
        addTagError: '',
        tagCurrentPageNum: 1,
        totalTagItem: 0,
        totalTagPageNum: 1
      }
    },
    methods: {
      callTagList: async function (toPageNum) {
        if (toPageNum === undefined || toPageNum <= 0) {
          toPageNum = 1
        }
        console.log(toPageNum)
        if (toPageNum > this.totalTagPageNum) {
          toPageNum = this.totalTagPageNum
        }
        this.tagCurrentPageNum = toPageNum
        const res = await api.get('/tag/list?pageNum=' + toPageNum)
        if (res.status) {
          this.tagListResult = res.result.tags
          this.totalTagItem = res.result.totalItem
          this.totalTagPageNum = res.result.totalPage
        } else if (!res.status) {
          this.tagListResultError = res.msg
        }
      },
      callAddNewTag: async function () {
        const {editTagId, tagName} = this
        let id = editTagId
        if (!tagName) {
          this.addTagError = '请填标签名称.'
          return
        }
        const res = await api.post('/tag/addOrUpdate', {id, tagName})
        console.log(res)
        if (res.status) {
          this.isAddTagShow = false
          this.callTagList()
        } else {
          this.addTagError = res.msg
        }
      },
      addNewTag: function () {
        this.addTagModalTitle = '新增标签'
        this.isAddTagShow = true
        // this.callRoleList(-1, -1)
        this.editTagId = -1
        this.tagName = ''
      },
      editTag: function (index) {
        this.editTagId = this.tagListResult[index].id
        this.addTagModalTitle = '编辑标签'
        this.isAddTagShow = true
        this.tagName = this.tagListResult[index].tagName
      },
      closeAddTagModal: function () {
        this.isAddTagShow = false
      }
    },
    mounted () {
      this.callTagList()
    }
  }
</script>
