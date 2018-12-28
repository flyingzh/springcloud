"use strict";var vm=new Vue({el:"#exchangeRateAdjust",data:function(){return{openTime:"",isPosting:!1,unPosting:!1,isCreateVoucher:!1,isNext:!1,isShow:!1,currencies:[],currencyId:"",changedCurrencies:[],voucherGroups:[],body:{voucherDate:"",voucherGroup:"",explanation:"结转汇兑损益"},voucherGroupNo:"",complete:!1,subjectData:[],subjectVisable:!1,resultStr:""}},methods:{close:function(){this.isPosting=!1},nextStep:function(){this.isNext=!0},previousStep:function(){this.isNext=!1},showSubjectTree:function(){this.subjectVisable=!0},subjectClose:function(){this.subjectVisable=!1},subjectCheck:function(e){console.log(e),this.body.accountCode=e.code,console.log(this.body.accountCode)},subjectSave:function(e){console.log(e,"选中科目对象"),-1===e.foreignCurrencyId?this.$Modal.warning({title:"信息提示",content:"汇兑损益科目不能核算外币！"}):this.subjectData=e},finished:function(){if(0!==this.subjectData.length){var t={};this.voucherGroups.forEach(function(e){e.name==vm.body.voucherGroup&&(t.voucherDataEntity=e)}),t.accountSubjectEntity=this.subjectData,t.rateAdjustmentEntityList=this.currencies,t.voucherDate=this.operateDate(this.body.voucherDate),t.explanation=this.body.explanation,t.isCreateVoucher=this.isCreateVoucher;var e=rcContextPath+"/finalOperate/createFinalTuningRemitVoucher";$.ajax({type:"post",async:!0,data:JSON.stringify(t),url:e,contentType:"application/json;charset=utf-8",success:function(e){var t=e.code;"-1001"===t&&vm.$Modal.warning({title:"信息提示",content:e.msg,onOk:function(){vm.closeWindow()}}),"100100"===t&&vm.$Modal.success({title:"信息提示",content:e.msg,onOk:function(){vm.closeWindow()}})},error:function(e){console.log(e)}})}else vm.$Modal.warning({title:"信息提示",content:"请选择汇兑损益科目！"})},operateDate:function(e){return new Date(e).format("yyyy-MM-dd")},getDefaultDay:function(e,t){var n=new Date(e,t,1),o=new Date(n.getTime()-864e5);return o.getFullYear()+"-"+(Number(o.getMonth())+1)+"-"+o.getDate()},checkNoPosting:function(){var e=rcContextPath+"/finalOperate/checkNoPosting";$.ajax({type:"post",async:!0,data:{sobId:1},url:e,success:function(e){console.log(e,"查询是否存在未过账凭证"),vm.unPosting=e.data,vm.isPosting=e.date},error:function(e){console.log(e)}})},queryCurrencyRate:function(){var e=rcContextPath+"/finalOperate/queryCurrencyRate";$.ajax({type:"post",async:!0,url:e,success:function(e){console.log(e,"币别信息~~~~"),e.data.postedStatus?vm.$Modal.warning({title:"信息提示",content:"本期包含外币未过账凭证，必须都过账后才能期末调汇。",onOk:function(){vm.closeWindow()}}):(vm.currencies=e.data.currencyList,vm.body.voucherDate=vm.getDefaultDay(e.data.accountYear,e.data.accountPeriod))},error:function(e){console.log(e)}})},queryVoucherGroup:function(){var e=rcContextPath+"/finalOperate/queryVoucherGroup";$.ajax({type:"post",async:!0,data:{sobId:1},url:e,success:function(e){vm.voucherGroups=e.data,0<vm.voucherGroups.length&&(vm.body.voucherGroup=vm.voucherGroups[0].name)},error:function(e){console.log(e)}})},closeWindow:function(){window.parent.closeCurrentTab({name:"期末调汇",openTime:this.openTime,exit:!0})}},mounted:function(){this.openTime=window.parent.params&&window.parent.params.openTime},created:function(){this.queryCurrencyRate(),this.queryVoucherGroup()},watch:{currencies:{handler:function(e,t){var n=[];vm.changedCurrencies=[],0<e.length&&(n=e.filter(function(e){if(e.initExchangeRate!=e.endExchangeRate)return e})),0<n.length?vm.isCreateVoucher=!0:vm.isCreateVoucher=!1},deep:!0}}});