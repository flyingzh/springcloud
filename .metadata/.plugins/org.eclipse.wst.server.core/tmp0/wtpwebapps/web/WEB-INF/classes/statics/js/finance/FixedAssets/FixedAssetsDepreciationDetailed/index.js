var ve = new Vue({
    el: '#fixed-assets-depreciation-detailed',
    data() {
        let This = this;
        return {
            strPeriod:'',
            yearList:[],
            periodList:[],
            formData: {
                sobId:'',
                periodYear: '',
                periodMonth: '',
                zeroBool:false,
                clearBool:false,
                assetCode:'',
                assetTypeId: '',
                changeModeId:'',
                useStatusId:'',
                useDeptId:'',
                checkClass: true,
                checkDept: true
            },
            filterVisible: true,
            organizationEntityList:[],
            initFormList:[],
            dataList: [],
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/app/faDepreciationSummaryTable/detailList',
                datatype: 'json',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                serializeGridData: function (postData) {
                    return JSON.stringify(postData);
                },
                postData:{},
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            openTime: '',
            assetTypeName:"",
            changeModeName:"",
            useStatusName:"",
            useDeptName:"",
            showAssetType: false,
            showChangeMode :false,
            showUseStatus:false,
            showUseDept:false,
            assetTypeTreeSetting: {
                callback: {
                    onClick: this.assetTypeTreeClickCallBack
                }
            },
            changeModeTreeSetting: {
                callback: {
                    onClick: this.changeModeTreeClickCallBack
                }
            },
            useStatusTreeSetting: {
                callback: {
                    onClick: this.useStatusTreeClickCallBack
                }
            },
            useDeptTreeSetting: {
                callback: {
                    onClick: this.useDeptTreeClickCallBack
                }
            },
            showAssetsList: false,
            selectAssets: '',
            periodYear:[],
        }
    },
    created: function () {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted() {
        this.initFormData();
        this.initMethod();
    },
    methods: {
        //资产列表弹窗
        onAssets () {
            this.showAssetsList = true;
        },
        //关闭资产列表弹窗
        closeAssets () {
            // this.card.AssetsId = this.selectAssets.id;
            this.formData.assetCode = this.selectAssets.assetCode;
            this.showAssetsList = false;
            console.log("assetsName:" + this.selectAssets);
        },
        // 选择哪个弹框
        showDepartmentTree (value, which, index) {
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showUseStatus':
                    if (this.showUseStatus === true) {
                        this.showUseStatus = false;
                        return;
                    }
                    this.showUseStatus = value;
                    break;
                case 'showChangeMode':
                    if (this.showChangeMode === true) {
                        this.showChangeMode = false;
                        return;
                    }
                    this.showChangeMode = value;
                    break;
                case 'showUseDept':
                    if (this.showUseDept === true) {
                        this.showUseDept = false;
                        return;
                    }
                    this.showUseDept = value;
                    break;
            }
        },
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.formData.assetTypeId = treeNode.id;
            this.assetTypeName = treeNode.name;
            this.showAssetType = false;
        },
        changeModeTreeClickCallBack(event, treeId, treeNode){
            console.log(treeNode);
            this.formData.changeModeId = treeNode.id;
            this.changeModeName = treeNode.name;
            this.showChangeMode = false;
        },
        useStatusTreeClickCallBack(event, treeId, treeNode){
            console.log(treeNode);
            this.formData.useStatusId = treeNode.id;
            this.useStatusName = treeNode.name;
            this.showUseStatus = false;
        },
        useDeptTreeClickCallBack(event, treeId, treeNode){
            console.log(treeNode);
            this.formData.useDeptId = treeNode.id;
            this.useDeptName = treeNode.name;
            this.showUseDept = false;
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        initFormData(){
            var that = this;
            $.ajax({
                type:"POST",
                url:rcContextPath+"/app/faDepreciationSummaryTable/initFormData",
                success:function (result) {
                    var resultData = result.data;
                    var data = resultData.periodData;  //会计期间数据
                    that.organizationEntityList = resultData.organizationEntityList;
                    if(that.organizationEntityList!=null){
                        that.formData.sobId=resultData.sobId;
                    }
                    that.initFormList = data;
                    if(data!=null){
                        that.yearList = data.period.yearList;
                        that.formData.periodYear = Number(data.list[2].value);
                        that.periodList = data.period[that.formData.periodYear];
                        that.formData.periodMonth = Number(data.list[3].value);
                    }
                },
                error:function (result) {
                    console.log(result);
                }
            });
        },
        changePeriodYear(periodYear){  //改变会计年度 ，期间随着改变
            this.periodList = this.initFormList.period[periodYear];
            if(this.periodList.length>0){
                this.formData.periodMonth = this.periodList[0].value;
            }
        },
        // 生成jqGrid
        setTableHeader () {
            var _cn = ['id'], _col = [{ name: 'id', width: 30, hidden: true }];
            var _dcn = ['资产编码', '资产名称', '规格', '使用寿命', '已使用寿命','月折旧率(%)','期初原值','期初累计折旧',
                      '期初净值','期初减值准备','期初净额','原值增加','原值减少','折旧调增', '折旧调减', '减值准备调增', '减值准备调减',
                     '本期折旧额', '本年折旧额', '本年实际计提折旧额','期末原值','期末累计折旧','期末净值','期末减值准备','期末净额']
            var _dcol = [
                { name: 'assetCode', width: 120},
                { name: 'assetName', width: 220},
                { name: 'model', width: 120},
                { name: 'expectUsePeriods', width: 120,
                    formatter:function(cellValue, options, rowObject){
                        if(cellValue!=null){
                            return cellValue+'期';
                        }else{
                            return '';
                        }
                    }},
                { name: 'usePeriodsBeforeservice', width: 120,
                    formatter:function(cellValue, options, rowObject){
                        if(cellValue!=null){
                            return cellValue+'期';
                        }else{
                            return '';
                        }
                    }},
                { name: 'monthDepreciationRate', width: 120 ,formatter:'currency',formatoptions: {thousandsSeparator:",",decimalSeparator:".", decimalPlaces:3,suffix:"%"}},
                { name: 'initValueFor', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'initAddDepreciation', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'initNetValue', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'initAllowance', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'initNetAmount', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'addValueFor', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'subtractValueFor', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'addDepreciation', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'subtractDepreciation', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'subtractValueIncrease', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'subtractValueSubtract', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'thisPeriodDepreciationAmount', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'thisYearDepreciationAmount', width: 120,formatter:'currency', decimalPlaces:2},
                { name: 'thisYearAddDepreciationAmount', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'endValueFor', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'endAddDepreciation', width: 120,formatter:'currency',decimalPlaces:2 },
                { name: 'endNetValue', width: 120,formatter:'currency',decimalPlaces:2 },
                { name: 'endAllowance', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'endNetAmount', width: 120, formatter:'currency',decimalPlaces:2}
            ]
            this.formData.checkClass && (_cn.push('类别'), _col.push({ name: 'className', width: 100,
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'className' + rowId + '\'';
                }}));
            this.formData.checkDept && (_cn.push('使用部门'), _col.push({ name: 'deptName', width: 100,
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'deptName' + rowId + '\'';
                }}));

            this.colNames = [..._cn, ..._dcn];
            this.colModel = [..._col, ..._dcol];

            this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        //公共调用 合并
        merger(gridName, cellName) {
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
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_detail_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                loadComplete: function (ret) {
                    _vm.dataList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                },
                gridComplete: function () {
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    $('table[id="grid"] tr td[title="小计"]').siblings().addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="小计"]').addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="合计"]').siblings().addClass("alltotalClass");
                    $('table[id="grid"] tr td[title="合计"]').addClass("alltotalClass");
                    var gridName = 'grid';
                    ve.merger(gridName, 'className');
                    ve.merger(gridName, 'deptName');

                },
            });
            jQuery("#grid").jqGrid(config);
        },
        openFun() {
            this.filterVisible = true;
        },
        //点击保存
        saveFun: function () {
            this.strPeriod = this.formData.periodYear+'年'+this.formData.periodMonth+'期';
            this.base_config.postData = this.formData;
            this.initMethod();
            this.cancelFun();
        },
        //点击取消或者x
        cancelFun: function () {
            this.filterVisible = false;
        },
        //刷新
        refreshFun () {
            $("#grid").jqGrid('setGridParam').trigger("reloadGrid");
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '折旧明细表', openTime: this.openTime, exit: true })
        },
    }
})