"use strict";new Vue({el:"#final-checkout",data:function(){return{for1:1}},mounted:function(){},methods:{refresh:function(){},open:function(){var e="",n="",s=this;e=1===this.for1?"结束初始化结果":"反初始化结果",$.ajax({type:"post",url:"index.json",data:"",contentType:"application/json;charset=utf-8",dataType:"json",success:function(t){"100100"==t.code?(n="<p>"+t.msg+"</p>",s.instance("success",e,n)):(n="<p>"+t.msg+"</p>",s.instance("error",e,n))}})},instance:function(t,e,n){switch(t){case"success":this.$Modal.success({title:e,content:n});break;case"error":this.$Modal.error({title:e,content:n})}}},computed:{}});