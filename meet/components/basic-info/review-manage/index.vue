<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="审核配置" :item="['基础信息', '审核配置']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{name: 'review', params: {type: 'add'}}">
            <button class="f-pull-right u-bread-btn">新增</button>
          </router-link>
        </div>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="审核单位">
            <el-select v-model="search.checkedOrganName" placeholder="请选择审核单位" clearable>
              <el-option
                v-for="item in selectList"
                :key="item.id"
                :label="item.customerName"
                :value="item.customerName"
              ></el-option>
            </el-select>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%" @row-click="select">
          <el-table-column label="审核人" prop="userName"></el-table-column>
          <el-table-column label="审核单位" prop="checkedOrganName"></el-table-column>
          <el-table-column label="操作" prop="staffId">
            <template slot-scope="scope">
              <router-link
                :to="{name: 'review', params: { type: 'edit' }, query: {staffId: scope.row.staffId, phoneNo: scope.row.phoneNo, userName: scope.row.userName,deptId:scope.row.checkedOrganId}}"
              >修改</router-link>
              <a @click="deleteClick(scope.row.staffId)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <!-- 操作成功提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
    <!--删除提示框-->
    <zl-confirm v-model="YConfirmShow" @click="YDeleteClick"></zl-confirm>
  </div>
</template>

<script>
export default {
  name: "review-manage",
  data() {
    return {
      search: {
        checkedOrganName: "" // 审核单位
      },
      YConfirmShow: false,
      YPromptShow: false,
      message: "",
      isBol: false,
      list: [], //审核单位所有信息列表
      selectList: [], //选择审核单位列表
      // checkOrganList:[],//审核单位名称列表
      equipId: "",
      delUserId: "" //删除选中的ID
    };
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    // 获取角色列表数据
    getDataRequest() {
      let params = {
        checkedOrganName: this.search.checkedOrganName
      };
      this.$axiosGet(API.verifyConfig_verifyConfigList, params).then(res => {
        // this.list = res.model.list || [];
        if (res.status === 200) {
          this.list = res.data.manageVerifyConfigList || [];
          this.selectList = res.data.customerOrganList;
          this.total = res.data.totleCount || 0;
        }
      });
    },
    select(row) {
      this.delUserId = row.staffId;
    },
    // 删除
    deleteClick(id) {
      this.equipId = id;
      this.YConfirmShow = true;
    },
    // 删除确认
    YDeleteClick() {
      let params = {
        staffId: this.equipId
      };

      this.$axiosDelete(
        API.verifyConfig_deleteVerifyConfig + "/" + params.staffId
      ).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        // 判断删除的数据是不是当前页最后一条
        let totalNo = ((this.total - 1) / this.pageSize)
          .toString()
          .indexOf(".");
        if (totalNo === -1) {
          this.page = this.page - 1;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      });
    },
    //
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    }
  },
  deactivated() {
    this.search.checkedOrganName = "";
  }
};
</script>

<style>
</style>
