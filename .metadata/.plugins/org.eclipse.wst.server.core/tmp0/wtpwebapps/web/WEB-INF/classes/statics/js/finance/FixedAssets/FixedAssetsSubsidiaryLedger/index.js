var vm = new Vue({
    el: '#fixedAssetsSubsidiaryLedger',
    data () {
        return {
            formData: {
                sobId: 1,
                filterType: 1,
                dateStr: '',
                startYear: '',
                startPeriod: '',
                endYear: '',
                endPeriod: '',
                index: 0,
                indexLen: 0,
                claType: '全部',
                assetCode: '',
                assetName: '',
                modelType: '',
                depValue: '',//用于input展示部门
                depId: '',
                depName: '',
                assetTypeValue: '',//用于input展示类别
                assetType: '',
                depRateCk:true,
            },
            faStartYear:'',
            faStartPeriod:'',
            faCurYear:'',
            faCurPeriod:'',
            openTime: '',
            isPreDisabled: false,
            isNextDisabled: false,
            yearList: [],
            periodList: [],
            filterVisible: false,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/subsidiaryLedger/detail',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                jsonReader: {
                    root: "data.list",
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
            orgList: [],
            showAssetsList: false,
            selectAssets: '',
            showAssetType: false,
            showDepType: false,
            assetTypeTreeSetting: {
                callback: {
                    onClick: this.assetTypeTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            depTreeSetting: {
                callback: {
                    onClick: this.depTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            }
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

        switchAsset (type) {
            //1： 向前  2：向后
            let _vm = this;
            if (type == 1 && _vm.formData.index == 0) {
                _vm.$Message.error("没有更多类别了")
                _vm.isPreDisabled = true;
                return;
            }
            if (type == 2 && _vm.formData.index >= _vm.formData.indexLen) {
                _vm.$Message.error("没有更多类别了")
                _vm.isNextDisabled = true;
                return;
            }
            if (type == 1) {
                _vm.formData.index = _vm.formData.index - 1;
            } else {
                _vm.formData.index = _vm.formData.index + 1;
            }
            _vm.initMethod();

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
            // this.formData.assetsName = this.selectAssets.supplierName;
            this.formData.assetCode = this.selectAssets.assetCode;
            this.formData.assetName = this.selectAssets.assetName;
            this.showAssetsList = false;
        },
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            if (treeNode.children != null && treeNode.children.length != 0) {
                /*this.$Message.error("请选择最明细类别");*/
                return;
            }
            this.formData.assetTypeValue = treeNode.name;
            this.formData.assetType = treeNode.id;
            this.showAssetType = false;
        },
        depTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            if (treeNode.children != null && treeNode.children.length != 0) {
                /*this.$Message.error("请选择最明细部门");*/
                return;
            }
            this.formData.depValue = treeNode.name;
            this.formData.depName = treeNode.name;
            this.formData.depId = treeNode.id;
            this.showDepType = false;
        },

        showTree (value, which, index) {
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showDepType':
                    if (this.showDepType === true) {
                        this.showDepType = false;
                        return;
                    }
                    this.showDepType = value;
                    break;
            }
        },

        getLastDay (y, m) {//根据年月获取当月最后一天
            var dt = new Date(y, m, 1);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            return cdt.getFullYear() + "-" + (Number(cdt.getMonth()) + 1) + "-" + cdt.getDate();
        },
        operateDate (date) {
            return new Date(date).format("yyyy-MM-dd");
        },
        initData () {  //初始化日期数据
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/expenseAllocation/initData',
                success: function (result) {
                    if (result == null || result.code != '100100') {
                        that.$Modal.error({
                            title:'提示',
                            content:result==null||result.msg==null||result.msg==''?"页面初始化失败":result.msg
                        })
                    } else {
                        var data = result.data;
                        that.yearList = data.year.year;
                        that.periodList = data.year.period;
                        that.formData.startYear = data.year.presents[0];   //默认选中当前会计年度
                        that.formData.startPeriod = data.year.presents[1];
                        that.formData.endYear = data.year.presents[0];
                        that.formData.endPeriod = data.year.presents[1];

                        that.faStartYear = data.faStartYear;
                        that.faStartPeriod = data.faStartPeriod;
                        that.faCurYear = data.year.presents[0];
                        that.faCurPeriod = data.year.presents[1];

                        that.orgList = data.org;
                        that.formData.sobId = that.orgList[0].value
                        that.queryParams();
                        that.initMethod();
                    }
                },
                error(result){
                    that.$Modal.error({
                        title:'提示',
                        content:"页面初始化失败"
                    })
                }
            });
        },

        queryParams () {  //查询参数
            var startYear = this.formData.startYear;
            var endYear = this.formData.endYear;
            var startPeriod = this.formData.startPeriod;
            var endPeriod = this.formData.endPeriod;
            var dateStr = startYear + '年' + startPeriod + '期' + '至' + endYear + '年' + endPeriod + '期';
            if (startYear == endYear && startPeriod == endPeriod) {
                dateStr = startYear + '年' + startPeriod + '期';
            }
            this.formData.dateStr = dateStr;
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            let that = this;
            that.colNames = ['id', '日期', '凭证字号', '摘要', '资产编码',
                '资产名称', '币别', '原币金额', '借方金额', '贷方金额', '余额',
                '借方金额', '贷方金额', '余额', '净值(综合本位币)',
                '借方金额', '贷方金额', '余额', '净额(综合本位币)', '数量'
            ];
            that.colModel = [
                { name: 'id', width: 30, hidden: true },
                { name: 'dateStr', width: 150, align: 'center' },
                { name: 'voucherData', width: 100, align: 'center' },
                { name: 'summary', width: 100, align: 'center' },
                { name: 'faCode', width: 100, align: 'center' },
                { name: 'faName', width: 150, align: 'center' },
                { name: 'currencyData', width: 100, align: 'center' },
                { name: 'amountFor', width: 150, align: 'right' },
                {
                    name: 'orgDebit', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'orgCredit', width: 150, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'orgBalance', width: 150, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'deprDebit', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'deprCredit', width: 150, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'deprBalance', width: 150, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'netWorth', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'devalDebit', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'devalCredit', width: 150, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'devalBalance', width: 150, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'netCash', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
                {
                    name: 'quantity', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return that.formartMoney(value);
                    }
                },
            ];
            that.tableHeaders = [
                { startColumnName: 'orgDebit', numberOfColumns: 3, titleText: '原值(综合本位币)' },
                { startColumnName: 'deprDebit', numberOfColumns: 3, titleText: '累计折旧(综合本位币)' },
                { startColumnName: 'devalDebit', numberOfColumns: 3, titleText: '减值准备(综合本位币)' }
            ];
            that.base_config.height = $(window).height() - 180;
            that.jqGridInit(that.colNames, that.colModel, that.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $("#subsidiaryLedger_jqGrid_wrapper"); // 获得整个表格容器
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
                    // _vm.dataList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                    console.log(ret)
                    if (ret.code == '100100') {
                        let info = ret.data;
                        _vm.formData.index = info.index;
                        _vm.formData.indexLen = info.indexLen;

                        if (_vm.formData.index == 0) {
                            _vm.isPreDisabled = true;
                        } else {
                            _vm.isPreDisabled = false;
                        }

                        if (_vm.formData.indexLen == 0 || _vm.formData.index >= _vm.formData.indexLen) {
                            _vm.isNextDisabled = true;
                        } else {
                            _vm.isNextDisabled = false;
                        }
                        if (_vm.formData.filterType == 1) {
                            _vm.isPreDisabled = true;
                            _vm.isNextDisabled = true;
                        }
                        _vm.formData.claType = info.claName;
                        _vm.formData.indexLen = info.indexLen;

                    } else {
                        _vm.formData.index = 0;
                        _vm.formData.claType = "全部";
                        _vm.formData.indexLen = 0;
                        _vm.isPreDisabled = false;
                        _vm.isNextDisabled = false;
                        console.log(ret.msg)
                        _vm.$Modal.error({
                            title:'提示',
                            content:ret==null?'暂无数据或系统异常':ret.msg
                        })
                    }
                },
                gridComplete: function () {



                    //  var rows=$("#grid").jqGrid("getRowData");
                    //  $('#null').find("td").addClass("SelectBG");
                    /*var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]))
                    var accountName = '';
                    for (var i = 0; i < rows.length; i++) {
                        accountName = rows[i].accountName;
                        if (accountName == '小计') {
                            $('#' + rows[i].id).find("td").addClass("xjClass");
                        }
                        if (accountName == '总计') {
                            $('#' + rows[i].id).find("td").addClass("totalClass");
                        }
                    }*/
                    // console.log(rows);
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            this.save();
        },
        save () {
            let startYear = this.formData.startYear;
            let startPeriod = this.formData.startPeriod;
            let endYear = this.formData.endYear;
            let endPeriod = this.formData.endPeriod;

            if(startYear>endYear || (startYear == endYear && startPeriod>endPeriod)){
                this.$Message.error('查询起始期间不能大于结束期间');
                return;
            }

            if(startYear<this.faStartYear||(startYear==this.faStartYear&&startPeriod<this.faStartPeriod)
                ||endYear<this.faStartYear || (endYear == this.faStartYear && endPeriod<this.faStartPeriod)
                ||startYear>this.faCurYear||(startYear==this.faCurYear && startPeriod>this.faCurPeriod)
                || endYear>this.faCurYear ||(endYear == this.faCurYear && endPeriod>this.faCurPeriod)){
                this.$Message.error('只能查询从'+this.faStartYear+'年'+this.faStartPeriod+'期至'+this.faCurYear+'年第'+this.faCurPeriod+'期之间的固定资产');
                return;
            }


            /*if(startYear == this.faStartYear && startPeriod<this.faStartPeriod){
                this.$Message.error('只能查询'+this.faStartYear+'年'+this.faStartPeriod+'期之后的固定资产');
                return;
            }
            if(startYear<this.faStartYear || startYear>this.faCurYear||(startYear==this.faCurYear && startPeriod>this.faCurPeriod)){
                this.$Message.error('只能查询'+this.faCurYear+'年'+this.faCurPeriod+'期之前的固定资产');
                return;
            }
            if(endYear>this.faCurYear||(endYear == this.faCurYear && endPeriod>this.faCurPeriod)){
                this.$Message.error('只能查询'+this.faCurYear+'年'+this.faCurPeriod+'期之前的固定资产');
                return;
            }*/
            this.filterVisible = false;
            this.queryParams();
            this.initMethod();
        },
        cancel () {
            this.filterVisible = false;
        },
        exportExcel () {
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '固定资产明细账', openTime: this.openTime, exit: true })
        },
        nullValue (exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        },
        formartMoney (value) {
            return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, ",");
        },
        clearAssetCode(){
            this.formData.assetCode = '';
            this.formData.assetName = '';
        },
        clearAssetType(){
            this.formData.assetType = '';
            this.formData.assetTypeValue = '';
        },
        clearDepId(){
            this.formData.depValue = '';
            this.formData.depName = '';
            this.formData.depId = '';
        }
    },
    watch: {
        /*'formData.assetCode':function (curVal, oldVa) {
            if($.isEmptyObject(this.formData.assetCode)){
                this.formData.assetName = '';
            }
        }*/
        'formData.filterType':function (curVal, oldVal) {
            this.formData.index = 0;
            this.formData.indexLen = 0;
        }
    }
})