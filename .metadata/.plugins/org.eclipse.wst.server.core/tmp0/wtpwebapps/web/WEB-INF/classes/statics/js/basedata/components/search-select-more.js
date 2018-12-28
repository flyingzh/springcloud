Vue.component('search-select-more', {
    props: {
        init:{
            require: false,
        },
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
                        code: 'New York',
                        name: 'New York'
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
    mounted(){
        if(this.more){
            this.selectMore = this.init;
        }else {
            this.select = this.init;
        }
    },
    template: `<div>
        <div v-if="more">
            <i-select v-model="selectMore" v-on:on-change="selectMul()" filterable multiple>
               <i-option v-for="item in options" :value="item.code" :key="item.value">{{ item.name }}</i-option>
            </i-select>
        </div>
        <div v-if="!more">
        <i-select v-model="select" v-on:on-change="selectMul()">
           <i-option v-for="item in options" :value="item.code" :key="item.value">{{ item.name }}</i-option>
        </i-select>
        </div>
</div> `
});
