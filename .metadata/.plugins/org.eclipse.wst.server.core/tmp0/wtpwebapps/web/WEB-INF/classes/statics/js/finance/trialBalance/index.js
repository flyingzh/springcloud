new Vue({
    el: '#trial-balance',
    data () {
        return {
            openTime: '',   //用于控制退出按钮
            formData: {
                accountYear: '',
                accountPeriod: '',
                treeHeight: '1',
                currencyId: '-1',
                showSubjectDetail: '',
                showProjectDetail: '',
                includeVoucher: '',
                accountantTime: '',
                currencyName: '',
                decimalDigits: 2,
                message: ''
            },
            isFilterVisible: false,
            subjectList1: [],
            subjectList2: [],
            subjectList4: [],
            base_config: {
                ExpandColumn: 'username',
                scroll: "true",
                styleUI: 'Bootstrap',
                url: contextPath+'/financeBalance/queryBalanceList',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: "json",
                postData: this.formData, //取mounted()内参数
                jsonReader: {
                    root: "data.list",
                    cell: "data.list",
                    userdata: "data.userData",
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
                height: $(window).height() - 200, //调整页面尺寸高度
                mtype: "POST",
            },
            colNames: [],
            colModel: [],
            colunm_comfig: [
                { startColumnName: 'beginBalance', numberOfColumns: 2, titleText: '期初余额' },
                { startColumnName: 'debit', numberOfColumns: 2, titleText: '本期发生额' },
                { startColumnName: 'endBalance', numberOfColumns: 2, titleText: '期末余额' }
            ],
            colunm_comfig1: [
                { startColumnName: 'beginBalanceFor', numberOfColumns: 2, titleText: '期初余额' },
                { startColumnName: 'debitFor', numberOfColumns: 2, titleText: '本期发生额' },
                { startColumnName: 'endBalanceFor', numberOfColumns: 2, titleText: '期末余额' }
            ],
        }
    },
    methods: {
        // 初始值本币
        initMethod () {
            var that = this;
            this.delTable();
            this.colNames1 = ['科目编码', '科目名称', '借方', '贷方', '借方', '贷方', '借方', '贷方'],
                this.colModel = [
                    { name: 'accountCode', index: 'accountCode', width: 110, sortable: false },
                    { name: 'accountName', index: 'accountName', width: 200, sortable: false },
                    {
                        name: 'beginBalance', index: 'beginBalance', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.accountName === '合计') {
                                if (value == null || value == 0) {
                                    return '';
                                } else {
                                    return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                                }
                            } else {
                                if (rows.direction === 2) {
                                    rows.beginBalance1 = value;
                                    value = "";
                                    return value;
                                } else {
                                    if (value == null || value == 0) {
                                        return '';
                                    } else {
                                        return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                                    }
                                }
                            }
                        }

                    },
                    { name: 'beginBalance1', index: 'beginBalance1', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    { name: 'debit', index: 'debit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    { name: 'credit', index: 'credit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    {
                        name: 'endBalance', index: 'endBalance', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    { name: 'endBalance1', index: 'endBalance1', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                ],
                this.jqGridInit(this.colNames1, this.colModel, this.colunm_comfig, that);
        },
        //退出
        outHtml () {
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        renovate(){
            this.save ();
        },
        // 原币
        initMethod1 () {
            var that = this;
            this.delTable();
            this.colNames1 = ['科目编码', '科目名称', '借方', '贷方', '借方', '贷方', '借方', '贷方'],
                this.colModel = [
                    { name: 'accountCode', index: 'accountCode', width: 110, sortable: false },
                    { name: 'accountName', index: 'accountName', width: 200, sortable: false },
                    {
                        name: 'beginBalanceFor', index: 'beginBalanceFor', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.accountName === '合计') {
                                if (value == null || value == 0) {
                                    return '';
                                } else {
                                    return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                                }
                            } else {
                                if (rows.direction === 2) {
                                    rows.beginBalanceFor1 = value;
                                    value = "";
                                    return value;
                                } else {
                                    if (value == null || value == 0) {
                                        return '';
                                    } else {
                                        return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                                    }
                                }
                            }
                        }
                    },
                    { name: 'beginBalanceFor1', index: 'beginBalanceFor1', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    { name: 'debitFor', index: 'debitFor', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    { name: 'creditFor', index: 'creditFor', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    {
                        name: 'endBalanceFor', index: 'endBalanceFor', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                    { name: 'endBalanceFor1', index: 'endBalanceFor1', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, that.formData.decimalDigits, ",");
                            }
                        }
                    },
                ],
                this.jqGridInit(this.colNames1, this.colModel, this.colunm_comfig1, that);
        },
        // 有核算维度编码
        showDetailMethod () {
            var that = this;
            this.delTable();
            this.colNames1 = ['科目编码', '科目名称', '核算维度编码', '核算维度名称', '借方', '贷方', '借方', '贷方', '借方', '贷方', '借方', '贷方'],
                this.colModel = [
                    { name: 'accountCode', index: 'accountCode', width: 110, sortable: false },
                    { name: 'accountName', index: 'accountName', width: 80, sortable: false },
                    { name: 'dimensionCode', index: 'age', width: 120 },
                    { name: 'dimensionName', index: 'age', width: 120 },
                    { name: 'debit1', index: 'age', width: 80 },
                    { name: 'credit1', index: 'address', width: 80 },
                    { name: 'debit2', index: 'age', width: 80 },
                    { name: 'credit2', index: 'address', width: 80 },
                    { name: 'debit3', index: 'age', width: 80 },
                    { name: 'credit3', index: 'address', width: 80 },
                    { name: 'debit4', index: 'age', width: 80 },
                    { name: 'credit4', index: 'address', width: 80 },
                ],
                this.jqGridInit(this.colNames1, this.colModel, this.colunm_comfig, that);
        },
        delTable () {
            $("#my_report").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器  
            parent.empty();
            $("<table id='my_report'></table>").appendTo(parent);
            $("<div id='my_pager'></div>").appendTo(parent);  // 再根据数据重新绘制表格
        },
        // 生成jqGrid
        jqGridInit (colNames1, colModel1, colunm_comfig, that) {
            let _vm = this;

            let config = Object.assign({}, this.base_config, {
                colNames: colNames1,
                colModel: colModel1,
                postData: JSON.stringify(_vm.formData),
                pager: '#my_pager',
                width: "99%",
                autowidth: true,
                gridComplete () { // 多表头表格设置
                    jQuery("#my_report").jqGrid('destroyGroupHeader');//最关键的一步、销毁合并表头分组、防止出现表头重叠
                    jQuery("#my_report").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: colunm_comfig
                    });

                    // $("table[id='my_report'] tbody tr td").attr('style', 'border-bottom:0px none');
                    // $("table[id='my_report'] tr[id!='null'] td").attr('style', 'border-top: 1px solid #e2e2e2;border-bottom: none;');
                    // $("table[id='my_report'] tbody tr:last td").attr('style', 'border-top:1px solid #e2e2e2');
                },
                loadComplete (ret) { // 非表格数据
                    console.log(ret);
                    jQuery("#my_report").getGridParam('userData');
                    var userData = jQuery("#my_report").jqGrid('getGridParam', 'userData');
                    that.$set(that.formData, 'accountantTime', userData.accountantTime);
                    that.$set(that.formData, 'currencyName', userData.currencyName);
                    that.$set(that.formData, 'decimalDigits', userData.decimalDigits);
                    that.$set(that.formData, 'message', userData.message);
                    window.top.home.loading('hide');
                }
            });
            jQuery("#my_report").jqGrid(config);
        },
        save () {
            this.base_config.url = contextPath+"/financeBalance/queryBalanceList"
            this.base_config.postData = JSON.stringify(this.formData);
            var typeb = this.formData.currencyId;

            if (typeb == "-1") {
                this.initMethod(); //本位币
            } else {
                this.initMethod1(); //原币
            }

            this.cancel();
        },
        refresh() {
            this.delTable();
            window.top.home.loading('show');
            this.save();
        },
        cancel () {
            this.$refs.filter.visible = false;
            this.isFilterVisible = false;
        },
        more (type) {
            var _this = this;
            if(type === 'Derivation'){
                console.log("引出,导出到excel表...");
                var data = '';
                for(let key in _this.formData){
                    data +=`${key}=${_this.formData[key]}&`;
                }
                data = data.slice(0,data.length-1);
                window.open(`${contextPath}/financeBalance/exporttrialBalance?${data}`);
            }
        },
        currencyShow () {
            var _this = this;
            $.ajax({
                type: 'post',
                async: false,
                data: '',
                url: contextPath+'/balance/currencyList',
                dataType: 'json',
                success: function (res) {
                    var list = res.data;
                    var datas = [];
                    for (var i = 0; i < list.length; i++) {
                        datas.push({
                            name: list[i].label,
                            value: list[i].value
                        });

                        if (list[i].value == -1) {
                            _this.formData.currencyId = list[i].value;
                        }
                    }

                    console.log(_this.formData.currencyId);
                    var obj = JSON.stringify(datas);
                    _this.subjectList4 = datas;
                },
                error: function (code) {
                    console.log(code);
                }
            });

            // 查询系统信息参数
            var sysUrl = contextPath + '/systemProfileController/queryByType?type=系统信息&sobId=1';

            $.ajax({
                type: 'POST',
                async: false,
                url: sysUrl,
                success: function (result) {
                    var dataObj = result.data;

                    for (var i = 0; i < dataObj.length; i++) {
                        if (dataObj[i].name == 'sysAmountDecimal') {
                            _this.formData.decimalDigits = dataObj[i].value;;

                            if (_this.formData.decimalDigits == null || _this.formData.decimalDigits == ''){
                                _this.formData.decimalDigits = 2;
                            }
                        }
                    }
                }
            });
        },
        accountShow () {
            var _this = this;
            $.ajax({
                type: 'post',
                async: false,
                data: '',
                url: contextPath+'/financeBalance/getAccountYearAndPeriod',
                dataType: 'json',
                success: function (res) {
                    var list = res.data;
                    var datas = []; //会计年度

                    for (var i = 0; i < list.length; i++) {
                        datas.push({
                            name: list[i].accountYear,
                            value: list[i].accountYear
                        });
                    }

                    console.log(list[0].accountYear);
                    _this.formData.accountYear = list[0].accountYear;

                    var obj = JSON.stringify(datas);
                    _this.subjectList1 = datas;

                    var datas2 = []; //会计期间

                    for (var j = 0; j < list.length; j++) {
                        datas2.push({
                            name: list[j].accountPeriod,
                            value: list[j].accountPeriod
                        });
                    }

                    console.log(list[0].accountPeriod);
                    _this.formData.accountPeriod = list[0].accountPeriod;
                    var obj = JSON.stringify(datas2);
                    _this.subjectList2 = datas2;
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },

    },
    computed: {
        showDetail () {
            return !!this.formData.for6;
        },
        treeDisabled () {
            return !!this.formData.showSubjectDetail;
        }
    },
    mounted () {
        var that = this;
        that.base_config.postData = JSON.stringify(that.formData);
        that.currencyShow();   // 币别下拉框
        that.accountShow();    // 会计年度和会计期间下拉框
        window.top.home.loading('show');
        that.initMethod();    // 初始化数据
        that.openTime = window.parent.params && window.parent.params.openTime;
    }
});