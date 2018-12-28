var vm = new Vue({
    el: '#otherReceipts',
    data: {
        deleteVisible: false,
        deleteLoading: true,
        openTime: "",
        // documentTypeList: ,
        // documentTypeList1: ,
        formData: {
            id: 0,
            otherTypesDocuments: getUrlParam("otherTypesDocument"),
            documentType: null,
            documentTypeName: "",
            documentDate: "",
            documentNumber: "",
            idForPrepayment: "",
            occurrenceObjectId: null,
            occurrenceObjectCode: "",
            occurrenceObject: "",
            coinStopId: null,
            coinStop: "",
            exchangeRate: "",
            clearanceAccountId: "",
            clearanceAccount: "",
            receiptPaymentPeriod: "",
            settledAmount: "",
            payableAmountFor: "",
            summary: "",
            voucherId: "",
            voucherSize: "",
            brokerageId: null,
            brokerageCode: "",
            brokerage: "",
            departmentId: null,
            departmentCode: "",
            department: "",
            createId: null,
            createName: "",
            createTime: "",
            updateId: "",
            updateName: "",
            auditorNameId: "",
            auditorName: "",
            auditorDate: "",
            auditStatus: 0,
            isVoucher: 0,
            printingTimes: "",
            accountYear: "",
            accountPeriod: "",
            sobId: null,
            currPage: null,
            totalCount: null,
            occurrenceCode: ""
        },
        formDataInit: {incomeCategorys: [], clearanceAccounts: []},
        tableList: [],
        tabAddNo: '-1', // table  新增行第一列下拉选择值
        ishttpOK: false,
        isSaveAdd: false,
        dateDisabled: false,
        currentSelectRow: '',
        floatNumber: 2, // 小数点位数
        writeIsChange: true,
        addData: {
            lineNumber: -1,
            incomeCategoryId: 0,
            subjectId: "",
            incomeCategoryCode: "",
            incomeCategoryName: "",
            amountPaymentReceivedFor: "",
            amountPaymentReceived: "",
            remark: "",
        },
        a111: "",
        dataList: [
            {
                "name": "收款结算",
                "id": 1,
            },
            {
                "name": "其他应收",
                "id": 2,
            }
        ],
        subjectVisable: false,
    },
    created: function () {
        /* 校验系统是否启用 应收应付系统:2*/
        verifySystem(2);

        let query = getUrlParam("action");
        if (query == 'query') {
            let otherId = Number.parseFloat(getUrlParam("id"));
            if (otherId != null) {
                this.getInfo(otherId);
                return;
            }
        }

        this._ajaxGetFormData();
    },
    watch: {},
    methods: {
        //select onchange js
        selectChange(value, item) {
            // let that = this;
            let find = this.formDataInit.incomeCategorys.find(row => {
                return row.incomeCategoryId == value;
            })
            find && (item.subjectId = find.subjectId)
        },
        // 科目下拉框
        showSubjectVisable() {
            this.subjectVisable = true;
        },
        subjectClose() {
            this.subjectVisable = false;
        },
        subjectData(treeNode) {
            //科目赋值
            this.formData.clearanceAccountId = treeNode.id;
            this.formData.clearanceAccount = treeNode.subjectName;
            // this.formData.discountSubjectCode = treeNode.subjectCode;
        },
        _clearUser() {
            // this.item.subjectId = '';
            this.$refs.sel1.reset();
            this.$refs.sel2.reset();
            // this.$refs.sel3.reset();
            this.$refs.sel4.reset();
            // this.$refs.sel5.reset();
            this.$refs.sel6.reset();
            this.$refs.sel7.reset();
        },
        // currencyChange (item) {
        //     let that = this;
        //     let datas = that.formDataInit.incomeCategorys;
        //     $.each(datas, function (idx, ele) {
        //         if (item == ele.incomeCategoryId) {
        //
        //
        //         }
        //     });
        // },
        getInfo: function (otherId) {
            var that = this;
            let param = {'otherId': otherId};
            let _url = rcContextPath + '/otherPaymentReceipt/info';
            $.ajax({
                type: 'post',
                async: true,
                data: param,
                url: _url,
                dataType: 'json',
                success: function (res) {
                    debugger
                    that.formDataInit = res.data.initList;
                    that.$nextTick(function () {
                        that.formData = res.data.otherPaymentReceipt;
                        that.tableList = res.data.opaymentReceiptList;
                    });
                },
                error: function (code) {
                    // console.log(code);
                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                }
            })
        },
        copyOther: function (copyId) {
            var that = this;
            let _url = '';
            $.ajax({
                type: 'post',
                async: true,
                data: copyId,
                url: _url,
                dataType: 'json',
                success: function (res) {


                },
                error: function (code) {
                    // console.log(code);
                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                }
            })

        },
        outHtml() {
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        print() {
            htPrint();
        },

        dbClick() {
            // this.subjectVisable = true;
        },
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        // 前单、后单
        beforeOrLast: function (nextOrLast) {
            var that = this;
            if (that.ishttpOK == true) return;
            var _url = rcContextPath + '/otherPaymentReceipt/selectInfoByOne';
            //1 后单,2前单
            var currPage = that.formData.currPage;
            var totalCount = that.formData.totalCount;

            if (currPage == null) {
                currPage = 0;
            } else {
                if (nextOrLast == 1) {
                    currPage = currPage - 1;
                } else if (nextOrLast == 2) {
                    currPage = currPage + 1;
                }
            }
            //判断是否为最新单
            if (currPage == totalCount) {
                that.$Message.info({
                    content: "当前单据为第一单",
                    duration: 3
                });
                return;
            } else if (currPage < 0) {
                that.$Message.info({
                    content: "当前单据已为最新单",
                    duration: 3
                });
                return;
            } else {
                that.ishttpOK = true;
                var parame = {
                    "otherTypesDocuments": that.formData.otherTypesDocuments,
                    "id": that.formData.id,
                    "currPage": currPage
                };
                $.ajax({
                    type: 'post',
                    async: true,
                    data: parame,
                    url: _url,
                    dataType: 'json',
                    success: function (res) {
                        var _txt = '';
                        if (res.code === "100100") {
                            _txt = res.msg;
                            //后台返回数据处理
                            that.$nextTick(() => {
                                let data = JSON.parse(res.data);
                                console.log(data)
                                if (data != null) {
                                    that.formData = data.otherPaymentReceipt;
                                    that.tableList = data.opaymentReceiptList;
                                } else {
                                    _txt = '暂无单据';
                                }

                                // that.formDataInit = data.initList;
                            })
                        } else {
                            _txt = res.msg;
                        }
                        that.$Message.info({
                            content: _txt,
                            duration: 3
                        });
                        setTimeout(function () {
                            that.ishttpOK = false;
                        }, 1000)
                    },
                    error: function (code) {
                        // console.log(code);
                        setTimeout(function () {
                            that.ishttpOK = false;
                        }, 1000)
                    }
                })
            }
        },
        // 处理数据
        operateData: function (attr, arr) {
            let find = this.formDataInit[arr].find(row => {
                return this.formData[attr + 'Id'] === row[attr + 'Id'];
            })
            if (find) {
                // Object.assign(this.formData,find);
                this.formData[attr] = find[attr]
                this.formData[attr + 'Id'] = find[attr + 'Id'];
                this.formData[attr + 'Code'] = find[attr + 'Code'];
                return;
            }
            this.formData[attr] = "";
            this.formData[attr + 'Id'] = "";
            this.formData[attr + 'Code'] = "";

        },
        //结算账户
        operateData1(attr) {
            console.log(this.formData)
            let find = this.formDataInit.clearanceAccounts.find(row => {

                return this.formData[attr] === row.subjectId;
            })
            if (find) {
                this.formData.clearanceAccount = find.subjectName;
                this.formData.clearanceAccountId = find.subjectId;
                return;
            }
            this.formData.clearanceAccountId = "";
        },

        //删除
        // deleteById: function () {
        //     debugger
        //     _url = '../../../otherPaymentReceipt/deleteById'
        //     _parame = {"id": this.formData.id, "auditStatus": this.formData.auditStatus}
        //     $.ajax({
        //         type: 'post',
        //         async: true,
        //         data: _parame,
        //         url: _url,
        //         dataType: 'json',
        //         success: function (d) {
        //             var _txt = '';
        //             if (d.code === '100100') {
        //                 _txt='删除成功';
        //                 that.writeIsChange = false;
        //                 //this.queryById(d.data.id);
        //             } else {
        //                 _txt = '删除失败';
        //             }
        //             that.$Message.info({
        //                 content: _txt,
        //                 duration: 3
        //             });
        //         },
        //         error: function (code) {
        //             // console.log(code);
        //             setTimeout(function () {
        //                 that.ishttpOK = false;
        //             }, 1000)
        //         }
        //     })
        // },

        // //点击保存
        preserve: function () {
            if (!this.writeIsChange) {
                this.$Message.info({
                    content: '请点击修改。',
                    duration: 3
                });
                return;
            }
            var that = this;
            var _bool = false, _msg = '请填写必填项。';
            if (!this.formData.occurrenceObjectId) {
                _bool = true;
                _msg = `请选择${this.formData.otherTypesDocuments == 1 ? '客户' : '供应商'}`;
            } else if (!this.formData.documentDate) {
                _bool = true;
                _msg = '请选择单据日期';
            } else if (!this.formData.documentNumber) {
                _bool = true;
                _msg = '请选择单据号';
            } else if (!this.formData.clearanceAccountId) {
                _bool = true;
                _msg = '请选择结算账户';
            }
            console.log(this.tableList, '=== this.tableList');
            this.tableList.map(row => {
                if (!row.incomeCategoryId) {
                    _bool = true;
                    _msg = `表格第${row.lineNumber}行${this.formData.otherTypesDocuments == 1 ? '收入类别' : '支出类别'}未选择`;
                } else if (!row.amountPaymentReceivedFor || row.amountPaymentReceivedFor === "0" || row.amountPaymentReceivedFor === "0.00") {
                    _bool = true;
                    _msg = `表格第${row.lineNumber}行未输入收款金额`;
                } else if (row.subjectId == this.formData.clearanceAccountId) {
                    _bool = true;
                    _msg = `表格第${row.lineNumber}行${this.formData.otherTypesDocuments == 1 ? '收入类别' : '支出类别'}与结算账户相同`;
                }

                var _find = that.formDataInit.incomeCategorys.find(x => x.incomeCategoryId == row.incomeCategoryId);
                _find && (row.subjectId = _find.subjectId, row.genrePaymentsReceived = _find.genrePaymentsReceived, row.incomeCategoryName = _find.incomeCategoryName, row.incomeCategoryCode = _find.incomeCategoryCode);
            })
            if (_bool) {
                this.$Message.info({
                    content: _msg,
                    duration: 3
                });
                return;
            }
            //将本位币字符串 -> number 类型
            var currId = that.formData.id;
            let docType = getUrlParam("otherTypesDocument");
            let chekType = that.formData.documentType;
            let typeName = '';
            var _url = '';
            console.log(accounting.unformat(that.formData.payableAmountFor), '====that.formData.payableAmountFor')
            that.formData.payableAmountFor = accounting.unformat(that.formData.payableAmountFor);
            if (docType == "1") {
                if (chekType == 1) {
                    typeName = "其他应收";
                } else {
                    typeName = "收款结算"
                }
            } else if (docType == "2") {
                if (chekType == 1) {
                    typeName = "其他应付";
                } else {
                    typeName = "付款结算";
                }
            }
            that.formData.documentTypeName = typeName;
            var parame = {"otherPaymentReceipt": that.formData, "opaymentReceiptList": that.tableList};
            //执行保存
            if (currId == null || currId == 0) {
                _url = rcContextPath + '/otherPaymentReceipt/save';
            } else {
                _url = rcContextPath + '/otherPaymentReceipt/update';
            }
            if (that.ishttpOK == true) return;
            that.ishttpOK = true;
            $.ajax({
                type: 'post',
                async: true,
                data: JSON.stringify(parame),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (d) {
                    var _txt = '';
                    if (d.code === '100100') {
                        _txt = d.msg;
                        console.log(d, '=== save d');
                        let data = JSON.parse(d.data);
                        // that.clearUser();
                        that.formData = data.otherPaymentReceipt;
                        that.tableList = data.opaymentReceiptList;
                        that.ishttpOK = false;
                        that.writeIsChange = false;
                        //this.queryById(d.data.id);
                    } else {
                        _txt = d.msg;
                    }
                    let lenth = that.tableList.length + 10;
                    // for (var i = 10; i < lenth; i++) {
                    //     that.$refs['sel' + i].reset();
                    // }

                    // that._clearUser();
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });
                    // 保存后自动新增
                    if (that.isSaveAdd) {
                        // window.location.reload()
                        that._clearUser();
                        that._ajaxGetFormData();
                        that.writeIsChange = true;
                    }

                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                },
                error: function (code) {
                    // console.log(code);
                    setTimeout(function () {
                        that.ishttpOK = true;
                    }, 1000)
                }
            })
        },
        filterMethod: function (value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        receivedNum(row) {
            let num = formatNum(row.amountPaymentReceivedFor, 1) * this.formData.exchangeRate;
            row.amountPaymentReceived = num.toFixed(this.floatNumber);
            num = accounting.formatMoney(num, "", this.floatNumber);
            return num == '0.00' ? '' : num;
        },
        AddreceivedNum() {
            let num = formatNum(this.addData.amountPaymentReceivedFor, 1) * this.formData.exchangeRate;
            this.addData.amountPaymentReceived = num.toFixed(this.floatNumber);
            num = accounting.formatMoney(num, "", this.floatNumber);
            return num == '0.00' ? '' : num;
        },
        // 表格添加数据
        addDataMethod() {
            this.addData.lineNumber = this.tableList.length + 1;
            let find = this.formDataInit.incomeCategorys.find(row => {
                return row.incomeCategoryId === this.addData.incomeCategoryId
            });
            if (find) {
                Object.assign(this.addData, find);
            }
            this.tableList.push(this.addData);
            this.addData = {
                lineNumber: -1,
                incomeCategoryId: 0,
                subjectId: "",
                incomeCategoryCode: "",
                incomeCategoryName: "",
                amountPaymentReceivedFor: 0.00,
                amountPaymentReceived: "",
                remark: "",
            }
        },
        // 表格删除数据
        del(index) {
            this.tableList.splice(index, 1)
        },
        // 请求数据
        _ajaxGetFormData: function () {
            var that = this;
            var _url = rcContextPath + '/otherPaymentReceipt/initPage';
            var data = {
                "otherTypesDocuments": getUrlParam("otherTypesDocument"),
            }
            //清空
            // that.clearUser();
            $.ajax({
                type: 'POST',
                async: true,
                data: data,
                url: _url,
                dataType: 'json',
                success: function (res) {
                    let resData = res.data;
                    if (resData != null) {
                        let data = JSON.parse(resData);
                        let today = new Date();
                        that.formDataInit = data.initList;
                        console.log(data);
                        that.$nextTick(function () {
                            that.formData = data.otherPaymentReceipt;
                            that.tableList = data.opaymentReceiptList;
                            that.tableList[0].lineNumber = 1;
                            that.formData.otherTypesDocuments = getUrlParam("otherTypesDocument");
                            // that.formData.documentDate = today;
                            // that.formData.receiptPaymentPeriod = today;
                            that.formData.id = 0;
                            that.formData.auditStatus = 1;

                            that.$refs.selTable0 && that.$refs.selTable0[0].reset();
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        receivedForChange: function (row) {
            let num = formatNum(row.amountPaymentReceivedFor, 1);
            row.amountPaymentReceivedFor = num.toFixed(this.floatNumber);
        },
        addreceivedForChange: function () {
            let num = formatNum(this.addData.amountPaymentReceivedFor, 1);
            this.addData.amountPaymentReceivedFor = num.toFixed(this.floatNumber);
        },
        clickTr: function (item) {
            this.currentSelectRow = item.lineNumber;
        },
        // 操作按钮
        actionBtnMth: function (type) {
            var _bool = false, _msg = '';
            var that = this;
            let judgeId = that.formData.id;
            let _url = '', _parame = {};
            switch (type) {
                case 'addNew':
                    // that.clearFormData();
                    that.writeIsChange = true;
                    that._clearUser();
                    that._ajaxGetFormData();
                    // window.location.reload();
                    break;
                case 'delete':
                    //新增页面不能删除

                    if (judgeId == 0 || judgeId == null) {
                        that.$Message.info({
                            content: "新增页面,不能执行删除操作",
                            duration: 3
                        });
                        return;
                    }

                    this.deleteVisible = true;
                    break;
                case 'examine':
                    var examineId = this.formData.id
                    if (examineId == null || examineId == '') {
                        that.$Message.info({
                            content: '没有单据不能执行审核',
                            duration: 3
                        });
                        return;
                    }
                    _url = rcContextPath + '/otherPaymentReceipt/executeAudit'
                    // _parame = { "id": this.formData.id, "auditStatus": this.formData.auditStatus }
                    _parame = {"id": this.formData.id, "auditStatus": this.formData.auditStatus}
                    this.auditAction(_url, _parame, 2);
                    break;
                case 'edit':
                    if (judgeId == 0 || judgeId == null) {
                        that.$Message.info({
                            content: "新增页面,不能执行修改操作",
                            duration: 3
                        });
                        return;
                    }
                    this.writeIsChange = true;
                    break;
                case 'noexamine':
                    _url = rcContextPath + '/otherPaymentReceipt/reverseAudit'
                    _parame = {"id": this.formData.id, "auditStatus": this.formData.auditStatus}
                    this.auditAction(_url, _parame, 1);
                    break;
                case 'source':
                    break;
                default:
                    break;
            }
        },
        auditAction(_url, _parame, value) {
            var that = this;
            $.ajax({
                type: 'post',
                async: true,
                data: _parame,
                url: _url,
                dataType: 'json',
                success: function (d) {
                    let currenPage = that.formData.currPage;
                    let totalCount = that.formData.totalCount;
                    if (d.code === "100100") {
                        that.formData = d.data.otherPaymentReceipt;
                        that.formData.currPage = currenPage;
                        that.formData.totalCount = totalCount;
                        that.tableList = d.data.opaymentReceiptList;
                        let au = that.formData.auditorDate;
                        that.formData.auditStatus = value;
                        if (au != null) {
                            that.formData.auditorDate = au.slice(0, 10);
                        }
                    }
                    that.$Message.info({
                        content: d.msg,
                        duration: 3
                    });
                }
            })
        },
        deleteOK: function () {
            var that = this;
            // 这里执行删除接口 ，并重新请求数据
            let status = that.formData.auditStatus;
            if (status == 2) {
                that.deleteVisible = false;
                that.$Message.info({
                    content: "已审核不能删除该单据",
                    duration: 3
                });
                return;
            }
            _url = rcContextPath + '/otherPaymentReceipt/deleteById'
            _parame = {"id": this.formData.id, "auditStatus": this.formData.auditStatus}
            $.ajax({
                type: 'post',
                async: true,
                data: _parame,
                url: _url,
                dataType: 'json',
                success: function (d) {
                    if (d.code === '100100') {
                        setTimeout(function () {
                            this.tableList = this.tableList.filter(function (item) {
                                return item.tab1 !== that.currentSelectRow;
                            });
                            that.currentSelectRow = '';
                            that.$Message.info({
                                content: '删除成功',
                                duration: 3
                            });
                        }, 2000);
                        that.$nextTick(function () {
                            that.deleteVisible = false;
                            that.writeIsChange = false;
                            that.beforeOrLast();
                        })
                    } else {
                        setTimeout(function () {
                            this.tableList = this.tableList.filter(function (item) {
                                return item.tab1 !== that.currentSelectRow;
                            });
                            that.currentSelectRow = '';
                            //关闭弹框
                            that.deleteVisible = false;
                            that.$Message.info({
                                content: '删除失败',
                                duration: 3
                            });
                        }, 2000)
                    }
                },
                error: function (code) {
                    setTimeout(function () {
                        that.ishttpOK = true;
                    }, 1000)
                }
            })
        },
        clearFormData: function () {	// 清空数据
            this.formData = {};
            this.formDataInit = {
                // "customers":[],
                // "currencys":[],
                // "incomeCategorys":[],
                // "brokerages":[],
                // "departments":[],
                // "clearanceAccounts":[]
            };
            this.tableList = [];
            let today = new Date();
            this.formData.documentDate = today;
            this.formData.receiptPaymentPeriod = today;
            this.writeIsChange = true;
            this.ishttpOK = false;
        },
        voucherAction: function (type) {	// 查看凭证和生成凭证
            var that = this;
            let _voucherId = that.formData.voucherId;
            let _sobId = that.formData.sobId;
            var _url = '', _parame = {"paramVOS": []};
            let _id = {'id': that.formData.id};
            _parame.paramVOS.push(_id);
            if (type === 'showVoucher') {
                let _name = '记账凭证'
                _url = rcContextPath + '/finance/voucher-lrt/index.html?voucherId=' + _voucherId + '&sobId=' + _sobId;
                window.parent.activeEvent({'name': _name, 'url': _url});
            } else if (type === 'addVoucher') {
                _url = rcContextPath + '/otherPaymentReceipt/createVoucher?handle=false';
            }
            $.ajax({
                type: 'post',
                async: true,
                data: JSON.stringify(_parame),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (d) {
                    var _txt = '';
                    if (d.code === '100100') {
                        _txt = '操作失败';
                        let v = d.data.vses.length;
                        if (v != 0) {
                            _txt = d.msg;
                            that.formData = (d.data.vses.length && d.data.vses[0]);
                            that.formData.isVoucher = 2;
                        }
                    } else {
                        _txt = d.msg;
                    }
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });
                }
            })
        },
        changeCurrency: function (attr, arr) { // 切换币种，汇率自动变
            let find = this.formDataInit.currencys.find((item) => {
                // console.log(item.coinStopId ,id)
                //   return item.coinStopId === id;
                return item.coinStopId === this.formData[attr + 'Id'];
            });
            find && (this.formData.exchangeRate = find.exchangeRate);
            this.operateData(attr, arr);
        },
        optionAction: function (type) {
            if (type === 'saveAdd') {
                this.isSaveAdd = !this.isSaveAdd;

            }
        },
    },
    computed: {
        totalReceivedFor() {
            let total = 0;
            this.tableList.forEach(row => {
                total += formatNum(row.amountPaymentReceivedFor, 1);
            })
            total = accounting.formatMoney(total, "", this.floatNumber);
            this.formData.payableAmountFor = total;
            return total ? total : 0;
        },
        totalReceived() {
            let total = 0;
            this.tableList.forEach(row => {
                total += formatNum(row.amountPaymentReceived, 1);
            })
            total = accounting.formatMoney(total, "", this.floatNumber);
            // console.log(total)
            return total ? total : 0;
        },
        deleteisDisabled() {	// delete 是否可用
            return (this.formData.isVoucher === 2 || this.formData.auditStatus === 2);
        },
        editisDisabled() {	// 修改 是否可用
            return (this.formData.isVoucher === 2 || this.formData.auditStatus === 2);
        },
        voucherisDisabled() {// 生成凭证 是否可用
            return (this.formData.id === 0 || this.formData.auditStatus === 1 || this.formData.isVoucher === 0 || this.formData.isVoucher === 2);
        },
        showVoucherDisabled() {	// 查看凭证 是否可用 auditStatus
            return (this.formData.id === 0 || this.formData.auditStatus === 1 || this.formData.isVoucher === 0 || this.formData.isVoucher === 1);
        },
        examineisDisabled() {	// 审核 是否可用 auditStatus
            return (this.formData.id === 0 || this.formData.auditStatus === 0 || this.formData.auditStatus === 2);
            // return false;
        },
        noexamineisDisabled() {	// 反审核 是否可用
            return (this.formData.id === 0 || this.formData.auditStatus === 0 || this.formData.auditStatus === 1 || this.formData.isVoucher === 2);
            // return false;
        },
        selecteBefore() {//前单 是否可用
            return (this.formData.currPage === (this.formData.totalCount - 1));
            // return (0<this.formData.currPage && this.formData.currPage<=(this.formData.totalCount-1));
        },
        selecteAfter() {//后单 是否可用
            // return (this.formData.currPage <= 0 || this.formData.currPage === (this.formData.totalCount - 1));
            return (this.formData.currPage > (this.formData.totalCount - 1) );
        },
        isDisabled() {	// 保存 是否可用
            let _bool = false;
            if (!this.writeIsChange || this.formData.auditStatus === 2) {
                _bool = true;
            }
            return _bool;
        },
        list() {
            let arr = [];
            this.dataList.forEach(row => {
                let status = typeof row;
                if (status === 'object') {
                    arr.push(row.name)
                } else {
                    arr.push(row)
                }
            })
            return arr
        },
        documentTypeList() {
            let arr = []
            if (Number(this.formData.otherTypesDocuments) === 1) {
                arr = [
                    {
                        "label": "收款结算",
                        "value": 2,
                    },
                    {
                        "label": "其他应收",
                        "value": 1,
                    }
                ]
            } else {
                arr = [
                    {
                        "label": "付款结算",
                        "value": 2,
                    },
                    {
                        "label": "其他应付",
                        "value": 1,
                    }
                ]
            }
            return arr;
        }
    },
    filters: {
        filterMoney(value) {
            return accounting.formatMoney(value, "", this.floatNumber)
        },
        filterTitle(value) {
            return Number(value) === 1 ? '其他收款单' : '其他付款单'
        }
    },
    mounted() {
        // this.formData.otherTypesDocuments = getUrlParam("othertypesdocument")
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
})
