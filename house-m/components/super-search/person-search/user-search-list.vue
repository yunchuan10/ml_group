<template>
  <div>
    <section>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: auto" v-loading="loading">
          <el-table-column label="序号" prop="xuhao" fixed="left" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
            <template slot-scope="scope">
              <a v-html="brightenKeyword(scope.row.realName, realName)" @click="approvalDetailClick(scope.row.staffId)">{{scope.row.realName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="单位名称">
            <template slot-scope="scope">
              <a v-html="brightenKeyword(scope.row.organName, realName)" @click="unitJump(scope.row.organName)">{{scope.row.organName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="dutiesLevelName" label="职务级别">
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="standardArea" label="标准面积">
          </el-table-column>
          <el-table-column prop="realShareArea" label="实际分摊面积" width='150'>
            <template slot-scope="scope">{{scope.row.realShareArea | dot2}}</template>
          </el-table-column>
          <el-table-column prop="excessive" label="是否超标" width='150' fixed="right">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.excessive)">{{scope.row.excessive=='YES'?'超标':'不超标'}}</span>
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
    <personnel-details ref="personneldetails"></personnel-details>
  </div>
</template>

<script>
import personneldetails from '@/components/disposal-manage/personnel-details'; // 姓名详情弹出框
export default {
  components: {
    'personnel-details': personneldetails,
  },
  data() {
    return {
      loading: false,
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      realName: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
    };
  },
  activated() {
    if (this.$route.query.realName) {
      this.realName = this.$route.query.realName;
    } else {
      this.realName = this.superSearch
    }
    this.getDataRequest();
  },
  watch: {
    '$route'(to, from) {
      this.realName = this.$route.query.realName
      this.getDataRequest();
    },
  },

  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId
    },
    superSearch() {
      return this.$store.state.mainData.superSearch;
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
    checkStatus(value) {
      if (value === 'NO') {
        return 's-state-success'
      } else if (value === 'YES') {
        return 's-state-prohibited'
      } else {
        return 's-state-success'
      }
    },
    unitJump(organName) {
      this.$router.push({ path: '/basic-information/query-manage/query-company-list', query: { organName: organName, organId: this.organId } })

    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.personneldetails.openModal(id);
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取表格列表信息
    getDataRequest() {
      this.loading = true;
      let params = {
        organId: this.organId,
        realName: this.realName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.search_userSearchList, params).then(res => {
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
        this.$emit('getNum', this.total)
        this.loading = false
      })
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
