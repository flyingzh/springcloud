Vue.component('edit-formula', {
    data () {
        return {
            show: this.value,
            dataList: [],
            computeTypes: [
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
            reportFormula:{
                id:0,   //主键id
                accountId :0, //科目id
                discountSubject:'',//科目名称
                rowNum : 0,
                computeType:'',//运算符号
                valueRule : 0,//取数规则
                computeTypeName:'',//取数规则名称
                reportContentId:0,//报表内容关联id
                reportContentName:''//统计项名称
            },

            subjectVisable: false,
            reload: true,
            curTable: '',
            currentSelectRow: '',
            addData: '',
            operatorList: [
                {
                    label: '+',
                    value: 1,
                },
                {
                    label: '-',
                    value: 2,
                },
            ],
            monList:[
                {
                    label: '期初余额',
                    value: 1,
                },
                {
                    label: '期末余额',
                    value: 2,
                },
                {
                    label: '借方发生额',
                    value: 3,
                },
                {
                    label: '贷方发生额',
                    value: 4,
                },
                {
                    label: '借方本年累计发生额',
                    value: 5,
                },
                {
                    label: '贷方本年累计发生额',
                    value: 6,
                },
                {
                    label: '利润表本期实际发生额',
                    value: 7,
                },
                {
                    label: '利润表本年实际发生额',
                    value: 8,
                },
            ],
            subjectVisable: false,

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
        //科目双击返回数据
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            this.reportFormula.accountId = treeNode.id;
            /*this.reportFormula.discountSubjectCode = treeNode.subjectCode;*/
            this.reportFormula.discountSubject = treeNode.subjectName;
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
        // subjectDate (value) {
        //     this.formData.subject = value;
        // },
        // 添加
        add () {
            var _this = this;
            var flag = true;
            console.log( _this.dataList, '==== _this.dataList');
            if (_this.dataList.length > 0){
                    _this.dataList.forEach(row => {
                        if(row.accountId === _this.reportFormula.accountId){
                            if (row.valueRule === _this.reportFormula.valueRule){
                                flag = false;
                                // _this.$Message.info({
                                //     content: "科目和取数规则重复",
                                //     duration: 3
                                // });
                                _this.$Modal.warning({
                                    title: '警告',
                                    content: '科目和取数规则重复'
                                });
                            }
                    }
                });
            }
            if (flag){
                //  请求接口，
                this._ajaxAddData();
            }
        },
        _ajaxAddData () {
            var _this = this;
            var _url = contextPath+'/report/saveFormula';
            this.reportFormula.reportContentId = this.fatherid;
            this.reportFormula.reportContentName = this.headline;
            this.reportFormula.rowNum = this.rowNums;
            var _parmes = _this.reportFormula;
            console.log(_parmes,"_parmes========")
            $.ajax({
                type: 'post',
                data: JSON.stringify(_parmes),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    console.log(res,"------------");
                    var _txt = '';
                    var _title = '';
                    if (res.code === '100100') {
                        setTimeout(function () {
                            _this._ajaxList();
                        }, 1000);
                        _txt = res.msg;
                        _title = '成功';
                    } else {
                        _txt = res.msg;
                        _title = '警告';
                    }
                    // _this.$Message.info({
                    //     content: _txt,
                    //     duration: 3
                    // });
                    _this.$Modal.warning({
                        title: _title,
                        content: _txt
                    });
                   // _this.addData = res.data[0];
                   // _this.dataList.unshift(_this.addData);
                   // this._ajaxList();
                },
                error: function (code) {
                    _this.$Modal.error({
                        title:'警告',
                        content:'请求异常,请联系管理员'
                    })
                }
            });
        },
        //保存
        save () {
            this.$emit('close');
        },
        _ajaxDelete (id) {
            var _this = this;
            var _url = contextPath+'/report/deleteFormula';
            $.ajax({
                type: 'post',
                data: {"id":id},
                url: _url,
                dataType: 'json',
                success: function (res) {
                    var _txt = '';
                    var _title = '';
                    if (res.code === '100100') {
                        _txt = res.msg;
                        _title = '成功';
                    } else {
                        _txt = res.msg;
                        _title = '警告';
                    }
                    // _this.$Message.info({
                    //     content: _txt,
                    //     duration: 3
                    // });
                    _this.$Modal.warning({
                        title: _title,
                        content: _txt
                    });

                },
                error: function (code) {
                    _this.$Modal.error({
                        title:'错误',
                        content:'请求异常,请联系管理员'
                    })
                }
            });
        },
        _ajaxList () {
            var _this = this;
            var arr = _this.$parent.formData.split('_');
            console.log("arr-->",arr);
            var _url = contextPath+'/report/formulaList';
            var _parame = {"rowNum":_this.rowNums,"tableName":"xjllb","accountYear":arr[0],"accountPeriod":arr[1]};
            console.log(_parame,"----=-=-=-=-=-=-----");
            $.ajax({
                type: 'post',
                data: _parame,
                url: _url,
                dataType: 'json',
                success: function (res) {
                    console.log("=========res=========1111",res);
                    var _txt = '';
                    if (res.code == '100100') {
                        let data = res.data;
                        _this.dataList = data;
                    } else {
                        _txt = res.msg;
                        _this.$Modal.warning({
                            title: '警告',
                            content: _txt
                        });
                    }
                },
                error: function (code) {
                    _this.$Modal.error({
                        title:'错误',
                        content:'请求异常,请联系管理员'
                    })
                }
            });
        },
        clickTr (item, index) {
            this.currentSelectRow = index;
            this.curTable = '2';
        },
        del (item) {
            console.log(item,"操作按钮----")
            //删除按钮
            this._ajaxDelete(item.id);
            let index = this.dataList.findIndex(row => {
                return row.id == item.id;
            });
            if (index < 0) return;
            this.dataList.splice(index, 1);
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
        endVal () {
            let total = 0;
            this.dataList.forEach(row => {
                let num = row.computeType + row.amount1;
                total += this.formatNum(num, 1);
            })
            total = accounting.formatMoney(total, "", 2);
            return total ? total : 0;
        },
        beganVal () {
            let total = 0;
            this.dataList.forEach(row => {
                let num = row.computeType + row.amount2;
                total += this.formatNum(num, 1);
            })
            total = accounting.formatMoney(total, "", 2);
            return total ? total : 0;
        },
    },
    filters: {
        filterMoney (value) {
            return accounting.formatMoney(value, "", 2)
        },
        filterOperate (value) {
            switch (value) {
                case 1:
                    return '期初余额';
                case 2:
                    return '期末余额';
                case 3:
                    return '借方发生额';
                case 4:
                    return '贷方发生额';
                case 5:
                    return '借方本年累计发生额';
                case 6:
                    return '贷方本年累计发生额';
                case 7:
                    return '利润表本期实际发生额';
                case 8:
                    return '利润表本年实际发生额';
                default:
                    break;
            }

        }
    },
    props: ['title', 'value','fatherid','rowNums','headline'],
    template: `
        <div>
            <Modal
                :title='title'
                v-model="show"
                width="800"
                @on-cancel='closeModal'
                :mask-closable="false">
                <label>科目：</label>
                <i-input v-model="reportFormula.discountSubject" style="width:200px" readonly="true" @on-click="showSubjectVisable" icon="ios-list-outline" type="text"></i-input>
                <label class="pl10">运算符号</label>
                <i-select v-model="reportFormula.computeType" class="wt80 ">
                        <i-option v-for="item in operatorList" :value="item.label" :key="item.value">{{item.label}}</i-option>
                </i-select>
                <label class="pl10">取数规则</label>
                <i-select v-model="reportFormula.valueRule" class="wt125 ">
                    <i-option v-for="item in monList" :value="item.value" :key="item.value">{{item.label}}</i-option>
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
                                <td class="wt125">本月数</td>
                                <td class="wt100">本年数</td>
                                <td class="wt80">操作</td>
                            </tr>
                            </thead>
                            <tbody >
                            <tr lay-size="sm" v-for="(item,idx) in dataList" @click="clickTr(item,idx)"  :class="{success: currentSelectRow === idx}" >     
                                <td class="wt200">{{item.account}}</td>
                                <td class="wt100">{{item.computeType}}</td>
                                <td class="wt100">{{item.valueRule | filterOperate}}</td>
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
                                <td class="wt100"></td>
                                <td class="wt125">{{endVal}}</td>
                                <td class="wt100">{{beganVal}}</td>
                                <td class="wt80"></td>    
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div slot="footer">
                    <i-button type="primary" @click="save">确定</i-button>
                    <i-button @click="save">取消</i-button>
                </div>
            </Modal>
            <ht-modal-subject v-model="subjectVisable" @close="subjectClose" @save="subjectData" ref="modalSubject"></ht-modal-subject>
        </div>
    `
})