Vue.component('search-select-more', {
    props: ['data'],
    data () {
        return {
            dataList: [
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
            ],
            dataTemp: [],
            selectMore: [],
            filterValue: ''
        }
    },
    methods: {
        selectMul(){
            this.$emit('select', {data: this.selectMore});
        },
        filter(){
            this.dataTemp = this.dataList.filter((item, index)=>{
                return item.label.indexOf(this.filterValue) > -1;
            })
        }
    },
    mounted(){
        this.dataTemp = this.dataList;
    },
    template: ` <div>
    <i-select v-model="selectMore" v-on:on-change="selectMul()" multiple style="width:260px">
       <i-input v-model="filterValue" v-on:input="filter" placeholder="filter"></i-input>
       <i-option v-for="item in dataTemp" :value="item.value" :key="item.value">{{ item.label }}</i-option>
    </i-select>
</div>`
});
