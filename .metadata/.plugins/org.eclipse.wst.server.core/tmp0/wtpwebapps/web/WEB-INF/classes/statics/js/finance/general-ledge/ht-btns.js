Vue.component('ht-btns', {
    props:['isSearch', 'isAdd'],
    data () {
        return {
        }
    },
    methods: {
        search(){
            this.$emit('search');
        },
        clear(){
            this.$emit('clear');
        },
        add(){
            this.$emit('add');
        },
        del(){
            this.$emit('del');
        }

    },
    template: ` <div>
        <div v-if="isSearch">
            <i-button type="primary" @click="search">搜索</i-button>
            <i-button type="primary" @click="clear">清空</i-button>
        </div>
        <div v-if="isAdd">
            <i-button type="primary" @click="add">新增</i-button>
            <i-button type="primary" @click="del">删除</i-button>
        </div>
       
    </div>`
});
