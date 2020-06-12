<template>
  <div id="base-upload">
    <el-upload
      :action="uploadUrl"
      :headers="{Authorization: loginStatu.token}"
      :accept="handleAccept"
      :file-list="smallFileList"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-error ="handleError"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload">
      <el-button slot="trigger" type="primary" ><i class=" el-icon-upload2"></i> 上传附件</el-button>
      <span slot="tip" class="upload-btn-info">只能上传{{handleAccept}}文件，且不超过20M!</span>
    </el-upload>
  </div>
</template>

<script>
/**
 * @description base-upload 上传组件
 * @vue-prop {String} uploadUrl 上传链接 default: ''
 * @vue-prop {Array} smallFileList 回显的文件列表 default: [], 形如[{name: '', url: '', size: 0}]
 * @vue-prop {Array} totalFileList 提交上传的文件列表 default: []
 * @vue-prop {Array} type 上传文件类型 default: 'FILE' 可选FILE || IMAGE
 */
import { mapState } from 'vuex'
export default {
  name: "VBaseUpload",
  data() {
    return {
      fileList: [], // 提交上传的文件列表
      downloadDom: null, // 创建的a标签dom

      loginStatu: {
        token: this.$store.state.mainData.token || ''
      }
    }
  },
  props: {
    uploadUrl: {
      type: String,
      default: ''
    },
    smallFileList: {
      type: Array,
      default() {
        return []
      }
    },
    totalFileList: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: 'FILE'
    },
    handleFileRemove: {
      type : Function
    }
  },
  computed: {
    // ...mapState('mainData', [
    //   'loginStatu',
    // ]),
    handleAccept() {
      let accept = '';
      switch (this.type) {
        case 'FILE':
          accept = '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt';
          break;
        case 'IMAGE':
          accept = '.jpg,.jpeg,.png,.gif';
          break;
        case 'ALL':
          accept = '.jpg,.jpeg,.png,.gif,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt';
          break;
        default:
          accept = '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt';
      }
      return accept;
    }
  },
  activated(){
    // setTimeout( ()=>{
    //   console.log(this.smallFileList, 5555);
    // }, 1000 )
  },
  deactivated() {
    this.downloadDom && document.body.removeChild(this.downloadDom);
  },
  methods: {
    // 文件上传成功
    handleSuccess(response, file, fileList) {
      if (response.status === 200 && response.data) {
        this.$message({type: 'success', message: '上传成功！'});
        // console.log('文件上传 fileList',fileList)
        this.fileList = fileList.map(item => {
          if(item.id){
            return item;
          }else {
            let data = item.response.data;
            return {fileName: item.name, fileUrl: data.baseUrl}
            // return {fileName: item.name, fileUrl: item.response.data ? item.response.data.url : '',}
          }
        });
        this.$emit('update:totalFileList',this.fileList);
      }
    },
    // 文件上传失败
    handleError(err, file, fileList) {
      this.$message({type: 'error', message: '上传失败！'});
      console.log(err);
    },
    // 文件上传之前
    beforeUpload(file) {
      let isMatch, isLt20M;
      isLt20M = file.size / 1024 / 1024 < 20;
      if(this.type === 'ALL'){
        isMatch = /\.(jpg|jpeg|png|gif|doc|docx|ppt|pptx|xls|xlsx|pdf|txt)$/.test(file.name);
        if (!isMatch) {
          this.$message({type: 'error', message: '请上传文件类型为.jpg,.jpeg,.png,.gif的文件!'});
        }
        if (!isLt20M) {
          this.$message({type: 'error', message: '上传图片大小不能超过 20MB!'});
        }
        return isMatch && isLt20M;
      }else if (this.type === 'IMAGE') {
        isMatch = /\.(jpg|jpeg|png|gif)$/.test(file.name);
        if (!isMatch) {
          this.$message({type: 'error', message: '请上传文件类型为.jpg,.jpeg,.png,.gif的文件!'});
        }
        if (!isLt20M) {
          this.$message({type: 'error', message: '上传图片大小不能超过 20MB!'});
        }
        return isMatch && isLt20M;
      } else {
        isMatch = /\.(doc|docx|ppt|pptx|xls|xlsx|pdf|txt)$/.test(file.name);
        if (!isMatch) {
          this.$message({type: 'error', message: '请上传文件类型为.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt的文件!'});
        }
        if (!isLt20M) {
          this.$message({type: 'error', message: '上传文件大小不能超过 20MB!'});
        }
        return isMatch && isLt20M;
      }
    },
    // 删除之前
    beforeRemove(file, fileList){
      // console.log('文件删除 file',file)
      // console.log('文件删除 fileList',fileList)
      if(file.id && this.handleFileRemove){
        return this.handleFileRemove(file.id);
        // return this.deleteApplyAttachment(file.id)
      }
    },
    // 文件删除
    handleRemove(file, fileList) {
      // console.log('文件删除 file',file)
      // console.log('文件删除 fileList',fileList)
      this.fileList = fileList.map(item => {
        // console.log(item, 3333333);
        if(item.id){
          return item;
        }else {
          let data = item.response.data||{};
          return {fileName: item.name, fileUrl: data.baseUrl||''}
          // return {fileName: item.name, fileUrl: item.response.data ? item.response.data.url : '',}
        }

        // if (item.id) {
        //   return {fileName: item.name, fileUrl: item.url,}
        // } else {
        //   return {fileName: item.name, fileUrl: item.response.data.url,}
        // }
        // if (item.url) {
        //   return {fileName: item.name, fileType: this.type, fileUrl: item.url, fileSize: item.size}
        // } else {
        //   return {fileName: item.name, fileType: this.type, fileUrl: item.response.data.url, fileSize: item.size}
        // }
      });
      // console.log('文件删除 this.fileList',this.fileList)
      this.$emit('update:totalFileList',this.fileList);
    },
    // 附件删除
    // deleteApplyAttachment(id){
    //   let params = {
    //     id:id
    //   }
    //   return this.$axiosPost(API.roomApply_deleteApplyAttachment, params).then(res => {
    //     if (res.status === 200) {
    //       this.$message({type: 'success', message: '删除成功！'});
    //     }
    //   })
    // },
    // 点击文件列表
    handlePreview(file) {
      // if (!this.downloadDom) {
      //   this.downloadDom = document.createElement('a');
      //   document.body.appendChild(this.downloadDom);
      // }
      // console.log(file, 111111);
      // this.downloadDom.download = file.name;
      // this.downloadDom.href = file.url ? file.url : file.response.data.url;
      // this.downloadDom.target = '_blank';
      // this.downloadDom.click();
    },
  }
}
</script>

<style lang="scss" scoped>
  #base-upload{
    .upload-btn-info{
      margin-left: 20px;
      color: #c0c4cc;
    }
  }
</style>