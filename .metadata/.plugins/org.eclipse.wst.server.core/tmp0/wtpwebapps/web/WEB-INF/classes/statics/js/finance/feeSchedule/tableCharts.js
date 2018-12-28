Vue.component('table-charts',{
    data(){
        return {
        }
    },
    props:['value','option','reload','opens'],
    mounted(){
        this.setScharts();
    },
    watch:{
        value(){
            this.setScharts();
        },
        reload(value){
            console.log(value)
            value&&this.setScharts();
        },
        opens(value){
            console.log(value)
            value&&this.setScharts();
        }
    },
    methods:{

        setScharts() {
            let warp =  $('.chartWarp')
            if(this.value){
                $('.chartWarp').empty();
                $(`<div id="main" class="mt10 h300" v-show="${this.value}"></div>`).appendTo(warp);
                if(!document.getElementById('main')) return;
                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(document.getElementById('main')); 
                myChart.setOption(this.option,true); 
                console.log(this.option)
            }else{
                $('.chartWarp').empty();

            }
            this.$emit('get-reload')
        },
    },
    template:`
    <div class="chartWarp pl20 pr20">
    </div>
    `
})