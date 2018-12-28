"use strict";Vue.component("area-select",{props:{url:{type:String,require:!0},init:{type:Object,require:!1}},data:function(){return{province:"",city:"",county:"",provinceOptions:[],cityOptions:[],countyOptions:[],detail:"",options:[]}},methods:{setValue:function(){this.$emit("input",{area:this.province?this.provinceOptions[this.provinceOptions.map(function(i){return i.value}).indexOf(this.province)].pcode:"",province:this.province,city:this.city,county:this.county,detail:this.detail,concreteAddress:[this.province?this.provinceOptions[this.provinceOptions.map(function(i){return i.value}).indexOf(this.province)].name:"",this.city?this.cityOptions[this.cityOptions.map(function(i){return i.value}).indexOf(this.city)].name:"",this.county?this.countyOptions[this.countyOptions.map(function(i){return i.value}).indexOf(this.county)].name:"",this.detail].join("")})},detailChange:function(){this.setValue()},provinceChange:function(){this.city="",this.county="",this.cityOptions=""===this.province||void 0===this.province?[]:this.provinceOptions[this.provinceOptions.map(function(i){return i.value}).indexOf(this.province)].child,this.countyOptions=[],this.detail="",this.setValue()},cityChange:function(){this.county="",this.countyOptions=""===this.city||void 0===this.city?[]:this.cityOptions[this.cityOptions.map(function(i){return i.value}).indexOf(this.city)].child,this.detail="",this.setValue()},countyChange:function(){this.setValue()},initData:function(){var i=this.init.isInit;0<this.provinceOptions.length&&(this.detail=!0===i?(this.province=this.init.province,this.cityOptions=this.provinceOptions[this.provinceOptions.map(function(i){return i.value}).indexOf(this.province)].child,this.city=this.init.city,this.countyOptions=this.cityOptions[this.cityOptions.map(function(i){return i.value}).indexOf(this.city)].child,this.county=this.init.county,this.init.detail):(this.province="",this.city="",this.county=""),this.setValue())}},created:function(){var t=this;t.url&&0==t.provinceOptions.length&&$.ajax({type:"POST",url:t.url,contentType:"application/json",dataType:"json",success:function(i){"100100"===i.code&&(t.provinceOptions=i.data,t.initData())},error:function(i){}})},watch:{init:{handler:function(){this.initData()},deep:!0}},mounted:function(){console.log(this.init)},template:' <div>\n     <i-select \n        transfer="true"\n        v-model="province" \n        @on-change="provinceChange"\n        style="width:100px" \n        placeholder="省份"\n        v-bind:disabled="init.disabled">\n       <i-option v-for="(item, index) in provinceOptions" :value="item.value"  :key="item.name">{{ item.name }}</i-option>\n    </i-select>\n     <i-select \n        transfer="true"\n        v-model="city" \n        @on-change="cityChange"\n        v-bind:disabled="(province === \'\' || province === undefined)||init.disabled" \n        style="width:100px" \n        placeholder="城市">\n       <i-option v-for="(item, index) in cityOptions" :value="item.value" :key="item.name">{{ item.name }}</i-option>\n    </i-select>\n     <i-select \n        transfer="true"\n        v-model="county" \n        @on-change="countyChange"\n        v-bind:disabled="(province === \'\' || city === \'\' || province === undefined || city === undefined)||init.disabled" \n        placeholder="区县"\n        style="width:100px">\n       <i-option v-for="(item, index) in countyOptions" :value="item.value"  :key="item.name">{{ item.name }}</i-option>\n    </i-select>\n    <i-input \n    v-model="detail" \n    v-on:on-change="detailChange()" \n    type="textarea" \n    :autosize="{minRows: 2,maxRows: 5}" \n    placeholder="详细地址"\n    style="max-width: 400px"\n    v-bind:disabled="init.disabled"></i-input>\n</div>'});