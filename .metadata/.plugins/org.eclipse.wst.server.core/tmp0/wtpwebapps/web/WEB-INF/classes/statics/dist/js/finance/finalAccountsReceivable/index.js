"use strict";new Vue({el:"#receivable-settle",data:function(){return{openTime:"",formData:{settleOrReverse:"1",accountYearPeriod:"",nextAccountYearPeriod:"",lastAccountYearPeriod:""},filterVisible:!1}},created:function(){this.initPage()},mounted:function(){this.openTime=window.parent.params&&window.parent.params.openTime},methods:{initPage:function(){var n=this;$.ajax({type:"POST",url:rcContextPath+"/paymentReceiptAccount/initPageInfo",date:"",dataType:"json",success:function(e){var t=e.data;null!=t&&(n.formData.accountYearPeriod=e.data.accountYearPeriod,n.formData.nextAccountYearPeriod=t.nextAccountYearPeriod,n.formData.lastAccountYearPeriod=t.lastAccountYearPeriod)}})},open:function(){var o=this;this.$Modal.confirm({title:"信息提示",content:"<p>确定要开始结算操作吗？</p >",onOk:function(){var e=o.formData.settleOrReverse,t="",n="";if(1==e){window.top.home.loading("show",{text:"应收应付系统结账中，请稍等"}),t=rcContextPath+"/paymentReceiptAccount/settleAccount";n={voucherStatus:2}}else 2==e&&(t=rcContextPath+"/paymentReceiptAccount/counterSettle",n={});$.ajax({type:"POST",url:t,data:n,dataType:"json",success:function(e){window.top.home.loading("hide"),layer.closeAll("dialog"),layer.alert(e.msg),o.initPage()},error:function(e){window.top.home.loading("hide"),setTimeout(function(){o.ishttpOK=!1},1e3)}})},onCancel:function(){}})},refresh:function(){this.initPage()},save:function(){this.filterVisible=!1,this.refresh()},cancel:function(){this.filterVisible=!1},outHtml:function(){window.parent.closeCurrentTab({name:name,openTime:this.openTime,exit:!0})}}});