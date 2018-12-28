Vue.component('ht-auto-complete',{
    data() {
        return {
            value1:''
        }
    },
    methods: {
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        change(value){
            console.log(value);
        },
        bindModal(){
            var _this = this;
            $('.ivu-icon-ios-search').on('click',function(){
                _this.$emit('select-sub')
            })
        },
        focus(ev){
            console.log(1,ev)
        },
    },
    computed: {
        list(){
            let arr = [];
            this.datas.forEach( row => {
                let status = typeof row;
                if(status ==='object'){
                    arr.push(row.name)
                } else {
                    arr.push(row)
                }
            })
            return arr
        },
    },
    props:{
        value:{},
        datas: {
            type: Array
        },
        placeholder:{
            default: '请输入'
        }
    },
    mounted(){
        this.bindModal();
    //     <auto-complete
    //     v-model="value1"
    //     :data="list"
    //     icon="ios-search"
    //     @on-change="change"
    //     @focus="focus"
    //     :filter-method="filterMethod"
    //     :placeholder="placeholder">
    // </auto-complete>
    },
    template: `
    <div>
       {{value1}}
        <auto-complete
            v-model="value1"
            :data="list"
            :filter-method="filterMethod"
            :placeholder="placeholder">
        </auto-complete>
    </div>
       
    `
})