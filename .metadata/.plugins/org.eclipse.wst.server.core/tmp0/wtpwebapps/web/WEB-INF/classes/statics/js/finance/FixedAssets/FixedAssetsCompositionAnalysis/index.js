var _vue = new Vue({
    el: '#fixed-assets-composition-analysis', //固定资产构成分析表
    data() {
        return {
            orgName:'',
            dateStr: "",
            openTime: '',
            colNames: [],
            colModel: [],
            yearList: [],
            monthList: [],
            printInfo: {},
            printModal: false,
            itemList: [
                {'name': '资产类别', 'value': 'card.asset_type_id'},
                {'name': '使用状态', 'value': 'card.use_state_id'},
                {'name': '变动方式', 'value': 'card.change_type'},
                {'name': '使用部门', 'value': 'dept.dept_id'},
                /*{'name': '存放地点', 'value': 'location.id'},
                {'name': '经济用途', 'value': 'card.use_type'},*/
            ],
            formData: {
                accountYear: '',
                accountPeriod: '',
                item: 'dept.dept_id',
                initPeriod: false
            },
            isEdit: true,
            filterVisible: false,
            dataList: []
        }
    },
    //获取会计科目列表
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.filterVisible = true;
        let _vm = this;
        _vm.initPage();
    },
    methods: {
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
                    _vm.orgName = layui.data('user').currentOrgName;
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

            var that = this;

            that.colModel = [
                {name: 'id', width: 30, hidden: true},
                {name: 'itemName', width: 175},
                {name: 'assetCode', width: 175, align: "right"},
                {name: 'assetName', width: 175, align: "right"},
                {
                    name: 'orgVal', width: 175, align: "right", formatter: function (value, grid, rows, state) {
                    return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, ",");
                }
                },
                {name: 'percentOfItem', width: 175, align: "right"},
                {name: 'percentOfTotal', width: 175, align: "right"}
            ];
            if (that.formData.item === 'card.asset_type_id') {
                that.colNames = ['id', '资产类别', '资产编码', '资产名称', '期末原值', '占该资产类别%', '占总固定资产%'];
            } else if (that.formData.item === 'card.use_state_id') {
                that.colNames = ['id', '使用状态', '资产编码', '资产名称', '期末原值', '占该使用状态%', '占总固定资产%'];
            } else if (that.formData.item === 'card.change_type') {
                that.colNames = ['id', '变动方式', '资产编码', '资产名称', '期末原值', '占该变动方式%', '占总固定资产%'];
            } else if (that.formData.item === 'dept.dept_id') {
                that.colNames = ['id', '使用部门', '资产编码', '资产名称', '期末原值', '占该使用部门%', '占总固定资产%'];
            }

            that.tableHeaders = [];
            //this.base_config.height = $(window).height() - 140;
            that.jqGridInit(that.colNames, that.colModel, that.tableHeaders);
        },

        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {

            let _vm = this;
            let config = {
                colNames: colNames,
                colModel: colModel,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/faanalysiscontroller/analysisDetail',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                postData: JSON.stringify(_vm.formData),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: -1,
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
                    if (_vm.formData.initPeriod){
                        _vm.dateStr = '初始化数据';
                    }else {
                        _vm.dateStr = _vm.formData.accountYear+'年'+_vm.formData.accountPeriod+'期';
                    }
                },
                gridComplete: function () {
                    // $("table[id='grid'] tr[id='null'] input").attr('style', 'display:none');
                    // $("table[id='grid'] tr[id='0'] input").attr('style', 'display:none';
                    // window.top.home.loading('hide');
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    console.log(rows);

                    $('table[id="grid"] tr td[title="小计"]').siblings().addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="小计"]').addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="合计"]').siblings().addClass("alltotalClass");
                    $('table[id="grid"] tr td[title="合计"]').addClass("alltotalClass");

                    var gridName = 'grid';
                    _vue.Merger(gridName,'itemName');


                    // for (var i = 0; i < rows.length; i++) {
                    //     if (rows[i].assetCode == '小计') {
                    //         console.log('小计+1');
                    //         console.log('#' + rows[i].id);
                    //         $('#' + rows[i].id).find("td").addClass("subtotalClass");
                    //     } else if (rows[i].assetCode == '合计') {
                    //         console.log('合计');
                    //         console.log('#' + rows[i].id);
                    //         $('#' + rows[i].id).find("td").addClass("alltotalClass");
                    //     }
                    // }
                },
            };
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
            // $("#grid").jqGrid('setGridParam', { postData: JSON.stringify(this.formData) }).trigger("reloadGrid");
            this.initMethod();
            this.filterVisible = false;
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
            }else {
                itemType = '使用部门';
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

        exitThisPage () {
          //退出当前页签
            window.parent.closeCurrentTab({ name: '构成分析表', openTime: this.openTime, exit: true })
        },

        //合并页面单元格
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
    },
});