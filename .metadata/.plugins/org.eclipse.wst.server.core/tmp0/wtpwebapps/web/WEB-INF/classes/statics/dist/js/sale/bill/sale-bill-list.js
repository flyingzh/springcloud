"use strict";var saleBill=new Vue({el:"#sale-bill-list",data:function(){var o=this;return{modalTrigger:!1,modalType:"",stepList:[],openName:"",isShow:!1,isEdit:!1,reload:!1,openTime:"",isHideSearch:!0,isHideList:!0,isHide:!0,selected:[],dataValue:[],saleBillEntity:{documentStatus:"",documentNo:""},body:{documentNo:"",custName:"",startTime:"",endTime:"",isDel:1},addBody:{},data_config:{url:contextPath+"/saleBillController/list",colNames:["id","日期","单据编号","单据状态","客户","备注","上单累计应收款","本单应收款","累计应收款"],colModel:[{name:"id",index:"id",hidden:!0},{name:"createTime",index:"createTime",width:240,align:"left",formatter:function(t,e,n,i){return new Date(t).format("yyyy-MM-dd")}},{name:"documentNo",index:"documentNo",width:250,align:"left",formatter:function(t,e,n,i){var a=".detail"+t;return $(document).off("click",a).on("click",a,function(){o.detailClick({value:t,grid:e,rows:n,state:i})}),'<a class="detail'+t+'">'+t+"</a>"}},{name:"documentStatus",index:"documentStatus",width:200,align:"left",formatter:function(t,e,n,i){return 1===t?"暂存":2===t?"待审核":3===t?"审核中":4===t?"已审核":"驳回"}},{name:"custName",index:"custName",align:"left",width:200},{name:"remark",index:"remark",align:"left",width:240},{name:"lastReceiptAmount",index:"lastReceiptAmount",align:"right",width:200,formatter:function(t,e,n,i){return console.log(t),null!==t&&(val=t.toFixed(2)),val}},{name:"currentReceiptAmount",index:"currentReceiptAmount",align:"right",width:200,formatter:function(t,e,n,i){var a="";return null!==t&&(a=t.toFixed(2)),a}},{name:"totalReceiptAmount",index:"totalReceiptAmount",align:"right",width:200,formatter:function(t,e,n,i){var a="";return null!==t&&(a=t.toFixed(2)),a}}]}}},methods:{changeDate:function(t){this.body.startTime=""==t[0]?"":t[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=""==t[1]?"":t[1].replace(/\//g,"-")+" 23:59:59"},search:function(){this.reload=!this.reload},clear:function(){this.body={documentNo:"",custName:"",startTime:"",endTime:"",isDel:1},this.dataValue=[]},detailClick:function(t){var e=t.rows.documentNo;console.log(e),window.parent.activeEvent({name:"销售结算单-查看",url:contextPath+"/sale/bill/sale-bill-add.html",params:{documentNo:e,type:"update"}})},refresh:function(){this.clear(),this.reload=!this.reload,this.selected=[]},deleteData:function(){console.log(this.selected);var e=this;if(0!==this.selected.length){var n=[],i=0;if(this.selected.forEach(function(t){1===t.documentStatus&&(n.push(t.documentNo),i++)}),this.selected.length!==i)return this.$Modal.warning({title:"提示",content:"只有单据状态为暂存的单即可删除!"}),!1;$.ajax({type:"POST",url:contextPath+"/saleBillController/deleteBatch",data:JSON.stringify(n),dataType:"json",contentType:"application/json; charset=utf-8",success:function(t){"100100"===t.code?(e.$Modal.success({title:"提示",content:"删除成功!"}),e.refresh()):e.$Modal.success({title:"提示",content:"删除失败!"})},error:function(t){e.$Modal.error({title:"提示",content:"服务器出错"})}})}else this.$Modal.warning({title:"提示",content:"请至少选择一条记录进行删除"})},modify:function(){if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var t=this.selected[0].documentNo;$.isEmptyObject(t)||null==t||window.parent.activeEvent({name:"销售结算单-修改",url:contextPath+"/sale/bill/sale-bill-add.html",params:{documentNo:t,type:"update"}})},submit:function(){console.log(this.selected);var e=this;if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;if(1!==this.selected[0].documentStatus)return this.$Modal.warning({title:"提示",content:"该单据之前已经提交过了,不能再提交!"}),!1;var t=this.selected[0].documentNo;$.ajax({type:"POST",url:contextPath+"/saleBillController/getSaleBillVoInfo",data:JSON.stringify({documentNo:t}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(t){console.log(t),"100100"==t.code?(t.data.documentStatus=2,e.updateData(t.data,"提交")):e.$Modal.warning({title:"提示",content:"提交失败!"})},error:function(t){e.$Modal.warning({title:"提示",content:"服务器出错"})}})},approval:function(t){console.log(this.selected);var e=this;return ht.util.hasValue(this.selected,"array")?1<this.selected.length?(this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1):4===this.selected[0].documentStatus?(this.$Modal.warning({title:"提示",content:"该单据已审核通过!"}),!1):1===this.selected[0].documentStatus?(e.$Modal.warning({title:"提示",content:"请先提交!"}),!1):(e.saleBillEntity.documentNo=this.selected[0].documentNo,e.saleBillEntity.documentStatus=this.selected[0].documentStatus,e.modalType="approve",void(e.modalTrigger=!e.modalTrigger)):(this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1)},reject:function(t){var e=this;return ht.util.hasValue(this.selected,"array")?1<this.selected.length?(this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1):4===this.selected[0].documentStatus?(this.$Modal.warning({title:"提示",content:"该单据已审核通过,不能驳回"}),!1):1===this.selected[0].documentStatus?(this.$Modal.warning({title:"提示",content:"请先提交!"}),!1):(e.saleBillEntity.documentNo=this.selected[0].documentNo,e.saleBillEntity.documentStatus=this.selected[0].documentStatus,e.modalType="reject",void(e.modalTrigger=!e.modalTrigger)):(this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1)},approvalOrRejectCallBack:function(t){"100515"==t.result.code&&("approve"==this.modalType&&(this.selected[0].documentStatus=4,this.updateData(this.selected[0],"审核")),"reject"==this.modalType&&(this.selected[0].documentStatus=1,this.updateData(this.selected[0],"驳回"))),this.refresh()},updateData:function(t,e){var n=this;$.ajax({type:"POST",url:contextPath+"/saleBillController/update",contentType:"application/json",data:JSON.stringify(t),dataType:"json",success:function(t){"100100"==t.code?(n.$Modal.success({title:"提示",content:e+"成功!"}),n.refresh()):n.$Modal.warning({title:"提示",content:e+"失败!"})},error:function(t){n.$Modal.warning({title:"提示",content:"服务器出错"})}})},transDocStatus:function(t){return"暂存"===t?1:"待审核"===t?2:"审核中"===t?3:"已审核"===t?4:5},cancel:function(){window.parent.closeCurrentTab({name:this.openName,exit:!0,openTime:this.openTime})}},mounted:function(){this.openTime=window.parent.params.openTime,this.openName=window.parent.params.name}});