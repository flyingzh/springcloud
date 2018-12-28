var vm = new Vue({
    el: '#fixedAssetsGenerationCertificate',
    data () {
        var that = this;
        return {
            openTime: '',
            baseData: {
                subjectName: '',
                periodDate: '',
            },
            filterModal: false,
            currentOrgName: JSON.parse(localStorage.user).currentOrgName,
            filterBody: {
                sobId: JSON.parse(localStorage.user).userCurrentOrganId,
                accountYear: '', // 会计年度
                accountPeriod: '', // 会计期间
                changeType: -1, // 事务类型
                certificateStatus: -1, //凭证状态
                audited: -1, //审核状态
                cardIds:[],//选中的卡片id
            },
            certificateStatus:[
                { 'value': -1, 'label': '全部' },
                { 'value': 1, 'label': '已生成凭证' },
                { 'value': 2, 'label': '未生成凭证' },

            ],
            audited:[
                { 'value': -1, 'label': '全部' },
                { 'value': 1, 'label': '已审核' },
                { 'value': 2, 'label': '未审核' },
            ],
            //事务类型
            changeTypes: [
                { 'value': -1, 'label': '全部' },
                { 'value': 1, 'label': '新增' },
                { 'value': 2, 'label': '变动' },
                { 'value': 3, 'label': '清理' },
            ],
            selected:[],
            accountYear: [],
            accountPeriod: [],
            accordingModal: false,
            accordingCheck: false,
            summaryModal: false,
            summaryCheck: false,
            voucherVisible: false,
            voucherModelTxt:'',
            isContinue: false,
            viewReportVisible:false,
            viewReportTxt: '',
            showVoucherVisible: false,
            isNotToDelete:false,
            dataList:[],
            voucherFilter: {
                // voucherWordId: 0,//凭证字id
                abnormalDataProcessing: '',//按单异常处理
                subjectMergerDebit: false, // 借方相同科目合并
                subjectMergerLender: false, //贷方相同科目合并
                impairmentPreparationSubjectId:0,//减值准备对应科目
                clearingExpenseSubjectId:0,//清理费用对应科目
                residualIncomeSubjectId:0, //残值收入对应科目
            },
            impairmentPreparationSubjectName:'',//减值准备对应科目
            clearingExpenseSubjectName:'',//清理费用对应科目
            residualIncomeSubjectName:'',//残值收入对应科目
            subjectVisable: false,
            subjectTpye: '',
            printModal: false,
            printInfo: {},
        }
    },
    mounted () {
        // this.filterBody.sobId = JSON.parse(localStorage.user).userCurrentOrganId;
        this.init();
        this._queryObject();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        initPage () {
            this.initJqGrid();
        },
        initJqGrid () {
            let that = this;
            jQuery("#grid").jqGrid(
                {
                    multiselect: true,
                    postData: JSON.stringify(that.filterBody),
                    mtype: 'POST',
                    styleUI: 'Bootstrap',
                    url: contextPath + '/fixedAssetsVoucher/generatingCredentialDataPresentation',
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    colNames: ['id', '日期','凭证字号','凭证审核','记账标志','资产编码','资产名称','事务类型','变动方式','原值增加','原值减少',
                            '累计折旧增加','累计折旧减少','减值准备增加','减值准备减少','残值收入','可抵扣税额','清理费用','voucherId'],
                    colModel: [
                        { name: 'id', width: 70, align: "center", sortable: false, key: true, hidden: true },
                        { name: 'enterAccountDate', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return (new Date(value)).format("yyyy-MM-dd");
                        }},
                        { name: 'voucherWord', width: 100, align: "center", sortable: false ,
                            formatter: function (value, grid, rows, state) {
                            if (value){
                            $(document).off("click",".mark"+grid.rowId)
                                .on("click",".mark"+grid.rowId,function(){
                                    that.edit(rows.voucherId);
                                    return;
                                });
                                let a =`<a class="mark${grid.rowId}">${value}</a>`;
                                return a;
                            }
                            return '';

                        } },
                        { name: 'voucherAudit', width: 100, align: "center",title: false, sortable: false ,formatter: function (value, options, rowData){
                            if(value == 1){
                                return '<i class="layui-icon ht-icon-ok">&#xe605;</i>';
                            }else {
                                return '';
                            }
                        }},
                        { name: 'voucherPosting', width: 100, align: "center", title: false , sortable: false ,formatter: function (value, options, rowData){
                            if(value == 1){
                                return '<i class="layui-icon ht-icon-ok">&#xe605;</i>';
                            }else {
                                return '';
                            }
                        }},
                        { name: 'assetCode', width: 100, align: "center", sortable: false },
                        { name: 'assetName', width: 100, align: "center", sortable: false },
                        { name: 'changeType', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            if(value == 1){
                                return "新增";
                            }else if(value == 2){
                                return "变动";
                            }else if(value == 3){
                                return "清理";
                            }
                        }},
                        { name: 'alterTypeName', width: 100, align: "center", sortable: false },
                        { name: 'buyOrgVal', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value <= 0?"" : accounting.formatNumber(value, 2, ",");
                        }},
                        { name: 'buyOrgVal', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value >= 0?"" : accounting.formatNumber(-value, 2, ",");
                        }},
                        { name: 'deprService', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value <= 0?"" : accounting.formatNumber(value, 2, ",");
                        } },
                        { name: 'deprService', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value >= 0?"" : accounting.formatNumber(-value, 2, ",");
                        } },
                        { name: 'devalPreparation', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value <= 0?"" : accounting.formatNumber(value, 2, ",");
                        }},
                        { name: 'devalPreparation', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value >= 0?"" : accounting.formatNumber(-value, 2, ",");
                        }},
                        { name: 'salvageIncome', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value == 0?"" : accounting.formatNumber(value, 2, ",");
                        }},
                        { name: 'deductionAmount', width: 100, align: "center", sortable: false ,formatter: function (value, options, rowData){
                            return value == 0?"" : accounting.formatNumber(value, 2, ",");
                        }},
                        { name: 'clearAmount', width: 100, align: "center", sortable: false,formatter: function (value, options, rowData){
                            return value == 0?"" : accounting.formatNumber(value, 2, ",");
                        } },
                        { name: 'voucherId', width: 70, align: "center", sortable: false, hidden: true },
                    ],
                    datatype: 'json',
                    jsonReader: {
                        root: "data",
                        // cell: "list",
                        // userdata: "data.userData",
                        // repeatitems: false
                    },
                    height: $(window).height() - 140,
                    viewrecords: true,
                    rownumbers: true,
                    rowNum: 999999999,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "selected");
                        // that.getListId(that.selected, that.selectedId, that.tableList)
                    },
                    // beforeSelectRow: function (data, status) { // 当选择行时触发此事件
                    //     console.log("data---------111",data, status);
                    //     if(!!data){
                    //         return false;
                    //     }
                    // },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        console.log("data---------", data, status);
                        if (!!data) {
                            that.handlerId(data, status, "selected");
                            console.log("that.selected",that.selected)
                            //that.getListId(that.selected, that.selectedId, that.tableList)
                        }
                    },
                    gridComplete: function () {
                        $("table[id='grid'] tr[id='null'] input").attr('style', 'display:none')
                        $("table[id='grid'] tr[id='0'] input").attr('style', 'display:none')
                        window.top.home.loading('hide');
                    },
                    loadComplete: function (ret) {
                        var len = that.changeTypes.length;
                        for( var i = 0 ; i < len ; i++){
                            if (that.changeTypes[i].value == that.filterBody.changeType){
                                that.baseData.subjectName =  that.changeTypes[i].label;
                            }
                        }
                        that.baseData.periodDate = that.filterBody.accountYear + "年" + "第" +  that.filterBody.accountPeriod + "期",
                        console.log(ret,"ret")
                        if(ret!=null && ret.data!=null){
                            that.dataList = ret.data;
                        }
                        jQuery("#grid").jqGrid('destroyGroupHeader');
                        jQuery("#grid").jqGrid('setGroupHeaders', {
                            useColSpanStyle: true,
                        });
                        //获取表格所有行数据
                        let rows = jQuery("#grid").jqGrid('getRowData');
                        var allCountID = $("#grid").jqGrid('getDataIDs');
                        rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                        that.tableList = rows;
                        console.log('tableList', that.tableList)
                        // if (ret.code == '100100') {
                        //     that.baseData.subjectName = ret.data.subjectName;
                        //     that.baseData.currencyName = ret.data.currencyName;
                        //     that.baseData.periodDate = ret.data.queryPeriod;
                        // }else{
                        //     layer.alert(ret.msg)
                        // }
                    }
                })
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        edit(voucherId){
            //  console.log('edit')
            var url = contextPath+'/finance/voucher-lrt/index.html?voucherId='+voucherId+"&sobId="+1;
            window.parent.activeEvent({name: '记账凭证', url: url, params: null});
        },
        handlerId (data, status, type) {
            console.log("data",data, status, type)
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm.selected = data.filter(row => {
                    if (row != 'null' && row != '0' && row != '') {
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) { _vm.selected = []; }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0' && data != '');
                    if (flag) {
                        (_vm.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                    }
                } else {
                    let index = _vm.selected.indexOf(data.toString());
                    index > -1 ? _vm.selected.splice(index, 1) : null;
                }
            }
        },
        //初始化过滤条件
        init(){
            let _that = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/fixedAssetsVoucher/getAccountYearAndPeriod',
                dataType: 'json',
                data: null,
                success: function (d) {
                    if (d.code === '100100') {
                        console.log(d, "======>");
                        _that.filterBody.accountYear = d.data.presents[0];
                        _that.filterBody.accountPeriod = d.data.presents[1];
                        _that.accountYear = d.data.year;
                        _that.accountPeriod = d.data.period;
                    }else {
                        _that.$Modal.error({
                            title:'提示',
                            content:d==null||d.msg==null||d.msg==''?"页面初始化失败":d.msg
                        })
                    }
                    _that.delTable();
                    _that.initPage();
                },
            });
        },
        //查询凭证选项
        _queryObject: function () {
            var that = this;
            var _url = baseURL + 'generatingCredentialOption/getCredentialOption';
            let _formData = new FormData();
            _formData.append("ownershipSystem", 4);
            http.post(_url, _formData).then((json) => {
                    if (json.code === '100100') {
                        console.log("json.data",json.data);
                        that.voucherFilter = json.data;
                        that.querySubject(json.data);
                }
            }, (json) => { });

        },
        querySubject(_data){
            var _that = this;
            var ids = [];
            if(_data.clearingExpenseSubjectId){
                ids.push(_data.clearingExpenseSubjectId);
            }
            if(_data.impairmentPreparationSubjectId){
                ids.push(_data.impairmentPreparationSubjectId);
            }
            if(_data.residualIncomeSubjectId){
                ids.push(_data.residualIncomeSubjectId);
            }
            console.log(ids,"ids----")
            if(ids.length == 0){
                return;
            }
            var _url = baseURL + 'fixedAssetsVoucher/getSubjectIdList';

            $.ajax({
                type: 'post',
                async: false,
                url: _url,
                data: {'ids': ids},
                success: function (result) {
                    var _text = '';
                    if (result.code === '100100') {
                        //跳转到编辑凭证页面
                        console.log("result-=-=-", result.data);
                        console.log("_that.voucherFilter",_that.voucherFilter)
                        for(var j = 0;j<result.data.length;j++){
                            if (result.data[j].id == _that.voucherFilter.clearingExpenseSubjectId){
                                _that.clearingExpenseSubjectName = result.data[j].subjectName?result.data[j].subjectName+'|'+result.data[j].subjectCode:'1';
                            }
                            if (result.data[j].id == _that.voucherFilter.impairmentPreparationSubjectId){
                                _that.impairmentPreparationSubjectName = result.data[j].subjectName?result.data[j].subjectName+'|'+result.data[j].subjectCode:'1';
                            }
                            if (result.data[j].id == _that.voucherFilter.residualIncomeSubjectId){
                                _that.residualIncomeSubjectName = result.data[j].subjectName?result.data[j].subjectName+'|'+result.data[j].subjectCode:'1';
                            }
                        }
                        console.log("----",_that.clearingExpenseSubjectName, _that.impairmentPreparationSubjectName, _that.residualIncomeSubjectName)
                    }
                }
            });



        },
        voucherSave () {
            var that = this;
            console.log("-----------")
            console.log(that.voucherFilter, '===that.voucherFilter');
            var _url = baseURL + 'generatingCredentialOption/update';
            if (!that.voucherFilter.residualIncomeSubjectId  || that.voucherFilter.residualIncomeSubjectId == 'null' || that.voucherFilter.residualIncomeSubjectId == 'undefined'){
                that.voucherFilter.residualIncomeSubjectId = 0;
            }
            if (!that.voucherFilter.impairmentPreparationSubjectId  || that.voucherFilter.impairmentPreparationSubjectId == 'null' || that.voucherFilter.impairmentPreparationSubjectId == 'undefined'){
                that.voucherFilter.impairmentPreparationSubjectId = 0;
            }
            if (!that.voucherFilter.clearingExpenseSubjectId  || that.voucherFilter.clearingExpenseSubjectId == 'null' || that.voucherFilter.clearingExpenseSubjectId == 'undefined'){
                that.voucherFilter.clearingExpenseSubjectId = 0;
            }
            let _formData = new FormData();
            _formData.append("abnormalDataProcessing", parseInt(that.voucherFilter.abnormalDataProcessing));
            _formData.append("subjectMergerDebit", that.voucherFilter.subjectMergerDebit);
            _formData.append("subjectMergerLender", that.voucherFilter.subjectMergerLender);
            _formData.append("impairmentPreparationSubjectId", that.voucherFilter.impairmentPreparationSubjectId);
            _formData.append("clearingExpenseSubjectId", that.voucherFilter.clearingExpenseSubjectId);
            _formData.append("residualIncomeSubjectId", that.voucherFilter.residualIncomeSubjectId);
            _formData.append("ownershipSystem", 4);//固定资产系统
            console.log("_formData",_formData,that.voucherFilter.residualIncomeSubjectId);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                that.cancel();
                }
                that.$Message.info({
                    content: json.msg,
                    duration: 3
                });
            }, (json) => { })
        },
        save (type) {
            switch (type) {
                case 'open':
                    this.openSave();
                    break;
                case 'edit':
                    this.editSave();
                    break;
                case 'import':
                    this.importSave();
                    break;
                case 'voucher':
                    this.voucherSave();
                    break;
                default:
                    break;
            }

        },
        resetting(){
            this.voucherFilter.impairmentPreparationSubjectId = 0;
            this.voucherFilter.clearingExpenseSubjectId = 0;
            this.voucherFilter.residualIncomeSubjectId = 0;
            this.impairmentPreparationSubjectName = '';//减值准备对应科目
            this.clearingExpenseSubjectName = '';//清理费用对应科目
            this.residualIncomeSubjectName = '';//残值收入对应科目
        },
        formartMoney(value) {
            //格式化金额
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        cancel(){
            this.voucherVisible = false;
        },
        refresh () {
            this.selected = [];
            this.isNotToDelete = false;
            this.saveData();
        },
        open () {
            this.filterModal = true;
        },
        saveData () {
            $('#grid').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
        },
        cancelData () {
            this.filterModal = false;
        },
        //按单生成
        saveAccording(){
            this.accordingModal = true;
        },
        saveAccordingData () {
            this.singleGenerationCertificate();
        },
        cancelAccordingData () {
            this.accordingModal = false;
        },

        //点击汇总生成弹出框
        saveSummary () {
            this.summaryModal = true;
        },
        //点击确认时 请求接口
        saveSummaryData () {
            this.summaryGenerationCertificate();
        },
        //点击取消时
        cancelSummaryData () {
            this.summaryModal = false;
        },
        showSubjectVisable (type, index) {
            //多个折旧费用分配科目保存索引
            if (type == 4) {
                this.subjectIdx = index;
            }
            var that = this;

            //单个折旧费用分配科目
            if (type == 3) {
                if ((that.deptSingleMul == 1 && that.singleDepartmentList.length < 1) || (that.deptSingleMul == 2 && that.mulDepartmentList.length < 1)) {
                    alert("要进行折旧费用分配，部门信息不能为空！");
                    return;
                }
            }
            this.subjectVisable = true;
            this.subjectTpye = type;
        },
        selectRowAction (_t) {
            var _that = this;
            var ids = _that.selected;
            _that.filterBody.cardIds = ids;
            if (ids.length == 0){
                _that.$Message.info({
                    content: '请选择一个单据。',
                    duration: 3
                });
                return;
            }
            console.log("ids",ids)
            switch (_t) {
                case 'pressTheBill':   // 按单生成凭证
                    _that.saveAccording();
                    break;
                case 'gather': // 汇总生成凭证
                    _that.saveSummary();
                    break;
                case 'delete':   // 删除凭证
                    _that.deleteVoucher();
                    break;
                case 'auditing': // 审核凭证
                    _that.auditingVoucher(1);
                    break;
                case 'counterAudit': // 反审核凭证
                    _that.auditingVoucher(2);
                    break;
                case 'voucher':
                    _that.checkCredentials();
                    break;
                default:
                    break;
            }

        },
        checkCredentials(){
            var _that = this;
            //查看凭证
            // console.log("that.parame", parame);
            if (_that.selected.length === 0) {
                _that.$Message.info({
                    content: '请选择一个单据。',
                    duration: 3
                });
                return;
            };
            //获取到最后一个id
            var id = _that.selected[_that.selected.length - 1];
            var _d = '';
            for (var i = 0; i < _that.tableList.length; i++) {
                if (_that.tableList[i].id == id) {
                    _d = _that.tableList[i];
                    break;
                }
            }
            console.log("_d", _d);
            console.log("_d", _d.voucherId);
            if (typeof _d.voucherId === undefined || _d.voucherId == 0 ) {
                _that.$Message.info({
                    content: '最后选取的单据暂未生成凭证。',
                    duration: 3
                });
                return;
            }
            // console.log("parame", parame);

            var _h = `${rcContextPath}/finance/voucher-lrt/index.html?voucherId=${_d.voucherId}&sobId=${_that.filterBody.sobId}`;
            var _p = {
                'name': '查看凭证',
                'url': _h
            }
            window.parent.activeEvent(_p);
        },
        //获取选中行中的凭证id
        getVoucherIds(type){
            var _that = this;
            var voucherId = [];
            var selectedIds = [];
            for(var i = 0;i<_that.dataList.length;i++){
                for(var j = 0;j<_that.selected.length;j++){
                    if(parseInt(_that.tableList[i].voucherId)   && _that.tableList[i].id === _that.selected[j]){
                        voucherId.push(parseInt(_that.tableList[i].voucherId));
                        //将页面上的卡片凭证id置位o
                        _that.tableList[i].voucherId = 0;
                    }else {
                        //将未生成凭证的id单独保存
                        selectedIds.push(_that.selected[j]);
                    }
                }
            }
            console.log(voucherId,"voucherId")
            if(voucherId.length>0){
                _that.isNotToDelete = true;
                _that.$Modal.confirm({
                    title: '系统提示',
                    content: '<p>选中的单据存在已生成对应的凭证,是否需要删除重新生成</p>',
                    //确认删除  先删除,然后在删除成功后调用对应的方法生成凭证
                    onOk: () => {
                        _that.deleteVoucher(type,voucherId);
                    },
                    //不删除 则需要过滤掉已经生成凭证的id
                    onCancel: () => {
                        _that.filterBody.cardIds = selectedIds;
                        _that.refresh ();
                    }
                });
            }
        },
        //按单生成凭证
        singleGenerationCertificate(){
            var _that = this;
            _that.getVoucherIds(1);
            if (_that.isNotToDelete){
                return;
            }
            console.log("_that.filterBody",_that.filterBody)
            $.ajax({
                type: 'post',
                url: contextPath + '/fixedAssetsVoucher/singleGenerationCertificate',
                dataType: 'json',
                data: JSON.stringify(_that.filterBody),
                contentType: 'application/json;charset=utf-8',
                success: function (d) {
                    if (d.code === '100100') {
                        console.log(d, "======>");
                        if (d.data.gcoe.abnormalDataProcessing == '2' || d.data.gcoe.abnormalDataProcessing == '3' ){
                            _that.voucherModelTxt = '开始生成凭证';
                            var _t = '报告内容：';
                            /*json.data.log.forEach((_item) => {
                                _t += `${_item} , `;
                            });*/
                            _that.viewReportTxt = d.data.log;
                            _that.showVoucher(true)
                            _that.isContinue = false;
                        }else {
                            //编辑凭证
                            var _h = `${contextPath}/finance/voucher-lrt/index.html?key=${d.data.key}&sys=4&type=4`;
                            var _p = {
                                'name': '查看凭证',
                                'url': _h
                            }
                            window.parent.activeEvent(_p);
                            _that.refresh ();
                            return;
                          //跳转页面
                        }
                } else {
                    _that.$Message.info({
                        content: d.msg,
                        duration: 3
                    });
                }
                },
            });
        },
        accordingAction () {
            var that = this;
            that.showVoucher(false);
            that.showVoucherVisibleClose();
        },
        showVoucherVisibleClose () {
            var that = this;
            that.isContinue = false;
            that.refresh();
        },
        showVoucher (_bool) {
            this.showVoucherVisible = _bool;
        },
        showViewReport (_bool) {
            this.viewReportVisible = !this.viewReportVisible;
        },

        //汇总生成凭证
        summaryGenerationCertificate(){
            var _that = this;
            _that.getVoucherIds(2);
            if (_that.isNotToDelete){
                return;
            }
            console.log("_that.filterBody",_that.filterBody)
            $.ajax({
                type: 'post',
                url: contextPath + '/fixedAssetsVoucher/summaryGeneration',
                dataType: 'json',
                data: JSON.stringify(_that.filterBody),
                contentType: 'application/json;charset=utf-8',
                success: function (d) {
                    var _text = '';
                    if (d.code === '100100') {
                        //跳页面
                        if (d.data.gcoe.abnormalDataProcessing == 1){
                            //编辑凭证
                            var _h = `${contextPath}/finance/voucher-lrt/index.html?key=${d.data.key}&sys=4&type=4`;
                            var _p = {
                                'name': '查看凭证',
                                'url': _h
                            }
                            window.parent.activeEvent(_p);
                            _that.refresh ();
                            return;
                            //跳转页面
                        }else{
                            _text = d.msg;
                        }
                    }else {
                        _text = d.msg;
                    }
                    _that.$Message.info({
                        content: _text,
                        duration: 3
                    });
                    _that.refresh ();
                },
            })
        },
        //删除凭证 type {1: 按单生成凭证,2汇总生成凭证}
        deleteVoucher(type,ids){
            var _that = this;
            var voucherId = [];
            var voucherIds = [];
            if(!type){
                for(var i = 0;i<_that.dataList.length;i++){
                    for(var j = 0;j<_that.selected.length;j++){
                        if(_that.tableList[i].id === _that.selected[j]){
                            console.log("_that.tableList[i].voucherId" ,_that.tableList[i].voucherId)
                            if(_that.tableList[i].voucherId != '0' && _that.tableList[i].voucherId){
                                voucherId.push(_that.tableList[i].voucherId);
                                voucherIds.push(_that.tableList[i].voucherId);
                            }else {
                                voucherId.push(0);
                            }
                        }
                    }
                }
                console.log("voucherIds" ,voucherIds)
                if(!voucherIds.length){
                    _that.$Message.info({
                        content: "已选择的单据未生成凭证",
                        duration: 3
                    });
                    return;
                }
            }else {
                voucherId = ids;
            }
            var _url = baseURL + 'voucherController/deleteMechanismVoucherBatch'
            $.ajax({
                type: 'post',
                async: false,
                url: _url,
                data: {'ids': voucherId},
                success: function (json) {
                    var _text = '';
                    if (json.code === '100100') {
                        _that.isNotToDelete= false;
                        if (type === 1){
                            //调用按单生成凭证
                            if(json.data.failCount == 0){
                                _that.singleGenerationCertificate();
                            }else {
                                _that.$Message.info({
                                    content: "选择的凭证中存在已经审核的或过账的凭证",
                                    duration: 3
                                });
                            }
                        }else if(type === 2){
                            //调用汇总生成凭证
                            if(json.data.failCount == 0) {
                                _that.summaryGenerationCertificate();
                            }else {
                                _that.$Message.info({
                                    content: "选择的凭证中存在已经审核的或过账的凭证",
                                    duration: 3
                                });
                            }
                        }else {
                            //点击删除按钮时的展示删除日志
                            _that.showVoucher(true);
                            _that.voucherModelTxt = json.data.resultData;
                            _that.viewReportTxt = json.data.detailResult;
                        }
                    } else {
                        _text = json.msg;
                        _that.$Message.info({
                            content: _text,
                            duration: 3
                        });
                    }
                }
            });
        },
        //审核凭证
        auditingVoucher(type){
            var _that = this;
            var voucherId = [];
            var voucherIds = [];
                for(var i = 0;i<_that.dataList.length;i++){
                    for(var j = 0;j<_that.selected.length;j++){
                        if(_that.tableList[i].id === _that.selected[j]){
                            console.log("_that.tableList[i].voucherId",_that.tableList[i])
                            if(_that.tableList[i].voucherId == '0' || _that.tableList[i].voucherId == ''){
                                voucherId.push(0);
                            }else {
                                voucherId.push(_that.tableList[i].voucherId);
                                voucherIds.push(_that.tableList[i].voucherId);
                            }
                        }
                    }
                }
                //如果均未生成凭证则告知用户即可 无需请求接口
                console.log("voucherIds",voucherIds)
                if(!voucherIds.length){
                    _that.$Message.info({
                        content: "已选择的单据未生成凭证",
                        duration: 3
                    });
                    return;
                }
            console.log(voucherId,"voucherId")
            $.ajax({
                type: 'post',
                data: {'ids':voucherId,'type':type},
                url: contextPath+"/voucherController/approvalBatch",
                dataType: 'json',
                success: function(res){
                    if (res.code === '100100'){
                        _that.showVoucher(true);
                        _that.voucherModelTxt = res.data.resultData;
                        _that.viewReportTxt = res.data.detailResult;
                    }
                },
                error: function(code){
                    console.log(code);
                    var _text = '';
                    _that.$Message.error(type == 1? "审核凭证失败":"反审核凭证失败");
                }
            });

        },
        creatVoucher () {
            this.voucherVisible = true;
        },
        goPathBook () {
            var _h = `${contextPath}/finance/FixedAssets/FixedAssetsCertificateOrderBook/index.html`;
            var _p = {
                'name': '固定资产凭证',
                'url': _h
            }
            window.parent.activeEvent(_p);
        },
        //打印
        printV () {
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var _dataList = [];
            for (var i = 0;i<that.dataList.length;i++){
                var test = {
                    'enterAccountDate': (new Date(that.dataList[i].enterAccountDate)).format("yyyy-MM-dd"),
                    'voucherWord' : that.dataList[i].voucherWord,
                    'voucherAudit' : that.dataList[i].voucherAudit,
                    'voucherPosting' : that.dataList[i].voucherPosting,
                    'assetCode' : that.dataList[i].assetCode,
                    'assetName' : that.dataList[i].assetName,
                    'alterTypeName':'',
                    'changeType':'',
                    'buyOrgVal1':'',
                    'buyOrgVal2':'',
                    'deprService1':'',
                    'deprService2':'',
                    'devalPreparation1':'',
                    'devalPreparation2':'',
                    'salvageIncome':'',
                    'deductionAmount':'',
                    'clearAmount':''
                };
                if (that.dataList[i].changeType == 1){
                    test.changeType = '新增';
                }else if(that.dataList[i].changeType == 2){
                    test.changeType = '变动';
                }else if(that.dataList[i].changeType == 3){
                    test.changeType = '清理';
                }
                test.alterTypeName = that.dataList[i].alterTypeName;
                if(that.dataList[i].buyOrgVal > 0){
                    test.buyOrgVal1 = that.dataList[i].buyOrgVal ? that.formartMoney(that.dataList[i].buyOrgVal) : '' ;
                    test.buyOrgVal2 = '';
                }else {
                    test.buyOrgVal1 = '';
                    test.buyOrgVal2 = -that.dataList[i].buyOrgVal ? that.formartMoney(-that.dataList[i].buyOrgVal) : '';
                }
                if(that.dataList[i].buyOrgVal > 0){
                    test.deprService1 = that.dataList[i].deprService ? that.formartMoney(that.dataList[i].deprService) : '';
                    test.deprService2 = '';
                }else {
                    test.deprService1 = '';
                    test.deprService2 = -that.dataList[i].deprService ? that.formartMoney(-that.dataList[i].deprService) : '';
                }
                if(that.dataList[i].buyOrgVal > 0){
                    test.devalPreparation1 = that.dataList[i].devalPreparation ? that.formartMoney(that.dataList[i].devalPreparation) : '';
                    test.devalPreparation2 = '';
                }else {
                    test.devalPreparation1 = '';
                    test.devalPreparation2 = -that.dataList[i].devalPreparation ? that.formartMoney(-that.dataList[i].devalPreparation) : '';
                }
                test.salvageIncome = that.dataList[i].salvageIncome ? that.formartMoney(that.dataList[i].salvageIncome) : '' ;
                test.deductionAmount = that.dataList[i].deductionAmount ? that.formartMoney(that.dataList[i].deductionAmount) : '';
                test.clearAmount = that.dataList[i].clearAmount ? that.formartMoney(that.dataList[i].clearAmount) : '';
                _dataList[i] = Object.assign(test,_dataList[i]) ;
            }
            var _info = {
                'title': '固定资产生成凭证',  // 标题
                'template': 1,  // 模板
                'totalRow':false, //false不显示合计
                'titleInfo': [       // title
                    // { 'name': '科目', 'val': that.baseData.subjectName },
                    // { 'name': '币别', 'val': that.baseData.currencyName }
                ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '日期', 'col': 'enterAccountDate' },
                    { 'name': '凭证字号', 'col': 'voucherWord' },
                    { 'name': '凭证审核', 'col': 'voucherAudit' },
                    { 'name': '记账标志', 'col': 'voucherPosting' },
                    { 'name': '资产编码', 'col': 'assetCode' },
                    { 'name': '资产名称', 'col': 'assetName' },
                    { 'name': '事务类型', 'col': 'changeType'},
                    { 'name': '变动方式', 'col': 'alterTypeName'},
                    { 'name': '原值增加', 'col': 'buyOrgVal1'},
                    { 'name': '原值减少', 'col': 'buyOrgVal2' },
                    { 'name': '累计折旧增加', 'col': 'deprService1' },
                    { 'name': '累计折旧减少', 'col': 'deprService2' },
                    { 'name': '减值准备增加', 'col': 'devalPreparation1' },
                    { 'name': '减值准备减少', 'col': 'devalPreparation2' },
                    { 'name': '残值收入', 'col': 'salvageIncome' },
                    { 'name': '可抵扣税额', 'col': 'deductionAmount' },
                    { 'name': '清理费用', 'col': 'clearAmount' },
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': _dataList,  // 打印数据  list
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        //引出
        exportExcel () {
            var _that = this;
            let data = _that.filterBody;
            let _url = contextPath + "/fixedAssetsVoucher/leadToExcel?sobId=" + data.sobId + "&accountYear=" + data.accountYear +
                "&accountPeriod=" + data.accountPeriod + "&changeType=" + data.changeType + "&certificateStatus=" + data.certificateStatus +
                "&audited=" + data.audited;
            window.open(_url);
        },
        //退出
        exitPrevent () {
            //退出,关闭当前页签
            var name = '固定资产生成凭证';
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            var that = this;
            switch (that.subjectTpye) {
                case 1:
                    that.voucherFilter.residualIncomeSubjectId = treeNode.id;
                    that.residualIncomeSubjectName = treeNode.subjectName+'|'+treeNode.subjectCode;
                    break;
                case 2:
                    that.voucherFilter.clearingExpenseSubjectId = treeNode.id;
                    that.clearingExpenseSubjectName = treeNode.subjectName+'|'+treeNode.subjectCode;
                    break;
                case 3:
                    that.voucherFilter.impairmentPreparationSubjectId = treeNode.id;
                    that.impairmentPreparationSubjectName = treeNode.subjectName+'|'+treeNode.subjectCode;
                    break;
                default:
                    break;
            }
            this.subjectClose();
        },
    },
    computed: {

    },
    watch: {
    }
})