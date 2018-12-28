"use strict";Vue.component("search-select-more",{props:{more:{type:Boolean,require:!1,default:function(){return!0}},options:{type:Object,default:function(){return[{value:"New York",label:"New York"},{value:"London",label:"London"},{value:"Sydney",label:"Sydney"},{value:"Ottawa",label:"Ottawa"},{value:"Paris",label:"Paris"},{value:"Canberra",label:"Canberra"}]}}},data:function(){return{selectMore:[],select:""}},methods:{selectMul:function(){this.more?this.$emit("input",this.selectMore):this.$emit("input",this.select)}},template:'<div>\n        <div v-if="more">\n            <i-select v-model="selectMore" v-on:on-change="selectMul()" filterable multiple style="width:260px">\n               <i-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</i-option>\n            </i-select>\n        </div>\n        <div v-if="!more">\n        <i-select v-model="select" v-on:on-change="selectMul()" style="width:260px">\n           <i-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</i-option>\n        </i-select>\n</div>\n</div> '});