Vue.component('edit-detail', {
    data () {
        return {
            show: this.value,
            dataList: [],
            operates: [],
            formRuleData: {
                accountId: '',   //会计科目ID
                computeType: '', //运算符号
                valueRule: '',   //取数规则
                reportContentId: '',  //报表关联(content表id)
                reportContentName: '', //统计项名称(content表Name)
                accountYearPeriod: ''  //会计年度期间
            },
            summation:{
                sumEndVal:'',
                sumBeganVal:''
            },
            subjectVisable: false,
            reload: true,
            curTable: '',
            currentSelectRow: '',
            addData: '',
            operatorList: [
                {
                    label: '+',
                    computeType: '+',
                },
                {
                    label: '-',
                    computeType: '-',
                },
            ],
            accessRulesList: [
                {
                    label: '余额',
                    valueRule: 1,
                },
                {
                    label: '借方余额',
                    valueRule: 2,
                },
                {
                    label: '贷方余额',
                    valueRule: 3,
                }
            ],
            subjectVisable: false,
            formData: {     // 科目内容
                discountSubjectId: 0,
                discountSubjectCode: '',
                discountSubject: ''
            },
        }
    },
    created: function () {
        //console.log(this.clickedRow);
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
            //console.log(treeNode, '====treeNode');
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
        // 确定科目，请求接口，返回新的添加项
        subjectDate (value) {
            this.formData.subject = value;
        },
        // 添加
        add () {
            //  请求接口，
            this._ajaxAddData()
        },
        _ajaxAddData () {

            var _this = this;
            _this.formRuleData.accountId = _this.formData.discountSubjectId;
            //报表关联id(Content)
            _this.formRuleData.reportContentId = _this.rid;
            //统计项名称(科目名)
            _this.formRuleData.reportContentName = _this.rname;
            //会计年度期间
            _this.formRuleData.accountYearPeriod = _this.ayp;

            let verifyAccount =  _this.formRuleData.accountId;
            let verifyComputeType = _this.formRuleData.computeType;
            let verifValueRule = _this.formRuleData.valueRule;
            if(verifyAccount==0){
                _this.$Message.info({
                    content:"科目未选择,请先选择科目",
                    duration:3
                })
                return
            }else if(verifyComputeType==''){
                _this.$Message.info({
                    content:"运算符号未选择,请先选择运算符号",
                    duration:3
                })
                return
            }else if (verifValueRule==''){
                _this.$Message.info({
                    content:"取数规则未选择,请先选择取数规则",
                    duration:3
                })
                return
            }

            let param = _this.formRuleData;
            var _url = rcContextPath+'/balanceSheet/saveOneFormula';
            $.ajax({
                type: 'POST',
                data: JSON.stringify(param),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code == '100100') {
                        _this._ajaxList();
                    }
                    // _this.addData = res.data[0];
                    //_this.dataList.unshift(_this.addData);
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        // 保存
        save () {
            //window.location.reload();
            this.closeModal();
        },
        _ajaxSaveData () {
            var _this = this;
            // _this.
            var _url = rcContextPath+'/balanceSheet/saveMoneyContent';
            $.ajax({
                type: 'POST',
                data: '',
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    _this.$Message.success(res.msg);
                    _this.$emit('close')
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        _ajaxList () {
            var _this = this;
            _this.formRuleData.accountId = _this.formData.discountSubjectId;
            //报表关联id(Content)
            _this.formRuleData.reportContentId = _this.rid;
            //统计项名称(科目名)
            _this.formRuleData.reportContentName = _this.rname;
            //会计年度期间
            _this.formRuleData.accountYearPeriod = _this.ayp;
            let param = _this.formRuleData;
            var _url = rcContextPath+'/balanceSheet/listFormula';
            $.ajax({
                type: 'post',
                data: JSON.stringify(param),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code == '100100') {
                        let data = res.data;
                        let _sum = data.sum;
                        _this.dataList = data.formulaList;
                        _this.summation= data.sum;
                        //console.log(data.sum);
                        //console.log(_this.clickedRow);

                        if (_this.col == 'assetField') {
                            _this.clickedRow.assetAmount1 = _sum.sumEndVal;
                            _this.clickedRow.assetAmount2 = _sum.sumBeganVal;
                        } else {
                            _this.clickedRow.debtAmount1 = _sum.sumEndVal;
                            _this.clickedRow.debtAmount2 = _sum.sumBeganVal;
                        }
                        //console.log(_this.clickedRow)
                        _this.$nextTick(function(){
                            _this.$emit('save', _this.clickedRow);
                        });
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        clickTr (item, index) {
            this.currentSelectRow = index;
            this.curTable = '2';
        },
        del (item) {
            let that = this;
            let _param ={'formulaId':item.id};
            var _url = rcContextPath+'/balanceSheet/deleteFormulaById';
            $.ajax({
                type: 'post',
                data: _param,
                url: _url,
                dataType: 'json',
                success: function (res) {
                    if (res.code == '100100') {
                        let index = that.dataList.findIndex(row => {
                            return row.id == item.id;
                        })
                        if (index < 0) return;
                        that.dataList.splice(index, 1);
                        that._ajaxList()
                    }else {
                        that.$Message.info({
                            content:"删除失败",
                            duration:res.msg
                        })
                    }
                },
                error: function (code) {
                    console.log(code);
                }
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
        // endVal () {
        //     let total = 0;
        //     this.dataList.forEach(row => {
        //         let num = row.computeType + row.endVal;
        //         total += this.formatNum(num, 1);
        //     })
        //     total = accounting.formatMoney(total, "", 2);
        //     return total ? total : 0;
        // },
        // beganVal () {
        //     let total = 0;
        //     this.dataList.forEach(row => {
        //         let num = row.computeType + row.beganVal;
        //         total += this.formatNum(num, 1);
        //     })
        //     total = accounting.formatMoney(total, "", 2);
        //     return total ? total : 0;
        // },
    },
    filters: {
        filterMoney (value) {
            return accounting.formatMoney(value, "", 2)
        },
        filterOperate (value) {
            let num = value+'';
            switch (num) {
                case '1':
                    return '余额';
                case '2':
                    return '借方余额';
                case '3':
                    return '贷方余额';
                default:
                    break;
            }

        }
    },
    props: ['title', 'value', 'rid', 'ayp', 'rname', 'clickedRow', 'col'],
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
                <label class="pl10">运算符号</label>
                <i-select v-model="formRuleData.computeType" class="wt80 ">
                    <i-option v-for="item in operatorList" :value="item.computeType" :key="item.computeType">{{item.label}}</i-option>
                </i-select>
                <label class="pl10">取数规则</label>
                <i-select v-model="formRuleData.valueRule" class="wt125 ">
                    <i-option v-for="item in accessRulesList" :value="item.valueRule" :key="item.valueRule">{{item.label}}</i-option>
                </i-select>
                <i-button @click="add">添加</i-button>
                <div class="ht-receivableW-table mt10"> 
                    <div class="ht-wrapper-tbl">
                        <table class="table tablediv">
                            <thead>
                            <tr>
                                <td class="wt200">项目</td>
                                <td class="wt100">运算方式</td>
                                <td class="wt100">取数规则</td>
                                <td class="wt125">期末数</td>
                                <td class="wt100">年初数</td>
                                <td class="wt80">操作</td>
                            </tr>
                            </thead>
                            <tbody >
                            <tr lay-size="sm" v-for="(item,idx) in dataList" @click="clickTr(item,idx)"  :class="{success: currentSelectRow === idx}" >     
                                <td class="wt200">{{item.accontName}}</td>
                                <td class="wt100">{{item.computeType}}</td>
                                <td class="wt100">{{item.valueRule | filterOperate}}</td>
                                <td class="wt125">{{item.endVal | filterMoney}}</td>
                                <td class="wt100">{{item.beganVal | filterMoney}}</td>
                                <td class="wt80">
                                    <Icon type="close-round" @click="del(item)"></Icon>
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td class="wt200">合计</td>
                                <td class="wt100"></td>
                                <td class="wt100"></td>
                                <td class="wt125">{{summation.sumEndVal}}</td>
                                <td class="wt100">{{summation.sumBeganVal}}</td>
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