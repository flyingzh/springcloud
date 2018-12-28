new Vue({
    el: '#long-time-not-reaching',
    data() {
        return {
            openTime: '',
            periodYear: [],
            periodList: [],
            subjectList: [],
            currencyList: [],
            organisationList: [],
            formData:{
                subjectId:0,
                currencyId:0,
                currentYear:'',
                currentMonth:'',
                radioId: 1,
                fullSubjectName:'',
                currencyName:'',
                bankName:'',
                bankAccount:'',
                reportName:'',
                dateStr:''
            },
            queryData:{
                year:'',
                month:'',
                subjectId:'',
                currencyId:'',
                dateStr:'',
                typeId:1
            },
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                datatype: 'json',
                styleUI: 'Bootstrap',
                url:contextPath + '/app/longTimeNotReaching/list',
                jsonReader: {
                    root: "data"
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999999999
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            baseData: {
                standardCurrencyId: 1,
            },
            printModal: false,
            printInfo: {},
            dataList:[]
        }
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.initFormData();
        this.currency();
        this.initMethod();
    },
    methods:{
        initFormData(){ //填充查询条件
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath+'/app/bankAccount/initData',
                data:{isCash:1},
                success: function (result) {
                    console.log(result,"长期未达账");
                    var data = result.data;
                    if (data!=null) {
                        that.periodYear = data.systemProfile.yearList;
                        that.periodList = data.systemProfile.monthList;
                        that.formData.currentYear = data.systemProfile.currentYear;
                        that.formData.currentMonth = data.systemProfile.currentMonth;
                        that.subjectList= data.subject.data;
                        if(that.subjectList.length>0){
                            that.formData.subjectId = that.subjectList[0].accountId;
                        }
                    }
                }
            });
        },
        currency(){ //币种
            let that = this;
            $.ajax({
                type: 'post',
                async:false,
                url: contextPath+'/cashierBalanceController/app/initCnCurrency',
                data: {isCash:1},
                success: function(result){
                    console.log(result,'币别');
                    var data =result.data;
                    that.currencyList = data;
                    if(data.length>0){
                       that.formData.currencyId =data[0].currencyId;
                    }
                }
            });
        },
        titleParams(){
            //科目
            var obj = this.subjectList;
            if(obj!=null){
                for (var i = 0;i<obj.length;i++){
                    var val = obj[i];
                    if(val.accountId==this.queryData.subjectId){
                        this.formData.bankName =val.bankName;
                        this.formData.bankAccount = val.bankAccount;
                        this.formData.fullSubjectName = val.accountCode+' '+val.accountName;
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
            //报表类型
            var typeId = this.queryData.typeId;
            if(typeId==1){
                this.formData.reportName = '银行未达账';
            }
            if(typeId==2){
                this.formData.reportName = '企业未达账';
            }
        },
        //刷新
        refresh() {
            $("#grid").jqGrid('setGridParam',{postData:this.queryData}).trigger("reloadGrid");
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
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
                }
            });
            jQuery("#grid").jqGrid(config);
        },
        setTableHeader () {
            if(this.formData.radioId==1){
                if (this.baseData.standardCurrencyId === this.formData.currencyId) {
                    this.colNames = ['id','项目', '日期', '凭证字号', '对方科目', '借方金额', '贷方金额','制单人', '数据来源','备注'],
                    this.colModel=[
                        { name: 'id', width: 40, hidden:true},
                        { name: 'summary', width: 150},
                        { name: 'voucherDate', width: 80 },
                        { name: 'voucherName', width: 100},
                        { name: 'relativeSubjectName', width: 150},
                        { name: 'debitAmount', width: 100, align:"right"},
                        { name: 'creditAmount', width: 100, align:"right" },
                        { name: 'createName', width: 80},
                        { name: 'dataSourceName', width: 80},
                        { name: 'reamk', width: 100}
                    ];
                    this.tableHeaders = [];
                } else {
                        this.colNames = ['id','项目', '日期', '凭证字号', '对方科目', '原币', '本位币','原币', '本位币','制单人', '数据来源','备注'],
                        this.colModel=[
                            { name: 'id', width: 40, hidden:true},
                            { name: 'summary', width: 150},
                            { name: 'voucherDate', width: 80 },
                            { name: 'voucherName', width: 100},
                            { name: 'relativeSubjectName', width: 150},
                            { name: 'debitAmountFor', width: 100, align:"right"},
                            { name: 'debitAmount', width: 100, align:"right"},
                            { name: 'creditAmountFor', width: 100, align:"right" },
                            { name: 'creditAmount', width: 100, align:"right" },
                            { name: 'createName', width: 80},
                            { name: 'dataSourceName', width: 80},
                            { name: 'reamk', width: 100}
                      ];
                    this.tableHeaders = [
                        { startColumnName: 'debitAmountFor', numberOfColumns: 2, titleText: '借方金额' },
                        { startColumnName: 'creditAmountFor', numberOfColumns: 2, titleText: '贷方金额' },
                    ];
                }
            }else{
                if (this.baseData.standardCurrencyId === this.formData.currencyId) {
                    this.colNames = ['id','项目', '日期', '借方金额', '贷方金额','制单人', '数据来源','备注'],
                        this.colModel=[
                            { name: 'id', width: 40, hidden:true},
                            { name: 'summary', width: 150},
                            { name: 'voucherDate', width: 80 },
                            { name: 'debitAmount', width: 100, align:"right"},
                            { name: 'creditAmount', width: 100, align:"right" },
                            { name: 'createName', width: 80},
                            { name: 'dataSourceName', width: 80},
                            { name: 'reamk', width: 100}
                        ];
                    this.tableHeaders = [];
                } else {
                    this.colNames = ['id','项目', '日期', '原币', '本位币','原币', '本位币','制单人', '数据来源','备注'],
                        this.colModel=[
                            { name: 'id', width: 40, hidden:true},
                            { name: 'summary', width: 150},
                            { name: 'voucherDate', width: 80 },
                            { name: 'debitAmountFor', width: 100, align:"right"},
                            { name: 'debitAmount', width: 100, align:"right"},
                            { name: 'creditAmountFor', width: 100, align:"right" },
                            { name: 'creditAmount', width: 100, align:"right" },
                            { name: 'createName', width: 80},
                            { name: 'dataSourceName', width: 80},
                            { name: 'reamk', width: 100}
                        ];
                    this.tableHeaders = [
                        { startColumnName: 'debitAmountFor', numberOfColumns: 2, titleText: '借方金额' },
                        { startColumnName: 'creditAmountFor', numberOfColumns: 2, titleText: '贷方金额' },
                    ];
                }
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        save() {
            this.cancel();
            this.queryData.subjectId = this.formData.subjectId;
            this.queryData.currencyId = this.formData.currencyId;
            this.queryData.year = this.formData.currentYear;
            this.queryData.month = this.formData.currentMonth;
            this.queryData.dateStr =  this.queryData.year+'-'+this.queryData.month;
            this.queryData.typeId = this.formData.radioId;
            this.base_config.postData = this.queryData;
            this.initMethod();
            this.titleParams();
        },
        exportExcel(){ //引出
            var titles ='银行：'+this.formData.bankName+'  账号：'+this.formData.bankAccount+'   报表：'+this.formData.reportName+'   科目：'+this.formData.fullSubjectName+'   币别：'+this.formData.currencyName+'   期间：'+this.formData.dateStr;
            window.open(rcContextPath+'/app/longTimeNotReaching/exportExcel?typeId='+this.queryData.typeId+'&currencyId='+this.queryData.currencyId+'&titles='+titles);
        },
        companyPrint(){
            let that = this;
            if(that.formData.currencyId == that.baseData.standardCurrencyId){
                //单行表头
                var _info = {
                    'title': '长期未达账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '银行', 'val': that.formData.bankName },
                        { 'name': '账号', 'val': that.formData.bankAccount },
                        { 'name': '报表', 'val': that.formData.reportName },
                        { 'name': '科目', 'val': that.formData.fullSubjectName },
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '项目', 'col': 'summary' },
                        { 'name': '日期', 'col': 'voucherDate' },
                        { 'name': '借方金额', 'col': 'debitAmount' },
                        { 'name': '贷方金额', 'col': 'creditAmount'},
                        { 'name': '制单人', 'col': 'createName'},
                        { 'name': '数据来源', 'col': 'dataSourceName'},
                        { 'name': '备注', 'col': 'reamk'}
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 7,  // 显示最大长度， 默认为7
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
                        <th rowspan="2" style="width: 6%">项目</th>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th rowspan="2" style="width: 6%">制单人</th>
                        <th rowspan="2" style="width: 6%">数据来源</th>
                        <th rowspan="2" style="width: 6%">备注</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th> 
                    </tr>
                `;
                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that.nullValue(row.summary)}</td>
                            <td>${that.nullValue(row.voucherDate)}</td>
                            <td>${that.nullValue(row.debitAmountFor)}</td>
                            <td>${that.nullValue(row.debitAmount)}</td>
                            <td>${that.nullValue(row.creditAmountFor)}</td>
                            <td>${that.nullValue(row.creditAmount)}</td>
                            <td>${that.nullValue(row.createName)}</td>
                            <td>${that.nullValue(row.dataSourceName)}</td>
                            <td>${that.nullValue(row.reamk)}</td>
                        </tr>
                    `;
            });
                let data = {
                    title: "长期未达账",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '银行', 'val': that.formData.bankName },
                        { 'name': '账号', 'val': that.formData.bankAccount },
                        { 'name': '报表', 'val': that.formData.reportName },
                        { 'name': '科目', 'val': that.formData.fullSubjectName },
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colMaxLenght': 10,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
            }
        },
        bankPrint(){
            let that = this;
            if(that.formData.currencyId == that.baseData.standardCurrencyId){
                //单行表头
                var _info = {
                    'title': '长期未达账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '银行', 'val': that.formData.bankName },
                        { 'name': '账号', 'val': that.formData.bankAccount },
                        { 'name': '报表', 'val': that.formData.reportName },
                        { 'name': '科目', 'val': that.formData.fullSubjectName },
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '项目', 'col': 'summary' },
                        { 'name': '日期', 'col': 'voucherDate' },
                        { 'name': '凭证字号', 'col': 'voucherName' },
                        { 'name': '对方科目', 'col': 'relativeSubjectName' },
                        { 'name': '借方金额', 'col': 'debitAmount' },
                        { 'name': '贷方金额', 'col': 'creditAmount'},
                        { 'name': '制单人', 'col': 'createName'},
                        { 'name': '数据来源', 'col': 'dataSourceName'},
                        { 'name': '备注', 'col': 'reamk'}
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
                console.log(_d);
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">项目</th>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">凭证字号</th>
                        <th rowspan="2" style="width: 6%">对方科目</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th rowspan="2" style="width: 6%">制单人</th>
                        <th rowspan="2" style="width: 6%">数据来源</th>
                        <th rowspan="2" style="width: 6%">备注</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th> 
                    </tr>
                `;
                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that.nullValue(row.summary)}</td>
                            <td>${that.nullValue(row.voucherDate)}</td>
                            <td>${that.nullValue(row.voucherName)}</td>
                            <td>${that.nullValue(row.relativeSubjectName)}</td>
                            <td>${that.nullValue(row.debitAmountFor)}</td>
                            <td>${that.nullValue(row.debitAmount)}</td>
                            <td>${that.nullValue(row.creditAmountFor)}</td>
                            <td>${that.nullValue(row.creditAmount)}</td>
                            <td>${that.nullValue(row.createName)}</td>
                            <td>${that.nullValue(row.dataSourceName)}</td>
                            <td>${that.nullValue(row.reamk)}</td>
                        </tr>
                    `;
            });
                let data = {
                    title: "长期未达账",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '银行', 'val': that.formData.bankName },
                        { 'name': '账号', 'val': that.formData.bankAccount },
                        { 'name': '报表', 'val': that.formData.reportName },
                        { 'name': '科目', 'val': that.formData.fullSubjectName },
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
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
        print(){ //打印
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            if(that.formData.radioId==1){
                that.bankPrint();
            }else {
                that.companyPrint();
            }
        },
        nullValue(exp){  //设置空
            if (exp==null || typeof(exp)=="undefined" || exp==0) {
                return '';
            }
            return exp;
        },
        open() {
            this.filterVisible = true;
        },
        cancel() {
            this.filterVisible = false;
        },
        outHtml () {
            window.parent.closeCurrentTab({ name:'长期未达账', openTime: this.openTime, exit: true })
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
    },
})