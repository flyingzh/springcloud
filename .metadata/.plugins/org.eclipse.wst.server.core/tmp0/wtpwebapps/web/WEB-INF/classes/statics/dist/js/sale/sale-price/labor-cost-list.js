"use strict";new Vue({el:"#labor-cost-list",data:function(){return{openName:"",openTime:"",showUpload:!1,file:"",uploadDataList:{},saleLaborVo:{id:"",isDel:1,remark:"",organizationId:"",saleLaborDetailList:[]}}},methods:{importExcel:function(){this.showUpload=!this.showUpload},modalOk:function(){this.saleLaborVo.saleLaborDetailList=this.uploadDataList},modalCancel:function(){},handleSuccess:function(a,t){"100100"==a.code?(this.$Modal.success({title:"提示",content:"上传成功!"}),this.uploadDataList=a.data):(this.$Modal.success({title:"提示",content:data.data+"上传失败!"}),this.uploadDataList=this.saleLaborVo.saleLaborDetailList)},handleFormatError:function(a){this.$Modal.warning({title:"提示",content:"文件格式错误，请选择.xlsx文件"})},handleMaxSize:function(a){this.$Modal.warning({title:"提示",content:"文件过大，请选择小于5M文件"})},handleBeforeUpload:function(){},exportTemplate:function(){var a=contextPath+"/excle/getExcelModel?excelModelName=工费表模板.xlsx";window.location.href=a},save:function(){var t=this;this.saleLaborVo.id="",null!==this.saleLaborVo.saleLaborDetailList&&0<this.saleLaborVo.saleLaborDetailList.length&&this.saleLaborVo.saleLaborDetailList.forEach(function(a){a.id="",a.laborId=""}),null!==this.saleLaborVo.saleLaborDetailList&&0<this.saleLaborVo.saleLaborDetailList.length&&this.saleLaborVo.saleLaborDetailList.forEach(function(a){a.difficulty=a.difficulty.replace("<","&lt;").replace(">","&gt;")}),console.log(t.saleLaborVo);var a;a=this.saleLaborVo,$.ajax({type:"POST",url:contextPath+"/saleLaborController/saveBatch",contentType:"application/json;charset=utf-8",data:JSON.stringify(a),dataType:"json",success:function(a){console.log(a),"100100"===a.code?t.$Modal.success({title:"提示",content:"保存成功!"}):t.$Modal.warning({title:"提示",content:"保存失败!"})},error:function(a){t.$Modal.warning({title:"提示",content:"服务器出错!"})}})},getLaborData:function(){var t=this;$.ajax({type:"POST",url:contextPath+"/saleLaborController/list",contentType:"application/json;charset=utf-8",data:JSON.stringify(t.saleLaborVo),dataType:"json",success:function(a){console.log(a.data),null!==a.data&&(t.saleLaborVo=a.data,null!==t.saleLaborVo.saleLaborDetailList&&0<t.saleLaborVo.saleLaborDetailList.length&&t.saleLaborVo.saleLaborDetailList.forEach(function(a){a.difficulty=a.difficulty.replace("&lt;","<").replace("&gt;",">")}))},error:function(a){t.$Modal.warning({title:"提示",content:"服务器出错!"})}})},quit:function(){window.parent.closeCurrentTab({name:this.openName,exit:!0,openTime:this.openTime})}},mounted:function(){this.openTime=window.parent.params.openTime,this.openName=window.parent.params.openName,this.getLaborData()}});