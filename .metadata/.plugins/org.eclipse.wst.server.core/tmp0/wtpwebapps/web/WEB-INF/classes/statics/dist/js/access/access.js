"use strict";function _defineProperty(e,i,s){return i in e?Object.defineProperty(e,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[i]=s,e}var eventHub=new Vue,successNum=0,accessVm=new Vue({el:"#acccess-info",data:function(){var e;return _defineProperty(e={isSearchHide:!0,isTabulationHide:!0,isHide:!0,showModal:!1,selectOrginId:[],columns:[{type:"selection",width:60,align:"center"},{title:"组织名称",key:"orgName"}],colContent:[],logUrl:"",codeEdit:!1,isEdit:!1,isShow:!0,reload:!1,selected:[],regidate:"",sCode:"",sName:"",sAbb:"",sLevel:"",smPro:"",spType:"",sType:"",sPay:"",sCurrency:"",sbilling:"",isChecked:"",isSave:!0,isInfo:!0,access:{id:"",status:"1",sysFile:{fileId:"",fileType:3,boeType:"",boeId:"",fileDetails:[]}},confirmConfig:{showConfirm:!1,title:"提示",content:"这是内容",onlySure:!0,success:!0},const:{STATUS_YES:1,STATUS_NO:0,IS_DEL_YES:0,IS_DEL_NO:1,IS_DEFAULT_YES:1,IS_DEFAULT_NO:0,SUCCESS_CODE:"100100"},openTime:""},"isChecked",1),_defineProperty(e,"uploadedFiles",[{fileName:"银行卡复印件.jpg",fileSize:"34KB",uploader:"zhangsan",uploadTime:"2018-06-01"},{fileName:"身份证复印件.jpg",fileSize:"34KB",uploader:"zhangsan",uploadTime:"2018-06-01"}]),_defineProperty(e,"mainProdArr",[]),_defineProperty(e,"supplierLevel",""),_defineProperty(e,"supplierType",""),_defineProperty(e,"mainProd",""),_defineProperty(e,"prodType",""),_defineProperty(e,"option",[{label:"aaaa",value:"bbbb"}]),_defineProperty(e,"areaInit",{isInit:!1,province:"",city:"",county:"",detail:"",disabled:!1}),_defineProperty(e,"showUpload",!1),e},created:function(){var s=this;eventHub.$on("isEdit",function(e){s.isShow="Y"==e?!(s.isEdit=!0):!(s.isEdit=!1)}),eventHub.$on("queryFile",function(e,i){s.getAccess(e,i)}),eventHub.$on("saveFile",function(e,i){s.saveAccess(e,i)})},methods:{validate:function(){},handleSuccess:function(e,i){e.code==accessVm.const.SUCCESS_CODE?accessVm.addAttachment(i,e.data[0]):layer.alert(e.msg)},handleFormatError:function(e){this.$Notice.warning({title:"文件格式异常!",desc:"File format of "+e.name+" is incorrect, please select jpg or png."})},handleMaxSize:function(e){this.$Notice.warning({title:"文件大小超出限制!",desc:"【"+e.name+"】的大小超过2M"})},handleBeforeUpload:function(){},modalOk:function(){this.showUpload=!1},modalCancel:function(){},initOrgin:function(){},hideSearch:function(){this.isHide=!this.isHide,this.isSearchHide=!this.isSearchHide,$(".chevron").css("top","")},hidTabulation:function(){this.isHide=!this.isHide,this.isTabulationHide=!this.isTabulationHide,this.isTabulationHide?$(".chevron").css("top",""):$(".chevron").css("top","84%")},showOrgin:function(){0!=this.selected.length?this.showModal=!0:layer.alert("请选择行!")},okModel:function(){},cancelModel:function(){this.selectOrginId=[],this.$refs.test.selectAll(!1),this.showModal=!1},changeselect:function(e){},search:function(){this.body.supplierLevel=""==this.supplierLevel?null:this.supplierLevel.join(","),this.body.supplierType=""==this.supplierType?null:this.supplierType.join(","),this.body.mainProd=""==this.mainProd?null:this.mainProd.join(","),this.reload=!this.reload},clear:function(){this.$refs.mainProd.selectMore=[],this.$refs.supplierLevel.selectMore=[],this.$refs.supplierType.selectMore=[],this.body={supplierName:"",supplierCode:"",contact:"",status:"",supplierLevel:"",supplierType:"",mainProd:""},this.supplierLevel="",this.supplierType="",this.mainProd="",this.reload=!this.reload},reload:function(){},loadSupplierLevels:function(){$.ajax({})},loadCurrency:function(){},loadMainProducts:function(){},alertMsg:function(e,i){this.confirmConfig={showConfirm:!0,title:"提示",content:e,onlySure:i,success:!0}},exitTab:function(){this.$refs.upload.clearFiles(),this.isEdit=!1,$("form").validate().resetForm()},delFile:function(e){layer.confirm("是否要删除这条信息!",{btn:["确定","取消"]},function(){e.del=!0,layer.closeAll("dialog")})},addAttachment:function(e,i){var s={fdName:e.name,fdSize:(e.size/1024).toFixed(2)+"kb",uploadTime:i.uploadTime,uploadUser:i.uploadUser,fdUrl:i.fdUrl,fdType:2,del:!1};accessVm.access.sysFile.fileDetails.push(s)},download:function(i){if(!i.fdUrl)return layer.alert("文件地址为空!请先上传文件!"),!1;var s=[];Object.keys(i).forEach(function(e){return s.push(e+"="+i[e])});var e=contextPath+"/fileAccess/download?"+s.join("&");location.href=encodeURI(e)},uploadfile:function(){console.log("执行了");this.showUpload=!0,accessVm.showUpload=!0},goBack:function(){this.isInfo=!1,this.access={contacts:[],bankCardInfos:[],supplierProds:[],status:"1",sysFile:{fileId:"",fileType:3,fileDetails:[]}}},confirmSure:function(){console.log("点击了sure"),this.confirmConfig.showConfirm=!1},confirmCancel:function(){console.log("点击了取消"),this.confirmConfig.showConfirm=!1},pageGridInit:function(e){this.logUrl=contextPath+"supplierlog/list?nd="+(new Date).getTime()+"&supplierId="+e},exit:function(){window.parent.closeCurrentTab({exit:!0,openTime:this.openTime})},saveAccess:function(e,i){var s={boeId:e,boeType:i,fileDetails:[]};s.fileDetails=accessVm.access.sysFile.fileDetails,$.ajax({url:contextPath+"/fileAccess/saveSysFile",dataType:"json",async:!1,data:JSON.stringify(s),contentType:"application/json;charset=utf-8",method:"post",success:function(e){e.code===accessVm.const.SUCCESS_CODE?null!=e.data&&null!=e.data.fileDetails&&(accessVm.access.sysFile=e.data):alert("附件保存失败")},error:function(e){console.log(e)}})},getAccess:function(e,i){var s={boeId:e,boeType:i};$.ajax({url:contextPath+"/fileAccess/getByBoe",dataType:"json",async:!1,data:JSON.stringify(s),contentType:"application/json;charset=utf-8",method:"post",success:function(e){e.code===accessVm.const.SUCCESS_CODE?null!=e.data&&null!=e.data.fileDetails&&(accessVm.access.sysFile=e.data):alert("附件加载失败")},error:function(e){console.log(e)}})}},watch:function(){}});