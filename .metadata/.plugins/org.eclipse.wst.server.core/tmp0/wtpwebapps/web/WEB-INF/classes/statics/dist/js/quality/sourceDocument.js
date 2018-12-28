"use strict";var sourceDocument=new Vue({el:"#sourceDocument",data:function(){var r=this;return{isShow:!1,isEdit:!1,reload:!1,openTime:"",isSearchHide:!0,isTabulationHide:!0,isHide:!0,selected:[],confirmConfig:{showConfirm:!1,title:"提示",content:"请点击确认",onlySure:!0,success:!0},docType:[],shopType:[],dataValue:[],categoryType:[],commodityCategoty:[],inspectorNameList:[],body:{documentType:"",documentCode:"",startTime:"",endTime:"",alreadyTest:"1",productTypeName:"",inspectorName:"",qcDocumentCode:"",upstreamSourceCode:""},addBody:{documentCode:"",documentType:"",documentTime:"",inspectorName:"",qcDocumentCode:"",productTypeName:"",sendTestTime:"",qcFinishTime:"",testTotalAmount:"",qualifiedAmount:"",unqualifiedAmount:"",qualifiedPercent:"",testResult:""},data_config:{url:contextPath+"/documentController/list",colNames:["业务状态","业务类型","送检编号","单据类型","单据日期","源单单号","质检员","检验单号","商品类型","送检时间","质检完成时间","检验总数量","合格数","不合格数","合格率(%)","检验结果"],colModel:[{name:"businessStatus ",hidden:!0},{name:"businessType ",hidden:!0},{name:"documentCode",index:"documentCode",width:250,align:"left"},{name:"documentType",index:"documentType",width:120,align:"left"},{name:"documentTime",index:"documentTime",align:"left",width:150,formatter:function(e,t,o,n){return Date.prototype.Format=function(e){var t={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var o in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),t)new RegExp("("+o+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?t[o]:("00"+t[o]).substr((""+t[o]).length)));return e},new Date(e).Format("yyyy-MM-dd")}},{name:"upstreamSourceCode",index:"documentCodeupstreamSourceCode",width:250,align:"left",formatter:function(e,t,o,n){var i=".detail"+e;return $(document).off("click",i).on("click",i,function(){r.detailClick({value:e,grid:t,rows:o,state:n})}),'<a class="detail'+e+'">'+e+"</a>"}},{name:"inspectorName",index:"inspectorName",align:"left",width:100,formatter:function(e,t,o,n){var i="";return e&&(i=e),i}},{name:"qcDocumentCode",index:"qcDocumentCode",align:"left",width:250,formatter:function(e,t,o,n){var i="";if(e){var a=".detail"+e;$(document).off("click",a).on("click",a,function(){r.testDocumentDetailClick({value:e,grid:t,rows:o,state:n})}),i='<a class="detail'+e+'">'+e+"</a>"}return i}},{name:"productTypeName",index:"productTypeName",align:"left",width:120},{name:"sendTestTime",index:"sendTestTime",align:"left",width:200,formatter:function(e,t,o,n){return new Date(e).Format("yyyy-MM-dd hh:mm:ss")}},{name:"qcFinishTime",index:"qcFinishTime",width:200,align:"left",formatter:function(e,t,o,n){return e?new Date(e).Format("yyyy-MM-dd hh:mm:ss"):""}},{name:"testTotalAmount",index:"testTotalAmount",align:"right",width:140,formatter:function(e,t,o,n){var i=0;return e&&(i=e),i}},{name:"qualifiedAmount",index:"qualifiedAmount",align:"right",width:100,formatter:function(e,t,o,n){var i=0;return e&&(i=e),i}},{name:"unqualifiedAmount",index:"unqualifiedAmount",align:"right",width:100,formatter:function(e,t,o,n){var i=0;return e&&(i=e),i}},{name:"qualifiedPercent",index:"qualifiedPercent",align:"right",width:120,formatter:function(e,t,o,n){var i="0.00%";return e&&(i=e.toFixed(2)+"%"),i}},{name:"testResult",index:"testResult",align:"left",width:100,formatter:function(e,t,o,n){var i="";return e&&(i=e),i}}],multiselect:!1}}},methods:{changeDate:function(e){this.body.startTime=e[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=e[1].replace(/\//g,"-")+" 23:59:59"},search:function(){0<this.commodityCategoty.length?this.body.productTypeName=this.commodityCategoty[this.commodityCategoty.length-1]:this.body.productTypeName="",this.reload=!this.reload},clear:function(){this.commodityCategoty=[],this.$refs.inspect.reset(),this.$refs.dType.reset(),this.$nextTick(function(){this.body.inspectorName="",this.body.documentType=""}),this.body={documentType:"",documentCode:"",startTime:"",endTime:"",alreadyTest:"1",productTypeName:"",inspectorName:"",qcDocumentCode:"",upstreamSourceCode:""},this.dataValue=[],console.log(this.body)},detailClick:function(e){var t=e.rows.upstreamSourceCode;if(t){var o=e.rows.documentType;"收货单"==o&&$.ajax({type:"post",url:contextPath+"/tpurchasecollectgoods/info?code="+t,dataType:"json",success:function(e){"100100"==e.code&&(console.log(e.data),window.parent.activeEvent({name:"采购收货单-查看",url:contextPath+"/purchase/purchase-collectgoods/purchase-collectgoods-add.html",params:e.data,type:4}))},error:function(e){}}),"原料领用申请单"==o&&window.parent.activeEvent({name:"查看原料领用申请单",url:contextPath+"/warehouse/raw-application/raw-application-info.html",params:{data:t,type:"query"}}),"客户订单"==o&&window.parent.activeEvent({name:"客户订单-查看",url:contextPath+"/sale/customer-order/customer-order-add.html",params:{type:"view",saleOrderNo:t}})}},testDocumentDetailClick:function(e){e.rows.qcDocumentCode&&this.queryTestDocumentByQcDocumentCode(e)},queryTestDocumentByQcDocumentCode:function(e){var t=e.rows.documentType,o=e.rows.businessStatus,n=e.rows.qcDocumentCode,i=e.rows.upstreamSourceCode;"收货单"==t&&window.parent.activeEvent({name:"来料检验单",url:contextPath+"/quality/test-document/test-document.html",params:{code:n,scode:i,type:1}}),"原料领用申请单"==t&&window.parent.activeEvent({name:"调拨检验单",url:contextPath+"/quality/test-document/test-document.html",params:{code:n,scode:i,type:1}}),"客户订单"==t&&("代发货检验"==o?window.parent.activeEvent({name:"发货检验单",url:contextPath+"/quality/test-document/test-document.html",params:{code:n,scode:i,type:1}}):window.parent.activeEvent({name:"调拨检验单",url:contextPath+"/quality/test-document/test-document.html",params:{code:n,scode:i,type:1}}))},reloadAgain:function(){this.clear(),this.reload=!this.reload},cancel:function(){window.parent.closeCurrentTab({name:"已质检列表",exit:!0,openTime:this.openTime})},loadCodeType:function(){this.docType=getCodeList("root_zj_jydydlx")},loadProductType:function(){var t=this;$.ajax({type:"post",url:contextPath+"/documentController/getCategory?parentId=0",dataType:"json",success:function(e){console.log(e),t.categoryType=t.initGoodCategory(e.data.cateLists)},error:function(){alert("服务器出错啦")}})},initGoodCategory:function(e){var i=this,a=[];return e.forEach(function(e){var t=e.name,o=e.name,n=e.cateLists;n&&(n=i.initGoodCategory(n)),a.push({value:t,label:o,children:n})}),a.forEach(function(e){e.children||delete e.children}),a},loadInspectorName:function(){var e=window.parent.userInfo.organId;$.ajax({type:"post",url:contextPath+"/documentController/queryAllEmpByOrganId",data:{organId:e},dataType:"json",success:function(e){sourceDocument.inspectorNameList=e.data},error:function(){alert("服务器出错啦")}})},hideSearch:function(){this.isHide=!this.isHide,this.isSearchHide=!this.isSearchHide,$(".chevron").css("top","")},hidTabulation:function(){this.isHide=!this.isHide,this.isTabulationHide=!this.isTabulationHide,this.isTabulationHide?$(".chevron").css("top",""):$(".chevron").css("top","90%")}},mounted:function(){this.openTime=window.parent.params.openTime,this.loadProductType(),this.loadCodeType(),this.loadInspectorName()}});