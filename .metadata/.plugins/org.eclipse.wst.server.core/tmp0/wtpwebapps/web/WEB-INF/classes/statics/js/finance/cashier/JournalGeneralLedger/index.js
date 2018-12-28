new Vue({
    el: '#journalGeneralLedger',
    data () {
        return {
            openTime: '',
            yearList:[],
            monthList:[],
            subjectList:[],
            currencyList:[],
            disabled:false,
            queryData:{
                year:'',
                month:'',
                subjectId:'',
                currencyId:'',
                dateStr:''
            },
            formData: {
                msg:'总账只取已过账的凭证数据',
                fullSubjectName: '',
                currencyName: '',
                dateStr: '',
                subjectId:0,
                currencyId:0,
                period: "1",
                currentYear:'',
                currentMonth:''
            },
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath+'/app/journalGeneralLedger/list',
               // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                jsonReader: {
                    root: "data",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999999999
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            tableSelectId: '',
            baseData: {
                standardCurrencyId: 1,
            },
            printModal: false,
            printInfo: {},
            dataList:[]
        }
    },
    created: function(){
        var _vm = this;
        _vm.initData();
    },
    mounted () {
        this.initMethod();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        initData(){  //初始化过滤条件
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath+'/app/bankAccount/initData',
                data:{isCash:null},
                success: function (result) {
                    var data = result.data;
                    if (data!= null) {
                        console.log(data);
                        that.yearList = data.systemProfile.yearList;
                        that.monthList = data.systemProfile.monthList;
                        that.formData.currentYear = data.systemProfile.currentYear;
                        that.formData.currentMonth = data.systemProfile.currentMonth;
                        that.subjectList= data.subject.data;
                    }
                }
            });
            that.subjectList.splice(0,0,{"accountId":0, "accountName": "(所有科目)"});
            that.currency(that.formData.subjectId); //币种
        },
        currency(subjectId){ //币种
            let that = this;
            that.currencyList = [];
            if(subjectId==0){
                that.currencyList.splice(0,0,{"currencyId":0, "currencyName": "(所有币别)"});
                that.formData.currencyId = 0;
                that.disabled = true;
                return;
            }
            $.ajax({
                type: 'post',
                async:false,
                url: contextPath+'/cashierBalanceController/app/initCnCurrency',
                data: {accountId:subjectId},
                success: function(result){
                    var data =result.data;
                    if(data!=null){
                        that.currencyList=data;
                    }
                }
            });
            if(that.currencyList.length>1){
                that.currencyList.splice(0,0,{"currencyId":0, "currencyName": "(所有币别)"});
                that.formData.currencyId = 0;
                that.disabled = false;
            }
            if(that.currencyList.length==1){
                that.formData.currencyId = that.currencyList[0].currencyId;
                that.disabled = false;
            }
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            if (this.baseData.standardCurrencyId === this.queryData.currencyId) {
                this.colNames = ['id','subjectId','currencyId', '序号', '科目代码及名称', '币别', '项目', '期初余额', '本期借方', '本期贷方','期末余额'];
                this.colModel = [
                    { name: 'id', width: 10, hidden: true},
                    { name: 'subjectId', width: 10, hidden: true},
                    { name: 'currencyId', width: 10, hidden: true},
                    { name: 'rowNum', width: 50 },
                    { name: 'fullSubjectName', width: 160 },
                    { name: 'currencyName', width: 100 },
                    { name: 'projectName', width: 120},
                    {
                        name: 'initBalance', width: 160, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'thisDebitAmount', width: 160, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'thisCreditAmount', width: 160, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'endBalance', width: 160, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    }
                ];
                this.tableHeaders = [];
            } else {
                this.colNames = ['id','subjectId','currencyId', '序号', '科目代码及名称', '币别', '项目','原币', '本位币', '原币', '本位币', '原币', '本位币','原币', '本位币' ];
                this.colModel = [
                    { name: 'id', width: 5, hidden: true },
                    { name: 'subjectId', width: 10, hidden: true},
                    { name: 'currencyId', width: 10, hidden: true},
                    { name: 'rowNum', width: 40 },
                    { name: 'fullSubjectName', width: 130 },
                    { name: 'currencyName', width: 60 },
                    { name: 'projectName', width: 60},
                    {
                        name: 'initBalanceFor', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'initBalance', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'thisDebitAmountFor', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'thisDebitAmount', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'thisCreditAmountFor', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'thisCreditAmount', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'endBalanceFor', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'endBalance', width: 100, formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    }
                ];
                this.tableHeaders = [
                    { startColumnName: 'initBalanceFor', numberOfColumns: 2, titleText: '期初余额' },
                    { startColumnName: 'thisDebitAmountFor', numberOfColumns: 2, titleText: '本期借方' },
                    { startColumnName: 'thisCreditAmountFor', numberOfColumns: 2, titleText: '本期贷方' },
                    { startColumnName: 'endBalanceFor', numberOfColumns: 2, titleText: '期末余额' }
                ];
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
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
                loadComplete: function (ret) {
                   // _vm.lodoPList = ret.data || [];
                    _vm.dataList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                    //获取表格所有行数据
                    // let rows = jQuery("#grid").jqGrid('getRowData');
                    // var allCountID = $("#grid").jqGrid('getDataIDs');
                    // rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    // _vm.tableList = rows;
                    // console.log('tableList', _vm.tableList)
                },
                gridComplete: function () {
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]))
                    for(var i =0;i<rows.length;i++){
                        if( rows[i].projectName=='差额'){
                            $('#'+rows[i].id).find("td").addClass("differenceClass");
                        }
                    }
                },
                onSelectRow: function (data, status) { // 当选择行时触发此事件
                    _vm.tableSelectId = data;
                },
                ondblClickRow: function (rowid, iRow, iCol, e) { // 当选择行时触发此事件
                    console.log("data---------", rowid);
                    _vm.details(rowid);
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () {
            // $("#grid").jqGrid('clearGridData');  //清空表格
            this.tableSelectId = '';
            $("#grid").jqGrid('setGridParam',{postData:this.queryData}).trigger("reloadGrid");
        },
        titleParams(){
            //科目
            var obj = this.subjectList;
            if(obj!=null){
                for (var i = 0;i<obj.length;i++){
                   if(obj[i].accountId==this.queryData.subjectId){
                        if(typeof(obj[i].accountCode) == "undefined"){
                            this.formData.fullSubjectName = obj[i].accountName;
                            break;
                        }
                        this.formData.fullSubjectName = obj[i].accountCode+' '+obj[i].accountName;
                        break;
                   }
                }
            }
            //币别
            var currency = this.currencyList;
            if(currency!=null){
                for (var i = 0;i<currency.length;i++){
                    if(currency[i].currencyId==this.queryData.currencyId){
                        this.formData.currencyName = currency[i].currencyName;
                        break;
                    }
                }
            }
            //期间
            this.formData.dateStr = this.queryData.year+'年第'+this.queryData.month+'期';
        },
        save () {
            let _this = this;
            _this.filterVisible = false;
            _this.tableSelectId = '';
            _this.queryData.subjectId = _this.formData.subjectId;
            _this.queryData.currencyId = _this.formData.currencyId;
            _this.queryData.year = _this.formData.currentYear;
            _this.queryData.month = _this.formData.currentMonth;
            _this.queryData.dateStr =  _this.queryData.year+'-'+_this.queryData.month;
            _this.titleParams();
            _this.base_config.url = contextPath+'/app/journalGeneralLedger/list';
            _this.base_config.postData = _this.queryData;
            _this.initMethod();
        },
        nullValue(exp){  //设置空
            if (exp==null || typeof(exp)=="undefined" || exp==0) {
                  return '';
            }
            return exp;
        },
        exportExcel(){  //导出
             var str = '科目:'+this.formData.fullSubjectName+'  币别:'+this.formData.currencyName+'  期间:'+this.formData.dateStr;
             window.open(contextPath+'/app/journalGeneralLedger/exportExcel?type='+this.queryData.currencyId+'&msg='+this.formData.msg+'&titles='+str);
        },
        print(){ //打印
            let that = this;
            console.log(that.dataList, '=========that.lodoPList');
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            if(that.queryData.currencyId == that.baseData.standardCurrencyId){
                //单行表头
                var _info = {
                    'title': '日记账与总账对账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '期间', 'val': that.formData.dateStr },
                        { 'name': '科目', 'val': that.formData.fullSubjectName },
                        { 'name': '币别', 'val': that.formData.currencyName }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '序号', 'col': 'rowNum' },
                        { 'name': '科目代码及名称', 'col': 'fullSubjectName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '项目', 'col': 'projectName' },
                        { 'name': '期初余额', 'col': 'initBalance' },
                        { 'name': '本期借方', 'col': 'thisDebitAmount' },
                        { 'name': '本期贷方', 'col': 'thisCreditAmount'},
                        { 'name': '期末余额', 'col': 'endBalance'}
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                    'totalRow':false
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            }else{
                //固定多表头
                // 多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';

                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">序号</th>
                        <th rowspan="2" style="width: 6%">科目代码及名称</th>
                        <th rowspan="2" style="width: 6%">币别</th>
                        <th rowspan="2" style="width: 6%">项目</th>
                        <th colspan="2" style="width: 12%">期初金额</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th colspan="2" style="width: 12%">期末金额</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                    </tr>
                `;

                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that.nullValue(row.rowNum)}</td>
                            <td>${that.nullValue(row.fullSubjectName)}</td>
                            <td>${that.nullValue(row.currencyName)}</td>
                            <td>${that.nullValue(row.projectName)}</td>
                            <td>${that.nullValue(row.initBalanceFor)}</td>
                            <td>${that.nullValue(row.initBalance)}</td>
                            <td>${that.nullValue(row.thisDebitAmountFor)}</td>
                            <td>${that.nullValue(row.thisDebitAmount)}</td>
                            <td>${that.nullValue(row.thisCreditAmountFor)}</td>
                            <td>${that.nullValue(row.thisCreditAmount)}</td>
                            <td>${that.nullValue(row.endBalanceFor)}</td>
                            <td>${that.nullValue(row.endBalance)}</td>
                        </tr>
                    `;
            });

                let data = {
                    title: "日记账与总账对账",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '期间', 'val': that.formData.dateStr },
                        { 'name': '科目', 'val': that.formData.fullSubjectName },
                        { 'name': '币别', 'val': that.formData.currencyName }
                    ],
                    'colMaxLenght': 16,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
            }
        },
        cancel () {
            this.filterVisible = false;
        },
        details(id){
            if(id==''){
                this.$Message.info('请选中一行数据！');
                return;
            }
            let _vm = this;
            var obj =  jQuery("#grid").jqGrid('getRowData',id);
            var subjectId = obj.subjectId;
            var currencyId = obj.currencyId;
            var year = _vm.queryData.year;
            var month = _vm.queryData.month;
            _vm.goRGL(subjectId,currencyId,year,month);
        },
        goRGL (subjectId,currencyId,year,month) {
            var _url = baseURLPage + 'cashier/ReconciliationGeneralLedger/index.html?subjectId='+subjectId+'&currencyId='+currencyId+'&year='+year+'&month='+month;
            window.parent.activeEvent({ 'name': '与总账对账', 'url': _url });
        },
        outHtml () {
            window.parent.closeCurrentTab({ name: '日记账与总账对账', openTime: this.openTime, exit: true })
        },
        printModalShow (_t) {
            this.printModal = _t;
        },

    },
    computed: {
        // currencyName () {
        //     let find = this.currencyList.find(row => {
        //         return row.value === this.formData.currencyId;
        //     })
        //     if (!find) return;
        //     return find.label;
        // }
    }
})