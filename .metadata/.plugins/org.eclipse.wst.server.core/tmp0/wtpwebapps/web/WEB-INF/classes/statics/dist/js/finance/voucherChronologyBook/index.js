"use strict";var _methods,_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function _defineProperty(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}var vmm=new Vue({el:"#check-voucher",data:function(){return{openTime:"",formData:{startVoucherDate:"2018-10",endVoucherDate:"2018-10",voucherGroupId:"",voucherNumberStr:"",audited:"",voucherStatus:!1,startAmmount:"",endAmmount:"",preparerName:"",currencyId:"",subjectCode:"",itemClassId:"",itemId:"",for15:"201802",for16:1,for17:"",for18:"",onSelectRowValue:""},subjectList:[],formDataList:[{label:"（空）",value:""},{label:"客户",value:1},{label:"部门",value:2},{label:"职员",value:3},{label:"仓库",value:4},{label:"供应商",value:5}],formAccountingTypeDataList:[{label:"（空）",value:""},{label:"客户",value:1},{label:"部门",value:2},{label:"职员",value:3},{label:"仓库",value:4},{label:"供应商",value:5}],formAccountingTypeDataList2:[{id:"",name:"全部"}],formVoucherDataList:[{id:"",name:"不限"}],formStatusDataList:[{id:"",name:"不限"},{id:2,name:"未审核"},{id:1,name:"已审核"}],formCurrencyDataList:[{id:"",currencyName:"所有币别"}],visible:!1,subjectVisable:!1,url:"../voucher-lrt/tree-duli.json",option:{},reload:!1,selected:[],insertVisible:!1,insertOkDisabled:!1,insertOkLoading:!1,attachmentVisible:!1,addAttachmentVis:!1,htClipShow:!1,addSearch:"",uploadExlVisible:!1,viewReportVisible:!1,isContinue:!1,voucherModelTxt:"",viewReportTxt:"",showVoucherVisible:!1,upload_config:{url:contextPath+"/voucherController/uploadVoucherByExcel",uploadType:"父级文件导入"},filterVisible:!1}},methods:(_methods={openFun:function(){this.filterVisible=!0},pageInit:function(){var i=this;jQuery("#grid").jqGrid({multiselect:!0,url:contextPath+"/voucherController/queryMechanismCertificate",datatype:"json",styleUI:"Bootstrap",postData:this.formData,width:"99%",autowidth:!0,mtype:"POST",jsonReader:{root:"rows",page:"page",total:"total",records:"records",repeatitems:!0,cell:"cell"},colNames:["日期","凭证字号","摘要","科目","币别","汇率","原币金额","借方金额","贷方金额","附件","制单人","审核人","操作","审核状态","机制凭证"],colModel:[{name:"date",index:"date",width:80,title:!1},{name:"mark",index:"mark",width:80,title:!1,formatter:function(e,t,o,a){return $(document).off("click",".mark"+t.rowId).on("click",".mark"+t.rowId,function(){i.edit(t.rowId),console.log(t.rowId)}),'<a class="mark'+t.rowId+'">'+e+"</a>"}},{name:"summary",index:"summary",width:120,sortable:!1,title:!1},{name:"subject",index:"subject",width:220,sortable:!1,title:!1},{name:"currencyName",index:"currencyName",width:100,align:"center",sortable:!1,title:!1},{name:"exchangeRate",index:"exchangeRate",width:80,align:"right",sortable:!1,title:!1},{name:"ammountFor",index:"ammountFor",width:100,align:"right",sortable:!1,title:!1},{name:"debit",index:"debit",width:100,align:"right",sortable:!1,title:!1,formatter:function(e,t,o,a){return null==e||0==e?"":accounting.formatNumber(e,2,",")}},{name:"credit",index:"credit",width:100,align:"right",sortable:!1,title:!1,formatter:function(e,t,o,a){return null==e||0==e?"":accounting.formatNumber(e,2,",")}},{name:"evidId",index:"evidId",width:50,sortable:!1,align:"center",title:!1,formatter:function(e,t,o,a){return $(document).off("click",".clip"+t.rowId).on("click",".clip"+t.rowId,function(e){i.htClipShow=!0,i.uploadImg(o,e.clientX,e.clientY)}),'<i class="ivu-icon ivu-icon-paperclip clip'+t.rowId+'"></i>'}},{name:"people",index:"people",width:85,sortable:!1,title:!1},{name:"auditor",index:"auditor",width:85,sortable:!1,title:!1},{name:"operate",index:"operate",width:80,sortable:!1,title:!1,formatter:function(e,t,o,a){return $(document).off("click",".edit"+t.rowId).on("click",".edit"+t.rowId,function(){i.edit(t.rowId)}),$(document).off("click",".del"+t.rowId).on("click",".del"+t.rowId,function(){i.del(t.rowId,o[13],o[14])}),$(document).off("click",".offset"+t.rowId).on("click",".offset"+t.rowId,function(){i.offset(t.rowId)}),'<a class="del'+t.rowId+'">删除</a>'}},{name:"audited",index:"audited",width:85,sortable:!1,title:!1,hidden:!0},{name:"systemId",index:"systemId",width:85,sortable:!1,title:!1,hidden:!0}],rowNum:10,viewrecords:!0,rowList:[10,20,50],pager:"#pager",height:$(window).height()-180,onSelectAll:function(e,t){i.handlerId(e,t)},onSelectRow:function(e,t){i.handlerId(e,t),i.formData.onSelectRowValue=e},ondblClickRow:function(e){var t=contextPath+"/finance/voucher-lrt/index.html?voucherId="+e+"&sobId=1";window.parent.activeEvent({name:"查看凭证",url:t,params:null})}})},uploadImg:function(e,t,o){$(".ht-clip").css({top:o+"px",left:t+"px",visible:!0})},clipClick:function(e){var t=(e=e||window.event).target||e.srcElement;"li"===t.nodeName.toLowerCase()&&(this.htClipShow=!1,"本地上传"===t.innerText?this.attachmentVisible=!0:this.addAttachmentVis=!0)},attachment:function(){this.attachmentVisible=!1},addAttachment:function(){this.addAttachmentVis=!1},getVoucher:function(){var t=[];$.ajax({type:"post",async:!1,url:contextPath+"/voucherController/initQueryVoucherFormData",data:null,success:function(e){null!=e.data&&(t=e.data)}}),this.formVoucherDataList=t.voucherGroupName.data,this.formVoucherDataList.splice(0,0,{id:"",name:"不限"}),this.formCurrencyDataList=t.currencyType.data,this.formCurrencyDataList.splice(0,0,{id:"",currencyName:"所有币别"});var e=t.currentAccountPeriod,o=t.currentAccountYear;this.subjectList=t.voucherDate,this.formData.startVoucherDate=o+"-"+e,this.formData.endVoucherDate=o+"-"+e},accountingType:function(e){var t=[];$.ajax({type:"post",data:{typeId:e},async:!1,url:contextPath+"/voucherController/typeResult",dataType:"json",success:function(e){t=e.data,console.log(t)},error:function(e){console.log(e)}}),this.formAccountingTypeDataList2=t,this.formAccountingTypeDataList2.splice(0,0,{id:"",name:"全部"})},add:function(){var e=contextPath+"/finance/voucher-lrt/index.html";window.parent.activeEvent({name:"新增凭证",url:e,params:null})},edit:function(e){var t=contextPath+"/finance/voucher-lrt/index.html?voucherId="+e+"&sobId=1";window.parent.activeEvent({name:"修改凭证",url:t,params:null})},exportExcel:function(){window.open(baseURL+"voucherController/exportExcelVoucher?startVoucherDate="+this.formData.startVoucherDate+"&endVoucherDate="+this.formData.endVoucherDate)},audit:function(e){var t=this.selected.length;t?1<t?this.$Message.info("请选择一条审核的数据"):this.auditPost(e,1,1):this.$Message.info("请先选择要审核的数据")},antiAudit:function(){var e=this.selected.length,t=this.formData.onSelectRowValue;e?1<e?this.$Message.info("请选择一条反审核的数据"):this.auditPost(t,2,1):this.$Message.info("请先选择要反审核的数据")},auditPost:function(e,t,o){var a=this;$.ajax({type:"post",data:{voucherId:e,type:t,sobId:o},url:contextPath+"/finance/voucherController/approval",dataType:"json",success:function(e){"100100"==e.code?(a.tableReload(),layer.alert("操作成功")):null==e?layer.alert("操作失败，系统异常"):layer.alert(e.msg)},error:function(e){alert("操作失败")}})},del:function(e,t,o){var a=this;this.$Modal.confirm({title:"系统提示",content:"<p>确认要删除所选数据？该操作是物理删除，数据不可还原！</p>",onOk:function(){1!=t?a.del_data(e):a.$Message.error("不允许删除已审核凭证")},onCancel:function(){a.$Message.info("取消删除")}})},deleteBatch:function(e){var t=this;e.length?this.$Modal.confirm({title:"系统提示",content:"<p>确认要删除所选数据？该操作是物理删除，数据不可还原！</p>",onOk:function(){t.delList(1,e)},onCancel:function(){t.$Message.info("取消删除")}}):this.$Message.info("请先选择要删除的数据")},del_data:function(e){var t=this,o=contextPath+"/voucherController/deleteMechanismVoucher";$.ajax({type:"post",data:{sobId:1,voucherId:e},url:o,dataType:"json",success:function(e){"100100"==e.code?(t.$Message.info(e.msg),t.tableReload()):t.$Message.error(e.msg)},error:function(e){console.log(e),t.$Message.error("删除失败!")}})},delList:function(e,t){var o=this;$.ajax({type:"post",data:{sobId:e,ids:t},url:contextPath+"/voucherController/deleteMechanismVoucherBatch",dataType:"json",success:function(e){"100100"===e.code&&(o.showVoucher(!0),o.voucherModelTxt=e.data.resultData,o.viewReportTxt=e.data.detailResult,o.tableReload())},error:function(e){console.log(e),o.$Message.error("删除凭证失败")}})},offset:function(e){$.ajax({type:"post",data:{voucherId:e,sobId:1},url:contextPath+"/voucherController/writeOff",dataType:"json",success:function(e){"100100"==e.code?(alert(e.msg),this.tableReload()):alert(e.msg)},error:function(e){alert("操作失败")}})},sort:function(){var o=this;$.ajax({type:"post",url:contextPath+"/voucherController/sort",dataType:"json",success:function(e){var t=e.msg;"100100"==e.code?(alert(t),o.tableReload()):alert(t)},error:function(e){alert("操作失败")}})},handlerId:function(e,t){if("object"===(void 0===e?"undefined":_typeof(e))&&t&&(this.selected=e),"object"!==(void 0===e?"undefined":_typeof(e))||t||(this.selected=[]),"string"==typeof e)if(t)!(-1<this.selected.indexOf(e.toString()))&&this.selected.push(e.toString());else{var o=this.selected.indexOf(e.toString());-1<o&&this.selected.splice(o,1)}},iconPopup:function(){this.subjectVisable=!0},getSubject:function(e){this.formData.subjectCode=e.subjectCode},modelClick:function(){this.$refs.filter.visible=!0},subjectClose:function(){this.subjectVisable=!1},scheduleShow:function(){var e=this.formData.startVoucherDate.split("-"),t=this.formData.endVoucherDate.split("-");return e[0]+"年第"+e[1]+"期 至 "+t[0]+"年第"+t[1]+"期"},save:function(){$("#grid").jqGrid("setGridParam",{postData:this.formData}).trigger("reloadGrid"),this.cancel(1)},more:function(){this.visible=!0},nomore:function(){this.visible=!1},cancel:function(e){switch(e){case 1:this.filterVisible=!1;break;case 2:this.insertVisible=!1}},getReload:function(){this.reload=!1},insert:function(){if(this.formData.for17)if(this.formData.for18){var t=this,o="./insert.json";$.ajax({type:"post",data:"",url:o,dataType:"json",success:function(e){t.$Modal.confirm({title:"系统提示",content:"<p>"+e.data.msg+"</p>",onCancel:function(){},onOk:function(){$.ajax({type:"post",data:"",url:o,dataType:"json",success:function(e){t.tableReload(),t.insertVisible=!1},error:function(e){console.log(e),t.$Message.error(e.msg)}})}})},error:function(e){console.log(e),t.$Message.error(e.msg)}})}else this.$Message.error("请输入您要移动的具体位置！");else this.$Message.error("请输入您要移动的凭证号！")},uploadExlModal:function(e){console.log(e),this.uploadExlVisible=e},dropMore:function(e){switch(e){case"antiAudit":this.antiAudit();break;case"import":this.uploadExlModal("true");break;case"batchDel":console.log(this.selected),this.deleteBatch(this.selected);break;case"batchAudit":console.log(this.selected),this.batchAudit(this.selected,1);break;case"batchCounterAudit":console.log(this.selected),this.batchAudit(this.selected,2)}},batchAudit:function(e,t){var o=this,a="";a=1===t?"请先选择要审核的数据":"请先选择要反审核的数据",e.length?$.ajax({type:"post",data:{ids:e,type:t},url:contextPath+"/voucherController/approvalBatch",dataType:"json",success:function(e){"100100"===e.code&&(o.showVoucher(!0),o.voucherModelTxt=e.data.resultData,o.viewReportTxt=e.data.detailResult,o.tableReload())},error:function(e){console.log(e),o.$Message.error("删除凭证失败")}}):o.$Message.info(a)},closeWindow:function(){window.parent.closeCurrentTab({name:"核销单",openTime:this.openTime,url:this.openTime,exit:!0})}},_defineProperty(_methods,"iconPopup",function(){this.subjectVisable=!0,$(".v-transfer-dom .ivu-modal-wrap").css({"z-index":1070})}),_defineProperty(_methods,"showVoucherVisibleClose",function(){this.tableReload()}),_defineProperty(_methods,"showVoucher",function(e){this.showVoucherVisible=e}),_defineProperty(_methods,"showViewReport",function(e){this.viewReportVisible=!this.viewReportVisible}),_defineProperty(_methods,"accordingAction",function(){this.showVoucher(!1),this.tableReload()}),_defineProperty(_methods,"tableReload",function(){this.selected=[],$("#grid").jqGrid("setGridParam",{postData:this.formData}).trigger("reloadGrid")}),_methods),watch:{},computed:{},created:function(){this.getVoucher()},mounted:function(){this.pageInit(),this.openTime=window.parent.params&&window.parent.params.openTime}});