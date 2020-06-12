<template>
  <div class="resource-wrap">
    <!-- 查询条件部分 -->
    <div class="m-search">
      <zl-searchLayout @click="getDataRequest">
        <el-form-item label="名称">
          <el-input clearable v-model="name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-select v-model="areaName" filterable clearable placeholder="全部">
            <el-option label="全部" :value="''"></el-option>
            <el-option v-for="item in areaNameList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
            </el-option>
          </el-select>
        </el-form-item>
      </zl-searchLayout>
    </div>
    <!-- tab切换 -->
    <div class="con-tab-wrap">
      <ul class="house-nav-tab">
        <li @click="tabSelect('reception')" :class="{'actived':tabSel=='reception'}">
          <a>接待点</a>
        </li>
        <li @click="tabSelect('POINT')" :class="{'actived':tabSel=='POINT'}">
          <a>视察点</a>
        </li>
        <!-- <li @click="tabSelect('famous')" :class="{'actived':tabSel=='famous'}">
          <a>徽风皖韵</a>
        </li> -->
      </ul>
    </div>

    <!-- 图表内容展示 -->
    <div class="content-wrap">
      <!-- 接待点信息 -->
      <div class="reception-wrap" v-show="tabSel=='reception'">
        <el-radio-group v-model="tabPosition" class="hotel-meeting" @change="getDataRequest">
          <el-radio-button label="0">酒店信息</el-radio-button>
          <el-radio-button label="1">会议信息</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 酒店或会议tab -->
      <el-tabs>
        <table-info :reception="tabData" :eventList="eventList" @onEvent="onEvent"></table-info>
      </el-tabs>
    </div>

    <div class="h-table-bottom f-clearfix">
      <div class="h-table-btns f-pull-left">
        <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
      </div>
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="[12, 24, 36]" @change="getDataRequest"></zl-pagination>
        </div>
      </div>
    </div>
    <!-- 详情弹出框 -->
    <resource-detail ref="resourceDetail"></resource-detail>
  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import tableInfo from "@/components/resource-manage/resource-info/table-info" // 图片表格信息

export default {
  components: {
    'resource-detail': resourceDetail,
    "table-info": tableInfo
  },
  data() {
    return {
      id: '', // 详情id
      total: 0, // 数据总数
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      tabSel: 'reception', // tab选择的信息
      tabPosition: '0', // 酒店或会议信息
      tabData: [],
      areaId: '0100102',
      areaName: '',
      name: '',
      areaNameList: [],
      eventList: [ // 图片列表的操作事件
        {
          name: 'detail',
          title: '详情'
        }
      ]
    };
  },
  mounted() {
    this.getAreaFacade();
    this.getDataRequest();
  },
  computed: {
  },
  methods: {
    onEvent(data) {
      let type = '';
      if (this.tabSel === 'reception') {
        if (this.tabPosition == '0') {
          type = 'HOTEL';
        } else {
          type = 'MEETING';
        }
      } else {
        type = 'POINT';
      }
      if (data.eventName === 'detail') {
        this.$refs.resourceDetail.openModal(data.id, type);
      }
    },
    getAreaFacade() { //查询省会下所有地级市信息接口
      let params = {
        areaId: this.areaId
      }
      this.$axiosPost(API.sysAreaFacade_findAreaById, params).then(res => {
        this.areaNameList = res.model.list;
      })
    },
    // tab点击
    tabSelect(type) {
      this.tabSel = type;
      if (type === 'reception') {
        this.tabPosition = 0;
      }
      this.getDataRequest(); // 调用查询方法
    },
    // 查询
    getDataRequest() {
      let type = '';
      if (this.tabSel === 'reception') {
        if (this.tabPosition == '0') {
          type = 'HOTEL';
        } else {
          type = 'MEETING';
        }
      } else {
        type = 'POINT';
      }
      let params = {
        type: type,
        name: this.name,
        areaId: this.areaName
      }
      this.$axiosPost(API.receptionFacade_findWithPage, params).then(res => {
        this.total = res.model.totleCount;
        this.tabData = res.model.list;
      })
    },
    // 点击酒店或者会议
    hotelMeeting() {
      this.getDataRequest(); // 调用查询方法
    }
  }
};
</script>

<style lang="scss">
.main-default .g-content .g-main .m-main .m-search {
  padding: 0 0 15px 0;
  border-bottom: 1px #dcdcdc solid;
}
.con-tab-wrap {
  .house-nav-tab {
    height: 55px;
    li a {
      height: 35px;
    }
    .actived {
      border: 1px #2f70ff solid;
      border-radius: 2px;
      a {
        color: #2f70ff;
      }
    }
  }
}

// 酒店会议tab
.hotel-meeting {
  display: block;
  text-align: center;
  span {
    height: 36px;
    width: 140px;
    border-radius: 2px;
    line-height: 10px;
    border-color: #2f70ff;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #2f70ff;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-left-color: #2f70ff;
  }
}
.hm {
  margin-left: -3px;
}
</style>

