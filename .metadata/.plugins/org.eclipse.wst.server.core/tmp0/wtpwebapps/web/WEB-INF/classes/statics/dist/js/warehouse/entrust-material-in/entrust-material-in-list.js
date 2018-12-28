"use strict";var vm=new Vue({el:"#entrustMaterialInList",data:{openTime:"",isShow:!1,isEdit:!1,reload:!1,isSearchHide:!0,isTabulationHide:!0,selectRowData:[],selected:"",documentTimeArr:[],categoryType:[],productId:"",body:{documentNo:"",customCode:"",goodsTypeName:"",startTime:"",endTime:"",custId:""},custList:[],entrustMaterialIn:{id:"",documentNo:"",documentStatus:""},modalTrigger:!1,modalType:"",stepList:[],data_config:{url:contextPath+"/entrustMaterialInController/list",datatype:"json",colNames:["id","组织id","日期","单据编号","单据状态","客户","商品类型","商品总数量","商品总重量"],colModel:[{name:"id",index:"id",hidden:!0},{name:"organizationId",index:"organizationId",hidden:!0},{name:"documentTime",width:210,align:"left",formatter:function(t){return t?new Date(t).format("yyyy-MM-dd"):""}},{name:"documentNo",width:210,align:"left",formatter:function(t,e,n,a){return $(document).off("click",".updateDetail"+t).on("click",".updateDetail"+t,function(){vm.updateDetail({value:t,grid:e,rows:n,state:a})}),'<a class="updateDetail'+t+'">'+t+"</a>"},unformat:function(t,e,n){return t.replace(/(<\/?a.*?>)/g,"")}},{name:"documentStatus",width:210,align:"left",formatter:function(t,e,n,a){return 1===t?"暂存":2===t?"待审核":3===t?"审核中":4===t?"已审核":5===t?"驳回":""},unformat:function(t,e,n){return"暂存"===t?1:"待审核"===t?2:"审核中"===t?3:"已审核"===t?4:"驳回"===t?5:""}},{name:"custName",width:210,align:"left"},{name:"goodsTypeName",align:"left",width:210},{name:"number",align:"left",width:210},{name:"weight",align:";left",width:210}],rowNum:5,rowList:[10,20,30],mtype:"post",viewrecords:!0}},methods:{refresh:function(){this.reload=!this.reload,this.selected=""},clear:function(){var t=this;console.log("点击了清空"),this.body.documentNo="",this.body.customCode="",this.body.goodsTypeName="",this.body.startTime="",this.body.endTime="",this.documentTimeArr&&this.$nextTick(function(){t.documentTimeArr=[]}),this.productId&&this.$nextTick(function(){t.productId=[]}),this.body.custId&&(this.$refs.custId.reset(),this.$nextTick(function(){t.body.custId=""}))},search:function(){console.log("点击了搜索"),this.refresh()},approval:function(t){var e=this;return console.log(e.selected),ht.util.hasValue(e.selected,"array")?1<e.selected.length?(e.$Message.warning("只能选择一条记录!"),!1):(e.entrustMaterialIn.id=e.selected[0].id,e.entrustMaterialIn.documentNo=e.selected[0].documentNo,e.entrustMaterialIn.documentStatus=e.selected[0].documentStatus,e.modalType="approve",void(e.modalTrigger=!e.modalTrigger)):(e.$Message.warning("请先选择一条记录!"),!1)},reject:function(t){var e=this;return ht.util.hasValue(e.selected,"array")?1<e.selected.length?(e.$Message.warning("只能选择一条记录!"),!1):(e.entrustMaterialIn.id=e.selected[0].id,e.entrustMaterialIn.documentNo=e.selected[0].documentNo,e.entrustMaterialIn.documentStatus=e.selected[0].documentStatus,e.modalType="reject",void(e.modalTrigger=!e.modalTrigger)):(e.$Message.warning("请先选择一条记录!"),!1)},approvalOrRejectCallBack:function(t){"100100"==t.result.code&&(this.entrustMaterialIn.documentStatus=parseInt(t.result.data),this.refresh())},autoSubmitOrReject:function(){var e=this;$.ajax({url:contextPath+"/entrustMaterialInController/submitApproval?submitType=1",method:"post",contentType:"application/json;charset=utf-8",data:JSON.stringify({receiptsId:e.entrustMaterialIn.documentNo,approvalResult:"reject"===e.modalType?1:0}),success:function(t){"100100"===t.code?e.entrustMaterialIn.documentStatus=parseInt(t.data):e.$Modal.warning({content:t.msg}),this.refresh()}})},updateStatus:function(t,e,n,a){var o=this;$.ajax({type:"post",url:contextPath+"/entrustMaterialInController/update",contentType:"application/json;charset=utf-8",data:JSON.stringify({id:t,documentStatus:e,documentNo:n}),dataType:"json",success:function(t){if("100100"===t.code)return o.entrustMaterialIn.documentStatus=e,1===a&&o.$Modal.info({content:"提交成功!",title:"提示"}),o.refresh(),!1;1===a&&o.$Modal.warning({content:"提交失败!",title:"提示"})},error:function(){o.$Message.error("服务器出错啦")}})},add:function(){window.parent.activeEvent({name:"新增受托加工材料入库单",url:contextPath+"/warehouse/entrust-material-in/entrust-material-in-info.html",params:{type:0}})},submit:function(){var r=this;return ht.util.hasValue(r.selected,"array")?1<r.selected.length?(r.$Message.warning("只能选择一条记录!"),!1):1!==r.selected[0].documentStatus?(r.$Modal.warning({content:"受托加工材料入库单已提交!",title:"提示"}),!1):void $.ajax({type:"POST",url:contextPath+"/entrustMaterialInController/getEntrustMaterialIn",data:JSON.stringify({id:r.selected[0].id}),contentType:"application/json;charset=utf-8",dataType:"json",success:function(t){if("100100"===t.code){if(!t.data.documentTime||!t.data.customCode||!t.data.custId)return r.$Modal.warning({content:"请输入必填项!",title:"提示"}),!1;var e=t.data.goodList;if(!ht.util.hasValue(e,"array"))return r.$Modal.warning({content:"请输入必填项!",title:"提示"}),!1;var n=e.filter(function(t){return!(t.goodsNo&&t.number&&t.weight&&t.warehouseId)});if(ht.util.hasValue(n,"array"))return r.$Modal.warning({content:"请输入必填项!",title:"提示"}),!1;var a=e.filter(function(t){return t.goodlist&&0===t.goodlist.length});if(a&&0<a.length)return r.$Modal.warning({content:"请输入必填项!",title:"提示"}),!1;var o=[];return t.data.goodList&&(t.data.goodList.filter(function(t){return t.collectGoodId}).forEach(function(t){o.push(t.collectGoodId)}),ht.util.hasValue(o,"array"))?r.checkIsSubmit(o,r.selected):r.updateStatus(r.selected[0].id,2,r.selected[0].documentNo,1),!1}r.$Message.error("系统异常!")}}):(r.$Message.warning("请先选择一条记录!"),!1)},checkIsSubmit:function(t,e){var n=this;$.ajax({type:"post",url:contextPath+"/entrustMaterialInController/queryStorageStatus",data:JSON.stringify(t),contentType:"application/json",dataType:"json",error:function(){n.$Message.error("服务器出错啦")}}).then(function(t){"100100"===t.code&&(0===t.data?n.updateStatus(e[0].id,2,e[0].documentNo,1):n.$Modal.info({content:"商品已提交，请勿重复提交!",title:"提示"}))})},update:function(){var t=this;return ht.util.hasValue(t.selected,"array")?1<t.selected.length?(t.$Message.warning("只能选择一条记录!"),!1):void window.parent.activeEvent({name:"修改受托加工材料入库单",url:contextPath+"/warehouse/entrust-material-in/entrust-material-in-info.html",params:{data:t.selected[0].id,type:1}}):(t.$Message.warning("请先选择一条记录!"),!1)},updateDetail:function(t){console.log(t.value),window.parent.activeEvent({name:"查看受托加工材料入库单",url:contextPath+"/warehouse/entrust-material-in/entrust-material-in-info.html",params:{data:t.value,type:2}})},del:function(){var o=this;if(!ht.util.hasValue(o.selected,"array"))return this.$Message.warning("请先选择一条记录!"),!1;this.$Modal.confirm({title:"提示",content:"是否删除该条信息？",onOk:function(){var e=[],n=[],a=[];o.selected.forEach(function(t){1!==t.documentStatus&&e.push(t.documentNo),t.organazationId!==window.parent.userInfo.organId&&n.push(t.documentNo),a.push(t.id)});var t="";if(0<e.length)return t="单据编号为["+e.join(",")+"]的单据不可删除,已启用审批!",o.$Message.warning({content:t,duration:3,closable:!0}),o.refresh(),!1;$.ajax({type:"POST",url:contextPath+"/entrustMaterialInController/delete",data:JSON.stringify(a),dataType:"json",contentType:"application/json; charset=utf-8",success:function(t){console.log(t.data),"100100"===t.code&&(0<t.data?o.$Message.info("删除成功!"):o.$Message.error("删除失败!"),o.refresh())},error:function(t){o.$Message.error("服务器出错")}})},onCancel:function(){console.log("点击了取消")}})},exit:function(){window.parent.closeCurrentTab({name:"受托加工材料入库单-列表",exit:!0,openTime:this.openTime})},changeDate:function(t){this.body.startTime=t[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=t[1].replace(/\//g,"-")+" 23:59:59"},loadProductType:function(){var e=this;$.ajax({type:"post",url:contextPath+"/entrustMaterialInController/queryStyleCategory",dataType:"json",success:function(t){e.categoryType=e.initGoodCategory(t.data.cateLists)},error:function(){alert("服务器出错啦")}})},changeproductTypeName:function(t,e){this.body.customCode=e[e.length-1].value,this.body.goodsTypeName=e[e.length-1].label,console.log(this.selected,333333)},initGoodCategory:function(t){var o=this,r=[];return t.forEach(function(t){var e=t.customCode,n=t.name,a=t.cateLists;a&&(a=o.initGoodCategory(a)),r.push({value:e,label:n,children:a})}),r.forEach(function(t){t.children||delete t.children}),r},getCust:function(){var e=this;$.ajax({type:"post",url:contextPath+"/entrustMaterialInController/queryAllCustomer",contentType:"application/json",dataType:"json",success:function(t){console.log("客户",t),e.custList=t.data},error:function(){alert("服务器出错啦")}})}},mounted:function(){this.loadProductType(),this.getCust(),this.openTime=window.parent.params.openTime}});