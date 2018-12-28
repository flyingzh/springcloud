var vm = new Vue({
    el: '#fixedAssetsAndGeneralLedgerReconciliation',
    data () {
        var that = this;
        return {
            openTime: '',
            baseData: {
                subjectName: '',
                periodDate: '',
            },
            filterModal: false,
            filterBody: {
                sobId: '',
                subjectYearStart: '',
                subjectPeriodStart: '',
                sobId2: '',
                sobId3: '',
                sobId4: '',
            },
            organizationList: [],
            years: [],
            currentAccountYear: '',
            periods: [],
            currentAccountPeriod: '',
            unPostingVoucher: '',
            reconcilePlanId: null,
            subjectVisable: false,
            subjectType: '',
            subjectTypeId: '',
            initialReconcilePlans: [],
            initialSubjectPlans: [],
            setReconcilePlans: [],
            dataListOne: [{
                show: false,
                id: new Date().getTime(),
                relateSubjectId: '',
                subjectCode: '',
                subjectName: ''
            }],
            allShowOne: false,
            dataListTwo: [{
                show: false,
                id: new Date().getTime(),
                relateSubjectId: '',
                subjectCode: '',
                subjectName: ''
            }],
            allShowTwo: false,
            dataListThree: [{
                show: false,
                id: new Date().getTime(),
                relateSubjectId: '',
                subjectCode: '',
                subjectName: ''
            }],
            allShowThree: false,
            base_config: {
                multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                contentType: 'application/json;charset=utf-8',
                url: contextPath + '/financeFaReconcilePlan/queryReconcileData',
                datatype: 'json',
                jsonReader: {
                    root: "data",
                    cell: "data",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 99999
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            printModal: false,
            printInfo: {},
        }
    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.initData();
        this.initPage();
    },
    methods: {
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table>`).appendTo(parent);
        },
        setTableHeader () {
            this.colNames = ["系统名称", "期初余额", "本期借方", "本期贷方", "期末余额", "期初余额", "本期借方", "本期贷方", "期末余额", "期初余额", "本期借方", "本期贷方", "期末余额"];
            this.colModel = [
                {name: "serviceName", width: 100, align: "center"},
                {
                    name: "initialBalanceOriginal", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "currentPeriodDebitOriginal", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "currentPeriodCreditOriginal", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "finalBalanceOriginal", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "initialBalanceDepr", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "currentPeriodDebitDepr", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "currentPeriodCreditDepr", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "finalBalanceDepr", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "initialBalanceDeValue", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "currentPeriodDebitDeValue", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "currentPeriodCreditDeValue", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                },
                {
                    name: "finalBalanceDeValue", width: 120,
                    formatter: function (value, grid, rows, state) {
                        if (value == null || value == 0) {
                            return '';
                        } else {
                            return accounting.formatNumber(value, 2, ",");
                        }
                    }
                }
            ];
            this.tableHeaders = [
                { startColumnName: "initialBalanceOriginal", numberOfColumns: 4, titleText: "固定资产原值" },
                { startColumnName: "initialBalanceDepr", numberOfColumns: 4, titleText: "累计折旧" },
                { startColumnName: "initialBalanceDeValue", numberOfColumns: 4, titleText: "减值准备" }
            ];

            this.base_config.height = $(window).height() - 220;
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            var _vm = this;
            var reconcilePlan;

            if (null != _vm.initialReconcilePlans && _vm.initialReconcilePlans.length > 0) {
                reconcilePlan = _vm.initialReconcilePlans[0];   // 后台接收对象为实体
                reconcilePlan.accountYear = _vm.currentAccountYear;       // 会计年
                reconcilePlan.accountPeriod = _vm.currentAccountPeriod;   // 会计期间
                reconcilePlan.unPostingVoucher = _vm.unPostingVoucher;    // 包括未过账凭证
            } else {
                reconcilePlan = _vm.setReconcilePlans;
                reconcilePlan.accountYear = _vm.currentAccountYear;       // 会计年
                reconcilePlan.accountPeriod = _vm.currentAccountPeriod;   // 会计期间
                reconcilePlan.unPostingVoucher = _vm.unPostingVoucher;    // 包括未过账凭证
            }

            let config = Object.assign({}, _vm.base_config, {
                postData: JSON.stringify(reconcilePlan),
                /*postData: {
                    "currentAccountYear": _vm.currentAccountYear,
                    "currentAccountPeriod": _vm.currentAccountPeriod
                },*/
                colNames: colNames,
                colModel: colModel,
                //contentType: 'application/json;charset=utf-8',   // 不能使用这个contentType，jQueryGrid传值到后台会是字符串的格式，导致报错：syntax error, expect {, actual error, pos 0, 必须使用ajaxGridOptions: { contentType: 'application/json;charset=utf-8' }
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                dataType: 'json',
                pager: '#page',
                method: 'post',
                loadComplete: function (ret) {
                    if (ret != null && ret.data != null) {
                        for (var index in ret.data) {
                            if (ret.data[index].initialBalanceOriginal != null && ret.data[index].initialBalanceOriginal != 0) {
                                ret.data[index].initialBalanceOriginal = accounting.formatNumber(ret.data[index].initialBalanceOriginal, 2, ",");
                            }

                            if (ret.data[index].currentPeriodDebitOriginal != null && ret.data[index].currentPeriodDebitOriginal != 0) {
                                ret.data[index].currentPeriodDebitOriginal = accounting.formatNumber(ret.data[index].currentPeriodDebitOriginal, 2, ",");
                            }

                            if (ret.data[index].currentPeriodCreditOriginal != null && ret.data[index].currentPeriodCreditOriginal != 0) {
                                ret.data[index].currentPeriodCreditOriginal = accounting.formatNumber(ret.data[index].currentPeriodCreditOriginal, 2, ",");
                            }

                            if (ret.data[index].finalBalanceOriginal != null && ret.data[index].finalBalanceOriginal != 0) {
                                ret.data[index].finalBalanceOriginal = accounting.formatNumber(ret.data[index].finalBalanceOriginal, 2, ",");
                            }

                            if (ret.data[index].initialBalanceDepr != null && ret.data[index].initialBalanceDepr != 0) {
                                ret.data[index].initialBalanceDepr = accounting.formatNumber(ret.data[index].initialBalanceDepr, 2, ",");
                            }

                            if (ret.data[index].currentPeriodDebitDepr != null && ret.data[index].currentPeriodDebitDepr != 0) {
                                ret.data[index].currentPeriodDebitDepr = accounting.formatNumber(ret.data[index].currentPeriodDebitDepr, 2, ",");
                            }

                            if (ret.data[index].currentPeriodCreditDepr != null && ret.data[index].currentPeriodCreditDepr != 0) {
                                ret.data[index].currentPeriodCreditDepr = accounting.formatNumber(ret.data[index].currentPeriodCreditDepr, 2, ",");
                            }

                            if (ret.data[index].finalBalanceDepr != null && ret.data[index].finalBalanceDepr != 0) {
                                ret.data[index].finalBalanceDepr = accounting.formatNumber(ret.data[index].finalBalanceDepr, 2, ",");
                            }

                            if (ret.data[index].initialBalanceDeValue != null && ret.data[index].initialBalanceDeValue != 0) {
                                ret.data[index].initialBalanceDeValue = accounting.formatNumber(ret.data[index].initialBalanceDeValue, 2, ",");
                            }

                            if (ret.data[index].currentPeriodDebitDeValue != null && ret.data[index].currentPeriodDebitDeValue != 0) {
                                ret.data[index].currentPeriodDebitDeValue = accounting.formatNumber(ret.data[index].currentPeriodDebitDeValue, 2, ",");
                            }

                            if (ret.data[index].currentPeriodCreditDeValue != null && ret.data[index].currentPeriodCreditDeValue != 0) {
                                ret.data[index].currentPeriodCreditDeValue = accounting.formatNumber(ret.data[index].currentPeriodCreditDeValue, 2, ",");
                            }

                            if (ret.data[index].finalBalanceDeValue != null && ret.data[index].finalBalanceDeValue != 0) {
                                ret.data[index].finalBalanceDeValue = accounting.formatNumber(ret.data[index].finalBalanceDeValue, 2, ",");
                            }
                        }
                    }

                    _vm.lodoPList = ret.data || [];
                    jQuery("#grid").jqGrid("destroyGroupHeader");
                    jQuery("#grid").jqGrid("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });

                    // 获取表格所有行数据
                    let rows = jQuery("#grid").jqGrid("getRowData");
                    var allCountID = $("#grid").jqGrid("getDataIDs");
                    rows.push($("#grid").jqGrid("getRowData", allCountID[allCountID.length - 1]));
                },
                gridComplete: function () {

                },
            });

            jQuery("#grid").jqGrid(config);
        },
        initPage () {
            /** 初始化科目数据 */
            let _that = this;
            _that.delTable();
            _that.setTableHeader();
        },
        initData() {
            // 初始化数据
            let _vm = this;

            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/financeFaReconcilePlan/initData',
                success: function (result) {
                    console.log("result", result);
                    if (result.code == '100100') {
                        _vm.organizationList = result.data.org;

                        if (null == _vm.currentAccountYear || _vm.currentAccountYear == '' || typeof(_vm.currentAccountYear) == undefined) {
                            _vm.currentAccountYear = result.data.currentAccountYear;
                        }
                        
                        if (null == _vm.currentAccountPeriod || _vm.currentAccountPeriod == '' || typeof(_vm.currentAccountPeriod) == undefined) {
                            _vm.currentAccountPeriod = result.data.currentAccountPeriod;
                        }

                        _vm.years = result.data.years.year;
                        _vm.periods = result.data.years.period;
                        _vm.filterBody.sobId = result.data.sobId;
                        _vm.baseData.periodDate = _vm.currentAccountYear + "年第" + _vm.currentAccountPeriod + "期";

                        // 初始化科目数据
                        var reconfilePlansObj = result.data.financeFaReconcilePlan;

                        if (null != reconfilePlansObj) {
                            var reconcilePlan = {};
                            reconcilePlan['id'] = reconfilePlansObj.id;
                            reconcilePlan['planName'] = reconfilePlansObj.planName;
                            reconcilePlan['defaultPlan'] = reconfilePlansObj.defaultPlan;
                            reconcilePlan['createId'] = reconfilePlansObj.createId;
                            reconcilePlan['createName'] = reconfilePlansObj.createName;
                            reconcilePlan['createTime'] = reconfilePlansObj.createTime;
                            reconcilePlan['sobId'] = reconfilePlansObj.sobId;

                            var subjectPlansObj = reconfilePlansObj.subjectPlans;

                            if (null != subjectPlansObj && subjectPlansObj.length > 0) {
                                // 先清除所有行
                                _vm.dataListOne = [];
                                _vm.dataListTwo = [];
                                _vm.dataListThree = [];

                                for (var i = 0; i < subjectPlansObj.length; i++) {
                                    var subjectPlan = {};
                                    subjectPlan['id'] = subjectPlansObj[i].id;
                                    subjectPlan['planId'] = subjectPlansObj[i].planId;
                                    subjectPlan['subjectId'] = subjectPlansObj[i].subjectId;
                                    subjectPlan['subjectCode'] = subjectPlansObj[i].subjectCode;
                                    subjectPlan['subjectName'] = subjectPlansObj[i].subjectName;
                                    subjectPlan['subjectType'] = subjectPlansObj[i].subjectType;
                                    _vm.initialSubjectPlans.push(subjectPlan);

                                    var _info = {
                                        show: false,
                                        id: new Date().getTime() + '' + i,
                                        relateSubjectId: subjectPlansObj[i].subjectId,
                                        subjectCode: subjectPlansObj[i].subjectCode,
                                        subjectName: subjectPlansObj[i].subjectName
                                    }

                                    // 遍历展示最新科目数据
                                    if (subjectPlansObj[i].subjectType == 1) {          // 固定资产原值科目
                                        _vm.dataListOne.push(_info);
                                    } else if (subjectPlansObj[i].subjectType == 2) {   // 累计折旧科目
                                        _vm.dataListTwo.push(_info);
                                    } else if (subjectPlansObj[i].subjectType == 3) {   // 减值准备科目
                                        _vm.dataListThree.push(_info);
                                    }
                                }

                                reconcilePlan['accountYear'] = _vm.currentAccountYear;
                                reconcilePlan['accountPeriod'] = _vm.currentAccountPeriod;
                                reconcilePlan['unPostingVoucher'] = _vm.currentAccountPeriod;
                                reconcilePlan['subjectPlans'] = _vm.initialSubjectPlans;
                            }

                            _vm.initialReconcilePlans.push(reconcilePlan);
                        }
                    }
                }
            });
        },
        handlerId (data, status, type) {
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
        actionBtnMth (_type, _name) {
            var that = this;
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条

            var _info = {
                show: false,
                id: new Date().getTime(),
                relateSubjectId: '',
                subjectCode: '',
                subjectName: ''
            }
            var _list = [];
            if (_name === 'dataListOne') {
                _list = that.dataListOne
            } else if (_name === 'dataListTwo') {
                _list = that.dataListTwo
            } else if (_name === 'dataListThree') {
                _list = that.dataListThree
            }

            if (_type === 'addNew') {
                _list.push(_info);
                // this.dataListOne.forEach(item => {
                //     _this.$set(item, 'show', false)
                // })
            } else {
                var _f = _list.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                let _i = Object.assign({}, _f[_f.length - 1])
                if (_type === 'import') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }
                    var _idx = 0;
                    _list.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })

                    _list.splice(_idx, 0, _info);
                } else if (_type === 'copye') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }

                    var _idx = 0;
                    _list.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })
                    _i.id = new Date().getTime();
                    _i.show = false;
                    _list.splice(_idx + 1, 0, _i);
                } else if (_type === 'delete') {
                    if (_name === 'dataListOne') {
                        that.dataListOne = that.dataListOne.filter(row => !row.show)
                    } else if (_name === 'dataListTwo') {
                        that.dataListTwo = that.dataListTwo.filter(row => !row.show)
                    } else if (_name === 'dataListThree') {
                        that.dataListThree = that.dataListThree.filter(row => !row.show)
                    }
                }
            }
        },
        clickTr (_item, _idx) {

        },
        click_all (_name) {
            var that = this;
            var _list = [], _allShow = false;
            if (_name === 'dataListOne') {
                _list = that.dataListOne;
                _allShow = that.allShowOne;
            } else if (_name === 'dataListTwo') {
                _list = that.dataListTwo;
                _allShow = that.allShowTwo;
            } else if (_name === 'dataListThree') {
                _list = that.dataListThree;
                _allShow = that.allShowThree;
            }
            _allShow = !_allShow;
            _list.forEach(row => {
                row.show = _allShow;
            })

        },
        // 切换本行是否选中
        change_tr (row, _name) {
            var that = this;
            let count = 0;
            var _list = [], _allShow = false;
            if (_name === 'dataListOne') {
                _list = that.dataListOne
            } else if (_name === 'dataListTwo') {
                _list = that.dataListTwo
            } else if (_name === 'dataListThree') {
                _list = that.dataListThree
            }

            row.show = !row.show;
            _list.forEach(row => {
                if (row.show) count++;
            })
            if (count === _list.length) {
                _allShow = true;
            } else {
                _allShow = false;
            }
        },
        refresh () {
            let _vm = this;
            _vm.initialReconcilePlans = [];
            _vm.initialSubjectPlans = [];
            this.initData();
            this.initPage();
            _vm.filterModal = false;
        },
        open () {
            this.filterModal = true;
        },
        saveData () {
            let _vm = this;
            var reconcilePlan = {};
            var subjectPlans = [];
            var dataListOneCount = 0;
            var dataListTwoCount = 0;
            var dataListThreeCount = 0;
            var strOne = "";
            var strTwo = "";
            var strThree = "";
            var hasSameSubjectOne = false;
            var hasSameSubjectTwo = false;
            var hasSameSubjectThree = false;
            var step = "";
            var msg = "";

            if (_vm.dataListOne.length == 0 || _vm.dataListTwo.length == 0 || _vm.dataListThree.length == 0) {
                if (_vm.dataListOne.length == 0) {
                    msg += "固定资产原值科目、";
                }

                if (_vm.dataListTwo.length == 0) {
                    msg += "累计折旧科目、";
                }

                if (_vm.dataListThree.length == 0) {
                    msg += "减值准备科目";
                }

                if (msg.indexOf("、") == msg.length - 1) {
                    msg = msg.substring(0, msg.indexOf("、"));
                }

                msg += "没有选择，请选择!";

                _vm.$Modal.error({
                    content: msg,
                });

                return false;
            }

            _vm.dataListOne.forEach(item => {
                if (null != item.relateSubjectId && item.relateSubjectId != '' && typeof(item.relateSubjectId) != "undefined") {
                    if (strOne.indexOf(item.subjectCode) != -1) {
                        hasSameSubjectOne = true;
                    } else {
                        strOne += item.subjectCode + ",";
                    }
                    
                    var subjectPlan = {};
                    subjectPlan['subjectId'] = item.relateSubjectId;   // 科目Id
                    subjectPlan['subjectType'] = 1;                    // 科目类别 1 固定资产原值科目
                    subjectPlans.push(subjectPlan);
                } else {
                    dataListOneCount++;
                }
            })

            _vm.dataListTwo.forEach(item => {
                if (null != item.relateSubjectId && item.relateSubjectId != '' && typeof(item.relateSubjectId) != "undefined") {
                    if (strTwo.indexOf(item.subjectCode) != -1) {
                        hasSameSubjectTwo = true;
                    } else {
                        strTwo += item.subjectCode + ",";
                    }

                    var subjectPlan = {};
                    subjectPlan['subjectId'] = item.relateSubjectId;   // 科目Id
                    subjectPlan['subjectType'] = 2;                    // 科目类别 2 累计折旧科目
                    subjectPlans.push(subjectPlan);
                } else {
                    dataListTwoCount++;
                }
            })

            _vm.dataListThree.forEach(item => {
                if (null != item.relateSubjectId && item.relateSubjectId != '' && typeof(item.relateSubjectId) != "undefined") {
                    if (strThree.indexOf(item.subjectCode) != -1) {
                        hasSameSubjectThree = true;
                    } else {
                        strThree += item.subjectCode + ",";
                    }

                    var subjectPlan = {};
                    subjectPlan['subjectId'] = item.relateSubjectId;   // 科目Id
                    subjectPlan['subjectType'] = 3;                    // 科目类别 3 减值准备科目
                    subjectPlans.push(subjectPlan);
                } else {
                    dataListThreeCount++;
                }
            })

            if (dataListOneCount > 0 || dataListTwoCount > 0 || dataListThreeCount > 0) {
                if (dataListOneCount > 0) {
                    msg += "固定资产原值存在" + dataListOneCount + "个未选择的科目!<BR/>";
                }

                if (dataListTwoCount > 0) {
                    msg += "累计折旧存在" + dataListTwoCount + "个未选择的科目!<BR/>";
                }

                if (dataListThreeCount > 0) {
                    msg += "减值准备存在" + dataListThreeCount + "个未选择的科目!";
                }

                _vm.$Modal.error({
                    content: msg,
                });

                return false;
            }

            if (hasSameSubjectOne || hasSameSubjectTwo || hasSameSubjectThree) {
                if (hasSameSubjectOne) {
                    msg += "固定资产原值、";
                }

                if (hasSameSubjectTwo) {
                    msg += "累计折旧、";
                }

                if (hasSameSubjectThree) {
                    msg += "减值准备";
                }

                if (msg.indexOf("、") == msg.length - 1) {
                    msg = msg.substring(0, msg.indexOf("、"));
                }

                msg += "存在相同的科目，请重新选择!";

                _vm.$Modal.error({
                    content: msg,
                });

                return false;
            }

            // 判断选择的对账方案是否有改动，如果有改动，则进行科目数据更新->对账查询，如果没有改动，则直接进行对账查询
            if (null != _vm.initialSubjectPlans) {
                var initialSubjectPlansOne = [];
                var initialSubjectPlansTwo = [];
                var initialSubjectPlansThree = [];
                var isSameSubjectOne = 0;
                var isSameSubjectTwo = 0;
                var isSameSubjectThree = 0;

                for (var i = 0; i < _vm.initialSubjectPlans.length; i++) {
                    if (null != _vm.initialSubjectPlans[i]) {
                        if (_vm.initialSubjectPlans[i].subjectType == 1) {
                            var initialSubjectPlanOne = {};
                            initialSubjectPlanOne['subjectCode'] = _vm.initialSubjectPlans[i].subjectCode;
                            initialSubjectPlansOne.push(initialSubjectPlanOne);
                        }

                        if (_vm.initialSubjectPlans[i].subjectType == 2) {
                            var initialSubjectPlanTwo = {};
                            initialSubjectPlanTwo['subjectCode'] = _vm.initialSubjectPlans[i].subjectCode;
                            initialSubjectPlansTwo.push(initialSubjectPlanTwo);
                        }

                        if (_vm.initialSubjectPlans[i].subjectType == 3) {
                            var initialSubjectPlanThree = {};
                            initialSubjectPlanThree['subjectCode'] = _vm.initialSubjectPlans[i].subjectCode;
                            initialSubjectPlansThree.push(initialSubjectPlanThree);
                        }
                    }
                }

                if (initialSubjectPlansOne.length == _vm.dataListOne.length) {
                    for (var one = 0; one < initialSubjectPlansOne.length; one++) {
                        var initialOne = initialSubjectPlansOne[one];
                        
                        for (var selectOne = 0; selectOne < _vm.dataListOne.length; selectOne++) {
                            var dataOne = _vm.dataListOne[selectOne];

                            if (initialOne.subjectCode == dataOne.subjectCode) {
                                isSameSubjectOne++;
                            }
                        }
                    }
                }

                if (initialSubjectPlansTwo.length == _vm.dataListTwo.length) {
                    for (var two = 0; two < initialSubjectPlansTwo.length; two++) {
                        var initialTwo = initialSubjectPlansTwo[two];

                        for (var selectTwo = 0; selectTwo < _vm.dataListTwo.length; selectTwo++) {
                            var dataTwo = _vm.dataListTwo[selectTwo];

                            if (initialTwo.subjectCode == dataTwo.subjectCode) {
                                isSameSubjectTwo++;
                            }
                        }
                    }
                }

                if (initialSubjectPlansThree.length == _vm.dataListThree.length) {
                    for (var three = 0; three < initialSubjectPlansThree.length; three++) {
                        var initialThree = initialSubjectPlansThree[three];

                        for (var selectThree = 0; selectThree < _vm.dataListThree.length; selectThree++) {
                            var dataThree = _vm.dataListThree[selectThree];

                            if (initialThree.subjectCode == dataThree.subjectCode) {
                                isSameSubjectThree++;
                            }
                        }
                    }
                }
            }

            if (initialSubjectPlansOne.length == _vm.dataListOne.length && initialSubjectPlansOne.length == isSameSubjectOne && initialSubjectPlansOne.length > 0
                && initialSubjectPlansTwo.length == _vm.dataListTwo.length && initialSubjectPlansTwo.length == isSameSubjectTwo && initialSubjectPlansTwo.length > 0
                && initialSubjectPlansThree.length == _vm.dataListThree.length && initialSubjectPlansThree.length == isSameSubjectThree && initialSubjectPlansThree.length > 0) {
                step = "queryData";
            } else {
                step = "setSubject";
            }

            // 设置会计期间
            _vm.baseData.periodDate = _vm.currentAccountYear + "年第" + _vm.currentAccountPeriod + "期";

            if (step == "setSubject") {
                reconcilePlan.defaultPlan = 1;                         // 是否默认方案 0 否 1 是

                // 如果已经有对账方案，则进行更新
                if (null != _vm.initialReconcilePlans && _vm.initialReconcilePlans != '' && typeof(_vm.currentAccountYear) != undefined) {
                    reconcilePlan.id = _vm.initialReconcilePlans[0].id;
                }

                reconcilePlan.subjectPlans = subjectPlans;                // 科目方案

                $.ajax({
                    url: contextPath + '/financeFaReconcilePlan/setReconcilePlan',
                    method: 'post',
                    dataType: "json",
                    data: JSON.stringify(reconcilePlan),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        /** 初始化科目数据 */
                        //_vm.initialReconcilePlans = [];
                        //_vm.initialSubjectPlans = [];

                        /*_vm.$Modal.success({
                            scrollable: true,
                            content: data.msg,
                        });*/

                        /*_vm.$Modal.error({
                            content: data.msg,
                        });*/
                        _vm.setReconcilePlans = reconcilePlan;
                        _vm.filterModal = false;

                        // 设置完科目，进行对账
                        _vm.initPage();
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else {
                _vm.filterModal = false;

                // 进行对账
                _vm.initPage();
            }
        },
        cancelData () {
            this.filterModal = false;
        },
        saveAccordingData () {

        },
        cancelAccordingData () {
            this.accordingModal = false;
        },
        saveSummaryData () {

        },
        cancelSummaryData () {
            this.summaryModal = false;
        },
        creatVoucher () {
            this.voucherVisible = true;
        },
        printV () {

        },
        exportExcel () {

        },
        exitPrevent(close) {
            this.filterModal = false;

            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }

            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose(){
            return true;
        },
        // 科目下拉框
        showSubjectVisable (type, id) {
            this.subjectVisable = true;
            this.subjectType = type;
            this.subjectTypeId = id;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            var that = this;
            switch (that.subjectType) {
                case 'dataListOne':
                    that.dataListOne.forEach((item) => {
                        if (item.id === that.subjectTypeId) {
                            item.relateSubjectId = treeNode.id;
                            item.subjectCode = treeNode.subjectCode;
                            item.subjectName = treeNode.subjectName;
                        }
                    })
                    break;
                case 'dataListTwo':
                    that.dataListTwo.forEach((item) => {
                        if (item.id === that.subjectTypeId) {
                            item.relateSubjectId = treeNode.id;
                            item.subjectCode = treeNode.subjectCode;
                            item.subjectName = treeNode.subjectName;
                        }
                    })
                    break;
                case 'dataListThree':
                    that.dataListThree.forEach((item) => {
                        if (item.id === that.subjectTypeId) {
                            item.relateSubjectId = treeNode.id;
                            item.subjectCode = treeNode.subjectCode;
                            item.subjectName = treeNode.subjectName;
                        }
                    })
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