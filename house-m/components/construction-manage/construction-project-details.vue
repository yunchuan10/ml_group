<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="margin-top:-10px;">
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
              <td>{{data.buildingOrganName}}</td>
              <th class="f-text-right">项目名称</th>
              <td>{{data.projectName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">工程类型</th>
              <td>{{data.projectType}}</td>
              <th class="f-text-right">建筑结构</th>
              <td>{{data.houseStructureName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">总建筑面积<br /></th>
              <td>{{data.buildAreaOfTotal ? data.buildAreaOfTotal+'㎡': ''}}</td>
              <th class="f-text-right">人防面积<br /></th>
              <td>{{data.areaOfAirDefence ? data.areaOfAirDefence+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地上层数</th>
              <td>{{data.upFloorNumber ? data.upFloorNumber +'层':''}}</td>
              <th class="f-text-right">地下层数</th>
              <td>{{data.downFloorNumber ? data.downFloorNumber +'层':''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地上建筑面积<br /></th>
              <td>{{data.upArea ? data.upArea+'㎡': ''}}</td>
              <th class="f-text-right">地下建筑面积<br /></th>
              <td>{{data.downArea ? data.downArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">开工日期</th>
              <td>{{checkTime(data.startDate)}}</td>
              <th class="f-text-right">工程预算</th>
              <td>{{data.projectBudget ? data.projectBudget+'万元':''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">施工单位名称</th>
              <td>{{data.constructionOrganName}}</td>
              <th class="f-text-right">完工日期</th>
              <td>{{checkTime(data.endDate)}}</td>
            </tr>
            <tr>
              <th class="f-text-right">决算日期</th>
              <td>{{checkTime(data.settlementDate)}}</td>
              <th class="f-text-right">决算金额</th>
              <td>{{data.settlementMoney ? data.settlementMoney +'万元':''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">施工许可证号</th>
              <td>{{data.constructionPermitNo}}</td>
              <th class="f-text-right">规划许可证号</th>
              <td>{{data.planningLicenseNo}}</td>
            </tr>
            <tr>
              <th class="f-text-right">监理单位</th>
              <td>{{data.constructionControlOrganName}}</td>
              <th class="f-text-right">设计单位</th>
              <td>{{data.designOrganName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">工程质量监督机构名称</th>
              <td colspan="3">{{data.superviseOrganName}}</td>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{data.remarks}}</td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect == 'file'">
          <el-table :data="data.fileResponseList" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_blank">预览</a>
                <!-- <a :href="scope.row.location" target="_blank" download>下载</a> -->
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
      pageSelect: 'basic',
      carDetailShow: false, // 弹出框开关
      data: {}
    };
  },
  activated() { },
  methods: {
    checkTime(value) {
      if (value) {
        return value.substr(0,10)
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.getDataRequest(id)
    },
    getDataRequest(id) {
      let params = {
        id: id
      };
      this.$axiosGet(API.buildingProject_getBuildingProjectDetails, params).then(res => {
        if (res.data) {
          this.data = { ...res.data }
        }
      });
    }
  }
};
</script>

