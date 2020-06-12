<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <!--  tab切换 -->
        <ul class="house-nav-tab" style="margin-top:0px;">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>具体信息</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">项目名称</th>
              <td>{{data.projectName}}</td>
              <th class="f-text-right">里程碑名称</th>
              <td>{{data.milepostName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">开始日期</th>
              <td>{{checkTime(data.startDate)}}</td>
              <th class="f-text-right">结束日期</th>
              <td>{{checkTime(data.endDate)}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{data.remarks}}</td>
            </tr>

          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect == 'file'">
          <el-table :data="data.attachments" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名">
              <template slot-scope="scope">{{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_block">预览</a>
                <!-- <a :href="scope.row.url" target="_block" download>下载</a> -->
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      pageSelect: '',
      carDetailShow: false, // 弹出框开关
      data: {}
    };
  },
  activated() { },
  methods: {
    checkTime(value) {
      if (value) {
        return value.substr(0,10);
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.getDataRequest(id)
    },
    getDataRequest(id) {
      let params = {
        id: id
      };
      this.$axiosGet(API.buildingProject_getMilePostDetails, params).then(res => {
        this.data = { ...res.data }
      });
    }
  }
};
</script>

<style lang="scss">
.h-tab-content .h-table-info tr th {
  width: 147px;
}
</style>

