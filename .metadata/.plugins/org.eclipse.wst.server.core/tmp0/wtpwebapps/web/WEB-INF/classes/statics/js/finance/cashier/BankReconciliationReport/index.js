new Vue({
    el: '#bank-reconciliation-report',//余额调节表
    data() {
        return {
            baseData:{
                subjectName: '',
                bankAccountNumber: '',
                currencyName: '',
                periodDate: '',
            },
            openData:{
                subjectId: '',
                currencyId: '',
                accountYear:'',
                accountPeriod:'',
            },
            filterVisible: false,
            subjectList: [],
            currencyList: [],
            periodYear: [],
            periodList: [],
            colNames: [],
            colModel: [],
            printInfo:{},
            printModal:false,
            openTime:"",//用于控制退出按钮
            dataList: [],//用于封装每次查询的结果集
            tableHeaders:[]
            /*organisationList: [{label: "金大祥", value: 1},]*/
        }
    },
    mounted() {
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        //初始化页面
        initPage () {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/bankReconciliationReportAppController/initPage',
                dataType: 'json',
                data: null,
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '初始化页面数据失败!';
                        if(result.msg){
                            _msg = result.msg;
                        }
                        _vm.$Message.error({
                            content: _msg,
                            duration: 3,
                            closable: true});
                        return;
                    }

                    let dataInfo = result.data;
                    _vm.currencyList = dataInfo.currencyList;
                    _vm.periodYear = dataInfo.periodYear;
                    _vm.periodList = dataInfo.monthList;
                    _vm.subjectList = dataInfo.subjectList;
                    _vm.openData.accountPeriod = dataInfo.cnCurrentAccountPeriod;
                    //因为前者是string类型,后者是int类型,直接赋值的话会显示不出来
                    $.each(dataInfo.periodYear, function (idx, ele) {
                        if(ele.name == dataInfo.cnCurrentAccountYear ){
                            _vm.openData.accountYear = ele.value;
                        }
                    });
                    //请注意,期间list是用name绑定的,而不是value
                    $.each(dataInfo.monthList, function (idx, ele) {
                        if(ele.name == dataInfo.cnCurrentAccountPeriod ){
                            _vm.openData.accountPeriod = ele.name;
                        }
                    });
                    _vm.baseData.periodDate = _vm.openData.accountYear +'年'+ _vm.openData.accountPeriod+'期';

                    if (!$.isEmptyObject(dataInfo.subjectList) && dataInfo.subjectList.length != 0) {
                        _vm.openData.subjectId = dataInfo.subjectList[0].accountId;
                        $.each(dataInfo.subjectList,function (idx, ele) {
                            if( _vm.openData.subjectId == ele.accountId){
                                _vm.baseData.subjectName = dataInfo.subjectList[0].accountName;
                                _vm.baseData.bankAccountNumber = dataInfo.subjectList[0].bankAccount;
                            }
                        })
                    }
                    if (!$.isEmptyObject(dataInfo.currencyList) && dataInfo.currencyList.length != 0) {
                        _vm.openData.currencyId = dataInfo.currencyList[0].currencyId;
                        $.each(_vm.currencyList, function (idx, ele) {
                            if ( _vm.openData.currencyId == ele.currencyId) {
                                _vm.baseData.currencyName = ele.currencyName;
                            }
                        });
                    }
                    //初始化值全部赋值完毕,执行一次查询
                    _vm.initMathod();
                }
            });
        },
        initMathod () {
            //带参数查询
            let that = this;
            var _url = '';
            jQuery("#grid").jqGrid(
                {
                    url: contextPath + '/bankReconciliationReportAppController/reportDetail',
                    postData: JSON.stringify(that.openData),
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: ['id','项目', '日期','金额', '制单人', '数据来源', '备注','项目', '日期','凭证字号', '对方科目','金额', '制单人', '数据来源', '备注'],
                    colModel: [
                        //align: "center"
                        { name: 'id', width: 40, hidden:true, },
                        { name: 'projectL', width: 170,},
                        { name: 'dateStrL', width: 80,  },
                        { name: 'amountL', width: 80, formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }},
                        { name: 'createNameL', width: 100,},
                        { name: 'dataSourceL', width: 120},
                        { name: 'remarkL', width: 100, },
                        { name: 'projectR', width: 170},
                        { name: 'dateStrR', width: 80 },
                        { name: 'voucherGroupDataR', width: 80,},
                        { name: 'tbasSubjectNameR', width: 100},
                        { name: 'amountR', width: 80, formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }},
                        { name: 'createNameR', width: 100},
                        { name: 'dataSourceR', width: 120,},
                        { name: 'remarkR', width: 100},
                    ],
                    rowNum: 999999999,//一页显示多少条
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                        total: "data.totalPage",
                        records: "data.totalCount",
                        cell: "list",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 190,
                    loadComplete: function (ret) {

                        if (ret.code != '100100') {
                            layer.alert(ret.msg);
                            return;
                        }
                        that.dataList = ret.data;

                        jQuery("#grid").jqGrid('destroyGroupHeader');
                        jQuery("#grid").jqGrid('setGroupHeaders', {
                            useColSpanStyle: true,
                            groupHeaders: [
                                { startColumnName: 'projectL', numberOfColumns: 6, titleText: '企业未达账'},
                                { startColumnName: 'projectR', numberOfColumns: 8, titleText: '银行未达账'}
                            ]
                        });
                    },
                })
        },
        subjectChange(item){
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath+'/cnbankdepositjournalappcontroller/subjectChange',
                data: {'subjectId':item},
                success: function(result){
                    if(result.code == '100100'&&result.data!=null){
                        _vm.currencyList = result.data;
                        _vm.openData.currencyId = _vm.currencyList[0].currencyId;
                    }else{
                        _vm.$Message.error({
                            content: '切换银行科目异常!',
                            duration: 3,
                            closable: true});
                    }
                }
            });
        },
        open() {
            this.filterVisible = true;
        },
        refresh() {
            this.save();
        },
        save() {
            //点击打开---确定 按钮
            let _vm = this;
            //展示银行名称,账号
            $.each(_vm.subjectList,function (idx, ele) {
                if( _vm.openData.subjectId == ele.accountId){
                    _vm.baseData.subjectName = ele.accountName;
                    _vm.baseData.bankAccountNumber = ele.bankAccount;
                }
            });
            //展示币别名称
            $.each(_vm.currencyList, function (idx, ele) {
                if ( _vm.openData.currencyId == ele.currencyId) {
                    _vm.baseData.currencyName = ele.currencyName;
                }
            });
            //展示查询期数
            _vm.baseData.periodDate = _vm.openData.accountYear +'年'+ _vm.openData.accountPeriod+'期';

            $("#grid").jqGrid('setGridParam',{postData:JSON.stringify(_vm.openData),}).trigger("reloadGrid");
            this.filterVisible = false;
        },
        cancel() {
            this.filterVisible = false;
        },
        exportExcel(){
            //导出到excel
            let data = this.openData;
            let bData = this.baseData;
            let _url = contextPath+"/bankReconciliationReportAppController/exportExcel?subjectId="+data.subjectId+
                "&currencyId="+data.currencyId+"&accountYear="+data.accountYear+"&accountPeriod="+data.accountPeriod+"&subjectName="+bData.subjectName+"&currencyName="+bData.currencyName+"&bankAccountNumber="+bData.bankAccountNumber+"&periodDate="+bData.periodDate;
            console.log(_url);
            window.open(_url);
        },
        printV(){
            //打印,支持用户自定义表头
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.error({
                    content: '无打印数据!',
                    duration: 3
                });
                return;
            }
            console.log("点击打印,查看that.dataList: ");
            console.log(that.dataList);

            //需要按多表头处理
            var _d = that.dataList;
            var _thead = '', _tbody = '', _tfoot = '';

            _thead = `
                    <tr class='thCs'>
                        <th colspan="6">企业未达账</th>
                        <th colspan="8">银行未达账</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 12%">项目</th>
                        <th style="width: 12%">日期</th>
                        <th style="width: 12%">金额</th>
                        <th style="width: 12%">制单人</th>
                        <th style="width: 12%">数据来源</th>
                        <th style="width: 12%">备注</th>
                        <th style="width: 12%">项目</th>
                        <th style="width: 12%">日期</th>
                        <th style="width: 12%">凭证字号</th>
                        <th style="width: 12%">对方科目</th>
                        <th style="width: 12%">金额</th>
                        <th style="width: 12%">制单人</th>
                        <th style="width: 12%">数据来源</th>
                        <th style="width: 12%">备注</th>
                    </tr>
                `;

            _d.forEach(row => {
                _tbody += `
                        <tr>
                            <td>${that._nullData(row.projectL)}</td>
                            <td>${that._nullData(row.dateStrL)}</td>
                            <td>${that.formartMoney(row.amountL)}</td>
                            <td>${that._nullData(row.createNameL)}</td>
                            <td>${that._nullData(row.dataSourceL)}</td>
                            <td>${that._nullData(row.remarkL)}</td>
                            
                            <td>${that._nullData(row.projectR)}</td>
                            <td>${that._nullData(row.dateStrR)}</td>
                            <td>${that._nullData(row.voucherGroupDataR)}</td>
                            <td>${that._nullData(row.tbasSubjectNameR)}</td>
                            <td>${that.formartMoney(row.amountR)}</td>
                            <td>${that._nullData(row.createNameR)}</td>
                            <td>${that._nullData(row.dataSourceR)}</td>
                            <td>${that._nullData(row.remarkR)}</td>
                        </tr>
                    `;
            });

            let data = {
                title: "余额调节表",
                template: 12,
                'titleInfo': [       // title
                    {'name': '公司名称', 'val': layui.data('user').currentOrgName},
                    {'name': '银行', 'val': that.baseData.subjectName},
                    {'name': '账号', 'val': that.baseData.bankAccountNumber},
                    {'name': '币别', 'val': that.baseData.currencyName},
                    {'name': '期间', 'val': that.baseData.periodDate},
                ],
                'data': [],
                'colMaxLenght': 14,
                'setPageSize':2,
                'tbodyInfo': {
                    'theadTX': _thead,
                    'tbodyTX': _tbody,
                    'tfootTX': _tfoot
                },
            };
            htPrint(data);
        },

        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },

        formartMoney(value) {
            //格式化金额
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },

        printModalShow(_t) {
            this.printModal = _t;
        },
        closeWindow(){
            //退出,关闭当前页签
            var name = '余额调节表';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
    },
});