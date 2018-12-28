Vue.component('ht-add-del-btn',{
    methods:{
        add(){
            this.$emit('add');
        },
        del(){
            this.$emit('del');
        },
        modify(){
            this.$emit('modify')
        },
        view(){
            this.$emit('view')
        }
    },
    template:`<div class="btn-menu">
    <span @click="add">新增</span>
    <span class="split-line"></span>
    <span @click="del">删除</span>
    <span class="split-line"></span>
    <span @click="modify">修改</span>
    <span class="split-line"></span>
    <span @click="view">查看</span>
</div>`
})