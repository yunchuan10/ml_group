<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="楼座管理" :item="['楼座管理']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="u-bread-btn" @click="openImport">
            批量导入
          </button>
          <router-link to='/basic-information/building-manage/building-update/add'>
            <button class="f-pull-right u-bread-btn">
              新增楼座
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>院落名称</span>
                  <el-select v-model="courtyardId" clearable filterable placeholder="请选择院落名称">
                    <el-option v-for="item in courtySelectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>楼座名称</span>
                  <el-input clearable v-model="floorName" placeholder="请输入楼座名称"></el-input>
                </li>
                <li>
                  <span>取得方式</span>
                  <el-select v-model="obtainWay" clearable placeholder="请选择取得方式">
                    <el-option v-for="item in obtainWayList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="楼座名称" prop="name">
          </el-table-column>
          <el-table-column label="院落名称" prop="courtyardName">           
          </el-table-column>
          <el-table-column label="建筑结构" prop="houseStructure">
          </el-table-column>
          <el-table-column label="总建筑面积（㎡）" prop="buildArea">
          </el-table-column>
          <el-table-column label="总占地面积（㎡）" prop="landArea">
          </el-table-column>
          <el-table-column label="地上建筑层数"  prop="upFloorNumber">           
          </el-table-column>
          <el-table-column label="地下建筑层数"  prop="downFloorNumber">            
          </el-table-column>
          <el-table-column label="取得方式" prop='obtainWayName'>
          </el-table-column>
          <el-table-column label="取得日期" prop='obtainDate' :formatter="dateFormat">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="buildingInfoClick(scope.row.id)" type="text">详情</a>           
              <router-link :to="{path: '/basic-information/building-manage/building-update/edit',params:{type:'edit'}, query:{id: scope.row.id}}">修改</router-link>             
              <a type="text" @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <building-detail ref="buildingDetail"></building-detail>
    <!-- 导入 -->
    <build-batch ref="buildBatchExport" @callBack='exportBack'></build-batch>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
import buildingDetail from '@/components/basic-information/building-manage/building-detail'; // 详情弹出框
import buildBatchExport from '@/components/basic-information/building-manage/build-batch-export'; // 导入弹出框
export default {
  components: {
    'building-detail': buildingDetail,
    'build-batch': buildBatchExport
  },
  data() {
    return {
      courtyardId: '', // 院落ID
      floorId: '', //楼座Id
      id: '', // 详情id
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
      list: [], // 列表数据集合
      obtainWay: '',//取得方式
      search:{},
      courtySelectList: [],//院落下拉列表查询
      obtainWayList: [] //取得方式集合
    };
  },
  activated() {
    this.obtainWay = '';
    this.courtyardName = '';
    this.floorId = '';
    this.floorName = '';
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["BULIDING_INFO"];
    },
    oldToken() {
      return this.$store.state.mainData.oldToken
    }
  },
  methods: {
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substring(0, 10);
    },
    // 详情
    buildingInfoClick(id) {
      this.$refs.buildingDetail.openModal(id);
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除楼座将会连同该楼座下的楼层、房间一并删除，确认删除吗？'
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.deleteYardId
      }
      this.$axiosPost(API.floor_delete, params).then(res => {
        this.getSelectRequest();
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼座删除')
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
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取表格列表信息
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId || '',
        // courtyardName: '',
        floorName: this.floorName || '',
        obtainWay: this.obtainWay || '',
        // floorId: this.floorId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.floor_query, params).then(res => {
        let list = [];
        list = res.data.data;
        this.total = res.data.total;
        list.forEach((item, index) => {
          list[index].num = index + 1;
        });
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
    // 获取下拉框数据
    getSelectRequest() {
      this.$axiosGet(API.floor_getAddSelect, {}).then(res => {
        this.courtySelectList = res.data.courtyardSelect;
        this.obtainWayList = res.data.obtainWay;
      });
    },
    //批量导入
    openImport() {
      this.$refs.buildBatchExport.openModal();
    },
    exportBack(val) {
      if (val) {
        this.getDataRequest();
      }
    },
    exportClick() { // 导出
      let courtyardId = this.courtyardId || '';
      let courtyardName = '';  
      let exportFlag = 'YES';
      let floorName = this.floorName || '';
      let obtainWay = this.obtainWay || '';
      let floorId = this.floorId;
      let currentPage = this.page;
      let pageSize = this.pageSize
      window.open(`${API.floor_query}?_token=${this.oldToken}&courtyardId=${courtyardId}&floorId=${floorId}&floorName=${floorName}&exportFlag=YES&storeysId=''&obtainWay=${obtainWay}&currentPage=${currentPage}&pageSize=${pageSize}`)
    }
  },
};
</script>

<style lang="scss">
</style>
