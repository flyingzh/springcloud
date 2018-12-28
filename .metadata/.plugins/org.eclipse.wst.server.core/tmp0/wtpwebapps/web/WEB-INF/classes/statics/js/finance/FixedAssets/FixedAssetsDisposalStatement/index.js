new Vue({
    el: '#fixed-assets-disposal-statement',
    data () {
        return {
            openTime: '',
            dateStr: '',
            formData: {
                sPeriodYear: '',
                sPeriodMonth: '',
                ePeriodYear: '',
                ePeriodMonth: '',
                moreDept: false,
                moreCard: false,
                check1: true,
                check2: false,
                check3: false,
                check4: false,
                check5: false,
                check6: false,
                assetCode:'',
                sobId:''
            },
            periodYear: [],
            sPeriodList: [],
            ePeriodList: [],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/app/faProcessingTable/list',
                datatype: 'json',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
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
                shrinkToFit: false
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            printModal: false,
            printInfo: {},
            dataList: [],
            dataParams: {},
            organizationList: [],
            showAssetsList: false,
            selectAssets: '',
        }
    },
    created: function () {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted () {
        this.initData();
        this.initMethod();
    },
    methods: {
        //资产列表弹窗
        onAssets (bool) {
            this.showAssetsList = bool;
        },
        //关闭资产列表弹窗
        sureAssets () {
            // this.card.AssetsId = this.selectAssets.id;
            this.formData.assetCode = this.selectAssets.assetCode;
            this.onAssets(false);
        },
        changeSperiod (year) {  //改变开始期间
            this.sPeriodList = this.dataParams.period[year];
            if (this.sPeriodList.length > 0) {
                this.formData.sPeriodMonth = this.sPeriodList[0].value;
            }
        },
        changeEperiod (year) {  //改变结束期间
            this.ePeriodList = this.dataParams.period[year];
            if (this.ePeriodList.length > 0) {
                this.formData.ePeriodMonth = this.ePeriodList[0].value;
            }
        },
        initData () {  //初始化日期数据
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/app/faProcessingTable/getAssetPeriod',
                success: function (result) {
                    var code = result.data.code;
                    if (code == '-9999') {
                        that.$Message.info(result.data.msg);
                        return;
                    }
                    var data = result.data.data;
                    that.dataParams = data;
                    var currencyYear = data.list[2].value;
                    var currencyPeriod = data.list[3].value;
                    if (data.period != null) {
                        that.periodYear = data.period.yearList;
                        that.formData.sPeriodYear = Number(currencyYear);
                        that.formData.ePeriodYear = Number(currencyYear);
                        that.sPeriodList = data.period[that.formData.sPeriodYear];
                        that.ePeriodList = data.period[that.formData.ePeriodYear];
                        that.formData.sPeriodMonth = Number(currencyPeriod);
                        that.formData.ePeriodMonth = Number(currencyPeriod);
                    }
                    that.organizationList = result.data.organizationList;
                    if(that.organizationList.length>0){
                         that.formData.sobId = result.data.sobId;
                    }
                }
            });
        },
        queryParams () {  //查询参数
            var sPeriodYear = this.formData.sPeriodYear;
            var ePeriodYear = this.formData.ePeriodYear;
            var sPeriodMonth = this.formData.sPeriodMonth;
            var ePeriodMonth = this.formData.ePeriodMonth;
            var i = 0;
            if (sPeriodYear == ePeriodYear && sPeriodMonth > ePeriodMonth) {
                this.$Message.info("起始年期不能大于截止年期！");
                i = 1;
            }
            if (sPeriodYear > ePeriodYear) {
                this.$Message.info("起始年期不能大于截止年期！");
                i = 1;
            }
            if (i == 0) {
                var dateStr = ''
                if (sPeriodYear == ePeriodYear && sPeriodMonth == ePeriodMonth) {
                    dateStr = sPeriodYear + '年' + sPeriodMonth + '期';
                } else {
                    dateStr = sPeriodYear + '年' + sPeriodMonth + '期' + '至' + ePeriodYear + '年' + ePeriodMonth + '期';
                }
                this.dateStr = dateStr;
                this.filterVisible = false;
                return false;
            }
            return true;
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            var _cn = ['id'], _col = [{ name: 'id', width: 30, hidden: true, frozen: true }];
            var _dcn = ['资产编码', '资产名称', '规格', '使用日期', '处理前数量', '处理数量', '原值', '累计折旧', '处理费用', '残值收入', '使用寿命', '剩余寿命', '处理时间', '处理原因']
            var _dcol = [
                { name: 'assetCode', width: 120, },
                { name: 'assetName', width: 120, },
                { name: 'model', width: 120, },
                {
                    name: 'enterAccountDate', width: 120, formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue != null) {
                            return new Date(cellvalue).format("yyyy-MM-dd");
                        } else {
                            return "";
                        }
                    }
                },
                { name: 'num', width: 120, },
                { name: 'clearNum', width: 120, },
                { name: 'totalVal', width: 120,formatter:'currency' ,decimalPlaces:2 },
                { name: 'deprService', width: 120, formatter:'currency' ,decimalPlaces:2},
                { name: 'clearAmount', width: 120,formatter:'currency' ,decimalPlaces:2 },
                { name: 'salvageIncome', width: 120, formatter:'currency' ,decimalPlaces:2},
                { name: 'expectUsePeriods', width: 120, },
                { name: 'usePeriodsBeforeservice', width: 120, },
                {
                    name: 'clearDate', width: 120, formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue != null) {
                            return new Date(cellvalue).format("yyyy-MM-dd");
                        } else {
                            return "";
                        }
                    }
                },
                { name: 'remark', width: 120, }
            ]
            this.formData.check1 && (_cn.push('类别'), _col.push({ name: 'className', width: 100, frozen: true }));
            this.formData.check2 && (_cn.push('使用部门'), _col.push({ name: 'deptName', width: 100, frozen: true }));
            this.formData.check3 && (_cn.push('经济用途'), _col.push({ name: 'name', width: 100, frozen: true }));
            this.formData.check4 && (_cn.push('存放地点'), _col.push({ name: 'locationName', width: 100, frozen: true }));
            this.formData.check5 && (_cn.push('变动方式'), _col.push({ name: 'changemodeName', width: 100, frozen: true }));
            this.formData.check6 && (_cn.push('使用状态'), _col.push({ name: 'stateName', width: 100, frozen: true }));

            this.colNames = [..._cn, ..._dcn];
            this.colModel = [..._col, ..._dcol];

            this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_handle_wrapper"); // 获得整个表格容器
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
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]))
                    console.log(rows);
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            $("#grid").jqGrid('setGridParam').trigger("reloadGrid");
        },
        save () {
            if (!this.queryParams()) {
                this.base_config.postData = this.formData;
                this.initMethod();
            }
        },
        cancel () {
            this.filterVisible = false;
        },
        exportExcel () {
            window.open();
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '处理情况表', openTime: this.openTime, exit: true })
        }
    },
});