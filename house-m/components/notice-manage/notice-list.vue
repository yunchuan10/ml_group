<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="通知公告" :item="['通知公告']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/notice-manage/notice-list-send/draft">
            <button class="f-pull-right u-bread-btn">
              草稿箱
            </button>
          </router-link>
          <router-link to="/notice-manage/notice-list-send/published">
            <button class="f-pull-right u-bread-btn">
              我发布的
            </button>
          </router-link>
          <router-link to="/notice-manage/notice-update/add">
            <button class="f-pull-right u-bread-btn">
              发布通知
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
          <el-table-column prop="fromOrganName" label="发送单位"></el-table-column>
          <el-table-column prop="dateCreated" label="接收时间">
            <template slot-scope="scope">
              {{getTime(scope.row.dateCreated)}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="setReadTime(scope.row.infoFromId)">查看</a>
              <a @click="deleteClick(scope.row.infoFromId)">删除</a>
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
    <Y-Confirm v-model="YConfirmShow" @click="YConfirmClick"></Y-Confirm>
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
      message: '',
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        year: ''
      },
      infoFromId: '',
      list: []
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    setReadTime(infoFromId) {
      let params = {
        infoFromId: infoFromId
      }
      this.$axiosPost(API.publish_updateIsRead, params).then(res => { })
      this.$router.push({ path: '/notice-manage/detail', query: { infoFromId: infoFromId } })
    },
    deleteClick(infoFromId) {
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
        noticeType: '',
        platForm: 'HOUSE_MANAGE',
        pageNam: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.publish_receivePublish, params).then(res => {
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
      this.$axiosPost(API.publish_delReceive, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('通用模块', '通知公告', '删除')
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