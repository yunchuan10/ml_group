<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearchData)">
              <li>
                <span>单位名称</span>
                <el-select filterable clearable placeholder="请选择单位名称" v-model="organNames">
                  <el-option v-for="(item, index) in organList" :key="index" :label="item.organName" :value="item.organName"></el-option>
                </el-select>
              </li>
            </ul>
          </td>
          <!--搜索按钮-->
          <td class="u-search-but">
            <el-button class="f-search-but" @click="getSearchData">查询</el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="el-item-margin">
      <div class="h-table-btns f-pull-right">
        <button class="el-button-export" @click="openPreviewDialog">
          <i class="iconfont icon-yanjing"></i>预览</button>
      </div>
      <div class="el-item-imgs">
        <el-carousel class="el-item-imgs-circle" :interval="500000" arrow="always" height="700px" trigger="click" indicator-position='outside'>
          <el-carousel-item class="el-carousel__item">
            <img :src="$store.state.imgPath.userstyle1" />
          </el-carousel-item>
          <el-carousel-item class="el-carousel__item">
            <div class="el-title_item">
              <h2 class="el-title-h2">{{organName}}</h2>
              <div class="el-title-h3">{{organTypeName}}</div>
              <div class="el-title-code">{{adminDivisionLevelName}}</div>
            </div>
            <div class="el-title-date">{{certificationDate}}</div>
            <div class="el-index">1</div>
            <img :src="$store.state.imgPath.userstyle2" />
          </el-carousel-item>
          <el-carousel-item class="el-carousel__item" v-for='(items,index) in tList' :key="'info'+index">
            <table class="el-table-item el-table-position">
              <tr v-for='(item,index) in items' :key='index'>
                <td width="105">{{item.year}}</td>
                <td width="100">{{item.userNum}}</td>
                <td width="190">{{item.officeCheckArea}}</td>
                <td width="190">{{item.serviceCheckArea}}</td>
                <td width="190">{{item.equipCheckArea}}</td>
                <td width="200">{{item.affiliatedCheckArea}}</td>
                <td>{{item.checkDate.substr(0,10)}}</td>
              </tr>
            </table>
            <div class="el-index">{{index+2}}</div>
            <img :src="$store.state.imgPath.userstyle3" />
          </el-carousel-item>
          <el-carousel-item class="el-carousel__item" v-for='(items,index) in dList' :key="'infos'+index">
            <table class="el-table-item">
              <tr v-for='(item,index) in items' :key='index'>
                <td width="178">{{item.totalName}}</td>
                <td width="148">{{item.roomNo}}</td>
                <td width="152">{{item.roomTypeName}}</td>
                <td width="152">{{item.buildArea}}</td>
                <td width="152">{{item.useArea}}</td>
                <td width="148">{{item.useModeName}}</td>
                <td>{{item.dateAssign}}</td>
              </tr>
            </table>
            <div class="el-index">{{index+2+tList.length}}</div>
            <img :src="$store.state.imgPath.userstyle4" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 打印预览弹框 -->
    <el-dialog title="预览" custom-class="h-dialog-add" :visible.sync="allocatingRoomDialog" width="1200px">
      <div id="pdfDom">
        <div class="yl-content">
          <div class="yl-img1"><img :src="$store.state.imgPath.userstyle1" /></div>
        </div>
        <div class="yl-content">
          <div class="yl-img1"><img :src="$store.state.imgPath.userstyle2" /></div>
          <div class="el-title_item">
            <h2 class="el-title-h2">{{organName}}</h2>
            <div class="el-title-h3">{{organTypeName}}</div>
            <div class="el-title-code">{{adminDivisionLevelName}}</div>
          </div>
          <div class="el-title-date">{{certificationDate}}</div>
          <div class="el-index">1</div>
        </div>
        <div class="yl-content" v-for='(items,index) in tList' :key="'info'+index">
          <div class="yl-img1"><img :src="$store.state.imgPath.userstyle3" /></div>
          <table class="el-table-item el-table-position">
            <tr v-for='(item,index) in items' :key='index'>
              <td width="105">{{item.year}}</td>
              <td width="100">{{item.userNum}}</td>
              <td width="190">{{item.officeCheckArea}}</td>
              <td width="190">{{item.serviceCheckArea}}</td>
              <td width="190">{{item.equipCheckArea}}</td>
              <td width="200">{{item.affiliatedCheckArea}}</td>
              <td>{{item.checkDate.substr(0,10)}}</td>
            </tr>
          </table>
          <div class="el-index">{{index+2}}</div>
        </div>
        <div class="yl-content" v-for='(items,index) in dList' :key='index'>
          <div class="yl-img1"><img :src="$store.state.imgPath.userstyle4" /></div>
          <table class="el-table-item">
            <tr v-for='(item,index) in items' :key='index'>
              <td width="178">{{item.totalName}}</td>
              <td width="148">{{item.roomNo}}</td>
              <td width="152">{{item.roomTypeName}}</td>
              <td width="152">{{item.buildArea}}</td>
              <td width="152">{{item.useArea}}</td>
              <td width="148">{{item.useModeName}}</td>
              <td>{{item.dateAssign}}</td>
            </tr>
          </table>
          <div class="el-index">{{index+2+tList.length}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocatingRoomDialog = false" class="u-submit-btn cancel-btn">取 消</el-button>
        <el-button type="primary" class="u-submit-btn submit-btn" @click="getSave">生成pdf</el-button>
      </span>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--点击生成pdf输入标题 弹框 -->
    <el-dialog title="标题" :visible.sync="savedialogVisible" width="30%">
      <el-form label-position="right" label-width="60px" :model="ruleForm" ref="ruleForm" :rules="rules">
        <el-form-item prop="htmlTitle" label="标题">
          <el-input v-model="ruleForm.htmlTitle" :maxlength="20" placeholder="请输入标题"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savedialogVisible = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="getPdf" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
export default {
  data() {
    return {
      organNames: '', //当前登录的单位
      organName: '', //单位名称
      isActive: 'active',
      organTypeName: '', //机构性质
      adminDivisionLevelName: '', //机构代码
      organId: '', // 单位id
      organList: [],
      certificationDate: '', //发证日期
      year: '', //年度
      approvedUserNum: '',//核定编制人数
      officeRoomApproveArea: '', //	办公室面积
      serviceRoomUseArea: '', //服务用房面积
      equipmentRoomUseArea: '', //	设备用房面积
      affiliateRoomUseArea: '', //	附属用房面积
      technologyRoomUseArea: '', //技术用房面积
      approvedDate: '',//核定日期
      countArea: '', //合计
      totalName: '',
      roomTypeName: '',
      buildArea: '',
      useArea: '',
      useModeName: '',
      dateAssign: '',
      remark: '',
      deleteYardId: '', // 删除ID
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      list: [], // 列表数据集合
      detailList: [], // 办公明细列表
      dList: [],
      tList: [],
      allocatingRoomDialog: false,
      loading: false,
      ruleForm: {
        htmlTitle: '' //pdf标题
      },
      rules: {
        htmlTitle: [
          { required: true, message: '标题不能为空', trigger: 'change' }
        ]
      },
      pdfUrl: '', //pdf名称地址
      savedialogVisible: false
    };
  },
  activated() {
    if (this.$route.query.organId) {
      this.organId = this.$route.query.organId;
      this.organNames = this.$route.query.organName;
      this.$emit("getMsg", 'active')

    } else {
      this.organId = this.$store.state.mainData.loginOrganId;
      this.organNames = this.$store.state.mainData.organName;
      this.$emit("getMsg", '')
    }
    this.getOrganByAreaId();
    this.getAuthorizeDatalist();
    this.getDetail();
  },
  deactivated() {
    this.$destroy();
  },
  computed: {
  },
  watch: {
    'pdfUrl': function (val) {
    }
  },
  methods: {
    //获取查询单位列表
    getOrganByAreaId() {
      let params = {
        areaId: this.$store.state.mainData.areaId
      }
      this.$axiosGet(API.certificateRoom_getOrganByOrganId, params).then(res => {
        if (res.data) {
          this.organList = res.data;
        }
      })
    },
    //获取编制列表
    getAuthorizeDatalist() {
      this.tList = []
      this.organList.forEach((item, index) => {
        if (item.organName === this.organNames) {
          this.organId = item.organId
        }
      })
      let params = {
        organId: this.organId
      }
      this.$axiosGet(API.certificateRoom_certificateOrganBase, params).then(res => {
        if (res.data) {
          this.organName = res.data.organName;
          this.organTypeName = res.data.organTypeName;
          this.adminDivisionLevelName = res.data.adminDivisionLevelName;
          if (res.data.certificationDate != null && res.data.certificationDate != '') {
            this.certificationDate = res.data.certificationDate.substr(0, 10);
          } else {
            this.certificationDate = res.data.certificationDate;
          };
          let proportion = 5; //按照比例切割
          let num = 0;
          let _tdata = [];
          if (res.data.officeCheckHisResponseList) {
            for (let i = 0; i < res.data.officeCheckHisResponseList.length; i++) {
              if (i % proportion == 0 && i != 0) {
                _tdata.push(res.data.officeCheckHisResponseList.slice(num, i));
                num = i;
              }
              if ((i + 1) == res.data.officeCheckHisResponseList.length) {
                _tdata.push(res.data.officeCheckHisResponseList.slice(num, (i + 1)));
              }
            }
            this.tList = _tdata
          }
          // this.year = res.data.officeCheckHisResponseList.year;
          // this.approvedUserNum = res.data.officeCheckHisResponseList.approvedUserNum;
          // this.officeRoomApproveArea = res.officeCheckHisResponseList.data.officeRoomApproveArea;
          // this.serviceRoomUseArea = res.data.officeCheckHisResponseList.serviceRoomUseArea;
          // this.equipmentRoomUseArea = res.data.officeCheckHisResponseList.equipmentRoomUseArea;
          // this.affiliateRoomUseArea = res.data.officeCheckHisResponseList.affiliateRoomUseArea;
          // this.technologyRoomUseArea = res.data.officeCheckHisResponseList.technologyRoomUseArea;
          // this.countArea = res.data.officeCheckHisResponseList.countArea;
        }
      })
    },
    //打印预览
    openPreviewDialog() {
      this.allocatingRoomDialog = true;
    },
    //出现提示输入标题的弹框
    getSave() {
      this.savedialogVisible = true;
    },
    //查询列表
    getSearchData() {
      this.getAuthorizeDatalist();
      this.getDetail();
    },
    //办公用房明细
    getDetail() {
      this.dList = [];
      let params = {
        organId: this.organId,
      }
      this.$axiosGet(API.certificateRoom_certificateRoomBaseDetail, params).then(res => {
        let proportion = 5; //按照比例切割
        let num = 0;
        let _data = [];
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            if (i % proportion == 0 && i != 0) {
              _data.push(res.data.slice(num, i));
              num = i;
            }
            if ((i + 1) == res.data.length) {
              _data.push(res.data.slice(num, (i + 1)));
            }
          }
          this.dList = _data;
        }
      })
    },
    getPdf() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.allocatingRoomDialog = false;
          html2Canvas(document.querySelector('#pdfDom'), {
            allowTaint: true
          }).then(canvas => {
            let contentWidth = canvas.width;
            let contentHeight = canvas.height;
            let pageHeight = (contentWidth / 592.28) * 841.89;
            let leftHeight = contentHeight;
            let position = 0;
            let imgWidth = 595.28;
            let imgHeight = (592.28 / contentWidth) * contentHeight;
            let pageData = canvas.toDataURL('image/jpeg', 1.0);
            let PDF = new JsPDF('', 'pt', 'a4');
            if (leftHeight < pageHeight) {
              PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } else {
              while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                if (leftHeight > 0) {
                  PDF.addPage();
                }
              }
            }
            let file = PDF.output('datauristring').split('base64,');
            let params = {
              fileName: this.ruleForm.htmlTitle,
              base64EncodedFile: file[1]
            };
            this.$axiosPost(API.file_uploadBase64EncodedFile, params).then(res => {
              if (res.result === 'success') {
                this.pdfUrl = res.url;
                this.doAddCertificatePrint();
              }
            });
          });
        }
      })

    },
    doAddCertificatePrint() {
      let organId = '';
      this.organList.forEach((item, index) => {
        if (item.organName === this.organName) {
          organId = item.organId;
        }
      })
      let params = {
        organId: organId,
        organName: this.organName,
        fileRequestList: JSON.stringify([
          {
            name: this.ruleForm.htmlTitle,
            url: this.pdfUrl
          }
        ])
      }
      this.$axiosJsonPost(API.certificateRoom_doAddCertificatePrint, params).then(res => {
        this.loading = false;
        this.savedialogVisible = false;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.push('/use-manage/use-list/style-list')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-item-imgs {
  width: 1100px;
  margin: 0 auto;
  overflow-x: auto;
}
.el-item-margin {
  margin-top: 15px;
}
.el-index {
  position: absolute;
  right: 100px;
  bottom: 105px;
  font-size: 60px;
  color: #faba95;
}
.el-title_item {
  position: absolute;
  top: 180px;
  left: 200px;
  font-size: 20px;
  .el-title-h2 {
    position: relative;
    top: -26px;
  }
  .el-title-h3 {
    position: relative;
    top: 55px;
  }
  .el-title-code {
    position: absolute;
    top: 178px;
    margin-left: 60px;
    white-space: nowrap;
  }
}
.el-title-date {
  position: absolute;
  font-size: 20px;
  left: 200px;
  bottom: 111px;
}
.el-carousel__container {
  width: 1100px;
  margin: 0 auto;
}
.el-table-item {
  position: absolute;
  top: 140px;
  left: 0;
  tr td {
    text-align: center;
    padding: 22px 0;
    word-break: break-all;
  }
}
.el-table-position {
  top: 190px;
}
.el-carousel__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .carousel-image {
    max-width: 100%;
    max-height: 100%;
  }
}
.yl-content {
  position: relative;
  width: 1100px;
  margin: 0 auto;
  text-align: center;
}
</style>
