<template>
  <div>
    <section>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: auto">
          <el-table-column label="序号" prop="xuhao" fixed="left" width="50" v-loading="loading">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <template slot-scope="scope">
              <a v-html="brightenKeyword(scope.row.roomNo, organName)" @click="roomnumberClick(scope.row.roomId)">{{scope.row.roomNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="useStatusName" label="房间状态">
          </el-table-column>
          <el-table-column prop="organName" label="使用单位">
            <template slot-scope="scope">
              <a v-html="brightenKeyword(scope.row.organName?scope.row.organName:'', organName)" @click="roomJump(scope.row.organName,scope.row.organId)">{{scope.row.organName?scope.row.organName:''}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomBaseTypes" label="房间类型">
          </el-table-column>
          <el-table-column prop="dateAssign" label="分配时间">
            <template slot-scope="scope">
              <span>{{scope.row.dateAssign&&scope.row.dateAssign.substr(0,10)}}</span>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <roomnumber-details ref="roomnumberdetails"> </roomnumber-details>
  </div>
</template>

<script>
import roomnumberdetails from '@/components/disposal-manage/roomnumber-details'; //房间号 详情弹出框

export default {
  components: {
    'roomnumber-details': roomnumberdetails,
  },
  data() {
    return {
      loading: false,
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      data: {
        total: '',
        filetotal: ''
      }
    };
  },
  activated() {
    this.getDataRequest();
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },
    organName() {
      return this.$route.query.organName
    },
  },
  watch: {
    '$route'(to, from) {
      this.getDataRequest();
    },
  },
  methods: {
    //筛选变色
    brightenKeyword(val, keyword) {
      val = val + '';
      if (val.indexOf(keyword) !== -1 && keyword !== '') {
        return val.replace(keyword, '<font color="#ff0000">' + keyword + '</font>')
      } else {
        return val
      }
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },

    unitJump(roomAddress, organId) {
      this.$router.push({ path: '/basic-information/query-manage/query-courtyard-list', query: { roomAddress: roomAddress, organId: organId } })
    },
    roomJump(organName, organId) {
      this.$router.push({ path: '/basic-information/query-manage/query-company-list', query: { organName: organName, organId: organId } })
    },

    //获取表格列表信息
    getDataRequest() {
      this.loading = true;
      let params = {
        organId: this.loginOrganId,
        roomNo: this.$route.query.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.search_officceHouseUserList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.data;
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        this.loading = false;
        this.$emit('getTotal', this.total, '0')
      })
    },
    //详情
    roomnumberClick(id) {
      this.$refs.roomnumberdetails.openModal(id);
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
  },
};
</script>

<style lang="scss">
</style>
