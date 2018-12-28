Vue.component('ht-label-select',{
    data(){
        return{
           value: '',
        }
    },
    methods:{
        change_select(value) {
            this.$emit('change',value)
        },
        operate_arr() {
            this.options.forEach(row => {
                if(!this.showValue) return;
                row.label = row.value + ' ' + row.label
            })
        }
    },
    mounted(){
        this.operate_arr();
    },
    props:{
        options:{
            type: Array,
            default(){
                return []
            }
        },
        disabled:{
            default(){
                return false;
            }
        },
        showValue:{
            default(){
                return false;
            }
        },
        width:{
            default(){
                return 100;
            }
        },
        title:{}
    },
    template:  `
    <div :style={width:width}>
        <i-select v-model="value" filterable clearable :disabled="disabled" @on-change="change_select(value)">
            <i-option v-for="item in options" :value="item.label" :key="item.value"> {{ item.label }}</i-option>
        </i-select>
    </div>
    `
})