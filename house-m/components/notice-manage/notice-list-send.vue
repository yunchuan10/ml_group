<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb v-if="$route.path !='/notice-manage/notice-list-send/draft' &&$route.path !='/notice-manage/notice-update/add'" title="我发布的" :item="['我发布的']" type="1"></Y-Breadcrumb>
        <Y-Breadcrumb v-if="$route.path ==='/notice-manage/notice-list-send/draft'" title="草稿箱" :item="['草稿箱']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/notice-manage/notice-update/add">
            <button class="f-pull-right u-bread-btn">
              发布通知
            </button>
          </router-link>
          <router-link v-show="$route.path !='/notice-manage/notice-list-send/draft'" to="/notice-manage/notice-list-send/draft">
            <button class="f-pull-right u-bread-btn">
              草稿箱
            </button>
          </router-link>
          <router-link v-show="$route.path !='/notice-manage/notice-list-send/published'" to="/notice-manage/notice-list-send/published">
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list">
          <el-table-column label="序号" width="60px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="contentString" label="内容">
            <template slot-scope="scope">
              <div v-html="scope.row.contentString"></div>
            </template>
          </el-table-column>
          <el-table-column prop="publishPeople" v-if="noticeStatus == 'PUBLISHED'" key="publishPeople" label="发送人数"></el-table-column>
          <el-table-column prop="readTimes" v-if="noticeStatus == 'PUBLISHED'" key="readTimes" label="查看人数"></el-table-column>
          <el-table-column prop="dateCreated" v-if="noticeStatus == 'DRAFT'" key="dateCreated" label="生成时间">
            <template slot-scope="scope">
              {{getTime(scope.row.dateCreated||'')}}
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" v-if="noticeStatus == 'PUBLISHED'" key="publishTime" label="发布时间">
            <template slot-scope="scope">
              {{getTime(scope.row.publishTime||'')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="{path: '/notice-manage/detail', query: {infoFromId: scope.row.infoFromId}}">查看</router-link>
              <router-link v-show="noticeStatus == 'DRAFT'" :to="{path: '/notice-manage/notice-update/edit', query: {infoFromId: scope.row.infoFromId}}">修改</router-link>
              <a v-if="noticeStatus == 'DRAFT'" @click="deleteClick(scope.row.infoFromId, 'DELETE')">删除</a>
              <a v-show="noticeStatus == 'DRAFT'" @click="deleteClick(scope.row.infoFromId, 'PUSH')">发布</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>

    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :title="YConfirmTitle" :message="message" @click="YConfirmClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      isBol: false,
      YConfirmTitle: '',
      message: '',
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        year: ''
      },
      infoFromId: '',
      list: [],
      comfirmType: '' // 发布还是删除
    }
  },
  activated() {
    this.getDataRequest();
  },
  watch: {
    '$route.path': function (newValue, oldValue) {
      if (newValue === '/notice-manage/notice-list-send/published' || newValue === '/notice-manage/notice-list-send/draft') {
        this.getDataRequest();
      }
    }
  },
  computed: {
    noticeStatus() {
      return this.$route.params.type === 'published' ? 'PUBLISHED' : 'DRAFT'

    }

  },
  methods: {
    deleteClick(infoFromId, comfirmType) {
      if (comfirmType == 'DELETE') {
        this.message = '您确认要删除吗？'
        this.YConfirmTitle = '删除'
      } else {
        this.message = '您确认要发布通知吗？'
        this.YConfirmTitle = '发布'
      }
      this.comfirmType = comfirmType;
      this.infoFromId = infoFromId;
      this.YConfirmShow = true;
    },
    getTime(value) {
      return value.substr(0, 10);
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    getDataRequest() {
      let params = {
        noticeStatus: this.noticeStatus,
        platForm: 'HOUSE_MANAGE',
        pageNam: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.publish_myPublish, params).then(res => {
        if (res.result === 'success') {
          let list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getDataRequest();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getDataRequest()
    },
    YConfirmClick() {
      let params = {
        infoFromId: this.infoFromId
      }
      let url = '';
      if (this.comfirmType == 'DELETE') {
        url = API.publish_delPublish;
      } else {
        url = API.publish_publishDraft;
      }
      this.$axiosGet(url, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          if (this.comfirmType == 'PUSH') {
            BURYINGPOINT.buryingPoint('通用模块', '通知公告', '发布公告')
          }
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    }
  }
}
</script>