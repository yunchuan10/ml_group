<template>
  <div>

    <div style="height: 100%;overflow: auto;margin-bottom: -15px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content u-grid-content f-relative f-clearfix">
            <el-tooltip class="item u-grid-tips" effect="dark" content="指所有订单中最终拆除房间的数量之和。" placement="right-start">
              <i class="iconfont icon-gantanhao"></i>
            </el-tooltip>
            <el-col :span="10">
              <div class="u-query-icons">
                <img v-if="!iconShowlist[0]" :src="$store.state.imgPath.queryrepair">
                <img v-if="iconShowlist[0]" :src="$store.state.imgPath.queryaddressh">
              </div>
            </el-col>
            <el-col :span="14">
              <div class="u-query-txt">
                <p>拆除房间</p>
                <h2 class="u-query-h2">{{allRemoveRoomNum || '0'}}间</h2>
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content u-grid-content f-relative f-clearfix">
            <el-tooltip class="item u-grid-tips" effect="dark" content="实指所有订单中最终拆除房间的面积之和。" placement="right-start">
              <i class="iconfont icon-gantanhao"></i>
            </el-tooltip>
            <el-col :span="10">
              <div class="u-query-icons">
                <img v-if="!iconShowlist[1]" :src="$store.state.imgPath.disposal_area">
                <img v-if="iconShowlist[1]" :src="$store.state.imgPath.querypeopleh">
              </div>
            </el-col>
            <el-col :span="14">
              <div class="u-query-txt">
                <p>拆除面积</p>
                <h2 class="u-query-h2">{{allRemoveRoomAreaNum ? allRemoveRoomAreaNum: '0'}}㎡</h2>
              </div>
            </el-col>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="grid-content u-grid-content f-relative f-clearfix">
            <el-tooltip class="item u-grid-tips" effect="dark" content="指所有订单中拆除房间过程中发生的所有拆除费用之和。" placement="right-start">
              <i class="iconfont icon-gantanhao"></i>
            </el-tooltip>
            <el-col :span="10">
              <div class="u-query-icons">
                <img v-if="!iconShowlist[2]" :src="$store.state.imgPath.disposal_money">
                <img v-if="iconShowlist[2]" :src="$store.state.imgPath.queryrepairh">
              </div>
            </el-col>
            <el-col :span="14">
              <div class="u-query-txt">
                <p>拆除费用</p>
                <h2 class="u-query-h2">{{allDemolitionFee || '0'}}万元</h2>
              </div>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>项目名称</span>
                <el-input clearable placeholder="请输入项目名称" v-model="itemName"></el-input>
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
    <div class="h-table">
      <el-table :data="list" stripe style="width: auto">
        <el-table-column fixed="left" prop="date" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="申请单号">
        </el-table-column>
        <el-table-column prop="itemName" label="项目名称">
        </el-table-column>
        <el-table-column prop="handleTypeName" label="处置方式">
        </el-table-column>
        <el-table-column prop="planRemoveRoomNum" label="拟拆除房间数量（间）">
        </el-table-column>
        <el-table-column prop="realRemoveRoomNum" label="本次拆除房间数量（间）">
        </el-table-column>
        <el-table-column prop="demolitionOrganName" label="拆除单位">
        </el-table-column>
        <el-table-column prop="demolitionFee" label="拆除费用（万元）">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <router-link v-show="scope.row.disposalOfPerform === 'YES'" :to="{path: '/disposal-manage/disposal-execution/execution-result/edit',query:{id: scope.row.id}}">修改</router-link>
            <a @click="approvalDetailClick(scope.row.id)">详情</a>
            <router-link v-show="scope.row.disposalOfPerform === 'NO'" :to="{path: '/disposal-manage/disposal-execution/execution-result/add',query:{id: scope.row.id}}">执行结果录入</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 详情组件 -->
    <disposal-detail ref="disposalDetail"></disposal-detail>
  </div>
</template>
<script>
import disposalDetail from '@/components/disposal-manage/disposal-detail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
  },
  data() {
    return {
      pageSelect: '', //tab选中状态
      useStatusList: [],
      itemName: '', //项目名称
      useStatus: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [false, false, false],
      activeName: 'number',
      handleType: 'DEMOLITION',
      list: [], //表格列表信息    
      organList: [], //单位集合
      userId: '', //用户名id
      allRemoveRoomNum: '', //拆除
      allRemoveRoomAreaNum: '', //拆除面积
      allDemolitionFee: '', //拆除费用   
    };
  },
  activated() {
    this.getTotal();
    this.getDataRequest();
  },
  deactivated() {
    this.iconShowlist = [false, false, false];
    sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
  },
  mounted() {
  },
  computed: {

  },
  watch: {

  },
  methods: {
    changeImg(index) {
      let editIconShowList = [];
      this.iconShowlist.forEach((item, itemIndex) => {
        if (itemIndex === index) {
          editIconShowList.push(true);
        } else {
          editIconShowList.push(false);
        }
        this.iconShowlist = editIconShowList;
      })
      sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
    },
    // 获取三个tab拍卖的值
    getTotal(){
      let params ={
        organId:''
      }
      this.$axiosGet(API.handleapply_handlePerformTableList,{}).then(res =>{
        if(res.data){
          this.allRemoveRoomNum = res.data.allRemoveRoomNum || '0'; //拆除数量
          this.allRemoveRoomAreaNum = res.data.allRemoveRoomAreaNum || '0'; //拆除面积
          this.allDemolitionFee = res.data.allDemolitionFee || '0'; //拆除费用
        }   
      })
    },
    //获取列表信息
    getDataRequest() {
      let params = {
        itemName: this.itemName,
        handleType: this.handleType,
        pageNum: this.page, //当前页
        pageSize: this.pageSize,
      }
      this.$axiosGet(API.handleapply_handlePerformList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;         
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      })
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
    }
  }
};
</script>

<style  lang="scss">
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
</style>

<style lang="scss" scoped>
.f-size {
  font-size: 16px;
}
.u-bread {
  height: 30px;
  line-height: 30px;
}
.router-link-exact-active {
  color: #2f70ff !important;
  p {
    color: #2f70ff !important;
  }
  .u-grid-content {
    border: 1px solid #2f70ff;
  }
}

.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 25px 0;
  .u-grid-tips {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-query-icons {
    width: 60px;
    height: 64px;
    margin: 5px auto 0;
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    font-size: 38px;
  }
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
}
.el-row {
  margin: 20px 0;
  float: left;
  width: 100%;
}
.el-col {
  border-radius: 4px;
  a {
    color: #303133;
  }
}
.el-col a p {
  color: #606266;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
