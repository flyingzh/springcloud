Vue.component("ht-review-steps",{
    props:{
        steplist:Array
    },
    template:` <steps :current="steplist[1] && steplist[1].currentLevel" style="margin-bottom: 20px;">
            <step icon="checkmark-circled" v-for="item in steplist" :title="item.processLevel" :content="typeof(item.userName) =='undefined'?'':'当前节点审批人：'+item.userName"></step>
        </steps>`
})

//用法
// <navlist :steplist.sync="steplist"></navlist>