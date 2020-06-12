<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <span class="re-info fl">资源信息</span>
          <span class="re-space fl"></span>
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>资源信息</el-breadcrumb-item>
        </el-breadcrumb> -->
        <Y-Breadcrumb title="行程预览" :item="['行程预览']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn">
            <router-link to="/trip-manage/trip-update/add">新增行程</router-link>
          </div>
        </div>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li>
                  <span>名称</span>
                  <el-input clearable v-model="search.name" placeholder="请输入名称"></el-input>
                </li>
              </ul>
            </td>

            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getDataRequest">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <el-tabs>
        <table-info :reception="tabData" :eventList="eventList" @onEvent="onEvent"></table-info>
      </el-tabs>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[12, 24, 36]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 详情弹出框 -->
    <resource-detail ref="resourceDetail"></resource-detail>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import tableInfo from "@/components/resource-manage/resource-info/table-info" // 图片表格信息

export default {
  components: {
    'resource-detail': resourceDetail,
    "table-info": tableInfo
  },
  data() {
    return {
      YPromptShow: false,
      isBol: false,
      message: '',
      search: {
        name: ''
      },
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      tabData: [],
      deleteId: '',
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
      ]
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    getDataRequest() {
      this.tabData = [];
      let params = {
        name: this.search.name,
        max: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
      };
      this.$axiosGet(API.receptionFacade_findTripPreviewWithPage, params).then(res => {
        if (res.model.list) {
          res.model.list.forEach((item, index) => {
            // let fileListData = eval(item.receptionLetterBO.attachmentURL);
            this.tabData.push({
              name: item.receptionLetterBO.receptionLetterName,
              attachImg: item.img,
              id: item.receptionLetterBO.receptionLetterId
              // id: item.tripId,
              // officialLetterId: item.officialLetterId
            })
          })
        }
        this.total = res.model.totleCount;
      })
    },
    onEvent(data) {
      if (data.eventName === 'detail') { // 详情
        if (data.title === '预览') {
          this.$router.push({ path: '/trip-manage/trip-update/detail', query: { id: data.id } });
        } else {
          this.$refs.resourceDetail.openModal(data.id);
        }
      } else if (data.eventName === 'delete') { // 删除
        this.deleteId = data.id;
        this.YConfirmShow = true;
      } else if (data.eventName === 'edit') { // 修改
        this.$router.push({ path: '/trip-manage/trip-update/edit', query: { id: data.id } });
      }
    },
    YDeleteClick() {
      let params = {
        receptionLetterId: this.deleteId
      };
      this.$axiosPost(API.receptionFacade_deleteByReceptionLetterId, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
}
</script>

<style lang="scss" scoped>
.main-default .g-content .g-main .m-main .m-search {
  padding: 10px 0 !important;
  border-bottom: 1px #dcdcdc solid;
}
</style>
