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
        <!-- <p class="u-detail-p">申请单号：{{applydetailList.orderNo}}</p>
        <p class="u-detail-p">申请提交时间：{{dateCreated}}</p> -->
        <!-- <div class="el-steps-item">
          <el-steps :active="checkHightlight(orderStatus,disposalOfPerform)" align-center>
            <el-step title="提交申请" description=""></el-step>
            <el-step title="审批" description=""></el-step>
            <el-step title="处置执行" description=""></el-step>
          </el-steps>
        </div> -->
        <!--  tab切换 -->

        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
            <a>历史使用信息</a>
          </li>
          <!-- <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li> -->
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">

          <table class="h-table-info">
            <tr>
              <th class="f-text-right">姓名</th>
              <td>{{userData.realName}}</td>
              <th class="f-text-right">单位名称</th>
              <td>{{userData.orgName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">所属部门</th>
              <td>{{userData.deptName}}</td>
              <th class="f-text-right">性别</th>
              <td>{{userData.sex=='FEMALE'?'男':'女'}}</td>
            </tr>
            <tr>
              <th class="f-text-right">手机号</th>
              <td>{{userData.phoneNo}}</td>
              <th class="f-text-right">职务级别</th>
              <td>{{userData.dutiesLevelName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">编制情况</th>
              <td colspan="3">{{this.establish}}</td>
            </tr>
          </table>
          <!-- <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle">
                  <span></span>人员信息变更记录</h2>
              </td>
            </tr>
          </table>
          <el-table :data="list" stripe style="width: 100%; ">
            <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column prop="roomNo" label="变更时间">
              <template slot-scope="scope">{{scope.row.roomNo}}</template>
            </el-table-column>
            <el-table-column prop="roomAddress" label="变更前">
              <template slot-scope="scope">
                {{scope.row.roomAddress}}
              </template>
            </el-table-column>
            <el-table-column prop="buildArea" label="变更后">
              <template slot-scope="scope">
                {{scope.row.buildArea}}
              </template>
            </el-table-column>

          </el-table> -->
        </div>
        <div class="h-tab-content" v-show="pageSelect=='houseinfo'">
          <el-table :data="list" stripe style="width: 100%; ">
            <!-- <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column> -->

            <el-table-column prop="roomNo" label="房间号">
            </el-table-column>
            <el-table-column prop="roomName" label="房间名称">
            </el-table-column>
            <el-table-column prop="buildArea" label="建筑面积">
            </el-table-column>
            <el-table-column prop="useArea" label="使用面积">
            </el-table-column>
            <el-table-column prop="roomAddress" label="房间位置">
            </el-table-column>
            <el-table-column prop="useUserRealName" label="使用人名称">
            </el-table-column>
            <el-table-column prop="useStartDate" label="使用开始时间">
            </el-table-column>
            <el-table-column prop="useEndDate" label="使用结束时间">
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
      userData: {}, // 人员详情数据
      establish: '',
      active: 1,
      carDetailShow: false, // 弹出框开关

      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      listfile: [], //数据集合
      list: [], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      pageSelect: "",


    };
  },
  activated() { },
  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId
    },
  },
  methods: {

    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.getDataRequest(id)
    },



    getDataRequest(id) {
      let params = {
        staffId: id,
        organId: this.organId
      };
      this.$axiosGet(API.search_queryUserDetail, params).then(res => {
        let list = [];
        this.userData = res.data.staffUserResponse
        this.list = res.data.userUseHisResponseList
        if (this.userData.establishStatus == 'ADMINISTRATIVE') {
          this.establish = '行政编制'
        } else if (this.userData.establishStatus == 'ENTERPRISE') {
          this.establish = '事业编制'
        } else if (this.userData.establishStatus == 'WORK') {
          this.establish = '工勤编制'
        } else if (this.userData.establishStatus == 'CONTRACT') {
          this.establish = '合同制'
        } else if (this.userData.establishStatus == 'EMPLOY') {
          this.establish = '聘用制'
        } else if (this.userData.establishStatus == 'TEMPORARY') {
          this.establish = '临时制'
        }
      });
    },
  }
};
</script>

<style lang="scss">
</style>

