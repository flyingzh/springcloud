"use strict";var inspectionlistVm=new Vue({el:"#inspection-itemlist",data:function(){return{openTime:"",isSearchHide:!0,isTabulationHide:!0,isHide:!0,modalTrigger:!1,modalType:"",stepList:[],approvalTableData:[],checkbox:[],data:[],itemstatusList:[],inspectionItem:{id:0,code:"",name:"",idList:"",testItemStatus:""},inspectionItemInfo:{id:0,code:"",testItemStatus:""},dataModel:[],checkList:[],reload:!1,checkPresent:[],isDxfx:!1,isQtfx:!1,isbet:!1,upperLimitDisable:!1,lowerLimitDisable:!1,upperCommDiffDisable:!1,lowerCommDiffDisable:!1,productList:[{tableId:"",pid:"",name:"",selected:[],data:[]}],statusMap:{tmp_save:"zc",await_check:"dsh",checking:"jyshz",auditing:"jyysh",reject:"bh"},canRejectWhenAudit:!0}},methods:{approval:function(t){var e=this,a=this.getSelectedRows();return ht.util.hasValue(a,"array")?1<a.length?(e.$Message.warning("只能选择一条记录!"),!1):(e.inspectionItemInfo.id=a[0].id,e.inspectionItemInfo.code=a[0].code,e.inspectionItemInfo.testItemStatus=a[0].testItemStatus,e.modalType="approve",void(e.modalTrigger=!e.modalTrigger)):(e.$Message.warning("请先选择一条记录!"),!1)},reject:function(t){var e=this,a=this.getSelectedRows();return ht.util.hasValue(a,"array")?1<a.length?(e.$Message.warning("只能选择一条记录!"),!1):(e.inspectionItemInfo.id=a[0].id,e.inspectionItemInfo.code=a[0].code,e.inspectionItemInfo.testItemStatus=a[0].testItemStatus,e.modalType="reject",void(e.modalTrigger=!e.modalTrigger)):(e.$Message.warning("请先选择一条记录!"),!1)},approvalOrRejectCallBack:function(t){"100100"==t.result.code&&(this.inspectionItemInfo.testItemStatus=parseInt(t.result.data),this.refresh())},autoSubmitOrReject:function(){var e=this;$.ajax({url:contextPath+"/testItemController/submitApproval?submitType=1",method:"post",contentType:"application/json;charset=utf-8",data:JSON.stringify({receiptsId:e.inspectionItemInfo.code,approvalResult:"reject"===e.modalType?1:0}),success:function(t){"100100"===t.code?e.inspectionItemInfo.testItemStatus=parseInt(t.data):e.$Modal.warning({content:t.msg}),this.refresh()}})},hideSearch:function(){this.isHide=!this.isHide,this.isSearchHide=!this.isSearchHide,console.log(this.isTabulationHide),$(".chevron").css("top","")},hidTabulation:function(){this.isHide=!this.isHide,this.isTabulationHide=!this.isTabulationHide,this.isTabulationHide?$(".chevron").css("top",""):$(".chevron").css("top","97%")},productShow:function(t){console.log(t);this.checkbox=t,console.log(this.checkbox)},refresh:function(){this.checkbox=[],this.inspectionItem={};var t={idList:this.getCheckedIds()};this.loadTestItemData(t)},addItem:function(){this.isEdit=!0,window.parent.activeEvent({name:"新增检验项目",url:contextPath+"/quality/quality/inspection-item.html",params:{data:"zc",type:0}})},copyData:function(){var t=this.getSelectedRows();return ht.util.hasValue(t,"array")?1<t.length?(layer.alert("只能选择一条记录!"),!1):void window.parent.activeEvent({name:"新增检验项目",url:contextPath+"/quality/quality/inspection-item.html",params:{data:t[0].id,sysFileId:t[0].sysFileId,prop:"copy",type:0}}):(layer.alert("请先选择一条记录!"),!1)},submit:function(){var e=this,a=this.getSelectedRows();return ht.util.hasValue(a,"array")?1<a.length?(layer.alert("只能选择一条记录!"),!1):void $.ajax({type:"POST",url:contextPath+"/testItemController/getTestItem",data:JSON.stringify({id:a[0].id}),contentType:"application/json",dataType:"json",success:function(t){return""===t.data.name||0===t.data.productId||0===t.data.bugRankId||""===t.data.analyseMethod||""===t.data.qualityStandardStatus||""===t.data.goalValue||""===t.data.sampleType?(layer.alert("请输入必填项!"),!1):"zc"!==a[0].testItemStatus?(layer.alert("检验项目已提交!"),!1):(e.inspectionItem.id=a[0].id,e.inspectionItem.testItemStatus="dsh",e.inspectionItem.code=a[0].code,e.saveMethod(),void layer.alert("提交成功!"))}}):(layer.alert("请先选择一条记录!"),!1)},modifyData:function(){var t=this.getSelectedRows();return ht.util.hasValue(t,"array")?1<t.length?(layer.alert("只能选择一条记录!"),!1):void window.parent.activeEvent({name:"修改检验项目",url:contextPath+"/quality/quality/inspection-item.html",params:{id:t[0].id,sysFileId:t[0].sysFileId,data:t[0].id,prop:"bh",type:1}}):(layer.alert("请先选择一条记录!"),!1)},deleteData:function(){var o=this,t=this.getSelectedRows();if(!ht.util.hasValue(t,"array"))return layer.alert("请先选择一条记录!"),!1;$.ajax({type:"POST",url:contextPath+"/testItemController/deleteByOneOrBatch",data:JSON.stringify(t),dataType:"json",contentType:"application/json; charset=utf-8",success:function(t){if(console.log(t.data),"100100"===t.code){if(console.log(t.data.delete.length),!$.isEmptyObject(t.data)){var e="单据";if(0===t.data.notDelete.length)e="";else{for(var a=0;a<t.data.notDelete.length;a++)e+="["+t.data.notDelete[a].code+"]、";e=e.substring(0,e.length-1),e+="删除失败（单据已启用审批流，无法删除！）"}var i="单据";if(0===t.data.delete.length)i="";else{for(var s=0;s<t.data.delete.length;s++)i+="["+t.data.delete[s].code+"]、";i=i.substring(0,i.length-1),i+="删除成功。"}var n=e+"<br>"+i;layer.alert(n),o.refresh()}return!1}layer.alert("删除失败"),o.refresh()},error:function(t){layer.alert("服务器出错")}})},getSelectedRows:function(){for(var t=this,e=[],a=[],i=0;i<t.productList.length;i++)if(!$.isEmptyObject(t.productList[i].selected))for(var s=t.productList[i].selected,n=0;n<s.length;n++){var o=$("#"+t.productList[i].tableId).jqGrid("getRowData",s[n]);a.push(o),e.push(s[n])}return console.log(a),a},saveMethod:function(){var e=this;$.ajax({type:"POST",url:contextPath+"/testItemController/update",contentType:"application/json",data:JSON.stringify(e.inspectionItem),dataType:"json",success:function(t){e.refresh(),console.log("修改成功")},error:function(t){layer.alert("服务器出错")}})},setColumn:function(){},exit:function(){window.parent.closeCurrentTab({name:"检验项目",exit:!0,openTime:this.openTime})},search:function(){var t="";console.log(this.checkbox);for(var e=0;e<this.checkbox.length;e++)t+=this.checkbox[e]+",";t=t.substring(0,t.length-1),this.inspectionItem.idList=t,this.loadTestItemData(this.inspectionItem)},loadTestItemData:function(t){var s=this;$.ajax({type:"post",url:contextPath+"/testItemController/list",data:t,dataType:"json",success:function(t){$.isEmptyObject(t.data)&&layer.alert("搜索结果：无数据"),s.productList=[];for(var e=0;e<s.checkList.length;e++)for(var a in t.data)if("tab"+s.checkList[e].pid===a){var i=Object.assign({},{tableId:"testItem"+e,data:t.data[a],name:s.checkList[e].name,pid:s.checkList[e].pid});s.productList.push(i),console.log(s.productList)}},error:function(){layer.alert("服务器出错啦")}})},clear:function(){this.refresh()},loadProductType:function(){var i=this;$.ajax({type:"post",url:contextPath+"/testItemController/getProcessType",data:{parentId:1,isDel:1},dataType:"json",success:function(t){var e=t.data;i.productList.length=0,i.checkList=[];for(var a=0;a<e.length;a++)i.checkList.push({name:e[a].name,pid:e[a].id})},error:function(){layer.alert("服务器出错啦")}})},getCheckedIds:function(){for(var t="",e=0;e<this.checkList.length;e++)t+=this.checkList[e].pid+",";return t=t.substring(0,t.length-1)}},mounted:function(){this.openTime=window.parent.params.openTime,this.loadProductType();var t={idList:this.getCheckedIds()};this.loadTestItemData(t),this.itemstatusList=getCodeList("root_zj_jyxm_jyxmzt")}});