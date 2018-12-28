let vm = new Vue({
    el: '#app',
    data () {
        var that = this;
        return {
            openTime: '',   //用于控制退出按钮
            formData: {
                currencyId: -1,
                accountYear: 0, //起始会计年度
                accountPeriod: 0,//起始会计期间
                accountYearEnd:0,//结束会计年度
                accountPeriodEnd:0,//结束会计期间

                subjectIds:[],//科目编码集合

                projectId: 0,//核算项目类别
                itemIds:[], //核算项目明细

                includeVoucher: 1, //是否过账
                balanceZeroBlank: 1,//余额为零显示
                showAccruaZero: 1//发生额为零显示
            },
            formDate:{
                subjectCode:'',
                accountYearPeriodStrat:'',
                accountYearPeriodEnd:'',
                subjectTypeName:'',
                projectTypeName:'',
                currencytypeName:'',
                currencyName:''
            },
            sumBeginBalance: '',
            sumBeginBalance1: '',
            sumDebit: '',
            sumCredit: '',
            sumYtdDebit: '',
            sumYtdCredit: '',
            sumEndBalance: '',
            sumEndBalance1: '',


            sumBeginBalanceFor: '',
            sumBeginBalanceFor1: '',
            sumDebitFor: '',
            sumCreditFor: '',
            sumYtdDebitFor: '',
            sumYtdCreditFor: '',
            sumEndBalanceFor: '',
            sumEndBalanceFor1: '',

            isFilterVisible: false,
            subjectVisible: false,
            accountingPeriod:[], //会计期间
            accountingYear:[],  //会计年度
            currencyList: [], //币别
            subjectList1: [], //会计年度
            subjectList2: [], //会计期间

            projectList: [], //项目类别
            projectCodeList: [], //项目代码
            baseData: {
                //本位币id
                standardCurrencyId: 0,
            },
            base_config: {
                ExpandColumn: 'username',
                styleUI: 'Bootstrap',

                url: contextPath + '/financeBalance/accountingProjectBalances',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                postData: JSON.stringify(this.formData), //取mounted()内参数
                jsonReader: {
                    root: "data",
                    cell: "data",
                    userdata: "userdata",
                    repeatitems: false
                },
                treeReader: {
                    level_field: "level",
                    parent_id_field: "parent",
                    leaf_field: "isLeaf",
                    expanded_field: "expanded"
                },

                viewrecords: true, //不分页
                rowNum: 999,
                mtype: "POST",
                footerrow: true,
                height: $(window).height() - 230,
            },
            colNames: [],
            colModel: [],
            colunm_config: [
                { startColumnName: 'balanceDebit', numberOfColumns: 2, titleText: '期初余额' },
                { startColumnName: 'accrualDebit', numberOfColumns: 2, titleText: '本期发生额' },
                { startColumnName: 'grandTotalAccrualDebit', numberOfColumns: 2, titleText: '本年累计发生额' },
                { startColumnName: 'endingBalanceDebit', numberOfColumns: 2, titleText: '期末余额' }
            ],
            colunm_comfig1: [
                { startColumnName: 'balanceDebit', numberOfColumns: 4, titleText: '期初余额' },
                { startColumnName: 'accrualDebit', numberOfColumns: 4, titleText: '本期发生额' },
                { startColumnName: 'grandTotalAccrualDebit', numberOfColumns: 4, titleText: '本年累计发生额' },
                { startColumnName: 'endingBalanceDebit', numberOfColumns: 4, titleText: '期末余额' }
            ],
            lodoPList: [],
        }
    },
    methods: {
        //重置科目 code和id
        resetting(){
           this.formData.subjectIds = [];
            this.formDate.subjectCode = [];
        },
        renovate () {
            this.save();
        },
        getColSum (name) {
            let rs = $(`td[aria-describedby='my_report_${name}']`);
            let sum = 0;
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000
            })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        subjectClose () {
            this.isFilterVisible = true;
            this.$refs.filter.visible = true;
            this.subjectVisible = false;
        },
        saveSubjectData (treeNode) {
            // var _subjectIds = this.formData.subjectIds;
            this.formData.subjectIds.push(treeNode.id);
            this.formDate.subjectCode += (($.trim(this.formDate.subjectCode) == '') ? '' : ',') + treeNode.subjectCode;
            console.log("this.formData.subjectIds",this.formData.subjectIds);
        },
        openModalSubject () {
            this.$refs.filter.visible = true;
            this.subjectVisible = true;
        },
        formatNum (num) {
            return accounting.formatMoney(num);
        },
        // 初始值本币
        initMethod () {
            this.delTable();
            this.colNames1 = ['项目代码', '项目名称', '借方', '贷方', '借方', '贷方', '借方', '贷方', '借方', '贷方'],
                this.colModel = [
                    { name: 'itemCode', index: 'itemCode', width: 100, sortable: false },
                    { name: 'itemName', index: 'itemName', width: 200, sortable: false },

                    { name: 'balanceDebit', index: 'balanceDebit', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'balanceCredit', index: 'balanceCredit', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    } },

                    { name: 'accrualDebit', index: 'accrualDebit', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'accrualCredit', index: 'accrualCredit', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'grandTotalAccrualDebit', index: 'grandTotalAccrualDebit', align: 'right', width: 90, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'grandTotalAccrualCredit', index: 'grandTotalAccrualCredit', align: 'right', width: 90, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'endingBalanceDebit', index: 'endingBalanceDebit', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'endingBalanceCredit', index: 'endingBalanceCredit', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                ],
                this.jqGridInit(this.colNames1, this.colModel, this.colunm_config);
        },
        // 原币
        initMethod1 () {
            var that = this;
            this.delTable();
            this.colNames1 = ['项目代码', '项目名称', '借方原币', '借方本位币', '贷方原币','贷方本位币','借方原币', '借方本位币', '贷方原币','贷方本位币','借方原币', '借方本位币', '贷方原币','贷方本位币','借方原币', '借方本位币', '贷方原币','贷方本位币',],
                this.colModel = [
                    { name: 'itemCode', index: 'itemCode', width: 100, sortable: false },
                    { name: 'itemName', index: 'itemName', width: 200, sortable: false },
                    { name: 'balanceDebit', index: 'balanceDebit', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'balanceDebitFor', index: 'balanceDebitFor', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'balanceCredit', index: 'balanceCredit', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'balanceCreditFor', index: 'balanceCreditFor', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'accrualDebit', index: 'accrualDebit', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'accrualDebitFor', index: 'accrualDebitFor', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'accrualCredit', index: 'accrualCredit', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'accrualCreditFor', index: 'accrualCreditFor', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'grandTotalAccrualDebit', index: 'grandTotalAccrualDebit', align: 'right', width: 90 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'grandTotalAccrualDebitFor', index: 'grandTotalAccrualDebitFor', align: 'right', width: 90 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'grandTotalAccrualCredit', index: 'grandTotalAccrualCredit', align: 'right', width: 90,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'grandTotalAccrualCreditFor', index: 'grandTotalAccrualCreditFor', align: 'right', width: 90,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'endingBalanceDebit', index: 'endingBalanceDebit', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'endingBalanceDebitFor', index: 'endingBalanceDebitFor', width: 80,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},

                    { name: 'endingBalanceCredit', index: 'endingBalanceCredit', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    { name: 'endingBalanceCredit', index: 'endingBalanceCreditFor', width: 80 ,formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                ],
                this.jqGridInit(this.colNames1, this.colModel, this.colunm_comfig1, that);
        },
        delTable () {
            $("#my_report").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器  
            parent.empty();
            $("<table id='my_report'></table>").appendTo(parent);
            $("<div id='my_pager'></div>").appendTo(parent);  // 再根据数据重新绘制表格
        },
        // 生成jqGrid
        jqGridInit (colNames1, colModel1, colunm_config) {
            let vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames1,
                colModel: colModel1,
                pager: '#my_pager',
                gridComplete () { // 多表头表格设置
                    jQuery("#my_report").jqGrid('destroyGroupHeader');//最关键的一步、销毁合并表头分组、防止出现表头重叠
                    jQuery("#my_report").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: colunm_config
                    });
                    $('.ui-jqgrid-sortable').removeClass('ui-jqgrid-sortable');

                },
                loadComplete (xhr) { // 非表格数据
                    window.top.home.loading('hide');
                    console.log(xhr, '===========xhr=');
                    vm.lodoPList = xhr.data || [];
                    jQuery("#my_report").getGridParam('userData');
                    var userData = jQuery("#my_report").jqGrid('getGridParam', 'userData')
                    var _text = '';
                    if(xhr.code === '100100'){
                        _text = xhr.msg;
                        vm.formDate.accountingPeriod = userData.accountingPeriod;
                        vm.formDate.currencyName = userData.currencyName;
                        vm.formDate.subject = userData.subject;
                    }else {
                        _text = xhr.msg;
                    }
                    vm.$Message.info({
                        content: _text,
                        duration: 3
                    });
                    // vm.$Modal.warning({
                    //     title: '提示信息',
                    //     content: _text
                    // });
                },
                //页面跳转
                onCellSelect(rowid,iCol,cellcontent,e){
                    console.log(rowid,iCol,cellcontent,e,'====')
                    console.log("rowid",rowid,iCol, rowid === 'null'  ,rowid <= 0)

                    var _text = $("#my_report").jqGrid('getRowData', rowid)


                    console.log("this.formDate.subjectCode",vm.formData.balanceZeroBlank,vm.formData.showAccruaZero)
                        var _h = rcContextPath + '/finance/book-accounting-ledger/index.html?currency='+vm.formData.currencyId+
                                                                                            '&accountingYear='+vm.formData.accountYear+
                                                                                            '&accountingPeriod='+vm.formData.accountPeriod+
                                                                                            '&accountingYearEnd='+vm.formData.accountYearEnd+
                                                                                            '&accountingPeriodEnd='+vm.formData.accountPeriodEnd+
                                                                                            '&auxiliaryLists='+_text.itemCode.toString()+
                                                                                            '&subject='+vm.formDate.subjectCode.toString()+
                                                                                            '&accountingLevel='+vm.formData.projectId+
                                                                                            '&opt1='+vm.formData.balanceZeroBlank+
                                                                                            '&opt2='+vm.formData.showAccruaZero;
                        var _p = {
                            'name': '核算项目明细表',
                            'url': _h
                        }
                        window.parent.activeEvent(_p);
                }
            });
            jQuery("#my_report").jqGrid(config);
        },
        save () {
            //防止暴力点击
            window.top.home.loading('show');
            this.base_config.url = contextPath + '/financeBalance/accountingProjectBalances',
            this.base_config.postData = JSON.stringify(this.formData);
            //获取搜索条件展示在页面
            this.formDate.accountYearPeriodStrat = this.formData.accountYear + "年第" + this.formData.accountPeriod + "期";
            this.formDate.accountYearPeriodEnd = this.formData.accountYearEnd + "年第" + this.formData.accountPeriodEnd + "期";
            //会计科目
            this.formDate.subjectTypeName = this.formDate.subjectCode;
            //项目类别
            let find1 = this.projectList.find(row => {
                return row.id === this.formData.projectId;
            })
            find1 && (this.formDate.projectTypeName = find1.projectAccountName +" | " + find1.projectAccountCode);
            //币别
            let find2 = this.currencyList.find(row => {
                return row.value === this.formData.currencyId;
            })
            find2 && (this.formDate.currencytypeName = find2.label);
            //判断币别
            var typeb = this.formData.currencyId;
            if (typeb == -1 || typeb  === this.baseData.standardCurrencyId) {
                this.initMethod(); //本位币
            } else {
                this.initMethod1(); //原币
            }
            this.cancel();
        },
        cancel () {
            this.$refs.filter.visible = false;
            this.isFilterVisible = false;
        },
        more (value) {
            console.log(value)
        },
        _currencyShow () {
            var _this = this;
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: contextPath + '/balance/currencyList',
                dataType: 'json',
                success: function (res) {
                    if (res.code === '100100'){
                        _this.currencyList = res.data;
                        _this.baseData.standardCurrencyId = res.data[0].value ;
                        console.log("_this.currencyList",_this.currencyList);
                        _this.accountShow(); //会计年度和会计期间下拉框
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        print () {
            if (!vm.lodoPList || !vm.lodoPList.length) {
                vm.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var _d = vm.lodoPList;
            var _thead = '', _tbody = '', _tfoot = '';
            if(this.formData.currencyId === -1 || this.formData.currencyId  === this.baseData.standardCurrencyId) {
                _thead = `
                <tr class='thCs'>
                    <th rowspan="2" style="width: 10%">项目编码</th>
                    <th rowspan="2" style="width: 18%">项目名称</th>
                    <th colspan="2" style="width: 12%">初期余额</th>
                    <th colspan="2" style="width: 12%">本期发生额</th>
                    <th colspan="2" style="width: 12%">本年累计发生额</th>
                    <th colspan="2" style="width: 12%">期末余额</th>
                </tr>
                <tr class='thCs'>
                    <th style="width: 6%">借方</th>
                    <th style="width: 6%">贷方</th>
                    <th style="width: 6%">借方</th>
                    <th style="width: 6%">贷方</th>
                    <th style="width: 6%">借方</th>
                    <th style="width: 6%">贷方</th>
                    <th style="width: 6%">借方</th>
                    <th style="width: 6%">贷方</th>
                </tr>`;
                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.itemCode}</td>
                        <td>${row.itemName}</td>
                        <td>${row.balanceDebitFor === 0 ? '' : accounting.formatMoney(row.balanceDebitFor, '', 2)}</td>
                        <td>${row.balanceCreditFor === 0 ? '': accounting.formatMoney(row.balanceCreditFor, '', 2) }</td>
                        <td>${row.accrualDebitFor === 0? '': accounting.formatMoney(row.accrualDebitFor, '', 2)}</td>
                        <td>${row.accrualCreditFor === 0?'': accounting.formatMoney(row.accrualCreditFor, '', 2)}</td>
                        <td>${row.grandTotalAccrualDebitFor === 0?'': accounting.formatMoney(row.grandTotalAccrualDebitFor, '', 2)}</td>
                        <td>${row.grandTotalAccrualCreditFor === 0? '': accounting.formatMoney(row.grandTotalAccrualCreditFor, '', 2)}</td>
                        <td>${row.endingBalanceDebitFor === 0 ? '' : accounting.formatMoney(row.endingBalanceDebitFor, '', 2)}</td>
                        <td>${row.endingBalanceCreditFor === 0 ? '': accounting.formatMoney(row.endingBalanceCreditFor, '', 2)}</td>
                    </tr>
                `;
            });
            }else {
                _thead = `
                <tr class='thCs'>
                    <th rowspan="2" style="width: 10%">项目编码</th>
                    <th rowspan="2" style="width: 14%">项目名称</th>
                    <th colspan="4" style="width: 14%">初期余额</th>
                    <th colspan="4" style="width: 14%">本期发生额</th>
                    <th colspan="4" style="width: 14%">本年累计发生额</th>
                    <th colspan="4" style="width: 14%">期末余额</th>
                </tr>
                <tr class='thCs'>
                    <th style="width: 7%">借方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">贷方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">借方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">贷方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">借方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">贷方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">借方原币</th>
                    <th style="width: 7%">借方本位币</th>
                    <th style="width: 7%">贷方原币</th>
                    <th style="width: 7%">借方本位币</th>
                </tr>
            `;
                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.itemCode}</td>
                        <td>${row.itemName}</td>
                        <td>${row.balanceDebitFor === 0 ? '' : accounting.formatMoney(row.balanceDebitFor, '', 2)}</td>
                        <td>${row.balanceDebit === 0 ? '' : accounting.formatMoney(row.balanceDebit, '', 2)}</td>
                        <td>${row.balanceCreditFor === 0 ? '':accounting.formatMoney(row.balanceCreditFor, '', 2) }</td>
                        <td>${row.balanceCredit === 0 ? '':accounting.formatMoney(row.balanceCredit, '', 2) }</td>
                        <td>${row.accrualDebitFor === 0? '': accounting.formatMoney(row.accrualDebitFor, '', 2)}</td>
                        <td>${row.accrualDebit === 0? '': accounting.formatMoney(row.accrualDebit, '', 2)}</td>
                        <td>${row.accrualCreditFor === 0?'': accounting.formatMoney(row.accrualCreditFor, '', 2)}</td>
                        <td>${row.accrualCredit === 0?'': accounting.formatMoney(row.accrualCredit, '', 2)}</td>
                        <td>${row.grandTotalAccrualDebitFor === 0?'': accounting.formatMoney(row.grandTotalAccrualDebitFor, '', 2)}</td>
                        <td>${row.grandTotalAccrualDebit === 0?'': accounting.formatMoney(row.grandTotalAccrualDebit, '', 2)}</td>
                        <td>${row.grandTotalAccrualCreditFor === 0? '': accounting.formatMoney(row.grandTotalAccrualCreditFor, '', 2)}</td>
                        <td>${row.grandTotalAccrualCredit === 0? '': accounting.formatMoney(row.grandTotalAccrualCredit, '', 2)}</td>
                        <td>${row.endingBalanceDebitFor === 0 ? '' : accounting.formatMoney(row.endingBalanceDebitFor, '', 2)}</td>
                        <td>${row.endingBalanceDebit === 0 ? '' : accounting.formatMoney(row.endingBalanceDebit, '', 2)}</td>
                        <td>${row.endingBalanceCreditFor === 0 ? '': accounting.formatMoney(row.endingBalanceCreditFor, '', 2)}</td>
                        <td>${row.endingBalanceCredit === 0 ? '': accounting.formatMoney(row.endingBalanceCredit, '', 2)}</td>
                    </tr>
                `;
            });
            }
            if (_d.length === 0) {
                _tfoot = `
                    <tr class="ht-foot">
                        <td>合计：</td>
                        ${'<td>/td>'.repeat(9)}
                    </tr>
                    `;
            } else {
                _tfoot = `
                    <tr class="ht-foot">
                        <td>合计：</td>
                        <td></td>
                        ${'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(8)}
                    </tr>
                    `;
            }
            let data = {
                title: "核算科目余额表",
                template: 12,
                'titleInfo': [
                    { 'name': '开始期间', 'val': this.formDate.accountYearPeriodStrat },
                    { 'name': '结束期间', 'val': this.formDate.accountYearPeriodEnd },
                    { 'name': '科目', 'val': this.formDate.subjectTypeName  },
                    { 'name': '项目类别', 'val': this.formDate.projectTypeName },
                    { 'name': '币别', 'val': this.formDate.currencytypeName },
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
        },
        accountShow(){
            /** 会计期间列表*/
            var _that = this;
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: contextPath+'/accountBalanceSheet/getAccountYearAndPeriod',
                dataType: 'json',
                success: function (d) {
                    if(d.code === '100100'){
                        console.log(d)
                        _that.accountingPeriod=d.data.period;
                        _that.accountingYear=d.data.year;
                        _that.formData.accountYear = d.data.presents[0];
                        _that.formData.accountYearEnd = d.data.presents[0];
                        _that.formData.accountPeriod = d.data.presents[1];
                        _that.formData.accountPeriodEnd = d.data.presents[1];
                        // _that._currencyShow();
                        // console.log("_that.accountingYear",_that.accountingPeriod,_that.accountingYear,d.data)
                        _that.projectTypeShow(); //项目类别下拉框
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        projectTypeShow () {
            var _this = this;
            $.ajax({
                type: 'post',
                async: true,
                data: '',
                url: contextPath + '/financeBalance/getProjectList',
                dataType: 'json',
                success: function (res) {
                    if (res.code === '100100'){
                        console.log("res.data",res.data)
                        _this.projectList = res.data;
                        _this.formData.projectId = _this.projectList[0].id;
                        _this.projectCodeShow ();
                        _this.save();
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '核算项目余额表';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        //页面选择项目类别,传项目类别id查该类别所有项目代码
        projectCodeShow () {
            var _this = this;
            console.log("_this.formData.projectId",_this.formData.projectId)
            $.ajax({
                type: 'post',
                async: true,
                data: { 'subjectProjectId': _this.formData.projectId },
                url: contextPath + '/accountBalanceSheet/getSubjectProject',
                dataType: 'json',
                success: function (res) {
                    if (res.code === '100100'){
                        _this.projectCodeList = res.data;
                        console.log("_this.projectCodeList",_this.projectCodeList)
                        // _this.save ();
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        exporting () {
            // $("#export_form")[0].submit();
                console.log("引出,导出 核算项目余额表...");
                var _this = vm.formData;
                console.log(" vm.formData", vm.formData)
                    var data = '';
                    for(let key in _this){
                        if(key === 'itemIds' || key === 'subjectIds'){
                            if(_this[key].length !== 0){
                                data +=`${key}=${_this[key]}&`;
                            }
                        }else  {
                            data +=`${key}=${_this[key]}&`;
                        }
                    //if(key === 'includeVoucher' || key === 'balanceZeroBlank' ||key === 'showAccruaZero'){
                    //     data +=`${key}=${_this[key]?1:0}&`;
                    // }else
                    }
                    data = data.slice(0,data.length-1);
                    console.log("data",data)
                    window.open(`${contextPath}/financeBalance/derivation?${data}`);
        },
        lookAtTheDetails(){

        },
        //刷新
        refresh () {

            this.save();
        }
    },
    mounted () {
        let that = this;
        that.base_config.postData = JSON.stringify(this.formData);
        that._currencyShow(); //币别下拉框
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
});