<template>
  <div></div>
</template>

<script>
export default {
  activated() {
    this.$store.dispatch('tokenActions', this.$route.query.token);
    this.getLoginInfo();
    this.$router.replace({ path: this.$route.query.jumpUrl });
    this.getParentId()
  },
  methods: {
    getLoginInfo() {
      let params = {
        token: this.$route.query.token
      }
      this.$axiosPost(API.user_detail, params).then(res => {
        this.$store.commit('realNameMutations', res.data.data.realName);
        this.$store.commit('isMajorMutations', res.data.data.major);
        this.$store.commit('organNameMutations', res.data.data.currentOrgName);
        this.$store.dispatch('areaIdActions', res.data.data.currentOrgAreaId);
        // this.$store.commit('areaIdMutations', res.userInfoDTO.userOrganRelationList[0].organInfoBase.areaId);
        this.$store.commit('loginOrganIdMutations', res.data.data.orgIds);
        // this.getAreaName(res.userInfoDTO.userOrganRelationList[0].organInfoBase.areaId)
      
        // if (res.userInfoDTO.currentOrganInfo) {
        //   this.$store.commit('organSpecificationMutations', res.userInfoDTO.currentOrganInfo.organSpecification);
        //   this.$store.commit('adminDivisionLevelMutations', res.userInfoDTO.currentOrganInfo.adminDivisionLevel);
        // }
        this.$store.dispatch('userIdActions', res.data.data.userId);
      })
    },
    //获取一级菜单的id
    getParentId(){
      let params = {
        token: this.$route.query.token,
        url: this.$route.query.jumpUrl
      }
      this.$axiosPost(API.resources_getDetail, params).then(res =>{
        this.$store.commit('navIdMutations', res.data.parentIdList[res.data.parentIdList.length-1]);
      })
    },
  }
}
</script>