<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="设备信息" :item="['会议室管理', '设备信息']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{name: 'device', params: {type: 'add'}}">
            <button class="f-pull-right u-bread-btn">新增设备</button>
          </router-link>
        </div>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="设备名称">
            <el-input clearable v-model="search.name" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select clearable filterable v-model="search.type" placeholder="请选择类型">
              <el-option value="" label="全部"></el-option>
              <el-option :value="1" label="使用中"></el-option>
              <el-option :value="2" label="报废"></el-option>
              <el-option :value="3" label="空闲"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买时间">
            <el-date-picker v-model="search.startTime" type="date" placeholder="选择开始时间"></el-date-picker>
            <span style="padding: 0 5px;color: #ccc">-</span>
            <el-date-picker v-model="search.endTime" type="date" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <!--表格数据-->
      <div class="h-table f-relative">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="DEVICE_LIST">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="编号" prop="equipNo" v-if="listTableListBol[0].show"></el-table-column>
          <el-table-column label="名称" prop="equipName" v-if="listTableListBol[1].show"></el-table-column>
          <el-table-column label="型号" prop="equipModel" v-if="listTableListBol[2].show"></el-table-column>
          <el-table-column label="品牌" prop="equipBrand" v-if="listTableListBol[3].show"></el-table-column>
          <el-table-column label="价格（元）" prop="singlePrice" v-if="listTableListBol[4].show"></el-table-column>
          <el-table-column label="购买时间" prop="buyTime" v-if="listTableListBol[5].show"></el-table-column>
          <el-table-column label="状态" prop="status" v-if="listTableListBol[6].show">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" v-if="scope.row.status === 1 " type="success" size="medium" disable-transitions>使用中</el-tag>
              <el-tag class="el-tag-item" v-if="scope.row.status === 2 " type="warning" size="medium" disable-transitions>报废</el-tag>
              <el-tag class="el-tag-item" v-if="scope.row.status === 3 " type="danger" size="medium" disable-transitions>空闲</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="使用年限" prop="eqpUseYears" v-if="listTableListBol[7].show"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="{name: 'device', params: { type: 'edit' }, query: {equipId: scope.row.id}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
<!--        <div class="f-pull-left">-->
<!--          <el-button size="medium"><i class="iconfont icon-daochu"></i>导出</el-button>-->
<!--          <el-button type="primary" size="medium" @click="batchLeadClick">批量导入</el-button>-->
<!--        </div>-->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>

    <!--删除提示框-->
    <zl-confirm v-model="YConfirmShow" @click="YDeleteClick"></zl-confirm>
    <!-- 操作成功提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
    <!--批量导入-->
    <zl-confirm v-model="batchLeadShow" title="批量导入设备信息" @click="leadConfirm">
      <div class="batch-lead-box">
        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
          <el-button size="small" type="primary" plain>选择文件</el-button>
        </el-upload>
        <el-button size="small" type="primary" plain class="down-load">下载模板</el-button>
      </div>
    </zl-confirm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      batchLeadShow: false,
      fileList: [], // 上传附件列表
      message: '',
      isBol: false,
      search: {
        name: '', // 名称
        type: '', // 类型
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      equipId: ''
    }
  },
  computed: {
    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["DEVICE_LIST"];
    }
  },
  deactivated() {
    this.search.name = '';
    this.search.type = '';
    this.search.startTime = '';
    this.search.endTime = '';
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    checkClassName(value) {
      if (value === 'SCRAP') {
        return 's-state-fail'
      } else if (value === 'FREE') {
        return 's-state-caveat'
      } else if (value === 'INUSE') {
        return 's-state-success'
      }
    },
    checkStatusName(value) {
      if (value === 'SCRAP') {
        return '报废'
      } else if (value === 'FREE') {
        return '空闲'
      } else if (value === 'INUSE') {
        return '使用中'
      }
    },
    getDataRequest() {
      // let params = {
      //   equipName: this.search.name,
      //   status: this.search.type,
      //   buyTimeStart: DATE.dateReturnYMD(this.search.startTime),
      //   buyTimeEnd: DATE.dateReturnYMD(this.search.endTime),
      //   max: this.pageSize,
      //   offset: (this.page - 1) * this.pageSize
      // }
      let params = {
        equipName: this.search.name,
        status: this.search.type,
        buyTimeStart: DATE.dateReturnYMD(this.search.startTime),
        buyTimeEnd: DATE.dateReturnYMD(this.search.endTime),
        pageSize: this.pageSize,
        pageStart: this.page
      }
      // let params = {
      //   equipName: '',
      //   status: 1,
      //   buyTimeStart: '',
      //   buyTimeEnd: '',
      //   pageSize: 2,
      //   pageStart: 1
      // }
      this.$axiosJsonPost(API.equipInfo_equipPageList, params).then(res => {
        if (res.status === 200) {
          this.list = res.data.list || [];
          this.total = res.data.total;
        }
      })
      // this.list = [{
      //   equipNo:'zx编号',
      //   equipName:'麦克风',
      //   equipModel:'gm123',
      //   equipBrand:'索尼',
      //   singlePrice:'1200.00',
      //   buyTime:'2019-10-29',
      //   status:'SCRAP',
      //   eqpUseYears:'6 ',
      // },{
      //   equipNo:'zx编号',
      //   equipName:'麦克风',
      //   equipModel:'gm123',
      //   equipBrand:'索尼',
      //   singlePrice:'1200.00',
      //   buyTime:'2019-10-29',
      //   status:'FREE',
      //   eqpUseYears:'6 ',
      // },{
      //   equipNo:'zx编号',
      //   equipName:'麦克风',
      //   equipModel:'gm123',
      //   equipBrand:'索尼',
      //   singlePrice:'1200.00',
      //   buyTime:'2019-10-29',
      //   status:'INUSE',
      //   eqpUseYears:'6 ',
      // }]


    },
    // 设备删除
    deleteClick(equipId) {
      this.equipId = equipId;
      this.YConfirmShow = true;
    },
    YDeleteClick() {
      let params = {}
      this.$axiosDelete(API.equipInfo_deleteEquip + this.equipId, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        // 判断删除的数据是不是当前页最后一条
        let totalNo = ((this.total - 1) / this.pageSize).toString().indexOf('.');
        if (totalNo === -1) {
          this.page = this.page - 1;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },

    //批量导入
    batchLeadClick() {
      this.batchLeadShow = true
    },
    leadConfirm() {
      this.batchLeadShow = false
    },
    // 附件列表改变
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // handleChange(file, fileList) {
    //   this.fileList = fileList.slice(-3);
    // }
  }
}
</script>
<style lang="scss" scoped>
.el-tag-item {
  display: inline-block;
  width: 80px;
  text-align: center;
  border-radius: 12px;
}
.batch-lead-box {
  position: relative;
  .down-load {
    position: absolute;
    top: 0;
    left: 100px;
  }
}
</style>
