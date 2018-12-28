Vue.component('ht-input-voucher',{
    data(){
        return{
           inputValue: '',
           valueId:'',
           show: false,
           newOptions: [],
           oldOptions: [],
        }
    },
    methods:{
        operate_arr() {
            this.oldOptions = JSON.parse(this.options)
            this.oldOptions.forEach(row => {
                this.$set(row,'active',false);
                if(!this.showValue) return ;
                row.label = row.value + ' ' + row.label
            })
            this.newOptions = [].concat(this.oldOptions);
        },
        focus() {
            this.show = true;
        },
        blur() {
            setTimeout(()=>{
                this.show = false;
            }, 250)
        },
        input(event) {
            let value = event.target.value;
            this.newOptions = this.query(value,this.oldOptions)
        },
        query(str, container){
            var newList = [];
            //新的列表
            var startChar = str.charAt(0);
            //开始字符
            var strLen = str.length;
            //查找符串的长度
            for (var i = 0; i < container.length; i++) {
                var obj = container[i];
                var isMatch = false;
                for (var p in obj) {
                    if ( typeof (obj[p]) == "function") {
                        obj[p]();
                    } else {
                        var curItem = "";
                        if(obj[p]!=null){
                            curItem = obj[p];
                        }
                        for (var j = 0; j < curItem.length; j++) {
                            if (curItem.charAt(j) == startChar)//如果匹配起始字符,开始查找
                            {
                                if (curItem.substring(j).substring(0, strLen) == str)//如果从j开始的字符与str匹配，那ok
                                {
                                    isMatch = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (isMatch) {
                    newList.push(obj);
                }
            }
            return newList;
        },
        add() {
            this.$emit("add");
        },
        select_li(item) {
            this.newOptions.forEach(row => {
                row.active = false;
            })
            item.active = true;
            this.inputValue = item.label;
            this.valueId = item.value;
            this.getValue&&(this.$emit('change',this.valueId));
            !this.getValue&&(this.$emit('change',this.inputValue));

        },
    },
    mounted(){
        this.operate_arr();
    },
    props:{
        options:{
            // type: Array,
            default(){
                return []
            }
        },
        oldValue:{},
        disabled:{
            default(){
                return false;
            }
        },
        // 列表中是否显示 为 value - label格式
        showValue:{
            default(){
                return false;
            }
        },
        title:{},
        // 返回值是否是value
        getValue:{
            default(){
                return true;
            } 
        },
        value:{},
    },
    template:  `
    <div class="ht-input-voucher">
        <input v-model="value"
            class="ht-voucher-input form-control"
            placeholder=""
            @input="input"
            @blur="blur"
            @focus="focus"></input>
        <!--  -->
        <div class="ht-search" v-if="show&&newOptions.length">
            <ul>
                <li v-for="item in newOptions" :key="item.value"
                    @click="select_li(item)"
                    :class="[item.active ? 'active' : '']">
                    {{item.label}}
                </li>
            </ul>
            <p @click="add" class="pl10"><i class="glyphicon glyphicon-plus"></i> 新增{{title}}</p>
        </div>
    </div>
    `
})