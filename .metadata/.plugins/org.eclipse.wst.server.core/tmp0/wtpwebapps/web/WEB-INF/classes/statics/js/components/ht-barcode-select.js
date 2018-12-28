Vue.component('ht-barcode-select', {
    props: {
        optionData: {
            type: Object,
            require: true
        },
        initModel: {
            type: String
        },
        isDisabled: {
            type: Boolean
        },
        codesUsed: {
            type: Object,
            'default': {}
        }
    },
    data() {
        return {
            isShow: false,
            code:''
        }
    },
    methods: {
        transitem(item){
            this.$emit('getitem', item);
        },
        chooseOne(item) {
            this.code = item.code;
            this.transitem(item);
            this.$emit('one');
            this.$emit('input', item.id);
            this.$emit('on-change');
            this.isShow = false;
        },
        transcode(){
            this.$emit('getinput',this.code);
        },
        change() {
            this.isShow = true;
            this.transcode();
            this.$emit('change');
        },
        inInput(){
           /* if(this.code === ''){
                this.optionData = []
            }*/
            this.isShow = true;
        },
        leave() {
            setTimeout(()=>{
                this.isShow = false;
            },300)
        }
    },
    watch:{
        initModel:{
            handler(){
                this.code = this.initModel;
            }
        }
    },
    mounted(){
        this.code = this.initModel;

        var vm = this;
        $(this.$el)
            .off('.ivu-input-icon-clear')
            .on('click', '.ivu-input-icon-clear', function(){
                vm.isShow = false;
            });
    },
    template: `<div class="ht-select">
        <i-input :disabled="isDisabled" class="ht-width-md" @on-change="change" @on-blur="leave" @on-focus="inInput" v-model="code" :clearable="!isDisabled" ></i-input>
        <div class="ivu-select-dropdown" v-show="isShow" >
            <ul style="width:auto;min-width:200px;">
                <li v-if="optionData.length == 0" style="width:200px">暂无数据</li>
                <li v-if="!(item.code in codesUsed)" v-for="(item,index) in optionData" :key="index" @click="chooseOne(item)">{{item.code}}&nbsp;|&nbsp;{{item.name}}</li>
            </ul>
        </div>
    </div>`
});