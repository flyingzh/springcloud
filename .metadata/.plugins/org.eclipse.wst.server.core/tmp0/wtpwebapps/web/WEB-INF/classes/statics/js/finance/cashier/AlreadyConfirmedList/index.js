var ve = new Vue({
    el: '#alreadyConfirmedList',
    data () {
        let This = this;
        return {
            subjectList: [],    //科目列表
            currencyList: [],   //币别列表

            bdt: '',        //格式化后的开始年月日字符串
            edt: '',        //格式化后的结束年月日字符串
            /**
             * 保存表格上面显示的信息
             */
            bank: '',
            bankAccount: '',
            subName: '',
            curName: '',

            filter: {
                subjectId: '',
                currencyId: '',
                accountYear: '',
                accountPeriod: '',
                beginDatetime: (new Date()).format("yyyy-MM-dd"),
                endDatetime: (new Date()).format("yyyy-MM-dd"),
                containTicked: '',
                qr: "1",
                sobId: 1,
            },
            years: [2013,2014,2015,2016,2017,2018,2019],
            months: [1,2,3,4,5,6,7,8,9,10,11,12],
            openTime: '',
            filterVisible: false,
            asModal: false, //对账设置 弹窗
            arcGroup: {
                date: false,
                abstract: false,
                settlement: false,
                settlementNumber: false,
                accountRestriction: false,
            },
            findRecord: '',
            manualGroup: {
                date: false,
                abstract: false,
                settlement: false,
                settlementNumber: false,
                amount: false,
                accountRestriction: false,
            },

            formData: {
                'f1': '',
                'f2': '',
                'f3': '',
                'subjectName': '', 'subjectCode': '', 'subjectId': '',
            },
            openData: {
                sobId: "",
                subjectId: "",
                subjectCode: "",
                subjectName: "",
                currencyId: "",
                startYear: "",
                endYear: "",
                startPeriod: "",
                endPeriod: "",
                startDate: "",
                endDate: "",
                voucherGroupId: "",
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                explains: "",
                relateSubjectId: "",
                handleId: "",
                prepareId: "",
                showInitBalance: "",
                period: "1",
            },
            lodoPList: [],
            organisationList: [],
            remarkVisable: false, // 摘要弹窗
            // 摘要列表
            remarklist: [],

            printModal: false,
            printInfo: {}

        }
    },
    methods: {
        // 文摘弹窗
        clickDigest () {
            this.remarkVisable = true;
        },
        onDblclickRemarkRow (remark) {
            let that = this;
            that.openData.explains = remark.content;
            //	vm.row.abstract = remark.content;
            // vm.row.explains = remark.content;
            // vm.row.explainsLabel = remark.content;
            // vm.row.explainsValue = remark.id || '';
            that.remarkVisable = false;
        },
        onRemarkModalChange (val) {
            this.remarkVisable = val;
        },
        onRemarkListChange (val) {
            this.remarklist = val;
        },

        goBankAccountReconciliation () {
            // var _url = baseURLPage + 'cashier/BankAccountReconciliation/index.html';
            var _url = contextPath + '/finance/cashier/BankAccountReconciliation/index.html?subjectId='+
                this.filter.subjectId+'&currencyId='+this.filter.currencyId+'&accountYear='+
                this.filter.accountYear+'&accountPeriod='+this.filter.accountPeriod+'&beginDatetime='+
                this.bdt+'&endDatetime='+this.edt+'&containTicked='+this.filter.containTicked+'&qr='+
                this.filter.qr+'&sobId='+this.filter.sobId;
            // window.parent.closeCurrentTab({ name: "银行存款对账", openTime: this.openTime, exit: true });
            window.parent.activeEvent({ 'name': '银行存款对账', 'url': _url });
        },
        saveData () { },
        canceldata () { },
        save(){
            var that = this;
            this.bdt= (new Date(this.filter.beginDatetime)).format("yyyy-MM-dd");
            this.edt = (new Date(this.filter.endDatetime)).format("yyyy-MM-dd");

            let findAcc = that.subjectList.find(row=>{
                return row.accountId === that.filter.subjectId;
            });
            if(findAcc){
                that.subName = findAcc.accountCode + ' ' + findAcc.accountName;
                that.bank = findAcc.accountName;
            }

            let findCur = that.currencyList.find(row=>{
                return row.currencyId === that.filter.currencyId;
            });
            if(findCur){
                that.curName = findCur.currencyName;
            }

            this.getBankAccount();

            this.filterVisible = false;
            $('#list').setGridParam({ postData: JSON.stringify(this.filter) }).trigger("reloadGrid");
        },
        cancel(){
            this.filterVisible = false;
        },
        outHtml () {
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },

        filterOpen (_type) {     // 打开
            this.filterVisible = _type;
        },

        getColSum (name) {
            let rs = $(`td[aria-describedby='list_${name}']`);
            let sum = 0;
            if (rs.children("div.sumCol").length !== 0) {
                rs = $(`td[aria-describedby='list_${name}']`).children("div.sumCol")
            } else {
                rs = $(`td[aria-describedby='list_${name}']:not(:last)`)
            }
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000
            })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        pageInit () {
            let that = this;
            var _url = contextPath+"/bankdepositstatement/listhookedrecord";
            // var _url = rcContextPath + '/incomeCategory/queryListPage?r=' + new Date().getTime();
            jQuery("#list").jqGrid(
                {
                    url: _url,
                    postData: JSON.stringify(that.filter),
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: ['勾对id', '记录', '日期', '凭证字号', '摘要', '对方科目', '借方金额', '贷方金额', '制单人', '数据来源'],
                    height: 100000,

                    colModel: [
                        { name: 'hookId', index: 'hookId', width: 100, align: "center", hidden: true },
                        { name: 'record', index: 'record', width: 100, align: "center" },
                        { name: 'datetime', index: 'datetime', width: 150, align: "center" },
                        { name: 'voucherGroupName', index: 'voucherGroupName', width: 150, align: "center" },
                        { name: 'summary', index: 'summary', width: 100, align: "center" },
                        { name: 'relativeSubjectName', index: 'relativeSubjectName', width: 100, align: "center" },
                        { name: 'debitAmountFor', index: 'debitAmountFor', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return rows.debitAmountFor == null ? '' : accounting.formatNumber(rows.debitAmountFor,2);
                            },
                            formatoptions: {decimalSeparator:"."}
                        },
                        { name: 'creditAmountFor', index: 'creditAmountFor', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return rows.creditAmountFor == null ? '' : accounting.formatNumber(rows.creditAmountFor,2);
                            },
                            formatoptions: {decimalSeparator:"."}
                        },
                        { name: 'createName', index: 'createName', width: 100, align: "center" },
                        { name: 'dataSource', index: 'dataSource', width: 100, align: "center" },
                    ],
                    rowNum: 999999999,//一页显示多少条
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                        total: "totalPage",
                        records: "totalCount",
                        cell: "list",
                    },
                    sortable: false,
                    // caption: '银行存款日记账',
                    // hidegrid: false,
                    multiselect: true,
                    multikey: null,
                    multiboxonly: false,
                    rownumbers: true,
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 200,
                    viewrecords: true,
                    // footerrow: true,
                    // userDataOnFooter: true,
                    // gridComplete: that.completeMethod,
                    loadComplete: function (xhr) {
                        console.log(xhr, '===========xhr=');
                        that.lodoPList = xhr.data || [];
                    },
                    beforeRequest: function () {
                        that.selectListId = [];
                    },
                    onCellSelect: function (rowid) {
                        let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        console.log(rowData, "---------=>")

                    },
                    onSelectAll: function (aRowids, status) {  // 且点击头部的checkbox时才会触发此事件
                        console.log(aRowids, status, '===aRowids,status==');
                        status ? that.selectListId = aRowids : that.selectListId = [];
                    },
                    onSelectRow: function (rowid, status) {  // 当选择行时触发此事件
                        let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        console.log("当前选择的id===" + that.selectListId);
                    },
                    ondblClickRow: function (rowid) {

                    }
                })
        },


        completeMethod () {
            $("#list").footerData('set', {
                "code": '合计',
                'subjectId': [0],
            });
            var sum_subjectId = this.getColSum('subjectId')

            $("#list").footerData('set', {
                "code": '合计',
                'subjectId': sum_subjectId,
            });

        },

        //返回科目下拉框数据
        getSubject() {
            var that = this;
            $.ajax({
                url: contextPath+'/cashierBalanceController/app/initCnSubject',
                type: 'post',
                data: 'isCash=1&status=0',
                dataType: 'json',
                async: false,
                success: function (data) {
                    that.subjectList = data.data;
                    // that.$nextTick(function () {
                    //     that.filter.subjectId = Number(that.getQueryString('subjectId'));
                    //     alert(that.filter.subjectId);
                    // });
                }
            });
        },

        subjectChange() {
            console.log("subjectchange");
            console.log(this.filter.subjectId);
            var that = this;
            $.ajax({
                url: contextPath+'/cashierBalanceController/app/initCnCurrency',
                type: 'post',
                data: 'accountId='+that.filter.subjectId+'&isCash=1&status=0',
                dataType: 'json',
                async: false,
                success: function (data) {
                    that.currencyList = data.data;
                    // that.$nextTick(function () {
                    //     that.filter.currencyId = Number(that.getQueryString('currencyId'));
                    // });

                }
            });
        },

        getYear() {
            var that = this;
            $.ajax({
                url: contextPath+'/bankdepositstatement/year',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    // that.$nextTick(function () {
                    //     that.filter.accountYear = Number(that.getQueryString('accountYear'));
                    // });

                }
            });
        },

        getMonth() {
            var that = this;
            $.ajax({
                url: contextPath+'/bankdepositstatement/month',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    // that.$nextTick(function () {
                    //     that.filter.accountPeriod = Number(that.getQueryString('accountPeriod'));
                    // });
                }
            });
        },

        getOrg() {
            var that = this;
            $.ajax({
                url: contextPath+'/bankdepositstatement/getognlist',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    that.organisationList = data.data;
                    // that.$nextTick(function () {
                    //     that.filter.sobId = Number(that.getQueryString('sobId'));
                    // });

                }
            });
        },

        getBankAccount() {
            var that = this;
            $.ajax({
                url: contextPath+'/bankdepositstatement/getbankaccount',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(that.filter),
                success: function (data) {
                    that.bankAccount = data.data;

                }
            });
        },

        cancelHook() {
            var that = this;
            var submitIds = [];
            var ids = $("#list").jqGrid('getGridParam','selarrrow');

            for(var i = 0; i < ids.length; i++) {
                var rowData = $("#list").jqGrid('getRowData',ids[i]);
                submitIds.push(rowData.hookId);
                // alert(rowData.hookId);
            }
            if(submitIds.length < 1) {
                // alert("未选择任何已勾对记录");
                that.$Message.info({
                    content: "未选择任何已勾对记录",
                    duration: 3
                });
                return false;
            }
            $.ajax({
                url: contextPath+"/bankdepositstatement/cancelhook",
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(submitIds),
                success: function (data) {
                    // alert(data.msg);
                    that.$Message.info({
                        content: data.msg,
                        duration: 3
                    });
                    $('#list').setGridParam({ postData: JSON.stringify(that.filter) }).trigger("reloadGrid");
                }
            });
        },
        refresh() {
            $('#list').setGridParam({ postData: JSON.stringify(this.filter) }).trigger("reloadGrid");
        },
        //正则表达式法获取url参数值
        getQueryString(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return r[2]; return '';
        },
        quit() {
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        exporting() {
            $('#export_form')[0].submit();
        },
        print () {
            var that = this;
            //console.log("打印")
            // window.print();
            // printJS('paymentReceiptTimeBook', 'html');
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            that.lodoPList.forEach(item => {
                item.isTick = item.isTick === 2 ? "√" : "";
            });
            var _info = {
                'title': '已勾对记录列表',  // 标题
                'template': 1,  // 模板
                // 'titleInfo': [       // title
                //     { 'name': '日期', 'val': '2018-07-24' },
                //     { 'name': '单据编号', 'val': 'billNumber' },
                //     { 'name': '凭证字号', 'val': 'voucherSize' },
                //     { 'name': '核销类型', 'val': 'verificationTypeName' }
                // ],
                'titleInfo': [

                    {name:'银行',val:that.bank},
                    {name:'银行账号',val:that.bankAccount},
                    {name:'科目',val:that.subName},
                    {name:'币别',val:that.curName},
                    {name:'期间',val: that.filter.qr == 1 ? (that.filter.accountYear + '年' + that.filter.accountPeriod + '期') : (that.bdt + '至' + that.edt)}

                ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '记录', 'col': 'record' },
                    { 'name': '日期', 'col': 'datetime' },
                    { 'name': '凭证字号', 'col': 'voucherGroupName' },
                    { 'name': '摘要', 'col': 'summary' },
                    { 'name': '对方科目', 'col': 'relativeSubjectName' },
                    { 'name': '借方金额', 'col': 'debitAmountFor' },
                    { 'name': '贷方金额', 'col': 'creditAmountFor' },
                    { 'name': '制单人', 'col': 'createName' },
                    { 'name': '数据来源', 'col': 'dataSource' }
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': that.lodoPList,  // 打印数据  list
                'totalRow': false
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);

            //不带值正常打印,带值高级打印
            // htPrint(_info);
            // htPrint();
        },
        printModalShow (_t) {
            this.printModal = _t;
        }


    },

    //获取会计科目列表
    created() {
        this.filter.subjectId = Number(this.getQueryString('subjectId'));
        this.filter.currencyId = Number(this.getQueryString('currencyId'));

        this.filter.accountYear = Number(this.getQueryString('accountYear'));
        this.filter.accountPeriod = Number(this.getQueryString('accountPeriod'));
        this.filter.beginDatetime = this.getQueryString('beginDatetime');
        this.filter.endDatetime = this.getQueryString('endDatetime');
        this.filter.containTicked = this.getQueryString('containTicked');
        this.filter.qr = Number(this.getQueryString('qr'));
        this.filter.sobId = Number(this.getQueryString('sobId'));

        this.bdt = this.filter.beginDatetime;
        this.edt = this.filter.endDatetime;

        // alert(this.filter.subjectId);
        // alert(this.filter.currencyId);
        // alert(this.filter.accountYear);
        // alert(this.filter.accountPeriod);
        // alert(this.filter.beginDatetime);
        // alert(this.filter.endDatetime);
        // alert(this.filter.qr);
        // alert(this.filter.sobId);
    },
    mounted () {
        var that = this;
        this.getSubject();
        this.subjectChange();
        this.getBankAccount();
        this.getYear();
        this.getMonth();
        this.getOrg();

        let findAcc = that.subjectList.find(row=>{
            return row.accountId === that.filter.subjectId;
        });
        if(findAcc){
            that.subName = findAcc.accountCode + ' ' + findAcc.accountName;
            that.bank = findAcc.accountName;
        }

        let findCur = that.currencyList.find(row=>{
            return row.currencyId === that.filter.currencyId;
        });
        if(findCur){
            that.curName = findCur.currencyName;
        }


        this.pageInit();
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
})