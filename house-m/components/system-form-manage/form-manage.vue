<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="表单设置" :item="['表单设置']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-tab-content">
        <div v-for="(item,index) in list" :key="index">
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle">
                  <span></span>
                  {{item.menuName}}
                </h2>
              </td>
            </tr>
          </table>
          <div class="switch-wrap">
            <div
              class="switch-item"
              v-for="item1 in item.sysFormSetResponseList"
              :key="item1.sysFormSetId"
            >
              <div class="switch-title">
                <span>{{item1.requiredName}}</span>
              </div>
              <div class="switch-item-content">
                <span
                  class="switch-on"
                  v-show="item1.formSwitch === 'YES'"
                  @click="handleSwitch(item1,'OFF')"
                >开</span>
                <el-switch
                  v-model="item1.formSwitch"
                  active-value="YES"
                  inactive-value="NO"
                  @click.native="handleSwitch(item1)"
                ></el-switch>
                <span
                  class="switch-off"
                  v-show="item1.formSwitch === 'NO'"
                  @click="handleSwitch(item1,'ON')"
                >关</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
     <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  name: "FormManage",
  data() {
    return {
      list: [], // 请求的列表数据
      YPromptShow: false,
      isBol: false,
      message: '',
    };
  },
  activated() {
    this.getList();
  },
  computed: {
    // 地区ID
    areaId() {
      return this.$store.state.mainData.areaId;
    },
    // 单位ID
    organId() {
      return this.$store.state.mainData.loginOrganId;
    },
    organName() {
      return this.$store.state.mainData.organName;
    }
  },
  methods: {
    // 获取列表
    getList() {
      let param = {
        areaId: this.areaId,
        organId: this.organId,
        organName: this.organName
      };
      this.$axiosGet(API.sysmanage_sysFormSetList, param).then(res => {
        if (res.code === 200) {
          this.list = res.data || [];
        }
      });
    },
    // switch切换事件
    handleSwitch(item, option) {
      if (option) {
        option === "OFF"
          ? (item.formSwitch = "NO")
          : (item.formSwitch = "YES");
      }
      let param = {
        formSetId: item.formSetId,
        formSwitch: item.formSwitch,
        areaId: this.areaId,
        organId: this.organId,
        organName: this.organName
      };
      this.$axiosJsonPost(API.sysmanage_updateFormSet, param).then(res => {
        this.YPromptShow = true;
        if (res.result === "success") {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
      });
    },
    YPromptClick() {
      this.getList()
    }
  }
};
</script>

<style lang="scss" scoped>
.switch-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 30px;
  .switch-item {
    padding: 20px;
    display: flex;
    width: 180px;
    justify-content: space-between;
    .switch-title {
      margin-right: 20px;
      text-align: right;
      flex: 1;
    }
    .switch-item-content {
      position: relative;
      .switch-on,
      .switch-off {
        position: absolute;
        z-index: 1;
        color: #fff;
        cursor: pointer;
        top: 1px;
      }
      .switch-on {
        left: 6px;
      }
      .switch-off {
        right: 6px;
      }
    }
  }
}
</style>