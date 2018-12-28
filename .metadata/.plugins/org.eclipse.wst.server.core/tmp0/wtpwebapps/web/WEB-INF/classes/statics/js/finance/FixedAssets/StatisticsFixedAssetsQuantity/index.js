var _vue = new Vue({
    el: '#statisticsFixedAssetsQuantity', //固定资产数量统计表
    data () {
        return {
            dateStr: '',
            orgName:'',
            formData: {
                accountYear: '',
                accountPeriod: '',
                checkClass: true,
                checkDept: true,
                withAssetTypeId: '',
                withUseStateId: '',
                withUseDeptId: '',
                withAlterTypeId: '',
                assetsTypeName:'',
                useDepartmentName:'',
                useStateName:'',
                alterTypeName:'',
            },
            showAssetType: false, //过滤-资产类别开关
            showUseDept: false, //过滤-使用部门开关
            showUseStateType: false, //过滤-使用状态别开关
            showAlterType: false, //过滤-变动方式开关
            periodYear: [],
            periodList: [],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/faquantitycontroller/getFaQuantityDetail',
                 ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                 //postData: JSON.stringify(this.formData),  //这个要放在组件里才好使
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
            showAssetsList: false,
            selectAssets: '',
            assetTypeName:""
        }
    },
    created: function () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted () {
        this.initData();
    },
    methods: {

        //资产类别下拉
        assetsClassTreeClickCallBack (event, treeId, treeNode) {
            // console.log(treeNode,'资产类别');
            this.formData.withAssetTypeId = treeNode.id;
            this.formData.assetsTypeName = treeNode.name;
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
            this.formData.useStateName = treeNode.name;
            this.showUseStateType = false;
        },
        //使用部门下拉
        useDepartmentTreeClickCallBack(event, treeId, treeNode){
            // console.log(treeNode,'使用部门');
            this.formData.withUseDeptId = treeNode.id;
            this.formData.useDepartmentName = treeNode.name;
            this.showUseDept = false;
        },
        //变动方式下拉
        alterTypeTreeClickCallBack(event, treeId, treeNode){
            // console.log(treeNode,'变动方式');
            this.formData.withAlterTypeId = treeNode.id;
            this.formData.alterTypeName = treeNode.name;
            this.showAlterType = false;
        },

//资产列表弹窗
        onAssets () {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            this.showAssetsList = true;
        },
        //关闭资产列表弹窗
        closeAssets () {
            // this.card.AssetsId = this.selectAssets.id;
            this.formData.assetsName = this.selectAssets.supplierName;
            this.showAssetsList = false;
            console.log("assetsName:" + this.selectAssets);
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
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.formData.assetTypeName = treeNode.id;
            this.assetTypeName = treeNode.name;
            this.showAssetType = false;
        },
        initData () {  //初始化日期数据
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/faquantitycontroller/initPage',
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
                    _vm.orgName = layui.data('user').currentOrgName;
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

                }
            });
        },

        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            var _cn = ['id'], _col = [{ name: 'id', width: 30, hidden: true ,key:true}];
            var _dcn = ['计量单位','数量', '原值'];
            var _dcol =[
                { name: 'unitName', width: 150, frozen: true },
                { name: 'num', width: 150, frozen: true },
                { name: 'orginalValue', width: 150, formatter: function (value, grid, rows, state) {
                    return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, ",");
                }},
            ];
            this.formData.checkClass && (_cn.push('类别'), _col.push({
                name: 'itemName', width: 120,
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'itemName' + rowId + '\'';
                }
            }));
            this.formData.checkDept && (_cn.push('使用部门'), _col.push({ name: 'departmentNameBak', width: 180,
                 cellattr: function(rowId, tv, rawObject, cm, rdata) {
                     //合并单元格
                     return 'id=\'departmentName' + rowId + '\'';
                 }
            }));
              // this.formData.check2 && (_cn.push('经济用途'), _col.push({ name: 'name', width: 100, frozen: true }));
              //   this.formData.check4 && (_cn.push('存放地点'), _col.push({ name: 'locationName', width: 100, frozen: true }));
              // this.formData.check5 && (_cn.push('变动方式'), _col.push({ name: 'changemodeName', width: 100, frozen: true }));
              //   this.formData.check6 && (_cn.push('使用状态'), _col.push({ name: 'stateName', width: 100, frozen: true }));

            this.colNames = [..._cn, ..._dcn];
            this.colModel = [..._col, ..._dcol];

            this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(this.formData),
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
                    _vm.dateStr = _vm.formData.accountYear+'年'+_vm.formData.accountPeriod+'期';
                },
                gridComplete: function () {
                    //  var rows=$("#grid").jqGrid("getRowData");
                    //  $('#null').find("td").addClass("SelectBG");
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));

                    var gridName = 'grid';
                    //(_vue.formData.checkClass&&!_vue.formData.checkDept) && (_vue.Merger(gridName,'itemName'));
                    //(!_vue.formData.checkClass&&_vue.formData.checkDept) && (_vue.Merger(gridName,'departmentName'));
                    if (_vue.formData.checkClass && _vue.formData.checkDept) {
                        _vue.Merger(gridName,'itemName');
                        _vue.Merger(gridName,'departmentNameBak');
                    }else if(_vue.formData.checkClass&&!_vue.formData.checkDept) {
                        _vue.Merger(gridName,'itemName');
                    }else if (!_vue.formData.checkClass&&_vue.formData.checkDept){
                        _vue.Merger(gridName,'departmentNameBak');
                    }
                    //$("table[id='grid'] tr[id='-1'] td").addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="小计"]').siblings().addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="小计"]').addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="合计"]').siblings().addClass("alltotalClass");
                    $('table[id="grid"] tr td[title="合计"]').addClass("alltotalClass");
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () {
            this.initMethod();
        },
        save () {
            this.filterVisible = false;
            this.initMethod();
        },
        cancel () {
            let _vm = this;
            //点击取消时要把打开弹出框里的所有过滤条件置空,并且关闭所有下拉框
            // _vm.$refs.assetsTypeNameRef.reset();
            // _vm.$refs.useDepartmentNameRef.reset();
            // _vm.$refs.useStateNameRef.reset();
            // _vm.$refs.alterTypeNameRef.reset();
            _vm.formData.assetsTypeName = '';
            _vm.formData.useDepartmentName = '';
            _vm.formData.useStateName = '';
            _vm.formData.alterTypeName = '';
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
            let _d = this.formData;
            let _url = contextPath + '/faquantitycontroller/exportExcel?accountYear=' + _d.accountYear + '&accountPeriod=' + _d.accountPeriod
            + '&withAssetTypeId=' +_d.withAssetTypeId +'&withUseStateId=' +_d.withUseStateId
                + '&withUseDeptId=' +_d.withUseDeptId + '&withAlterTypeId=' + _d.withAlterTypeId
            + '&checkDept='+_d.checkDept + '&checkClass='+_d.checkClass;
            console.log(_url);
            window.open(_url,'数据引出');
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '数量统计表', openTime: this.openTime, exit: true })
        },
        printV () {  //打印
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
                { 'name': '计量单位', 'col': 'unitName' },
                { 'name': '数量', 'col': 'num' },
                { 'name': '原值', 'col': 'orginalValue', 'formatNub': true}
            ];

            that.formData.checkClass && (_cname.push({ 'name': '类别', 'col': 'itemName' }));
            that.formData.checkDept && (_cname.push({ 'name': '使用部门', 'col': 'departmentNameBak' }));
            _info = {
                'title': '固定资产数量统计表',  // 标题
                'template': 1,  // 模板
                'titleInfo': [       // title
                    { 'name': '会计期间', 'val': that.dateStr }
                ],
                'colNames': [       // 列名与对应字段名
                    ..._cname,..._baseCname
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
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
        Merger(gridName, cellName) {
            //得到显示到界面的id集合
            var mya = $("#" + gridName + "").getDataIDs();
            //数据总行数
            var length = mya.length;
            //定义合并行数
            var rowSpanTaxCount = 1;
            for (var i = 0; i < length; i += rowSpanTaxCount) {
                //从当前行开始比对下面的信息
                var before = $("#" + gridName + "").jqGrid('getRowData', mya[i]);
                rowSpanTaxCount = 1;
                for (var j = i+1; j <= length; j++) {
                    //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
                    var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
                    if (before[cellName] == end[cellName]) {
                        rowSpanTaxCount++;
                        $("#" + gridName + "").setCell(mya[j], cellName, '', { display: 'none' });
                    } else {
                        break;
                    }
                }
                $("#" + gridName + "").setCell(mya[i], cellName, '', '', { rowspan: rowSpanTaxCount });
            }
        },
        nullValue (exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        }
    },
});