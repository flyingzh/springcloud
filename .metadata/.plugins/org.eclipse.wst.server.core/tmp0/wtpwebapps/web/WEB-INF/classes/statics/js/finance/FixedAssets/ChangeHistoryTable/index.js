var _vm = new Vue({
    el: '#changeHistoryTable',
    data () {
        return {
            currencyType: "",
            formData: {
                currencyType: '1',
                currencyName: '',
                dateStr: '',
                dateType: '1',
                assetName:'', //资产名称
                useType:'',   //经济用途
                locationId:0,   //存放地点id
                sDate: '',
                eDate: '',
                date1: '',
                date2: '',
                isStatus: true,
                isDetailSubject: true,
                isSmallPlan: false,
                isTotal: false,
                openTime: '',
                assetsName: '',
            },
            filterCard:{
                startAccountYear: 0,
                startAccountPeriod: 0,
                endAccountYear: 0,
                endAccountPeriod: 0,
                sobId:layui.data('user').userCurrentOrganId, //组织Id
                assetTypeId:0, //资产类别Id
                assetCode:null,   //资产编码
                useStateId:0, //使用状态ID
                deptId:0,      //使用部门Id
                alterTypeId:0, //变动方式Id
            },
            assetCodeHtml:null,   //资产编码
            assetCodeNameHtml:'',   //资产编码
            filterCodeList:[],    //过滤条件下的code集合
            assetTypeName:'',     //资产类别名
            useStateName:'',       //使用状态名
            alterTypeName:'',     //变动名
            deptName:'',          //部门名称
            accountYearList: [],   //年度List
            accountPeriodList: [], //期间List
            sysStartYear:0,       //系统启用年
            sysStartPeriod:0,     //系统启用期间
            currenAccountYear:0,       //系统当前年
            currenAccountPeriod:0,     //系统当前期间
            startYearPeriodList:[],   //选择启用年度时 启用年!=当前年 可选期间
            endYearPeriodList:[],     //选择当前年度时 可选期间
            periodList: [],           //除开始年度,当前年度可用的全年12期 期间
            startEndPeriodList: [],   //启用年 = 当前期间年
            startPeriodList:[],
            endPeriodList:[],
            economicUseList:[],    //经济用途
            locationList: [],       //存放地点
            FixedAssetsList:[],    //固定资产列表
            periodYear:[],
            currenPage:0,
            homeIsDisabled:true,
            upIsDisabled:true,
            nextIsDisabled:true,
            endIsDisabled: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/faClearChange/getChangeHistoryStatementList',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                postData: JSON.stringify(this.filterCard),
                jsonReader: {
                    root: "data",
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
            organisationList: [
                { label: "金大祥", value: 1 },
                { label: "金大祥1", value: 2 },
                { label: "金大祥2", value: 3 },
            ],
            baseData: {
                standardCurrencyId: 1,
            },
            printModal: false,
            printInfo: {},
            dataList: [],
            organizationList: [],
            showChangeMethod: false,
            showAssetType: false,
            showUseState: false,
            showAlterType: false,
            showDepartment: false,
            filterVisible:true,
            showAll: false,
            treeUrl: "",
            assetsClassTreeSetting: {//资产类别
                callback: {
                    onClick: this.assetsClassTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            useStateTreeSetting: {//使用状态
                callback: {
                    onClick: this.useStateTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            changeMethodTreeSetting: {//变动方式
                callback: {
                    onClick: this.changeMethodTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            departmentTreeSetting: {//使用部门
                callback: {
                    onClick: this.departmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            showAssetsList: false,
            selectAssets: ''
        }
    },
    created: function () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
        this.economicUseList = getCodeList("fixedAssets_economicUse");
        this.listLocation();
        _vm.initDataFilter();
    },
    mounted () {
        // this.initData();
        this.initMethod();
    },
    methods: {
        //分页
        paging(value){
            let that = this;
            let size = that.filterCodeList.length;
            switch (value){
                case 'homePage': //首页
                    that.filterCard.assetCode = that.filterCodeList[0];
                    if(size>1){ //控制分页按钮
                        that.homeIsDisabled=true;
                        that.upIsDisabled=true;
                        that.nextIsDisabled=false;
                        that.endIsDisabled=false;
                    }
                    break;
                case 'upPage': //上一页
                   let upCurrenPage = that.currenPage - 1;
                    if(upCurrenPage>=0){
                        that.currenPage = upCurrenPage;
                        that.filterCard.assetCode = that.filterCodeList[upCurrenPage];
                        if(upCurrenPage==0){
                            that.homeIsDisabled = true;
                            that.upIsDisabled = true;
                            that.nextIsDisabled = false;
                            that.endIsDisabled = false;
                        }else {
                            that.homeIsDisabled = false;
                            that.upIsDisabled = false;
                            that.nextIsDisabled = false;
                            that.endIsDisabled = false;
                        }
                    }
                    break;
                case 'nextPage': //下一页
                    let nextCurrenPage = that.currenPage + 1;
                    if(nextCurrenPage<=size-1){
                        that.currenPage = nextCurrenPage;
                        that.filterCard.assetCode = that.filterCodeList[nextCurrenPage];
                        if(nextCurrenPage==size-1){
                            that.homeIsDisabled = false;
                            that.upIsDisabled = false;
                            that.nextIsDisabled = true;
                            that.endIsDisabled = true;
                        }else {
                            that.homeIsDisabled=false;
                            that.upIsDisabled=false;
                            that.nextIsDisabled=false;
                            that.endIsDisabled=false;
                        }
                    }
                    break;
                case 'endPage'://尾页
                    if(size>0){
                        let endCurrenPage = size-1;
                        that.filterCard.assetCode = that.filterCodeList[endCurrenPage];
                        that.currenPage = endCurrenPage;
                        //控制分页按钮
                        that.homeIsDisabled=false;
                        that.upIsDisabled=false;
                        that.nextIsDisabled=true;
                        that.endIsDisabled=true;
                    }
                    break;
            }
            this.base_config.postData = JSON.stringify(this.filterCard);
            this.initMethod();
        },
        //获取codelist
        getFilterCodeList(){
            let that = this;
            that.filterCard.assetCode = that.assetCodeHtml;
            $.ajax({
                type:'POST',
                async:false,
                url:contextPath + '/faClearChange/getChangeHistoryStatementCodeList',
                data:JSON.stringify(that.filterCard),
                contentType:'application/json;charset=utf-8',
                success: function (res){
                    if (res.code=='100100'){
                        that.filterCodeList = res.data ;
                        that.filterCard.assetCode = that.filterCodeList[0];
                    }
                },
                error:{

                }
            })
        },
        //初始化时间
        initDataFilter(){
            this.getOrgList();
            this.initFilterYearPeriod();
        },
        //获取组织列表
        getOrgList () {
            var that = this;
            $.ajax({
                url: contextPath + "/bankdepositstatement/getognlist",
                type: "post",
                success: function (data) {
                    that.organizationList = data.data;
                }
            });
        },
        //初始化过滤时间
        initFilterYearPeriod(){
            var that = this;
            $.ajax({
                url: contextPath + "/faClearChange/filterDate",
                type: "post",
                success: function (res) {
                    if (res.code=='100100'){
                        that.accountYearList = res.data.yearList;
                        //除开始年度,当前年度可用的全年12期 期间
                        that.accountPeriodList = res.data.periodList;
                        that.periodList = res.data.periodList;
                        //选择启用年度时 可选期间
                        that.startYearPeriodList = res.data.startYearPeriodList;
                        //选择当前年度时 可选期间
                        that.endYearPeriodList = res.data.endYearPeriodList;
                        //启用年 = 当前期间年
                        that.startEndPeriodList = res.data.startEndPeriodList;
                        that.sysStartYear = res.data.startSysYear;
                        that.sysStartPeriod = res.data.startSysPeriod;
                        that.filterCard.startAccountYear = that.filterCard.endAccountYear = that.currenAccountYear = res.data.currenAccountYear;
                        that.filterCard.startAccountPeriod =  that.filterCard.endAccountPeriod = that.currenAccountPeriod = res.data.currenAccountPeriod;
                        that.selectStartPeriod(that.filterCard.startAccountYear);
                        that.selectEndPeriod(that.filterCard.startAccountYear);
                    }
                }
            });
        },
        //查询经济用途列表
        listEconomyUse () {
            this.economyUseList = getCodeList("fixedAssets_economicUse");
            // this.filter.useType = this.economyUseList[0].mark;
        },
        //查询存放地点列表
        listLocation () {
            var that = this;
            $.ajax({
                url: contextPath + "/falocation/initTree",
                type: "post",
                success: function (data) {
                    that.locationList = data.data;
                }
            })
        },
        //资产列表弹窗
        onAssets() {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            this.showAssetsList = true;
        },
        //资产类别
        assetsClassTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filterCard.assetTypeId = treeNode.id;
            this.assetTypeName = treeNode.name;
            this.showAssetType = false;
        },
        //使用状态
        useStateTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filterCard.useStateId = treeNode.id;
            this.useStateName = treeNode.name;
            this.showUseState = false;
        },
        //变动方式
        changeMethodTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filterCard.alterTypeId = treeNode.id;
            this.alterTypeName = treeNode.name;
            this.showAlterType = false;
        },
        //使用部门
        departmentTreeClickCallBack(event, treeId, treeNode){
            console.log(treeNode);
            this.filterCard.deptId = treeNode.id;
            this.deptName = treeNode.name;
            this.showDepartment = false;
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        //关闭资产列表弹窗
        closeAssets() {
            // this.card.AssetsId = this.selectAssets.id;
            this.assetCodeHtml = this.filterCard.assetCode = this.selectAssets.assetCode;
            this.showAssetsList = false;
            console.log("assetsName:" + this.selectAssets);
        },
        showTrees(value, which, index) {
            // this.idx = index;
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showUseState':
                    if (this.showUseState === true) {
                        this.showUseState = false;
                        return;
                    }
                    this.showUseState = value;
                    break;
                case 'showAlterType':
                    if (this.showAlterType === true) {
                        this.showAlterType = false;
                        return;
                    }
                    this.showAlterType = value;
                    break;
                case 'showDepartment':
                    if (this.showDepartment == true) {
                        this.showDepartment = false;
                        return;
                    }
                    this.showDepartment = value;
                    break;
            }
        },
        getLastDay(y, m) {//根据年月获取当月最后一天
            var dt = new Date(y, m, 1);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            return cdt.getFullYear() + "-" + (Number(cdt.getMonth()) + 1) + "-" + cdt.getDate();
        },
        operateDate(date) {
            return new Date(date).format("yyyy-MM-dd");
        },

        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        //表字段
        setTableHeader () {
            // var currencyType = this.formData.currencyType;
            this.colNames = ['变动日期', '变动原因', '凭证字号', '资产编号', '资产名称', '资产类别', '型号', '变动方式', '制造商', '产地', '供应商', '使用日期', '使用状态',
                '使用部门','经济用途','折旧方法','存放地点','原值','原值变动','累计折旧','折旧调整','净值','减值准备变动','净额','使用寿命','剩余寿命'];
            this.colModel = [
                { name: 'enterAccountDate', width: 100, frozen: true,
                    formatter: function (value, grid, rows, state) {
                        return (value || '').slice(0, 10)
                    }
                },
                { name: 'remark', width: 150, frozen: true },
                { name: 'voucherFontSize', width: 80, frozen: true },
                { name: 'assetCode', width: 150, },
                { name: 'assetName', width: 150 },
                { name: 'className', width: 120, },
                { name: 'model', width: 120, },
                { name: 'modeName', width: 120, },
                { name: 'manufacturer', width: 120, },
                { name: 'originPlace', width: 120, },
                { name: 'supplierName', width: 120, },
                { name: 'beginUsedate', width: 120,
                    formatter: function (value, grid, rows, state) {
                        return (value || '').slice(0, 10)
                    }
                },
                { name: 'useStateName', width: 120 },
                { name: 'useDeptName', width: 120 },
                { name: 'useTypeName', width: 120 },
                { name: 'deprMethodName', width: 120 },
                { name: 'locationName', width: 120 },
                { name: 'totalVal', width: 120 },
                { name: 'orgValAdjust', width: 120 },
                { name: 'deprService', width: 120 },
                { name: 'deprServiceAdjust', width: 120 },
                { name: 'netValue', width: 120 },
                { name: 'devalPreparation', width: 120 },
                { name: 'netAmount', width: 120 },
                { name: 'expectUsePeriods', width: 120 },
                { name: 'residualLife', width: 120 }
            ];
            this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper_test"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                loadComplete: function (res) {
                    _vm.dataList = res.data || [];
                    console.log("111111:",res.data);
                    let dataList = res.data || [];
                    let card = dataList[0];
                    if(card!=null){
                         _vm.assetCodeNameHtml = '-- ['+card.assetCode+']'+card.assetName;
                    }
                },
                gridComplete: function () {
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            $("#grid").jqGrid('setGridParam', { postData: this.formData }).trigger("reloadGrid");
        },
        save () {
            let startYear= this.filterCard.startAccountYear ;
            let startPeriod = this.filterCard.startAccountPeriod;
            let endYear = this.filterCard.endAccountYear ;
            let endPeriod = this.filterCard.endAccountPeriod;
            if(startYear!=null && startPeriod ==null ){
                layer.alert('已选择起始会计年度,起始期间数不能为空');
                return false;
            }
            if(startYear!=null && startPeriod !=null&& endYear !=null && endPeriod==null  ){
                layer.alert('已选择截止会计年度,截止期间数不能为空');
                return false;
            }
            this.filterVisible = false;
            let filterStr1 = this.filterCard.startAccountYear+'年'+this.filterCard.startAccountPeriod+'期';
            if (endYear!=null){
                 filterStr1 = filterStr1+' 至 '+this.filterCard.endAccountYear+'年'+this.filterCard.endAccountPeriod+'期';
            }
            this.formData.dateStr = filterStr1;
            //先查询分页范围内的codeList
            this.getFilterCodeList();
            let size = this.filterCodeList.length;
            if(size>1){ //控制分页按钮
                this.homeIsDisabled=true;
                this.upIsDisabled=true;
                this.nextIsDisabled=false;
                this.endIsDisabled=false;
            }
            //加载grid
            this.base_config.url = contextPath + '/faClearChange/getChangeHistoryStatementList';
            this.base_config.postData = JSON.stringify(this.filterCard);
            this.initMethod();
        },
        cancel () {
            this.filterVisible = false;
        },
        exportExcel () {
            let _this = this;
            window.open(contextPath + '/app/cashPositionTable/exportExcel?currencyType=' + _this.currencyType + '&dateStr=' + _this.formData.dateStr, '数据引出');
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '资金头寸表', openTime: this.openTime, exit: true })
        },
        print () {  //打印
            let that = this;
            var _info;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var currencyType = that.formData.currencyType;
            if (currencyType == '1') {  //原币
                //单行表头
                _info = {
                    'title': '资金头寸表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目代码', 'col': 'accountCode' },
                        { 'name': '科目名称', 'col': 'accountName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '银行名称', 'col': 'bankName' },
                        { 'name': '银行账号', 'col': 'bankAccount' },
                        { 'name': '期初余额', 'col': 'initBalanceFor' },
                        { 'name': '借方发生额', 'col': 'debitAmountFor' },
                        { 'name': '贷方发生额', 'col': 'creditAmountFor' },
                        { 'name': '期末余额', 'col': 'endBalanceFor' },
                        { 'name': '借方笔数', 'col': 'debitNumber' },
                        { 'name': '贷方笔数', 'col': 'creditNumber' },
                        { 'name': '启用', 'col': 'statusName' },
                        { 'name': '科目类别', 'col': 'isCashName' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 13,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                    'totalRow': false
                }
            }

            if (currencyType == '2') {  //本位币
                //单行表头
                _info = {
                    'title': '资金头寸表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目代码', 'col': 'accountCode' },
                        { 'name': '科目名称', 'col': 'accountName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '银行名称', 'col': 'bankName' },
                        { 'name': '银行账号', 'col': 'bankAccount' },
                        { 'name': '期初余额', 'col': 'initBalance' },
                        { 'name': '借方发生额', 'col': 'debitAmount' },
                        { 'name': '贷方发生额', 'col': 'creditAmount' },
                        { 'name': '期末余额', 'col': 'endBalance' },
                        { 'name': '借方笔数', 'col': 'debitNumber' },
                        { 'name': '贷方笔数', 'col': 'creditNumber' },
                        { 'name': '启用', 'col': 'statusName' },
                        { 'name': '科目类别', 'col': 'isCashName' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 13,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                    'totalRow': false
                }
            }
            if (currencyType == '3') { //原币和本位币
                //固定多表头 // 多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">科目代码</th>
                        <th rowspan="2" style="width: 6%">科目名称</th>
                        <th rowspan="2" style="width: 6%">币别</th>
                        <th rowspan="2" style="width: 6%">银行名称</th>
                         <th rowspan="2" style="width: 6%">银行账号</th>
                        <th colspan="2" style="width: 12%">期初余额</th>
                        <th colspan="2" style="width: 12%">借方发生额</th>
                         <th colspan="2" style="width: 12%">贷方发生额</th>
                        <th colspan="2" style="width: 12%">期末余额</th>
                        <th rowspan="2" style="width: 6%">借方笔数</th>
                        <th rowspan="2" style="width: 6%">贷方笔数</th>
                        <th rowspan="2" style="width: 6%">启用</th>
                        <th rowspan="2" style="width: 6%">科目类别</th>
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
                        <td>${that.nullValue(row.accountCode)}</td>
                        <td>${that.nullValue(row.accountName)}</td>
                        <td>${that.nullValue(row.currencyName)}</td>
                        <td>${that.nullValue(row.bankName)}</td>
                        <td>${that.nullValue(row.bankAccount)}</td>
                        <td>${that.nullValue(row.initBalanceFor)}</td>
                         <td>${that.nullValue(row.initBalance)}</td>
                        <td>${that.nullValue(row.debitAmountFor)}</td>
                        <td>${that.nullValue(row.debitAmount)}</td>
                        <td>${that.nullValue(row.creditAmountFor)}</td>
                         <td>${that.nullValue(row.creditAmount)}</td>
                          <td>${that.nullValue(row.endBalanceFor)}</td>
                           <td>${that.nullValue(row.endBalance)}</td>
                            <td>${that.nullValue(row.debitNumber)}</td>
                             <td>${that.nullValue(row.creditNumber)}</td>
                             <td>${that.nullValue(row.statusName)}</td>
                             <td>${that.nullValue(row.isCashName)}</td>
                        </tr>
                    `;
                });
                var data = {
                    title: "资金头寸表",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colMaxLenght': 25,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
                return;
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        nullValue (exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        },
        startYearMethod(value){
            
            // let newValue = this.filterCard.startAccountYear;
            this.filterCard.startAccountPeriod = null;
            this.startPeriodList = null;
            this.$refs.sel2.reset();
            this.$refs.sel3.reset();
            this.$refs.sel4.reset();
            this.selectStartPeriod(value);
        },
        selectStartPeriod(newValue){
            if(newValue==this.sysStartYear && this.currenAccountYear!=this.sysStartYear){
                //选择为启用年 当前年!=启用年
                this.startPeriodList= this.startYearPeriodList;
            }else if(newValue==this.sysStartYear && this.currenAccountYear==this.sysStartYear){
                //选择为启用年 当前年=启用年
                this.startPeriodList= this.startEndPeriodList;
            }else if(newValue==this.currenAccountYear && this.currenAccountYear!=this.sysStartYear){
                //选择为当前年 当前年!=启用年
                this.startPeriodList= this.endYearPeriodList;
            }else {
                //除开始年度,当前年度之间年 可用的全年12期 期间
                this.startPeriodList= this.periodList;
            }
        },
        startPeriodMethod(value){
            let startYear= this.filterCard.startAccountYear ;
            let startPeriod = this.filterCard.startAccountPeriod;
            this.filterCard.endAccountYear = startYear ;
            this.filterCard.endAccountPeriod = startPeriod ;
            // let endYear = this.filterCard.endAccountYear ;
            // let endPeriod = this.filterCard.endAccountPeriod;
            // if(startYear>endYear || (startYear==endYear && startPeriod>endPeriod)){
            //     //截止期间不能小于起始期间
            //     layer.alert('截止期间不能小于起始期间');
            //     return false;
            // }
            // this.$refs.sel3.reset();
            // this.$refs.sel4.reset();
        },
        endYearMethod(value){
            // let newValue = this.filterCard.endAccountYear;
            if(this.filterCard.startAccountYear>this.filterCard.endAccountYear){
                //截止年不能小于起始年
                this.whetherFilter = false
                layer.alert('截止年不能小于起始年');
                this.$refs.sel3.reset();
                this.$refs.sel4.reset();
                return false;
            }
            this.filterCard.endAccountPeriod = null;
            this.endPeriodList= null;
            this.$refs.sel4.reset();
            this.selectEndPeriod(value);
        },
        selectEndPeriod(newValue){
            if(newValue==this.sysStartYear && this.currenAccountYear!=this.sysStartYear){
                //选择为启用年 当前年!=启用年
                this.endPeriodList= this.startYearPeriodList;
            }else if(newValue==this.sysStartYear && this.currenAccountYear==this.sysStartYear){
                //选择为启用年 当前年=启用年
                this.endPeriodList= this.startEndPeriodList;
            }else if(newValue==this.currenAccountYear && this.currenAccountYear!=this.sysStartYear){
                //选择为当前年 当前年!=启用年
                this.endPeriodList= this.endYearPeriodList;
            }else {
                //除开始年度,当前年度之间年 可用的全年12期 期间
                this.endPeriodList= this.periodList;
            }
        },
        endPeriodMethod(newVal,oldVal){

            let startYear= this.filterCard.startAccountYear ;
            let startPeriod = this.filterCard.startAccountPeriod;
            let endYear = this.filterCard.endAccountYear ;
            let endPeriod = this.filterCard.endAccountPeriod;
            if(startYear>endYear || (startYear==endYear && startPeriod>endPeriod)){
                //截止期间不能小于起始期间
                layer.alert('截止期间不能小于起始期间');
                this.$refs.sel4.reset();
                return false;
            }

        },
        _clearUser() {
            // this.$refs.sel1.reset();
            this.$refs.sel2.reset();
            // this.$refs.sel3.reset();
            this.$refs.sel4.reset();
        },
    },
    watch:{
        assetTypeName(newValue,oldValue) {
            if (newValue=='' || newValue==0){
                this.filterCard.assetTypeId = 0;
            }
        },
        useStateName(newValue,oldValue) {
            if (newValue=='' || newValue==0){
                this.filterCard.useStateId = 0;
            }
        },
        alterTypeName(newValue,oldValue) {
            if (newValue=='' || newValue==0){
                this.filterCard.alterTypeId = 0;
            }
        },
        deptName(newValue,oldValue) {
            if (newValue=='' || newValue==0){
                this.filterCard.deptId = 0;
            }
        }
    }
})