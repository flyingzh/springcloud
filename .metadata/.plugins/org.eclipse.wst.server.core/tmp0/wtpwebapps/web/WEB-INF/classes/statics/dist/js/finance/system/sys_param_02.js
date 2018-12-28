"use strict";var vm=new Vue({el:"#vmDiv",data:{yearSpan:30,selectSpan:10,selectOpt:[],accountingPeriod:[],years:{},accountingYear:{id:"",value:"",readOnly:"",sobId:""},accountingYear_init:"",accountingNaturalYear:{id:"",value:"",readOnly:"",sobId:""},accountingNaturalYear_init:"",accountingPeriodNumber:{id:"",value:"",readOnly:"",sobId:""},accountingPeriodNumber_init:"",accountingPeriodStartDate:{id:"",value:"",readOnly:"",sobId:""},accountingPeriodStartDate_init:"",canUpdateAccountPeriod:!1},watch:{"accountingNaturalYear.value":function(a){"1"==a&&(this.accountingPeriodNumber.value=12)},"accountingYear.value":function(a){this.genSelect()},"accountingPeriodNumber.value":function(){this.genAccountingPeriod()}},methods:{genSelect:function(){for(var a=this,t=parseInt(a.accountingYear.value),e=a.selectSpan,n=[],o=t-e;o<=t+e;o++)n.push(o);a.selectOpt=n,a.genPeriods(t)},genPeriods:function(a){for(var t={},e=this,n=a,o=(t={},n);o<=n+e.yearSpan;o++)t[o]={};e.years=t,e.genAccountingPeriod(a+"-01-01")},genAccountingPeriod:function(a){console.log(";;;;;"),console.log(a);a=htUtilHasValue(a)?a:this.accountingPeriod[0];var n=new Date(a),t=parseInt(this.accountingPeriodNumber.value),e=n.getDate();e=e<10?"0"+e:e;for(var o=[],c=0;c<t;c++){var i=e,r=n.getMonth()+1;r=r<10?"0"+r:r;!function a(t){if(htUtilValidDate(t)){var e=n.getMonth()+1;return n.setMonth(n.getMonth()+1),n.getMonth()+1-e==2&&n.setMonth(n.getMonth()-1),o.push(t),!1}i--,a(n.getFullYear()+"-"+r+"-"+i)}(n.getFullYear()+"-"+r+"-"+i)}this.accountingPeriod=o},save:function(){$("form").valid()&&console.log(this.$data);var a=$("#0").val(),t=new RegExp("^[1-2]\\d{3}-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][1-9]||3[0-1])$");try{if(!t.test(a)){var e=layer.alert("开始日期格式不正确，请重新输入!",{icon:0},function(){layer.close(e),setTimeout(function(){console.log($("#0")),$("#0").focus()},0)});return}console.log(a);this.genAccountingPeriod(a)}catch(a){var n=layer.alert("开始日期输入错误，请重新输入!",{icon:0},function(){layer.close(n),setTimeout(function(){console.log($("#0")),$("#0").focus()},0)});return}var o=[];vm.accountingYear.value!=vm.accountingYear_init&&(o.push(vm.accountingYear),vm.accountingYear_init=vm.accountingYear.value),vm.accountingNaturalYear.value!=vm.accountingNaturalYear_init&&(o.push(vm.accountingNaturalYear),vm.accountingNaturalYear_init=vm.accountingNaturalYear.value),vm.accountingPeriodNumber.value!=vm.accountingPeriodNumber_init&&(o.push(vm.accountingPeriodNumber),vm.accountingPeriodNumber_init=vm.accountingPeriodNumber.value),vm.accountingPeriodStartDate.value!=vm.accountingPeriodStartDate_init&&(o.push(vm.accountingPeriodStartDate),vm.accountingPeriodStartDate_init=vm.accountingPeriodStartDate.value),htUtilHasValue(o,"array")?(vm.accountingYear.readOnly=1,vm.accountingNaturalYear.readOnly=1,vm.accountingPeriodNumber.readOnly=1,vm.accountingPeriodStartDate.readOnly=1,$.ajax({type:"POST",contentType:"application/json;charset=utf-8",url:contextPath+"/systemProfileController/updateBatch",data:JSON.stringify(o),success:function(a){0<a.data?alert("更改成功！"):alert("更改失败！")}})):alert("暂无数据提交！")},updateStartDate:function(a){var t=$(a.target),e=t.val(),n=new RegExp("^[1-2]\\d{3}-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][1-9]||3[0-1])$");try{if(!n.test(e)){var o=layer.alert("开始日期格式不正确，请重新输入!",{icon:0},function(){layer.close(o),setTimeout(function(){console.log(t),t.focus()},0)});return}console.log(e);this.genAccountingPeriod(e)}catch(a){var c=layer.alert("开始日期输入错误，请重新输入!",{icon:0},function(){layer.close(c),setTimeout(function(){console.log(t),t.focus()},0)});return}}},created:function(){var a=contextPath+"/systemProfileController/queryByType?type=会计期间参数&sobId=1";$.ajax({type:"POST",url:a,success:function(a){var t=a.data;console.log("================"),console.log(t),console.log("======================");for(var e=0;e<t.length;e++)"accountingYear"==t[e].name&&(vm.accountingYear=t[e],vm.accountingYear_init=t[e].value,""==vm.accountingYear.value&&(vm.accountingYear.value=(new Date).getFullYear())),"accountingNaturalYear"==t[e].name&&(vm.accountingNaturalYear=t[e],vm.accountingNaturalYear_init=t[e].value,""==vm.accountingNaturalYear.value&&(vm.accountingNaturalYear.value="1")),"accountingPeriodNumber"==t[e].name&&(vm.accountingPeriodNumber=t[e],vm.accountingPeriodNumber_init=t[e].value,""==vm.accountingPeriodNumber.value&&(vm.accountingPeriodNumber.value="12")),"accountingPeriodStartDate"==t[e].name&&(vm.accountingPeriodStartDate=t[e],vm.accountingPeriodStartDate_init=t[e].value,""==vm.accountingPeriodStartDate.value&&(vm.accountingPeriodStartDate.value=(new Date).getFullYear()+"-01-01"))}}),this.genAccountingPeriod(this.accountingPeriodStartDate.value);var t=contextPath+"/systemProfileController/canUpdateAccountPeriod";$.ajax({type:"POST",url:t,data:{serviceType:"all"},success:function(a){var t=a.data;vm.canUpdateAccountPeriod=t}})}});