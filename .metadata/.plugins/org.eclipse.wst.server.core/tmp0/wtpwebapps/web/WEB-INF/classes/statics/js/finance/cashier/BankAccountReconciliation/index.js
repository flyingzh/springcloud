var ve = new Vue({
    el: '#bankAccountReconciliation',
    data () {
        let This = this;
        return {
            selectTable: 1,     //打印判断当前选择了哪个表格，1银行对账单，2银行存款日报表
            noAutoFind: true, //手工对账不进行自动查找
            selectedStatementId: '',
            selectedJournalId: '',
            selectedStatement: '',
            selectedJournal: '',
            auto: false,
            bdt: '',
            edt: '',
            showFormInfo: false,
            /**
             * 保存表格上面显示的信息
             */
            bank: '',
            bankAccount: '',
            subName: '',
            curName: '',


            default: true,
            chg: '1',
            years: [2013,2014,2015,2016,2017,2018],
            months: [1,2,3,4,5,6,7,8,9,10,11,12],
            subjectList: [], //银行存款科目数据
            currencyList: [], //币别数据
            openTime: '',
            filterVisible: true,
            asModal: false, //对账设置 弹窗
            arcGroup: {
                date: false,
                abstract: false,
                settlement: false,
                settlementNumber: false,
                accountRestriction: false,
            },
            findRecord: '3',
            manualGroup: {
                date: false,
                abstract: false,
                settlement: false,
                settlementNumber: false,
                amount: true,
                accountRestriction: false,
            },

            subjectVisable: false,
            formData: {
                'f1': '',
                'f2': '',
                'f3': '',
                'subjectName': '', 'subjectCode': '', 'subjectId': '',
            },
            filter: {
                subjectId: '',
                currencyId: '',
                accountYear: '',
                accountPeriod: '',
                beginDatetime: (new Date()).format("yyyy-MM-dd"),
                endDatetime: (new Date()).format("yyyy-MM-dd"),
                // beginDatetime: '2000-01-01',
                // endDatetime: '2000-01-01',
                containTicked: '',
                qr: "1",
                sobId: ""
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
            lodoPList1: [],
            lodoPList2: [],
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
        goAlreadyConfirmedList () {
            // subjectId: '',
            //     currencyId: '',
            //     accountYear: '',
            //     accountPeriod: '',
            //     beginDatetime: (new Date()).format("yyyy-MM-dd"),
            //     endDatetime: (new Date()).format("yyyy-MM-dd"),
            //     qr: "1",
            //     sobId: 1,
            var _url = contextPath + '/finance/cashier/AlreadyConfirmedList/index.html?subjectId='+
                this.filter.subjectId+'&currencyId='+this.filter.currencyId+'&accountYear='+
                this.filter.accountYear+'&accountPeriod='+this.filter.accountPeriod+'&beginDatetime='+
                this.bdt+'&endDatetime='+this.edt+'&containTicked='+this.filter.containTicked+'&qr='+
                this.filter.qr+'&sobId='+this.filter.sobId;



            window.parent.activeEvent({ 'name': '已勾兑列表', 'url': _url });
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
                    console.log(that.subjectList[0].accountId);
                    that.filter.subjectId = that.subjectList[0].accountId;
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
                success: function (data) {
                    that.currencyList = data.data;
                    that.filter.currencyId = that.currencyList[0].currencyId;
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
                    that.filter.accountYear = data.data;
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
                    that.filter.accountPeriod = data.data;
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
                    that.filter.sobId = that.organisationList[0].id;

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
                    if (data.code == '100100') {
                        that.bankAccount = data.data;
                    }
                }
            });
        },


        // 科目下拉框
        showSubjectVisable () {
            this.subjectVisable = true;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            this.openData.subjectId = treeNode.id;
            this.openData.subjectCode = treeNode.subjectCode;
            this.openData.subjectName = treeNode.subjectName;
            this.subjectClose();
            // vm.row.subjectLabel = treeNode.subjectName;
            // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
            // vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
        },
        saveData(){

        },
        canceldata(){

        },
        save(){
            this.getBankAccount();
            this.findRecord = '3';
            this.showFormInfo = true;
            this.filterVisible = false;
            var that = this;
            console.log(this.filter);

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
            // this.filter.beginDatetime = Date.parse(new Date(this.filter.beginDatetime));
            // this.filter.endDatetime = Date.parse(new Date(this.filter.endDatetime));

            // this.filter.beginDatetime = (new Date(this.filter.beginDatetime)).format("yyyy-MM-dd");
            // this.filter.endDatetime = (new Date(this.filter.endDatetime)).format("yyyy-MM-dd");

            //判断是否是打开页面
            if(this.default) {
                this.pageInit();

                this.pageInit2();

            }else {

                $('#list').setGridParam({ postData: JSON.stringify(this.filter) }).trigger("reloadGrid");
                $('#list2').setGridParam({ postData: JSON.stringify(this.filter) }).trigger("reloadGrid");
            }


        },
        cancel(){
            this.filterVisible = false;
        },
        outHtml(){
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },

        filterOpen (_type) {     // 打开
            this.filterVisible = _type;
        },
        accountSetting (_type) {     // 对账设置
            this.auto = false;  //不是从自动对账进入对账设置
            this.asModal = _type;
        },
        //比较银行对账单和银行日记账某行是否相等
        compare(date,abstract,amount,obj1,obj2) {
            if(date) {
                return obj1.datetime == obj2.datetime;
            }
            if(abstract) {
                return $.trim(obj1.summary) == $.trim(obj2.summary);
            }
            if(amount) {
                return Number(obj1.debitAmountFor.replace(",","")) == Number(obj2.creditAmountFor.replace(",","")) && Number(obj1.creditAmountFor.replace(",","")) == Number(obj2.debitAmountFor.replace("",""));
            }
            return true;
        },
        //根据对账单记录自动查找日记账记录
        hasStatementFindJournal(that) {

            that.selectedStatementId = $('#list').jqGrid('getGridParam','selrow');
            var rowStatement = $("#list").jqGrid('getRowData',that.selectedStatementId);


            var allJournal = $("#list2").jqGrid("getRowData");
            var jIds = $("#list2").jqGrid('getDataIDs');
            allJournal.push($("#list2").jqGrid('getRowData', jIds[jIds.length - 1]));

            console.log("整个日记账：" + allJournal);
            for(var i=0;i<allJournal.length;i++) {
                console.log("" + i + "---------------->");
                for(var item in allJournal[i]){
                    console.log(item + "==" + allJournal[i][item]);
                }
            }

            var matchJournalIds = [];    //保存日记账中匹配的所有行的id;
            for(var i = 0; i < allJournal.length; i++) {
                if(that.compare(that.manualGroup.date,that.manualGroup.abstract,that.manualGroup.amount,rowStatement,allJournal[i])){
                    matchJournalIds.push(allJournal[i].id);
                }
            }
            // alert(matchJournalIds.length);

            var selector = "#list2 tr[id]";    //[id!=1][id!=2][id!=3]
            for (var j = 0; j < matchJournalIds.length; j++) {
                selector += "[id!=" + matchJournalIds[j] + "]";
            }
            console.log("selector:"+selector);
            $(selector).attr("style", "display: none;");
        },
        //根据日记账记录自动查找对账单记录
        hasJournalFindStatement(that) {
            that.selectedJournalId = $('#list2').jqGrid('getGridParam','selrow');
            var rowJournal = $("#list2").jqGrid('getRowData',this.selectedJournalId);


            var allStatement = $("#list").jqGrid("getRowData");
            var sIds = $("#list").jqGrid("getDataIDs");
            allStatement.push($("#list").jqGrid('getRowData', sIds[sIds.length - 1]));

            console.log("整个对账单：" + allStatement);
            for(var i=0;i<allStatement.length;i++) {
                console.log("" + i + "---------------->");
                for(var item in allStatement[i]){
                    console.log(item + "==" + allStatement[i][item]);
                }
            }

            var matchStatementIds = [];    //保存日记账中匹配的所有行的id;
            for(var i = 0; i < allStatement.length; i++) {
                if(that.compare(that.manualGroup.date,that.manualGroup.abstract,that.manualGroup.amount,rowJournal,allStatement[i])){
                    matchStatementIds.push(allStatement[i].id);
                }
            }
            // alert(matchStatementIds.length);

            var selector = "#list tr[id]";    //[id!=1][id!=2][id!=3]
            for (var j = 0; j < matchStatementIds.length; j++) {
                selector += "[id!=" + matchStatementIds[j] + "]";
            }
            console.log("selector:"+selector);
            $(selector).attr("style", "display: none;");

        },
        //清楚表格的隐藏状态
        clear() {
            $("#list tr[id]").removeAttr("style");
            $("#list2 tr[id]").removeAttr("style");
        },
        //选中银行对账单第一行
        selectFirstStatement() {
            var firstId = $("#list tr[id]").first().attr("id");
            jQuery("#list").jqGrid('setSelection',firstId);
        },
        //选中银行日记账第一行
        selectFirstJournal() {
            var firstId = $("#list2 tr[id]").first().attr("id");
            jQuery("#list2").jqGrid('setSelection',firstId);
        },
        accountSettingOK () {
            var that = this;

            if(this.auto) {
                this.auto = false;

                //自动对账开始

                var allStatement = $("#list").jqGrid("getRowData");
                var sIds = $("#list").jqGrid("getDataIDs");
                allStatement.push($("#list").jqGrid('getRowData', sIds[sIds.length - 1]));

                var allJournal = $("#list2").jqGrid("getRowData");
                var jIds = $("#list2").jqGrid("getDataIDs");
                allJournal.push($("#list2").jqGrid('getRowData', jIds[jIds.length - 1]));



                for(var i = 0; i < allStatement.length; i++) {
                    if($("#list tr[id="+allStatement[i].id+"]").attr("style") || allStatement[i].isTick != ""){
                        allStatement.splice(i, 1);
                        i--;
                    }
                }
                for(var j = 0; j < allJournal.length; j++) {
                    if($("#list2 tr[id="+allJournal[j].id+"]").attr("style") || allJournal[j].isTick != ""){
                        allJournal.splice(j, 1);
                        j--;
                    }

                }
                console.log("对账单：" + allStatement);
                console.log("日记账：" + allJournal);

                for(var i = 0; i < allStatement.length; i++) {
                    allStatement[i].done = false;
                }
                for(var j = 0; j < allJournal.length; j++) {
                    allJournal[j].done = false;
                }

                var list = [];
                for(var i = 0; i < allStatement.length; i++) {
                    if(allStatement[i].done) {
                        continue;
                    }
                    for(var j = 0; j < allJournal.length; j++) {
                        if(allJournal[j].done) {
                            continue;
                        }
                        if(that.compare(that.arcGroup.date,that.arcGroup.abstract,true,allStatement[i],allJournal[j])){
                            list.push({statementId: allStatement[i].id, depositId: allJournal[j].id});
                            allStatement[i].done = true;
                            allJournal[j].done = true;
                            break;
                        }
                    }
                }
                if(list.length < 1) {
                    // alert("自动对账完毕，没有勾对任何记录");
                    that.$Message.info({
                        content: "自动对账完毕，没有勾对任何记录",
                        duration: 3
                    });

                    return;
                }
                $.ajax({
                    url: contextPath+"/bankdepositstatement/hookright",
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(list),
                    async: false,
                    success: function (data) {
                        if(data.code == '100100'){
                            // alert("自动对账完毕！\n共勾对了日记账的数目为" + list.length + "\t对账单的数目为" + list.length);
                            that.$Message.info({
                                content: "自动对账完毕！\n共勾对了日记账的数目为" + list.length + "\t对账单的数目为" + list.length,
                                duration: 3
                            });
                        }else {
                            // alert("自动对账完毕，没有勾对任何记录");
                            that.$Message.info({
                                content: "自动对账完毕，没有勾对任何记录",
                                duration: 3
                            });
                        }

                    }
                });
                $('#list').setGridParam({ postData: JSON.stringify(that.filter) }).trigger("reloadGrid");
                $('#list2').setGridParam({ postData: JSON.stringify(that.filter) }).trigger("reloadGrid");

                return false;
            }
            this.clear();
            if(this.findRecord == 1) {
                // alert("根据对账单记录自动查找日记账记录");

                this.hasStatementFindJournal(this);


            }else if (this.findRecord == 2) {
                // alert("根据日记账记录自动查找对账单记录");

                this.hasJournalFindStatement(this);

            }else {
                // alert("不进行自动查找");
            }
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
            var _url = contextPath+'/bankdepositstatement/liststatement';
            // var _url = rcContextPath + '/incomeCategory/queryListPage?r=' + new Date().getTime();
            jQuery("#list").jqGrid(
                {
                    url: _url,
                    postData: JSON.stringify(that.filter),
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: ['id','勾对', '日期', '摘要', '借方金额','贷方金额','制单人','数据来源'],
                    height: '250',
                    colModel: [
                        {name:'id',index:'id',width:100,align:'center',hidden:true},
                        {name:'isTick',index:'isTick',width:100,align:'center',
                            formatter: function (value, grid, rows, state) {

                                return rows.isTick == 1 ? "" : "√";
                            }},
                        {name:'datetime',index:'datetime',width:100,align:'center'},
                        {name:'summary',index:'summary',width:100,align:'center'},
                        {name:'debitAmountFor',index:'debitAmountFor',width:100,align:'center',
                            formatter: function (value, grid, rows, state) {
                                return rows.debitAmountFor == null ? '' : accounting.formatNumber(rows.debitAmountFor,2);
                            },
                            formatoptions: {decimalSeparator:"."}
                        },
                        {name:'creditAmountFor',index:'creditAmountFor',width:100,align:'center',
                            formatter: function (value, grid, rows, state) {
                                return rows.creditAmountFor == null ? '' : accounting.formatNumber(rows.creditAmountFor,2);
                            },
                            formatoptions: {decimalSeparator:"."}
                        },
                        {name:'createName',index:'createName',width:100,align:'center'},
                        {name:'dataSourceName',index:'dataSourceName',width:100,align:'center'}
                        // { name: 'code', index: 'code', width: 100, align: "center" },
                        // { name: 'name', index: 'name asc, invdate', width: 150, align: "center" },
                        // { name: 'fullName', index: 'fullName', width: 150, align: "center" },
                        // { name: 'subjectId', index: 'subjectId', width: 100, align: "center" }
                    ],
                    rowNum: 999999999,//一页显示多少条
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                        total: "totalPage",
                        records: "data.totalCount"
                    },
                    sortable: false,
                    caption: '银行对账单',
                    hidegrid: false,
                    multiboxonly: true,
                    // multiselect: true,
                    rownumbers: false,
                    styleUI: 'Bootstrap',
                    height: '150',
                    viewrecords: true,
                    // footerrow: true,
                    // userDataOnFooter: true,
                    // gridComplete: that.completeMethod,
                    loadComplete: function (xhr) {
                        console.log(xhr, '===========xhr=');
                        that.lodoPList1 = xhr.data || [];
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
                        // let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        // console.log(rowData);
                        // that.selectedStatementId = rowData.id;
                        // console.log("当前选择的id===" + that.selectedStatementId);
                        if(that.findRecord == 1){
                            that.clear();
                            that.hasStatementFindJournal(that);
                        }

                    },
                    ondblClickRow: function (rowid) {

                    },
                    gridComplete: function () {
                        // var ids =  jQuery("#list").jqGrid('getDataIDs');
                        // console.log("ids:"+ids);
                        // var firstId;
                        // for(var i = 0; i < ids.length; i++) {
                        //     if(ids[i] != null) {
                        //         firstId = ids[i];
                        //         break;
                        //     }
                        // }
                        that.selectFirstStatement();
                        // this.selectedStatementId = firstId;
                        $("#gbox_list").click(function () {
                            that.selectTable = 1;
                            // alert("选择了对账单");
                        });

                    }
                });
            that.default = false;
        },

        pageInit2 () {
            let that = this;
            var _url = contextPath+'/bankdepositstatement/listjournal';
            // var _url = rcContextPath + '/incomeCategory/queryListPage?r=' + new Date().getTime();
            jQuery("#list2").jqGrid(
                {
                    url: _url,
                    postData: JSON.stringify(that.filter),
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: ['id','勾对','业务日期','日期','凭证字号','摘要','对方科目','借方金额','贷方金额','制单人'],
                    height: '250',
                    colModel: [
                        {name:'id',index:'id',width:100,align:'center',hidden:true},
                        {name:'isTick',index:'isTick',width:100,align:'center',
                            formatter: function (value, grid, rows, state) {

                                return rows.isTick == 1 ? "" : "√";
                            }},
                        {name:'operateTime',index:'operateTime',width:100,align:'center'},
                        {name:'datetime',index:'datetime',width:100,align:'center'},
                        {name:'voucherGroupName',index:'voucherGroupName',width:100,align:'center'},
                        {name:'summary',index:'summary',width:100,align:'center'},
                        {name:'subjectName',index:'subjectName',width:100,align:'center'},
                        {name:'debitAmountFor',index:'debitAmountFor',width:100,align:'center',
                            formatter: function (value, grid, rows, state) {
                                return rows.debitAmountFor == null ? '' : accounting.formatNumber(rows.debitAmountFor,2);
                            },
                            formatoptions: {decimalSeparator:"."}
                        },
                        {name:'creditAmountFor',index:'creditAmountFor',width:100,align:'center',
                            formatter: function (value, grid, rows, state) {
                                return rows.creditAmountFor == null ? '' : accounting.formatNumber(rows.creditAmountFor,2);
                            },
                            formatoptions: {decimalSeparator:"."}
                        },
                        {name:'createName',index:'createName',width:100,align:'center'}
                        // { name: 'code', index: 'code', width: 100, align: "center" },
                        // { name: 'name', index: 'name asc, invdate', width: 150, align: "center" },
                        // { name: 'fullName', index: 'fullName', width: 150, align: "center" },
                        // { name: 'subjectId', index: 'subjectId', width: 100, align: "center" }
                    ],
                    rowNum: 999999999,//一页显示多少条
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                        total: "totalPage",
                        records: "totalCount"
                    },
                    sortable: false,
                    caption: '银行存款日记账',
                    hidegrid: false,
                    multiboxonly: true,
                    // multiselect: true,
                    rownumbers: false,
                    styleUI: 'Bootstrap',
                    height: '150',
                    viewrecords: true,
                    // footerrow: true,
                    // userDataOnFooter: true,
                    // gridComplete: that.completeMethod,
                    loadComplete: function (xhr) {
                        console.log(xhr, '===========xhr=');
                        that.lodoPList2 = xhr.data || [];
                    },
                    beforeRequest: function () {
                        that.selectListId = [];
                    },
                    onCellSelect: function (rowid) {
                        let rowData = jQuery("#list2").jqGrid('getRowData', rowid);
                        console.log(rowData, "---------=>")

                    },
                    onSelectAll: function (aRowids, status) {  // 且点击头部的checkbox时才会触发此事件
                        console.log(aRowids, status, '===aRowids,status==');
                        status ? that.selectListId = aRowids : that.selectListId = [];
                    },
                    onSelectRow: function (rowid, status) {  // 当选择行时触发此事件
                        // let rowData = jQuery("#list2").jqGrid('getRowData', rowid);
                        // console.log("当前选择的id===" + that.selectListId);

                        if(that.findRecord == 2) {
                            that.clear();
                            that.hasJournalFindStatement(that);
                        }

                    },
                    ondblClickRow: function (rowid) {

                    },
                    gridComplete: function () {
                        // var ids =  jQuery("#list2").jqGrid('getDataIDs');
                        // console.log("ids:"+ids);
                        // var firstId;
                        // for(var i = 0; i < ids.length; i++) {
                        //     if(ids[i] != null) {
                        //         firstId = ids[i];
                        //         break;
                        //     }
                        // }

                        that.selectFirstJournal();

                        $("#gbox_list2").click(function () {
                            that.selectTable = 2;
                            // alert("选择了存款日记账");
                        });

                    }
                });
            that.default = false;
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
        //自动对账
        autoCheck(_type) {
            this.auto = true;
            this.asModal = _type;
        },
        //手工对账
        manualCheck() {
            var that = this;
            // alert("勾对");
            var selsid = $('#list').jqGrid('getGridParam','selrow');
            if((typeof selsid) == 'undefined'){
                return false;
            }
            var rowStatement = $("#list").jqGrid('getRowData',selsid);
            var seljid = $("#list2").jqGrid('getGridParam','selrow');
            if((typeof seljid) == 'undefined'){
                return false;
            }
            var rowJournal = $("#list2").jqGrid('getRowData', seljid);

            if(rowStatement.isTick != '' || rowJournal.isTick != ''){
                // alert("选择的对账单数据已勾对，不能进行手工对账");
                that.$Message.info({
                    content: "选择的对账单数据已勾对，不能进行手工对账",
                    duration: 3
                });
                return false;
            }
            if(Number(rowStatement.debitAmountFor.replace(",","")) != Number(rowJournal.creditAmountFor.replace(",","")) || Number(rowStatement.creditAmountFor.replace(",","")) != Number(rowJournal.debitAmountFor.replace(",",""))) {
                // alert("选择的对账单发生额与日记账发生额不相符！\n不能进行手工对账！");
                that.$Message.info({
                    content: "选择的对账单发生额与日记账发生额不相符！\n不能进行手工对账！",
                    duration: 3
                });
                return false;
            }
            var submitData = [{statementId: selsid,depositId: seljid}];

            $.ajax({
                url: contextPath+"/bankdepositstatement/hookright",
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(submitData),
                async: false,
                success: function (data) {
                    // alert(data.msg);

                    that.$Message.info({
                        content: data.msg,
                        duration: 3
                    });
                }
            });
            $('#list').setGridParam({ postData: JSON.stringify(that.filter) }).trigger("reloadGrid");
            $('#list2').setGridParam({ postData: JSON.stringify(that.filter) }).trigger("reloadGrid");


        },
        hi() {
            // $("#list tr[id]").css("display", "none");
            // $("#list tr[id][id!=1]").css("display", "none");
            // $("#list tr[id][id!=1]").attr("style","display: none;");
            // var $list = $("#list tr[id][id!=1][id!=2][id!=3]");
            // $list.attr("style", "display: none;");
            var $list2 = $("#list2 tr[id=1]")[0];
            alert($list2);
        },
        quit() {
            // $("#list tr[id][id!=1]").removeAttr("style");
            window.parent.closeCurrentTab({ name: "银行存款对账", openTime: this.openTime, exit: true });
        },
        manualOptions() {
            if(this.findRecord == 1 || this.findRecord == 2) {
                this.noAutoFind = false;
            }else {
                this.noAutoFind = true;
            }
        },
        refresh() {
            $('#list').setGridParam({ postData: JSON.stringify(this.filter) }).trigger("reloadGrid");
            $('#list2').setGridParam({ postData: JSON.stringify(this.filter) }).trigger("reloadGrid");
        },
        exporting() {
            $('#export_form')[0].submit();
        },
        print () {
            var that = this;
            //console.log("打印")
            // window.print();
            // printJS('paymentReceiptTimeBook', 'html');
            if (that.selectTable == 1) {
                console.log(that.lodoPList1, '=========that.lodoPList1');
                if (!that.lodoPList1 || !that.lodoPList1.length) {
                    that.$Message.info({
                        content: '无打印数据',
                        duration: 3
                    });
                    return;
                }
                that.lodoPList1.forEach(item => {
                    item.isTick = item.isTick === 2 ? "√" : "";
                });
                var _info = {
                    'title': '银行对账单',  // 标题
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
                        { 'name': '勾对', 'col': 'isTick' },
                        { 'name': '日期', 'col': 'datetime' },
                        { 'name': '摘要', 'col': 'summary' },
                        { 'name': '借方金额', 'col': 'debitAmountFor' },
                        { 'name': '贷方金额', 'col': 'creditAmountFor' },
                        { 'name': '制单人', 'col': 'createName' },
                        { 'name': '数据来源', 'col': 'dataSourceName' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.lodoPList1,  // 打印数据  list
                    'totalRow': false
                }
            } else {
                console.log(that.lodoPList2, '=========that.lodoPList2');
                if (!that.lodoPList2 || !that.lodoPList2.length) {
                    that.$Message.info({
                        content: '无打印数据',
                        duration: 3
                    });
                    return;
                }
                that.lodoPList2.forEach(item => {
                    item.isTick = item.isTick === 2 ? "√" : "";
                });
                var _info = {
                    'title': '银行存款日记账',  // 标题
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
                        { 'name': '勾对', 'col': 'isTick' },
                        { 'name': '业务日期', 'col': 'operateTime' },
                        { 'name': '日期', 'col': 'datetime' },
                        { 'name': '凭证字号', 'col': 'voucherGroupName' },
                        { 'name': '摘要', 'col': 'summary' },
                        { 'name': '对方科目', 'col': 'subjectName' },
                        { 'name': '借方金额', 'col': 'debitAmountFor' },
                        { 'name': '贷方金额', 'col': 'creditAmountFor' },
                        { 'name': '制单人', 'col': 'createName' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.lodoPList2,  // 打印数据  list
                    'totalRow': false
                }
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
    mounted () {
        this.getSubject();
        this.subjectChange();
        this.getYear();
        this.getMonth();
        this.getOrg();

        this.openTime = window.parent.params && window.parent.params.openTime;
    },
})