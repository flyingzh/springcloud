var vm = new Vue({
    el: '#wageCostAllotDetail',
    data() {
        return {
            openTime: '',   //用于控制退出按钮
            formData: {
                sobId: 1, // 组织id
                year: 0, // 会计年度
                period: 0, // 会计期间
                wageCategoryId: 0, //工资类别id
                costAllocationId: 0 // 费用分配id
            },
            yearAndPeriodList: [],
            periodList: [],
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/wmCostAllot/getExpenseDistributionSheet',
                // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
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
            dataList: [],
            tableHeaders: [],
            wageCategoryList: [], // 工资类别集合
            costAllocationList: [],//工资分配集合
        }
    },
    created: function () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted() {
        this.initData();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        selectionPeriod(type) {
            for (var i = 0, len = this.yearAndPeriodList.length; i < len; i++) {
                if (this.yearAndPeriodList[i].year == this.formData.year) {
                    this.periodList = this.yearAndPeriodList[i].period;
                    if (!type) {
                        this.formData.period = this.periodList[0];
                    }
                    return;
                }
            }
        },
        initData() {  //初始化日期数据
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/distributionSheetController/init',
                success: function (result) {
                    console.log("result", result)
                    if (result == null || result.code != '100100') {
                        that.$Modal.error({
                            title: '提示',
                            content: result == null || result.msg == null || result.msg == '' ? "页面初始化失败" : result.msg
                        })
                    } else {
                        that.wageCategoryList = result.data.categoryList
                        that.formData.wageCategoryId = result.data.categoryId;
                        that.costAllocationList = result.data.WmCostAllotEntityList;
                        that.yearAndPeriodList = result.data.yearAndPeriods.list;
                        that.formData.year = result.data.yearAndPeriods.year;
                        that.selectionPeriod(1);
                        that.formData.period = result.data.yearAndPeriods.period;
                        if (!that.costAllocationList.length) {
                            that.$Modal.error({
                                title: '提示',
                                content: "该工资类别下没有费用分配,请重新选择"
                            })
                        } else {
                            that.formData.costAllocationId = that.costAllocationList[0].id;
                            that.getGridData();
                        }
                    }
                },
                error(result) {
                    that.$Modal.error({
                        title: '提示',
                        content: "页面初始化失败"
                    })
                }
            });
        },
        selectDefault() {
            var _that = this;
            _that.formData.costAllocationId = 0;
            var id = _that.formData.wageCategoryId;
            $.ajax({
                url: contextPath + "/category/select/" + id,
                type: "post",
                async: false,
                success: function (data) {
                    var _text = '';
                    if (data.code == '100100') {
                        _that.getCostAllocationList();
                        _text = data.msg;
                    } else {
                        _text = data.msg;
                    }
                    _that.$Message.info({
                        content: _text,
                        duration: 3
                    });
                }
            });
        },
        //获取工资类别下的费用分配列表
        getCostAllocationList() {
            var that = this;
            that.costAllocationList = [];
            $.ajax({
                type: 'post',
                async: false,
                data: {categoryId: that.formData.wageCategoryId},
                url: contextPath + '/distributionSheetController/getWmCostAllotList',
                success: function (result) {
                    if (result.code == '100100') {
                        that.costAllocationList = result.data;
                        console.log("that.costAllocationList", that.costAllocationList)
                        if (!that.costAllocationList.length) {
                            that.$Modal.error({
                                title: '提示',
                                content: "该工资类别下不存在费用分配",
                            })
                        }
                    }
                },
                error(result) {
                    that.$Modal.error({
                        title: '提示',
                        content: result.msg,
                    })
                }
            });
        },
        //切换分配名称时调用函数 清空表格,重新生成数据
        selectCostAllocation() {
            this.delTable();

            if (this.formData.costAllocationId) {
                this.getGridData();
            }
        },
        delTable() {
            //清空列名称 及 数据
            this.colNames = [];
            this.colModel = [];
            this.dataList = [];
            $("#grid").empty();// 清空表格内容
            var parent = $("#subsidiaryLedger_jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        getGridData() {
            let that = this;
            if (!that.formData.period) {
                that.$Modal.error({
                    title: '提示',
                    content: "请选择会计期间",
                })
                return;
            }
            let pram = {
                wageCategoryId: that.formData.wageCategoryId,
                costAllocationId: that.formData.costAllocationId,
                year: that.formData.year,
                period: that.formData.period
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: pram,
                url: contextPath + '/distributionSheetController/getExpenseDistributionSheet',
                success: function (result) {
                    var data = result.data;
                    that.dataList = data.entityList;
                    that.tableHeaders = data.headerList;
                    console.log("data", data)
                    var col = data.colList;
                    for (var i = 0, len = col.length; i < len; i++) {
                        var colName = {name: '', width: 130, hidden: false};
                        that.colNames.push(col[i].name);
                        console.log(col[i].name, col[i].val)
                        colName.name = col[i].val;
                        that.colModel.push(colName);
                    }
                    that.jqGridList();
                }
            });
        },
        // 生成jqGrid
        jqGridList() {
            let that = this;
            console.log('that.colNames', that.colNames)
            console.log('that.colModel', that.colModel)
            console.log('that.tableHeaders', that.tableHeaders)
            console.log('that.dataList11', that.dataList)
            jQuery("#grid").jqGrid({
                datatype: "local",
                colNames: that.colNames,
                colModel: that.colModel,
                data: that.dataList,
                sortable: false,
                styleUI: 'Bootstrap',
                height: $(window).height() - 210,
                loadComplete: function (ret) {
                    $("table[id='grid']").addClass("alltotalClass");
                },
                gridComplete() { // 多表头表格设置
                    console.log("that.tableHeader11s", that.tableHeaders)
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: that.tableHeaders
                    });
                },
            });
            this.$Message.info("数据加载中...");
        },
        refresh() { //刷新
            this.selectCostAllocation();
        },
        print1() {
            var that = this;
            //  that.dataList;
            //  that.tableHeaders
            //  that.colModel
            that.colModel;
            var _thead = `<tr class='thCs'>`, _tbody = `<tr>`, _tfoot = '';
            var _thead1 = `<tr class='thCs'>`;
            var col = that.colNames;
            var head = that.tableHeaders;
            var list = that.dataList;
            var model = that.colModel;
            var maxLen = that.colNames.length > 10 ? 10 : that.colNames.length;
            var width = 100 / maxLen;
            for (var i = 0, len = col.length, j = 0; i < len; i++) {
                if (i == 0) {
                    _thead += `<th rowspan="2" style="width: ${width}%">${col[i]}</th>`;
                    continue;
                }
                if (i == len - 1) {
                    _thead += `<th rowspan="2" style="width: ${width}%">${col[i]}</th></tr>`;
                    continue;
                }
                if (i % 3 == 1) {
                    _thead += `<th colspan="3" style="width: ${width * 3}%">${head[j].titleText}</th>`;
                    j++;
                }
                var tr = `<th style="width: ${width}%">${col[i]}</th>`
                _thead1 += tr;
            }
            _thead1 += `</tr>`;
            _thead += _thead1;
            console.log("_thead", _thead)
            for(var i = 0,len = list.length;i<len;i++){
                for(var j = 0 ,lent = model.length;j<lent;j++ ){
                    var str = model[j]['name'];//typeof val !== 'number'  accounting.formatMoney(sum, '', 2);
                    var listStr = list[i][str];
                    if (listStr){
                        if (typeof listStr == 'number'){
                            listStr = accounting.formatMoney(listStr, '', 2);
                        }
                    }else {
                        listStr = '';
                    }
                    _tbody += ` <td>${ listStr }</td>`;
                }
                _tbody += `</tr>`;
            }

            let data = {
                title: "费用分配明细表",
                template: 12,
                'titleInfo': [       // title

                ],
                'data': [],
                'colMaxLenght': 10,
                'tbodyInfo': {
                    'theadTX': _thead,
                    'tbodyTX': _tbody,
                    'tfootTX': _tfoot
                }

            }
            htPrint(data);

        },
        exitPrevent() {
            //关闭当前页签
            var name = '工资费用分配表';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
        exportExcel() {
            var that = this;
            if (!that.formData.period) {
                that.$Modal.error({
                    title: '提示',
                    content: "请选择会计期间",
                })
                return;
            }
            var _url = contextPath + "/distributionSheetController/derivedExcel?wageCategoryId=" + that.formData.wageCategoryId +
                "&costAllocationId=" + that.formData.costAllocationId + "&year=" + that.formData.year + "&period=" + that.formData.period;
            window.open(_url);
        },
        formartMoney(value) {
            return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, ",");
        },
    },
    watch:
        {
            'formData.filterType':

                function (curVal, oldVal) {
                    this.formData.index = 0;
                    this.formData.indexLen = 0;
                }
        }
})