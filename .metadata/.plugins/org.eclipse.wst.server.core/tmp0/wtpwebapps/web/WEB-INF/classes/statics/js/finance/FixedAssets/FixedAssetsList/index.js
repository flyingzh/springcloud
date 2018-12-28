var _vue = new Vue({
    el: '#fixedAssetsList', //固定资产清单表
    data () {
        return {
            dateStr: '',
            orgName:'',
            selectedId : 0,
            formData: {
                sPeriodYear: '',
                sPeriodMonth: '',
                showInitPeriod: false, //显示初始化期间
                //showEnableFa: true, //暂时不做_显示在册固定资产
                //showDisableFa: false, //暂时不做_显示退役固定资产
                showMultiDeptUse: '3', //对于多部门使用情况 1_整条数据不显示;2_只显示分配比例最大的部门;3_且所有部门都显示出来
                showAdd: true, //显示新增
                showChange: true, //显示变动
                showClear: true, //显示清理

                withAssetTypeId: '',//类别
                withAssetCode: '',//编码
                withUseStateId: '',//使用状态
                withModel: '',//规格(型号)
                withAlterTypeId: '',//变动方式
                withStartEnterAccountDate: '',//入账日期开始
                withEndEnterAccountDate: '',//入账日期结束
                withUseDeptId: '',//使用部门
            },
            assetsTypeName:'',//-类别展示
            assetCodeName: '', //-编码展示
            useStateName:'', //-使用状态展示
            modelName:'',//-规格型号展示
            alterTypeName:'',//-变动方式展示
            useDepartmentName:'', //-使用部门展示

            showAssetType: false, //过滤-资产类别开关
            showAssetCode: false, //过滤-资产编号开关
            showUseDept: false, //过滤-使用部门开关
            showUseStateType: false, //过滤-使用状态别开关
            showAlterType: false, //过滤-变动方式开关
            modelList:[], //规格型号的list
            periodYear: [],
            periodList: [],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/assetslistcontroller/getFaList' ,
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                //postData: JSON.stringify(_vm.formData),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    // userdata: "data.userData",
                    repeatitems: false
                },

                onSelectRow: function (rowid, status) {
                    //单击某行
                    console.log("当前选择的单个id===" + rowid);
                    _vue.selectedId = rowid;
                },
                ondblClickRow: function (rowid) {
                    //双击某行
                    console.log("当前双击的单个id===" + rowid);
                    var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + rowid;
                    window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });
                },

                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            organisationList: [],
            printModal: false,
            printInfo: {},
            dataList: [],
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
        let _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted () {
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
                // case 'showUseState':
                //     if (this.showUseState === true) {
                //         this.showUseState = false;
                //         return;
                //     }
                //     this.showUseState = value;
                //     break;
                case 'showChangeMethod':
                    if (this.showChangeMethod === true) {
                        this.showChangeMethod = false;
                        return;
                    }
                    this.showChangeMethod = value;
                    break;
                // case 'showSupplier':
                //     if (this.showSupplier === true) {
                //         this.showSupplier = false;
                //         return;
                //     }
                //     this.showSupplier = value;
                //     break;
                // case 'showDepartment':
                //     if (this.showDepartment == true) {
                //         this.showDepartment = false;
                //         return;
                //     }
                //     this.showDepartment = value;
                //     break;
                // case 'showMulDepartment':
                //     if (this.showMulDepartment == true) {
                //         this.showMulDepartment = false;
                //         return;
                //     }
                //     this.showMulDepartment = value;
                //     break;
            }
        },
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filter.assetTypeId = treeNode.id;
            this.assetTypeName = treeNode.name;
            this.showAssetType = false;
        },
        operateDate (date) {
            return new Date(date).format("yyyy-MM-dd");
        },
        initData () {  //初始化日期数据
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/assetslistcontroller/initPage' ,
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")){
                            _msg  = result.msg;
                        }
                        layer.alert(_msg);
                        return;
                    }
                    var dataInfo = result.data;
                    _vm.periodYear = dataInfo.yearList;
                    _vm.periodList = dataInfo.monthList;
                    _vm.orgName = layui.data('user').currentOrgName;
                    _vm.modelList = dataInfo.modelList;
                    $.each(_vm.periodYear,function (idx, ele) {
                        if (ele.value == dataInfo.currentYear){
                                _vm.formData.sPeriodYear = ele.name;
                        }
                    });
                    $.each(_vm.periodList,function (idx, ele) {
                        if (ele.value == dataInfo.currentMonth){
                            _vm.formData.sPeriodMonth = ele.name;
                            console.log(ele.name);
                            console.log(_vm.formData.sPeriodMonth);

                        }
                    });

                }
            });
        },

        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
                this.colNames = ['id', '资产编码', '资产名称', '类别', '型号', '单位', '变动方式', '制造商', '产地', '供应商', '入账日期', '使用日期', '使用情况', '使用部门', '部门代码', '经济用途', '折旧方法', '存放地点','数量','币别','汇率','原值原币','原值本币','累计折旧','净值','减值准备','净额','预计净残值','本期折旧额','使用寿命','剩余寿命','备注'];
                this.colModel = [
                    { name: 'id', width: 30, hidden: true, frozen: true },
                    { name: 'assetCode', width: 120 /*, frozen: true*/ },
                    { name: 'assetName', width: 120 /*, frozen: true*/ },
                    { name: 'classesName', width: 120 /*, frozen: true*/ },
                    { name: 'model', width: 120 },
                    { name: 'unitName', width: 120 },
                    { name: 'changeModeName', width: 120 },
                    { name: 'manufacturer', width: 120 },
                    { name: 'originPlace', width: 120 },
                    { name: 'supplierName', width: 120 },
                    { name: 'enterAccountDateStr', width: 120 },
                    { name: 'beginUsedateStr', width: 120 },
                    { name: 'useStateName', width: 120 },
                    { name: 'deptName', width: 120 },
                    { name: 'deptCode', width: 120 },
                    { name: 'useType', width: 120 },
                    { name: 'deprMethodStr', width: 120 },
                    { name: 'locationName', width: 120 },
                    { name: 'num', width: 120 },
                    { name: 'currencyName', width: 120 },
                    { name: 'exchangeRate', width: 120 },
                    { name: 'orgValForStr', width: 120},
                    { name: 'orgValStr', width: 120},
                    { name: 'addupDepr', width: 120,formatter: function (value, grid, rows, state) {
                        return value == null ? '' : accounting.formatNumber(value, 2, ",");
                    } },
                    { name: 'netVal', width: 120,formatter: function (value, grid, rows, state) {
                        return value == null ? '' : accounting.formatNumber(value, 2, ",");
                    } },
                    { name: 'devalPreparation', width: 120,formatter: function (value, grid, rows, state) {
                        return value == null ? '' : accounting.formatNumber(value, 2, ",");
                    } },
                    { name: 'netAmo', width: 120,formatter: function (value, grid, rows, state) {
                        return value == null ? '' : accounting.formatNumber(value, 2, ",");
                    } },
                    { name: 'expectNetSalvage', width: 120,formatter: function (value, grid, rows, state) {
                        return value == null ? '' : accounting.formatNumber(value, 2, ",");
                    } },
                    { name: 'currentDepreciation', width: 120,formatter: function (value, grid, rows, state) {
                        return value == null ? '' : accounting.formatNumber(value, 2, ",");
                    } },
                    { name: 'expectUsePeriods', width: 120 },
                    { name: 'usefulLife', width: 120 },
                    { name: 'remark', width: 120 },
                ];
                this.tableHeaders = [];
                this.base_config.height = $(window).height() - 140;
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $("#fixedAssetsList_jQGrid_Wapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
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
                    _vm.dateStr = _vm.formData.sPeriodYear+"年"+_vm.formData.sPeriodMonth+"期";
                    if (_vm.formData.showInitPeriod){
                        _vm.dateStr = "初始化期间";
                    }
                    _vm.dataList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                },
                gridComplete: function () {
                    //  var rows=$("#grid").jqGrid("getRowData");
                    //  $('#null').find("td").addClass("SelectBG");
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    $("table[id='grid'] tr[id='-2'] td").addClass("alltotalClass");
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            //$("#grid").jqGrid('setGridParam', { postData: this.formData }).trigger("reloadGrid");
            this.initMethod();
        },
        save () {
            this.filterVisible = false;
            this.initMethod();
        },
        cancel () {
            let _vm = this;
            _vm.$refs.modelRef.reset();
            // _vm.$refs.startDateRef.reset();
            // _vm.$refs.endDateRef.reset();
            _vm.formData.withStartEnterAccountDate = '';
            _vm.formData.withEndEnterAccountDate = '';
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
        exportExcel () {
            let _this = this.formData;
            let _url = contextPath + '/assetslistcontroller/exportExcel?sPeriodYear=' + _this.sPeriodYear +
                '&sPeriodMonth=' + _this.sPeriodMonth+
                '&showInitPeriod=' + _this.showInitPeriod+
                '&showChange=' + _this.showChange+
                '&showMultiDeptUse=' + _this.showMultiDeptUse+
                '&showAdd=' + _this.showAdd+
                '&showClear=' + _this.showClear;
            window.open(_url, '数据引出');
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '清单表', openTime: this.openTime, exit: true })
        },
        print () {  //打印
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
                _info = {
                    'title': '固定资产清单',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '会计期间', 'val': that.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '资产编码', 'col': 'assetCode' },
                        { 'name': '资产名称', 'col': 'assetName' },
                        { 'name': '类别', 'col': 'classesName' },
                        { 'name': '型号', 'col': 'model' },
                        { 'name': '单位', 'col': 'unitName' },
                        { 'name': '变动方式', 'col': 'changeModeName' },
                        { 'name': '制造商', 'col': 'manufacturer' },
                        { 'name': '产地', 'col': 'originPlace' },
                        { 'name': '供应商', 'col': 'supplierName' },
                        { 'name': '入账日期', 'col': 'enterAccountDateStr' },
                        { 'name': '使用日期', 'col': 'beginUsedateStr' },
                        { 'name': '使用情况', 'col': 'useStateName' },
                        { 'name': '使用部门', 'col': 'deptName' },
                        { 'name': '部门代码', 'col': 'deptCode' },
                        { 'name': '经济用途', 'col': 'useType' },
                        { 'name': '折旧方法', 'col': 'deprMethodStr' },
                        { 'name': '存放地点', 'col': 'locationName' },
                        { 'name': '数量', 'col': 'num' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '汇率', 'col': 'exchangeRate' },
                        { 'name': '原值原币', 'col': 'orgValForStr'},
                        { 'name': '原值本币', 'col': 'orgValStr'},
                        { 'name': '累计折旧', 'col': 'addupDepr', 'formatNub': true },
                        { 'name': '净值', 'col': 'netVal', 'formatNub': true },
                        { 'name': '减值准备', 'col': 'devalPreparation', 'formatNub': true },
                        { 'name': '净额', 'col': 'netAmo', 'formatNub': true },
                        { 'name': '预计净残值', 'col': 'expectNetSalvage', 'formatNub': true },
                        { 'name': '本期折旧额', 'col': 'currentDepreciation', 'formatNub': true },
                        { 'name': '使用寿命', 'col': 'expectUsePeriods' },
                        { 'name': '剩余寿命', 'col': 'usefulLife' },
                        { 'name': '备注', 'col': 'remark' },
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 30,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                    'totalRow': false
                };

            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        nullValue (exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        },
        cardDetail (){
            let _vm = this;
            //跳转至卡片-查看 页面
            console.log("准备跳转卡片详情所携带的id==="+_vm.selectedId);

            if(_vm.selectedId < 0){
                _vm.$Modal.error({
                    scrollable:true,
                    content:"请选择一条数据!",
                });
                return;
            }

            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + this.selectedId;
            window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });
        },
        // 选择哪个弹框
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
    },
});