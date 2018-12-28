"use strict";var qualityBaseData=new Vue({el:"#qualityBasedata",data:function(){return{selected:[],isAdd:!1,openModal:!1,loading:!0,reload:!1,isShow:!0,isCopy:!1,isEdit:!1,isSearchHide:!0,isTabulationHide:!0,isTabulationHide2:!0,isHide:!0,openTime:"",treeNodeId:"",confirmConfig:{showConfirm:!1,title:"提示",content:"请点击确认",onlySure:!0,success:!0},searchBody:{code:"",name:"",datatypeName:""},addBody:{id:null,code:"",name:"",status:1,describes:"",datatypeId:null,delStatus:1,organizationId:"",organizationName:"金大祥",datatypeName:""},body:{id:null,code:"",name:"",status:null,datatypeName:"",organizationId:1,datatypeId:null},data_config:{url:contextPath+"/baseDataController/list?organizationId="+window.parent.userInfo.organId,colNames:["数据编码","数据名称","状态"],colModel:[{name:"code",index:"code",align:"left",width:280},{name:"name",index:"name",width:280,align:"left"},{name:"status",index:"status",width:280,align:"left",formatter:function(a){return 1==a?"有效":"无效"}}],shrinkToFit:!0},nodes:[{id:1,pId:0,name:"质检基础数据类型",open:!0},{id:2,pId:1,name:"检验方法"},{id:3,pId:1,name:"检验依据"},{id:4,pId:1,name:"检验仪器"},{id:5,pId:1,name:"不良原因"},{id:6,pId:1,name:"缺陷等级"},{id:7,pId:1,name:"检测值"},{id:8,pId:1,name:"问题来源"}],setting:{data:{simpleData:{enable:!0,idKey:"id",pIdKey:"pId",rootPId:-1}},callback:{onClick:this.clickEvent}},hideSearch:function(){qualityBaseData.isHide=!qualityBaseData.isHide,qualityBaseData.isSearchHide=!qualityBaseData.isSearchHide,$(".chevron").css("top","")},hidTabulation:function(){qualityBaseData.isHide=!qualityBaseData.isHide,qualityBaseData.isTabulationHide=!qualityBaseData.isTabulationHide,qualityBaseData.isTabulationHide2=!qualityBaseData.isTabulationHide2,qualityBaseData.isTabulationHide?$(".chevron").css("top",""):$(".chevron").css("top","90%")},showTree:function(){console.log(1111111),qualityBaseData.isShow=!0,$(".ht-arrow").css("left","-60px"),$(".ht-list-area").css({width:"67%",left:"220px"}),$(".ivu-icon-chevron-right").css("color","#DCDCDC"),$(".ivu-icon-chevron-left").css("color","#49557F")},hideTree:function(){qualityBaseData.isShow=!1,$(".ht-arrow").css("left","-60px"),$(".ht-list-area").css({width:"80%",left:"75px"}),$(".ivu-icon-chevron-left").css("color","#DCDCDC"),$(".ivu-icon-chevron-right").css("color","#49557F")},statusList:[{label:"有效",value:1},{label:"无效",value:0}]}},methods:{clickEvent:function(a,t,e){var i=this.$ztree.getSelectedNodes();console.log(i),console.log(this.treeNodeId),qualityBaseData.addBody.datatypeId=e.id,0==e.id?qualityBaseData.body.datatypeId=null:qualityBaseData.body.datatypeId=e.id,this.search2()},save:function(){var a=this;if(setTimeout(function(){a.loading=!1,a.$nextTick(function(){a.loading=!0})},1e3),null==qualityBaseData.addBody.name||""==qualityBaseData.addBody.name)return this.$Modal.warning({title:"提示信息",content:"<p>数据名称不能为空，请输入！!</p>"}),void(qualityBaseData.openModal=!0);null==qualityBaseData.addBody.id&&0==qualityBaseData.isCopy&&$.ajax({type:"POST",url:contextPath+"/baseDataController/add",contentType:"application/json",dataType:"json",data:JSON.stringify(qualityBaseData.addBody),success:function(a){qualityBaseData.isAdd=!1,"100100"==a.code?(layer.alert("新增数据成功",{icon:1}),qualityBaseData.openModal=!1):layer.alert("新增数据失败",{icon:0}),qualityBaseData.search2(),qualityBaseData.isCopy=!1},error:function(a){alert(a)}}),null!=qualityBaseData.addBody.id&&1==qualityBaseData.isCopy&&(qualityBaseData.addBody.id=null,$.ajax({type:"POST",url:contextPath+"/baseDataController/add",contentType:"application/json",dataType:"json",data:JSON.stringify(qualityBaseData.addBody),success:function(a){qualityBaseData.isAdd=!1,"100100"==a.code?(layer.alert("复制数据成功",{icon:1}),qualityBaseData.openModal=!1):layer.alert("复制数据失败",{icon:0}),qualityBaseData.search2(),qualityBaseData.isCopy=!1},error:function(a){alert(a)}})),null!=qualityBaseData.addBody.id&&0==qualityBaseData.isCopy&&$.ajax({type:"POST",url:contextPath+"/baseDataController/update",contentType:"application/json",dataType:"json",data:JSON.stringify(qualityBaseData.addBody),success:function(a){qualityBaseData.isAdd=!1,"100100"==a.code?(layer.alert("修改数据成功",{icon:1}),qualityBaseData.openModal=!1):layer.alert("修改数据失败",{icon:0}),qualityBaseData.search2(),qualityBaseData.isCopy=!1},error:function(a){alert(a)}})},exit:function(){window.parent.closeCurrentTab({name:"质检基础数据",exit:!0,openTime:this.openTime})},back:function(){this.isAdd=!1,this.isCopy=!1,this.openModal=!1},refresh:function(){window.location.reload()},search:function(){qualityBaseData.selected.length=0,console.log(this.body),this.reload=!this.reload},search2:function(){console.log(this.body),this.reload=!this.reload},clear:function(){this.body={datatypeName:"",code:"",name:""}},addNewRow:function(){qualityBaseData.isCopy=!1;var a=window.parent.userInfo.organId,t=window.parent.userInfo.orgName,e=this.$ztree.getSelectedNodes(),i="";if(console.log(qualityBaseData.addBody),this.addBody={id:null,status:1,delStatus:1,datatypeName:"",code:"",name:"",describes:"",organizationName:""},0!=e.length&&(i=e[0].name),"质检基础数据类型"==i||0==e.length)return this.isAdd=!1,this.openModal=!1,void this.$Modal.warning({title:"提示信息",content:"<p>新增行仅能对具体数据类型进行操作，请选择一个具体类型！！</p>"});qualityBaseData.addBody.datatypeId=e[0].id,qualityBaseData.addBody.organizationId=a,qualityBaseData.addBody.organizationName=t,this.openModal=!0},copyOneRow:function(){qualityBaseData.$forceUpdate(),qualityBaseData.addBody.organizationId=window.parent.userInfo.organId,qualityBaseData.addBody.organizationName=window.parent.userInfo.orgName;var a=qualityBaseData.selected[0];a=parseInt(a),1!==qualityBaseData.selected.length?this.$Modal.warning({title:"提示信息",content:"<p>复制行仅能对单笔数据进行操作，请重新选择！！</p>"}):(qualityBaseData.isCopy=!0,$.ajax({type:"POST",url:contextPath+"/baseDataController/list?id="+a,contentType:"application/json",dataType:"json",success:function(a){qualityBaseData.addBody=a.data,qualityBaseData.addBody.code="系统自动生成",qualityBaseData.openModal=!0},error:function(a){alert(a)}}))},modifyOneRow:function(){qualityBaseData.addBody.organizationId=window.parent.userInfo.organId,qualityBaseData.addBody.organizationName=window.parent.userInfo.orgName,qualityBaseData.isCopy=!1,qualityBaseData.isAdd=!1,qualityBaseData.openModal=!1;var a=qualityBaseData.selected[0];a=parseInt(a);qualityBaseData.body.datatypeId;console.log(qualityBaseData.selected.length),1!==qualityBaseData.selected.length?this.$Modal.warning({title:"提示信息",content:"<p>修改行仅能对单笔数据进行操作，请重新选择！！</p>"}):$.ajax({type:"POST",url:contextPath+"/baseDataController/list?id="+a,contentType:"application/json",dataType:"json",success:function(a){qualityBaseData.addBody=a.data,qualityBaseData.openModal=!0,this.reload=!this.reload},error:function(a){alert(a)}})},deleteMultiRows:function(){var a=this;qualityBaseData.selected.length<1?this.$Modal.warning({title:"提示信息",content:"<p>请先选择至少一笔数据！!</p>"}):this.$Modal.confirm({title:"提示信息",content:"<p>是否要删除信息？</p>",onOk:function(){console.log(JSON.stringify(a.selected)),$.ajax({type:"POST",url:contextPath+"/baseDataController/delete",contentType:"application/json",data:JSON.stringify(qualityBaseData.selected),dataType:"json",success:function(a){"100100"==a.code?layer.alert("删除数据成功",{icon:1}):layer.alert("删除数据失败",{icon:0}),qualityBaseData.selected.length=0,qualityBaseData.search2()},error:function(a){layer.alert(a)}})},onCancel:function(){}})},setColumn:function(){}},mounted:function(){$("form").validate(),this.openTime=window.parent.params.openTime,$.ajax({contentType:"application/json;charset=utf-8",type:"post",url:contextPath+"/businessTypeService/list",dataType:"json",success:function(a){console.log(a);for(var t=a.data,e=[{id:1,pId:0,name:"质检基础数据类型",open:!0}],i=0;i<t.length;i++)e.push({id:t[i].id,pId:1,name:t[i].name});qualityBaseData.nodes=e;var o=window.parent.userInfo.organId;qualityBaseData.body.organizationId=o},error:function(){alert("服务器出错啦")}})}});