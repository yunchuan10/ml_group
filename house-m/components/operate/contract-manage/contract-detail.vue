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
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>合同正文</a>
          </li>
          <li @click="pageSelect = 'remind'" :class="{'active':pageSelect=='remind'}">
            <a>合同到期提醒</a>
          </li>
          <li @click="pageSelect = 'rental'" :class="{'active':pageSelect=='rental'}">
            <a>租金入账情况</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">合同编号</th>
              <td>{{contractDetail.contractNo || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同开始日期</th>
              <td>{{contractStartDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同结束日期</th>
              <td>{{contractEndDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同标的物</th>
              <td>{{constractSubject}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同租金</th>
              <td>{{contractDetail.contractRental || ''}}
                <span v-show="contractDetail.contractRental != ''">元/年</span>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">出租方</th>
              <td>{{contractDetail.rentPerson || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">承租人</th>
              <td>{{contractDetail.lesseeName || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同状态</th>
              <td>{{contractDetail.contractStatusName}}</td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='property'">
          <div class="h-tab-content">
          </div>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='remind'">
          <div class="h-table">
            <el-table :data="list" stripe ref="multipleTable" style="width: 100%">
              <el-table-column fixed="left" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column label="提醒日期" key='3'>
              </el-table-column>
              <el-table-column label="提醒标题">
              </el-table-column>
              <el-table-column label="提醒正文">
              </el-table-column>
              <el-table-column label="提醒人">
              </el-table-column>
              <el-table-column label="提醒方式">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='rental'">
          <div class="h-table f-relative">
            <el-table :data="list" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" label="序号" width="50">
              </el-table-column>
              <el-table-column label="租金起始日期">
              </el-table-column>
              <el-table-column label="租金日期">
              </el-table-column>
              <el-table-column label="租金时长">
              </el-table-column>
              <el-table-column label="租金金额（元）">
              </el-table-column>
              <el-table-column label="租金入账情况">
              </el-table-column>
              <el-table-column label="未入账原因">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">身份证</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">营业执照</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">相关附件</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      contractDetail: {}, //合同详情
      contractStartDate: '', //开始日期
      contractEndDate: '', //结束日期
      contractSubjectList: [], //合同标的物
      constractSubject: '',
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      list: [], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      pageSelect: "",
      courtyardName: '', // 院落数据名称
      courtyardAddress: '', // 院落数据地址
      imgUrl: [], // 院落数据图片

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      this.getDataRequest()
      // this.getList()
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    getDataRequest() {
      let params = {
        contractId: this.id,
      };
      this.$axiosGet(API.contract_getContractDetail, params).then(res => {
        if (res.data) {
          this.contractDetail = res.data.contractResponse;
        }
        if (res.data.contractResponse.startDate) {
          this.contractStartDate = res.data.contractResponse.startDate.substr(0, 10);
        } else {
          this.contractStartDate = '';
        }
        if (res.data.contractResponse.endDate) {
          this.contractEndDate = res.data.contractResponse.endDate.substr(0, 10);
        } else {
          this.contractEndDate = '';
        }
        this.contractSubjectList = res.data.contractResponse.contractSubjectResponseList;
        this.constractSubject = this.contractSubjectList[0].houseAddress;
      });
    },
    // 获取table2列表数据
    getList() {
      let params = {
        courtyardId: this.id,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.ownershipFirst_list, params).then(res => {
        this.total = res.data.total;
        let list = res.data.data;
        if (list.length > 0) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;

      })

    },
    // 获取table3的列表数据
    getTableData() {
      let params = {
        courtyardId: this.id,
        pageNum: this.roompage,
        pageSize: this.roompageSize
      }
      this.$axiosPost(API.yardSearch_roomList, params).then(res => {
        // if (res.data) {
        //   let list = [];
        //   list = res.data.data || [];
        //   this.roomtotal = res.data.total;
        //   if (list.length > 0) {
        //     list.forEach((item, index) => {
        //       list[index].num = index + 1;
        //     });
        //   }
        //   this.roomlist = list;
        // } else {
        //   this.roomlist = [];
        //   this.roomtotal = 0;
        // }

      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getList();
    },
    handleSizeChange1(i) { // 切换数据条数
      this.roompageSize = i;
      this.getTableData()
    },
    handleCurrentChange1(i) { // 切换数据页数
      this.roompage = i;
      this.getTableData()
    }
  }
};
</script>

<style lang="scss" scoped>
.house-nav-tab {
  margin-top: 0 !important;
}
</style>

