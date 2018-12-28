Vue.component('search-select-more', {
    props: {
        more:{
            type: Boolean,
            require: false,
            default(){
                return true;
            }
        },
        options:{
            type: Object,
            default: function () {
                return [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ];
            }
        }
    },
    data () {
        return {
            selectMore: [],
            select: ''
        }
    },
    methods: {
        selectMul(){
            if(this.more){
                this.$emit('input', this.selectMore);
            }else {
                this.$emit('input', this.select);
            }
        },
    },
    template: `<div>
        <div v-if="more">
            <i-select v-model="selectMore" v-on:on-change="selectMul()" filterable multiple style="width:260px">
               <i-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</i-option>
            </i-select>
        </div>
        <div v-if="!more">
        <i-select v-model="select" v-on:on-change="selectMul()" style="width:260px">
           <i-option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
</div>
</div> `
});
