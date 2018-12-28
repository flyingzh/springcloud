new Vue({
    el: '#statementChangesFixedAssets', //固定资产变动情况表
    data() {
        return {
            dateStr: '',
            openTime: '',
            orgName : '',
            formData: {
                accountYear: '',
                accountPeriod: '',
                includedPeriodClear: false,
                checkClass: true,
                checkDept: false,

                withAssetTypeId: '',//类别
                withAssetCode: '',//编码
                withUseStateId: '',//使用状态
                withAlterTypeId: '',//变动方式
                withUseDeptId: '',//使用部门
            },

            assetsTypeName:'',//-类别展示
            assetCodeName: '', //-编码展示
            useStateName:'', //-使用状态展示
            alterTypeName:'',//-变动方式展示
            useDepartmentName:'', //-使用部门展示
            showAssetType: false, //过滤-资产类别开关
            showAssetCode: false, //过滤-资产编号开关
            showUseDept: false, //过滤-使用部门开关
            showUseStateType: false, //过滤-使用状态别开关
            showAlterType: false, //过滤-变动方式开关
            periodYear: [],
            periodList: [],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/statementchangecontroller/getFaStatementChangeList',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                // postData: JSON.stringify(This.feeScheduleVO),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    // userdata: "data.userData",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false
            },
            organisationList: [],
            colNames: [],
            colModel: [],
            tableHeaders: [],
            printModal: false,
            printInfo: {},
            dataList: [],
            showAll: false,
            treeUrl: "",
            useDepartmentTreeSetting:{
                callback: {
                    onClick: this.useDepartmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            assetsClassTreeSetting: {
                callback: {
                    onClick: this.assetsClassTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            useStateTreeSetting:{
                callback: {
                    onClick: this.useStateTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            alterTypeTreeSetting:{
                callback: {
                    onClick: this.alterTypeTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            selectAssets: '',
        }
    },
    created: function () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted() {
        this.initData();
    },
    methods: {
        //资产列表弹窗
        onAssets () {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            this.showAssetCode = true;
        },
        //关闭资产列表弹窗
        closeAssets () {
            // this.card.AssetsId = this.selectAssets.id;
            this.formData.withAssetCode = this.selectAssets.assetCode;
            this.showAssetCode = false;
            console.log("assetsName:" + this.selectAssets);
        },

        showDepartmentTree (value, which, index) {
            // this.idx = index;
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showUseDept':
                    if (this.showUseDept === true) {
                        this.showUseDept = false;
                        return;
                    }
                    this.showUseDept = value;
                    break;
                case 'showUseStateType':
                    if (this.showUseStateType === true) {
                        this.showUseStateType = false;
                        return;
                    }
                    this.showUseStateType = value;
                    break;
                case 'showAlterType':
                    if (this.showAlterType === true) {
                        this.showAlterType = false;
                        return;
                    }
                    this.showAlterType = value;
                    break;
            }
        },

        //资产类别下拉
        assetsClassTreeClickCallBack (event, treeId, treeNode) {
            // console.log(treeNode,'资产类别');
            this.formData.withAssetTypeId = treeNode.id;
            this.assetsTypeName = treeNode.name;
            this.showAssetType = false;
        },
        treeBeforeClick(treeId, treeNode, clickFlag){
            // console.log("treeNode",treeNode)
            return !treeNode.isParent;
        },
        //使用状态下拉
        useStateTreeClickCallBack(event, treeId, treeNode){
            // console.log(treeNode,'使用状态');
            this.formData.withUseStateId = treeNode.id;
            this.useStateName = treeNode.name;
            this.showUseStateType = false;
        },
        //使用部门下拉
        useDepartmentTreeClickCallBack(event, treeId, treeNode){
            // console.log(treeNode,'使用部门');
            this.formData.withUseDeptId = treeNode.id;
            this.useDepartmentName = treeNode.name;
            this.showUseDept = false;
        },
        //变动方式下拉
        alterTypeTreeClickCallBack(event, treeId, treeNode){
            // console.log(treeNode,'变动方式');
            this.formData.withAlterTypeId = treeNode.id;
            this.alterTypeName = treeNode.name;
            this.showAlterType = false;
        },

        initData() {  //初始化日期数据
            let _vm = this;
            _vm.orgName = layui.data('user').currentOrgName;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/statementchangecontroller/initPage',
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")) {
                            _msg = result.msg;
                        }
                        layer.alert(_msg);
                        return;
                    }
                    var dataInfo = result.data;
                    _vm.periodYear = dataInfo.yearList;
                    _vm.periodList = dataInfo.monthList;
                    $.each(_vm.periodYear, function (idx, ele) {
                        if (ele.value == dataInfo.currentYear) {
                            _vm.formData.accountYear = ele.name;
                        }
                    });
                    $.each(_vm.periodList, function (idx, ele) {
                        if (ele.value == dataInfo.currentMonth) {
                            _vm.formData.accountPeriod = ele.name;
                        }
                    });
                },
            });
        },

        // 初始值
        initMethod() {
            this.delTable();
            this.setTableHeader();
        },

        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper_parent"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },

        setTableHeader() {
            let _vm = this;
            if (_vm.formData.checkClass && !_vm.formData.checkDept) {
                //汇总只勾选---类别
                _vm.colNames = ['id', '类别', '资产编码', '资产名称', '规格',
                    '原值期初余额', '原值借方', '原值贷方', '原值期末余额', '累计折旧期初余额', '累计折旧借方', '累计折旧贷方', '累计折旧期末余额',
                    '期初净值', '期末净值', '减值准备期初余额', '减值准备借方', '减值准备贷方', '减值准备期末余额', '期初净额', '期末净额'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true, frozen: true},
                    {name: 'className', width: 100, frozen: true},
                    {name: 'assetCode', width: 150, frozen: true},
                    {name: 'assetName', width: 80, frozen: true},
                    {name: 'model', width: 150,},
                    {name: 'orgValBeginBalance', width: 150},
                    {name: 'orgValDebit', width: 120,},
                    {name: 'orgValCredit', width: 120,},
                    {name: 'orgValEndBalance', width: 120,},
                    {name: 'addupDeprBeginBalance', width: 120,},
                    {name: 'addupDeprDebit', width: 120,},
                    {name: 'addupDeprCredit', width: 120,},
                    {name: 'addupDeprEndBalance', width: 120},
                    {name: 'beginNetVal', width: 120},
                    {name: 'endNetVal', width: 120},
                    {name: 'devaluePrepBeginBalance', width: 120},
                    {name: 'devaluePrepDebit', width: 120},
                    {name: 'devaluePrepCredit', width: 120},
                    {name: 'devaluePrepEndBalance', width: 120},
                    {name: 'beginNetAmo', width: 120},
                    {name: 'endNetAmo', width: 120}
                ];
            } else if (!_vm.formData.checkClass && _vm.formData.checkDept) {
                //汇总只勾选---部门
                _vm.colNames = ['id', '使用部门', '资产编码', '资产名称', '规格',
                    '原值期初余额', '原值借方', '原值贷方', '原值期末余额', '累计折旧期初余额', '累计折旧借方', '累计折旧贷方', '累计折旧期末余额',
                    '期初净值', '期末净值', '减值准备期初余额', '减值准备借方', '减值准备贷方', '减值准备期末余额', '期初净额', '期末净额'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true, frozen: true},
                    {name: 'deptName', width: 100, frozen: true},
                    {name: 'assetCode', width: 150, frozen: true},
                    {name: 'assetName', width: 80, frozen: true},
                    {name: 'model', width: 150,},
                    {name: 'orgValBeginBalance', width: 150},
                    {name: 'orgValDebit', width: 120,},
                    {name: 'orgValCredit', width: 120,},
                    {name: 'orgValEndBalance', width: 120,},
                    {name: 'addupDeprBeginBalance', width: 120,},
                    {name: 'addupDeprDebit', width: 120,},
                    {name: 'addupDeprCredit', width: 120,},
                    {name: 'addupDeprEndBalance', width: 120},
                    {name: 'beginNetVal', width: 120},
                    {name: 'endNetVal', width: 120},
                    {name: 'devaluePrepBeginBalance', width: 120},
                    {name: 'devaluePrepDebit', width: 120},
                    {name: 'devaluePrepCredit', width: 120},
                    {name: 'devaluePrepEndBalance', width: 120},
                    {name: 'beginNetAmo', width: 120},
                    {name: 'endNetAmo', width: 120}
                ];
            } else if (_vm.formData.checkClass && _vm.formData.checkDept) {
                //汇总勾选---类别+部门
                _vm.colNames = ['id', '类别', '使用部门', '资产编码', '资产名称', '规格',
                    '原值期初余额', '原值借方', '原值贷方', '原值期末余额', '累计折旧期初余额', '累计折旧借方', '累计折旧贷方', '累计折旧期末余额',
                    '期初净值', '期末净值', '减值准备期初余额', '减值准备借方', '减值准备贷方', '减值准备期末余额', '期初净额', '期末净额'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true, frozen: true},
                    {name: 'className', width: 100, frozen: true},
                    {name: 'deptName', width: 100, frozen: true},
                    {name: 'assetCode', width: 150, frozen: true},
                    {name: 'assetName', width: 80, frozen: true},
                    {name: 'model', width: 150,},
                    {name: 'orgValBeginBalance', width: 150},
                    {name: 'orgValDebit', width: 120,},
                    {name: 'orgValCredit', width: 120,},
                    {name: 'orgValEndBalance', width: 120,},
                    {name: 'addupDeprBeginBalance', width: 120,},
                    {name: 'addupDeprDebit', width: 120,},
                    {name: 'addupDeprCredit', width: 120,},
                    {name: 'addupDeprEndBalance', width: 120},
                    {name: 'beginNetVal', width: 120},
                    {name: 'endNetVal', width: 120},
                    {name: 'devaluePrepBeginBalance', width: 120},
                    {name: 'devaluePrepDebit', width: 120},
                    {name: 'devaluePrepCredit', width: 120},
                    {name: 'devaluePrepEndBalance', width: 120},
                    {name: 'beginNetAmo', width: 120},
                    {name: 'endNetAmo', width: 120}
                ];
            }

            this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },

        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.formData),
                loadComplete: function (ret) {
                    if (ret.code != '100100') {
                        let _msg = '系统异常!';
                        if (ret.hasOwnProperty("data")) {
                            _msg = ret.msg;
                        }
                        layer.alert(_msg);
                        return;
                    }
                    _vm.dataList = ret.data || [];
                    if (_vm.formData.initPeriod) {
                        _vm.dateStr = '初始化数据';
                    } else {
                        _vm.dateStr = _vm.formData.accountYear + '年' + _vm.formData.accountPeriod + '期';
                    }
                },
                gridComplete: function () {
                    //  var rows=$("#grid").jqGrid("getRowData");
                    //  $('#null').find("td").addClass("SelectBG");
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    $("table[id='grid'] tr[id='-1'] td").addClass("subtotalClass");
                    $("table[id='grid'] tr[id='-2'] td").addClass("alltotalClass");
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        open() {
            this.filterVisible = true;
        },
        refresh() { //刷新
            this.initMethod();
        },
        save() {
            this.filterVisible = false;
            this.initMethod();
        },
        cancel() {
            let _vm = this;
            _vm.formData.withAssetCode = '';
            _vm.assetsTypeName = '';
            _vm.useDepartmentName = '';
            _vm.useStateName = '';
            _vm.alterTypeName = '';
            _vm.formData.withAssetTypeId = '';
            _vm.formData.withUseStateId = '';
            _vm.formData.withUseDeptId = '';
            _vm.formData.withAlterTypeId = '';
            _vm.showAssetType = false;
            _vm.showUseDept = false;
            _vm.showUseStateType = false;
            _vm.showAlterType = false;
            this.filterVisible = false;
        },
        exportExcel() {
            let d = this.formData;
            let _url = contextPath + '/statementchangecontroller/exportExcel?accountPeriod=' + d.accountPeriod
                + '&accountYear=' + d.accountYear + '&includedPeriodClear=' + d.includedPeriodClear
                + '&checkClass=' + d.checkClass + '&checkDept=' + d.checkDept
                + '&withAssetTypeId='+d.withAssetTypeId + '&withAssetCode='+d.withAssetCode + '&withUseStateId='+d.withUseStateId
                +'&withAlterTypeId='+d.withAlterTypeId + '&withUseDeptId='+d.withUseDeptId;
            console.log(_url);
            window.open(_url, '数据引出');
        },
        exitPrevent() {
            window.parent.closeCurrentTab({name: '变动情况表', openTime: this.openTime, exit: true})
        },
        print() {  //打印
            let that = this;
            var _info;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }

            //单行表头
            let _cname = [];
            let _baseCname = [
                // 列名与对应字段名
                { 'name': '资产编码', 'col': 'assetCode' },
                { 'name': '资产名称', 'col': 'assetName' },
                { 'name': '规格', 'col': 'model' },
                { 'name': '原值期初余额', 'col': 'orgValBeginBalance', 'formatNub': true },
                { 'name': '原值借方', 'col': 'orgValDebit', 'formatNub': true },
                { 'name': '原值贷方', 'col': 'orgValCredit', 'formatNub': true },
                { 'name': '原值期末余额', 'col': 'orgValEndBalance', 'formatNub': true },
                { 'name': '累计折旧期初余额', 'col': 'addupDeprBeginBalance', 'formatNub': true },
                { 'name': '累计折旧借方', 'col': 'addupDeprDebit', 'formatNub': true },
                { 'name': '累计折旧贷方', 'col': 'addupDeprCredit', 'formatNub': true },
                { 'name': '累计折旧期末余额', 'col': 'addupDeprEndBalance', 'formatNub': true },
                { 'name': '期初净值', 'col': 'beginNetVal', 'formatNub': true },
                { 'name': '期末净值', 'col': 'endNetVal', 'formatNub': true },
                { 'name': '减值准备期初余额', 'col': 'devaluePrepBeginBalance', 'formatNub': true },
                { 'name': '减值准备借方', 'col': 'devaluePrepDebit', 'formatNub': true },
                { 'name': '减值准备贷方', 'col': 'devaluePrepCredit', 'formatNub': true },
                { 'name': '减值准备期末余额', 'col': 'devaluePrepEndBalance', 'formatNub': true },
                { 'name': '期初净额', 'col': 'beginNetAmo', 'formatNub': true },
                { 'name': '期末净额', 'col': 'endNetAmo' , 'formatNub': true},
            ];
            that.formData.checkClass && (_cname.push( { 'name': '类别', 'col': 'className' }));
            that.formData.checkDept && (_cname.push( { 'name': '使用部门', 'col': 'deptName' }));
            _info = {
                'title': '变动情况表',  // 标题
                'template': 1,  // 模板
                'titleInfo': [       // title
                    { 'name': '会计期间', 'val': that.dateStr }
                ],
                'colNames': [..._cname,..._baseCname],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 30,  // 显示最大长度， 默认为7
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
        nullValue(exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        }
    },
})