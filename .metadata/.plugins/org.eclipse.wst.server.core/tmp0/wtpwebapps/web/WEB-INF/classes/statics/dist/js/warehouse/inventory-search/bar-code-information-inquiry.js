"use strict";var vm=new Vue({el:"#app",data:{isShow:!1,isEdit:!1,reload:!1,isSearchHide:!0,isTabulationHide:!0,isHide:!0,openTime:"",isSearchShow:!1,isShowGoodsType:!1,documentType:"",goodsMainType:"",goodsId:"",productDetailModal:{showModal:!1,ids:{goodsId:"",commodityId:"",documentType:"W_STOCK_IN"}},body:{isInStock:"",goodsNo:"",goodsName:"",goodsBarcode:""},data_config:{url:contextPath+"/goodsController/list",datatype:"json",colNames:["id","stockType","goodsMainType","commodityId","条码号","状态","商品编码","商品名称","计数单位","数量","计重单位","总重","金重","石重(ct)","仓库","商品明细","规格","批号","金料成色","分段","颜色","净度","证书类型","证书编号","进货证书费","进货金价","进货金耗(%)","进货石价","进货成本(配件)","进货工费","其他进货费用","进货成本","销售证书费","销售金价","销售石价","销售成本(配件)","销售工费","其他销售费用","销售成本","售价(标签价)"],colModel:[{name:"id",width:"120",align:"left",hidden:!0},{name:"stockType",width:"120",align:"left",fixed:"true",hidden:!0},{name:"goodsMainType",width:"120",align:"left",fixed:"true",hidden:!0},{name:"commodityId",width:"120",align:"left",fixed:"true",hidden:!0},{name:"goodsBarcode",width:"120",align:"left",fixed:"true"},{name:"isInStock",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return 0===e?"出库":1===e?"在库":""}},{name:"goodsNo",width:"120",align:"left",fixed:"true",formatter:function(e,t,i,o){return $(document).off("click",".detail"+e).on("click",".detail"+e,function(){vm.showGoodsInfo({value:e,grid:t,rows:i,state:o})}),'<a class="detail'+e+'">'+e+"</a>"}},{name:"goodsName",width:"210",align:"left",fixed:"true"},{name:"countingUnitName",width:"80",align:"left",fixed:"true"},{name:"num",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return 1}},{name:"countingUnitName",width:"80",align:"left",fixed:"true"},{name:"totalWeight",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(3)}},{name:"goldWeight",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(3)}},{name:"mainStoneWeight",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(3)}},{name:"warehouse",width:"120",align:"left",fixed:"true"},{name:"id",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return $(document).off("click",".detail"+e).on("click",".detail"+e,function(){vm.showProductDetail({value:e,grid:t,rows:i,state:o})}),'<a class="detail'+e+'">商品明细</a>'}},{name:"goodsNorm",width:"80",align:"left",fixed:"true"},{name:"batchNum",width:"80",align:"left",fixed:"true"},{name:"goldColor",width:"80",align:"left",fixed:"true"},{name:"stoneSection",width:"80",align:"left",fixed:"true"},{name:"stoneColor",width:"80",align:"left",fixed:"true"},{name:"stoneClarity",width:"80",align:"left",fixed:"true"},{name:"certificateType",width:"80",align:"left",fixed:"true"},{name:"certificateNo",width:"120",align:"left",fixed:"true"},{name:"purCertificateFee",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purchaseGoldPrice",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purchaseGoldLose",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purchaseStonePrice",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purchasePart",width:"120",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purchaseLaborCharge",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purOtherFee",width:"120",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purchaseCost",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"certificateFee",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"goldPrice",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"saleStonePrice",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"salePart",width:"120",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"processingFee",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"otherFee",width:"120",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"purPriceCost",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}},{name:"salePrice",width:"80",align:"left",fixed:"true",formatter:function(e,t,i,o){return Number(e).toFixed(2)}}],rowNum:10,rowList:[10,20,30],mtype:"post",viewrecords:!0,autoScroll:!0}},methods:{search:function(){this.reload=!this.reload},clear:function(){this.body={isInStock:"",goodsNo:"",goodsName:"",goodsBarcode:""}},refresh:function(){this.clear(),this.reload=!this.reload},exit:function(){window.parent.closeCurrentTab({openTime:this.openTime,exit:!0})},showProductDetail:function(e){var t=this,i={goodsId:e.rows.id,commodityId:"",documentType:"W_STOCK_IN"};t.goodsMainType=e.rows.goodsMainType,Object.assign(t.productDetailModal,{showModal:!0,ids:i}),t.$nextTick(function(){t.$refs.modalRef.getProductDetail()})},modalSure:function(e){},modalCancel:function(e){},showGoodsInfo:function(e){window.parent.activeEvent({name:"商品",url:contextPath+"/base-data/commodity/commodity-info.html",params:{id:e.rows.commodityId,type:"skip"}})}},created:function(){this.goodsMainType="attr_ranges_part",this.openTime=window.parent.params.openTime}});