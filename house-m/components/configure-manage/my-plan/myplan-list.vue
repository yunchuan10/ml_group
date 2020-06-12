<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="配置管理"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click="pageSelect = 'wait'" :class="{'active':pageSelect=='wait'}">
          <a>待处理
            <i class="f-weight-bold">（6）</i>
          </a>
        </li>
        <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}">
          <a>已处理</a>
        </li>
      </ul>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getDataRequest)">
                <li>
                  <span>申请单号</span>
                  <el-input clearable v-model="floorName" placeholder="请输入申请单号"></el-input>
                </li>
                <li>
                  <span>申请单位</span>
                  <el-input clearable v-model="floorName" placeholder="请输入申请单位"></el-input>
                </li>
                <li>
                  <span>状态</span>
                  <el-select v-model="value1" @change="getCourtyardName" filterable clearable placeholder="请输入状态">
                    <el-option label="全部" :value="''"></el-option>
                    <!-- <el-option v-for="item in courtySelectList" :key="item.courtyardId" :label="item.courtyardName" :value="item.courtyardId"> -->
                    <!-- </el-option> -->
                  </el-select>
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
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template> -->
          </el-table-column>
          <el-table-column label="申请单号" prop="name">

          </el-table-column>
          <el-table-column label="申请单位" prop="applyName">
          </el-table-column>
          <el-table-column label="申请面积（㎡）" prop="applyArea">
          </el-table-column>
          <el-table-column label="配置方式" prop="deploy">
          </el-table-column>
          <el-table-column label="调配面积（㎡）" prop="deployArea">
          </el-table-column>
          <el-table-column label="方案制定时间" prop="douser">

          </el-table-column>
          <el-table-column label="审批状态" prop="state">
            <!-- <template slot-scope="scope">
              {{scope.row.downFloorNumber}}
            </template> -->
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a type="text">撤回</a>
              <a @click="approvalInfoClick()" type="text">修改</a>
              <a @click="approvalDetailClick()">详情</a>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <approval-detail ref="approvalDetail"></approval-detail>
    <approval-info ref="approvalInfo"></approval-info>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import approvalInfo from '@/components/configure-manage/room-approval/approval-info'; // 审批弹出框
import approvalDetail from '@/components/configure-manage/room-approval/approval-detail'; // 详情弹出框
export default {
  components: {
    'approval-detail': approvalDetail,
    'approval-info': approvalInfo,
  },
  data() {
    return {
      value1: '',
      pageSelect: 'wait',
      deleteYardId: '',//删除id
      floorName: '', // 楼座名称
      courtyardName: '',// 院落名称
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [
        {
          date: '1',
          name: '王小虎',
          applyName: '上海市普陀区金沙江路 1518 弄',
          applyArea: '2016-05-02',
          deploy: '调用',
          deployArea: '56',
          companyArea: '中科美络',
          douser: '美络',
          time: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '1',
          name: '王小虎',
          applyName: '上海市普陀区金沙江路 1518 弄',
          applyArea: '2016-05-02',
          deploy: '调用',
          deployArea: '56',
          companyArea: '中科美络',
          douser: '美络',
          time: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '1',
          name: '王小虎',
          applyName: '上海市普陀区金沙江路 1518 弄',
          applyArea: '2016-05-02',
          deploy: '调用',
          deployArea: '56',
          companyArea: '中科美络',
          douser: '美络',
          time: '王小虎',
          state: '上海市普陀区金沙江路 1518 弄'
        }
      ], // 列表数据集合
      courtySelectList: [],//院落下拉列表查询
      floorSelectList: []//楼座下拉列表查询
    };
  },
  activated() {
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {

  },
  methods: {
    //获取院落名称
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.id) {
          this.courtyardName = item.name;
          this.courtyardId = value;
        }
      })

    },
    // 审批
    approvalInfoClick() {
      this.$refs.approvalInfo.openModal();
    },
    // 详情
    approvalDetailClick() {
      this.$refs.approvalDetail.openModal();
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
    },
    // 删除
    YDeleteClick() {
      let params = {
        floorId: this.deleteYardId
      }
      this.$axiosPost(API.floor_delete, params).then(res => {
        this.getSelectRequest();
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    //获取表格列表信息
    getDataRequest() {

    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取院落列表查询数据
    getSelectRequest() {
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
    // 获取楼座列表查询数据
    // getFloorSelectRequest() {
    //   let params = {
    //     courtyardId: this.courtyardId,
    //   }
    //   this.$axiosPost(API.floor_queryFloorSelect, params).then(res => {
    //     this.floorSelectList = res.data;
    //   });
    // },
  },

};
</script>

<style lang="scss">
</style>
