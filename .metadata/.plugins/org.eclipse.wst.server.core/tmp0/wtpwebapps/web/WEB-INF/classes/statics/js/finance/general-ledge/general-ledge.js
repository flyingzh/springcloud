var vm = new Vue({
    el: '#general-ledge',
    data () {
        return {
            isInit1: true,
            // isInit2: true,
            currencyId: 0,
            isShow: true,
            openTime: '',
            showFilter: false,
            subjectEnd: false,
            subjectVisiable: false,
            visible_filter: false,
            showTable_USD: false,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            years: [],
            searchData: {
                subjectYearStart: '',
                subjectYearEnd: '',
                subjectPeriodStart: '',
                subjectPeriodEnd: '',
                subjectStart: '',
                subjectEnd: '',
                ieSubject: '',
                subjectLeaveStart: 1,
                subjectLeaveEnd: 1,
                currencyId: -2,
                noShow: false,
                showForbiddenSubject: false,
                posted: false,
                noShowAndHappen: false,
                showSubjectDetail: false,
                showSubjectLevel: false,
                sobId: '',
                showList: true
            },
            subjectList: [
                { name: '第一期', value: 1 },
                { name: '第二期', value: 2 },
                { name: '第三期', value: 3 },
                { name: '第四期', value: 4 },
                { name: '第五期', value: 5 },
                { name: '第六期', value: 6 },
                { name: '第七期', value: 7 },
                { name: '第八期', value: 8 },
                { name: '第九期', value: 9 },
                { name: '第十期', value: 10 },
                { name: '第十一期', value: 11 },
                { name: '第十二期', value: 12 },
            ],
            currencyList: [],
            base_config: {
                url: contextPath + '/financeBalance/queryFinanceLedge',
                datatype: "json",
                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                rowNum: 999,//一页显示多少条
                //rowList: [10, 20, 30, 40, 50],//可供用户选择一页显示多少条
                // postData: {},
                //pager : '#pager2',//表格页脚的占位符(一般是div)的id
                // sortname: 'orderDate',//初始化的时候排序的字段
                sortable: false,
                // sortorder: "asc",//排序方式,可选desc,asc
                mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                jsonReader: {
                    root: "data",
                },
                styleUI: 'Bootstrap',
                height: $(window).height() - 130,
                // scroll:true,
                // width: window.screen.availWidth - 20,
                viewrecords: true,
                pager: '#pager',
                // caption: "分类总账",//表格的标题名字
            },
            colNames1: [],
            colModel1: [],
            tableHeader: [],
            url: '',
            dataList: [],
            printModal: false,
            printInfo: {},
        }
    },
    methods: {
        sortData (value, name, rows, state) {
            let that = this;
            for (var i = 0; i < value.length; i++) {
                if (value[i] == 0 || value[i] == null) {
                    value[i] = '';
                }
            }

            let str = "";
            let arr = ['debitSideFor','debitSide','creditSide','balance','creditSideFor','balanceFor']
            value.map(function (val, index) {
                let find = arr.find(function(row){
                    return name===row;
                })
                if(find){
                    val = that.formartMoney(val);
                }
                str += "<div class='ht-inner-td'>" + val + "</div>"
            })
            return str;
        },

        initGrid (colname, colmodel, header) {
            let that = this;
            // this.base_config.postData = JSON.stringify(that.search);
            let config = Object.assign({}, this.base_config, {
                colNames: colname,
                colModel: colmodel,
                postData: JSON.stringify(that.searchData),
                gridComplete () {
                    // if (that.isInit1) {
                    jQuery("#list").jqGrid('destroyGroupHeader')
                    jQuery("#list").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: header
                    });
                },
                loadComplete: function (ret) {
                    console.log(ret)
                    that.dataList = ret.data;
                }
                // that.isInit1 = false;
                // }
            })
            jQuery("#list").jqGrid(config)
        },
        pageInit () {
            this.clearTable()
            this.base_config.url = contextPath + '/financeBalance/queryFinanceLedge';
            let that = this;
            this.colNames1 = ['科目编码', '科目名称', '会计年度', '期间', '摘要', '借方', '贷方', '方向', '余额'];
            this.colModel1 = [
                { name: 'subjectCode', width: 100, align: 'left' },
                { name: 'subjectName', width: 100, align: 'left' },
                {
                    name: 'accountingYear', width: 150, align: 'center', formatter: function (value, grid, rows, state) {
                        // console.log(value, grid, rows, state)
                        return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'duration', width: 50, align: 'center', formatter: function (value, grid, rows, state) {
                        return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'remark', width: 70, align: 'center', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'debitSide', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'creditSide', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'directions', width: 70, align: 'center', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'balance', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
            ]
            this.tableHeader = []
            this.initGrid(this.colNames1, this.colModel1, this.tableHeader)

        },
        pageInitType () {
            this.clearTable()
            this.base_config.url = contextPath + '/financeBalance/queryFinanceLedge';
            let that = this;
            this.colNames1 = ['科目编码', '科目名称', '会计年度', '期间', '摘要', '原币', '本位币', '原币', '本位币', '方向', '原币', '本位币'];
            this.colModel1 = [
                { name: 'subjectCode', width: 100, align: 'left', key: true },
                { name: 'subjectName', width: 100, align: 'left' },
                {
                    name: 'accountingYear', width: 50, align: 'center', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'duration', width: 50, align: 'center', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'remark', width: 70, align: 'center', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'debitSideFor', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'debitSide', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'creditSideFor', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'creditSide', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'directions', width: 70, align: 'center', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'balanceFor', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                },
                {
                    name: 'balance', width: 100, align: 'right', formatter: function (value, grid, rows, state) {
                    return that.sortData(value, grid.colModel.name, rows, state);
                    }
                }
            ]
            this.tableHeader = [
                { startColumnName: 'debitSideFor', numberOfColumns: 2, titleText: '借方金额' },
                { startColumnName: 'creditSideFor', numberOfColumns: 2, titleText: '贷方金额' },
                { startColumnName: 'directions', numberOfColumns: 3, titleText: '余额' },
            ]
            this.initGrid(this.colNames1, this.colModel1, this.tableHeader)

        },
        // 清除表格
        clearTable () {
            var parent = $(".jqGrid_wrapper")
            parent.empty();
            $("<table id='list'></table>").appendTo(parent);
            $("<div id='pager'></div>").appendTo(parent);
        },
        sure () {
        },
        handleOpen () {
            this.visible_filter = true;
        },
        detailClick (data) {

        },
        iconPopup (type) {
            this.subjectEnd = type;
            // this.subjectEnd = type == true ? false : true;
            this.subjectVisiable = true;

        },
        //关闭选择科目弹窗
        subjectClose () {
            this.subjectVisiable = false;
        },
        conformCancel () {
            this.confirmConfig.showConfirm = false;
        },
        conformSure () {
            this.confirmConfig.showConfirm = false;
            // this.confirmConfig.onlySure = !this.confirmConfig.onlySure;
        },
        //点击保存，获取所选科目id
        subjectDate (res) {
            console.log(res)
            console.log(res.value)
            if (!this.subjectEnd) {
                this.searchData.subjectStart = res.subjectCode;
            } else {
                this.searchData.subjectEnd = res.subjectCode;
            }
            this.subjectVisiable = false;
        },
        sure (type) {
            let that = this;
            console.log(type)
            if (!type) {
                this.visible_filter = false;
                return;
            }
            this.visible_filter = false;
            console.log(this.searchData)
            // this.base_config.postData = this.searchData
            if (vm.searchData.subjectYearStart > vm.searchData.subjectYearEnd || (vm.searchData.subjectYearStart == vm.searchData.subjectYearEnd && vm.searchData.subjectPeriodStart > vm.searchData.subjectPeriodEnd)) {
                vm.$Message.error("起始期间不能大于结束期间")
                return;
            }
            if (vm.searchData.subjectStart > vm.searchData.subjectEnd && (vm.searchData.subjectStart != null && vm.searchData.subjectEnd != null)) {
                vm.$Message.error("起始科目不能大于终止科目")
                return;
            }
            if (vm.searchData.subjectLeaveStart > vm.searchData.subjectLeaveEnd) {
                vm.$Message.error("起始级别不能大于终止级别");
                return;
            }

            if (vm.currencyId == vm.searchData.currencyId || vm.searchData.currencyId == -2) {
                vm.searchData.currencyId = vm.currencyId;
                vm.searchData.showList = true;
                vm.pageInit();
            } else {
                vm.searchData.showList = false;
                vm.pageInitType();
            }

        },
        printV () {
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            let printList = $.extend(true, [], that.dataList);
            // let arr = ['accountingYear','duration','remark','debitSideFor','debitSide','directions','creditSide','balance','creditSideFor','balanceFor'];
            $.each(printList, function (idx, ele) {
                /*arr.map(function(row){
                    ele[row] = that.sortData(ele[row], row, 1, 1);
                })*/
                ele.accountingYear = that.sortData(ele.accountingYear, 'accountingYear', 1, 1);
                ele.duration = that.sortData(ele.duration, 'duration', 1, 1);
                ele.remark = that.sortData(ele.remark, 'remark', 1, 1);
                ele.debitSide = that.sortData(ele.debitSide, 'debitSide', 1, 1);
                ele.creditSide = that.sortData(ele.creditSide, 'creditSide', 1, 1);
                ele.directions = that.sortData(ele.directions, 'directions', 1, 1);
                ele.balance = that.sortData(ele.balance, 'balance', 1, 1);

                ele.debitSideFor = that.sortData(ele.debitSideFor, 'debitSideFor', 1, 1);
                ele.creditSideFor = that.sortData(ele.creditSideFor, 'creditSideFor', 1, 1);
                ele.balanceFor = that.sortData(ele.balanceFor, 'balanceFor', 1, 1);
            });

            if (that.currencyId == that.searchData.currencyId || that.searchData.currencyId == -2) {
                //单行表头
                var _info = {
                    'title': '总分类账',  // 标题
                    'template': 1,  // 模板
                    /* 'titleInfo': [       // title
                         { 'name': '科目', 'val': that.subjectName }
                     ],*/
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目编码', 'col': 'subjectCode' },
                        { 'name': '科目名称', 'col': 'subjectName' },
                        { 'name': '会计年度', 'col': 'accountingYear' },
                        { 'name': '期间', 'col': 'duration' },
                        { 'name': '摘要', 'col': 'remark' },
                        { 'name': '借方', 'col': 'debitSide' },
                        { 'name': '贷方', 'col': 'creditSide' },
                        { 'name': '方向', 'col': 'directions' },
                        { 'name': '余额', 'col': 'balance' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': printList,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            } else {
                //固定多表头
                // 多表头固定打印
                var _d = printList;
                console.log(_d)
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <!--<th rowspan="2" style="width: 6%">科目编码</th>-->
                        <th rowspan="2" style="width: 6%">科目名称</th>
                        <th rowspan="2" style="width: 6%">会计年度</th>
                        <th rowspan="2" style="width: 6%">期间</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th colspan="3" style="width: 18%">余额</th>
                    </tr>
                    <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">方向</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                    </tr>
                `;

                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <!--<td>${row.subjectCode}</td>-->
                            <td>${row.subjectName}</td>
                            <td>${row.accountingYear}</td>
                            <td>${row.duration}</td>
                            <td>${row.remark}</td>
                            
                            <td>${row.debitSideFor}</td>
                            <td>${row.debitSide}</td>
                            <td>${row.creditSideFor}</td>
                            <td>${row.creditSide}</td>
                            <td>${row.directions}</td>
                            <td>${row.balanceFor}</td>
                            <td>${row.balance}</td>
                            
                        </tr>
                    `;
                });

                let data = {
                    'title': '总分类账',  // 标题
                    'template': 12,  // 模板
                    /*'titleInfo': [       // title
                        { 'name': '科目', 'val': that.subjectName }
                    ],*/
                    'colMaxLenght': 12,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
            }
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney (value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        clickoutside (e) {
            console.log(e)
        },
        outExcel () {
            window.open(contextPath + '/financeBalance/exportExcel?subjectYearStart=' + vm.searchData.subjectYearStart +
                "&subjectYearEnd=" + vm.searchData.subjectYearEnd + "&subjectStart=" + vm.searchData.subjectStart
                + "&subjectEnd=" + vm.searchData.subjectEnd + "&subjectPeriodStart=" + vm.searchData.subjectPeriodStart
                + "&subjectPeriodEnd=" + vm.searchData.subjectPeriodEnd + "&noShow=" + vm.searchData.noShow
                + "&subjectLeaveStart=" + vm.searchData.subjectLeaveStart + "&subjectLeaveEnd=" + vm.searchData.subjectLeaveEnd
                + "&showForbiddenSubject=" + vm.searchData.showForbiddenSubject + "&noShowAndHappen=" + vm.searchData.noShowAndHappen
                + "&showSubjectDetail=" + vm.searchData.showSubjectDetail + "&currencyId=" + vm.searchData.currencyId + "&posted=" + vm.searchData.posted);
        },
        secede () {
            window.parent.closeCurrentTab({ name: '总账', exit: true, openTime: this.openTime });
        },
        detailed () {
            let rowId = $("#list").jqGrid('getGridParam', 'selrow');
            let rowData = $("#list").jqGrid('getRowData', rowId);
            let code = rowData.subjectCode;
            let url;
            if (code == null || code == 'undefined') {
                url = contextPath + '/finance/detail-account/detail-account.html';
            } else {
                url = contextPath + '/finance/detail-account/detail-account.html?subjectCode=' + code
                    +"&subjectYearStart="+vm.searchData.subjectYearStart
                    + "&subjectYearEnd=" + vm.searchData.subjectYearEnd
                    + "&subjectPeriodStart=" + vm.searchData.subjectPeriodStart
                    + "&subjectPeriodEnd=" + vm.searchData.subjectPeriodEnd
                    + "&subjectLeaveStart=" + vm.searchData.subjectLeaveStart
                    + "&subjectLeaveEnd=" + vm.searchData.subjectLeaveEnd
                    + "&currencyId=" + vm.searchData.currencyId
                    + "&posted=" + vm.searchData.posted;
            }

            console.log(url)
            window.parent.activeEvent({ name: '明细分类账', url: url, params: null });
        },
        refurbish () {
            let config = {
                postData: JSON.stringify(this.searchData)
            }
            $("#list").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        init () {
            let v = this;
            $.ajax({
                type: 'POST',
                data: null,
                url: contextPath + '/financeBalance/initLedge',
                dataType: 'json',
                success: function (ret) {
                    if (ret.code != '100100') {
                        v.$Modal.error({
                            title:'错误',
                            content:'页面初始化失败'
                        })
                        return;
                    }
                    let dataInfo = ret.data;
                    v.currencyId = dataInfo.standardCurrencyId;

                    v.years = dataInfo.financeYearPeriod.data;

                    $.each(v.years, function (idx, ele) {
                        if (ele.name == dataInfo.accountYear) {
                            //设置年度
                            v.searchData.subjectYearStart = ele.value;
                            v.searchData.subjectYearEnd = ele.value;
                        }
                    });

                    v.searchData.subjectPeriodStart = v.subjectList[dataInfo.accountPeriod - 1].value;
                    v.searchData.subjectPeriodEnd = v.subjectList[dataInfo.accountPeriod - 1].value;

                    v.currencyList = dataInfo.currencyList;

                    v.searchData.currencyId = v.currencyList[0].id;

                    //处理来自明细账页面跳转
                    let fromDetail = getUrlParam("fromDetail");
                    if (fromDetail != null && fromDetail == 1) {
                        v.searchData.subjectYearStart = getUrlParam("subjectYearStart");
                        v.searchData.subjectYearEnd = getUrlParam("subjectYearEnd");
                        v.searchData.subjectPeriodStart = getUrlParam("subjectPeriodStart");
                        v.searchData.subjectPeriodEnd = getUrlParam("subjectPeriodEnd");
                        v.searchData.subjectStart = getUrlParam("subjectStart");
                        v.searchData.subjectEnd = getUrlParam("subjectEnd");
                        v.searchData.currencyId = getUrlParam("currencyId");
                        v.searchData.posted = getUrlParam("posted");
                    }
                    v.pageInit();
                }
            });
        }
    },
    created: function () {
    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.init();
    },

})