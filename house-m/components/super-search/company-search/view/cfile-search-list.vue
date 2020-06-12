<template>
  <div>
    <section class="m-main">
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: auto">
          <el-table-column label="序号" prop="xuhao" fixed="left" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="fileName" label="文件名称">
            <template slot-scope="scope">
              <span v-html="brightenKeyword(scope.row.fileName, fileName)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="上传者">
          </el-table-column>
          <el-table-column prop="companyName" label="所在单位">
          </el-table-column>
          <el-table-column prop="createDate" label="上传时间">
          </el-table-column>
          <!-- <el-table-column prop="roomNo" label="文件来源">
          </el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a :href="scope.row.location" target="_blank">预览</a>
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
    <disposal-detail ref="disposalDetail"></disposal-detail>
  </div>
</template>

<script>
import disposalDetail from '@/components/disposal-manage/disposal-applydetail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
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
    };
  },
  activated() {
    if (this.$route.query.fileName) {
      this.fileName = this.$route.query.fileName
    }
    this.getDataRequest();
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
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
    //获取表格列表信息
    getDataRequest() {
      let params = {
        organId: this.loginOrganId,
        fileName: this.fileName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.search_fileList, params).then(res => {
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
        this.$emit('getTotal', '0', this.total)
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
