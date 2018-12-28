Vue.component('date-select', {
    props:{
        init:{
            require: false,
        },
        'end':{
            require: false,
            default(){
                return false;
            }
        }
    },
    data(){
        return {
            date: ''
        }
    },
    methods:{
        change(){
			let currDate = this.date;
            let date = new Date(currDate);
            let base = date.getFullYear() + '-' +
                (((date.getMonth() + 1)>9) ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1)) + '-' +
                (date.getDate()>9 ? date.getDate() : '0' + date.getDate());
            let start = (currDate != '') ? base + ' 00:00:00' : '';
            let end = (currDate != '') ? base + ' 23:59:59' : '';
            if(!this.end){
                this.$emit('input', start);
            }else {
                this.$emit('input', end);
            }
            console.log(start, end)
        }
    },
    watch:{
        clear(){
            this.date = '';
        }
    },
    mounted(){
        this.date = this.init;
    },
    template: ` <div class="date-select">
   <date-picker v-model="date" 
   @on-change="change" 
   type="date"
   placeholder="Select date"
   format="yyyy-MM-dd"></date-picker>
</div>`
})
;
