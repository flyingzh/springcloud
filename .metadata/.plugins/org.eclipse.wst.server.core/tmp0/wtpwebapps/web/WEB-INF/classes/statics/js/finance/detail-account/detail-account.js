new Vue({
    el: '#detail-account',
    data() {
        return {
            visible_filter: false,
            subjectVisiable: false,
            subjectEnd: false,
            jump:false,
            openTime:'',
            standardCurrencyId:'',
            search: {
                currency: '-1',
                yearStart: '',
                yearEnd: '',
                subjectPeriodStart: '',
                subjectPeriodEnd: '',
                continuous:'iscontinuous',
                subjectLevelStart: '',
                subjectLevelEnd: '',
                subjectCodeStart: '',
                subjectCodeEnd: '',
                showDisable: false,
                showUnposted: false,
                noShowAndHappen: false,
                noShowAndHappenZero: false,
                showOpposite: false,
                showDetailOnly:false,
                showOppositeAccountItem:false,
                showNoOccurencePeriod:false,
                showOppositeMultiple:false,
                sobId:1,
                preSubject:'',
                nextSubject:'',
                curIndex:'-1',
                subjectCode:''
            },
            years: [],
            currencyList:[],
            subjectList: [
                {name: '第一期', value: 1},
                {name: '第二期', value: 2},
                {name: '第三期', value: 3},
                {name: '第四期', value: 4},
                {name: '第五期', value: 5},
                {name: '第六期', value: 6},
                {name: '第七期', value: 7},
                {name: '第八期', value: 8},
                {name: '第九期', value: 9},
                {name: '第十期', value: 10},
                {name: '第十一期', value: 11},
                {name: '第十二期', value: 12}
            ],
            subjectLevelList: [
                {name: '1', value: 4},
                {name: '2', value: 5},
                {name: '3', value: 6},
                {name: '4', value: 7},
                {name: '5', value: 8},
                {name: '6', value: 9},
                {name: '7', value: 10},
                {name: '8', value: 11},
                {name: '9', value: 12}
            ],
            dataList:[],
            printModal: false,
            printInfo: {},
            subjectName:'',
            subjectCode:'',
            base_config: {
                url: contextPath+'/bookInquiryController/detailAccount',
                datatype: "json",
                rowNum: '99999999',//一页显示多少条
                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                // rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
                // pager : '#pager2',//表格页脚的占位符(一般是div)的id
                // sortname: 'orderDate',//初始化的时候排序的字段
                sortorder: "desc",//排序方式,可选desc,asc
                mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                jsonReader: {
                    root: "data.list",
                },
                styleUI: 'Bootstrap',
                height: $(window).height() -120,
                // scroll:true,
                // width: window.screen.availWidth - 20,
                viewrecords: true,
                // pager: '#pager',
                // caption: "明细账",//表格的标题名字
            },
            colNames1: [],
            colModel1: [],
            tableHeader: [],
            url: '',
        }
    },
    methods: {
        preSubject(){

            let preIndex = parseInt(this.search.curIndex)-1;
            if(preIndex<0){
                this.$Message.error('没有上一科目了');
                // alert('没有上一科目了')
                return false;
            }
            this.search.curIndex = preIndex;
            this.refreshData();
        },
        nextSubject(){
            let nextIndex = parseInt(this.search.curIndex)+1;
            this.search.curIndex = nextIndex;
            this.refreshData();
        },
        refreshData(){
            let _m = this;
            console.log(_m.search)
            $("#list").jqGrid("setGridParam", {
                mtype: 'POST',
                postData: JSON.stringify(_m.search),
                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                dataType: 'json',
            }).trigger("reloadGrid");
        },
        clearData(){
            this.search = {
                currency: '',
                yearStart: '',
                yearEnd: '',
                subjectPeriodStart: '',
                subjectPeriodEnd: '',
                continuous:'iscontinuous',
                subjectLevelStart: '',
                subjectLevelEnd: '',
                subjectCodeStart: '',
                subjectCodeEnd: '',
                showDisable: false,
                showUnposted: false,
                noShowAndHappen: false,
                noShowAndHappenZero: false,
                showOpposite: false,
                showDetailOnly:false,
                showOppositeAccountItem:false,
                showNoOccurencePeriod:false,
                showOppositeMultiple:false,
                sobId:1,
                preSubject:'',
                nextSubject:'',
                curIndex:'-1',
                subjectCode:''
            }
        },
        jumpDetail(){
            this.jump = true;
            this.subjectVisiable = true;
        },
        exitDetail(){
            //关闭当前页签
            var name = '总分类账';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        handleOpen() {
            this.visible_filter = true;
        },
        //点击保存，获取所选科目id
        subjectDate(res) {
            if(this.jump){
                this.jump = false;
                this.clearData();
                this.search.subjectCode=res.subjectCode;
                this.refreshData();
                return false;
            }
            if(!this.subjectEnd){
                this.search.subjectCodeStart = res.subjectCode;
            }else {
                this.search.subjectCodeEnd = res.subjectCode;
            }
            console.log(res);
        },
        showVoucher(){
            let rowid = jQuery("#list").jqGrid("getGridParam", "selrow");
            if(rowid == null){
                this.$Message.info('请选择一条明细')
                // alert('请选择一条明细')
                return false;
            }
            var rowData = jQuery("#list").getRowData(rowid);  //1.获取选中行的数据
            if(rowData.voucherId != null && rowData.voucherId != 0){
                this.voucherDetail(rowData);
            }
            // window.open("../voucher-lrt/index.html?voucherId="+rowData.voucherId+"&sobId="+rowData.sobId+"");
            // window.location.href="../voucher-lrt/index.html?voucherId="+rowData.voucherId+"&sobId="+rowData.sobId+"";
        },
        showGeneralLedge(){
            let url = contextPath+"/finance/general-ledge/general-ledge.html?fromDetail=1" +
                "&subjectYearStart="+this.search.yearStart+"&subjectYearEnd="+this.search.yearEnd+
                "&subjectPeriodStart="+this.search.subjectPeriodStart+"&subjectPeriodEnd="+this.search.subjectPeriodEnd+
                "&subjectStart="+this.subjectCode+"&subjectEnd="+this.subjectCode+"&currencyId="+this.search.currency;
            console.log(url)
            window.parent.activeEvent({name: '总分类账', url: url, params: null});
        },
        sure(type) {
            this.visible_filter = false;
            let _vm = this;
            _vm.search.subjectCode = '';
            _vm.search.curIndex = '0';
            if(type === true){
                // 获取表单数据
                console.log(_vm.search)
                //如果选择了所有币别
                if(this.search.currency == '-1'){
                    console.log(this.search.currency)
                    _vm.pageInitType();
                }else if(this.search.currency == '-2'||this.search.currency == this.standardCurrencyId){
                    //默认
                    console.log(this.search.currency)
                    _vm.pageInit();
                }else if(this.search.currency > '1'){
                    //选择美币或者港币
                    console.log(this.search.currency)
                    _vm.pageInitForein();
                } else{
                    _vm.pageInit();
                }
                // 用于搜索
                let configment = {
                    postData : _vm.search
                }
                $("#list").jqGrid('setGridParam', configment).trigger("reloadGrid");

                /*$("#list").jqGrid("setGridParam", {
                    mtype: 'POST',
                    postData: JSON.stringify(_vm.search),
                    ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                    dataType: 'json',
                }).trigger("reloadGrid");*/
                /*this.$emit('save',this.chooseId)
                this.$emit('close')*/
            }else{
               //点击取消，清空所选值
               //  this.clearData();
            }
            
        },
        iconPopup(type) {
            console.log(type);
            this.subjectEnd = type == true ? true : false;
            this.subjectVisiable = true;
        },
        subjectClose() {
            this.subjectVisiable = false;
        },
        formartMoney (value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        initGrid(colname, colmodel, header) {
            let that = this;
            let config = Object.assign({}, this.base_config,{
                postData: JSON.stringify(that.search),
                colNames: colname,
                colModel: colmodel,
                gridComplete() {
                    jQuery("#list").jqGrid('destroyGroupHeader');
                    jQuery("#list").jqGrid('setGroupHeaders',{
                        useColSpanStyle: true,
                        groupHeaders: header
                    });
                },
                loadComplete:function (ret) {
                    console.log(ret)
                    if(ret.data!=null){
                        that.dataList = ret.data.list;
                        if(ret.data.entity!=null){
                            that.search.curIndex = ret.data.entity.curIndex;
                            if(ret.data.entity.subjectName!=null){
                                that.subjectName = ret.data.entity.subjectName;
                                that.subjectCode = ret.data.entity.subjectCode;
                                $(this).jqGrid("setCaption","科目："+ret.data.entity.subjectName);
                            }
                        }
                        if(ret.data.standardCurrencyId!=null&&ret.data.standardCurrencyId!=''){
                            that.standardCurrencyId = ret.data.standardCurrencyId;
                            // that.search.currency=ret.data.standardCurrencyId;
                        }
                    }else{
                        this.$Message.error(ret.msg)
                        // alert(ret.msg)
                    }
                }
            })
            jQuery("#list").jqGrid(config);
        },
        pageInit() {
            this.clearTable();
            let that = this;
            this.colNames1 =  ['日期', '凭证字号', '摘要', '借方', '贷方', '方向', '余额','voucherId','sobId'], this.colModel1 = [
                    { name: 'periodDate', width: 110, align: 'center' },
                    { name: 'voucherNumber', width: 70, align: 'left' ,formatter:function(value,options,rowData){
                        // let a = "<a href='../voucher-lrt/index.html?voucherId="+rowData.voucherId+"&sobId="+rowData.sobId+"' target='_blank'>"+value+"</a>";

                        $(document).off('click', '.voucher' + rowData.voucherId).on('click', '.voucher' + rowData.voucherId, function () {
                            that.voucherDetail(rowData);
                        });
                        let btn = `<a class="voucher${rowData.voucherId}">${value}</a>`;
                        return value === undefined ? "" : btn;

                        // return a;
                    }},
                    { name: 'summary', width: 180, align: 'left' },
                    { name: 'debitMoney', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                        return that.formartMoney(value);
                    }},
                    { name: 'creditMoney', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                        return that.formartMoney(value);
                    }},
                    { name: 'direction', width: 40, align: 'center' ,formatter:function(value,options,rowData){
                        if(value == 1){
                            return '借';
                        }else if(value == 2){
                            return '贷';
                        }else{
                            return '平';
                        }
                    }},
                    { name: 'balance', width: 100, align: 'right',formatter:function(value,options,rowData){
                        return that.formartMoney(value);;
                    }},
                    { name: 'voucherId', width: 10, align: 'center' ,hidden: true},
                    { name: 'sobId', width: 10, align: 'center' ,hidden: true}
                ]
            this.tableHeader = [];
            this.initGrid(this.colNames1, this.colModel1, this.tableHeader);
        },
        pageInitType() {
            this.clearTable();
            this.base_config.url = contextPath+'/bookInquiryController/detailAccount';
            let that = this;
            this.colNames1 = ['日期', '凭证字号', '摘要','币别', '原币', '本位币','原币', '本位币', '方向', '本位币','voucherId','sobId'];
            this.colModel1 = [
                { name: 'periodDate', width: 110, align: 'left' },
                { name: 'voucherNumber', width: 70, align: 'left' ,formatter:function(value,options,rowData){
                    // let a = "<a href='../voucher-lrt/index.html?voucherId="+rowData.voucherId+"&sobId="+rowData.sobId+"' target='_blank'>"+value+"</a>";
                    // return a;
                    $(document).off('click', '.voucher' + rowData.voucherId).on('click', '.voucher' + rowData.voucherId, function () {
                        that.voucherDetail(rowData);
                    });
                    let btn = `<a class="voucher${rowData.voucherId}">${value}</a>`;
                    return value === undefined ? "" : btn;
                }},
                { name: 'summary', width: 180, align: 'left' },
                { name: 'currencyNameValue', width: 70, align: 'left' },
                { name: 'debitMoney', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'debitAmountFor', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'creditMoney', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'creditAmountFor', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'direction', width: 40, align: 'center' ,formatter:function(value,options,rowData){
                    if(value == 1){
                        return '借';
                    }else if(value == 2){
                        return '贷';
                    }else{
                        return '平';
                    }
                }},
                { name: 'balance', width: 100, align: 'right',formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'voucherId', width: 10, align: 'center' ,hidden: true},
                { name: 'sobId', width: 10, align: 'center' ,hidden: true}
            ]
            this.tableHeader = [
                { startColumnName: 'debitMoney', numberOfColumns: 2, titleText: '借方金额'},
                { startColumnName: 'creditMoney', numberOfColumns: 2, titleText: '贷方金额'},
                { startColumnName: 'direction', numberOfColumns: 2, titleText: '余额'}
            ]
            this.initGrid(this.colNames1, this.colModel1, this.tableHeader)
        },
        pageInitForein() {
            this.clearTable();
            this.base_config.url = contextPath+'/bookInquiryController/detailAccount';
            let that = this;
            this.colNames1 = ['日期', '凭证字号', '摘要','币别', '原币', '本位币','原币', '本位币', '方向', '原币', '本位币','voucherId','sobId'];
            this.colModel1 = [
                { name: 'periodDate', width: 110, align: 'left' },
                { name: 'voucherNumber', width: 70, align: 'left' ,formatter:function(value,options,rowData){
                    // let a = "<a href='../voucher-lrt/index.html?voucherId="+rowData.voucherId+"&sobId="+rowData.sobId+"' target='_blank'>"+value+"</a>";
                    // return a;
                    $(document).off('click', '.voucher' + rowData.voucherId).on('click', '.voucher' + rowData.voucherId, function () {
                        that.voucherDetail(rowData);
                    });
                    let btn = `<a class="voucher${rowData.voucherId}">${value}</a>`;
                    return value === undefined ? "" : btn;
                }},
                { name: 'summary', width: 180, align: 'left' },
                { name: 'currencyNameValue', width: 70, align: 'left' },
                { name: 'debitMoney', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'debitAmountFor', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'creditMoney', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'creditAmountFor', width: 100, align: 'right' ,formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'direction', width: 40, align: 'center' ,formatter:function(value,options,rowData){
                    if(value == 1){
                        return '借';
                    }else if(value == 2){
                        return '贷';
                    }else{
                        return '平';
                    }
                }},
                { name: 'balanceFor', width: 100, align: 'right',formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'balance', width: 100, align: 'right',formatter:function(value,options,rowData){
                    return that.formartMoney(value);
                }},
                { name: 'voucherId', width: 10, align: 'center' ,hidden: true},
                { name: 'sobId', width: 10, align: 'center' ,hidden: true}
            ]
            this.tableHeader = [
                { startColumnName: 'debitMoney', numberOfColumns: 2, titleText: '借方金额'},
                { startColumnName: 'creditMoney', numberOfColumns: 2, titleText: '贷方金额'},
                { startColumnName: 'direction', numberOfColumns: 3, titleText: '余额'}
            ]
            this.initGrid(this.colNames1, this.colModel1, this.tableHeader)
        },
        printV(){
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            $.each(that.dataList, function (idx, ele) {
                if (ele.direction == '1') {
                    ele.direction = '借';
                } else if (ele.direction == '2') {
                    ele.direction =  '贷';
                } else {
                    ele.direction = '平';
                }
                ele.debitMoney = that.formartMoney(ele.debitMoney);
                ele.creditMoney = that.formartMoney(ele.creditMoney);
                // ele.direction = that.formartMoney(ele.direction);
            });

            if(that.search.currency == that.standardCurrencyId || that.search.currency == '-2'){
                //单行表头
                var _info = {
                    'title': '明细分类账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '科目', 'val': that.subjectName }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '日期', 'col': 'periodDate' },
                        { 'name': '凭证字号', 'col': 'voucherNumber' },
                        { 'name': '摘要', 'col': 'summary' },
                        { 'name': '借方', 'col': 'debitMoney' },
                        { 'name': '贷方', 'col': 'creditMoney' },
                        { 'name': '方向', 'col': 'direction' },
                        { 'name': '余额', 'col': 'balance'},
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            }else if(that.search.currency == '-1'){
                //固定多表头
                // 多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">凭证字号</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th rowspan="2" style="width: 6%">币别</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th colspan="2" style="width: 12%">余额</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">方向</th>
                        <th style="width: 6%">本位币</th>
                    </tr>
                `;

                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that._nullData(row.periodDate)}</td>
                            <td>${that._nullData(row.voucherNumber)}</td>
                            <td>${that._nullData(row.summary)}</td>
                            <td>${that._nullData(row.currencyNameValue)}</td>
                            <td>${that.formartMoney(row.debitMoney)}</td>
                            <td>${that.formartMoney(row.debitAmountFor)}</td>
                            <td>${that.formartMoney(row.creditMoney)}</td>
                            <td>${that.formartMoney(row.creditAmountFor)}</td>
                            <td>${that._nullData(row.direction)}</td>
                            <td>${that.formartMoney(row.balance)}</td>
                        </tr>
                    `;
                });

                let data = {
                    'title': '明细分类账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '科目', 'val': that.subjectName }
                    ],
                    'colMaxLenght': 10,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
            }else{
                //固定多表头
                // 多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">凭证字号</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th rowspan="2" style="width: 6%">币别</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th rowspan="2" style="width: 6%">方向</th>
                        <th colspan="2" style="width: 12%">余额</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">方向</th>
                        <th style="width: 6%">本位币</th>
                    </tr>
                `;

                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that._nullData(row.periodDate)}</td>
                            <td>${that._nullData(row.voucherNumber)}</td>
                            <td>${that._nullData(row.summary)}</td>
                            <td>${that._nullData(row.currencyNameValue)}</td>
                            <td>${that.formartMoney(row.debitMoney)}</td>
                            <td>${that.formartMoney(row.debitAmountFor)}</td>
                            <td>${that.formartMoney(row.creditMoney)}</td>
                            <td>${that.formartMoney(row.creditAmountFor)}</td>
                            <td>${that._nullData(row.direction)}</td>
                            <td>${that.formartMoney(row.balanceFor)}</td>
                            <td>${that.formartMoney(row.balance)}</td>
                        </tr>
                    `;
                });

                let data = {
                    'title': '明细分类账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '科目', 'val': that.subjectName }
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
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formatMoney(value){
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        //清空表格的方法
        clearTable(){
            var parent = $(".jqGrid_wrapper");
            parent.empty();
            $(" <table id='list'></table>").appendTo(parent);
            $("<div id='pager'></div>").appendTo(parent);
        },
        voucherDetail(rowData){
            let url = contextPath+'/finance/voucher-lrt/index.html?voucherId='+rowData.voucherId+"&sobId="+rowData.sobId;
            console.log(url)
            window.parent.activeEvent({name: '查看凭证', url: url, params: null});
        },
        exportDetail() {
            let _vm = this.search;
            var url = contextPath+"/bookInquiryController/exportExcel?currency="+_vm.currency+"&yearStart="+_vm.yearStart
                +"&yearEnd="+_vm.yearEnd+"&subjectPeriodStart="+_vm.subjectPeriodStart+"&subjectPeriodEnd="+_vm.subjectPeriodEnd
                +"&subjectLevelStart="+_vm.subjectLevelStart+"&subjectLevelEnd="+_vm.subjectLevelEnd
                +"&subjectCodeStart="+_vm.subjectCodeStart+"&subjectCodeEnd="+_vm.subjectCodeEnd
                +"&showDisable="+_vm.showDisable+"&showUnposted="+_vm.showUnposted
                +"&noShowAndHappen="+_vm.noShowAndHappen+"&noShowAndHappenZero="+_vm.noShowAndHappenZero
                +"&showDetailOnly="+_vm.showDetailOnly+"&showNoOccurencePeriod="+_vm.showNoOccurencePeriod
                +"&curIndex="+_vm.curIndex;
            console.log(url)
            window.open(url);
        },
        initHtml(){
            let v = this;
            $.ajax({
                type: 'POST',
                data: null,
                url: contextPath+'/bookInquiryController/initPage',
                dataType: 'json',
                success: function (res) {
                    if(res.code == '100100'){
                        v.years = res.data.financeYearPeriod.data;
                        v.search.yearStart = v.years[0].value;
                        v.search.yearEnd = v.years[0].value;
                        v.currencyList = res.data.currencyList.data.slice(1);
                        v.search.currency= v.currencyList[0].id;

                        v.search.subjectLevelStart= v.subjectLevelList[0].value;
                        v.search.subjectLevelEnd= v.subjectLevelList[0].value;

                        let subjectCode = getUrlParam('subjectCode');
                        let currency = getUrlParam("currencyId");
                        if(subjectCode != null&&subjectCode != ''){
                            v.search.subjectCode = subjectCode;
                            v.search.currency = currency;
                            v.search.yearStart = getUrlParam("subjectYearEnd");
                            v.search.yearEnd = getUrlParam("subjectYearEnd");
                            v.search.subjectPeriodStart = getUrlParam("subjectPeriodStart");
                            v.search.subjectPeriodEnd = getUrlParam("subjectPeriodEnd");
                            v.search.subjectLevelStart = parseInt(getUrlParam("subjectLeaveStart"))+3;
                            v.search.subjectLevelEnd = parseInt(getUrlParam("subjectLeaveEnd"))+3;
                            v.search.showUnposted = getUrlParam("posted")=='true'?true:false;
                        }
                        if(currency == '-1'){
                            v.pageInitType();
                        }else if(currency == '-2'||currency == v.standardCurrencyId){
                            v.pageInit();
                        }else if(currency > '1'){
                            v.pageInitForein();
                        } else{
                            v.pageInit();
                        }
                    }else{
                        // layer.alert('页面初始化失败')
                        v.$Modal.error({
                            title:'错误',
                            content:'页面初始化失败'
                        })
                    }
                },
                error: function (res) {
                    v.$Modal.error({
                        title:'错误',
                        content:'页面初始化失败'
                    })
                }
            });
        }
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.initHtml();
    }
})