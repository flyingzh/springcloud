Vue.component('edit-formula', {
    data () {
        return {
            show: this.value,
            dataList: [],
            operate: [
                {
                    label: '1001 库存现金',
                    value: 1,
                },
                {
                    label: '100101 现金',
                    value: 11,
                },
                {
                    label: '100102 库存外币',
                    value: 12,
                },
                {
                    label: '1002 银行存款',
                    value: 2,
                },
            ],
            subject: '',
            subjectVisable: false,
            reload: true,
            curTable: '',
            currentSelectRow: '',
            addData: [],
            delDdata: [],
            subjectVisable: false,
            formData: {     // 科目内容
                discountSubjectId: 0,
                discountSubjectCode: '',
                discountSubject: ''
            },
        }
    },
    methods: {
        // 科目下拉框
        showSubjectVisable () {
            this.subjectVisable = true;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            this.formData.discountSubjectId = treeNode.id;
            this.formData.discountSubjectCode = treeNode.subjectCode;
            this.formData.discountSubject = treeNode.subjectName;
            // vm.row.subjectLabel = treeNode.subjectName;
            // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
            // vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
        },
        editClick (data) {
            console.log(data);
        },
        closeModal () {
            this.$emit('close')
        },

        selectSub () {
            this.subjectVisable = true;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        cancleRemark () {

        },
        delRemark () {

        },

        // 确定科目，请求接口，返回新的添加项
        subjectDate (value) {
            this.subject = value;
            console.log("确定科科目信息: ",value);
        },
        // 添加
        add () {
            //  请求接口，
            this._ajaxAddData();
            if (this.addData && this.addData.length > 0) {
                this.dataList.unshift(this.addData[0]);
                this.addData = [];
            }
        },
        _ajaxAddData () {
            var _this = this;
            var _arr = this.accountYearPeriod.split('_');
            var _url = `/web/reportProfit/formulaAmount?accountYear=${_arr[0]}&accountPeriod=${_arr[1]}&accountId=${this.formData.discountSubjectId}` + "&tableName=lrb&valueRule=1";
            $.ajax({
                type: 'POST',
                data: '',
                url: _url,
                dataType: 'json',
                async: false,
                success: function (res) {
                    _this.addData[0] = res.data;
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        // 保存
        save () {
            this._ajaxSaveData();
             this.$emit('reflist');
            // this.$emit('close');
        },
        _ajaxSaveData () {
            var _this = this;
            var formulaList = [];
            _this.dataList.forEach(item => {
                if (!item.id || item.id < 0) {
                    formulaList.push(item);
                }
            });
            _this.delData.forEach(item => {
                if (item.id > 0) {
                    item.status = 2;
                    formulaList.push(item);
                }
            });

            if (formulaList.length <= 0) {
                alert("数据没有发生变化!");
                return false;
            }
            formulaList.forEach(item => {
                delete item['account'];
                item.reportContentId = reportVue.reportContentId;
                item.reportContentName = reportVue.reportContentName;
            });
            var _url = contextPath+'/reportProfit/formulaSave';
            $.ajax({
                type: 'POST',
                data: JSON.stringify(formulaList),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    _this.$Message.success(res.msg);
                    _this.$emit('close');
                    _this.delData = [];
                    _this.addData = [];
                    _this.dataList = [];
                    _this.$emit('reflist');
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        _ajaxList () {
            var _this = this;
            _this.addData = [];
            _this.delData = [];
            _this.dataList = [];
            var _arr = this.accountYearPeriod.split('_');
            var _url = `/web/reportProfit/formulaList?accountYear=${_arr[0]}&accountPeriod=${_arr[1]}&tableName=lrb&reportContentId=${reportVue.reportContentId}`;
            $.ajax({
                type: 'POST',
                data: '',
                url: _url,
                dataType: 'json',
                async: false,
                success: function (res) {
                    let data = res.data;
                    if (data) {
                        _this.dataList = data;
                    } else {
                        _this.dataList = [];
                    }

                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        refresh () { },
        clickTr (item) {
            this.currentSelectRow = item.id;
            this.curTable = '2';
        },
        table2ChickTr2 () { },
        del (item) {
            console.log(item)
            let index = this.dataList.findIndex(row => {
                return row.id == item.id;
            })
            if (index < 0) return;
            var tempData = this.dataList.splice(index, 1);
            tempData.forEach(item => {
                this.delData.push(item);
            });

        },
        // 格式化数字
        formatNum (f, digit) {
            // f = value  digit= 比例
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
    },
    watch: {
        value (val) {
            this.show = val;
            if (val) {
                this._ajaxList();
            }
        }
    },
    computed: {
        totalAmount1 () {
            let total = 0;
            this.dataList.forEach(row => {
                total += this.formatNum(row.amount1, 1);
            })
            total = accounting.formatMoney(total, "", 2);
            return total ? total : 0;
        },
        totalAmount2 () {
            let total = 0;
            this.dataList.forEach(row => {
                total += this.formatNum(row.amount2, 1);
            })
            total = accounting.formatMoney(total, "", 2);
            return total ? total : 0;
        },
    },
    filters: {
        filterMoney (value) {
            return accounting.formatMoney(value, "", 2)
        }
    },
    props: ['title', 'value','accountYearPeriod'],
    template: `
        <div>
            <Modal
                :title='title'
                v-model="show"
                width="800"
                @on-cancel='closeModal'
                :mask-closable="false">
                <label>科目：</label>
               
                <i-input v-model="formData.discountSubject" style="width:200px" readonly="true" @on-click="showSubjectVisable" icon="ios-list-outline" type="text"></i-input>

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
            <ht-modal-subject v-model="subjectVisable" @close="subjectClose" @save="subjectData" ref="modalSubject"></ht-modal-subject>
        </div>
    `
})