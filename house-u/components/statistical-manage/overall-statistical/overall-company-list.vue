<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title=""></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="backHandle">
            返回
          </button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="value3" type="year" placeholder="选择年">
                  </el-date-picker>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <h2 class="u-table-title">2018年—安徽省滁州市-琅琊区各单位办公用房总体使用信息一览表</h2>
        <el-table :data="list" stripe style="width: 100%" show-summary>
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template> -->
          </el-table-column>
          <el-table-column prop="area" label="单位">
          </el-table-column>
          <el-table-column label="人员编制">
            <el-table-column prop="personNum" label="编制人数" width="120">
            </el-table-column>
            <el-table-column prop="personarea" label="编制内实际人数" width="120">
              <template slot-scope="scope">
                <router-link to="/statistical-manage/overall-statistical/overall-person-list">{{scope.row.personarea}}</router-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="空置房间">
            <el-table-column prop="kongzhiNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link to="/">{{scope.row.kongzhiNum}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="kongzhiarea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="办公室">
            <el-table-column prop="officeNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link to="/">{{scope.row.officeNum}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="officearea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="服务用房">
            <el-table-column prop="serviceNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link to="/">{{scope.row.serviceNum}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="servicearea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="设备用房">
            <el-table-column prop="deviceNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link to="/">{{scope.row.deviceNum}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="devicearea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="附属用房">
            <el-table-column prop="attachNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link to="/">{{scope.row.attachNum}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="attacharea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="技术业务用房">
            <el-table-column prop="tecNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link to="/">{{scope.row.tecNum}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="tecarea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="合计">
            <el-table-column prop="buildarea" label="基本办公用房建筑面积" width="120">
            </el-table-column>
            <el-table-column prop="buildareaAll" label="总建筑面积" width="120">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
          <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value3: '',
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [
        {
          area: '市直机关',
          personNum: '45',
          personarea: '67',
          kongzhiNum: '67',
          kongzhiarea: '67',
          officeNum: '67',
          officearea: '67',
          serviceNum: '67',
          servicearea: '89',
          deviceNum: '634',
          devicearea: '12',
          attachNum: '55',
          attacharea: '90',
          tecNum: '100',
          tecarea: '45',
          buildarea: '23',
          buildareaAll: '15678'
        }
      ], // 列表数据集合
      floorId: '', //楼座id
      courtyardId: '', // 院落ID
      courtyardName: '',//院落名称
      storeysName: '', // 楼层名称
      floorName: '', // 楼座名称
      storeysId: '', //楼层id
      deleteYardId: '', // 删除ID
      storeysPlanImgUrls: '',
      storeysCadImgUrls: '',
      courtySelectList: [] //下拉框院落名称集合
    };
  },
  activated() {
    // this.getDataRequest();
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    //后退
    backHandle() {
      this.$router.back()
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        floorId: this.floorId,
        floorName: this.floorName,
        storeysId: '',
        storeysName: this.storeysName,
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.storeys_query, params).then(res => {
        let list = [];
        list = res.data.data;
        this.total = res.data.total;
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosPost(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
  }
};
</script>

