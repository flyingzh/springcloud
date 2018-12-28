var ve = new Vue({
    el: '#fixed-assets-increment-decrement', //固定资产增减表
    data() {
        return {
            dateStr: "",
            openTime: '',
            colNames: [],
            colModel: [],
            yearList: [],
            monthList: [],
            printInfo: {},
            accountYearList: [],   //年度List
            accountPeriodList: [], //期间List
            sysStartYear:0,       //系统启用年
            sysStartPeriod:0,     //系统启用期间
            currenAccountYear:0,       //系统当前年
            currenAccountPeriod:0,     //系统当前期间
            startYearPeriodList:[],   //选择启用年度时 启用年!=当前年 可选期间
            endYearPeriodList:[],     //选择当前年度时 可选期间
            periodList: [],           //除开始年度,当前年度可用的全年12期 期间
            startEndPeriodList: [],   //启用年 = 当前期间年
            currentAccountParams:'',
            printModal: false,
            formData: {
                accountYear: '',
                accountPeriod: '',
                item: 'card.asset_type_id',
                initPeriod: false,
                //
                assetCode: "",
                assetTypeId: "",
                changeModeId: "",
                checkClass: true,
                checkDept: true,
                clearBool: false,
                nd: 1541384784518,
                page: 1,
                periodMonth: 10,
                periodYear: 2018,
                rows: 99999,
                sidx: "",
                sobId: 1,
                sord: "asc",
                useDeptId: "",
                useStatusId: "",
                zeroBool: false,
                _search: false
            },
            filterCard:{
                sobId:layui.data('user').userCurrentOrganId,
                accountYear: 0,
                accountPeriod: 0,
                checkInitPeriod:false
            },
            accountYear: 0,
            accountPeriod: 0,
            isEdit: true,
            filterVisible: false,
            dataList: [],
            periodList: [],
            organizationList:[],
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/faIncreaseDecrease/getIncreaseDecreaseInfo',
                datatype: 'json',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                serializeGridData: function (postData) {
                    return JSON.stringify(postData);
                },
                postData: {},
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false,
                scroll: 1,
            },
        }
    },
    //获取会计科目列表
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.filterVisible = true;
        let _vm = this;
        _vm.initPage();
        this.initDataFilter();
    },
    methods: {
        exitPrevent() {
        },
        //初始化时间
        initDataFilter(){
            this.getOrgList();
            this.initFilterYearPeriod();
        },
        //获取组织列表
        getOrgList () {
            var that = this;
            $.ajax({
                url: contextPath + "/bankdepositstatement/getognlist",
                type: "post",
                success: function (data) {
                    that.organizationList = data.data;
                }
            });
        },
        //初始化过滤时间
        initFilterYearPeriod(){
            var that = this;
            $.ajax({
                url: contextPath + "/faClearChange/filterDate",
                type: "post",
                success: function (res) {
                    if (res.code=='100100'){
                        that.accountYearList = res.data.yearList;
                        //除开始年度,当前年度可用的全年12期 期间
                        that.accountPeriodList = res.data.periodList;
                        that.periodList = res.data.periodList;
                        //选择启用年度时 可选期间
                        that.startYearPeriodList = res.data.startYearPeriodList;
                        //选择当前年度时 可选期间
                        that.endYearPeriodList = res.data.endYearPeriodList;
                        //启用年 = 当前期间年
                        that.startEndPeriodList = res.data.startEndPeriodList;
                        //系统启用 年 期间
                        that.sysStartYear = res.data.startSysYear;
                        that.sysStartPeriod = res.data.startSysPeriod;
                        //当前系统 年 期间
                        that.filterCard.accountYear = that.accountYear = that.currenAccountYear = res.data.currenAccountYear;
                        that.filterCard.accountPeriod = that.accountPeriod =that.currenAccountPeriod = res.data.currenAccountPeriod;
                        //当前系统为启用年时 期间选择范围为 开始期间-当前期间
                        if(that.sysStartYear==that.currenAccountYear ){
                            that.accountPeriodList = that.startEndPeriodList;
                        }else {
                            //当前系统为非启用年时 期间选择范围为 1-当前期间
                            that.accountPeriodList = that.endYearPeriodList;
                        }
                    }
                }
            });
        },
        changeYearMethod(value){
            setTimeout(function () {
                this.$refs.sel1.reset();
            }, 500);
            if(value==this.sysStartYear && this.currenAccountYear!=this.sysStartYear){
                //选择为启用年 当前年!=启用年
                this.accountPeriodList= this.startYearPeriodList;
            }else if(value==this.sysStartYear && this.currenAccountYear==this.sysStartYear){
                //选择为启用年 当前年=启用年
                this.accountPeriodList= this.startEndPeriodList;
            }else if(value==this.currenAccountYear && this.currenAccountYear!=this.sysStartYear){
                //选择为当前年 当前年!=启用年
                this.accountPeriodList= this.endYearPeriodList;
            }else {
                //除开始年度,当前年度之间年 可用的全年12期 期间
                this.accountPeriodList= this.periodList;
            }
            let period = this.accountPeriodList[0];
            console.log("this.accountPeriodList[0]---",period);
            // this.filterCard.accountPeriod =  this.accountPeriodList[0];
            this.accountPeriod = period;
        },
        initPage() {
            //初始化数据
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/faanalysiscontroller/initPage',
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
                    _vm.yearList = dataInfo.yearList;
                    _vm.monthList = dataInfo.monthList;
                    $.each(_vm.yearList, function (idx, ele) {
                        if (ele.value == dataInfo.currentYear) {
                            _vm.formData.accountYear = ele.name;
                        }
                    });
                    $.each(_vm.monthList, function (idx, ele) {
                        if (ele.value == dataInfo.currentMonth) {
                            _vm.formData.accountPeriod = ele.name;
                        }
                    });

                }
            });
        },
        // 初始值
        initMethod() {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader() {
            var _cn = ['id'], _col = [{name: 'id', width: 30, hidden: true, key: true}];
            var _dcn = ['项目', ' ', '金额'];
            var _dcol = [
                {
                    name: 'superCodeName', width: 200,
                    cellattr: function (rowId, value, rowObject, colModel, arrData) {
                        //合并单元格
                        if (!rowObject.secondCodeName) {
                            return ' colspan=2';
                        }
                        return 'id=\'superCodeName' + rowId + '\'';
                    },
                    formatter: function (value, options, rData) {
                        return value;
                    }
                },
                {
                    name: 'secondCodeName', width: 150,
                    cellattr: function (rowId, value, rowObject, colModel, arrData) {
                        return !rowObject.secondCodeName ? " style=display:none; " : '';
                    }
                },
                {name: 'orgValAdjust', width: 300, align:'right',
                    formatter: function (value, options, rData) {
                        return value==0? '0.00' : accounting.formatNumber(value, 2);
                    }
                },
            ]

            this.colNames = [..._cn, ..._dcn];
            this.colModel = [..._col, ..._dcol];

            this.base_config.height = $(window).height() - 130;
            this.tableHeaders = [
                // { startColumnName: 'initValueFor', numberOfColumns: 2, titleText: '项目' },
            ];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        //合并行
        MergerRowspan(gridName, cellName) {
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
                for (var j = i + 1; j <= length; j++) {
                    //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
                    var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
                    if (before[cellName] == end[cellName]) {
                        rowSpanTaxCount++;
                        $("#" + gridName + "").setCell(mya[j], cellName, '', {display: 'none'});
                    } else {
                        break;
                    }
                }
                $("#" + gridName + "").setCell(mya[i], cellName, '', '', {rowspan: rowSpanTaxCount});
            }
        },
        //合并列
        MergerColspan(gridName, rowId, id, CellName) {
            console.log(gridName, rowId, id, CellName)
            $("#" + gridName + "").setCell(rowId, id, '', {display: 'none'});
            $("#" + CellName + "" + rowId + "").attr("colspan", 2);
        },
        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {
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
                    console.log(rows);
                    var gridName = 'grid';
                    ve.MergerRowspan(gridName, 'superCodeName');
                    // ve.MergerColspan(gridName,1, 'id','initValueFor');
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        openFun() {
            this.filterVisible = true;
        },
        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        //点击保存
        saveFun: function () {
            if(this.filterCard.checkInitPeriod){
                this.filterCard.accountYear=0;
                this.filterCard.accountPeriod=0;
                this.currentAccountParams = '(初始化期间)';
            }else {
                this.filterCard.accountYear=this.accountYear;
                this.filterCard.accountPeriod=this.accountPeriod;
                this.currentAccountParams = this.filterCard.accountYear+"年"+ this.filterCard.accountPeriod+"期";
            }
            this.base_config.postData = this.filterCard;
            this.initMethod();
            this.cancelFun();
        },
        //点击取消或者x
        cancelFun: function () {
            this.filterVisible = false;
        },
        refreshFun() {
            this.initMethod();
        },
        exportExcel() {
            //引出,导出excel表格
            let d = this.formData;
            let _url = contextPath + '/faanalysiscontroller/exportExcel?accountPeriod=' + d.accountPeriod + '&accountYear=' + d.accountYear + '&initPeriod=' + d.initPeriod + '&item=' + d.item;
            window.open(_url);
        },
        //打印
        printV() {
            let _vm = this;
            let itemType = '';
            console.log("===dataList", _vm.dataList);
            if (!_vm.dataList || !_vm.dataList.length) {
                _vm.$Message.info({
                    content: '无打印数据',
                    closable: true,
                    duration: 3
                });
                return;
            }

            //根据过滤条件获取对应的标题字段
            if (_vm.formData.item === 'card.asset_type_id') {
                itemType = '资产类别';
            } else if (_vm.formData.item === 'card.use_state_id') {
                itemType = '使用状态';
            } else if (_vm.formData.item === 'card.change_type') {
                itemType = '变动方式';
            }

            //单行表头
            var _info = {
                'title': '固定资产构成分析表', //标题
                'template': 1, //模版
                'titleInfo': [{'name': '会计期间', 'val': _vm.dateStr}], //title
                'colNames': [   // 列名与对应字段名
                    {'name': itemType, 'col': 'itemName'},
                    {'name': '资产编码', 'col': 'assetCode'},
                    {'name': '资产名称', 'col': 'assetName'},
                    {'name': '期末原值', 'col': 'orgVal', 'formatNub': true},
                    {'name': '占该' + itemType + '%', 'col': 'percentOfItem'},
                    {'name': '占总固定资产%', 'col': 'percentOfTotal'}
                ],

                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': _vm.dataList,  // 打印数据  list
                'totalRow': false
            };
            // 弹窗选择列 模式
            _vm.printInfo = _info;
            _vm.printModalShow(true);
        },

        printModalShow(_t) {
            this.printModal = _t;
        },

        exitThisPage() {
            //退出当前页签
            window.parent.closeCurrentTab({name: '构成分析表', openTime: this.openTime, exit: true})
        },
    },
});