let vm = new Vue({
    el: '#app',
    data() {
        return {
            openTime: '',   //用于控制退出按钮
            disjunctor: true,
            formData:{
                currency:-1,
                accountingYear:0,//会计年
                accountingPeriod:0,//会计期间月
                accountingYearEnd:0,//会计年
                accountingPeriodEnd:0,//会计期间月
                auxiliaryLists:[],//项目code
				subject:'',//会计科目
                accountingLevel: 1,//
                includeVoucher: true, //是否过账
                opt1:true,//余额为零不显示
                opt2:true,//无发生额且余额为零不显示
            },
            baseData: {
                //本位币id
                standardCurrencyId: 0,
            },
            _presents:[],
            auxiliaryLists:[],
			currencyList:{},
			isFilterVisible: false,
			accountingYear: [],
			accountingPeriod: [],
			accountingCode:'',
			accountingLevels:[],
			subjectVisible: false,
            base_config:{
                scroll: "true",
                styleUI: 'Bootstrap',
                url: contextPath+'/accountBalanceSheet/getSheetlist',
                datatype: 'json',
                postData:{},
                jsonReader: {
                    root: "data",
                    cell: "data",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 9999,
                height: $(window).height() - 160,
              rowList: [10, 20, 30, 40],
                //caption: "",
                mtype: "POST",
            },
            colNames:[],
            colModel: [],
            colunm_config: [],
            lodoPList:[],
            printInfo: {},
            printModal:false,
        }
    },
    methods: {
		subjectClose(){
			this.isFilterVisible = true;
			this.$refs.filter.visible = true;
			this.subjectVisible = false;
		},
		saveSubjectData(treeNode){
			var subject = this.formData.subject;
			this.formData.subject += (($.trim(subject) == '') ? '' : ',')+ treeNode.subjectCode.replace(/\./g,'');
		},
		openModalSubject(){
			this.$refs.filter.visible = true;
			this.subjectVisible = true;
		},
		formatNum(num){
			return accounting.formatMoney(num);
		},
		voucherDetail(cellVal, colModel, colData){
			// console.log(cellVal);//获取id跳转到凭证页面
			var cell = '<a href="###'+colData.id+'">'+cellVal+'</a>';
			return cell;
		},
        // 初始值
        initMethod() {
            var _that = this;
            console.log("this.formData", this.formData,this.baseData.standardCurrencyId)
            if (this.baseData.standardCurrencyId === parseInt(this.formData.currency) || parseInt(this.formData.currency) === -1 ) {
                this.colNames = ['id', '日期', '凭证字号', '摘要', '借方', '贷方', '方向', '余额'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {
                        name: 'voucherDate', width: 100, formatter: function (value, options, rowData) {
                        if (value) {
                            value = (new Date(value)).format("yyyy-MM-dd");
                        } else {
                            value = '';
                        }
                        return value;
                    }
                    },
                    {name: 'voucherGroupName', width: 100 ,formatter: function (value, grid, rows, state) {
                        $(document).off("click",".mark"+grid.rowId)
                            .on("click",".mark"+grid.rowId,function(){
                                _that._text(grid.rowId);
                                return;
                            });
                        let a = '';
                        if (!!grid.rowId && grid.rowId !== 'null' && grid.rowId !== '0'&&grid.rowId !== '-1'){
                            a =`<a class="mark${grid.rowId}">${value}</a>`;
                        }
                        return a;
                    }},
                    {name: 'explains', width: 100},
                    {name: 'debit', width: 100 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'credit', width: 100 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'direction', width: 100 ,formatter: function (value, options, rowData) {
                        // console.log("value",value);
                        if (value === 1) {
                            value = '借';
                        } else if(value === 2) {
                            value = '贷';
                        }else {
                            value = '平';
                        }
                        return value;
                        }
                    },
                    {name: 'balance', width: 120 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                ];
                this.tableHeaders = [];
            } else {
                this.colNames = ['id', '日期', '凭证字号', '摘要', '原币', '本位币', '原币', '本位币', '方向','原币', '本位币'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {
                        name: 'voucherDate', width: 100, formatter: function (value, options, rowData) {
                        if (value) {
                            value = (new Date(value)).format("yyyy-MM-dd");
                        } else {
                            value = '';
                        }
                        return value;
                    }
                    },
                    {name: 'voucherGroupName', width: 100 ,
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click",".mark"+grid.rowId)
                                .on("click",".mark"+grid.rowId,function(){
                                    _that._text(grid.rowId);
                                    return;
                                });
                            let a = '';
                            if (!!grid.rowId && grid.rowId !== 'null' && grid.rowId !== '0'&&grid.rowId !== '-1'){
                                a =`<a class="mark${grid.rowId}">${value}</a>`;
                            }
                            return a;
                        }},
                    {name: 'explains', width: 100},
                    {name: 'debitFor', width: 100 , formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'debit', width: 100 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'creditFor', width: 100 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'credit', width: 120 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'direction', width: 150 ,formatter: function (value, options, rowData) {
                        if (value === 1) {
                            value = '借';
                        } else if(value === 2) {
                            value = '贷';
                        }else {
                            value = '平';
                        }
                        return value;
                    }
                    },
                    {name: 'balanceFor', width: 100 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'balance', width: 100 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                ];
                this.tableHeaders = [
                    {startColumnName: 'debitFor', numberOfColumns: 2, titleText: '借方'},
                    {startColumnName: 'creditFor', numberOfColumns: 2, titleText: '贷方'},
                    {startColumnName: 'balanceFor', numberOfColumns: 2, titleText: '余额'}
                ];
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        _fromData(value,type){
		    if (type === 1){
                if (value === 0 || value === null){
                    value = '';
                }else {
                    value = value.toFixed(2);
                }
            }else if (type === 2){
		        value = value.toFixed(2);
            }
            return value;
        },
        resetting(){
            var _that = this;
            _that.formData.subject = '';
        },
        delTable(){
            $("#my_jqGrid").empty();// 清空表格内容
            var parent=$(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $("<table id='my_jqGrid'></table>").appendTo(parent);
            $("<div id='my_pager'></div>").appendTo(parent);  // 再根据数据重新绘制表格
        },
        // 生成jqGrid
        jqGridInit(colNames,colModel,colunm_config) {
			let vm = this;
			console.log("vm.formData===>>>",vm.formData,vm.base_config.postData)
            let config = Object.assign({},this.base_config,{
                colNames:colNames,
                colModel:colModel,
                pager: '#my_pager',
                datatype: 'json',
                postData: vm.formData,
                loadComplete: function (ret) {
                    window.top.home.loading('hide');
                    console.log("ret====>>>", ret);
                    var _text = '';
                    if(ret.code === '100100'){
                        _text = ret.msg;
                    }else {
                        _text = ret.msg;
                    }
                    vm.$Message.info({
                        content: _text,
                        duration: 3
                    });
                    // vm.$Modal.warning({
                    //     title: '提示信息',
                    //     content: _text
                    // });
                    vm.lodoPList = ret.data || [];
                },
                gridComplete() { // 多表头表格设置
                    jQuery("#my_jqGrid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders:colunm_config
                    });
                },
                onCellSelect(rowid,iCol,cellcontent,e){
                    console.log(rowid,iCol,cellcontent,e,'====')
                    console.log("rowid",rowid,iCol, rowid === 'null'  ,rowid <= 0)
                    if(rowid === 'null'){
                        console.log("rowid===",rowid,iCol)
                        return ;
                    }
                    if(Number(rowid)  <= 0){
                        return;
                    }

                }
            });
			console.log("config",config);
            jQuery("#my_jqGrid").jqGrid(config);
        },
        submitFilter(){
            //防止暴力点击
            window.top.home.loading('show');
            this.base_config.url = "/web/accountBalanceSheet/getSheetlist"
            this.base_config.postData ={
                accountingYear:vm.formData.accountingYear,
                accountingPeriod:vm.formData.accountingPeriod,
                accountingYearEnd:vm.formData.accountingYearEnd,
                accountingPeriodEnd:vm.formData.accountingPeriodEnd,
                subject:vm.formData.subject,
                auxiliaryLists:vm.formData.auxiliaryLists,
                accountingLevel:vm.formData.accountingLevel,
                currency:vm.formData.currency,
            };
            console.log("this.base_config.postData",this.base_config.postData)
            this.delTable();
            this.initMethod();
			this.cancel();
        },
        cancel(){
			this.$refs.filter.visible = false;
			this.isFilterVisible = false;
        },
        _text(rowid){
            var _h = rcContextPath + '/finance/voucher-lrt/index.html?voucherId=' + rowid + "&sobId=" +1;
            var _p = {
                'name': '查看凭证',
                'url': _h
            }
            window.parent.activeEvent(_p);
        },
        more(type){
            if(type==='Derivation'){
                console.log("引出,导出 核算项目明细表...");
                var _this = vm.formData;
                console.log("vm.formData",vm.formData)

                    var data = '';
                    for(let key in _this){
                        data +=`${key}=${_this[key]}&`;
                    }
                    data = data.slice(0,data.length-1);
                    window.open(`/web/accountBalanceSheet/exportExcel?${data}`);
            }
        },
        refresh(){
            this.submitFilter();
        },
        YearAndPeriod(){
            /** 会计期间列表*/
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: contextPath+'/accountBalanceSheet/getAccountYearAndPeriod',
                dataType: 'json',
                success: function (d) {
                    if(d.code === '100100'){
                        console.log(d)
                        vm.accountingPeriod=d.data.period;
                        vm.accountingYear=d.data.year;
                        vm._presents= d.data.presents;
                        vm.formData.accountingYear = vm._presents[0];
                        vm.formData.accountingYearEnd = vm._presents[0];
                        vm.formData.accountingPeriod = vm._presents[1];
                        vm.formData.accountingPeriodEnd = vm._presents[1];

                        console.log("vm.accountingYear",vm.accountingPeriod,vm.accountingYear)
                        if(vm.disjunctor){
                            var _currency = getUrlParam('currency');
                            vm.$nextTick(function () {
                                if (_currency) {
                                    vm.disjunctor = false;
                                    vm.formData.currency = parseInt(getUrlParamDecodeURI('currency'));
                                    vm.formData.accountingYear = parseInt(getUrlParamDecodeURI('accountingYear'));
                                    vm.formData.accountingPeriod = parseInt(getUrlParamDecodeURI('accountingPeriod'));
                                    vm.formData.accountingYearEnd = parseInt(getUrlParamDecodeURI('accountingYearEnd'));
                                    vm.formData.accountingPeriodEnd = parseInt(getUrlParamDecodeURI('accountingPeriodEnd'));
                                    vm.formData.auxiliaryLists.push(getUrlParamDecodeURI('auxiliaryLists'));
                                    vm.formData.subject = getUrlParamDecodeURI('subject');
                                    vm.formData.accountingLevel = parseInt(getUrlParamDecodeURI('accountingLevel'));
                                    vm.formData.opt1 = parseInt(getUrlParamDecodeURI('opt1') || 0);
                                    vm.formData.opt2 = parseInt(getUrlParamDecodeURI('opt2') || 0);
                                }
                                vm.initMethod(vm.colNames,vm.colModel,vm.colunm_config,vm);
                                console.log("获取币别    -----",vm.formData);
                            })
                        }
                        vm.currency();
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        currency(){
            /** 币别*/
            var that = this;
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: contextPath+'/balance/currencyList',
                dataType: 'json',
                success: function (d) {

                    vm.baseData.standardCurrencyId = d.data[0].value ;
                    // console.log("datas",datas)
                    vm.currencyList=d.data;
                    vm.SubjectProjectById();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },


        getList(){
            /**项目类别*/
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: contextPath+'/accountBalanceSheet/getList',
                dataType: 'json',
                success: function (d) {
                    if(d.code === '100100'){
                    var list=d.data;
                    vm.accountingLevels=d.data;
                    console.log("vm.accountingLevels=d.data;",vm.accountingLevels )
                    vm.YearAndPeriod();

                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '核算项目明细表';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        SubjectProjectById(){
            /**项目code列表*/
            console.log(vm.formData.accountingLevel,"====");
            this.$refs.test.clearSingleSelect();
            // this.formData.auxiliaryLists = [];
                $.ajax({
                    type: 'post',
                    async: true,
                    data: {'subjectProjectId':vm.formData.accountingLevel},
                    url: contextPath+'/accountBalanceSheet/getSubjectProject',
                    dataType: 'json',
                    success: function (d) {
                        //var datas= [];
                        if (d.code === '100100'){
                            console.log("_d",d)
                            vm.auxiliaryLists = d.data;
                            // this.submitFilter();
                        }
                        // var obj=JSON.stringify(datas);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
        },
        print () {
            var that = this;
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }

            // var coinStop = this.formDataInit.coinStop;
            // console.log("coinStop" ,coinStop);
            // console.log("this.formData===",this.formData)
            // for (var i = 0;i<coinStop.length;i++){
            //     if (coinStop[i].id === this.formData.currency){
            //         this.form.coinStopName = coinStop[i].name;
            //     }
            // }
            if (that.baseData.standardCurrencyId === that.formData.currency) {
                // 但表头选择打印
                var _info = {
                    'title': '核算项目明细表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [],      // title
                    'colNames': [       // 列名与对应字段名
                        { 'name': '日期', 'col': 'documentDate' },
                        { 'name': '凭证字号', 'col': 'documentType' },
                        { 'name': '摘要', 'col': 'documentNumber' },
                        { 'name': '借方', 'col': 'customerName' },
                        { 'name': '贷方', 'col': 'summary' },
                        { 'name': '方向', 'col': 'voucherSize' },
                        { 'name': '余额', 'col': 'departmentName' ,'formatNub':true },
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.lodoPList,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            } else {
                // 多表头固定打印
                var _d = that.lodoPList;
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">凭证字号</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th colspan="2" style="width: 12%">借方</th>
                        <th colspan="2" style="width: 12%">贷方</th>
                        <th rowspan="2" style="width: 6%">方向</th>
                        <th colspan="2" style="width: 12%">余额</th>
                    </tr>
                    <tr class='thCs'>
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
                            <td>${that._nullData(row.voucherDate)}</td>
                            <td>${that._nullData(row.voucherGroupName)}</td>
                            <td>${that._nullData(row.explains)}</td>
                            <td>${that._nullData(row.debit)}</td>
                            <td>${that._nullData(row.debitFor)}</td>
                            <td>${that._nullData(row.credit)}</td>
                            <td>${that._nullData(row.creditFor)}</td>
                            <td>${that._direction(row.direction)}</td>
                            <td>${that._nullData(row.balance)}</td>  
                            <td>${that._nullData(row.balanceFor)}</td>
                        </tr>
                    `;
            });



                console.log("form",this.form);
                let data = {
                    title: "核算项目明细表",
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
            }



            //不带值正常打印,带值高级打印
            // htPrint(_info);
            // htPrint();
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        _direction(_t){
            if(_t === 0){
                return '平';
            }else if(_t === 1){
                return '借';
            }else {
                return '贷';
            }
        },

    },
    mounted() {
        let that = this;
        that.getList();
        that.openTime = window.parent.params && window.parent.params.openTime;
    }
});