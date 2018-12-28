var _vue = new Vue({
    el: '#personalIncomeTax',//个人所得税报表
    data() {
        return {
            orgName: '',
            dateStr: '',
            categoryStr: '',
            openTime: '',
            colNames: [],
            colModel: [],
            printInfo: {},
            printModal: false,
            filterVisible: false,
            showDept: false,
            formData: {
                checkStartYear: '',
                checkStartPeriod: '',
                checkEndYear: '',
                checkEndPeriod: '',
                categoryId: '',
                empName: '',
                empCode: '',
                deptName: '',
                depId: '',
                idCard: '',
                empRank: '',
                empStation: '',
                stationLevel: '',
            },
            dataList: [],
            categoryList: [],
            empNameList: [],
            empCodeList: [],
            idCardList: [],
            rankList: [],
            stationList: [],
            stationLevelList: [],
            accountantYearList: [],
            accountantPeriodList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            //渲染部门树组件
            showDepartmentTreeSetting: {
                /*data: {
                    key: {
                        name: "title"
                    }
                },*/
                callback: {
                    onClick: this.deptTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
        }
    },
    //获取会计科目列表
    mounted() {
        let _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
        _vm.initPage();
    },
    created() {
        this.orgName = layui.data('user').currentOrgName;
    },
    methods: {
        //点击过滤弹窗,展示部门树
        showDepartmentTree(value, which, index) {
            if (this.showDept === true) {
                this.showDept = false;
                return;
            }
            this.showDept = value;
        },
        //部门树点击事件
        deptTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            this.formData.depId = treeNode.id;
            this.formData.deptName = treeNode.name;
            this.showDept = false;
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        initPage() {
            //初始化数据
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/personalIncomeTaxReportAppController/initPage',
                success: function (result) {
                    console.log("result", result);
                    if (result.code == '100100') {
                        let _r = result.data;
                        _vm.categoryList = _r.categoryList;
                        _vm.empNameList = _r.empNameList;
                        _vm.empCodeList = _r.empCodeList;
                        _vm.idCardList = _r.idCardList;
                        _vm.rankList = _r.rankList;
                        _vm.stationList = _r.stationList;
                        _vm.stationLevelList = _r.stationLevelList;
                        _vm.accountantYearList = _r.accountYearList;
                        _vm.formData.checkStartYear = _r.curYear;
                        _vm.formData.checkStartPeriod = _r.curPeriod;
                        _vm.formData.checkEndYear = _r.curYear;
                        _vm.formData.checkEndPeriod = _r.curPeriod;
                        if (_r.accountPeriodNumber === 13) {
                            _vm.accountantPeriodList.push(13);
                        }
                        _vm.dateStr = _vm.formData.checkStartYear + '年' + _vm.formData.checkStartPeriod + '期 -- '
                            + _vm.formData.checkEndYear + '年' + _vm.formData.checkEndPeriod + '期';
                        _vm.categoryStr = '全部';
                    } else {
                        _vm.$Modal.error({
                            title: '提示信息',
                            content: result == null || result.msg == null || result.msg == '' ? "页面初始化失败" : result.msg
                        })
                    }
                }
            });

            //初始化完页面之后执行一次查询
            this.initMethod();
        },
        initMethod() {
            this.delTable();
            this.setTableHeader();
        },
        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        setTableHeader() {
            let _vm = this;
            _vm.colNames = ['id', '序号', '部门', '纳税义务人', '身份证号码', '所得项目', '所得期间', '收入人民币', '减费用额',
                '应纳税所得额', '税率项目', '税率项目合计', '税率计算值', '税率', '速算扣除数', '扣缴所得税额'
            ];
            _vm.colModel = [
                {name: 'id', width: 50, align: "center", sortable: false, key: true, hidden: true},
                {name: 'sequence', width: 50, align: "center", sortable: false},
                {name: 'depName', width: 150, align: "center", sortable: false},
                {name: 'empName', width: 80, align: "center", sortable: false},
                {name: 'idCard', width: 200, align: "center", sortable: false},
                {name: 'incomeName', width: 150, align: "center", sortable: false},
                {name: 'incomePeriod', width: 80, align: "center", sortable: false},
                {
                    name: 'incomeRmb', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'costReduction', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'incomeTax', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'taxRateItems', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'totalTaxRateItems', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'taxRateCalcValue', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'taxRate', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return  _vue.formatMoney(value);
                    }
                },
                {
                    name: 'quickCalcDeduction', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
                {
                    name: 'withholdingIncomeTax', width: 100, align: "center", sortable: false,
                    formatter: function (value, grid, rows, state) {
                        return _vue.formatMoney(value);
                    }
                },
            ];
            _vm.tableHeaders = [];
            _vm.jqGridInit(_vm.colNames, _vm.colModel, _vm.tableHeaders);
        },
        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {

            let _vm = this;
            let config = {
                colNames: colNames,
                colModel: colModel,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/personalIncomeTaxReportAppController/getPersonalIncomeTaxReportList',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                postData: JSON.stringify(_vm.formData),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                height: $(window).height() - 140,
                rowNum: -1,
                viewrecords: true,
                loadComplete: function (ret) {
                    if (ret.code != '100100') {
                        let _msg = '系统异常!';
                        if (ret.hasOwnProperty("data")) {
                            _msg = ret.msg;
                        }
                        _vue.$Modal.error({
                            scrollable: true,
                            content: _msg,
                        });
                        return;
                    } else {
                        if (!ret.data) {
                            _vue.$Modal.success({
                                scrollable: true,
                                content: '没有查到任何数据!',
                            });
                        }
                    }
                    _vm.dataList = ret.data || [];
                },
                gridComplete: function () {
                    $("table[id='grid'] tr[id='-1'] td").addClass("alltotalClass");
                },
            };
            jQuery("#grid").jqGrid(config);

        },
        open() {
            this.filterVisible = true;
        },
        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        //点击保存
        saveFun: function () {
            $("#grid").jqGrid('setGridParam', {postData: JSON.stringify(_vue.formData)}).trigger("reloadGrid");
            let _vm = this;
            _vm.dateStr = _vm.formData.checkStartYear + '年' + _vm.formData.checkStartPeriod + '期 -- '
                + _vm.formData.checkEndYear + '年' + _vm.formData.checkEndPeriod + '期';
            _vm.categoryStr = '全部';
            $.each(_vm.categoryList, function (idex, ele) {
                if (ele.id === _vm.formData.categoryId) {
                    _vm.categoryStr = ele.categoryName;
                }
            });
            this.filterVisible = false;
        },
        // trim (str){
        //     return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        // },
        //点击取消或者x
        cancelFun: function () {
            this.clearFormData();
            this.filterVisible = false;
        },
        //刷新
        refresh() {
            this.saveFun();
        },
        //引出
        exportExcel() {
            //导出到excel表格
            let _d =this.formData;
            let _url = contextPath + "/personalIncomeTaxReportAppController/exportExcel?categoryId=" + _d.categoryId +
                "&checkEndPeriod=" + _d.checkEndPeriod + "&checkEndYear=" + _d.checkEndYear +
                "&checkStartPeriod=" + _d.checkStartPeriod + "&checkStartYear=" + _d.checkStartYear +
                "&depId=" + _d.depId + "&empCode=" + _d.empCode + "&empName=" + _d.empName + "&empRank=" + _d.empRank +
                "&empStation=" + _d.empStation + "&idCard=" + _d.idCard + "&stationLevel=" + _d.stationLevel;
            console.log(_url);
            window.open(_url);
        },
        //退出
        exitPrevent() {
            //关闭当前页签
            var name = '个人所得税';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
        //打印
        printV() {
            let that = this;
            var _info;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    title: '提示信息',
                    content: '无打印数据',
                    duration: 2
                });
                return;
            }
            //单行表头
            _info = {
                'title': '个人所得税报表',  // 标题
                'template': 1,  // 模板
                'titleInfo': [       // title
                    { 'name': '会计期间', 'val': that.dateStr }
                ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '序号', 'col': 'sequence' },
                    { 'name': '部门', 'col': 'depName' },
                    { 'name': '纳税义务人', 'col': 'empName' },
                    { 'name': '身份证号码', 'col': 'idCard' },
                    { 'name': '所得项目', 'col': 'incomeName' },
                    { 'name': '所得期间', 'col': 'incomePeriod' },
                    { 'name': '收入人民币', 'col': 'incomeRmb', 'formatNub': true },
                    { 'name': '减费用额', 'col': 'costReduction', 'formatNub': true },
                    { 'name': '应纳税所得额', 'col': 'incomeTax', 'formatNub': true },
                    { 'name': '税率项目', 'col': 'taxRateItems', 'formatNub': true },
                    { 'name': '税率项目合计', 'col': 'totalTaxRateItems', 'formatNub': true },
                    { 'name': '税率计算值', 'col': 'taxRateCalcValue', 'formatNub': true },
                    { 'name': '税率', 'col': 'taxRate', 'formatNub': true },
                    { 'name': '速算扣除数', 'col': 'quickCalcDeduction', 'formatNub': true },
                    { 'name': '扣缴所得税额', 'col': 'withholdingIncomeTax', 'formatNub': true }
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 16,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
                'totalRow': false
            };

            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow(_t) {
            this.printModal = _t;
        },
        formatMoney(value) {
            return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, "");
        },
        clearFormData() {
            let _d = this.formData;
            //清空过滤条件, 类别和起始期间为必填项
            /*_vue.$refs.checkStartYearRef.reset();
            _vue.$refs.checkStartPeriodRef.reset();
            _vue.$refs.checkEndYearRef.reset();
            _vue.$refs.checkEndPeriodRef.reset();*/
            _vue.$refs.categoryIdRef.reset();
            _vue.$refs.empNameRef.reset();
            _vue.$refs.empCodeRef.reset();
            _d.deptName = '';
            _d.depId = '';
            _vue.$refs.idCardRef.reset();
            _vue.$refs.empRankRef.reset();
            _vue.$refs.empStationRef.reset();
            _vue.$refs.stationLevelRef.reset();

        },
    },
});