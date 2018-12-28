Vue.component('edit-formula',{
    data(){
        return {
            show:this.value,
            dataList:[],
            operate:[
                {
                    label:'1001 库存现金',
                    value:1,
                },
                {
                    label:'100101 现金',
                    value:11,
                },
                {
                    label:'100102 库存外币',
                    value:12,
                },
                {
                    label:'1002 银行存款',
                    value:2,
                },
            ],
            subject:'',
            subjectVisable:false,
            reload:true,
            curTable: '',
            currentSelectRow:'',
            addData:[],
            delDdata:[],
        }
    },
    methods:{
        editClick (data) {
            console.log(data);
          },
        closeModal(){
            this.$emit('close')
        },
        
        selectSub(){
            this.subjectVisable = true;
        },
        subjectClose(){
            this.subjectVisable = false;
        },
        cancleRemark(){

        },
        delRemark(){

        },
        
        // 确定科目，请求接口，返回新的添加项
        subjectDate(value){
            this.subject = value;
        },
        // 添加
        add(){
            //  请求接口，
            this._ajaxAddData()
            if(this.addData && this.addData.length>0){
                this.dataList.unshift(this.addData[0]);
                this.addData = [];
            }
        },
        _ajaxAddData(){
            var _this = this;
            var _url = './../../report/formulaAmount?accountId='+this.subject+"&tableName=利润表&valueRule=1";
            $.ajax({
                type: 'POST',
                data: '',
                url: _url,
                dataType: 'json',
                async:false,
                success: function(res){
                    _this.addData[0] = res.data;
                },
                error: function(code){
                    console.log(code);
                }
            });
        },
        // 保存
        save(){
            this._ajaxSaveData();
        },
        _ajaxSaveData(){
            var _this = this;
            var formulaList = [];
            _this.dataList.forEach(item=>{
                if(!item.id || item.id<0){
                    formulaList.push(item);
                }
            });
            _this.delData.forEach(item=>{
                if(item.id>0){
                    item.status = 2;
                    formulaList.push(item);
                }
            });

            if(formulaList.length<=0){
                alert("没有要保存的数据!");
                return false;
            }
            formulaList.forEach(item=>{
                delete item['account'];
                item.reportContentId = reportVue.reportContentId;
                item.reportContentName = reportVue.reportContentName;
            });
            var _url = './../../report/formulaSave';
            $.ajax({
                type: 'POST',
                data: JSON.stringify(formulaList),
                url: _url,
                dataType: 'json',
                contentType : 'application/json;charset=utf-8',
                success: function(res){
                    _this.$Message.success(res.msg);
                    _this.$emit('close')
                    _this.delData = [];
                    _this.addData = [];
                    _this.dataList = [];
                },
                error: function(code){
                    console.log(code);
                }
            });
        },
        _ajaxList(){
            var _this = this;
            _this.addData = [];
            _this.delData = [];
            _this.dataList = [];
            var _url = './../../report/formulaList?tableName=利润表&reportContentId='+reportVue.reportContentId;
            $.ajax({
                type: 'POST',
                data: '',
                url: _url,
                dataType: 'json',
                async:false,
                success: function(res){
                    let data = res.data;
                    if(data){
                        _this.dataList = data;
                    }else{
                        _this.dataList = [];
                    }

                },
                error: function(code){
                    console.log(code);
                }
            });
        },
        refresh(){},
        clickTr(item){
            this.currentSelectRow = item.id;
            this.curTable = '2';
        },
        table2ChickTr2(){},
        del(item){
            console.log(item)
            let index = this.dataList.findIndex(row=>{
                return row.id==item.id;
            })
            if(index < 0) return;
            var tempData = this.dataList.splice(index,1);
            tempData.forEach(item=>{
                this.delData.push(item);
            });

        },
        // 格式化数字
        formatNum(f, digit) {
            // f = value  digit= 比例
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
    },
    watch:{
        value(val){
            this.show = val;
            if(val){
                this._ajaxList();
            }
        }
    },
    computed: {
        totalAmount1(){
            let total = 0;
            this.dataList.forEach( row => {
                total += this.formatNum(row.amount1,1);
            })
            total = accounting.formatMoney(total, "", 2);
            return total ? total: 0;
        },
        totalAmount2(){
            let total = 0;
            this.dataList.forEach( row => {
                total += this.formatNum(row.amount2,1);
            })
            total = accounting.formatMoney(total, "", 2);
            return total ? total: 0;
        },
    },
    filters:{
        filterMoney(value){
            return accounting.formatMoney(value, "", 2)
        }
    },
    props: ['title','value'],          
    template: `
        <div>
            <Modal
                :title='title'
                v-model="show"
                width="800"
                @on-cancel='closeModal'
                :mask-closable="false">
                <label>科目：</label>
                <i-select v-model="subject" style="width:200px">
                    <i-option v-for="item in operate" :value="item.value" :key="item.value">{{item.label}}</i-option>
                </i-select>
                <i-button @click="selectSub">选择科目</i-button>
                <i-button @click="add">添加</i-button>
                <div class="ht-receivableW-table mt10"> 
                    <div class="ht-wrapper-tbl">
                        <table class="table tablediv">
                            <thead>
                            <tr>
                                <td class="wt200">项目</td>
                                <td class="wt100">运算方式</td>
                                <td class="wt125">本年累计金额</td>
                                <td class="wt100">本月金额</td>
                                <td class="wt80">操作</td>
                            </tr>
                            </thead>
                            <tbody >
                            <tr lay-size="sm" v-for="(item,idx) in dataList" @click="clickTr(item)"  :class="{success: currentSelectRow === item.id}" >     
                                <td class="wt200">{{item.account}}</td>
                                <td class="wt100">{{item.computeType}}</td>
                                <td class="wt125">{{item.amount1 | filterMoney}}</td>
                                <td class="wt100">{{item.amount2 | filterMoney}}</td>
                                <td class="wt80">
                                    <Icon type="close-round" @click="del(item)"></Icon>
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td class="wt200">合计</td>
                                <td class="wt100"></td>
                                <td class="wt125">{{totalAmount1}}</td>
                                <td class="wt100">{{totalAmount2}}</td>
                                <td class="wt80"></td>    
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div slot="footer">
                    <i-button type="primary" @click="save">确定</i-button>
                    <i-button @click="closeModal">取消</i-button>
                </div>
            </Modal>
            <subject-tree v-model="subjectVisable" @close="subjectClose" @save="subjectDate"></subject-tree>
        </div>
    `
})