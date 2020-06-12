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
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>建设项目</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">建设单位</th>
              <td>{{rentalDetailList.applyOrganName}}</td>
              <th class="f-text-right">项目名称</th>
              <td>{{rentalDetailList.applyResponsible}}</td>
            </tr>
            <tr>
              <th class="f-text-right">工程类型</th>
              <td>{{rentalDetailList.agentName}}</td>
              <th class="f-text-right">房屋结构</th>
              <td>{{rentalDetailList.agentPhone}}</td>
            </tr>
            <tr>
              <th class="f-text-right">总建筑面积</th>
              <td>{{rentalDetailList.agentName ? rentalDetailList.agentName+'㎡': ''}}</td>
              <th class="f-text-right">人防面积</th>
              <td>{{rentalDetailList.rentPayWayName ? rentalDetailList.rentPayWayName+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地上层数</th>
              <td>{{rentalDetailList.rentWayName}}层</td>
              <th class="f-text-right">地下层数</th>
              <td>{{rentalDetailList.proposedRentPurpose}}层</td>
            </tr>

            <tr>
              <th class="f-text-right">地上建筑面积</th>
              <td>{{rentalDetailList.proposedRentYear ? rentalDetailList.proposedRentYear+'㎡': ''}}</td>
              <th class="f-text-right">地下建筑面积</th>
              <td>{{rentalDetailList.remark ? rentalDetailList.remark+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">开工日期</th>
              <td>{{rentalDetailList.proposedRentYear}}</td>
              <th class="f-text-right">工程预算</th>
              <td>{{rentalDetailList.remark}}万元</td>
            </tr>
            <tr>
              <th class="f-text-right">施工单位名称</th>
              <td>{{rentalDetailList.proposedRentYear}}</td>
              <th class="f-text-right">完工日期</th>
              <td>{{rentalDetailList.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">决算日期</th>
              <td>{{rentalDetailList.proposedRentYear}}</td>
              <th class="f-text-right">决算金额</th>
              <td>{{rentalDetailList.remark}}万元</td>
            </tr>
            <tr>
              <th class="f-text-right">施工许可证号</th>
              <td>{{rentalDetailList.proposedRentYear}}</td>
              <th class="f-text-right">规划许可证号</th>
              <td>{{rentalDetailList.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">监理单位</th>
              <td>{{rentalDetailList.proposedRentYear}}</td>
              <th class="f-text-right">设计单位</th>
              <td>{{rentalDetailList.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">工程质量监督机构名称</th>
              <td colspan="3">{{rentalDetailList.proposedRentYear}}</td>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{rentalDetailList.remark}}</td>
            </tr>

          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect == 'file'">
          <el-table :data="fileList" stripe style="width: 100%">
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
      carDetailShow: false, // 弹出框开关
      dealRentApplyId: '', //详情id
      remark: '', // 备注
      name: '', // 文件名
      url: '', //文件路径
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      pageSelect: '',
      rentalDetailList: {}, //详情集合
      fileList: [], //文件附件

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.dealRentApplyId = id;
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.getDataRequest()
    },


    getDataRequest(id) {
      // let params = {

      // };
      // this.$axiosPost(API, params).then(res => {

      // });
    },
  }
};
</script>

<style lang="scss">
.h-tab-content .h-table-info tr th {
  width: 147px;
}
</style>

