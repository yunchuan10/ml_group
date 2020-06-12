<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会议室信息" :item="['会议室信息']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{ name: 'meet-room', params: {type: 'add'} }">
            <button class="f-pull-right u-bread-btn">新增会议室</button>
          </router-link>
        </div>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="名称">
            <el-input clearable v-model="search.name" placeholder="请输入会议室名称"></el-input>
          </el-form-item>
          <el-form-item label="容纳人数">
            <el-input-number style="width:180px" v-model="search.min" controls-position="right" :min="1" :max="search.max?search.max:10000000"></el-input-number>
            <span style="padding: 0 5px;color: #D0D2D9">-</span>
            <el-input-number style="width:180px" v-model="search.max" controls-position="right" :min="search.min?search.min:1"></el-input-number>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <!-- 酒店或会议tab -->
      <el-tabs>
        <table-info :reception="tabData" :eventList="eventList" @onEvent="onEvent"></table-info>
      </el-tabs>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 操作成功提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
    <!--删除提示框-->
    <zl-confirm v-model="YConfirmShow" @click="YDeleteClick"></zl-confirm>
    <!-- 详情弹出框 -->
<!--    <resource-detail ref="resourceDetail"></resource-detail>-->
    <!--会议室详情-->
    <meet-room-detail ref="meetRoomDetail"></meet-room-detail>
  </div>
</template>

<script>
import resourceDetail from "@/components/meet-room-manage/meet-room-list/meet-room-detail" // 详情信息页
import tableInfo from "@/components/resource-manage/resource-info/table-info" // 图片表格信息
import meetRoomDetail from "@/components/resource-manage/resource-info/meet-room-detail" // 会议室详情信息页

export default {
  components: {
    // 'resource-detail': resourceDetail,
    "table-info": tableInfo,
    'meet-room-detail': meetRoomDetail,
  },
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      message: '',
      isBol: false,
      search: {
        name: '', // 名称
        min: 1, // 人数下限
        max: 10000 // 人数上限
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      tabData: [],
      eventList: [ // 图片列表的操作事件
        {
          name: 'detail',
          title: '预览'
        },
        {
          name: 'edit',
          title: '修改'
        },
        {
          name: 'delete',
          title: '删除'
        }
      ],
      meetingId: ''
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    getDataRequest() {
      // let params = {
      //   meetingName: this.search.name,
      //   maxPeopleStart: this.search.min,
      //   maxPeopleEnd: this.search.max,
      //   max: this.pageSize,
      //   offset: (this.page - 1) * this.pageSize
      // }
      let params = {
        meetingName: this.search.name,
        maxPeopleStart: this.search.min,
        maxPeopleEnd: this.search.max,
        pageSize: this.pageSize,
        pageStart: this.page,
      }
      this.$axiosJsonPost(API.roomInfo_roomInfoPageList, params).then(res => {
        if (res.status === 200 ) {
          this.tabData = res.data.list;
          this.total = res.data.total;
        }
      })
    },
    onEvent(data) {
      if (data.eventName === 'detail') {
        // console.log('meet room data',data)
        // this.$refs.resourceDetail.openModal(data.id);
        this.$refs.meetRoomDetail.title = '会议室详情';
        this.$refs.meetRoomDetail.openModal(data.id);
      } else if (data.eventName === 'edit') {
        this.$router.push({ name: 'meet-room', params: { type: 'edit' }, query: { id: data.id } })
      } else if (data.eventName === 'delete') {
        this.YConfirmShow = true;
        this.meetingId = data.id;
      }
    },
    // 删除
    YDeleteClick() {
      let params = {}
      this.$axiosDelete(API.roomInfo_deleteRoomInfo + this.meetingId, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    }
  }
}
</script>

<style>
.main-default .g-content .g-main .m-main .m-search li.person-num .el-input {
  width: 180px;
}
.main-default
  .g-content
  .g-main
  .m-main
  .m-search
  li.person-num
  .el-input-number
  span {
  margin-right: 0;
}
</style>
