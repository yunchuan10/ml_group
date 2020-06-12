<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="楼层管理" :item="['楼层管理']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to='/basic-information/floor-manage/floor-update/add'>
            <button class="f-pull-right u-bread-btn">
              新增楼层
            </button>
          </router-link>
          <button class="f-pull-right u-bread-btn" @click="floorBatchaddClick">批量新增</button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>院落名称</span>
                  <el-select v-model="courtyardId" @change="getCourtyardName" filterable clearable placeholder="请选择院落名称">
                    <el-option v-for="item in courtySelectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>楼座名称</span>
                  <el-input clearable placeholder="请输入楼座名称" v-model="floorName"></el-input>
                </li>
                <li>
                  <span>楼层名称</span>
                  <el-input clearable placeholder="请输入楼层名称" v-model="storeysName"></el-input>
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
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="courtyardName" label="院落名称">            
          </el-table-column>
          <el-table-column prop="floorName" label="楼座名称">           
          </el-table-column>
          <el-table-column prop="name" label="楼层名称">
          </el-table-column>
          <el-table-column prop="plane" label="楼层平面图">
            <template slot-scope="scope">
              <i :class="(scope.row.fileResponseList && scope.row.fileResponseList.length) > 0?'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="floorInfoClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/basic-information/floor-manage/floor-update/edit', query:{id: scope.row.id}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
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
    <floor-detail ref="floorDetail"></floor-detail>
    <floor-batch-add ref="floorBatchadd" @requestData="getDataRequest"></floor-batch-add>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import floorDetail from '@/components/basic-information/floor-manage/floor-detail'; // 详情弹出框
import floorBatchadd from '@/components/basic-information/floor-manage/floor-batch-add'; // 批量新增弹出框
export default {
  components: {
    'floor-detail': floorDetail,
    'floor-batch-add': floorBatchadd
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
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
    this.courtyardId = '';
    this.getDataRequest();
    this.getSelectRequest(); // 获取院落下拉框列表
  },
  computed: {
    oldToken() {
      return this.$store.state.mainData.oldToken
    }
  },
  methods: {
    // 院落名称更改
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.id) {
          this.courtyardName = item.name;
        }
      })
    },
    // 详情
    floorInfoClick(id) {
      this.$refs.floorDetail.openModal(id);
    },
    floorBatchaddClick() {
      this.$refs.floorBatchadd.openModal();
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除楼层将会连同该楼层内的房间一并删除，确认删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.deleteYardId
      }
      this.$axiosPost(API.storeys_delete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼层删除')
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
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId || "",
        floorId: this.floorId,
        floorName: this.floorName,
        storeysName: this.storeysName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.storeys_query, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
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
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
    exportClick() { // 导出
      // let params = {
      let courtyardId = this.courtyardId;
      let floorId = this.floorId;
      let floorName = this.floorName;
      let exportFlag = 'YES';
      let storeysName = this.storeysName;
      let currentPage = this.page;
      let pageSize = this.pageSize;
      window.open(`${API.storeys_query}?_token=${this.oldToken}&courtyardId=${courtyardId}&floorId=${floorId}&floorName=${floorName}&exportFlag=YES&storeysName=${storeysName}&currentPage=${currentPage}&pageSize=${pageSize}`)
    }
  }
};
</script>

<style lang="scss">
</style>
