"use strict";var vm=new Vue({el:"#app",data:{openTime:"",isShow:!1,isEdit:!1,reload:!1,isSearchHide:!0,isTabulationHide:!0,selectType:[{value:"S_OUT_STOCK",label:"销售出库单"},{value:"P_APPLY_DELIVER",label:"采购送料单"},{value:"P_RETURN_STOCK",label:"采购退库单"},{value:"W_EMATERIAL_OUT",label:"受托加工材料出库单"},{value:"维修商品发出单",label:"维修商品发出单"},{value:"旧料发出单",label:"旧料发出单"},{value:"P_CREDENTIAL_OUT",label:"证书商品发出单"}],body:{docCode:"",docNo:"",custId:"",supplierId:""},customerList:[],supplierList:[],data_config:{url:contextPath+"/logisticsdispatching/pendingList",datatype:"json",colNames:["源单类型","源单Code","源单编号","下单日期","物流方式","客户id","客户","供应商id","供应商","业务类型","源单id"],colModel:[{name:"docName",width:210,align:"left"},{name:"docCode",hidden:!0,width:210,align:"left"},{name:"docNo",width:210,align:"left",formatter:function(e,t,a,o){return $(document).off("click",".detail"+e).on("click",".detail"+e,function(e){e.preventDefault(),vm.documentCodeClick(a)}),'<a class="detail'+e+'">'+e+"</a>"},unformat:function(e,t,a){return e.replace(/(<\/?a.*?>)/g,"")}},{name:"docTime",width:210,align:"left",formatter:function(e,t,a,o){return new Date(e).format("yyyy-MM-dd")}},{name:"logisticsMode",width:210,align:"left",formatter:function(e,t,a,o){switch(e){case"wlfs_js":return"寄送";case"wlfs_shsm":return"送货上门"}}},{name:"custId",hidden:!0,align:"left",width:210},{name:"custName",align:"left",width:210},{name:"supplierId",hidden:!0,align:"left",width:210},{name:"supplierName",align:"left",width:210},{name:"businessType",hidden:!0},{name:"sourceDocumentId",hidden:!0}],rowNum:5,rowList:[10,20,30],mtype:"post",viewrecords:!0},selected:[]},methods:{documentCodeClick:function(e){"S_OUT_STOCK"==e.docCode&&window.parent.activeEvent({name:"查看销售出库单",url:contextPath+"/sale/saleoutstock/saleoutstock-add.html",params:{type:"other",data:e.docNo}}),"P_APPLY_DELIVER"==e.docCode&&$.ajax({url:contextPath+"/purchaseDeliverController/queryByOrderInfo/"+e.sourceDocumentId,method:"post",dataType:"json",success:function(e){"100100"==e.code?window.parent.activeEvent({name:"采购送料单-详情",url:contextPath+"/purchase/purchase-deliver/deliver-add.html",params:{type:"detail",goodsData:e.data,activeType:"detail"}}):layer.alert(e.msg,{icon:0})},error:function(){layer.alert("服务器异常，请稍后再试！",{icon:0})}}),"W_EMATERIAL_OUT"==e.docCode&&window.parent.activeEvent({name:"查看受托加工材料出库单",url:contextPath+"/warehouse/entrust-material-out/entrust-material-out-info.html",params:{activeType:"listQuery",documentNo:e.docNo}}),"P_CREDENTIAL_OUT"==e.docCode&&window.parent.activeEvent({name:"查看外发证书单详情",url:contextPath+"/purchase/certificateOutbreaks/certificate-add.html",params:{type:"id",id:e.sourceDocumentId}}),"P_RETURN_STOCK"==e.docCode&&$.ajax({url:contextPath+"/rurchaseReturnGoods/queryByOrderInfo/"+e.sourceDocumentId+"/"+e.businessType,method:"post",dataType:"json",success:function(e){"100100"==e.code?window.parent.activeEvent({name:"采购退库单详情",url:contextPath+"/purchase/returngoods/returngoods-add.html",params:{type:"detail",goodsData:e.data,activeType:"detail"}}):layer.alert(e.msg,{icon:0})},error:function(){layer.alert("服务器异常，请稍后再试！",{icon:0})}})},clear:function(){var e=this;this.body.docNo="",this.body.custId&&(this.$refs.cust.reset(),this.$nextTick(function(){e.body.custId=""})),this.body.supplierId&&(this.$refs.supplier.reset(),this.$nextTick(function(){e.body.supplierId=""})),this.body.docCode&&(this.$refs.docCode.reset(),this.$nextTick(function(){e.body.docCode=""}))},search:function(){this.reload=!this.reload},reloadAgain:function(){this.clear(),this.reload=!this.reload},generateLogistics:function(){var e=this,t=e.selected;if(t.length<1)e.$Modal.warning({title:"提示信息",content:"至少选择一条数据！"});else if(1===t.length)console.log("选取的源单信息",t),window.parent.activeEvent({name:"新增物流配送单",url:contextPath+"/warehouse/logistics-dispatch/logistics-dispatch-info.html",params:{data:t,type:"generater"}});else for(var a=t[0].docCode,o=t[0].logisticsMode,i=t[0].custId,n=t[0].supplierId,s=1;s<t.length;s++){if(t[s].docCode!==a)return void e.$Modal.warning({title:"提示信息",content:"源单类型不一样不能一起生成！"});if(t[s].logisticsMode!==o)return void e.$Modal.warning({title:"提示信息",content:"单据物流方式不一样不能一起生成！"});if(t[s].custId!==i)return void e.$Modal.warning({title:"提示信息",content:"单据客户不一样不能一起生成！"});if(t[s].supplierId!==n)return void e.$Modal.warning({title:"提示信息",content:"单据供应商不一样不能一起生成！"});console.log("选取的源单信息",t),window.parent.activeEvent({name:"新增物流配送单",url:contextPath+"/warehouse/logistics-dispatch/logistics-dispatch-info.html",params:{data:t,type:"generater"}})}},exit:function(){window.parent.closeCurrentTab({name:"待发物流列表",openTime:this.openTime,exit:!0})},getCustomers:function(){var t=this;$.ajax({type:"post",url:contextPath+"/rawapplication/queryAllCustomer",dataType:"json",success:function(e){t.customerList=e.data}})},getSppliers:function(){var t=this;$.ajax({type:"post",url:contextPath+"/rawapplication/getSuppliers",dataType:"json",success:function(e){t.supplierList=e.data}})}},mounted:function(){this.openTime=window.parent.params.openTime,this.getCustomers(),this.getSppliers()}});