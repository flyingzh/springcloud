var ve = new Vue({
    el: '#fixed-assets-depreciation-summary',  //固定资产折旧汇总表
    data() {
        return {
            openTime: '',
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
                checkDept: false,
            },
            organizationEntityList: [],
            dataList: [],
            initFormList:[],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/app/faDepreciationSummaryTable/summaryList',
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
                shrinkToFit: false,
                scroll:1
            },
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
            selectAssets: [],
            periodYear:[],
            colNames:[],
            colModel:[],
            tableHeaders:[]
        }
    },
    created: function () {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    //获取会计科目列表
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
            this.formData.assetCode = this.selectAssets.assetCode;
            this.showAssetsList = false;
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
        initFormData(){ //初始化条件参数
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
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            var _cn = ['id'], _col = [{ name: 'id', width: 30, hidden: true ,key:true}];
            var _dcn = ['期初原值', '期初累计折旧', '期初净值', '期初减值准备', '期初净额', '原值增加',
                       '原值减少', '折旧调增', '折旧调减', '减值准备调增', '减值准备调减', '本期折旧额',
                       '本年折旧额', '本年实际计提折旧额','期末原值','期末累计折旧','期末净值','期末减值准备','期末净额'];
            var _dcol = [
                { name: 'initValueFor', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'initAddDepreciation', width: 120,formatter:'currency',decimalPlaces:2 },
                { name: 'initNetValue', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'initAllowance', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'initNetAmount', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'addValueFor', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'subtractValueFor', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'addDepreciation', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'subtractDepreciation', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'subtractValueIncrease', width: 120,formatter:'currency',decimalPlaces:2 },
                { name: 'subtractValueSubtract', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'thisPeriodDepreciationAmount', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'thisYearDepreciationAmount', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'thisYearAddDepreciationAmount', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'endValueFor', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'endAddDepreciation', width: 120, formatter:'currency',decimalPlaces:2},
                { name: 'endNetValue', width: 120,formatter:'currency',decimalPlaces:2 },
                { name: 'endAllowance', width: 120,formatter:'currency',decimalPlaces:2},
                { name: 'endNetAmount', width: 120,formatter:'currency',decimalPlaces:2 }
            ]
            this.formData.checkClass && (_cn.push('类别'), _col.push({
                name: 'className', width: 100,align: 'center',
                cellattr: function(rowId, tv, rawObject, cm, rdata) {
                    //合并单元格
                    return 'id=\'className' + rowId + '\'';
                }
            }));
            this.formData.checkDept && (_cn.push('使用部门'), _col.push({ name: 'deptName', width: 100 }));
            /*  this.formData.check2 && (_cn.push('经济用途'), _col.push({ name: 'name', width: 100, frozen: true }));*/
            /*  this.formData.check4 && (_cn.push('存放地点'), _col.push({ name: 'locationName', width: 100, frozen: true }));*/
            /*  this.formData.check5 && (_cn.push('变动方式'), _col.push({ name: 'changemodeName', width: 100, frozen: true }));*/
            /*  this.formData.check6 && (_cn.push('使用状态'), _col.push({ name: 'stateName', width: 100, frozen: true }));*/
            this.colNames = [..._cn, ..._dcn];
            this.colModel = [..._col, ..._dcol];
            this.base_config.height = $(window).height() - 100;
            var tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel,tableHeaders);
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
            var parent = $(".jqGrid_summary_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table>`).appendTo(parent);
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
                    var gridName = 'grid';
                    if(ve.formData.checkClass && ve.formData.checkDept && allCountID.length>0){
                        ve.merger(gridName, 'className');
                        console.log(ve.formData.checkClass,ve.formData.checkDept);
                    }
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        openFun() {
            this.filterVisible = true;
        },
        //点击保存
        saveFun: function () {
            if(!this.formData.checkClass&&!this.formData.checkDept){
                this.$Message.info("汇总项目不能为零！");
                return;
            }
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
        refreshFun(){
            $("#grid").jqGrid('setGridParam').trigger("reloadGrid");
        },
        //退出
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '折旧汇总表', openTime: this.openTime, exit: true });
        }
    }
})