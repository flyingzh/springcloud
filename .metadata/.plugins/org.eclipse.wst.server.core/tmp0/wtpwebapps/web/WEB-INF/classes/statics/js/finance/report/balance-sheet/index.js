var balance = new Vue({
    el: '#balanceSheet',
    data () {
        var that = this;
        return {
            dateTime: [], // 期数
            currDateTime: '',
            clickedRow: {},
            clickedCol: '',
            clickedIndex: 0,
            objDataList: {},
            objFormula: {},
            detailVisible: false,
            detailTitle: '',
            columnsDataList: [
                {
                    title: '资产',
                    key: 'assetField',
                    width: 210,
                    align: "left",
                    render: (h, params) => {
                        if (params.row.assetIsCompute != 1) return h('div', {
                            props: {
                                type: 'text',
                                size: 'small'
                            }
                        }, `${params.row.assetField}`);
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.clickedRow = params.row;
                                        that.clickedIndex = params.index;
                                        that.editMark(params, 'assetField');
                                    }
                                }
                            }, `${params.row.assetField}`)
                        ]);
                    }
                },
                {
                    title: '行次',
                    key: 'assetLineNum',
                    width: 70,
                    align: 'center'
                },
                {
                    title: '期末数',
                    key: 'assetAmount1',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        if (!params.row.assetAmount1) return;
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.editMark(params, 'assetAmount1');
                                    }
                                }
                            }, params.row.assetAmount1)
                        ]);
                    }
                },
                {
                    title: '年初数',
                    key: 'assetAmount2',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        if (!params.row.assetAmount2) return;
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.editMark(params, 'assetAmount2');
                                    }
                                }
                            }, params.row.assetAmount2)
                        ]);
                    }
                },
                {
                    title: '负债和所有者（或股东）权益',
                    key: 'debtField',
                    width: 220,
                    align: "left",
                    render: (h, params) => {
                        if (!params.row.debtField) {
                            return;
                        } else {
                            if (params.row.debtIsCompute != 1) {
                                return h('div', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, `${params.row.debtField}`);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                that.clickedRow = params.row;
                                                that.clickedIndex = params.index;
                                                that.editMark(params, 'debtField');
                                            }
                                        }
                                    }, `${params.row.debtField}`)
                                ]);
                            }
                        }
                    }
                },
                {
                    title: '行次',
                    key: 'debtLineNum',
                    width: 70,
                    align: 'center'
                },
                {
                    title: '期末数',
                    key: 'debtAmount1',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        if (!params.row.debtAmount1) return;
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.editMark(params, 'debtAmount1');
                                    }
                                }
                            }, params.row.debtAmount1)
                        ]);
                    }
                },
                {
                    title: '年初数',
                    key: 'debtAmount2',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        if (!params.row.debtAmount2) return;
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        that.editMark(params, 'debtAmount2');
                                    }
                                }
                            }, params.row.debtAmount2)
                        ]);
                    }
                }

            ],
            dataList: [],
            dataListStatus: false,
            editTitle: '',
            editId: '',
            editName: '',
            editAyp: '',
            editVisable: false,
            printModal: false,
            printInfo: {},
        }
    },
    filters: {},
    created: function () {
        this._ajaxDateTime();
    },
    watch: {
        dataList: {
            handler () {
                //this.reCalculate();
            },
            deep: true
        }
    },
    methods: {
        exportExcel: function () {
            let accountYearPeriod = this.currDateTime;
            window.frames.exportIframe.location.href = rcContextPath + '/balanceSheet/exportExcel?accountYearPeriod=' + accountYearPeriod;
        },
        _trialBalance: function () {
            let that = this;
            if ($.isEmptyObject(that.dataList)) {
                return false;
            }
            let assetItem = that.dataList.find(function (item) {
                return item.assetId === 91;
            });
            let debtItem = that.dataList.find(function (item) {
                return item.debtId === 124;
            });
            let assetAmount1 = assetItem.assetAmount1;
            let assetAmount2 = assetItem.assetAmount2;
            let debtAmount1 = debtItem.debtAmount1;
            let debtAmount2 = debtItem.debtAmount2;

            if (assetAmount1 != debtAmount1 || assetAmount2 != debtAmount2) {
                that.$Message.info({
                    content: '资产负债表不平，请检查账务处理、报表项目公式设置',
                    duration: 3
                });
            }

        },
        _ajaxDateTime: function () {
            let that = this;
            let _url = rcContextPath + '/report/accountPeriodList';
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: _url,
                dataType: 'json',
                success: function (d) {
                    //that.dateTime = d.data.select0;

                    that.dateTime = d.data;
                    if (d.data && d.data.length) {
                        that.currDateTime = that.dateTime[0].value;
                    }
                    that.$nextTick(() => {
                        that._ajaxGetFormData();
                    })

                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        dateChange () {
            this._ajaxGetFormData();
        },
        editClose () {
            this.editVisable = false;
        },
        _ajaxGetFormData: function () {
            var that = this;
            var arr = that.currDateTime.split('_');
            var _url = rcContextPath + `/report/balanceSheet?accountYear=${arr[0]}&accountPeriod=${arr[1]}`;
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: _url,
                dataType: 'json',
                success: function (d) {
                    //that.dateTime = d.data.select0;

                    if (d.code == "100100") {
                        that.dataList = d.data;
                        that.processDataList(d.data);
                        that.$nextTick(function () {
                            that.reCalculate();
                            that._trialBalance();
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        processDataList (_dataList) {
            // 将数组的数据列表转为对象，key 为 assetLineNum 或 debtLineNum
            // 抽取有运算公式的行号，抽取公式，抽取运算符
            var vm = this;
            var _objDataList = {};
            var _objFormula = {};
            $.each(_dataList, function (idx, ele) {
                var _asset = {};
                var _debt = {};
                var _assetKey = '';
                var _debtKey = '';

                $.each(ele, function (key, val) {
                    if (key == 'assetLineNum') {
                        _assetKey = val;
                    }
                    if (key == 'debtLineNum') {
                        _debtKey = val;
                    }

                    if (/^asse/.test(key)) {
                        _asset[key] = val;

                        if (key == 'asseFormula' && val != null) {
                            _objFormula[ele.assetLineNum] = {
                                type: 'asset',
                                formula: ele.asseFormula,
                                lineNumber: ele.asseFormula.split(/[+-]/),
                                operator: ele.asseFormula.replace(/\d/g, '').split('')
                            }
                        }
                    } else if (/^debt/.test(key)) {
                        _debt[key] = val;

                        if (key == 'debtFormula' && val != null) {
                            _objFormula[ele.debtLineNum] = {
                                type: 'debt',
                                formula: ele.debtFormula,
                                lineNumber: ele.debtFormula.split(/[+-]/),
                                operator: ele.debtFormula.replace(/\d/g, '').split('')
                            }
                        }
                    }
                });

                _objDataList[_assetKey] = _asset;
                _objDataList[_debtKey] = _debt;
            });
            vm.objDataList = _objDataList;
            vm.objFormula = _objFormula;
            //console.log(vm.objDataList);
            //console.log(vm.objFormula);
        },
        reCalculate () {
            var vm = this;
            vm.processDataList(vm.dataList);
            //console.log(vm.dataList)

            var _dataList = vm.dataList;
            var objDataList = vm.objDataList;
            var objFormula = vm.objFormula;

            $.each(vm.dataList, function (idx, ele) {
                var cal = function (currLineNum) {
                    if (currLineNum in objFormula) {
                        // 每个公式计算后，更新数据，重整键值对，给下一个公式计算时用
                        vm.processDataList(vm.dataList);
                        var objDataList = vm.objDataList;

                        var currFormula = objFormula[currLineNum];
                        var currType = currFormula.type;
                        var keyAmount1 = currType + 'Amount1';
                        var keyAmount2 = currType + 'Amount2';
                        var strExpression1 = '';
                        var strExpression2 = '';
                        $.each(currFormula.lineNumber, function (idx, ele) {
                            var arrOperator = currFormula.operator;
                            var _operator = (typeof arrOperator[idx] != 'undefined') ? arrOperator[idx] : '';
                            strExpression1 += '(' + objDataList[Number(ele)][keyAmount1] + ')' + _operator;
                            strExpression2 += '(' + objDataList[Number(ele)][keyAmount2] + ')' + _operator;
                        });
                        //console.log(currLineNum + ': '+ strExpression1 + '=' + math.eval(strExpression1));
                        //console.log(currLineNum + ': '+ strExpression2 + '=' + math.eval(strExpression2));
                        ele[keyAmount1] = math.eval(strExpression1);
                        ele[keyAmount2] = math.eval(strExpression2);
                    }
                };
                if (ele.assetLineNum != '' && ele.debtLineNum != '') {
                    cal(Number(ele.assetLineNum));
                    cal(Number(ele.debtLineNum));
                }
            });
            vm.dataList = _dataList;
        },
        saveFormula (row) {
            var vm = this;
            vm.dataList.splice(vm.clickedIndex, 1, row);
            //console.log(row);
            this.reCalculate();
        },
        refresh: function () {
            console.log('分页改变');
        },
        editClick (data) {
            console.log(data);
        },
        editMark: function (par, col) {
            var that = this;
            that.clickedCol = col;
            // debugger
            // console.log(par, col, '=====par, col')
            that.editTitle = `编辑公式 - ${par.row[col]}`;
            that.editName = par.row[col];
            that.editAyp = that.currDateTime;
            if (col === 'assetField') { // 资产 弹窗
                that.editId = par.row['assetId'];
                this.editVisable = true;
            } else if (col === 'debtField') { //负债和所有者（或股东）权益
                that.editId = par.row['debtId'];
                this.editVisable = true;
            } else if (col === 'assetAmount1' || col === 'assetAmount2' || col === 'debtAmount1' || col === 'debtAmount2') { // 金额跳转总账页面
                console.log('跳转总账页面');
            }
        },
        testAA: function () {
            console.log(this.$refs.currentRowTable, '==this.$refs.currentRowTable');
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        printV () {
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var _f = that.dateTime.find(item => item.value === that.currDateTime);
            //单行表头
            var _info = {
                'title': '资产负债表',  // 标题
                'template': 1,  // 模板
                'totalRow': false,
                'titleInfo': [       // title
                    { 'name': '日期', 'val': _f.label }
                ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '资产', 'col': 'assetField', 'textAlign': 'left' },
                    { 'name': '行次', 'col': 'assetLineNum' },
                    { 'name': '期末数', 'col': 'assetAmount1' },
                    { 'name': '年初数', 'col': 'assetAmount2' },
                    { 'name': '负债和所有者（或股东）权益', 'col': 'debtField' },
                    { 'name': '行次', 'col': 'debtLineNum' },
                    { 'name': '期末数', 'col': 'debtAmount1' },
                    { 'name': '年初数', 'col': 'debtAmount2' },
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 8,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        }


    },
    computed: {
        currentTabComponent: function () {
            return 'tab-' + this.currentTab.toLowerCase()
        },
    },
    mounted () {

    }
})
